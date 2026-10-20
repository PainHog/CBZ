/**
 * NINE LIVES GANG — the Mood ledger (pure)
 * ----------------------------------------
 * The house's Mood is two meters, Broom and Cuddle, each filling to the house's
 * Patience (Ch 5). Instead of storing the meters, the robbery keeps a ledger of
 * every change and the meters are a fold of it (AUTOMATION.md §3, the pattern
 * from Heisty Spideys' Alert ledger), so:
 *  - one event, one change: an entry is keyed by its eventId (a roll card's
 *    message id), and re-applying the same event replaces it instead of adding
 *    to it — a re-rendered card or a reconnecting GM can't double-count;
 *  - a Push paid with the Mood, or the GM flipping "seen", amends the roll's
 *    entry and the meters re-fold;
 *  - a roll entry stores the roll's facts, not its steps: the fold works out
 *    the steps with rules.moodDelta against the meters as they stood at that
 *    point, so "a Flop goes on the fuller meter" stays right after an undo.
 *
 * Entry kinds:
 *   roll       { approach, result, seen, kid, pushedWithMood }      → moodDelta
 *   step       { side, steps, candidates? }   temptation / mess / discovery / spotted / owner finds it gone / manual
 *   trigger    { side, target }  Shoo! or Scooped!: that meter empties, Patience −1 (min 2)
 *   set        { broom?, cuddle?, patience? }  the GM sets a value outright
 * Every entry: { id, eventId, seq, round, kind, cause, catId?, seenBy?, pending?, rejected? }.
 * `pending` entries (autoMood "confirm") wait for the GM's click and don't count yet.
 */
import { CATB } from "../config.mjs";
import { moodDelta } from "./rules.mjs";

const R = CATB.rules;
export const SIDES = Object.freeze(["broom", "cuddle"]);

/** The entries that count: confirmed, not rejected, one per eventId (the latest by seq). */
export function liveEntries(ledger = []) {
  const byEvent = new Map();
  const out = [];
  for (const e of [...ledger].sort((a, b) => a.seq - b.seq)) {
    if (e.pending || e.rejected) continue;
    if (e.eventId && e.kind !== "trigger") {
      const prev = byEvent.get(e.eventId);
      if (prev) out.splice(out.indexOf(prev), 1);
      byEvent.set(e.eventId, e);
    }
    out.push(e);
  }
  return out;
}

/**
 * Replay the ledger.
 * @returns {{broom:number, cuddle:number, patience:number, full:{broom:boolean,cuddle:boolean},
 *   resolved: Object<string,{side:string,steps:number,before:{broom,cuddle}}>, triggers: object[]}}
 */
export function foldMood(ledger, patience0) {
  let broom = 0, cuddle = 0, patience = Math.max(R.minPatience, patience0);
  const resolved = {};
  const triggers = [];
  const clamp = () => { broom = Math.max(0, Math.min(patience, broom)); cuddle = Math.max(0, Math.min(patience, cuddle)); };
  for (const e of liveEntries(ledger)) {
    const before = { broom, cuddle };
    if (e.kind === "trigger") {
      if (e.side === "broom") broom = 0; else cuddle = 0;
      patience = Math.max(R.minPatience, patience - R.patienceDrop);
      clamp();
      triggers.push(e);
      resolved[e.id] = { side: e.side, steps: 0, before };
      continue;
    }
    if (e.kind === "set") {
      if (Number.isFinite(e.patience)) patience = Math.max(R.minPatience, e.patience);
      if (Number.isFinite(e.broom)) broom = e.broom;
      if (Number.isFinite(e.cuddle)) cuddle = e.cuddle;
      clamp();
      resolved[e.id] = { side: null, steps: 0, before };
      continue;
    }
    const d = e.kind === "roll"
      ? moodDelta({ result: e.result, approach: e.approach, seen: !!e.seen, mood: { broom, cuddle },
        pushedWithMood: !!e.pushedWithMood, kidDoubles: !!e.kid })
      : { side: e.side, steps: Number(e.steps) || 0 };
    if (d.side === "broom") broom += d.steps; else cuddle += d.steps;
    clamp();
    resolved[e.id] = { side: d.side, steps: d.steps, before };
  }
  return { broom, cuddle, patience, full: { broom: broom >= patience, cuddle: cuddle >= patience }, resolved, triggers };
}

/** Next sequence number for a ledger. */
export const nextSeq = ledger => (ledger ?? []).reduce((m, e) => Math.max(m, e.seq ?? 0), 0) + 1;

/**
 * Add an entry, or replace the entry with the same eventId (one event, one change).
 * Returns { ledger, entry }. The replaced entry keeps its place (its seq), so an
 * amended roll still folds where the roll happened.
 */
export function upsertEntry(ledger = [], entry) {
  const list = [...ledger];
  const i = entry.eventId && entry.kind !== "trigger" ? list.findIndex(e => e.eventId === entry.eventId && e.kind !== "trigger") : -1;
  if (i >= 0) {
    const merged = { ...list[i], ...entry, id: list[i].id, seq: list[i].seq };
    list[i] = merged;
    return { ledger: list, entry: merged, replaced: true };
  }
  const seq = nextSeq(list);
  const made = { ...entry, id: entry.id ?? `m${seq}`, seq };
  list.push(made);
  return { ledger: list, entry: made, replaced: false };
}

/** A roll entry from a roll card's facts. */
export function rollEntry(card, { round = 0, pending = false } = {}) {
  return {
    kind: "roll", eventId: card.eventId, round, catId: card.catId ?? null,
    approach: card.approach, result: card.result, seen: !!card.seen, kid: !!card.kid,
    pushedWithMood: !!card.pushedWithMood, seenBy: [...(card.seenBy ?? [])],
    cause: card.label ?? `${card.catName ?? "A cat"}: ${card.approach} roll`, pending
  };
}

/** A fixed step (temptation, mess, discovery, owner finds it gone, manual ±). */
export function stepEntry({ side, steps, cause, catId = null, candidates = null, seenBy = [], eventId = null, round = 0, kind = "step", pending = false }) {
  if (!SIDES.includes(side)) throw new Error(`stepEntry: bad side ${side}`);
  const e = { kind, side, steps, cause, catId, seenBy: [...seenBy], eventId, round, pending };
  if (candidates) e.candidates = [...candidates]; // v0.7: the cats the human can see, for a meter filled with no roll
  return e;
}

/** Remove the latest entry (the GM's undo). Returns { ledger, removed }. */
export function undoLast(ledger = []) {
  if (!ledger.length) return { ledger: [], removed: null };
  const sorted = [...ledger].sort((a, b) => a.seq - b.seq);
  const removed = sorted.at(-1);
  return { ledger: ledger.filter(e => e !== removed), removed };
}

/** Steps a meter can still take before it fills (for "Broom nearly full" warnings). */
export function roomLeft(fold, side) {
  return Math.max(0, fold.patience - fold[side]);
}
