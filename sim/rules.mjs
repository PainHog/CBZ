/**
 * Cat Burglars — rules functions the simulator plays by (core rules v0.1,
 * docs/CORE-RULES.md). Pure: plain data in, plain data out, dice from the
 * Rng passed in. Every judgement call is a named parameter (params.mjs), so
 * the same code can be swept across readings and packages.
 *
 * This file is the simulator's own copy of the rules. module/logic/ holds the
 * table's copy; a parity test checks the two agree on the adopted package.
 * When the rules move on, freeze this file as rules-v0_x.mjs first
 * (docs/LESSONS.md: keep the simulator measuring the version it was built for).
 */

export const APPROACHES = ["sneaky", "sweet", "savage", "streetwise"];

/** Which end of the Mood each approach leans toward: Broom is −1, Cuddle is +1 (CORE-RULES "The Mood"). */
export const LEAN = Object.freeze({ sneaky: -1, savage: -1, streetwise: -1, sweet: +1 });

export const INSTINCTS = ["curious", "knocker", "boxSitter", "hunter", "lapCat", "foodie", "climber", "scrapper"];

/**
 * Dice to roll (CORE-RULES "Rolling"): approach + Knack (max +1) + help (max +2),
 * capped at 5, then Difficulty, opposition and Attention remove dice.
 * Returns the number of dice; 0 or less means "roll 1, a 6 counts as a Scrape".
 */
export function poolSize({ rating, knack = false, helpers = 0, difficulty = 0, opposition = 0, attention = 0 }, p) {
  const bonus = (knack ? 1 : 0) + Math.min(helpers, p.helpCap);
  const removed = difficulty + opposition + attention;
  if (p.capOrder === "first") return Math.min(rating + bonus, p.diceCap) - removed;
  return Math.min(rating + bonus - removed, p.diceCap);
}

/** Read a roll by its highest die (CORE-RULES "Rolling" table). At 0 dice: roll 2, keep the lower, no better than a Scrape. */
export function readDice(faces, zeroPool) {
  if (zeroPool) return Math.min(...faces) >= 4 ? "scrape" : "flop";
  const hi = Math.max(...faces);
  const sixes = faces.filter(f => f === 6).length;
  if (sixes >= 2) return "purrfect";
  if (hi === 6) return "clean";
  if (hi >= 4) return "scrape";
  return "flop";
}

/** Roll a pool of n dice (n ≤ 0 → two dice, zero-pool reading). */
export function rollPool(rng, n) {
  const zero = n <= 0;
  const faces = rng.dice(zero ? 2 : n);
  return { faces, zero, result: readDice(faces, zero) };
}

/** Push (CORE-RULES "Push"): reroll every die that isn't a 6. */
export function pushRoll(rng, roll) {
  const faces = roll.faces.map(f => (f === 6 ? 6 : rng.d6()));
  return { faces, zero: roll.zero, result: readDice(faces, roll.zero), pushed: true };
}

export const RESULT_RANK = { flop: 0, scrape: 1, clean: 2, purrfect: 3 };
export const works = result => result !== "flop";
export const makesNoise = result => result === "flop" || result === "scrape";

/**
 * The Mood change from one roll (CORE-RULES "The Mood"). The Mood has two meters,
 * Broom and Cuddle, each filling up to the house's Patience.
 * - seen Clean/Scrape: 1 step on the approach's side (a Sneaky Clean: 0);
 * - seen Flop: 2 steps on the fuller side (the approach's side if they're level);
 * - a Push paid with the Mood adds 1 step to that roll's side, seen or not;
 * - one roll, one change (one event, one trigger).
 * Returns { side: "broom"|"cuddle", steps }.
 */
export function moodDelta({ result, approach, seen, mood, pushedWithMood = false, kidDoubles = false }, p) {
  const leanSide = LEAN[approach] > 0 ? "cuddle" : "broom";
  let steps = 0;
  let side = leanSide;
  if (seen) {
    if (result === "purrfect") steps = 0;
    else if (result === "clean") steps = approach === "sneaky" && p.sneakyCleanFree ? 0 : 1;
    else if (result === "scrape") steps = 1;
    else {
      steps = p.flopSteps;
      if (p.flopDirection === "nearer" && mood.broom !== mood.cuddle) side = mood.broom > mood.cuddle ? "broom" : "cuddle";
    }
    if (kidDoubles && side === "cuddle") steps *= 2;
  }
  if (pushedWithMood) {
    if (steps === 0 && result === "flop" && p.flopDirection === "nearer" && mood.broom !== mood.cuddle) side = mood.broom > mood.cuddle ? "broom" : "cuddle";
    steps += 1;
  }
  return { side, steps };
}

/** Add steps to one meter; report a trigger when it reaches Patience (CORE-RULES "Shoo!/Scooped!"). */
export function applyMood(mood, patience, { side, steps }) {
  const m = { ...mood, [side]: Math.max(0, mood[side] + steps) };
  if (m[side] >= patience) return { mood: { ...m, [side]: patience }, trigger: side === "broom" ? "shoo" : "scoop" };
  return { mood: m, trigger: null };
}

/** After Shoo! or Scooped!: that meter empties, Patience −1 (min 2). */
export function afterTrigger(mood, patience, side, p) {
  const left = Math.max(p.minPatience, patience - p.patienceDrop);
  // calm: the meter empties; half (v0.7): it drops to half the new Patience, rounded down (the house stays cross)
  return { mood: { ...mood, [side]: p.resetTo === "half" ? Math.floor(left / 2) : 0 }, patience: left };
}

/** The holder's end-of-round roll for a Held cat (CORE-RULES "Caught"). */
export function holderRoll(face, p) {
  const t = p.holdTable; // e.g. [3, 5]: 1–3 keep, 4–5 den, 6 outside
  if (face <= t[0]) return "keep";
  if (face <= t[1]) return "den";
  return "outside";
}

/** Probability that a pool of n dice reaches at least `result` (exact, for policies). */
export function chanceAtLeast(n, result) {
  const zero = n <= 0;
  const k = zero ? 2 : n;
  if (zero) return result === "scrape" ? 0.25 : result === "flop" ? 1 : 0;
  const pAllLe = x => Math.pow(x / 6, k);
  switch (result) {
    case "flop": return 1;
    case "scrape": return 1 - pAllLe(3);
    case "clean": return 1 - pAllLe(5);
    case "purrfect": return 1 - pAllLe(5) - k * (1 / 6) * Math.pow(5 / 6, k - 1);
    default: return 0;
  }
}
