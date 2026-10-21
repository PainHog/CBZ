/**
 * NINE LIVES GANG — the prize (pure)
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

/** Ch 8 "Eating it" / Ch 13 "Portions": food portions are set per cat in the gang. */
export function portionsFor(prize, gangSize) {
  if (prize.kind !== "delicious") return 0;
  return Math.max(1, Math.round((prize.perCat ?? 0) * gangSize + (prize.plus ?? 0)));
}

/**
 * Ch 12 "Gang size": the houses are written for four cats (a gang of one or two
 * plays as three). The general rule: 3 cats — Patience +1, the prize 2 rounds
 * later, 3 Cattitude each; 5 — Patience −1. v0.9: a ready-to-run house prints
 * its own three- and five-cat numbers (catalog `scale3` / `scale5`:
 * [Patience, Clock]); those win. Only the Gone round (and Lights Out) moves.
 * @returns {{patience:number, clock:number, cattitude:number, own:boolean}}
 */
export function gangScaling(gangSize, house = null) {
  const t = R.gangScaling;
  if (gangSize <= 3) return house?.scale3 ? { patience: house.scale3[0], clock: house.scale3[1], cattitude: t[3].cattitude, own: true } : { ...t[3], own: false };
  if (gangSize >= 5) return house?.scale5 ? { patience: house.scale5[0], clock: house.scale5[1], cattitude: t[5].cattitude, own: true } : { ...t[5], own: false };
  return { ...t[4], own: false };
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
/** Ch 6 "Searching" (v0.9): the prize is still inside — not outside, not gone, not in a human's arms, and not all eaten. */
export const prizeInside = s => { const z = s.prize; return !!z && !z.out && !z.gone && !z.withHuman && !!z.room && !prizeGot(s); };

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
 * over; eaten portions stay eaten). Otherwise (a carrier puts it down, gives in,
 * or is chased by a dog) it lies where it is — or in `room`, where the carriers
 * end up (v0.9: a failed haul in a dog's room).
 * v0.9 (Ch 8): a prize the gang was still holding when its Gone round came is
 * gone as soon as they put it down. `ev` gets that event.
 */
export function dropPrize(s, { putBack = false, room = null, ev = null } = {}) {
  const z = s.prize;
  if (!z?.carriers?.length) return false;
  for (const id of z.carriers) { const c = s.cats.find(x => x.id === id); if (c) c.carrying = false; }
  if (putBack && z.spotRoom) placePrize(z, z.spotRoom, z.spotSteps);
  else { z.carriers = []; z.down = true; z.stepsLeft = 0; if (room && room !== "outside") z.room = room; }
  if (!z.out && !z.gone && s.round >= (s.clock?.goneAt ?? z.goneAt ?? Infinity)) {
    z.gone = true;
    ev?.push({ type: "prizeGone", text: `It's past the ${z.name}'s Gone round, so once it's put down it's gone: ${goneText(z)}.` });
  }
  return true;
}

const goneText = z => (z.kind === "delicious" ? "eaten" : z.kind === "box" ? "flattened for the recycling" : z.kind === "shiny" ? "locked away in a drawer" : "put away");

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
    events.push({ type: "prizeGone", text: `The ${z.name} is gone: ${goneText(z)}.` });
  }
  return { events, mood };
}

/** Ch 9 "The loot": a Chonky cat carries two pieces, any other cat one. */
export const carryCap = c => (c?.body === "chonky" ? 2 : 1);

/**
 * Ch 9 "The loot": the prize in pieces. Food comes in its portions (the ones
 * not eaten inside — and only if the food was carried out); anything else
 * (fun, shiny, a box) is Small 1, Medium 2, Large 3 pieces. Portions eaten in
 * the house are already safe. Returns { total, safe, pieces } — pieces is what
 * the gang has outside to carry home.
 */
export function lootOf(s) {
  const z = s.prize;
  const food = z?.kind === "delicious";
  const total = food ? z.portions : (R.lootPieces[z?.size] ?? 1);
  const safe = food ? z.eaten : 0;
  const pieces = z?.out ? (food ? z.portionsLeft : total) : 0;
  return { total, safe, pieces };
}

/**
 * Ch 9 "How did it go?" (v0.10): count the loot — the pieces that made it home
 * plus any portions eaten in the house. Clean Getaway: all of it, and nobody
 * pinched; Messy: at least half of it (or all of it, but somebody was
 * pinched); Busted: less than half. Pinched (Ch 10): any cat still inside when
 * the house part ended, and any the warden caught. Without a getaway in the
 * state (it hasn't run), every cat outside counts as home with its share.
 * `leftBehind` is the pinched cats (the outcome card's Lives buttons).
 */
export function robberyOutcome(s) {
  const z = s.prize;
  const { total, safe, pieces } = lootOf(s);
  const g = s.getaway;
  let home, pinched;
  if (g) {
    home = Object.values(g.cats).filter(r => r.state === "home").reduce((a, r) => a + r.carry, 0);
    pinched = s.cats.filter(c => g.cats[c.id]?.state === "pinched").map(c => c.id);
  } else {
    const out = s.cats.filter(c => c.status === "outside");
    home = Math.min(pieces, out.reduce((a, c) => a + carryCap(c), 0));
    pinched = s.cats.filter(c => c.status !== "outside").map(c => c.id);
  }
  const got = safe + home;
  let result = "busted";
  if (got >= total && total > 0 && !pinched.length) result = "clean";
  else if (got * 2 >= total && got > 0) result = "messy";
  return { result, leftBehind: pinched, pinched, loot: got, lootTotal: total, lootHome: home, eaten: safe,
    prizeGot: got >= total && total > 0, halfEaten: got > 0 && got * 2 >= total && got < total, portions: z.portions };
}

export const OUTCOME_LABEL = Object.freeze({ clean: "Clean Getaway", messy: "Messy Getaway", busted: "Busted" });
