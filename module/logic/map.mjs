/**
 * NINE LIVES GANG — the house as a graph of rooms (pure)
 * -----------------------------------------------------
 * Rooms are nodes; ways join them (Ch 8 "Ways through the house"). There is no
 * grid inside a room: a cat, human or pet is in a room or (cats) outside.
 * Works on robbery state (`state.ways`: [{ id, a, b, size, open, opts }]).
 */
import { CATB } from "../config.mjs";

const WAY = CATB.waySizes;
const PRIZE = CATB.prizeSizes;

export const wayId = (a, b) => [a, b].sort().join("~");

/** Every way touching a room: [{ to, way }]. */
export function waysFrom(state, room) {
  return (state.ways ?? []).filter(w => w.a === room || w.b === room).map(w => ({ to: w.a === room ? w.b : w.a, way: w }));
}

export function wayBetween(state, a, b) {
  return (state.ways ?? []).find(w => (w.a === a && w.b === b) || (w.a === b && w.b === a)) ?? null;
}

/** Rooms next to this one (through any way, open or shut). */
export const neighbours = (state, room) => waysFrom(state, room).map(x => x.to);

/** Rooms apart through any way — noise carries through shut doors (Ch 6). Infinity if unreachable. */
export function dist(state, a, b) {
  if (a === b) return 0;
  const seen = new Set([a]);
  let frontier = [a];
  let d = 0;
  while (frontier.length) {
    d++;
    const next = [];
    for (const r of frontier) for (const to of neighbours(state, r)) {
      if (to === b) return d;
      if (!seen.has(to)) { seen.add(to); next.push(to); }
    }
    frontier = next;
  }
  return Infinity;
}

/**
 * Can a cat (Lean or Chonky), maybe carrying a prize of `carry` size, pass this way or entrance?
 * Ch 8: Tight = Lean cats only, and Small things; Normal = up to Medium; Big = anything.
 */
export function fits(size, { body = "lean", carry = null } = {}) {
  if (size === "tight" && body !== "lean") return false;
  if (carry && PRIZE[carry] > WAY[size]) return false;
  return true;
}

/** Ch 8: the nearest entrances to a room (all tied at the shortest distance), in house order. */
export function nearestEntrances(state, room) {
  let best = Infinity;
  const out = [];
  for (const e of state.entrances ?? []) {
    const d = dist(state, room, e.room);
    if (d < best) { best = d; out.length = 0; out.push(e); } else if (d === best) out.push(e);
  }
  return out;
}

/** Ch 8: does this entrance work this round? (A front door only in the rounds its house lists.) */
export const worksThisRound = (state, e) => !e.rounds || e.rounds.includes(state.round);

/**
 * Ch 5 "Shoo!" (v0.9): the nearest entrances the cat fits through (a Chonky cat
 * doesn't fit a Tight one) that work this round (a front door only in its
 * rounds), shut or open — the human opens a shut one to put the cat out — all
 * tied at the shortest distance, in house order (the Storyteller picks between
 * ties). If none works for that cat, the nearest it fits through; if none fits,
 * the nearest of all. The holder's 6 (Ch 9) uses the same choice. `cat` may be
 * null (any body).
 */
export function shooEntrances(state, room, cat = null) {
  const all = state.entrances ?? [];
  const fit = all.filter(e => fits(e.size, { body: cat?.body ?? "lean" }));
  const works = fit.filter(e => worksThisRound(state, e));
  const pool = works.length ? works : fit.length ? fit : all;
  return nearestEntrances({ ...state, entrances: pool }, room);
}

/**
 * Ch 5 (v0.9): the house's last entrance still open — no other entrance is open
 * and without a round limit — is left open after a Shoo!.
 */
export const lastOpenEntrance = (state, e) => !(state.entrances ?? []).some(x => x !== e && x.key !== e.key && x.open && !x.rounds);

/**
 * Ch 8 "Meow at a door" (v0.9): any entrance that is a door counts — the front
 * door in any round, a back, patio or garage door, a door with a cat flap in
 * it — but not a window, a skylight or a climb. A house entry may say
 * `door: true|false`; otherwise it's read from the entrance (let-out front
 * doors, and anything not a climb whose name says door or flap).
 */
export function isDoorEntrance(e) {
  if (typeof e?.door === "boolean") return e.door;
  if (e?.letOut) return true;
  if (e?.climb || e?.size === "tight") return false;
  return /\b(door|flap)\b/i.test(e?.name ?? "");
}

/**
 * One room toward the nearest of `targets` (a pet's "sniff"). Pets pass closed doors (v0.7: `doors: true`);
 * otherwise only open ways count. Ties: the first in house order. Null when there's none.
 */
export function stepToward(state, from, targets, { doors = false } = {}) {
  let bd = Infinity, to = null;
  for (const { to: o, way } of waysFrom(state, from)) {
    if (!way.open && !doors) continue;
    for (const t of targets) { const d = dist(state, o, t); if (d < bd) { bd = d; to = o; } }
  }
  return to;
}
