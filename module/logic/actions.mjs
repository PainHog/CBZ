/**
 * NINE LIVES GANG — a cat's turn (pure)
 * -------------------------------------
 * Ch 6 "Your turn": one Move and one Action, either way round. This module
 * lists what a cat can do right now (`catOptions`), what a roll for it looks
 * like (`rollContext`, for the roll dialog), and what happens when it's done
 * (`doAction` for things that need no roll, `applyRoll` for a final roll card).
 *
 * An option: { id, kind, label, uses: ["move"|"action"…], target, room,
 *   roll: null | { options: [[approach, Difficulty, ...tags]], opposition, bodyDie, diffLabel },
 *   group: bool (helpers go along), simple: bool (a simple thing: a roll only when seen),
 *   disabled: reason|null }
 * Ids: move:<room> · enter:<entrance> · exit:<entrance> · meow:<entrance> · reopen:<entrance> ·
 *   open:<wayId> · step · take · eat · drop · hide · noise · ride:<pet> · hopOff ·
 *   distract:<human> · confront:<pet> · cover:<pet> · wriggle · escapeDen · free
 */
import { CATB } from "../config.mjs";
import { works, makesNoise, hasKnack, knackInstincts, attentionApplies } from "./rules.mjs";
import { waysFrom, fits, wayBetween } from "./map.mjs";
import {
  watchers, catById, humanByKey, petByKey, roomName, hostilePet, highestAttention, kidAmong, addNoise
} from "./residents.mjs";
import { currentStep, canCarry, carryRule, dropPrize } from "./prize.mjs";
import { clone, addMood, pushLog, markApplied, isApplied, chaseBack, look } from "./round.mjs";
import { rollEntry } from "./mood.mjs";

const R = CATB.rules;
const SIMPLE_IN_VIEW = tags => [["sneaky", 0, ...tags], ["savage", 0, ...tags]];
/** Ch 8 "Hauling" (v0.8): Sneaky (quietly) or Savage (heave); plain unless the prize says (the cake: Tricky); pushing is a Knocker's Knack. */
const HAUL = z => [["sneaky", z?.haulDiff ?? 0, "knock"], ["savage", z?.haulDiff ?? 0, "knock"]];
/** Is this option a haul (the carriers move the prize, through a way or out of an entrance)? */
const isHaul = (c, o) => !!c?.carrying && (o?.kind === "carry" || o?.kind === "exit");
const low = s => String(s).toLowerCase();

/** Can this cat act at all right now? (a robbery running, cats' part of a round) */
export function turnOpen(s) { return s?.phase === "robbery" && s.stage === "cats" && s.round >= 1; }

/**
 * Everything the cat could do now, with what's in the way.
 * @returns {{cat, room, seen: object[], blockedBy: object|null, options: object[], helpTargets: object[]}}
 */
