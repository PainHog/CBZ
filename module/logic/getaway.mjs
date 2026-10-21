/**
 * NINE LIVES GANG — the getaway (pure)
 * -----------------------------------
 * Ch 9 "The Getaway" (core rules v0.10 draft; the simulator's package P12,
 * sim/engine.mjs finishWithGetaway). When the house part of the robbery ends,
 * any cat still inside is pinched; everyone else runs a route of four
 * obstacles to the hideout with the loot in pieces, the animal warden coming
 * up behind.
 *
 * State (`s.getaway`, while `s.phase === "getaway"`):
 *   { round, stage: "run"|"cornered", route: [{ name, opts, pet? }], arrives, warden: null|space,
 *     catches, cats: { [catId]: { pos, carry, state: "running"|"home"|"pinched", acted, where } },
 *     drops: [pieces lying on space 0…3], cornered: [catId], flopped, loot: { total, safe, start, left }, houseEnd }
 * Spaces: a cat on space k is in front of obstacle k (0–3); getting over obstacle 3 is the hideout.
 * The warden stands on a space (null: still on the way). Every function takes a
 * state and returns { state, events, … } with a NEW state; `ctx.getaway` false
 * (the autoGetaway setting off) means rolls and the warden move nothing: the
 * Storyteller moves everyone by hand (placeRunner, setWarden).
 */
import { CATB } from "../config.mjs";
import { hasKnack, knackInstincts, works } from "./rules.mjs";
import { lootOf, carryCap, robberyOutcome, OUTCOME_LABEL } from "./prize.mjs";

const R = CATB.rules;
const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const catOf = (s, id) => (s.cats ?? []).find(c => c.id === id) ?? null;
const LOG_CAP = 200;
const log = (s, ev) => { for (const e of ev) if (e?.text) s.log.push({ round: s.round, type: e.type, text: e.text }); if (s.log.length > LOG_CAP) s.log.splice(0, s.log.length - LOG_CAP); };
const applied = (s, id) => { if (!id) return; (s.applied ??= []).includes(id) || s.applied.push(id); };
const names = list => (list.length > 1 ? `${list.slice(0, -1).map(c => c.name).join(", ")} and ${list.at(-1).name}` : list[0]?.name ?? "");

/** A route for a house that prints none (Ch 9 "A route for your own house"; the simulator's default). */
export const DEFAULT_ROUTE = Object.freeze([
  { name: "the back fence", opts: [["savage", 0, "climb"], ["sneaky", 0, "climb"]] },
  { name: "next door's garden", opts: [["sneaky", 0, "hide"], ["savage", 0, "chase"]] },
  { name: "the alley wall", opts: [["savage", 1, "climb"], ["sneaky", 1, "climb"]] },
  { name: "the road", opts: [["streetwise", 0], ["savage", 0, "chase"]] }
]);
/** Ch 9 "Cornered": dodge with Sneaky (slip between their boots), Savage (bolt) or Sweet ("I'm somebody's cat!"), plain. */
export const DODGE = Object.freeze([["sneaky", R.dodgeDiff, "hide"], ["savage", R.dodgeDiff, "chase"], ["sweet", R.dodgeDiff, "charm"]]);

/** Ch 9 "Running with the loot": a cat carrying loot loses 1 die — a Chonky cat carrying a single piece doesn't. */
export const lootDie = (c, carry) => (carry > (c?.body === "chonky" ? 1 : 0) ? 1 : 0);

export const inGetaway = s => s?.phase === "getaway" && !!s.getaway;
const runner = (s, id) => s.getaway?.cats?.[id] ?? null;
const running = s => Object.entries(s.getaway.cats).filter(([, r]) => r.state === "running").map(([id]) => id);
const spaceName = (g, pos) => (pos >= g.route.length ? "the hideout" : pos === 0 ? "the garden" : `the far side of ${g.route[pos - 1].name}`);

