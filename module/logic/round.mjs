/**
 * NINE LIVES GANG — a robbery, round by round (pure)
 * --------------------------------------------------
 * The robbery state (AUTOMATION.md §2) and every change to it that isn't a
 * cat's own turn (those are in actions.mjs): setting up a robbery, beginning a
 * round (the Prize Clock, temptation), the Mood (ledger entries, Shoo! and
 * Scooped!), the house's turn (Ch 6), the end check, the outcome, and the
 * Storyteller's manual controls.
 *
 * Every public function takes a state and returns { state, events, ... } with a
 * NEW state (the input is never changed). Events are { type, text, ... }: the
 * runtime logs them and builds chat cards from them. Dice come from ctx.d6().
 * Cattitude lives on the cat actors, so functions that change it return
 * `cattitude: [{ catId, delta, why }]` for the runtime to apply.
 */
import { CATB } from "../config.mjs";
import { foldMood, upsertEntry, stepEntry, undoLast, liveEntries } from "./mood.mjs";
import { shooEntrances, wayId, waysFrom, fits } from "./map.mjs";
import {
  watchers, catById, humanByKey, petByKey, roomName, freeInside, leadWatcher, isAsleep, catsInSight, parrotsLook,
  petsAct, resolveNoise, humanRoutines, holdersRoll, petsReturn, addNoise, hasTrait, findingIt, hostilePet
} from "./residents.mjs";
import { newPrize, gangScaling, prizeClock, prizePhase, isDisturbed, dropPrize, robberyOutcome, OUTCOME_LABEL, prizeGot } from "./prize.mjs";
import { humanTraits } from "./house-catalog.mjs";

const R = CATB.rules;
const LOG_CAP = 200;
const APPLIED_CAP = 400;
const METER = { broom: "Broom", cuddle: "Cuddle" };

export const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

/* ------------------------------------------------------------ set up -- */

/**
 * A new robbery at a catalog house (Ch 11 "Before you start"): every cat
 * outside, the Mood at 0, Patience and the Prize Clock adjusted for gang size.
 * @param {object} house  a catalog entry (house-catalog.mjs)
 * @param {object} opts   { id, cats: [{ id, actorId, name, r: {sneaky,…}, instincts, body, img }], gangSize }
 */
export function newRobbery(house, { id = "robbery", cats = [], gangSize = null } = {}) {
  const g = gangSize ?? cats.length;
  const sc = gangScaling(g);
  const goneAt = house.prize.goneAt + sc.clock;
  const humans = house.humans.map(h => ({
    key: h.key, name: h.name, kind: h.kind, attention: h.attention ?? 0, traits: humanTraits(h),
    routine: [...(h.routine ?? [])], start: h.start, room: h.start, actorId: null,
    distractedRound: -1, distractions: 0, holding: null, asleepUntil: -1, searching: false, staysRound: -1, answeredRound: -1
  }));
  const pets = house.pets.map(p => ({
    key: p.key, name: p.name, kind: p.kind, rating: p.rating ?? 0, soft: !!p.soft, start: p.start, room: p.start,
    roam: [...(p.roam ?? [])], routine: p.routine ? [...p.routine] : null, actorId: null,
    mode: p.kind === "dog" && p.asleep ? "asleep" : "awake", until: -1
  }));
  const ways = house.ways.map(([a, b, size, opts]) => ({ id: wayId(a, b), a, b, size, open: !opts, opts: opts ? opts.map(o => [...o]) : null }));
  const denWay = ways.find(w => w.a === house.den || w.b === house.den);
  if (denWay) denWay.den = true;
  const state = {
    v: 1, id, houseKey: house.key, name: house.name, label: house.label, gangSize: g,
    phase: "robbery", stage: "between", round: 0, roundSerial: 0,
    patience0: Math.max(R.minPatience, house.patience + sc.patience), housePatience: house.patience,
    cattitudeStart: R.cattitudeStart + (sc.cattitude ?? 0),
    moodLedger: [],
    clock: { goneAt, lightsOut: goneAt + R.lightsOut },
    rooms: Object.fromEntries(Object.entries(house.rooms).map(([k, r]) => [k, { name: r.name, tempt: [...(r.tempt ?? [])], hide: r.hide !== false }])),
    map: house.map ? clone(house.map) : null,
    ways,
    entrances: house.entrances.map(e => ({ key: e.key, name: e.name, room: e.room, size: e.size, opts: (e.opts ?? []).map(o => [...o]),
      climb: !!e.climb, rounds: e.rounds ? [...e.rounds] : null, one: !!e.one, letOut: !!e.letOut, noisy: !!e.noisy, jam: !!e.jam, open: true })),
    den: house.den,
    cats: cats.map(catEntry),
    humans, pets,
    prize: null,
    noise: [], messes: [], help: {}, temptation: null, applied: [], log: [], outcome: null
  };
  state.prize = newPrize(house, humans, g, goneAt);
  pushLog(state, [{ type: "start", text: `The robbery at ${house.name} begins: ${g} cats (${state.cattitudeStart} Cattitude each), Patience ${state.patience0}, the ${house.prize.name} is gone at the start of round ${goneAt}, Lights Out at the end of round ${goneAt + R.lightsOut}.` }]);
  return state;
}

