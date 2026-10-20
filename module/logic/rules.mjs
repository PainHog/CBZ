/**
 * CAT BURGLARS — Pure Rules Logic: dice, the roll plan, Push and Mood steps
 * ---------------------------------------------------------------------------
 * The convention (carried over from Heisty Spideys): every rule the system
 * automates is computed by a Foundry-free function in module/logic/ — no
 * `game`, `ui`, `foundry`, `Hooks`, `CONFIG` or DOM; only plain data in, plain
 * data out, plus static data from ../config.mjs (itself Foundry-free). Sheets,
 * chat cards and GM operations call these functions and only do the Foundry
 * plumbing around them, so the rules are unit-tested with `node --test`.
 *
 * Each function cites the rulebook passage it implements (book/src/chapters/,
 * summarised in docs/CORE-RULES.md v0.6). The simulator keeps its own copy of
 * these rules (sim/rules.mjs); test/parity.test.mjs checks the two agree under
 * the adopted package (P8).
 */
import { CATB } from "../config.mjs";

const R = CATB.rules;

export const APPROACHES = CATB.approachKeys;
export const INSTINCTS = CATB.instinctKeys;
export const RESULT_RANK = Object.freeze({ flop: 0, scrape: 1, clean: 2, purrfect: 3 });

/** Ch 5: which meter an approach fills when a human sees it (Sweet → Cuddle; the rest → Broom). */
export const fillsMeter = approach => (approach === "sweet" ? "cuddle" : "broom");

/** Ch 4 "How many dice", Ch 10: a watching human's Attention takes dice from Sneaky and Sweet rolls only. */
export const attentionApplies = approach => approach === "sneaky" || approach === "sweet";

/** Ch 7 "Knacks": does any of these instincts suit an action with these tags? */
export function hasKnack(instincts = [], tags = []) {
  return instincts.some(i => (CATB.instincts[i]?.knack ?? []).some(t => tags.includes(t)));
}

/** Which of the cat's instincts give the Knack for these tags (for the dialog's label). */
export function knackInstincts(instincts = [], tags = []) {
  return instincts.filter(i => (CATB.instincts[i]?.knack ?? []).some(t => tags.includes(t)));
}

/**
 * Dice to roll before reading (Ch 4 "Counting dice"): approach rating, +1 Knack
 * (max +1; a Chonky cat's wriggle die counts the same way), +1 per helper (max +2),
 * +1 for a Cattitude token, never more than 5; THEN remove Difficulty, a pet's
 * rating and (Sneaky/Sweet only) the highest watching Attention.
 * Returns the signed count; 0 or less means "roll two, keep the lower".
 * Same arguments as sim/rules.mjs poolSize (plus the Cattitude die).
 */
export function poolSize({ rating = 0, knack = false, helpers = 0, cattitudeDie = false, difficulty = 0, opposition = 0, attention = 0 }) {
  const bonus = (knack ? R.knackCap : 0) + Math.min(Math.max(0, helpers), R.helpCap) + (cattitudeDie ? 1 : 0);
  return Math.min(rating + bonus, R.diceCap) - difficulty - opposition - attention;
}

/**
 * The roll plan: every part of the pool with its source, so the dialog and the
 * card can show where each die came from (AUTOMATION.md §4).
 * @param {object} p
 * @param {string} p.approach   sneaky|sweet|savage|streetwise
 * @param {number} p.rating     the cat's rating in that approach (1–4)
 * @param {boolean} [p.knack]   an instinct suits the action
 * @param {boolean} [p.bodyDie] a Chonky cat wriggling free (counts as the one extra die, like a Knack)
 * @param {number} [p.helpers]  cats helping (each +1, max +2)
 * @param {boolean} [p.cattitudeDie] spend 1 Cattitude for +1 die
 * @param {number} [p.difficulty] 0 plain, 1 Tricky, 2 Hard
 * @param {number} [p.opposition] a pet in the way: its rating
 * @param {number} [p.attention] the highest Attention among the humans watching (used on Sneaky/Sweet only)
 */
export function buildRollPlan({ approach, rating = 0, knack = false, bodyDie = false, helpers = 0, cattitudeDie = false,
  difficulty = 0, opposition = 0, attention = 0 } = {}) {
  if (!APPROACHES.includes(approach)) throw new Error(`buildRollPlan: unknown approach "${approach}"`);
  const add = [{ key: "rating", label: `${CATB.approaches[approach].label} rating`, value: rating }];
  const extra = knack || bodyDie;
  if (extra) add.push({ key: knack ? "knack" : "body", label: knack ? "Knack" : "Chonky (wriggling free)", value: R.knackCap });
  const help = Math.min(Math.max(0, helpers), R.helpCap);
  if (help) add.push({ key: "help", label: `Help ×${help}`, value: help });
  if (helpers > R.helpCap) add.push({ key: "helpCapped", label: `Help over +${R.helpCap} doesn't count`, value: 0 });
  if (cattitudeDie) add.push({ key: "cattitude", label: "Cattitude die", value: 1 });
  const raw = add.reduce((a, p) => a + p.value, 0);
  const capped = Math.min(raw, R.diceCap);
  const att = attentionApplies(approach) ? Math.max(0, attention) : 0;
  const remove = [];
  if (difficulty) remove.push({ key: "difficulty", label: CATB.difficulties[difficulty] ?? `Difficulty ${difficulty}`, value: difficulty });
  if (opposition) remove.push({ key: "opposition", label: "A pet in the way", value: opposition });
  if (att) remove.push({ key: "attention", label: "Watching human's Attention", value: att });
  const total = capped - remove.reduce((a, p) => a + p.value, 0);
  const zero = total <= 0;
  return {
    approach, add, remove, raw, capped, overCap: raw > R.diceCap, total, zero,
    dice: zero ? R.zeroDice : total,
    cattitudeCost: cattitudeDie ? 1 : 0,
    attentionIgnored: !attentionApplies(approach) && attention > 0
  };
}

