/**
 * NINE LIVES GANG — the humans and pets (pure)
 * --------------------------------------------
 * Who sees whom (Ch 5 "Who sees you"), pets in the way (Ch 11), and the house's
 * turn: pets, noise, routines, Searching and the holders' d6 (Ch 6 "The house's
 * turn", Ch 10, Ch 11; core rules v0.9): pets, noise, routines or Searching,
 * holders, then Finding it. Where the book leaves a choice the readings follow
 * the simulator's engine (sim/engine.mjs, package P12); the "Implementation
 * notes" in docs/AUTOMATION.md list them.
 *
 * Internal helpers MUTATE the robbery state they are given (the public
 * functions in round.mjs clone first) and push events: { type, text, ... }.
 * Dice come from ctx.d6(): a function returning 1–6, so tests can script them.
 */
import { CATB } from "../config.mjs";
import { holderOutcome, pickByDie } from "./rules.mjs";
import { dist, waysFrom, neighbours, stepToward, shooEntrances } from "./map.mjs";

const R = CATB.rules;

export const humanByKey = (s, key) => (s.humans ?? []).find(h => h.key === key) ?? null;
export const petByKey = (s, key) => (s.pets ?? []).find(p => p.key === key) ?? null;
export const catById = (s, id) => (s.cats ?? []).find(c => c.id === id) ?? null;
export const roomName = (s, key) => (key === "outside" ? "outside" : s.rooms?.[key]?.name ?? key);
export const hasTrait = (h, t) => (h.traits ?? []).includes(t);

export const isAsleep = (s, h) => (h.asleepUntil ?? -1) >= s.round;
/** Ch 6 "Distract": Distracted until the house's turn begins (v0.6). */
export const isDistracted = (s, h) => (h.distractedRound ?? -1) >= s.round && s.stage === "cats";

/**
 * Ch 5: humans who can see cats in this room — awake and not Distracted. A
 * human holding a cat still sees their room (v0.7, Ch 10); they just don't move,
 * answer noise, Search or find things.
 */
export function watchers(s, room) {
  return (s.humans ?? []).filter(h => h.room === room && !isAsleep(s, h) && !isDistracted(s, h));
}

/**
 * Ch 5 (v0.8): the free cats this human can see right now — awake, not
 * Distracted, in their room and not hiding. A holder still sees (their hands
 * are just full); the caller decides whether that matters.
 */
export function catsInSight(s, h) {
  if (!h || isAsleep(s, h) || isDistracted(s, h)) return [];
  return freeInside(s).filter(c => c.where === h.room && !c.hidden);
}

/** Ch 5: the humans who see this cat (none if it's hidden, outside, or shut in the Den). */
export function seenBy(s, cat, { room = null, ignoreHidden = false } = {}) {
  if (!cat) return [];
  const where = room ?? cat.where;
  if (where === "outside" || cat.status === "shut") return [];
  if (cat.hidden && !ignoreHidden) return [];
  return watchers(s, where);
}

/** Ch 4 / Ch 11: the highest Attention among these humans. */
export const highestAttention = humans => humans.reduce((m, h) => Math.max(m, h.attention ?? 0), 0);

/** The watcher who acts for a meter (Ch 5: the highest Attention; ties, house order — pickHuman adds the die). */
export function leadWatcher(humans) {
  return [...humans].sort((a, b) => (b.attention ?? 0) - (a.attention ?? 0))[0] ?? null;
}

/**
 * Ch 12 "Ties" (v0.9): between humans the rules make you pick — two as close to
 * a noise, two who saw the same roll — the higher Attention goes first; still
 * tied, a die (pickByDie). Without a d6 the first in house order goes, and the
 * text says it was the Storyteller's pick.
 * @returns {{ h: object|null, tie: "attention"|"die"|"pick"|null, face: number|null, text: string }}
 */
export function pickHuman(humans, d6 = null) {
  if (!humans?.length) return { h: null, tie: null, face: null, text: "" };
  if (humans.length === 1) return { h: humans[0], tie: null, face: null, text: "" };
  const top = Math.max(...humans.map(h => h.attention ?? 0));
  const best = humans.filter(h => (h.attention ?? 0) === top);
  if (best.length === 1) return { h: best[0], tie: "attention", face: null, text: " (the higher Attention)" };
  const { pick, face } = pickByDie(best, d6);
  return face ? { h: pick, tie: "die", face, text: ` (tied on Attention: a die, ${face})` } : { h: pick, tie: "pick", face: null, text: " (a tie: the Storyteller's pick)" };
}