/** A cat's place in the robbery (its stats are a snapshot of the actor, refreshed by the runtime). */
export function catEntry(c) {
  return {
    id: c.id, actorId: c.actorId ?? c.id, name: c.name, img: c.img ?? null,
    r: { sneaky: 1, sweet: 1, savage: 1, streetwise: 1, ...(c.r ?? {}) }, instincts: [...(c.instincts ?? [])], body: c.body ?? "lean",
    where: "outside", status: "outside", hidden: false, carrying: false, riding: null, heldBy: null,
    moved: false, acted: false, slipped: [], temptUsed: []
  };
}

/** Refresh a cat's stats from its actor (name, ratings, instincts, body). */
export function refreshCat(state, snap) {
  const s = clone(state);
  const c = catById(s, snap.id);
  if (!c) return { state: s, events: [] };
  Object.assign(c, { name: snap.name ?? c.name, img: snap.img ?? c.img, r: { ...c.r, ...(snap.r ?? {}) }, instincts: [...(snap.instincts ?? c.instincts)], body: snap.body ?? c.body });
  return { state: s, events: [] };
}

/* ------------------------------------------------------------ the log -- */

export function pushLog(s, events) {
  for (const e of events) if (e?.text) s.log.push({ round: s.round, type: e.type, text: e.text });
  if (s.log.length > LOG_CAP) s.log.splice(0, s.log.length - LOG_CAP);
}

/** Remember an applied event (a roll card) so it never applies twice. */
export function markApplied(s, eventId) {
  if (!eventId) return;
  if (!s.applied.includes(eventId)) s.applied.push(eventId);
  if (s.applied.length > APPLIED_CAP) s.applied.splice(0, s.applied.length - APPLIED_CAP);
}
export const isApplied = (state, eventId) => !!eventId && (state?.applied ?? []).includes(eventId);

/* ------------------------------------------------------------ the Mood -- */

/** The meters now. */
export function moodNow(state) {
  return foldMood(state.moodLedger ?? [], state.patience0);
}

/**
 * Add a Mood entry and settle it (Ch 5): when its meter fills, the human who
 * saw it acts on the cat (Shoo! or Scooped!); with nobody with free hands in
 * sight the meter stays full until someone can see a cat (settleWaiting).
 * `mode`: "auto" applies; "confirm" adds it pending (the GM clicks ✓); "manual" only reports it.
 * `wait`: the autoMood setting for a meter left waiting ("manual": it never goes off by itself).
 * MUTATES s. Returns the entry (or null in manual mode).
 */
export function addMood(s, raw, ev, mode = "auto", { wait = mode } = {}) {
  if (mode === "manual") {
    ev.push({ type: "moodAdvice", text: `Mood (by hand): ${raw.cause ?? "a roll"}.` });
    return null;
  }
  const pending = mode === "confirm";
  const { ledger, entry } = upsertEntry(s.moodLedger, { ...raw, round: raw.round ?? s.round, pending });
  s.moodLedger = ledger;
  if (pending) {
    ev.push({ type: "moodProposed", entry: entry.id, text: `Mood change waiting for the Storyteller: ${entry.cause ?? ""}.` });
    return entry;
  }
  settleMood(s, entry, ev, wait);
  return entry;
}

/** Fold, report the change, and fire Shoo!/Scooped! if this entry filled a meter on a cat in sight. MUTATES s. */
export function settleMood(s, entry, ev, wait = "auto") {
  const fold = foldMood(s.moodLedger, s.patience0);
  const r = fold.resolved[entry.id];
  if (!r || !r.side) return;
  if (r.steps) {
    ev.push({ type: "mood", side: r.side, steps: r.steps, entry: entry.id,
      text: `${METER[r.side]} ${r.steps > 0 ? "+" : ""}${r.steps} (${fold[r.side]}/${fold.patience})${entry.cause ? `: ${entry.cause}` : ""}.` });
  }
  if (r.steps <= 0 || !fold.full[r.side]) return;
  // v0.8 (REVIEW #83): with nobody to act on this entry's cat, the meter waits — unless a human with free hands can see a cat right now
  const full = () => {
    if (!s.pendingTrigger && settleWaiting(s, ev, wait)) return;
    ev.push({ type: "moodFull", side: r.side,
      text: `${METER[r.side]} is full, but nobody with free hands can see a cat: it stays full, and as soon as someone can, they act at once.` });
  };
  // v0.7: a meter filled with no roll (spotted, a find, a mess) falls on a cat that human can see — the Storyteller's pick
  if (!entry.catId && entry.candidates) {
    const cats = entry.candidates.map(id => catById(s, id)).filter(c => c && c.status === "free");
    const human = (entry.seenBy ?? []).map(k => humanByKey(s, k)).find(h => h && !isAsleep(s, h));
    if (!cats.length || !human) return full();
    if (cats.length === 1) return trigger(s, r.side, cats[0], human, entry, ev);
    s.pendingTrigger = { side: r.side, human: human.key, candidates: cats.map(c => c.id), entry: entry.id, round: s.round };
    ev.push({ type: "pickTarget", side: r.side, human: human.key, cats: cats.map(c => c.id),
      text: `${METER[r.side]} is full: the Storyteller picks which cat ${human.name} ${r.side === "broom" ? "chases out" : "picks up"} (${cats.map(c => c.name).join(" or ")}).` });
    return;
  }
  const cat = entry.catId ? catById(s, entry.catId) : null;
  const inside = cat && (cat.status === "free" || cat.status === "held");
  // the human who acts saw the roll; a human holding a cat still sees, but only acts on the cat they hold (REVIEW #71)
  const who = inside ? (entry.seenBy ?? []).map(k => humanByKey(s, k)).filter(h => h && !isAsleep(s, h) && (!h.holding || h.holding === cat.id)) : [];
  if (!inside || !who.length) return full();
  // a held cat's own roll: its holder acts (Broom: the holder lets go and shoos it out, REVIEW #72)
  const actor = (cat.status === "held" && who.find(h => h.holding === cat.id)) || leadWatcher(who);
  trigger(s, r.side, cat, actor, entry, ev);
}

