/**
 * CAT BURGLARS — the humans and pets (pure)
 * --------------------------------------------
 * Who sees whom (Ch 5 "Who sees you"), pets in the way (Ch 10), and the house's
 * turn: pets, noise, routines, Searching and the holders' d6 (Ch 6 "The house's
 * turn", Ch 9, Ch 10; core rules v0.6): pets, noise, routines or Searching,
 * holders, then Finding it. Where the book leaves a choice the readings follow
 * the simulator's engine (sim/engine.mjs, package P8); the "Implementation
 * notes" in docs/AUTOMATION.md list them.
 *
 * Internal helpers MUTATE the robbery state they are given (the public
 * functions in round.mjs clone first) and push events: { type, text, ... }.
 * Dice come from ctx.d6(): a function returning 1–6, so tests can script them.
 */
import { CATB } from "../config.mjs";
import { holderOutcome } from "./rules.mjs";
import { dist, waysFrom, neighbours, stepToward } from "./map.mjs";

const R = CATB.rules;

export const humanByKey = (s, key) => (s.humans ?? []).find(h => h.key === key) ?? null;
export const petByKey = (s, key) => (s.pets ?? []).find(p => p.key === key) ?? null;
export const catById = (s, id) => (s.cats ?? []).find(c => c.id === id) ?? null;
export const roomName = (s, key) => (key === "outside" ? "outside" : s.rooms?.[key]?.name ?? key);
export const hasTrait = (h, t) => (h.traits ?? []).includes(t);

export const isAsleep = (s, h) => (h.asleepUntil ?? -1) >= s.round;
/** Ch 6 "Distract": Distracted until the house's turn begins (v0.6). */
export const isDistracted = (s, h) => (h.distractedRound ?? -1) >= s.round && s.stage === "cats";

/** Ch 5: humans who can see cats in this room — awake, not Distracted, not holding a cat. */
export function watchers(s, room) {
  return (s.humans ?? []).filter(h => h.room === room && !isAsleep(s, h) && !isDistracted(s, h) && !h.holding);
}

/** Ch 5: the humans who see this cat (none if it's hidden, outside, or shut in the Den). */
export function seenBy(s, cat, { room = null, ignoreHidden = false } = {}) {
  if (!cat) return [];
  const where = room ?? cat.where;
  if (where === "outside" || cat.status === "shut") return [];
  if (cat.hidden && !ignoreHidden) return [];
  return watchers(s, where);
}

/** Ch 4 / Ch 10: the highest Attention among these humans. */
export const highestAttention = humans => humans.reduce((m, h) => Math.max(m, h.attention ?? 0), 0);

/** The watcher who acts for a meter (Ch 5: the highest Attention; ties, the Storyteller's pick = house order). */
export function leadWatcher(humans) {
  return [...humans].sort((a, b) => (b.attention ?? 0) - (a.attention ?? 0))[0] ?? null;
}

/** Ch 5 / Ch 10: a kid among the watchers doubles Cuddle steps. */
export const kidAmong = humans => humans.some(h => hasTrait(h, "kid"));

export const freeInside = s => (s.cats ?? []).filter(c => c.status === "free");
export const catsIn = (s, room) => freeInside(s).filter(c => c.where === room);

/**
 * Ch 10: a pet that stops a cat in this room until it leaves or deals with it:
 * an awake dog, or a guarding house cat — not hiding, befriended or asleep.
 * A cat that slipped past it this turn isn't stopped.
 */
export function hostilePet(s, room, cat = null) {
  return (s.pets ?? []).find(p => p.room === room && !["hiding", "friendly", "asleep", "covered"].includes(p.mode)
    && (p.kind === "dog" || p.kind === "housecat")
    && !(cat && (cat.slipped ?? []).includes(p.key))) ?? null;
}

/* ------------------------------------------------------------------ pets -- */

/**
 * Ch 10, each pet at the end of the round (the simulator's order: pets act
 * before noise is answered, and their barks and squawks join the noise list).
 */
export function petsAct(s, ctx, ev) {
  for (const p of s.pets ?? []) petActs(s, p, ctx, ev);
}

function catsHere(s, room) { return freeInside(s).filter(c => c.where === room); }