/** Ch 5 / Ch 11: a kid among the watchers doubles Cuddle steps. */
export const kidAmong = humans => humans.some(h => hasTrait(h, "kid"));

export const freeInside = s => (s.cats ?? []).filter(c => c.status === "free");
export const catsIn = (s, room) => freeInside(s).filter(c => c.where === room);

/**
 * Ch 11: a pet that stops a cat in this room until it leaves or deals with it:
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
 * Ch 11 (v0.8): a parrot squawks in the Pets step if it saw a cat that wasn't
 * hidden at any time this round. Called after every change to the robbery
 * (round.mjs look): an uncovered parrot with an unhidden cat in its room —
 * free, or held (v0.9: a held cat counts as seen) — remembers the round. MUTATES s.
 */
export function parrotsLook(s) {
  for (const p of s.pets ?? []) {
    if (p.kind !== "parrot" || p.mode === "covered") continue;
    if (seenCatsIn(s, p.room).length) p.sawRound = s.round;
  }
}

/** v0.9 (Ch 12 "Does a held cat count as seen?"): the cats someone in this room can see — free and unhidden, or held. */
export function seenCatsIn(s, room) {
  return (s.cats ?? []).filter(c => c.where === room && ((c.status === "free" && !c.hidden) || c.status === "held"));
}

/**
 * Ch 11, each pet at the end of the round (the simulator's order: pets act
 * before noise is answered, and their barks and squawks join the noise list).
 */
export function petsAct(s, ctx, ev) {
  for (const p of s.pets ?? []) petActs(s, p, ctx, ev);
}

function catsHere(s, room) { return freeInside(s).filter(c => c.where === room); }