/**
 * Read a roll (Ch 4 "Reading the dice"): the highest die decides — 1–3 Flop,
 * 4–5 Scrape, 6 Clean, two or more 6s Purrfect. With 0 or fewer dice two are
 * rolled and the LOWER one is read, no better than a Scrape.
 */
export function readDice(faces, zero = false) {
  if (!faces?.length) throw new Error("readDice: no dice");
  if (zero) return Math.min(...faces) >= 4 ? "scrape" : "flop";
  const sixes = faces.filter(f => f === 6).length;
  if (sixes >= 2) return "purrfect";
  const hi = Math.max(...faces);
  if (hi === 6) return "clean";
  if (hi >= 4) return "scrape";
  return "flop";
}

/** The die the result was read from (highlighted on the card). */
export function readIndex(faces, zero = false) {
  const target = zero ? Math.min(...faces) : Math.max(...faces);
  return faces.indexOf(target);
}

export const works = result => result !== "flop";
export const makesNoise = result => result === "flop" || result === "scrape";

/** Ch 4 "Push your luck": every die that isn't a 6 is rolled again. */
export function pushIndices(faces) {
  return faces.map((f, i) => (f === 6 ? -1 : i)).filter(i => i >= 0);
}
/** Put the rerolled faces back in place (newFaces in pushIndices order). */
export function applyPush(faces, newFaces) {
  const idx = pushIndices(faces);
  if (newFaces.length !== idx.length) throw new Error(`applyPush: expected ${idx.length} new dice, got ${newFaces.length}`);
  const out = [...faces];
  idx.forEach((i, k) => { out[i] = newFaces[k]; });
  return out;
}
/** A Push is pointless (and not offered) when every die already shows a 6. */
export const canPush = faces => pushIndices(faces).length > 0;

/**
 * The Mood change from one roll (Ch 5 "Mood steps"; CORE-RULES "The Mood"):
 * - seen Clean or Scrape: 1 step on the approach's meter (a Sneaky Clean: 0);
 * - seen Purrfect: nothing;
 * - seen Flop: 2 steps on the fuller meter (the approach's own if they're level);
 * - a kid who saw it doubles its Cuddle steps (once);
 * - a Push paid with the Mood adds 1 step to that roll's meter, seen or not;
 * - one roll, one change.
 * `mood` is the meters before this roll. Mirrors sim/rules.mjs moodDelta (P8).
 */
export function moodDelta({ result, approach, seen, mood = { broom: 0, cuddle: 0 }, pushedWithMood = false, kidDoubles = false }) {
  const lean = fillsMeter(approach);
  let side = lean;
  let steps = 0;
  const fuller = () => (mood.broom !== mood.cuddle ? (mood.broom > mood.cuddle ? "broom" : "cuddle") : lean);
  if (seen) {
    if (result === "purrfect") steps = 0;
    else if (result === "clean") steps = approach === "sneaky" && R.sneakyCleanFree ? 0 : 1;
    else if (result === "scrape") steps = 1;
    else { steps = R.flopSteps; side = fuller(); }
    if (kidDoubles && side === "cuddle") steps *= 2;
  }
  if (pushedWithMood) {
    if (steps === 0 && result === "flop") side = fuller();
    steps += 1;
  }
  return { side, steps };
}

/** Ch 9: the holder's end-of-round d6. */
export function holderOutcome(face) {
  const [keep, den] = R.holdTable;
  if (face <= keep) return "keep";
  if (face <= den) return "den";
  return "outside";
}

/** Exact chance that n dice reach at least `result` (for the dialog's odds; Ch 4 "How likely is it?"). */
export function chanceAtLeast(n, result) {
  if (n <= 0) return result === "flop" ? 1 : result === "scrape" ? 0.25 : 0;
  const pAllLe = x => Math.pow(x / 6, n);
  switch (result) {
    case "flop": return 1;
    case "scrape": return 1 - pAllLe(3);
    case "clean": return 1 - pAllLe(5);
    case "purrfect": return 1 - pAllLe(5) - n * (1 / 6) * Math.pow(5 / 6, n - 1);
    default: return 0;
  }
}

/** Clamp Cattitude to 0…5 (Ch 2 §7). */
export const clampCattitude = v => Math.max(0, Math.min(R.cattitudeMax, Math.trunc(Number(v) || 0)));

/** Ch 2 §3: a legal starting spread is 3, 2, 1, 1 (ratings may rise to 4 later through Rep). */
export function validateApproaches(r = {}) {
  const vals = APPROACHES.map(a => Number(r[a] ?? 0));
  const errors = [];
  if (vals.some(v => !Number.isInteger(v) || v < 1 || v > R.approachMax)) errors.push(`each approach is 1–${R.approachMax}`);
  return { errors, starting: [...vals].sort((a, b) => b - a).join() === "3,2,1,1" };
}

/** Ch 2 §4: two different instincts. */
export function validateInstincts(list = []) {
  const errors = [];
  if (list.length !== 2) errors.push("a cat has two instincts");
  if (new Set(list).size !== list.length) errors.push("the two instincts must differ");
  for (const i of list) if (!INSTINCTS.includes(i)) errors.push(`unknown instinct ${i}`);
  return errors;
}