/**
 * Ch 8 / Ch 9: the house part is over — the getaway starts. Cats still inside
 * (held, shut in, free) are pinched; every other cat starts at space 0 with its
 * share of the loot (one piece each, two for a Chonky cat; Chonky cats first, as
 * the simulator shares; what nobody can carry is left lying in the garden). The
 * warden arrives at the end of round 1 if any cat was Shooed or Scooped tonight,
 * else at the end of round 2.
 */
export function startGetaway(state, reason = "manual", house = null) {
  const s = clone(state);
  const ev = [];
  const route = (house?.getaway ?? s.getawayRoute ?? DEFAULT_ROUTE).map(o => ({ name: o.name, opts: o.opts.map(x => [...x]), pet: o.pet ?? 0 }));
  const catches = (s.moodLedger ?? []).filter(e => e.kind === "trigger" && !e.pending && !e.rejected).length;
  const { total, safe, pieces } = lootOf(s);
  const cats = {};
  const pinched = [];
  for (const c of s.cats) {
    if (c.status === "outside") cats[c.id] = { pos: 0, carry: 0, state: "running", acted: false, where: null };
    else { cats[c.id] = { pos: 0, carry: 0, state: "pinched", acted: true, where: "house" }; pinched.push(c); }
  }
  for (const h of s.humans ?? []) h.holding = null; // the warden carries a held cat out to the van
  let left = pieces;
  for (const c of [...s.cats].filter(x => cats[x.id].state === "running").sort((a, b) => (b.body === "chonky") - (a.body === "chonky"))) {
    const take = Math.min(left, carryCap(c));
    cats[c.id].carry = take;
    left -= take;
  }
  s.getaway = { round: 1, stage: "run", route, arrives: catches ? 1 : 1 + R.wardenLag, warden: null, catches, cats,
    drops: route.map((_, i) => (i === 0 ? left : 0)), cornered: [], flopped: false, loot: { total, safe, start: pieces, left }, houseEnd: reason };
  s.phase = "getaway";
  s.stage = "getaway";
  s.temptation = null; s.pendingTrigger = null; s.help = {};
  const run = s.cats.filter(c => cats[c.id].state === "running");
  ev.push({ type: "getawayStart", text: `Leg it! The getaway starts: ${route.map(o => o.name).join(", ")}, then the hideout.` });
  if (pinched.length) ev.push({ type: "pinched", cats: pinched.map(c => c.id), text: `${names(pinched)} ${pinched.length > 1 ? "are" : "is"} still inside: pinched! The warden will collect ${pinched.length > 1 ? "them" : "it"} at the door.` });
  const z = s.prize;
  if (pieces) {
    const shares = run.filter(c => cats[c.id].carry).map(c => `${c.name} ${cats[c.id].carry > 1 ? `${cats[c.id].carry} pieces` : "1 piece"}`);
    ev.push({ type: "loot", text: `The loot: the ${z.name} in ${pieces} piece${pieces > 1 ? "s" : ""}${shares.length ? ` — ${shares.join(", ")}` : ""}${left ? `; ${left} left lying in the garden` : ""}.${safe ? ` (${safe} portion${safe > 1 ? "s" : ""} already safe inside a cat.)` : ""}` });
  } else ev.push({ type: "loot", text: safe ? `No loot to carry: ${safe} portion${safe > 1 ? "s" : ""} of the ${z.name} already safe inside a cat.` : `No loot to carry: the ${z.name} never left the house.` });
  ev.push({ type: "warden", text: s.getaway.arrives === 1 ? "Somebody was Shooed or Scooped tonight: the van pulls up at the end of round 1." : "Nobody was caught tonight, so the humans take their time: the van pulls up at the end of round 2." });
  if (!run.length) return finished(s, ev);
  ev.push({ type: "getawayRound", text: "Getaway round 1: over the first obstacle, help a friend, or grab a dropped piece." });
  log(s, ev);
  return { state: s, events: ev, outcome: null };
}

/* ------------------------------------------------------------ options -- */