export function catOptions(state, catId) {
  const s = state;
  const c = catById(s, catId);
  const out = { cat: c, room: c?.where ?? null, seen: [], blockedBy: null, options: [], helpTargets: [] };
  if (!c || s.phase !== "robbery") return out;
  const opt = o => out.options.push({ uses: [], roll: null, group: false, simple: false, disabled: null, room: c.where, ...o });
  const moveLeft = !c.moved, actLeft = !c.acted;
  const t = s.temptation && !s.temptation.choice ? s.temptation : null;
  const need = (uses, roll) => {
    if (!turnOpen(s)) return "wait for the round to begin";
    // v0.8 (REVIEW #71): the Storyteller picks the cat a full meter falls on at once, before anyone goes on
    if (s.pendingTrigger) return `the Storyteller first picks which cat ${humanByKey(s, s.pendingTrigger.human)?.name ?? "the human"} ${s.pendingTrigger.side === "broom" ? "chases out" : "picks up"}`;
    // Ch 7 (v0.6): the tempted cat answers first and takes its turn before any other cat
    if (t) return t.catId === c.id ? "answer the temptation first" : `${catById(s, t.catId)?.name ?? "the tempted cat"} is tempted and goes first`;
    if (uses.includes("move") && !moveLeft) return "already moved this round";
    if ((uses.includes("action") || roll) && !actLeft) return "already acted this round";
    return null;
  };
  const z = s.prize;

  if (c.status === "outside") {
    for (const e of s.entrances) {
      const roll = e.opts.length ? { options: e.opts } : null;
      const uses = roll ? ["move", "action"] : ["move"];
      // v0.8 (REVIEW #88): a cat can't go out and come back in on the same turn
      const why = c.outSerial === s.roundSerial ? "it went out this turn: back in next round"
        : !e.open ? "it's shut" : (e.rounds && !e.rounds.includes(s.round)) ? `only in round ${e.rounds.join(" or ")}`
        : !fits(e.size, { body: c.body }) ? "too tight for a Chonky cat" : null;
      opt({ id: `enter:${e.key}`, kind: "enter", label: `In through the ${e.name}`, target: e.key, room: e.room, uses, roll,
        group: !!roll && !e.one, disabled: why ?? need(uses, roll) });
    }
    out.helpTargets = helpTargetsFor(s, c);
    opt({ id: "free", kind: "free", label: "Something else (a free roll)", uses: ["action"], roll: { options: anyApproach(0) }, disabled: need(["action"], true) });
    return out;
  }
  if (c.status === "held") {
    const h = humanByKey(s, c.heldBy);
    opt({ id: "wriggle", kind: "wriggle", label: `Wriggle free of ${h?.name ?? "the human"}`, uses: ["action"],
      roll: { options: [["savage", R.wriggleDifficulty]], bodyDie: c.body === "chonky" }, disabled: need(["action"], true) });
    return out;
  }
  if (c.status === "shut") {
    opt({ id: "escapeDen", kind: "escapeDen", label: "Open the Den door from inside", uses: ["action"], roll: { options: R.denInside }, disabled: need(["action"], true) });
    return out;
  }

  // ---- free, inside ----
  const room = c.where;
  const ws = watchers(s, room);
  out.seen = ws;
  const pet = hostilePet(s, room, c);
  out.blockedBy = pet;
  const blocked = pet ? `${pet.name} is in the way: deal with it or leave first` : null;
  const seenRoll = (tags, extra = {}) => (ws.length ? { options: SIMPLE_IN_VIEW(tags), ...extra } : null);
  const act = (o, { simple = false, tags = [], allowBlocked = false } = {}) => {
    const roll = o.roll !== undefined ? o.roll : (simple ? seenRoll(tags) : null);
    const uses = o.uses ?? ["action"];
    opt({ ...o, roll, uses, simple, disabled: o.disabled ?? ((!allowBlocked && blocked) || need(uses, roll)) });
  };

  // Moves through ways
  const carriers = c.carrying ? z.carriers.map(id => catById(s, id)).filter(Boolean) : [];
  for (const { to, way } of waysFrom(s, room)) {
    if (c.carrying) {
      // Ch 8 "Hauling" (v0.8): a Medium or Large prize is a roll every time, seen or not; a Small one
      // only when a human in either room sees it (unseen, the carrier just walks: its Move, nothing more).
      // Every carrier's Action; one rolls, the other carriers and any other cat in the room may help;
      // humans in the room it leaves and the room it enters see it.
      const fit = carriers.every(x => fits(way.size, { body: x.body, carry: z.size }));
      const past = [...ws, ...watchers(s, to)];
      const haul = z.size !== "small" || past.length > 0;
      const roll = haul ? { options: HAUL(z), seenRooms: [room, to], haul: true } : null;
      const uses = roll ? ["move", "action"] : ["move"];
      const why = !way.open ? "the way is shut" : !fit ? `the ${z.name} won't fit through` : carriers.some(x => x.moved) ? "a carrier has already moved"
        : (roll && carriers.some(x => x.acted)) ? "a carrier has already acted (hauling is every carrier's Action)" : null;
      opt({ id: `move:${to}`, kind: "carry", label: `${roll ? "Haul" : "Carry"} the ${z.name} to the ${low(roomName(s, to))}${roll ? " (a roll)" : ""}`,
        target: to, uses, roll, group: true, disabled: why ?? need(uses, roll) });
    } else {
      const why = !way.open ? "the way is shut" : !fits(way.size, { body: c.body }) ? "too tight for a Chonky cat" : null;
      opt({ id: `move:${to}`, kind: "move", label: `Go to the ${low(roomName(s, to))}`, target: to, uses: ["move"], disabled: why ?? need(["move"], null) });
    }
    if (!way.open && way.opts) {
      const shut = s.cats.filter(x => x.status === "shut");
      const options = way.den && shut.length ? R.denDoor : way.opts;
      act({ id: `open:${way.id}`, kind: "openWay", label: `Open the door to the ${low(roomName(s, to))}${way.den && shut.length ? ` (let ${shut.map(x => x.name).join(" and ")} out)` : ""}`,
        target: way.id, roll: { options } });
    }
  }

  // Entrances in this room
  for (const e of s.entrances.filter(x => x.room === room)) {
    const carry = c.carrying ? z.size : null;
    const group = c.carrying ? carriers : [c];
    const fit = group.every(x => fits(e.size, { body: x.body, carry }));
    // If the entrance lists a roll, that's the roll; else hauling a Medium/Large prize out is a roll (Small: if seen)
    let roll = e.opts.length ? { options: e.opts } : null;
    if (!roll && c.carrying && (z.size !== "small" || ws.length)) roll = { options: HAUL(z), haul: true };
    // Ch 8 (v0.6): going out through an entrance that needs no roll can be the Move or the Action
    const uses = roll ? ["move", "action"] : (group.every(x => !x.moved) ? ["move"] : ["action"]);
    const why = !e.open ? (e.rounds ? "it's shut" : "it's shut (reopen it from inside first)")
      : (e.rounds && !e.rounds.includes(s.round)) ? `only in round ${e.rounds.join(" or ")}`
      : !fit ? (carry ? `the ${z.name} won't fit through` : "too tight for a Chonky cat")
      : (carry && e.climb && z.size !== "small") ? "a climb takes Small things only"
      : roll ? (group.some(x => x.moved) ? "already moved this round" : group.some(x => x.acted) ? "already acted this round" : null)
      : (group.some(x => x.moved && x.acted) ? "no Move or Action left" : null);
    opt({ id: `exit:${e.key}`, kind: "exit", label: `Out through the ${e.name}${carry ? ` with the ${z.name}` : ""}${!roll && uses[0] === "action" ? " (as your Action)" : ""}`, target: e.key, uses, roll,
      group: true, disabled: why ?? ((t || s.pendingTrigger) ? need(uses, roll) : (turnOpen(s) ? null : need(uses, roll))) });
    if (e.letOut) {
      act({ id: `meow:${e.key}`, kind: "meow", label: `Meow at the ${e.name} to be let out`, target: e.key, uses: ["move", "action"],
        roll: { options: [["sweet", 0, "charm"]] }, allowBlocked: true,
        disabled: c.carrying ? "a cat with its mouth full can't be Sweet" : !ws.length ? "nobody there to let you out" : null });
    }
    if (!e.open && !e.rounds) {
      act({ id: `reopen:${e.key}`, kind: "reopen", label: `Open the ${e.name} again`, target: e.key, roll: { options: R.reopenEntrance } });
    }
  }

  // Pets
  for (const p of s.pets.filter(x => x.room === room)) {
    if (pet && p.key === pet.key) {
      const options = [["savage", 0, "fight"], ["sneaky", 0]];
      if (p.soft && !c.carrying) options.push(["sweet", 0]);
      act({ id: `confront:${p.key}`, kind: "confront", label: `Deal with ${p.name} (Savage drives off${p.soft ? ", Sweet befriends" : ""}, Sneaky slips past)`,
        target: p.key, roll: { options, opposition: p.rating } }, { allowBlocked: true });
    }
    if (p.kind === "parrot" && p.mode !== "covered") act({ id: `cover:${p.key}`, kind: "cover", label: `Cover ${p.name}'s cage`, target: p.key, roll: { options: R.coverParrot } });
    // Ch 10 (v0.8, REVIEW #89): a cat holding the prize can't ride
    if (p.kind === "vacuum" && c.riding !== p.key && !c.carrying) act({ id: `ride:${p.key}`, kind: "ride", label: `Hop on ${p.name}`, target: p.key }, { simple: true });
  }
  if (c.riding) opt({ id: "hopOff", kind: "hopOff", label: "Hop off the vacuum (free)", uses: [] });

  // The prize
  if (z && !z.out && !z.gone && z.room === room && !z.withHuman) {
    if (!z.down && !z.carriers.length && z.stepsLeft > 0) {
      const n = z.spotSteps.length - z.stepsLeft + 1;
      act({ id: "step", kind: "step", label: `Get at the ${z.name}: step ${n} of ${z.spotSteps.length}`, roll: { options: currentStep(z) } });
    }
    // v0.8 (REVIEW #82): nobody can pick it up or eat it until every step of its spot is done (`down`)
    if (z.down && !z.carriers.length && !c.carrying) {
      act({ id: "take", kind: "take", label: `Pick up the ${z.name} (${z.size}: ${carryRule(z.size)})`, group: true }, { simple: true });
      // v0.7: eating a portion is always a roll, seen or not (Sneaky quietly, Savage wolfing it; a Foodie's Knack either way)
      if (z.kind === "delicious" && z.portionsLeft > 0) act({ id: "eat", kind: "eat", label: `Eat a portion (${z.portionsLeft} left)`, roll: { options: SIMPLE_IN_VIEW(["food"]) } });
    }
  } else if (z?.withHuman && z.room === room) {
    out.notes = [`The ${z.name} is still in ${humanByKey(s, z.withHuman)?.name ?? "the human"}'s arms.`];
  }
  if (c.carrying) act({ id: "drop", kind: "drop", label: `Put the ${z.name} down` }, { simple: true });

  // Humans (a holder's hands are full: they can't be Distracted, REVIEW #78)
  for (const h of ws.filter(x => !x.holding)) {
    act({ id: `distract:${h.key}`, kind: "distract", label: `Distract ${h.name}${h.distractions ? ` (distracted ${h.distractions}× before: −${h.distractions})` : ""}`, target: h.key,
      roll: { options: [["sweet", h.distractions ?? 0, "charm"]], diffLabel: h.distractions ? `Distracted ${h.distractions}× before` : null },
      disabled: c.carrying ? "a cat with its mouth full can't be Sweet" : null });
  }
  if (!c.hidden && s.rooms[room]?.hide !== false && !c.carrying) act({ id: "hide", kind: "hide", label: "Hide", roll: ws.length ? { options: [["sneaky", 0, "hide"]] } : null }, { simple: true }); // Ch 5: a Sneaky roll if somebody sees
  // v0.8 (REVIEW #88): a noise made on purpose is a noise whatever the roll, and leaves a mess (one per room)
  act({ id: "noise", kind: "noise", label: "Make a noise on purpose (a lure: leaves a mess)" }, { simple: true, tags: ["knock"] });
  act({ id: "free", kind: "free", label: "Something else (a free roll)", roll: { options: anyApproach(0) } });
  out.helpTargets = helpTargetsFor(s, c);
  return out;
}