function petActs(s, p, ctx, ev) {
  if (p.kind === "vacuum") {
    if (ctx.routines === false) return;
    // Wanders: a random next room among the ones it goes to.
    const opts = waysFrom(s, p.room).filter(x => x.way.open).map(x => x.to).filter(r => !p.roam?.length || p.roam.includes(r));
    if (!opts.length) return;
    const face = ctx.d6();
    const to = opts[(face - 1) % opts.length];
    if (to !== p.room) {
      const riders = catsHere(s, p.room).filter(c => c.riding === p.key);
      p.room = to;
      for (const c of riders) c.where = to;
      ev.push({ type: "petMoved", pet: p.key, face, to, text: `${p.name} wanders into the ${roomName(s, to).toLowerCase()} (d6 ${face})${riders.length ? `, carrying ${riders.map(c => c.name).join(" and ")}` : ""}.` });
    }
    return;
  }
  if (p.kind === "parrot") {
    if (p.mode !== "covered" && catsHere(s, p.room).some(c => !c.hidden)) {
      addNoise(s, p.room, "squawk", null);
      ev.push({ type: "squawk", pet: p.key, text: `${p.name} squawks: noise in the ${roomName(s, p.room).toLowerCase()}.` });
    }
    return;
  }
  if (p.kind === "housecat") return; // guards its room; never moves
  // dog
  if (p.mode === "hiding" || p.mode === "friendly") return;
  if (p.mode === "asleep") {
    const near = (s.noise ?? []).some(n => dist(s, n.room, p.room) <= 1);
    if (!near) return;
    p.mode = "awake";
    ev.push({ type: "petWoke", pet: p.key, text: `${p.name} wakes up.` });
  }
  if (catsHere(s, p.room).length) { bark(s, p, ev); return; } // dogs smell hidden cats; it barks and stays
  if (ctx.routines === false) return;
  const face = ctx.d6();
  const r = p.routine?.[face - 1] ?? "stay";
  let to = p.room;
  if (r === "sniff") to = stepToward(s, p.room, freeInside(s).map(c => c.where)) ?? p.room;
  else if (r !== "stay") to = r;
  const what = r === "sniff" ? "sniffs" : r === "stay" ? "stays put" : "goes";
  if (to !== p.room) p.room = to;
  ev.push({ type: "petRoutine", pet: p.key, face, result: r, to: p.room,
    text: `${p.name} (d6 ${face}) ${what}${r === "stay" ? "" : ` → ${roomName(s, p.room).toLowerCase()}`}.` });
}

function bark(s, p, ev) {
  addNoise(s, p.room, "bark", null);
  ev.push({ type: "bark", pet: p.key, text: `${p.name} barks at the cat in the ${roomName(s, p.room).toLowerCase()}: noise.` });
}

/** Record a noise (Ch 6): in the order it was made. `onPurpose` noises leave a mess. */
export function addNoise(s, room, why, catId = null, { mess = false } = {}) {
  (s.noise ??= []).push({ room, why, catId });
  if (mess && !(s.messes ??= []).includes(room)) s.messes.push(room);
}

/* ----------------------------------------------------------------- noise -- */

/**
 * Ch 6 "Noise": each noise, in the order made, draws the closest awake human
 * within two rooms who isn't already in that room; each human answers only one;
 * the Storyteller breaks ties (here: house order, logged). A human who answers
 * goes straight there, sees only that room and stays (noise beats the Prize
 * Clock's hold). Several noises in one room count once (the simulator's reading).
 * Messes are found later, in Finding it. Returns the answered keys.
 */