/**
 * What a cat can do in the getaway now (the same shape as actions.catOptions):
 * `over` (a roll: the next obstacle's roll, −1 die carrying loot unless a Chonky
 * cat with one piece; the obstacle's pet takes its rating), `gdrop` (drop a piece
 * here on purpose — before rolling, to lose the die; no turn used), `gpick` (pick
 * up a dropped piece here instead of going on), and when cornered `dodge` (a roll).
 */
export function getawayOptions(state, catId) {
  const s = state;
  const c = catOf(s, catId);
  const out = { cat: c, room: null, seen: [], blockedBy: null, options: [], helpTargets: [], getaway: true };
  const g = s.getaway;
  const r = c ? runner(s, catId) : null;
  if (!c || !inGetaway(s) || !r) return out;
  const opt = o => out.options.push({ uses: [], roll: null, group: false, simple: false, disabled: null, room: null, ...o });
  if (r.state !== "running") return out;
  if (g.stage === "cornered") {
    if (g.cornered.includes(catId)) opt({ id: "dodge", kind: "dodge", label: "Dodge the warden! (Sneaky, Savage or Sweet, plain)", uses: ["action"], roll: { options: DODGE.map(o => [...o]) } });
    return out;
  }
  const done = r.acted ? "already went this getaway round" : null;
  const ob = g.route[r.pos];
  const die = lootDie(c, r.carry);
  const home = r.pos === g.route.length - 1;
  opt({ id: "over", kind: "over", label: `Over ${ob.name}${home ? ", and home to the hideout" : ""}${die ? " (carrying loot: −1 die)" : ""}${ob.pet ? ` (it takes ${ob.pet} ${ob.pet > 1 ? "dice" : "die"} off)` : ""}`,
    uses: ["action"], group: true, roll: { options: ob.opts.map(([a, d, ...t]) => [a, d + die, ...t]), opposition: ob.pet ?? 0, diffLabel: die ? "carrying loot −1" : null }, disabled: done });
  if (r.carry > 0) opt({ id: "gdrop", kind: "gdrop", label: `Drop a piece of loot here${die ? " (no loot die for the next roll)" : ""}`, uses: [] });
  if ((g.drops[r.pos] ?? 0) > 0 && r.carry < carryCap(c)) opt({ id: "gpick", kind: "gpick", label: `Grab a dropped piece (${g.drops[r.pos]} here) instead of going on`, uses: ["action"], disabled: done });
  out.helpTargets = getawayHelpTargets(s, c);
  return out;
}

/** The gang mates this cat could help: running cats on its space that haven't gone this round. */
export function getawayHelpTargets(s, c) {
  const r = runner(s, c?.id);
  if (!r || r.state !== "running" || r.acted || s.getaway.stage !== "run") return [];
  return s.cats.filter(x => x.id !== c.id && runner(s, x.id)?.state === "running" && runner(s, x.id).pos === r.pos && !runner(s, x.id).acted)
    .map(x => ({ id: x.id, name: x.name, queued: s.help?.[c.id] === x.id }));
}

/** Who could help (and go over with) this cat: running cats on its space that haven't gone this round. */
export function getawayHelpers(s, c, option) {
  if (option?.kind !== "over") return [];
  const r = runner(s, c.id);
  return s.cats.filter(x => x.id !== c.id && runner(s, x.id)?.state === "running" && runner(s, x.id).pos === r?.pos && !runner(s, x.id).acted);
}