const anyApproach = d => CATB.approachKeys.map(a => [a, d]);

/** The gang mates this cat could help this round (same room — or both outside — and they haven't acted). */
export function helpTargetsFor(s, c) {
  if (!c || c.acted || !(c.status === "free" || c.status === "outside")) return [];
  return s.cats.filter(x => x.id !== c.id && x.status === c.status && x.where === c.where).map(x => ({ id: x.id, name: x.name, queued: s.help?.[c.id] === x.id }));
}

/**
 * Cats who could help this cat's roll now: same place, not acted (for enter/exit
 * groups also not moved). A haul (v0.8, REVIEW #80): the other carriers (it's
 * their Action anyway), then any other free cat in the room that hasn't acted —
 * it helps (+1 die, its Action) but stays behind: only the carriers move.
 */
export function eligibleHelpers(s, c, option = null) {
  if (!c) return [];
  // Ch 10: a cat a dog (or house cat) is stopping deals with it before doing anything else — it can help only that roll
  const free = x => {
    const p = x.status === "free" ? hostilePet(s, x.where, x) : null;
    return !p || (x.dealt ?? []).includes(p.key) || (option?.kind === "confront" && option.target === p.key);
  };
  if (isHaul(c, option)) {
    const carriers = s.prize.carriers.filter(id => id !== c.id).map(id => catById(s, id)).filter(Boolean);
    const others = s.cats.filter(x => x.id !== c.id && x.status === "free" && x.where === c.where && !x.acted && !s.prize.carriers.includes(x.id) && free(x));
    return [...carriers, ...others];
  }
  return s.cats.filter(x => x.id !== c.id && x.status === c.status && x.where === c.where && !x.acted
    && (c.status === "free" || c.status === "outside") && free(x)
    && !(option?.group && ["enter", "exit"].includes(option.kind) && x.moved));
}