export function resolveNoise(s, ev) {
  const answered = new Set();
  const mood = [];
  const rooms = [];
  for (const n of s.noise ?? []) if (!rooms.includes(n.room)) rooms.push(n.room);
  for (const room of rooms) {
    const cands = (s.humans ?? [])
      .filter(h => !h.holding && !isAsleep(s, h) && !hasTrait(h, "headphones") && !hasTrait(h, "busy") && !answered.has(h.key) && h.room !== room)
      .map((h, i) => ({ h, d: dist(s, h.room, room), i }))
      .filter(x => x.d <= R.noiseRange)
      .sort((a, b) => a.d - b.d || a.i - b.i);
    const pick = cands[0];
    if (!pick) { ev.push({ type: "noiseUnanswered", room, text: `Nobody comes to see the noise in the ${roomName(s, room).toLowerCase()}.` }); continue; }
    const tie = cands.filter(x => x.d === pick.d).length > 1;
    const h = pick.h;
    h.room = room;
    h.answeredRound = s.round;
    answered.add(h.key);
    ev.push({ type: "noiseAnswered", room, human: h.key, tie,
      text: `${h.name} comes to see the noise in the ${roomName(s, room).toLowerCase()}${tie ? " (a tie: the Storyteller's pick)" : ""}.` });
  }
  return { answered, mood };
}

/* -------------------------------------------------------------- routines -- */

/**
 * Ch 6 / Ch 10: every other human's d6 routine. Holders don't follow it (Ch 9),
 * a human who answered a noise or who put the prize down this round stays, and
 * a Searching human hunts instead (v0.6): stays with the prize if it's in their
 * room, else steps into its room if it's next door; else stays with a cat in
 * sight, else steps into a next room with an unhidden cat (the Storyteller's
 * pick between rooms, by d6); else follows the routine. A dozing human rolls an
 * extra d6: 1–2, asleep until the end of the next round.
 */
export function humanRoutines(s, ctx, answered, ev) {
  for (const h of s.humans ?? []) {
    if (h.holding) continue;
    if (answered.has(h.key)) continue;
    if (h.staysRound === s.round) { ev.push({ type: "stays", human: h.key, text: `${h.name} stays with the prize.` }); continue; }
    if (ctx.routines === false) continue; // autoRoutines off: the Storyteller moves them by hand
    if (h.searching && !isAsleep(s, h)) {
      const z = s.prize;
      if (z && !z.out && !z.gone && !z.withHuman && z.room) {
        if (z.room === h.room) { ev.push({ type: "searchStay", human: h.key, text: `${h.name} is Searching and stays with the ${z.name}.` }); continue; }
        if (neighbours(s, h.room).includes(z.room)) {
          h.room = z.room;
          ev.push({ type: "searchStep", human: h.key, to: z.room, text: `${h.name} is Searching and steps into the ${roomName(s, z.room).toLowerCase()}, where the ${z.name} is.` });
          continue;
        }
      }
      const visible = room => freeInside(s).filter(c => c.where === room && !c.hidden);
      if (visible(h.room).length) { ev.push({ type: "searchStay", human: h.key, text: `${h.name} is Searching and stays: a cat in sight.` }); continue; }
      const next = neighbours(s, h.room).filter(r => visible(r).length);
      if (next.length) {
        const pool = next;
        const to = pool.length === 1 ? pool[0] : pool[(ctx.d6() - 1) % pool.length];
        h.room = to;
        ev.push({ type: "searchStep", human: h.key, to, text: `${h.name} is Searching and steps into the ${roomName(s, to).toLowerCase()}.` });
        continue;
      }
    }
    const face = ctx.d6();
    const r = h.routine?.[face - 1] ?? "stay";
    if (r !== "stay") h.room = r;
    ev.push({ type: "routine", human: h.key, face, result: r, to: h.room,
      text: `${h.name} (d6 ${face}) ${r === "stay" ? "stays put" : `→ ${roomName(s, r).toLowerCase()}`}.` });
    if (hasTrait(h, "dozes")) {
      const doze = ctx.d6();
      if (doze <= R.dozeOn) {
        h.asleepUntil = s.round + 1;
        ev.push({ type: "doze", human: h.key, face: doze, text: `${h.name} nods off (d6 ${doze}): asleep until the end of next round.` });
      }
    }
  }
}

