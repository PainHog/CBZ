/**
 * CAT BURGLARS — the prize (pure)
 * ----------------------------------
 * Where it is, who carries it, portions, the Prize Clock and the outcome
 * (Ch 8 "In, Out, and the Prize"). Internal helpers mutate the state they are
 * given; round.mjs clones first.
 *
 * Prize state: { kind, name, size, portions, portionsLeft, eaten, room, spotRoom,
 *   spotSteps: [options per step], stepsLeft, down, withHuman, carriers: [catId],
 *   out, gone, script, by, haulDiff (v0.8: hauling's Difficulty, the cake's 1 = Tricky) }
 */
import { CATB } from "../config.mjs";
import { roomName, humanByKey, freeInside, isAsleep } from "./residents.mjs";

const R = CATB.rules;

/** Ch 8 "Eating it" / Ch 12 "Portions": food portions are set per cat in the gang. */
export function portionsFor(prize, gangSize) {
  if (prize.kind !== "delicious") return 0;
  return Math.max(1, Math.round((prize.perCat ?? 0) * gangSize + (prize.plus ?? 0)));
}

/** Ch 8 "Gang size": 3 cats — Patience +1 and the prize goes 1 round later; 5 — it goes 1 round sooner. */
export function gangScaling(gangSize) {
  const t = R.gangScaling;
  if (gangSize <= 3) return t[3];
  if (gangSize >= 5) return t[5];
  return t[4];
}

/** A fresh prize from a catalog house: it starts in the arms of the human who first puts it down. */
export function newPrize(house, humans, gangSize, goneAt) {
  const z = house.prize;
  const first = z.script[0];
  const owner = humans.find(h => h.key === first.by);
  const portions = portionsFor(z, gangSize);
  return {
    kind: z.kind, name: z.name, size: z.size, perCat: z.perCat ?? 0, plus: z.plus ?? 0, haulDiff: z.haulDiff ?? 0,
    portions, portionsLeft: portions, eaten: 0,
    room: owner?.room ?? null, spotRoom: null, spotSteps: [], stepsLeft: 0, down: false,
    withHuman: first.by, carriers: [], out: false, gone: false,
    script: z.script.map(s => ({ ...s, steps: s.steps.map(st => st.map(o => [...o])) })), goneAt
  };
}

/** Ch 8: the prize is got when it's outside (even part-eaten, v0.8), or (food) when every portion is eaten. */
export function prizeGot(s) {
  const z = s.prize;
  return !!z && (z.out || (z.kind === "delicious" && z.portions > 0 && z.portionsLeft === 0));
}
/** "get" while there's still a prize to get; "out" once it's got or gone. */
export const prizePhase = s => (prizeGot(s) || s.prize?.gone ? "out" : "get");

export const stepsDone = z => (z.spotSteps?.length ?? 0) - (z.stepsLeft ?? 0);

/**
 * Ch 5 / CORE-RULES "The Mood": the prize is disturbed when a step is done, a
 * portion is gone, or it isn't where the Clock last put it.
 */
export function isDisturbed(z) {
  if (!z || z.withHuman || !z.spotRoom) return false;
  return stepsDone(z) > 0 || z.eaten > 0 || z.carriers.length > 0 || z.room !== z.spotRoom;
}

/** The options for the next step at the prize's spot (food prizes add the Foodie's "food" tag). */
export function currentStep(z) {
  if (!z || z.down || z.stepsLeft <= 0) return null;
  const step = z.spotSteps[z.spotSteps.length - z.stepsLeft];
  return step.map(o => (z.kind === "delicious" ? [...o, "food"] : [...o]));
}

/** Put the prize at a spot (the Clock, or a human putting a dropped prize back). Its steps start over. */
export function placePrize(z, room, steps) {
  z.spotRoom = room; z.spotSteps = steps.map(st => st.map(o => [...o])); z.room = room;
  z.stepsLeft = steps.length; z.down = steps.length === 0; z.withHuman = null; z.carriers = [];
}

/** Ch 8 "Taking it": can this group carry the prize? (Small one cat; Medium a Chonky cat or two; Large three, or two with a Chonky.) */
export function canCarry(size, group) {
  const n = group.length;
  const chonky = group.some(c => c.body === "chonky");
  if (size === "small") return n >= 1;
  if (size === "medium") return chonky || n >= 2;
  return n >= 3 || (n >= 2 && chonky);
}
export function carryRule(size) {
  return { small: "any one cat", medium: "one Chonky cat, or two cats", large: "three cats, or two if one is Chonky" }[size] ?? "";
}

/**
 * The carriers let go. `putBack` (Shoo!/Scooped!): the human puts it back where
 * the Clock last put it, wrapped again if it was wrapped (Ch 5: its steps start
 * over). Otherwise (a carrier puts it down, gives in, or is chased by a dog) it
 * lies where it is.
 */