export function findOption(state, catId, optionId) {
  return catOptions(state, catId).options.find(o => o.id === optionId) ?? null;
}

/** The room a roll for this option is made in (an entrance roll happens in view of the room it leads to). */
function rollRoom(s, c, o) {
  if (o.kind === "enter") return s.entrances.find(e => e.key === o.target)?.room ?? c.where;
  return c.where;
}

/**
 * Who sees a roll for this option (Ch 5). A hidden cat that does anything
 * comes out of hiding, so a roll is seen by every watcher in the room
 * (CORE-RULES "Seen"; book/REVIEW.md #27). A held cat is seen by its holder;
 * a cat shut in the Den by nobody; carrying the prize past a human, by the
 * watchers in both rooms.
 */
export function rollWatchers(s, c, o) {
  if (!c) return [];
  if (c.status === "held") { const h = humanByKey(s, c.heldBy); return h ? [h] : []; }
  if (c.status === "shut") return [];
  if (o?.roll?.seenRooms) return [...new Set(o.roll.seenRooms.flatMap(r => watchers(s, r)))];
  return watchers(s, rollRoom(s, c, o ?? {}));
}

/**
 * Everything the roll dialog needs for one option (AUTOMATION.md §4): the
 * approaches it allows with their Difficulty and Knack, the pet's opposition,
 * who sees it (their highest Attention, a kid), and the helpers.
 */
export function rollContext(state, catId, optionId = "free") {
  const s = state;
  const c = catById(s, catId);
  const o = findOption(s, catId, optionId) ?? (optionId === "free" ? { id: "free", kind: "free", label: "A free roll", roll: { options: anyApproach(0) }, uses: ["action"] } : null);
  if (!c || !o) return null;
  const seen = rollWatchers(s, c, o);
  const helpers = eligibleHelpers(s, c, o);
  const queued = Object.entries(s.help ?? {}).filter(([, t]) => t === c.id).map(([h]) => h);
  const options = (o.roll?.options ?? anyApproach(0)).map(([approach, difficulty = 0, ...tags]) => ({
    approach, label: CATB.approaches[approach]?.label ?? approach, difficulty, tags,
    knack: hasKnack(c.instincts, tags), knackFrom: knackInstincts(c.instincts, tags).map(i => CATB.instincts[i].label),
    rating: c.r?.[approach] ?? 0,
    attention: attentionApplies(approach) ? highestAttention(seen) : 0
  }));
  // a haul's other carriers are locked in (it's every carrier's Action); anyone else is ticked if they said they'd help
  const haul = isHaul(c, o);
  const locked = id => haul && s.prize.carriers.includes(id);
  return {
    option: o, cat: c, room: rollRoom(s, c, o), roomName: roomName(s, rollRoom(s, c, o)),
    options, opposition: o.roll?.opposition ?? 0, bodyDie: !!o.roll?.bodyDie, diffLabel: o.roll?.diffLabel ?? null,
    seenBy: seen.map(h => h.key), seenNames: seen.map(h => h.name), attention: highestAttention(seen), kid: kidAmong(seen),
    helpers: helpers.map(x => ({ id: x.id, name: x.name, locked: locked(x.id), queued: queued.includes(x.id) || locked(x.id),
      note: haul && !locked(x.id) ? "helps, but stays here" : null })),
    autoHelpers: haul
  };
}