/** Ch 9: each holder rolls a d6 — 1–3 keeps cuddling, 4–5 the Den, 6 outside. Returns the den shuts. */
export function holdersRoll(s, ctx, ev, { shutInDen }) {
  for (const h of s.humans ?? []) {
    if (!h.holding) continue;
    const c = catById(s, h.holding);
    if (!c || c.status !== "held") { h.holding = null; continue; }
    const face = ctx.d6();
    const what = holderOutcome(face);
    if (what === "keep") { ev.push({ type: "holderKeeps", human: h.key, cat: c.id, face, text: `${h.name} (d6 ${face}) keeps cuddling ${c.name}.` }); continue; }
    h.holding = null;
    c.heldBy = null;
    if (what === "den") {
      shutInDen(c, h);
      ev.push({ type: "shutIn", human: h.key, cat: c.id, face, text: `${h.name} (d6 ${face}) shuts ${c.name} in the ${roomName(s, s.den).toLowerCase()}, "just until we find your owner".` });
    } else {
      c.status = "outside"; c.where = "outside"; c.hidden = false; c.riding = null;
      ev.push({ type: "putOut", human: h.key, cat: c.id, face, text: `${h.name} (d6 ${face}) puts ${c.name} outside: "Go on, home you go."` });
    }
  }
}

/**
 * Ch 6 "Finding it" (v0.6), at the end of the house's turn, in order:
 *  1. Spotted: a Searching human who can see a cat: +1 Broom (once a round).
 *  2. The prize: if it's disturbed, every awake human not yet Searching in its
 *     room or in the room where the Clock put it finds it: +1 Broom (once) and
 *     they start Searching.
 *  3. Messes: a human in a room with a mess finds it: +1 Broom, and it's cleared.
 * Returns the Mood steps: [{ side, steps, cause, kind, catId, seenBy }]. MUTATES s.
 */
export function findingIt(s, ev, { disturbed, inPlay }) {
  const mood = [];
  const awake = h => !h.holding && !isAsleep(s, h);
  const inSight = h => freeInside(s).find(c => c.where === h.room && !c.hidden) ?? null;
  const spotter = (s.humans ?? []).find(h => h.searching && awake(h) && inSight(h));
  if (spotter) {
    const c = inSight(spotter);
    mood.push({ side: "broom", steps: 1, kind: "spotted", catId: c.id, seenBy: [spotter.key], cause: `${spotter.name} is Searching and spots ${c.name}` });
    ev.push({ type: "spotted", human: spotter.key, cat: c.id, text: `${spotter.name} is Searching and can see ${c.name}: +1 Broom.` });
  }
  const z = s.prize;
  if (inPlay && disturbed) {
    const finders = (s.humans ?? []).filter(h => !h.searching && awake(h) && (h.room === z.room || h.room === z.spotRoom));
    if (finders.length) {
      for (const h of finders) h.searching = true;
      const seen = finders.map(h => ({ h, c: inSight(h) })).find(x => x.c) ?? null;
      mood.push({ side: "broom", steps: 1, kind: "discovery", catId: seen?.c.id ?? null, seenBy: seen ? [seen.h.key] : [],
        cause: `${finders.map(h => h.name).join(" and ")} ${finders.length > 1 ? "find" : "finds"} the ${z.name} disturbed` });
      ev.push({ type: "discovery", humans: finders.map(h => h.key),
        text: `${finders.map(h => h.name).join(" and ")} ${finders.length > 1 ? "find" : "finds"} the ${z.name} disturbed: +1 Broom, and ${finders.length > 1 ? "they start" : "starts"} Searching.` });
    }
  }
  for (const room of [...(s.messes ?? [])]) {
    const h = (s.humans ?? []).find(x => x.room === room && awake(x));
    if (!h) continue;
    s.messes = s.messes.filter(m => m !== room);
    mood.push({ side: "broom", steps: 1, kind: "mess", catId: null, seenBy: [h.key], cause: `${h.name} finds the mess in the ${roomName(s, room).toLowerCase()}` });
    ev.push({ type: "messFound", room, human: h.key, text: `${h.name} finds the mess in the ${roomName(s, room).toLowerCase()}: +1 Broom.` });
  }
  return mood;
}

/** Ch 10: a driven-off pet comes back where it started, awake, when its 3 rounds (counting the first) are up. */
export function petsReturn(s, ev) {
  for (const p of s.pets ?? []) {
    if (p.mode === "hiding" && s.round >= (p.until ?? 0)) {
      p.mode = "awake";
      p.room = p.start;
      ev.push({ type: "petBack", pet: p.key, text: `${p.name} is back in the ${roomName(s, p.room).toLowerCase()}.` });
    }
  }
}