/** Everything the roll dialog needs (the shape of actions.rollContext). Nobody watches out here: no Attention, no Mood. */
export function getawayRollContext(state, catId, optionId) {
  const s = state;
  const c = catOf(s, catId);
  const o = getawayOptions(s, catId).options.find(x => x.id === optionId && x.roll);
  if (!c || !o) return null;
  const queued = Object.entries(s.help ?? {}).filter(([, t]) => t === c.id).map(([h]) => h);
  return {
    option: o, cat: c, room: null, roomName: "the getaway",
    options: o.roll.options.map(([approach, difficulty = 0, ...tags]) => ({
      approach, label: CATB.approaches[approach]?.label ?? approach, difficulty, tags,
      knack: hasKnack(c.instincts, tags), knackFrom: knackInstincts(c.instincts, tags).map(i => CATB.instincts[i].label),
      rating: c.r?.[approach] ?? 0, attention: 0
    })),
    opposition: o.roll.opposition ?? 0, bodyDie: false, diffLabel: o.roll.diffLabel ?? null,
    seenBy: [], seenNames: [], attention: 0, kid: false,
    helpers: getawayHelpers(s, c, o).map(x => ({ id: x.id, name: x.name, locked: false, queued: queued.includes(x.id), note: "goes over with them" })),
    autoHelpers: false, getaway: true
  };
}

/* ------------------------------------------------------------ doing it -- */

/**
 * Apply a final getaway roll card. Over: it works — the leader and up to two
 * helpers go onto the next space (past the fourth obstacle: home); a Flop — all
 * stuck, every carrier in the group drops a piece on that space, and the warden
 * will move two spaces this round. Dodge: it works — the cat bolts to the space
 * just ahead of the warden; a Flop — pinched, loot and all. Getaway rolls fill no
 * meters; a Purrfect still earns 1 Cattitude. MUTATES nothing: returns a new state.
 */
export function applyGetawayRoll(state, card, ctx = {}) {
  if ((state.applied ?? []).includes(card.eventId)) return { state, events: [], cattitude: [], skipped: true };
  const s = clone(state);
  const ev = [];
  const cattitude = card.result === "purrfect" ? [{ catId: card.catId, delta: +1, why: "a Purrfect" }] : [];
  applied(s, card.eventId);
  const g = s.getaway;
  const c = catOf(s, card.catId);
  const r = runner(s, card.catId);
  const ok = works(card.result);
  const o = c ? getawayOptions(state, card.catId).options.find(x => x.id === card.optionId) : null;
  ev.push({ type: "roll", cat: card.catId, result: card.result,
    text: `${c?.name ?? "A cat"}${o ? ` — ${o.label}` : ""}: ${CATB.approaches[card.approach]?.label ?? card.approach}, ${CATB.results[card.result]?.label ?? card.result}.` });
  if (!c || !r || !o || o.disabled) {
    ev.push({ type: "stale", text: `(${c?.name ?? "A cat"}'s getaway roll doesn't fit the chase as it is now: the Storyteller moves things by hand.)` });
    log(s, ev);
    return { state: s, events: ev, cattitude, ok };
  }
  if (ctx.getaway === false) {
    r.acted = true;
    ev.push({ type: "getawayManual", text: `${c.name}: ${CATB.results[card.result]?.label ?? card.result} — the Storyteller moves the gang by hand (the getaway automation is off).` });
    log(s, ev);
    return { state: s, events: ev, cattitude, ok };
  }
  if (o.kind === "over") {
    const ob = g.route[r.pos];
    const helpers = (card.helpers ?? []).map(id => catOf(s, id)).filter(x => x && runner(s, x.id)?.state === "running" && runner(s, x.id).pos === r.pos && !runner(s, x.id).acted).slice(0, R.getawayHelpers);
    const group = [c, ...helpers];
    for (const x of group) runner(s, x.id).acted = true;
    for (const id of card.helpers ?? []) delete s.help?.[id];
    if (ok) {
      const to = r.pos + 1;
      for (const x of group) { const rx = runner(s, x.id); rx.pos = to; if (to >= g.route.length) rx.state = "home"; }
      const home = to >= g.route.length;
      ev.push({ type: home ? "home" : "over", cats: group.map(x => x.id),
        text: `${names(group)} ${group.length > 1 ? "get" : "gets"} over ${ob.name}${home ? ` — and ${group.length > 1 ? "they're" : "it's"} home in the hideout!` : "."}` });
    } else {
      g.flopped = true;
      const carriers = group.filter(x => runner(s, x.id).carry > 0);
      for (const x of carriers) { runner(s, x.id).carry -= 1; g.drops[r.pos] = (g.drops[r.pos] ?? 0) + 1; }
      const dropText = !carriers.length ? "" : group.length === 1 ? ", and drops a piece of loot in the scramble" : `, and ${names(carriers)} ${carriers.length > 1 ? "each drop" : "drops"} a piece of loot in the scramble`;
      ev.push({ type: "stuck", cats: group.map(x => x.id), text: `Flop! ${names(group)} ${group.length > 1 ? "are" : "is"} stuck at ${ob.name} this round${dropText}. ${g.warden === null ? "What a racket!" : "The racket gives the gang away: the warden comes on two spaces this round."}` });
    }
  } else if (o.kind === "dodge") {
    g.cornered = g.cornered.filter(id => id !== c.id);
    if (ok) {
      r.pos = (g.warden ?? -1) + 1;
      if (r.pos >= g.route.length) r.state = "home";
      ev.push({ type: r.state === "home" ? "home" : "dodged", cats: [c.id], text: `${c.name} slips between the warden's boots and bolts on${r.state === "home" ? " — all the way home!" : ` to ${spaceName(g, r.pos)}`}.` });
    } else {
      const lost = r.carry;
      r.state = "pinched"; r.where = "route"; r.carry = 0;
      ev.push({ type: "pinched", cats: [c.id], text: `Pinched! The warden's net comes down on ${c.name}${lost ? `, loot and all (${lost} piece${lost > 1 ? "s" : ""})` : ""}. Into the van it goes.` });
    }
    if (!g.cornered.length) return nextRound(s, ev);
  }
  return settle(s, ev, cattitude, ok);
}