/* ------------------------------------------------------------ doing it -- */

/**
 * Do an option that needs no roll (a Move, or a simple thing nobody sees).
 * args: { helpers: [catId] (a group pick-up), force: bool (the Storyteller) }
 * ctx: { mood }
 */
export function doAction(state, catId, optionId, args = {}, ctx = {}) {
  const s = clone(state);
  const ev = [];
  const c = catById(s, catId);
  const o = findOption(s, catId, optionId);
  if (!c || !o) throw new Error(`${c?.name ?? "That cat"} can't do that now.`);
  if (o.disabled && !args.force) throw new Error(`${c.name} can't: ${o.disabled}.`);
  if (o.roll && !args.force) throw new Error(`${o.label}: that needs a roll.`);
  const res = perform(s, c, o, { ...args, result: null, helpers: args.helpers ?? queuedHelpers(s, c) }, ev, ctx);
  for (const id of res.ok ? (args.helpers ?? queuedHelpers(s, c)) : []) delete s.help?.[id];
  look(s, ev, ctx.mood ?? "auto");
  pushLog(s, ev);
  return { state: s, events: ev, ok: res.ok, cattitude: [] };
}

function queuedHelpers(s, c) {
  return Object.entries(s.help ?? {}).filter(([, t]) => t === c.id).map(([h]) => h);
}

/**
 * Apply a FINAL roll card to the robbery (AUTOMATION.md §1: the GM client
 * reacts to documents): the option's effect (if the card is bound to one),
 * the roll's noise, helpers' Actions, hiding, then the Mood (one roll, one
 * change). Idempotent: a card applies once (its eventId is remembered).
 * card: { eventId, catId, optionId, approach, result, seen, seenBy, kid, pushedWithMood, helpers, label, quiet }
 * ctx: { mood: "auto"|"confirm"|"manual", effects: bool }
 */
export function applyRoll(state, card, ctx = {}) {
  if (isApplied(state, card.eventId)) return { state, events: [], cattitude: [], skipped: true };
  const s = clone(state);
  const ev = [];
  const cattitude = [];
  const c = catById(s, card.catId);
  markApplied(s, card.eventId);
  if (!c) {
    if (ctx.mood !== "manual") addMood(s, rollEntry(card, { round: s.round }), ev, ctx.mood ?? "auto");
    look(s, ev, ctx.mood ?? "auto");
    pushLog(s, ev);
    return { state: s, events: ev, cattitude };
  }
  let o = card.optionId && card.optionId !== "free" ? findOption(s, c.id, card.optionId) : null;
  let spent = false;
  if (o?.disabled && /already (acted|moved)|no Move or Action left|carrier has already/.test(o.disabled)) {
    // e.g. two rolls in one round: the Mood and noise still count, the effect doesn't happen twice
    ev.push({ type: "spent", text: `(${c.name} had ${o.disabled.replace(/ this round$/, "")}: the Storyteller decides what this roll does.)` });
    o = null;
    spent = true;
  }
  if (card.optionId && card.optionId !== "free" && !o && !spent) ev.push({ type: "stale", text: `(${c.name}'s roll no longer fits the house as it is now: the Storyteller applies it by hand.)` });
  const room = o ? rollRoom(s, c, o) : (c.where === "outside" ? null : c.where);
  const ok = works(card.result);
  ev.push({ type: "roll", cat: c.id, result: card.result,
    text: `${c.name}${o ? ` — ${o.label}` : ""}: ${CATB.approaches[card.approach]?.label ?? card.approach}, ${CATB.results[card.result]?.label ?? card.result}${card.seen ? " (seen)" : ""}.` });
  // doing anything ends hiding (CORE-RULES "Seen")
  c.hidden = false;
  if (c.riding && !(o?.kind === "ride")) c.riding = null;
  // helpers spend their Actions
  for (const id of card.helpers ?? []) { const h = catById(s, id); if (h) { h.acted = true; delete s.help[id]; } }
  const entry = rollEntry({ ...card, catName: c.name }, { round: s.round });
  if (o && ctx.effects !== false && ok && MOVING.has(o.kind) && wouldTrigger(s, entry, ctx)) {
    // Ch 5 (v0.6): a roll that fills a meter still does what it did, but the Shoo! or Scoop happens
    // before the cat goes anywhere (a carrier drops the prize; the human puts it back)
    const group = o.kind === "carry" || (o.kind === "exit" && c.carrying) ? s.prize.carriers.map(id => catById(s, id)).filter(Boolean) : [c];
    for (const x of group) { x.acted = true; }
    ev.push({ type: "stopped", cat: c.id, text: `…but before ${c.name} goes anywhere:` });
    if (makesNoise(card.result) && !card.quiet && room) addNoise(s, room, `${c.name}'s ${card.result}`, c.id);
    addMood(s, entry, ev, ctx.mood ?? "auto");
    look(s, ev, ctx.mood ?? "auto");
    pushLog(s, ev);
    return { state: s, events: ev, cattitude: card.result === "purrfect" ? [{ catId: c.id, delta: +1, why: "a Purrfect" }] : [], ok };
  }
  const performed = !!o && ctx.effects !== false;
  if (performed) {
    perform(s, c, o, { result: card.result, approach: card.approach, helpers: card.helpers ?? [] }, ev, ctx);
  } else {
    if (o?.uses?.includes("move")) c.moved = true;
    c.acted = true;
    if (o && ctx.effects === false) ev.push({ type: "noEffect", text: `(Effects are off: the Storyteller applies "${o.label}" by hand.)` });
  }
  // v0.7: a haul's noise is in the room the prize ends up in; a noise made on purpose already made its own (v0.8)
  const noiseRoom = o?.kind === "carry" && ok && s.prize.room === o.target ? o.target : room;
  if (makesNoise(card.result) && !card.quiet && noiseRoom && !(performed && o.kind === "noise")) addNoise(s, noiseRoom, `${c.name}'s ${card.result}`, c.id);
  if (card.result === "purrfect") cattitude.push({ catId: c.id, delta: +1, why: "a Purrfect" });
  addMood(s, entry, ev, ctx.mood ?? "auto");
  look(s, ev, ctx.mood ?? "auto");
  pushLog(s, ev);
  return { state: s, events: ev, cattitude, ok };
}