function petActs(s, p, ctx, ev) {
  if (p.kind === "vacuum") {
    if (ctx.routines === false) return;
    // Wanders (the Pets step): a next room on its list, a die between them (v0.9); pets pass closed doors (v0.7)
    const opts = waysFrom(s, p.room).map(x => x.to).filter(r => !p.roam?.length || p.roam.includes(r));
    if (!opts.length) return;
    const { pick: to, face } = pickByDie(opts, ctx.d6);
    if (to !== p.room) {
      const riders = catsHere(s, p.room).filter(c => c.riding === p.key);
      p.room = to;
      for (const c of riders) c.where = to;
      ev.push({ type: "petMoved", pet: p.key, face, to, text: `${p.name} wanders into the ${roomName(s, to).toLowerCase()}${face ? ` (d6 ${face})` : ""}${riders.length ? `, carrying ${riders.map(c => c.name).join(" and ")}` : ""}.` });
    }
    return;
  }
  if (p.kind === "parrot") {
    // v0.8: it saw an unhidden cat at any time this round (covered: quiet for the rest of the robbery); v0.9: held cats count
    parrotsLook(s);
    if (p.mode !== "covered" && p.sawRound === s.round) {
      const now = seenCatsIn(s, p.room).length > 0;
      addNoise(s, p.room, "squawk", null);
      ev.push({ type: "squawk", pet: p.key, text: `${p.name} squawks${now ? "" : " (it saw a cat earlier this round)"}: noise in the ${roomName(s, p.room).toLowerCase()}.` });
    }
    return;
  }
  if (p.kind === "housecat") return; // guards its room; never moves
  // dog
  if (p.mode === "hiding") return;
  if (p.mode === "asleep") {
    const near = (s.noise ?? []).some(n => dist(s, n.room, p.room) <= 1);
    if (!near) return;
    p.mode = "awake";
    ev.push({ type: "petWoke", pet: p.key, text: `${p.name} wakes up.` });
  }
  // dogs smell hidden cats: it barks and stays — v0.9: a befriended dog doesn't bark (or charge), but it still wanders
  if (p.mode !== "friendly" && catsHere(s, p.room).length) { bark(s, p, ev); return; }
  if (ctx.routines === false) return;
  const face = ctx.d6();
  const r = p.routine?.[face - 1] ?? "stay";
  let to = p.room;
  // sniff: one room toward the nearest free cat inside the house (v0.9); ties: the Storyteller's pick (house order)
  if (r === "sniff") to = stepToward(s, p.room, freeInside(s).map(c => c.where), { doors: true }) ?? p.room;
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

/** Ch 6 / Ch 8 (v0.8): the human the Prize Clock moved this round stays with the prize and answers no noise. */
export const clockHeld = (s, h) => h.staysRound === s.round;
/** Ch 5 / Ch 6 (v0.9): a human who shooed a cat out this round stays in that entrance's room and answers no noise. */
export const shooHeld = (s, h) => h.shooRound === s.round;

/**
 * Ch 6 "Noise" (v0.9): each noise, in the order made, draws the closest awake
 * human within two rooms who isn't already in that room, isn't holding a cat,
 * and isn't staying put this round — with the prize the Clock just moved
 * (REVIEW #79), or by the entrance they just shooed a cat out of; each human
 * answers only one. Two as close: the higher Attention goes; still tied, a die
 * (ctx.d6, pickHuman). A human who answers goes straight there, sees only that
 * room and stays. Several noises in one room count as one (REVIEW #75); a
 * Searching human still answers noise first (#84). Messes are found later, in
 * Finding it. Returns the answered keys.
 */
export function resolveNoise(s, ev, ctx = {}) {
  const answered = new Set();
  const mood = [];
  const rooms = [];
  for (const n of s.noise ?? []) if (!rooms.includes(n.room)) rooms.push(n.room);
  const acting = s.pendingTrigger?.human ?? null; // busy chasing out or picking up a cat (the Storyteller's pick)
  const hearing = h => !h.holding && !isAsleep(s, h) && !hasTrait(h, "headphones") && !hasTrait(h, "busy") && h.key !== acting;
  const staying = h => clockHeld(s, h) || shooHeld(s, h);
  for (const room of rooms) {
    const inRange = (s.humans ?? [])
      .map((h, i) => ({ h, d: dist(s, h.room, room), i }))
      .filter(x => hearing(x.h) && !answered.has(x.h.key) && x.h.room !== room && x.d <= R.noiseRange);
    const cands = inRange.filter(x => !staying(x.h)).sort((a, b) => a.d - b.d || a.i - b.i);
    const closest = cands.length ? cands[0].d : Infinity;
    for (const x of inRange.filter(y => staying(y.h) && y.d <= closest)) {
      const z = s.prize;
      const withIt = z && !z.out && !z.gone && !z.withHuman && z.room === x.h.room;
      if (clockHeld(s, x.h)) {
        ev.push({ type: "holdIgnoresNoise", room, human: x.h.key,
          text: `${x.h.name} stays ${withIt ? `with the ${z.name}` : "put"} (the Prize Clock's hold): the noise in the ${roomName(s, room).toLowerCase()} doesn't draw them this round.` });
      } else {
        ev.push({ type: "shooIgnoresNoise", room, human: x.h.key,
          text: `${x.h.name} stays by the entrance they shooed a cat out of: the noise in the ${roomName(s, room).toLowerCase()} doesn't draw them this round.` });
      }
    }
    if (!cands.length) { ev.push({ type: "noiseUnanswered", room, text: `Nobody comes to see the noise in the ${roomName(s, room).toLowerCase()}.` }); continue; }
    const { h, tie, face } = pickHuman(cands.filter(x => x.d === closest).map(x => x.h), ctx.d6);
    h.room = room;
    h.answeredRound = s.round;
    answered.add(h.key);
    const why = { attention: " (as close as another: the higher Attention goes)", die: ` (as close as another and tied on Attention: a die, ${face})`, pick: " (a tie: the Storyteller's pick)" }[tie] ?? "";
    ev.push({ type: "noiseAnswered", room, human: h.key, tie: tie ?? null,
      text: `${h.name} comes to see the noise in the ${roomName(s, room).toLowerCase()}${why}.` });
  }
  return { answered, mood };
}

/* -------------------------------------------------------------- routines -- */

/**
 * Ch 6 / Ch 11: every other human's d6 routine. Holders don't follow it (Ch 10);
 * a human who answered a noise, whom the Prize Clock moved this round, or who
 * shooed a cat out this round (v0.8: they stay in that entrance's room) stays;
 * a sleeping human stays put (v0.8, REVIEW #73); and a Searching human hunts
 * instead (v0.6): while the prize is still inside (v0.9: an all-eaten prize
 * isn't), stays with it if it's in their room, else steps into its room if it's
 * next door; else stays with a cat in sight, else steps into a next room with an
 * unhidden cat (the Storyteller's pick between rooms: a die); else follows the
 * routine. v0.9 (Ch 11): a dozing human who is awake rolls the doze die every
 * house's turn, even in a round they roll no routine (they answered a noise,
 * stayed for the Clock or a Shoo!, or Searched): 1–2, asleep until the end of
 * the next round. Only a Prize Clock job wakes them (prize.mjs). A human holding
 * a cat rolls no doze die (they're busy cuddling; Ch 10).
 */
export function humanRoutines(s, ctx, answered, ev) {
  for (const h of s.humans ?? []) {
    if (h.holding) continue;
    const awake = !isAsleep(s, h);
    humanRoutine(s, h, ctx, answered, ev);
    if (awake && hasTrait(h, "dozes") && ctx.routines !== false) {
      const doze = ctx.d6();
      if (doze <= R.dozeOn) {
        h.asleepUntil = s.round + 1;
        ev.push({ type: "doze", human: h.key, face: doze, text: `${h.name} nods off (d6 ${doze}): asleep until the end of next round.` });
      }
    }
  }
}

function humanRoutine(s, h, ctx, answered, ev) {
  if (answered.has(h.key)) return;
  if (clockHeld(s, h)) {
    const z = s.prize;
    const withIt = z && !z.out && !z.gone && !z.withHuman && z.room === h.room;
    ev.push({ type: "stays", human: h.key, text: `${h.name} stays ${withIt ? `with the ${z.name}` : "put"} (the Prize Clock).` });
    return;
  }
  if (h.shooRound === s.round || h.key === s.pendingTrigger?.human) {
    ev.push({ type: "stays", human: h.key, text: `${h.name} stays in the ${roomName(s, h.room).toLowerCase()}.` });
    return;
  }
  if (isAsleep(s, h)) { ev.push({ type: "asleep", human: h.key, text: `${h.name} is asleep and stays put.` }); return; }
  if (ctx.routines === false) return; // autoRoutines off: the Storyteller moves them by hand
  if (h.searching) {
    const z = s.prize;
    const allEaten = z?.kind === "delicious" && z.portions > 0 && z.portionsLeft === 0;
    if (z && !z.out && !z.gone && !z.withHuman && z.room && !allEaten) {
      if (z.room === h.room) { ev.push({ type: "searchStay", human: h.key, text: `${h.name} is Searching and stays with the ${z.name}.` }); return; }
      if (neighbours(s, h.room).includes(z.room)) {
        h.room = z.room;
        ev.push({ type: "searchStep", human: h.key, to: z.room, text: `${h.name} is Searching and steps into the ${roomName(s, z.room).toLowerCase()}, where the ${z.name} is.` });
        return;
      }
    }
    const visible = room => freeInside(s).filter(c => c.where === room && !c.hidden);
    if (visible(h.room).length) { ev.push({ type: "searchStay", human: h.key, text: `${h.name} is Searching and stays: a cat in sight.` }); return; }
    const next = neighbours(s, h.room).filter(r => visible(r).length);
    if (next.length) {
      const { pick: to, face } = pickByDie(next, ctx.d6);
      h.room = to;
      ev.push({ type: "searchStep", human: h.key, to, text: `${h.name} is Searching and steps into the ${roomName(s, to).toLowerCase()}${face ? ` (the Storyteller's pick: d6 ${face})` : ""}.` });
      return;
    }
  }
  const face = ctx.d6();
  const r = h.routine?.[face - 1] ?? "stay";
  if (r !== "stay") h.room = r;
  ev.push({ type: "routine", human: h.key, face, result: r, to: h.room,
    text: `${h.name} (d6 ${face}) ${r === "stay" ? "stays put" : `→ ${roomName(s, r).toLowerCase()}`}.` });
}

/**
 * Ch 10: in the house's turn, after the routines, each holder rolls a d6 — 1–3
 * keeps cuddling; 4–5 the Den (v0.9: the human then stays just outside, in the
 * room next to the Den's door, for the rest of the round); 6 outside, through
 * the nearest entrance that cat fits through and that works this round (as a
 * Shoo!, v0.9), opened if it was shut, and left open.
 */
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
      ev.push({ type: "shutIn", human: h.key, cat: c.id, face, text: `${h.name} (d6 ${face}) shuts ${c.name} in the ${roomName(s, s.den).toLowerCase()}, "just until we find your owner", and stays just outside, in the ${roomName(s, h.room).toLowerCase()}.` });
    } else {
      // v0.9: out through the nearest entrance the cat fits through that works this round (as a Shoo!), which stays open
      const e = shooEntrances(s, h.room, c)[0];
      const opened = e && !e.open;
      if (e) e.open = true;
      Object.assign(c, { status: "outside", where: "outside", hidden: false, riding: null, outSerial: s.roundSerial });
      ev.push({ type: "putOut", human: h.key, cat: c.id, face, entrance: e?.key ?? null,
        text: `${h.name} (d6 ${face}) ${opened ? `opens the ${e.name}, puts ${c.name} out` : `puts ${c.name} out through the ${e?.name ?? "door"}`} and leaves it open: "Go on, home you go."` });
    }
  }
}

/**
 * Ch 6 "Finding it" (v0.6), at the end of the house's turn, in order:
 *  1. Spotted: a Searching human who can see a cat: +1 Broom (once a round).
 *     v0.9: a held cat counts as seen; the meter it fills still falls on a free
 *     cat that human can see (or waits).
 *  2. The prize: if it's disturbed, every awake human not yet Searching in its
 *     room or in the room where the Clock put it finds it: +1 Broom (once) and
 *     they start Searching.
 *  3. Messes: a human in a room with a mess finds it: +1 Broom, and it's cleared.
 * Returns the Mood steps: [{ side, steps, cause, kind, catId, seenBy }]. MUTATES s.
 */
export function findingIt(s, ev, { disturbed, inPlay }) {
  const mood = [];
  const awake = h => !h.holding && !isAsleep(s, h);
  // the cats this human can see; a meter these steps fill falls on one of them, the Storyteller's pick (v0.7)
  const visibleTo = h => freeInside(s).filter(c => c.where === h.room && !c.hidden).map(c => c.id);
  const spotted = h => seenCatsIn(s, h.room).map(c => c.id);
  const spotter = (s.humans ?? []).find(h => h.searching && awake(h) && spotted(h).length);
  if (spotter) {
    const seen = spotted(spotter);
    const names = seen.map(id => `${catById(s, id)?.name}${catById(s, id)?.status === "held" ? " (held)" : ""}`).join(" and ");
    mood.push({ side: "broom", steps: 1, kind: "spotted", catId: null, candidates: visibleTo(spotter), seenBy: [spotter.key], cause: `${spotter.name} is Searching and spots ${names}` });
    ev.push({ type: "spotted", human: spotter.key, cats: seen, text: `${spotter.name} is Searching and can see ${names}: +1 Broom.` });
  }
  const z = s.prize;
  if (inPlay && disturbed) {
    const finders = (s.humans ?? []).filter(h => !h.searching && awake(h) && (h.room === z.room || h.room === z.spotRoom));
    if (finders.length) {
      for (const h of finders) h.searching = true;
      const looker = finders.find(h => visibleTo(h).length) ?? finders[0];
      mood.push({ side: "broom", steps: 1, kind: "discovery", catId: null, candidates: visibleTo(looker), seenBy: [looker.key],
        cause: `${finders.map(h => h.name).join(" and ")} ${finders.length > 1 ? "find" : "finds"} the ${z.name} disturbed` });
      ev.push({ type: "discovery", humans: finders.map(h => h.key),
        text: `${finders.map(h => h.name).join(" and ")} ${finders.length > 1 ? "find" : "finds"} the ${z.name} disturbed: +1 Broom, and ${finders.length > 1 ? "they start" : "starts"} Searching.` });
    }
  }
  for (const room of [...(s.messes ?? [])]) {
    const h = (s.humans ?? []).find(x => x.room === room && awake(x));
    if (!h) continue;
    s.messes = s.messes.filter(m => m !== room);
    mood.push({ side: "broom", steps: 1, kind: "mess", catId: null, candidates: visibleTo(h), seenBy: [h.key], cause: `${h.name} finds the mess in the ${roomName(s, room).toLowerCase()}` });
    ev.push({ type: "messFound", room, human: h.key, text: `${h.name} finds the mess in the ${roomName(s, room).toLowerCase()}: +1 Broom.` });
  }
  return mood;
}

/** Ch 11: a driven-off pet comes back where it started, awake, when its 3 rounds (counting the first) are up. */
export function petsReturn(s, ev) {
  for (const p of s.pets ?? []) {
    if (p.mode === "hiding" && s.round >= (p.until ?? 0)) {
      p.mode = "awake";
      p.room = p.start;
      ev.push({ type: "petBack", pet: p.key, text: `${p.name} is back in the ${roomName(s, p.room).toLowerCase()}.` });
    }
  }
}