/** A getaway action with no roll: drop a piece on purpose (free), or pick a dropped one up (the cat's go). */
export function doGetawayAction(state, catId, optionId, args = {}) {
  const s = clone(state);
  const ev = [];
  const c = catOf(s, catId);
  const o = getawayOptions(state, catId).options.find(x => x.id === optionId);
  if (!c || !o) throw new Error(`${c?.name ?? "That cat"} can't do that now.`);
  if (o.disabled && !args.force) throw new Error(`${c.name} can't: ${o.disabled}.`);
  if (o.roll && !args.force) throw new Error(`${o.label}: that needs a roll.`);
  const g = s.getaway;
  const r = runner(s, catId);
  if (o.kind === "gdrop") {
    r.carry -= 1; g.drops[r.pos] = (g.drops[r.pos] ?? 0) + 1;
    ev.push({ type: "dropped", cats: [c.id], text: `${c.name} drops a piece of loot on purpose — lighter paws! It lies at ${spaceName(g, r.pos)} for a friend to grab (if the warden doesn't get there first).` });
  } else if (o.kind === "gpick") {
    r.carry += 1; g.drops[r.pos] -= 1; r.acted = true;
    ev.push({ type: "picked", cats: [c.id], text: `${c.name} grabs a dropped piece of loot.` });
  }
  return settle(s, ev, [], true);
}

/** Log, and finish if every cat is home or pinched. */
function settle(s, ev, cattitude = [], ok = true) {
  if (!running(s).length) return { ...finished(s, ev), cattitude, ok };
  log(s, ev);
  return { state: s, events: ev, cattitude, ok, outcome: null };
}

/**
 * The end of a getaway round (Ch 9): the warden — the van pulls up at the end
 * of round 1 (round 2 if nobody was Shooed or Scooped tonight), then the
 * warden moves one space a round, two if any cat Flopped this round (never past
 * the last obstacle). Loot lying on or behind the warden's space is gone. Then
 * cornered cats — on or behind the warden's space — must dodge (their players
 * roll; the round waits). With ctx.getaway false only the round moves on.
 */