const MOVING = new Set(["carry", "exit", "meow", "move"]);

/** Would this roll's Mood entry fire Shoo!/Scooped! on its cat right now? (tried on a copy) */
function wouldTrigger(s, entry, ctx) {
  if ((ctx.mood ?? "auto") !== "auto") return false;
  const t = clone(s);
  const ev = [];
  addMood(t, entry, ev, "auto");
  return ev.some(e => (e.type === "shoo" || e.type === "scooped") && e.cat === entry.catId);
}

/**
 * The effect of an option. MUTATES s. `result` null = no roll needed.
 * Returns { ok }.
 */
function perform(s, c, o, { result, approach, helpers = [] }, ev, ctx) {
  const ok = result === null || result === undefined ? true : works(result);
  const z = s.prize;
  const usesAct = !!o.roll || o.uses.includes("action");
  const mark = (cat, { move = o.uses.includes("move"), act = usesAct } = {}) => { if (move) cat.moved = true; if (act) cat.acted = true; };
  const helpCats = helpers.map(id => catById(s, id)).filter(Boolean);
  switch (o.kind) {
    case "move": {
      Object.assign(c, { cameFrom: c.where, where: o.target, hidden: false, riding: null });
      mark(c);
      ev.push({ type: "move", cat: c.id, to: o.target, text: `${c.name} goes to the ${low(roomName(s, o.target))}.` });
      break;
    }
    case "carry": {
      const group = z.carriers.map(id => catById(s, id)).filter(Boolean);
      for (const x of group) { if (o.roll) x.acted = true; }
      if (!ok) { ev.push({ type: "carryFailed", text: `The ${z.name} doesn't budge.` }); failedHaulChase(s, group, ev); break; }
      for (const x of group) Object.assign(x, { cameFrom: x.where, where: o.target, moved: true, hidden: false, riding: null, arrivedSpent: o.roll ? s.roundSerial : x.arrivedSpent });
      z.room = o.target;
      ev.push({ type: "carry", to: o.target, text: `${group.map(x => x.name).join(" and ")} carry the ${z.name} to the ${low(roomName(s, o.target))}.` });
      break;
    }
    case "enter": {
      const e = s.entrances.find(x => x.key === o.target);
      const group = [c, ...(o.group ? helpCats.filter(x => x.status === "outside") : [])];
      for (const x of group) mark(x);
      if (e.one) e.open = false; // Ch 8: the front door lets in one cat, then it shuts
      if (!ok) { ev.push({ type: "enterFailed", cat: c.id, text: `${c.name} doesn't get in through the ${e.name}.` }); break; }
      if (e.jam && o.roll) { e.opts = []; ev.push({ type: "jammed", text: `The ${e.name} is jammed open now: no roll for anyone.` }); }
      for (const x of group) Object.assign(x, { where: e.room, status: "free", hidden: false, cameFrom: "outside", enteredSerial: s.roundSerial, enteredBy: e.key, arrivedSpent: o.roll ? s.roundSerial : null });
      if (e.noisy) for (const x of group) addNoise(s, e.room, e.name, x.id); // v0.6: a noise for each cat
      ev.push({ type: "enter", cat: c.id, text: `${group.map(x => x.name).join(" and ")} ${group.length > 1 ? "come" : "comes"} in through the ${e.name}${e.noisy ? " (it clacks: noise)" : ""}.` });
      break;
    }
    case "exit": {
      const e = s.entrances.find(x => x.key === o.target);
      const group = c.carrying ? z.carriers.map(id => catById(s, id)).filter(Boolean)
        : [c, ...helpCats.filter(x => x.status === "free" && x.where === c.where && !x.moved && fits(e.size, { body: x.body }))];
      if (o.roll) for (const x of group) mark(x, { move: ok, act: true });
      else for (const x of group) { if (!x.moved) x.moved = true; else x.acted = true; } // the Move, or else the Action
      if (!ok) {
        ev.push({ type: "exitFailed", cat: c.id, text: `${c.name} doesn't get out through the ${e.name}.` });
        if (c.carrying) failedHaulChase(s, group, ev);
        break;
      }
      const withPrize = c.carrying;
      for (const x of group) Object.assign(x, { where: "outside", status: "outside", hidden: false, riding: null, carrying: false, outSerial: s.roundSerial });
      if (withPrize) { z.out = true; z.carriers = []; z.room = null; } // got, even part-eaten (v0.8)
      if (e.noisy) for (const x of group) addNoise(s, e.room, e.name, x.id);
      ev.push({ type: "exit", cat: c.id, text: `${group.map(x => x.name).join(" and ")} ${group.length > 1 ? "get" : "gets"} out through the ${e.name}${withPrize ? ` with the ${z.name}!` : "."}` });
      break;
    }
    case "meow": {
      mark(c, { move: ok, act: true });
      if (!ok) { ev.push({ type: "meowFailed", cat: c.id, text: `Nobody lets ${c.name} out.` }); break; }
      Object.assign(c, { where: "outside", status: "outside", hidden: false, riding: null, outSerial: s.roundSerial });
      ev.push({ type: "letOut", cat: c.id, text: `Somebody opens the door and lets ${c.name} out.` });
      break;
    }
    case "reopen": {
      mark(c);
      if (ok) { const e = s.entrances.find(x => x.key === o.target); e.open = true; ev.push({ type: "reopened", text: `${c.name} gets the ${e.name} open again.` }); }
      break;
    }
    case "openWay": {
      mark(c);
      if (!ok) break;
      const w = s.ways.find(x => x.id === o.target);
      w.open = true;
      ev.push({ type: "opened", text: `${c.name} opens the door between the ${low(roomName(s, w.a))} and the ${low(roomName(s, w.b))}.` });
      if (w.den) freeShutCats(s, ev);
      break;
    }
    case "step": {
      mark(c);
      if (!ok) break;
      z.stepsLeft -= 1; z.down = z.stepsLeft <= 0;
      const n = z.spotSteps.length - z.stepsLeft;
      ev.push({ type: "step", text: `Step ${n} of ${z.spotSteps.length} done${z.down ? `: the ${z.name} is there for the taking` : ""} (it stays done for the whole gang).` });
      break;
    }
    case "take": {
      const group = [c, ...helpCats.filter(x => x.status === "free" && x.where === c.where && !x.carrying)];
      if (!canCarry(z.size, group)) {
        if (o.roll) for (const x of group) mark(x);
        ev.push({ type: "cantCarry", text: `The ${z.name} is ${z.size}: it takes ${carryRule(z.size)}.` });
        return { ok: false };
      }
      for (const x of group) mark(x);
      if (!ok) break;
      z.carriers = group.map(x => x.id);
      for (const x of group) { x.carrying = true; x.hidden = false; x.riding = null; } // a cat holding the prize can't ride (v0.8)
      ev.push({ type: "take", text: `${group.map(x => x.name).join(" and ")} ${group.length > 1 ? "pick" : "picks"} up the ${z.name}.` });
      break;
    }
    case "eat": {
      mark(c);
      if (!ok) break;
      if (z.portionsLeft > 0) { z.portionsLeft -= 1; z.eaten += 1; }
      ev.push({ type: "eat", text: `${c.name} eats a portion of the ${z.name} (${z.portionsLeft} left).` });
      break;
    }
    case "drop": {
      mark(c);
      if (!ok) break;
      dropPrize(s);
      ev.push({ type: "dropped", text: `${c.name} puts the ${z.name} down in the ${low(roomName(s, c.where))}.` });
      break;
    }
    case "hide": {
      mark(c);
      if (ok) { c.hidden = true; ev.push({ type: "hide", cat: c.id, text: `${c.name} hides.` }); }
      break;
    }
    case "noise": {
      // v0.8 (REVIEW #88): a noise made on purpose is a noise whatever the roll; the roll only decides who notices
      mark(c);
      addNoise(s, c.where, `${c.name} on purpose`, c.id, { mess: true });
      ev.push({ type: "lure", cat: c.id, text: `${c.name} knocks something over on purpose: noise, and a mess${ok ? "" : " (and they saw who did it)"}.` });
      break;
    }
    case "ride": {
      mark(c);
      if (ok) { c.riding = o.target; c.hidden = true; ev.push({ type: "ride", cat: c.id, text: `${c.name} hops on ${petByKey(s, o.target)?.name}: hidden while it rides.` }); }
      break;
    }
    case "hopOff": {
      c.riding = null; c.hidden = false;
      ev.push({ type: "hopOff", cat: c.id, text: `${c.name} hops off.` });
      break;
    }
    case "distract": {
      mark(c);
      if (!ok) break;
      const h = humanByKey(s, o.target);
      h.distractedRound = s.round;
      h.distractions = (h.distractions ?? 0) + 1;
      ev.push({ type: "distracted", human: h.key, text: `${h.name} is Distracted until the round ends: they see nobody.` });
      break;
    }
    case "confront": {
      mark(c);
      const p = petByKey(s, o.target);
      // v0.7: rolling against it, or helping the cat who rolls, is dealing with it (no end-of-turn chase)
      for (const x of [c, ...helpCats]) x.dealt = [...(x.dealt ?? []), p.key];
      if (ok) {
        // Ch 10 (v0.6): driven off = hides for 3 rounds counting this one (back at the end of the third)
        if (approach === "savage") { p.mode = "hiding"; p.until = s.round + R.petHideRounds - 1; ev.push({ type: "drivenOff", pet: p.key, text: `${c.name} drives ${p.name} off: it hides for ${R.petHideRounds} rounds, counting this one.` }); }
        else if (approach === "sweet") { p.mode = "friendly"; ev.push({ type: "befriended", pet: p.key, text: `${c.name} befriends ${p.name}: it leaves the whole gang alone for the rest of the robbery.` }); }
        else { c.slipped = [...(c.slipped ?? []), p.key]; ev.push({ type: "slipped", pet: p.key, text: `${c.name} slips past ${p.name} this turn.` }); }
      } else {
        // a failed roll: it chases you back the way you came (not your Move; a carrier drops the prize)
        chaseBack(s, c, p, ev);
      }
      break;
    }
    case "cover": {
      mark(c);
      if (ok) { const p = petByKey(s, o.target); p.mode = "covered"; ev.push({ type: "covered", pet: p.key, text: `${c.name} throws a cloth over ${p.name}'s cage: quiet for the rest of the robbery.` }); }
      break;
    }
    case "wriggle": {
      mark(c);
      if (!ok) break;
      const h = humanByKey(s, c.heldBy);
      if (h) h.holding = null;
      Object.assign(c, { status: "free", where: h?.room ?? c.where, heldBy: null, hidden: false });
      ev.push({ type: "wriggled", cat: c.id, text: `${c.name} wriggles free and drops to the floor, seen.` });
      break;
    }
    case "escapeDen": {
      mark(c);
      if (!ok) break;
      const w = s.ways.find(x => x.den);
      if (w) w.open = true;
      freeShutCats(s, ev);
      break;
    }
    case "free":
    default:
      mark(c);
  }
  return { ok };
}