export function dropPrize(s, { putBack = false } = {}) {
  const z = s.prize;
  if (!z?.carriers?.length) return false;
  for (const id of z.carriers) { const c = s.cats.find(x => x.id === id); if (c) c.carrying = false; }
  if (putBack && z.spotRoom) placePrize(z, z.spotRoom, z.spotSteps);
  else { z.carriers = []; z.down = true; z.stepsLeft = 0; }
  return true;
}

/**
 * Ch 6 / Ch 8 "Where it goes" (v0.8): the Prize Clock acts at the start of its
 * round. The human puts it in its place and stays with it this round, answering
 * no noise until the next round (residents.mjs clockHeld). If the prize isn't
 * where the Clock last put it, the human goes there instead, stays, and finds
 * it gone: +1 Broom and they start Searching (if they weren't already). A
 * dozing human wakes for the job (REVIEW #90). At the start of the gone round
 * it's gone — unless a cat is holding it, and then it stays the gang's. Only
 * the Gone round (and Lights Out with it) moves with gang size (newRobbery).
 * Returns { events, mood: [{ side, steps, cause, kind }] }.
 */
export function prizeClock(s) {
  const z = s.prize;
  const events = [];
  const mood = [];
  if (!z || z.gone || prizeGot(s)) return { events, mood };
  if (z.withHuman) { const h = humanByKey(s, z.withHuman); if (h) z.room = h.room; }
  for (const step of z.script) {
    if (step.round !== s.round) continue;
    const by = humanByKey(s, step.by);
    if (by && !by.holding && isAsleep(s, by)) {
      by.asleepUntil = -1;
      events.push({ type: "wakes", human: by.key, text: `${by.name} wakes up: there's the ${z.name} to see to.` });
    }
    if (z.spotRoom && (z.carriers.length || z.room !== z.spotRoom)) {
      if (by && !by.holding) {
        by.room = z.spotRoom;
        by.staysRound = s.round;
        if (!by.searching) {
          by.searching = true;
          const inSight = freeInside(s).filter(c => c.where === by.room && !c.hidden).map(c => c.id);
          mood.push({ side: "broom", steps: 1, cause: `${by.name} comes for the ${z.name} and finds it gone`, kind: "discovery", seenBy: [by.key], candidates: inSight });
          events.push({ type: "ownerFindsItGone", human: by.key, text: `${by.name} goes to fetch the ${z.name} from the ${roomName(s, z.spotRoom).toLowerCase()} and finds it gone: +1 Broom, and starts Searching.` });
        } else events.push({ type: "ownerFindsItGone", human: by.key, text: `${by.name} goes to the ${roomName(s, z.spotRoom).toLowerCase()} for the ${z.name}: still gone.` });
      }
      continue;
    }
    placePrize(z, step.room, step.steps);
    if (by && !by.holding) { by.room = step.room; by.staysRound = s.round; }
    events.push({ type: "prizePlaced", room: step.room, human: by?.key ?? null,
      text: `${by?.name ?? "The human"} puts the ${z.name} in the ${roomName(s, step.room).toLowerCase()} and stays there this round, answering no noise${step.steps.length ? ` (${step.steps.length} step${step.steps.length > 1 ? "s" : ""} to get at it)` : ""}.` });
  }
  if (s.round >= s.clock.goneAt && !z.carriers.length && !z.out) {
    z.gone = true;
    events.push({ type: "prizeGone", text: `The ${z.name} is gone: ${z.kind === "delicious" ? "eaten" : z.kind === "box" ? "flattened for the recycling" : "put away"}.` });
  }
  return { events, mood };
}

/**
 * Ch 8 "Getting out, and the end": Clean Getaway — the prize is eaten or outside
 * and nobody was left behind; Messy — got it but someone was left behind, or at
 * least half the food was eaten; Busted — anything less. Any cat still inside
 * (held, shut in or free) is left behind: adopted.
 */
export function robberyOutcome(s) {
  const left = s.cats.filter(c => c.status !== "outside").map(c => c.id);
  const got = prizeGot(s);
  const z = s.prize;
  const halfEaten = !got && z.kind === "delicious" && z.portions > 0 && z.eaten * 2 >= z.portions;
  let result = "busted";
  if (got && !left.length) result = "clean";
  else if (got || halfEaten) result = "messy";
  return { result, leftBehind: left, prizeGot: got, halfEaten, eaten: z.eaten, portions: z.portions };
}

export const OUTCOME_LABEL = Object.freeze({ clean: "Clean Getaway", messy: "Messy Getaway", busted: "Busted" });