export function endGetawayRound(state, ctx = {}) {
  if (!inGetaway(state)) throw new Error("There is no getaway running.");
  if (state.getaway.stage === "cornered") throw new Error("The cornered cats dodge first.");
  const s = clone(state);
  const g = s.getaway;
  const ev = [{ type: "getawayTurn", text: `The end of getaway round ${g.round}.` }];
  if (ctx.getaway === false) {
    ev.push({ type: "getawayManual", text: "The Storyteller moves the warden by hand (the getaway automation is off)." });
    return nextRound(s, ev);
  }
  const last = g.route.length - 1;
  if (g.warden === null) {
    if (g.round >= g.arrives) {
      g.warden = 0;
      ev.push({ type: "warden", text: "Screeeech! The animal control van pulls up at the house, and the warden jumps out into the garden, net at the ready." });
    } else ev.push({ type: "warden", text: "Somewhere a van is on its way… (it pulls up at the end of next round)." });
  } else {
    const steps = g.flopped ? R.wardenFlopSpaces : 1;
    const from = g.warden;
    g.warden = Math.min(last, g.warden + steps);
    ev.push({ type: "warden", text: g.warden === from ? `The warden is at ${g.route[g.warden].name} and stays there, puffing.` : `The warden ${steps > 1 ? "hears the racket and charges" : "stomps"} on to ${g.route[g.warden].name}${steps > 1 && g.warden - from > 1 ? " — two spaces!" : ""}.` });
  }
  if (g.warden !== null) {
    let gone = 0;
    for (let i = 0; i <= g.warden; i++) { gone += g.drops[i] ?? 0; g.drops[i] = 0; }
    if (gone) ev.push({ type: "lootLost", text: `The warden scoops up ${gone} piece${gone > 1 ? "s" : ""} of dropped loot. "Evidence!"` });
    const cornered = running(s).filter(id => g.cats[id].pos <= g.warden);
    if (cornered.length) {
      g.cornered = cornered;
      g.stage = "cornered";
      const list = cornered.map(id => catOf(s, id));
      ev.push({ type: "cornered", cats: cornered, text: `Cornered! ${names(list)} must dodge the warden: Sneaky, Savage or Sweet, plain — or it's the van.` });
      log(s, ev);
      return { state: s, events: ev, outcome: null };
    }
  }
  return nextRound(s, ev);
}

function nextRound(s, ev) {
  const g = s.getaway;
  if (!running(s).length) return finished(s, ev);
  g.round += 1;
  g.stage = "run";
  g.flopped = false;
  g.cornered = [];
  s.help = {};
  for (const r of Object.values(g.cats)) if (r.state === "running") r.acted = false;
  ev.push({ type: "getawayRound", text: `Getaway round ${g.round}.` });
  log(s, ev);
  return { state: s, events: ev, outcome: null };
}

/** Everyone is home or pinched: count the loot (Ch 9 "How did it go?"). */
function finished(s, ev) {
  const out = robberyOutcome(s);
  s.phase = "ended";
  s.stage = "between";
  s.outcome = { ...out, reason: s.getaway?.houseEnd ?? "manual", label: OUTCOME_LABEL[out.result] };
  const pinched = out.pinched.map(id => catOf(s, id)?.name).filter(Boolean);
  ev.push({ type: "outcome", result: out.result,
    text: `${OUTCOME_LABEL[out.result]}! Loot home: ${out.loot} of ${out.lootTotal}${out.eaten ? ` (${out.eaten} eaten in the house)` : ""}.${pinched.length ? ` Pinched: ${pinched.join(", ")} — off to the pound.` : " Nobody was pinched."}` });
  log(s, ev);
  return { state: s, events: ev, outcome: s.outcome };
}

/** The Storyteller ends the getaway now: every cat must be home or pinched first (put them there by hand). */
export function finishGetaway(state) {
  if (!inGetaway(state)) throw new Error("There is no getaway running.");
  const s = clone(state);
  if (running(s).length) throw new Error("Some cats are still running: put each one home or in the van first.");
  return finished(s, []);
}

/* ------------------------------------------------------- the Storyteller -- */