/**
 * Ch 5 (v0.8, REVIEW #71, #83): a full meter that nobody could act on waits
 * for someone with free hands; as soon as a human with free hands can see a
 * cat, that human (the highest Attention; ties, the Storyteller's pick = house
 * order) acts at once, on a cat they can see — one cat at once, several the
 * Storyteller's pick (a pending pick; the cats wait for it). Broom first, then
 * Cuddle. Returns true if a meter went off or a pick is now waiting. MUTATES s.
 */
export function settleWaiting(s, ev, mode = "auto") {
  if (mode === "manual" || s.phase !== "robbery") return false;
  let acted = false;
  for (const side of ["broom", "cuddle"]) {
    if (s.pendingTrigger) return acted; // the Storyteller is picking first
    if (!foldMood(s.moodLedger, s.patience0).full[side]) continue;
    const lookers = (s.humans ?? []).filter(h => !h.holding).map((h, i) => ({ h, i, cats: catsInSight(s, h) })).filter(x => x.cats.length);
    if (!lookers.length) continue;
    const tie = lookers.filter(x => (x.h.attention ?? 0) === Math.max(...lookers.map(y => y.h.attention ?? 0))).length > 1;
    const { h, cats } = lookers.sort((a, b) => (b.h.attention ?? 0) - (a.h.attention ?? 0) || a.i - b.i)[0];
    ev.push({ type: "waitingActs", side, human: h.key,
      text: `${METER[side]} was waiting full: ${h.name}${tie ? " (a tie: the Storyteller's pick)" : ""} can see ${cats.map(c => c.name).join(" and ")} and acts at once.` });
    acted = true;
    if (cats.length === 1) { trigger(s, side, cats[0], h, null, ev); continue; }
    s.pendingTrigger = { side, human: h.key, candidates: cats.map(c => c.id), entry: null, round: s.round };
    ev.push({ type: "pickTarget", side, human: h.key, cats: cats.map(c => c.id),
      text: `${METER[side]} is full: the Storyteller picks which cat ${h.name} ${side === "broom" ? "chases out" : "picks up"} (${cats.map(c => c.name).join(" or ")}).` });
  }
  return acted;
}

/**
 * After any change to the robbery (v0.8): parrots note who they saw this round,
 * and a waiting meter goes off as soon as someone with free hands can see a cat.
 * MUTATES s.
 */
export function look(s, ev, mode = "auto") {
  if (s.phase !== "robbery") return;
  parrotsLook(s);
  settleWaiting(s, ev, mode);
}