/** v0.7: hauling out of an awake dog's room is leaving it; a haul that fails there is chased back and drops the prize. MUTATES s. */
function failedHaulChase(s, group, ev) {
  const room = group[0]?.where;
  const p = room ? hostilePet(s, room) : null;
  if (!p) return;
  for (const x of group) if (x.status === "free" && x.where === room) chaseBack(s, x, p, ev);
}

function freeShutCats(s, ev) {
  const shut = s.cats.filter(x => x.status === "shut");
  for (const x of shut) Object.assign(x, { status: "free", where: s.den });
  if (shut.length) ev.push({ type: "denOpen", text: `The Den door is open: ${shut.map(x => x.name).join(" and ")} ${shut.length > 1 ? "are" : "is"} free.` });
}

/* ---------------------------------------------------------------- help -- */

/** A cat says it will help a gang mate this round (Ch 4 "Doing it together"); null cancels. */
export function queueHelp(state, helperId, targetId) {
  const s = clone(state);
  const h = catById(s, helperId);
  if (!h) throw new Error("No such cat");
  s.help ??= {};
  if (!targetId) { delete s.help[helperId]; return { state: s, events: [] }; }
  const t = catById(s, targetId);
  if (!t || t.id === h.id) throw new Error("Help whom?");
  if (!turnOpen(s)) throw new Error("Wait for the round to begin.");
  if (h.acted) throw new Error(`${h.name} has already acted this round.`);
  if (!(h.status === t.status && h.where === t.where && (h.status === "free" || h.status === "outside"))) throw new Error(`${h.name} must be with ${t.name} to help.`);
  s.help[helperId] = targetId;
  const ev = [{ type: "help", text: `${h.name} will help ${t.name}.` }];
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** Mark a cat's Move or Action used by hand ("I acted"), or give it back (the Storyteller). */
export function markTurn(state, catId, { moved, acted }) {
  const s = clone(state);
  const c = catById(s, catId);
  if (!c) throw new Error("No such cat");
  if (moved !== undefined) c.moved = !!moved;
  if (acted !== undefined) c.acted = !!acted;
  return { state: s, events: [] };
}

export { wayBetween };