/** Put a cat on a space (0–3), home, or in the van, by hand. A cat taken off the route by hand keeps its loot. */
export function placeRunner(state, catId, where) {
  if (!inGetaway(state)) throw new Error("There is no getaway running.");
  const s = clone(state);
  const g = s.getaway;
  const c = catOf(s, catId);
  const r = runner(s, catId);
  if (!c || !r) throw new Error("That cat isn't in the getaway.");
  if (where === "home") Object.assign(r, { state: "home", pos: g.route.length });
  else if (where === "pinched") Object.assign(r, { state: "pinched", where: r.where ?? "route", carry: 0 });
  else Object.assign(r, { state: "running", pos: Math.max(0, Math.min(g.route.length - 1, Number(where) || 0)) });
  g.cornered = g.cornered.filter(id => g.cats[id]?.state === "running");
  if (g.stage === "cornered" && !g.cornered.length) g.stage = "run";
  const ev = [{ type: "placed", text: `The Storyteller puts ${c.name} ${where === "home" ? "home in the hideout" : where === "pinched" ? "in the van" : `at ${spaceName(g, r.pos)}`}.` }];
  return settle(s, ev);
}

/** Put the warden on a space (0–3), or back on the way (null), by hand. */
export function setWarden(state, pos) {
  if (!inGetaway(state)) throw new Error("There is no getaway running.");
  const s = clone(state);
  const g = s.getaway;
  g.warden = pos === null || pos === "" || pos === "none" ? null : Math.max(0, Math.min(g.route.length - 1, Number(pos) || 0));
  const ev = [{ type: "warden", text: g.warden === null ? "The Storyteller sends the warden back to the van." : `The Storyteller puts the warden at ${g.route[g.warden].name}.` }];
  log(s, ev);
  return { state: s, events: ev };
}

/** A cat's loot by hand (0 … what it can carry). */
export function setCarry(state, catId, n) {
  if (!inGetaway(state)) throw new Error("There is no getaway running.");
  const s = clone(state);
  const c = catOf(s, catId);
  const r = runner(s, catId);
  if (!c || !r) throw new Error("That cat isn't in the getaway.");
  r.carry = Math.max(0, Math.min(carryCap(c), Math.trunc(Number(n) || 0)));
  const ev = [{ type: "placed", text: `The Storyteller gives ${c.name} ${r.carry} piece${r.carry === 1 ? "" : "s"} of loot.` }];
  log(s, ev);
  return { state: s, events: ev };
}

/** The getaway as the tracker shows it (Foundry-free). */
export function getawayView(state) {
  const s = state;
  const g = s.getaway;
  if (!g) return null;
  const spaces = [...g.route.map((o, i) => ({ index: i, name: i === 0 ? "The garden" : `Past ${g.route[i - 1].name}`, next: o.name, pet: o.pet ?? 0, opts: o.opts })), { index: g.route.length, name: "The hideout", next: null }];
  return {
    round: g.round, stage: g.stage, warden: g.warden, arrives: g.arrives,
    wardenText: g.warden === null ? `The van pulls up at the end of round ${g.arrives}.` : `The warden is at ${g.route[g.warden].name}${g.warden === 0 ? " (the garden)" : ""}.`,
    loot: g.loot, drops: g.drops, cornered: g.cornered,
    spaces: spaces.map(sp => ({
      ...sp, warden: g.warden === sp.index, loot: g.drops[sp.index] ?? 0,
      cats: s.cats.filter(c => { const r = g.cats[c.id]; return r && ((r.state === "running" && r.pos === sp.index) || (r.state === "home" && sp.index === g.route.length)); })
        .map(c => ({ id: c.id, name: c.name, carry: g.cats[c.id].carry, acted: g.cats[c.id].acted, state: g.cats[c.id].state, cornered: g.cornered.includes(c.id) }))
    })),
    pinched: s.cats.filter(c => g.cats[c.id]?.state === "pinched").map(c => ({ id: c.id, name: c.name, where: g.cats[c.id].where }))
  };
}