/** The Storyteller picks the cat for a meter that filled with no roll (v0.7). */
export function resolvePendingTrigger(state, catId, ctx = {}) {
  const s = clone(state);
  const p = s.pendingTrigger;
  if (!p) throw new Error("No meter is waiting for the Storyteller's pick.");
  if (!p.candidates.includes(catId)) throw new Error("That cat wasn't in sight.");
  const cat = catById(s, catId);
  const human = humanByKey(s, p.human);
  const ev = [];
  if (!foldMood(s.moodLedger, s.patience0).full[p.side]) { s.pendingTrigger = null; ev.push({ type: "moodFull", text: "That meter isn't full any more: nobody is chased out or picked up." }); }
  else if (!cat || cat.status !== "free" || !human) { s.pendingTrigger = null; ev.push({ type: "moodFull", text: "That cat isn't there any more: the meter stays full until someone with free hands can see a cat." }); }
  else trigger(s, p.side, cat, human, s.moodLedger.find(e => e.id === p.entry) ?? null, ev);
  look(s, ev, ctx.mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/**
 * Ch 5 "Shoo!" / "Scooped!" and "After a Shoo! or a Scoop" (v0.8). Shoo!: out
 * through the nearest entrance that works this round (ties: the Storyteller's
 * pick, house order here), which the human shuts, and the human stays in that
 * entrance's room this round; a cat chased out can't come back in this turn.
 * Scooped!: the human picks the cat up. Either way a carried prize goes back
 * where the Clock last put it, every step of its spot to do again. MUTATES s.
 */
export function trigger(s, side, cat, human, cause, ev) {
  const undo = {
    cat: clone(cat), prize: clone(s.prize), cats: clone(s.cats.filter(c => c.carrying || c.id === cat.id)),
    human: clone(human), holder: cat.heldBy ? clone(humanByKey(s, cat.heldBy)) : null, entrance: null,
    pending: s.pendingTrigger ? clone(s.pendingTrigger) : null
  };
  const carried = cat.carrying;
  if (s.pendingTrigger?.side === side) s.pendingTrigger = null;
  if (carried) dropPrize(s, { putBack: true });
  let entrance = null;
  if (side === "broom") {
    if (cat.heldBy) { const holder = humanByKey(s, cat.heldBy); if (holder) holder.holding = null; }
    const near = shooEntrances(s, cat.where);
    entrance = near[0] ?? null;
    if (entrance) { undo.entrance = { key: entrance.key, open: entrance.open }; entrance.open = false; }
    const from = cat.where;
    Object.assign(cat, { where: "outside", status: "outside", hidden: false, riding: null, heldBy: null, carrying: false, outSerial: s.roundSerial });
    if (entrance) { human.room = entrance.room; human.shooRound = s.round; }
    const tie = near.length > 1 ? " (as near as another: the Storyteller's pick)" : "";
    ev.push({ type: "shoo", cat: cat.id, human: human.key, entrance: entrance?.key ?? null, from,
      text: `Shoo! ${human.name} grabs the broom and chases ${cat.name} out through the ${entrance?.name ?? "nearest way out"}${tie}${entrance ? `, shuts it and stays in the ${roomName(s, entrance.room).toLowerCase()}` : ""}.${carried ? ` ${cat.name} drops the ${s.prize.name}, and ${human.name} puts it back where it was: every step to do again.` : ""}` });
  } else {
    if (cat.heldBy && cat.heldBy !== human.key) { const old = humanByKey(s, cat.heldBy); if (old) old.holding = null; }
    human.holding = cat.id;
    human.room = cat.where;
    Object.assign(cat, { status: "held", heldBy: human.key, hidden: false, riding: null, carrying: false });
    ev.push({ type: "scooped", cat: cat.id, human: human.key,
      text: `Scooped! ${human.name} picks ${cat.name} up: "Ooh, look at you!" ${cat.name} is Held.${carried ? ` The ${s.prize.name} goes back where it was: every step to do again.` : ""}` });
  }
  const { ledger } = upsertEntry(s.moodLedger, { kind: "trigger", side, target: cat.id, by: human.key, entrance: entrance?.key ?? null,
    round: s.round, cause: `${side === "broom" ? "Shoo!" : "Scooped!"} ${cat.name}`, from: cause?.id ?? null, undo });
  s.moodLedger = ledger;
  const fold = foldMood(s.moodLedger, s.patience0);
  ev.push({ type: "patience", text: `${METER[side]} empties; Patience drops to ${fold.patience}.` });
}

/** The GM confirms a pending entry (autoMood "confirm"). */
export function confirmMood(state, entryId, { accept = true, mood = "auto" } = {}) {
  const s = clone(state);
  const ev = [];
  const e = s.moodLedger.find(x => x.id === entryId);
  if (!e) throw new Error(`No Mood entry ${entryId}`);
  if (accept) { e.pending = false; settleMood(s, e, ev, mood); } else { e.pending = false; e.rejected = true; ev.push({ type: "moodRejected", text: `Mood change dropped: ${e.cause ?? ""}.` }); }
  look(s, ev, mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** The GM's ± on a meter (kind "manual"; no cat: a fill goes off on a cat a human with free hands can see, else waits). */
export function manualMood(state, side, steps, ctx = {}) {
  const s = clone(state);
  const ev = [];
  addMood(s, stepEntry({ side, steps, cause: `the Storyteller ${steps > 0 ? "adds" : "takes off"} ${Math.abs(steps)}`, kind: "manual" }), ev, "auto", { wait: ctx.mood ?? "auto" });
  look(s, ev, ctx.mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** The GM sets a meter or Patience outright (a meter set full waits for a cat seen, like any other). */
export function setMood(state, { broom, cuddle, patience }, ctx = {}) {
  const s = clone(state);
  const { ledger } = upsertEntry(s.moodLedger, { kind: "set", broom, cuddle, patience, round: s.round, cause: "set by the Storyteller" });
  s.moodLedger = ledger;
  const f = foldMood(s.moodLedger, s.patience0);
  const ev = [{ type: "moodSet", text: `The Storyteller sets the Mood: Broom ${f.broom}, Cuddle ${f.cuddle}, Patience ${f.patience}.` }];
  look(s, ev, ctx.mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/**
 * Undo the latest ledger entry. A Shoo!/Scooped! puts the cat, the human, the
 * entrance and the prize back. (Undo doesn't look round: a meter that is full
 * again goes off on the next change to the robbery, if a human can see a cat.)
 */
export function undoMood(state) {
  const s = clone(state);
  const { ledger, removed } = undoLast(s.moodLedger);
  s.moodLedger = ledger;
  const ev = [];
  if (!removed) return { state: s, events: ev };
  if (removed.kind === "trigger" && removed.undo) {
    const u = removed.undo;
    for (const c of u.cats ?? []) { const i = s.cats.findIndex(x => x.id === c.id); if (i >= 0) s.cats[i] = c; }
    const ci = s.cats.findIndex(x => x.id === u.cat.id); if (ci >= 0) s.cats[ci] = u.cat;
    if (u.prize) s.prize = u.prize;
    for (const h of [u.human, u.holder].filter(Boolean)) { const i = s.humans.findIndex(x => x.key === h.key); if (i >= 0) s.humans[i] = h; }
    if (u.entrance) { const e = s.entrances.find(x => x.key === u.entrance.key); if (e) e.open = u.entrance.open; }
    if (u.pending) s.pendingTrigger = u.pending;
  }
  // a pick waiting on a meter that is no longer full (its cause was undone) is dropped
  if (s.pendingTrigger && !foldMood(s.moodLedger, s.patience0).full[s.pendingTrigger.side]) s.pendingTrigger = null;
  ev.push({ type: "moodUndo", text: `Undone: ${removed.cause ?? removed.kind}.` });
  pushLog(s, ev);
  return { state: s, events: ev };
}

/* ------------------------------------------------------------ rounds -- */

/**
 * Ch 6 "A round", start: the Prize Clock acts, then the Storyteller may tempt one cat.
 * ctx: { prizeClock: bool (autoPrizeClock), mood: "auto"|"confirm"|"manual" }
 */
export function beginRound(state, ctx = {}) {
  if (state.phase !== "robbery") throw new Error("There is no robbery running.");
  const s = clone(state);
  const ev = [];
  s.round += 1;
  s.roundSerial += 1;
  s.stage = "cats";
  for (const c of s.cats) { c.moved = false; c.acted = false; c.slipped = []; c.dealt = []; }
  s.temptedLast = s.temptation?.catId ?? null; // v0.7: never the same cat two rounds running
  s.noise = []; s.help = {}; s.temptation = null; // messes stay until a human finds them (v0.6)
  ev.push({ type: "round", text: `Round ${s.round} begins.` });
  if (ctx.prizeClock !== false) {
    const pc = prizeClock(s);
    ev.push(...pc.events);
    for (const m of pc.mood) addMood(s, stepEntry({ ...m, catId: null }), ev, ctx.mood ?? "auto");
  }
  const left = s.clock.goneAt - s.round;
  if (!s.prize.gone && !prizeGot(s) && left > 0 && left <= 2) ev.push({ type: "clockWarning", text: `The ${s.prize.name} is gone at the start of round ${s.clock.goneAt}.` });
  if (s.round === s.clock.lightsOut) ev.push({ type: "lastRound", text: `Last round: Lights Out falls at the end of this round.` });
  look(s, ev, ctx.mood ?? "auto");
  pushLog(s, ev);
  return { state: s, events: ev, tempt: temptationOptions(s) };
}

/* -------------------------------------------------------- temptation -- */

/**
 * Ch 7: the instincts a room tempts. A robot vacuum tempts Hunters wherever it
 * is; any room with an awake dog or house cat in it tempts Scrappers (v0.6).
 */
export function roomTemptations(s, room) {
  const list = [...(s.rooms[room]?.tempt ?? [])];
  const pets = (s.pets ?? []).filter(p => p.room === room);
  if (pets.some(p => p.kind === "vacuum") && !list.includes("hunter")) list.push("hunter");
  if (pets.some(p => (p.kind === "dog" || p.kind === "housecat") && p.mode !== "asleep" && p.mode !== "hiding") && !list.includes("scrapper")) list.push("scrapper");
  return list;
}

/**
 * Ch 7 "Temptation": the cats the Storyteller may tempt this round — free cats in
 * a room with a temptation for one of their instincts, never the cat tempted
 * last round (v0.7), who haven't moved or acted yet. One per round; the tempted
 * cat decides at once (actions.mjs holds the others back until it answers), and
 * a cat that gives in has acted first.
 */
export function temptationOptions(state) {
  if (state.phase !== "robbery" || state.stage !== "cats" || state.temptation) return [];
  const out = [];
  for (const c of freeInside(state)) {
    if (c.moved || c.acted || c.id === state.temptedLast) continue;
    const here = roomTemptations(state, c.where);
    for (const i of c.instincts) {
      const key = `${c.where}:${i}`;
      if (here.includes(i)) {
        out.push({ catId: c.id, catName: c.name, instinct: i, label: CATB.instincts[i]?.label ?? i, room: c.where, roomName: roomName(state, c.where), key,
          tempt: CATB.instincts[i]?.tempt ?? "" });
      }
    }
  }
  return out;
}

/** The Storyteller tempts one cat. `pick` is { catId, instinct } (or a d6 face to pick at random). */
export function tempt(state, pick) {
  const s = clone(state);
  const opts = temptationOptions(s);
  let choice = null;
  if (typeof pick === "number") choice = opts[(pick - 1) % Math.max(1, opts.length)] ?? null;
  else choice = opts.find(o => o.catId === pick?.catId && (!pick.instinct || o.instinct === pick.instinct)) ?? null;
  if (!choice) throw new Error("That cat can't be tempted now.");
  const c = catById(s, choice.catId);
  c.temptUsed.push(choice.key);
  s.temptation = { catId: c.id, instinct: choice.instinct, room: choice.room, key: choice.key, round: s.round, choice: null };
  const ev = [{ type: "tempted", cat: c.id, instinct: choice.instinct,
    text: `The Storyteller tempts ${c.name} (${choice.label}): ${choice.tempt} in the ${choice.roomName.toLowerCase()}.` }];
  pushLog(s, ev);
  return { state: s, events: ev, temptation: s.temptation };
}

/**
 * Ch 7: the tempted cat gives in (+1 Cattitude; the instinct thing is its
 * Action, done right away, there, never a roll; a carrier drops the prize in
 * that room first and the other carriers let go too) or resists (−1 Cattitude;
 * with none it must give in). A Lap Cat's player picks the human (`human`).
 * @param {{choice: "gaveIn"|"resisted", cattitude: number, human?: string}} answer
 */
export function answerTemptation(state, { choice, cattitude = 0, human = null }, ctx = {}) {
  const s = clone(state);
  const t = s.temptation;
  if (!t || t.choice) throw new Error("No temptation is waiting for an answer.");
  const c = catById(s, t.catId);
  const ev = [];
  const cat = [];
  let final = choice === "resisted" && cattitude <= 0 ? "gaveIn" : choice;
  if (final === "resisted") {
    cat.push({ catId: c.id, delta: -1, why: "resisted a temptation" });
    ev.push({ type: "resisted", cat: c.id, text: `${c.name} resists (−1 Cattitude).` });
  } else {
    if (choice === "resisted") ev.push({ type: "mustGiveIn", cat: c.id, text: `${c.name} has no Cattitude left to resist with.` });
    cat.push({ catId: c.id, delta: +1, why: "gave in to a temptation" });
    ev.push({ type: "gaveIn", cat: c.id, instinct: t.instinct, text: `${c.name} gives in (+1 Cattitude): ${CATB.instincts[t.instinct].giveInText}` });
    giveIn(s, c, t.instinct, ev, ctx.mood ?? "auto", human);
    c.acted = true;
  }
  t.choice = final;
  look(s, ev, ctx.mood ?? "auto");
  pushLog(s, ev);
  return { state: s, events: ev, cattitude: cat };
}

/** What giving in does (Ch 7 table). MUTATES s. */
function giveIn(s, c, instinct, ev, moodMode, pickHuman = null) {
  const g = CATB.instincts[instinct].giveIn;
  const room = c.where;
  if (c.carrying) {
    dropPrize(s);
    ev.push({ type: "dropped", cat: c.id, text: `${c.name} drops the ${s.prize.name} in the ${roomName(s, room).toLowerCase()}.` });
  }
  if (g.hidden) { c.hidden = true; c.riding = null; return; }
  c.hidden = false; // doing anything else ends hiding (CORE-RULES "Seen")
  const ws = watchers(s, room);
  if (g.fuss) {
    // Ch 7 (v0.6): its player picks a human in the room; Distracted until the house's turn; +1 Cuddle, 2 for a kid
    const here = s.humans.filter(h => h.room === room && !isAsleep(s, h) && !h.holding);
    if (!here.length) { ev.push({ type: "sunnySpot", cat: c.id, text: `Nobody to fuss: ${c.name} finds a sunny spot.` }); return; }
    const h = here.find(x => x.key === pickHuman) ?? ws[0] ?? here[0];
    h.distractedRound = s.round;
    const steps = hasTrait(h, "kid") ? (g.seen.kid ?? 2) : g.seen.steps;
    ev.push({ type: "fuss", cat: c.id, human: h.key, text: `${h.name} gives ${c.name} a fuss and is Distracted until the house's turn.` });
    addMood(s, stepEntry({ side: "cuddle", steps, cause: `${c.name} goes for a fuss with ${h.name}`, catId: c.id, seenBy: [h.key], kind: "temptation" }), ev, moodMode);
    return;
  }
  if (g.noise) addNoise(s, room, `${c.name} (${CATB.instincts[instinct].label})`, c.id, { mess: !!g.mess });
  if (g.seen && ws.length) {
    addMood(s, stepEntry({ side: g.seen.side, steps: g.seen.steps, cause: `${c.name} gives in to ${CATB.instincts[instinct].label} in view`, catId: c.id, seenBy: ws.map(h => h.key), kind: "temptation" }), ev, moodMode);
  }
}

/* ------------------------------------------------------ the house's turn -- */

/**
 * Ch 6 "The house's turn" (core rules v0.8): Distracted humans look round again
 * and cats that ended their turn by an unhandled dog are chased back; pets act
 * (a sleeping dog woken by noise acts at once; barks and the squawk of a parrot
 * that saw a cat this round are noise), noise is answered (not by the human the
 * Prize Clock moved this round), every other human follows their routine
 * (Searching humans hunt instead; sleepers stay put), holders roll, then
 * Finding it (spotted, the disturbed prize, messes); driven-off pets count down
 * and come back. Between the steps, a meter waiting full goes off as soon as a
 * human with free hands can see a cat (look).
 * ctx: { d6: () => 1..6, routines: bool, holders: bool, mood: mode }
 * Returns { state, events, end: endCheck(state) }.
 */
export function endRound(state, ctx = {}) {
  if (state.phase !== "robbery") throw new Error("There is no robbery running.");
  if (typeof ctx.d6 !== "function" && ctx.houseTurn !== false) throw new Error("endRound needs ctx.d6");
  const s = clone(state);
  const ev = [{ type: "houseTurn", text: `The house's turn (round ${s.round}).` }];
  const mood = ctx.mood ?? "auto";
  s.stage = "house";
  if (ctx.houseTurn === false) {
    // autoHouseTurn "manual": the Storyteller runs the house by hand; only the round's bookkeeping happens here
    ev.push({ type: "manualHouse", text: "The Storyteller runs the house's turn by hand." });
    s.noise = []; s.help = {};
    s.stage = "between";
    const end = endCheck(s);
    if (end.due) ev.push({ type: "endDue", reason: end.reason, text: end.text });
    pushLog(s, ev);
    return { state: s, events: ev, end };
  }
  look(s, ev, mood); // Distraction ends as the house's turn starts: they look round again
  dogsChase(s, ev);
  look(s, ev, mood);
  petsAct(s, ctx, ev);
  look(s, ev, mood);
  const { answered } = resolveNoise(s, ev);
  look(s, ev, mood);
  humanRoutines(s, ctx, answered, ev);
  look(s, ev, mood);
  if (ctx.holders !== false) holdersRoll(s, ctx, ev, { shutInDen: (c, h) => shutInDen(s, c, h) });
  look(s, ev, mood);
  const found = findingIt(s, ev, { disturbed: isDisturbed(s.prize), inPlay: prizePhase(s) === "get" && !s.prize.withHuman });
  for (const m of found) addMood(s, stepEntry({ ...m }), ev, mood);
  look(s, ev, mood);
  petsReturn(s, ev);
  s.noise = []; s.help = {};
  s.stage = "between";
  const end = endCheck(s);
  if (end.due) ev.push({ type: "endDue", reason: end.reason, text: end.text });
  pushLog(s, ev);
  return { state: s, events: ev, end };
}

/**
 * Ch 10 (v0.7, v0.8): a cat that ends its turn in an awake dog's room — or a
 * house cat's, which guards like a dog's charge (REVIEW #89) — without dealing
 * with it (rolling, or helping the cat who rolls) is chased back the way it
 * came, outside again if it came in this round; a carrier drops the prize. A
 * cat that came in with no Action left (it climbed in) deals with it first
 * thing next turn instead. MUTATES s.
 */
export function dogsChase(s, ev) {
  for (const c of freeInside(s)) {
    const p = hostilePet(s, c.where, c);
    if (!p || (c.dealt ?? []).includes(p.key) || c.arrivedSpent === s.roundSerial) continue;
    chaseBack(s, c, p, ev);
  }
}

/**
 * The pet chases the cat back the way it came (else the first open way it
 * fits); a cat that came in from outside this round goes back outside (REVIEW
 * #74). A carrier drops the prize where it is. MUTATES s.
 */
export function chaseBack(s, c, p, ev) {
  if (c.cameFrom === "outside" && c.enteredSerial === s.roundSerial) {
    const e = s.entrances.find(x => x.key === c.enteredBy);
    if (c.carrying) { dropPrize(s); ev.push({ type: "dropped", cat: c.id, text: `${c.name} drops the ${s.prize.name}.` }); }
    Object.assign(c, { where: "outside", status: "outside", hidden: false, riding: null, outSerial: s.roundSerial });
    ev.push({ type: "chased", pet: p.key, cat: c.id, outside: true, text: `${p.name} chases ${c.name} back out${e ? ` through the ${e.name}` : ""}: it only just came in!` });
    return true;
  }
  const open = waysFrom(s, c.where).filter(x => x.way.open && fits(x.way.size, { body: c.body }));
  const away = open.find(x => x.to === c.cameFrom) ?? open[0];
  if (!away) { ev.push({ type: "chased", pet: p.key, cat: c.id, text: `${p.name} won't let ${c.name} by.` }); return false; }
  if (c.carrying) { dropPrize(s); ev.push({ type: "dropped", cat: c.id, text: `${c.name} drops the ${s.prize.name}.` }); }
  Object.assign(c, { cameFrom: c.where, where: away.to, hidden: false, riding: null });
  ev.push({ type: "chased", pet: p.key, cat: c.id, text: `${p.name} chases ${c.name} back into the ${roomName(s, away.to).toLowerCase()}!` });
  return true;
}

/** Ch 9 "Shut in": the cat goes in the Den and its door is shut while a cat is in it. MUTATES s. */
export function shutInDen(s, c, h) {
  Object.assign(c, { status: "shut", where: s.den, hidden: false, riding: null, heldBy: null, carrying: false });
  if (h) h.room = s.den;
  const w = s.ways.find(x => x.den);
  if (w) { if (!w.opts) w.opts = R.denDoor.map(o => [...o]); w.open = false; }
}

/**
 * Ch 8: the robbery ends at Lights Out (the end of the second round after the
 * prize goes), or as soon as no free cat is inside. While the prize is still
 * to get, cats outside may come back in, so an empty house ends the robbery
 * only once the prize is got or gone.
 */
export function endCheck(s) {
  if (s.phase !== "robbery") return { due: false };
  if (s.round >= s.clock.lightsOut) return { due: true, reason: "lightsOut", text: "Lights Out: the humans go to bed." };
  if (s.round < 1 || freeInside(s).length) return { due: false };
  if (prizePhase(s) === "out") return { due: true, reason: "allOut", text: "No free cat is inside: the robbery is over." };
  return { due: false };
}

/** Ch 8 "Getting out, and the end": the outcome. Any cat still inside is adopted. */
export function finishRobbery(state, reason = "manual") {
  const s = clone(state);
  const out = robberyOutcome(s);
  s.phase = "ended";
  s.stage = "between";
  s.outcome = { ...out, reason, label: OUTCOME_LABEL[out.result] };
  const names = out.leftBehind.map(id => catById(s, id)?.name).filter(Boolean);
  const ev = [{ type: "outcome", result: out.result,
    text: `${OUTCOME_LABEL[out.result]}!${names.length ? ` Left behind (adopted): ${names.join(", ")}.` : " Nobody was left behind."}` }];
  pushLog(s, ev);
  return { state: s, events: ev, outcome: s.outcome };
}

/* ----------------------------------------------- the Storyteller's hands -- */

/** Put a cat somewhere by hand (status follows: "outside", a room = free, or keep held/shut). */
export function placeCat(state, catId, where, { status = null, mood = "auto" } = {}) {
  const s = clone(state);
  const c = catById(s, catId);
  if (!c) throw new Error(`No cat ${catId}`);
  if (where === "outside") Object.assign(c, { where: "outside", status: "outside", hidden: false, riding: null });
  else {
    if (!s.rooms[where]) throw new Error(`No room ${where}`);
    if (c.status === "held" && status !== "held") { const h = humanByKey(s, c.heldBy); if (h) h.holding = null; c.heldBy = null; }
    Object.assign(c, { where, status: status ?? "free", riding: null });
  }
  if (c.status === "outside" && c.carrying) dropPrize(s, { putBack: true });
  const ev = [{ type: "placed", cat: c.id, text: `The Storyteller puts ${c.name} ${where === "outside" ? "outside" : `in the ${roomName(s, where).toLowerCase()}`}.` }];
  look(s, ev, mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** Move a human or pet by hand. */
export function placeResident(state, key, room, ctx = {}) {
  const s = clone(state);
  const r = humanByKey(s, key) ?? petByKey(s, key);
  if (!r) throw new Error(`No resident ${key}`);
  if (!s.rooms[room]) throw new Error(`No room ${room}`);
  r.room = room;
  const ev = [{ type: "placed", text: `The Storyteller moves ${r.name} to the ${roomName(s, room).toLowerCase()}.` }];
  look(s, ev, ctx.mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** Open or shut a way or an entrance by hand. */
export function setOpen(state, { way = null, entrance = null, open }) {
  const s = clone(state);
  const w = way ? s.ways.find(x => x.id === way) : null;
  const e = entrance ? s.entrances.find(x => x.key === entrance) : null;
  if (!w && !e) throw new Error("No such way or entrance");
  (w ?? e).open = !!open;
  const name = w ? `the way between the ${roomName(s, w.a).toLowerCase()} and the ${roomName(s, w.b).toLowerCase()}` : `the ${e.name}`;
  const ev = [{ type: "setOpen", text: `The Storyteller ${open ? "opens" : "shuts"} ${name}.` }];
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** Patch a human, pet or cat by hand (e.g. { mode: "friendly" }, { asleepUntil }, { moved: false }). */
export function patchResident(state, key, patch, ctx = {}) {
  const s = clone(state);
  const r = humanByKey(s, key) ?? petByKey(s, key) ?? catById(s, key);
  if (!r) throw new Error(`No one called ${key}`);
  Object.assign(r, patch);
  const ev = [];
  look(s, ev, ctx.mood);
  pushLog(s, ev);
  return { state: s, events: ev };
}

/** Mark a noise by hand (the Storyteller heard something). */
export function markNoise(state, room, { mess = false } = {}) {
  const s = clone(state);
  addNoise(s, room, "the Storyteller", null, { mess });
  const ev = [{ type: "noise", room, text: `Noise in the ${roomName(s, room).toLowerCase()}${mess ? " (and a mess)" : ""}.` }];
  pushLog(s, ev);
  return { state: s, events: ev };
}

/* -------------------------------------------------------- read helpers -- */

/** Who is where, for the tracker. */
export function roomsView(state) {
  const fold = moodNow(state);
  return Object.entries(state.rooms).map(([key, r]) => ({
    key, name: r.name, tempt: r.tempt,
    cats: state.cats.filter(c => c.where === key),
    humans: state.humans.filter(h => h.room === key),
    pets: state.pets.filter(p => p.room === key),
    prize: state.prize?.room === key && !state.prize.out && !state.prize.gone,
    noise: (state.noise ?? []).some(n => n.room === key),
    watched: watchers(state, key).length > 0,
    fold
  }));
}

export { prizeGot, prizePhase, hasTrait, liveEntries };
