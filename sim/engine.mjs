/**
 * Plays one robbery from start to finish by the core rules (docs/CORE-RULES.md
 * v0.1). Comments cite the section each rule comes from. The gang's choices are
 * simple documented policies (sim/notes.mjs), never perfect play.
 *
 * Abstractions: rooms are nodes (no grid inside a room); humans walk to any
 * room in one round; a "spot" (counter, table) is one reach roll.
 */
import {
  poolSize, rollPool, pushRoll, moodDelta, applyMood, afterTrigger, holderRoll, chanceAtLeast,
  works, makesNoise, LEAN,
} from "./rules.mjs";
import { hasKnack } from "./character.mjs";

const WAY_RANK = { tight: 0, normal: 1, big: 2 };
const PRIZE_RANK = { small: 0, medium: 1, large: 2 };
const DEN_DOOR = [["streetwise", 1, "open"], ["savage", 2]];
const DEN_INSIDE = [["streetwise", 2, "open"]];

export function playRobbery(house, gang, p, rng, rec) {
  const r = new Robbery(house, gang, p, rng, rec);
  return r.play();
}

class Robbery {
  constructor(house, gang, p, rng, rec) {
    this.h = house; this.p = p; this.rng = rng; this.rec = rec ?? nullRecorder();
    this.patience = Math.max(p.minPatience, house.patience + p.patienceShift);
    this.mood = { broom: 0, cuddle: 0 };
    this.goneAt = house.prize.goneAt + p.clockShift;
    this.lightsOut = this.goneAt + p.lightsOut;
    this.round = 0;
    this.cats = gang.map(c => ({
      ...c, r: { ...c.r }, instincts: [...c.instincts], cattitude: p.cattitudeStart, lives: p.livesPerRobbery,
      loc: "outside", status: "out", hidden: false, carrying: false, temptUsed: new Set(),
      cattitudeHad: p.cattitudeStart, cattitudeSpent: 0, everCaught: false,
    }));
    this.humans = house.humans.map(hu => ({ ...hu, room: hu.start, distractedUntil: -1, holding: null, asleepUntil: -1 }));
    this.pets = house.pets.map(pt => ({ ...pt, room: pt.start, mode: pt.kind === "dog" ? (pt.asleep ? "asleep" : "awake") : "awake", until: -1 }));
    this.ways = house.ways.map(([a, b, size, opts]) => ({ a, b, size, open: !opts, opts: opts ?? null }));
    this.entrances = house.entrances.map(e => ({ ...e, open: true, opts: e.opts.slice() }));
    const pz = house.prize;
    // the prize starts in the human's arms until the Prize Clock script puts it down (CORE-RULES "The prize")
    const first = pz.script[0];
    this.prize = {
      ...pz, spotRoom: null, spotSteps: [], stepsLeft: 0, room: this.humans.find(hu => hu.key === first.by).start,
      withHuman: first.by, down: false,
      carriers: [], portionsLeft: pz.kind === "delicious" ? Math.max(1, Math.round(pz.portions * p.portionScale)) : 0,
      eaten: 0, out: false, gone: false,
    };
    this.prize.portions = this.prize.portionsLeft;
    this.noise = [];
    this.trace = p.trace ? [] : null;
    this.denWay = this.ways.find(w => w.a === house.den || w.b === house.den);
  }

  t(msg) { if (this.trace) this.trace.push(`R${this.round} B${this.mood.broom} C${this.mood.cuddle} /${this.patience} | ${msg}`); }

  // ------------------------------------------------------------ graph
  waysFrom(room) {
    return this.ways.filter(w => w.a === room || w.b === room).map(w => ({ to: w.a === room ? w.b : w.a, way: w }));
  }
  /** Rooms apart, through any way (noise carries through shut doors). */
  dist(a, b) {
    if (a === b) return 0;
    const seen = new Set([a]); let frontier = [a]; let d = 0;
    while (frontier.length) {
      d++; const next = [];
      for (const r of frontier) for (const { to } of this.waysFrom(r)) {
        if (to === b) return d;
        if (!seen.has(to)) { seen.add(to); next.push(to); }
      }
      frontier = next;
    }
    return Infinity;
  }
  /** Shortest path a cat (or carrying group) can take; closed doors are allowed (they get opened). */
  path(from, to, { lean = true, carry = null } = {}) {
    if (from === to) return [];
    const need = carry ? PRIZE_RANK[carry] : (lean ? 0 : 1);
    const prev = new Map([[from, null]]); let frontier = [from];
    while (frontier.length) {
      const next = [];
      for (const r of frontier) for (const { to: t, way } of this.waysFrom(r)) {
        if (prev.has(t)) continue;
        if (WAY_RANK[way.size] < need) continue;
        if (!way.open && !way.opts) continue;
        prev.set(t, r); next.push(t);
        if (t === to) {
          const out = [t]; let c = r;
          while (c !== from) { out.unshift(c); c = prev.get(c); }
          return out;
        }
      }
      frontier = next;
    }
    return null;
  }
  wayBetween(a, b) { return this.ways.find(w => (w.a === a && w.b === b) || (w.a === b && w.b === a)); }

  // ------------------------------------------------------------ seeing
  /** CORE-RULES "The Mood": seen = same room, awake human, not Distracted, not holding a cat, cat not hidden. */
  watchers(room) {
    return this.humans.filter(hu => hu.room === room && hu.asleepUntil < this.round && hu.distractedUntil < this.round && !hu.holding);
  }
  seenBy(cat) { return cat.hidden ? [] : this.watchers(cat.loc); }

  catsIn(room) { return this.cats.filter(c => c.status === "in" && c.loc === room); }
  freeInside() { return this.cats.filter(c => c.status === "in"); }

  // ------------------------------------------------------------ prize state
  prizeGot() {
    const z = this.prize;
    return z.out || (z.kind === "delicious" && z.portionsLeft === 0);
  }
  phase() { return this.prizeGot() || this.prize.gone ? "out" : "get"; }
  placePrize(room, steps) {
    const z = this.prize;
    z.spotRoom = room; z.spotSteps = steps; z.room = room; z.stepsLeft = steps.length; z.down = steps.length === 0; z.withHuman = null;
  }

  dropPrize(cat) {
    if (!cat.carrying) return;
    const z = this.prize;
    for (const id of z.carriers) { const c = this.cats.find(x => x.id === id); if (c) c.carrying = false; }
    z.carriers = [];
    // the human puts it back where it was (CORE-RULES "Shoo!/Scooped!": the cat drops what it carries)
    this.placePrize(z.spotRoom, z.spotSteps);
    this.rec.event("prizeDropped");
  }

  // ------------------------------------------------------------ the Mood
  /** delta: { side, steps } (steps may be negative for a trade). */
  moodChange(delta, cat, why) {
    if (!delta || !delta.steps) return;
    const res = applyMood(this.mood, this.patience, delta);
    this.mood = res.mood;
    this.rec.mood(delta, why);
    if (res.trigger) this.trigger(res.trigger, cat);
  }
  /** Room left on a meter before it triggers. */
  room(side) { return this.patience - this.mood[side]; }

  /** Shoo! / Scooped! (CORE-RULES). */
  trigger(kind, cat) {
    this.rec.event(kind);
    this.t(`TRIGGER ${kind} on ${cat?.id}`);
    const after = afterTrigger(this.mood, this.patience, kind === "shoo" ? "broom" : "cuddle", this.p);
    this.patience = after.patience; this.mood = after.mood;
    if (!cat || cat.status !== "in") return;
    this.dropPrize(cat);
    // Lives: once per robbery, slip free instead (CORE-RULES "Caught")
    const wantLife = cat.lives > 0 && (kind === "scoop" || this.phase() === "get");
    if (wantLife) {
      cat.lives--; this.rec.event("lifeSpent");
      if (this.p.lifeEffect === "hide") cat.hidden = true;
      else { cat.status = "out"; cat.loc = "outside"; cat.hidden = false; }
      return;
    }
    cat.everCaught = true;
    if (kind === "shoo") {
      const ent = this.nearestEntrance(cat.loc);
      cat.status = "out"; cat.loc = "outside"; cat.hidden = false;
      if (ent && this.p.shutOnShoo) ent.open = false;
      this.rec.event("shooed");
    } else {
      const holder = this.watchers(cat.loc)[0] ?? this.humans.find(hu => hu.room === cat.loc && !hu.holding) ?? this.humans.find(hu => !hu.holding);
      if (!holder) return;
      holder.holding = cat.id; holder.room = cat.loc;
      cat.status = "held"; cat.heldBy = holder.key; cat.hidden = false;
      this.rec.event("held");
    }
  }
  nearestEntrance(room) {
    let best = null; let bd = Infinity;
    for (const e of this.entrances) { const d = this.dist(room, e.room); if (d < bd) { bd = d; best = e; } }
    return best;
  }

  // ------------------------------------------------------------ rolling
  /**
   * One roll by a cat (CORE-RULES "Rolling", "Push", "The Mood").
   * opts: { approach, diff, tags, helpers, opposition, seen (default: watchers), important, why, quiet }
   */
  roll(cat, opts) {
    const p = this.p;
    const seenList = opts.seen ?? this.seenBy(cat);
    const seen = seenList.length > 0;
    const attention = opts.approach === "sneaky" && seen ? Math.max(...seenList.map(hu => hu.attention)) : 0;
    const knack = hasKnack(cat, opts.tags ?? []) || !!opts.bodyDie; // Chonky's wriggle die counts like a Knack (max +1)
    const n = poolSize({ rating: cat.r[opts.approach], knack, helpers: opts.helpers ?? 0, difficulty: opts.diff ?? 0,
      opposition: opts.opposition ?? 0, attention }, p);
    let roll = rollPool(this.rng, n);
    let pushedWithMood = false;
    if (roll.result === "flop" && this.wantsPush(cat, opts, seen)) {
      if (cat.cattitude > 0) { cat.cattitude--; cat.cattitudeSpent++; this.rec.event("pushCattitude"); }
      else { pushedWithMood = true; this.rec.event("pushMood"); }
      roll = pushRoll(this.rng, roll);
    }
    this.rec.roll(roll.result, { approach: opts.approach, n, seen, knack, why: opts.why });
    this.t(`${cat.name}(${cat.id}) ${opts.why}: ${opts.approach} ${n}d [${roll.faces}] ${roll.result}${roll.pushed ? " (pushed)" : ""}${seen ? " SEEN" : ""}`);
    if (roll.result === "purrfect") { this.gainCattitude(cat); }
    const kid = seenList.some(hu => hu.kind === "kid");
    const delta = moodDelta({ result: roll.result, approach: opts.approach, seen, mood: this.mood, pushedWithMood, kidDoubles: kid }, p);
    if (makesNoise(roll.result) && !opts.quiet) this.noise.push(cat.loc);
    if (!(roll.result === "clean" && opts.approach === "sneaky") && roll.result !== "purrfect") cat.hidden = false;
    // the Mood moves after the outcome is known; the trigger (if any) hits this cat
    return { result: roll.result, delta, apply: () => this.moodChange(delta, cat, opts.why) };
  }
  gainCattitude(cat) {
    if (cat.cattitude < this.p.cattitudeMax) { cat.cattitude++; cat.cattitudeHad++; }
  }
  wantsPush(cat, opts, seen) {
    const pol = this.p.pushPolicy;
    if (pol === "never") return false;
    if (pol === "always") return true;
    if (!opts.important) return false;
    if (cat.cattitude > 0) return true;
    if (!this.p.pushWithMood) return false;
    // paying with the Mood: only if even a pushed Flop (2 + 1 steps) can't fill either meter
    return Math.min(this.room("broom"), this.room("cuddle")) > 3;
  }

  /** A simple Action done where a human can see it: 1 step toward Broom, or a Sneaky roll to do it unnoticed. */
  simpleInView(cat, why) {
    const seen = this.seenBy(cat);
    if (!seen.length) return true;
    const att = Math.max(...seen.map(hu => hu.attention));
    const n = poolSize({ rating: cat.r.sneaky, knack: false, difficulty: 0, attention: att }, this.p);
    const pClean = chanceAtLeast(n, "clean");
    const nearBroom = this.room("broom") <= 1;
    if (pClean >= 0.42 || (nearBroom && pClean >= 0.3)) {
      const res = this.roll(cat, { approach: "sneaky", why: `${why} (unnoticed)`, important: nearBroom });
      res.apply();
      return works(res.result) && cat.status === "in";
    }
    this.rec.event("simpleInView");
    cat.hidden = false;
    this.moodChange({ side: "broom", steps: 1 }, cat, why);
    return cat.status === "in";
  }

  // ------------------------------------------------------------ play
  play() {
    for (this.round = 1; ; this.round++) {
      this.noise = [];
      this.startOfRound();
      this.temptations();
      this.catsAct();
      this.houseActs();
      this.t(`state: cats ${this.cats.map(c => `${c.id}:${c.status}@${c.loc}${c.carrying ? "+P" : ""}${c.hidden ? "(h)" : ""}`).join(" ")} | humans ${this.humans.map(h => `${h.key}@${h.room}${h.holding ? "+" + h.holding : ""}`).join(" ")} | pets ${this.pets.map(x => `${x.key}@${x.room}:${x.mode}`).join(" ")} | prize ${this.prize.room}${this.prize.down ? " down" : ""} left ${this.prize.portionsLeft} | noise ${[...new Set(this.noise)]}`);
      const end = this.checkEnd();
      if (end) return this.finish(end);
    }
  }

  startOfRound() {
    const z = this.prize;
    if (z.gone || this.prizeGot()) return;
    if (z.withHuman) z.room = this.humans.find(hu => hu.key === z.withHuman).room;
    for (const s of this.h.prize.script) {
      if (s.round !== this.round || z.carriers.length) continue;
      this.placePrize(s.room, s.steps);
      const by = this.humans.find(hu => hu.key === s.by);
      if (by && !by.holding) by.room = s.room;
      this.rec.event("prizeMoved");
    }
    if (this.round >= this.goneAt && !z.carriers.length && !z.out) {
      z.gone = true; this.rec.event("prizeGone");
    }
  }

  // ------------------------------------------------------------ temptation (CORE-RULES "A round", start)
  temptations() {
    for (const c of this.cats) c.tempted = null;
    for (let k = 0; k < this.p.temptPerRound; k++) {
      const eligible = [];
      for (const c of this.freeInside()) {
        if (c.tempted) continue;
        const here = [...(this.h.rooms[c.loc]?.tempt ?? [])];
        if (this.pets.some(pt => pt.kind === "vacuum" && pt.room === c.loc)) here.push("hunter");
        for (const i of c.instincts) {
          const key = `${c.loc}:${i}`;
          if (here.includes(i) && !c.temptUsed.has(key)) eligible.push({ c, i, key, cost: this.temptCost(c, i) });
        }
      }
      if (!eligible.length) return;
      const pick = this.p.tempter === "mean" ? eligible.sort((a, b) => b.cost - a.cost)[0] : this.rng.pick(eligible);
      pick.c.temptUsed.add(pick.key);
      this.rec.event("tempted");
      if (this.resists(pick.c, pick.cost)) {
        pick.c.cattitude--; pick.c.cattitudeSpent++; this.rec.event("resisted");
      } else {
        pick.c.tempted = pick.i; this.gainCattitude(pick.c); this.rec.event("gaveIn"); this.rec.instinct(pick.i, "gaveIn");
      }
    }
  }
  /** How much giving in would hurt right now (policy input). */
  temptCost(c, i) {
    let cost = 0;
    if (c.carrying) cost += 3;
    if (this.phase() === "get" && c.loc === this.prize.room) cost += 1;
    const seen = this.seenBy(c).length > 0;
    const quiet = i === "boxSitter" || i === "climber";
    if (seen && !quiet) cost += (i === "lapCat" ? (this.room("cuddle") <= 1 ? 3 : 1) : (this.room("broom") <= 1 ? 3 : 1));
    return cost;
  }
  resists(c, cost) {
    if (c.cattitude <= 0) return false;
    const pol = this.p.resistPolicy;
    if (pol === "always") return true;
    if (pol === "never") return false;
    return cost >= 3 || (cost >= 1 && c.cattitude >= 3);
  }
  /** Giving in: the instinct thing is this cat's Action (DESIGN.md "Instincts"). */
  doTemptation(c) {
    const i = c.tempted;
    if (c.carrying && i !== "boxSitter") this.dropPrize(c);
    if (i === "boxSitter" || i === "climber") { c.hidden = true; return; }
    const seen = this.seenBy(c).length > 0;
    this.noise.push(c.loc);
    if (i === "scrapper") for (const pt of this.pets) if (pt.room === c.loc && pt.kind === "dog" && pt.mode !== "hiding") pt.mode = "angry";
    if (seen) this.moodChange({ side: i === "lapCat" ? "cuddle" : "broom", steps: 1 }, c, `temptation:${i}`);
  }

  // ------------------------------------------------------------ the cats' turns
  catsAct() {
    for (const c of this.cats) { c.moved = false; c.acted = false; }
    this.plan = this.makePlan();
    const order = [...this.cats].sort((a, b) => this.priority(b) - this.priority(a));
    for (const c of order) {
      if (c.status === "held") this.heldTurn(c);
      else if (c.status === "shut") this.shutTurn(c);
      else if (c.status === "in") this.insideTurn(c);
      else if (c.status === "out") this.outsideTurn(c);
    }
  }
  priority(c) {
    if (this.plan.distract.has(c.id)) return 3;
    if (c.status === "in" && c.loc === this.prize.room) return 2;
    if (c.status === "in") return 1;
    return 0;
  }

  /** Gang plan for the round: who distracts the watchers of the prize room, who lures. */
  makePlan() {
    const plan = { distract: new Map(), lure: null, wait: false };
    if (this.phase() !== "get" || this.prize.carriers.length) return plan;
    const R = this.prize.room;
    const ws = this.watchers(R);
    if (!ws.length) return plan;
    const cand = this.freeInside().filter(c => !c.carrying && !c.tempted && c.r.sweet >= 2 &&
      (c.loc === R || (this.path(c.loc, R, { lean: c.body === "lean" })?.length === 1 && this.wayBetween(c.loc, R)?.open)))
      .sort((a, b) => b.r.sweet - a.r.sweet);
    let cuddleRoom = this.room("cuddle") - 1;
    for (const w of ws) {
      const c = cand.shift();
      const cost = w.kind === "kid" ? 2 : 1;
      if (!c || cuddleRoom - cost < 0) break;
      cuddleRoom -= cost;
      plan.distract.set(c.id, w.key);
    }
    if (plan.distract.size < ws.length && ws.length === 1) {
      // lure the lone watcher away with noise from a neighbouring room nobody else is near
      const w = ws[0];
      for (const c of this.freeInside()) {
        if (c.carrying || c.tempted || plan.distract.has(c.id)) continue;
        const spots = this.waysFrom(R).map(x => x.to).filter(room => !this.watchers(room).length && this.closestHuman(room)?.key === w.key);
        const reach = spots.find(s => s === c.loc || (this.wayBetween(c.loc, s)?.open));
        if (reach) { plan.lure = { cat: c.id, room: reach }; break; }
      }
    }
    return plan;
  }
  closestHuman(room) {
    let best = null; let bd = Infinity;
    for (const hu of this.humans) {
      if (hu.holding || hu.asleepUntil >= this.round || hu.kind === "teen") continue;
      const d = this.dist(hu.room, room);
      if (d < bd) { bd = d; best = hu; }
    }
    return bd <= this.p.noiseRange ? best : null;
  }

  hostilePet(room) {
    return this.pets.find(pt => pt.room === room && pt.mode !== "hiding" && pt.mode !== "friendly" &&
      ((pt.kind === "dog" && pt.mode === "angry") || pt.kind === "housecat"));
  }

  insideTurn(c) {
    if (c.tempted) { this.doTemptation(c); c.acted = true; if (c.status !== "in") return; }
    // a cat starting its turn with an angry dog / guarding house cat must deal with it or leave (CORE-RULES "Residents")
    const pet = this.hostilePet(c.loc);
    if (pet) {
      const stay = this.phase() === "get" && (c.loc === this.prize.room || c.carrying);
      if (stay && !c.acted) { this.confront(c, pet); if (c.status !== "in") return; }
      else if (!c.moved) { this.stepToward(c, this.goalRoom(c)) || this.fleeRandom(c); }
      if (this.hostilePet(c.loc) === pet) return; // still stuck with it
    }
    if (this.plan.distract.has(c.id) && !c.acted) { this.distract(c, this.plan.distract.get(c.id)); return; }
    if (this.plan.lure?.cat === c.id && !c.acted) {
      if (c.loc !== this.plan.lure.room && !c.moved) this.moveTo(c, this.plan.lure.room);
      if (c.loc === this.plan.lure.room) { this.lure(c); return; }
    }
    if (c.carrying) return this.carryTurn(c);
    if (this.phase() === "get") return this.getTurn(c);
    return this.outTurn(c);
  }

  goalRoom(c) {
    if (this.phase() === "get" && !c.carrying) return this.prize.room;
    const ex = this.bestExit(c);
    return ex ? ex.room : c.loc;
  }

  /** Move one room toward a goal, opening a closed door with the Action if needed. */
  stepToward(c, goal) {
    if (c.loc === goal || c.moved) return false;
    const path = this.path(c.loc, goal, { lean: c.body === "lean" });
    if (!path || !path.length) return false;
    const next = path[0];
    const way = this.wayBetween(c.loc, next);
    if (!way.open) {
      if (c.acted) return false;
      if (!this.openWay(c, way)) return false;
    }
    return this.moveTo(c, next);
  }
  moveTo(c, room) {
    if (c.moved) return false;
    const way = this.wayBetween(c.loc, room);
    if (!way || !way.open) return false;
    if (way.size === "tight" && c.body !== "lean") return false;
    c.loc = room; c.moved = true; c.hidden = false;
    return true;
  }
  fleeRandom(c) {
    const opts = this.waysFrom(c.loc).filter(x => x.way.open && (x.way.size !== "tight" || c.body === "lean"));
    if (!opts.length) return false;
    c.loc = this.rng.pick(opts).to; c.moved = true; c.hidden = false;
    return true;
  }
  openWay(c, way) {
    const opts = way === this.denWay && c.loc === this.h.den && c.status === "shut" ? DEN_INSIDE : way.opts;
    const best = this.bestOption(c, opts);
    const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: "door" });
    c.acted = true;
    if (works(res.result)) { way.open = true; }
    res.apply();
    return way.open && c.status === "in";
  }
  bestOption(c, opts) {
    let best = opts[0]; let bp = -1;
    for (const o of opts) {
      const seen = this.seenBy(c);
      const att = o[0] === "sneaky" && seen.length ? Math.max(...seen.map(h => h.attention)) : 0;
      const n = poolSize({ rating: c.r[o[0]], knack: hasKnack(c, o.slice(2)), difficulty: o[1], attention: att }, this.p);
      const pr = chanceAtLeast(n, "scrape") + 0.3 * chanceAtLeast(n, "clean");
      if (pr > bp) { bp = pr; best = o; }
    }
    return best;
  }

  confront(c, pet) {
    // choose Savage (drive off), Sweet (befriend a soft one), or Sneaky (slip past this turn)
    const options = [["savage", pet.rating, "fight"], ["sneaky", pet.rating]];
    if (pet.soft) options.push(["sweet", pet.rating]);
    const best = this.bestOption(c, options);
    const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: `vs ${pet.kind}` });
    c.acted = true;
    if (works(res.result)) {
      if (best[0] === "savage") { pet.mode = "hiding"; pet.until = this.round + 3; this.rec.event("petDrivenOff"); }
      else if (best[0] === "sweet") { pet.mode = "friendly"; this.rec.event("petBefriended"); }
      else { pet.slippedBy = `${c.id}:${this.round}`; this.rec.event("petSlipped"); }
    } else {
      if (pet.kind === "dog") { pet.mode = "angry"; }
      if (!c.moved) this.fleeRandom(c);
      this.rec.event("chased");
    }
    res.apply();
  }

  distract(c, humanKey) {
    const R = this.prize.room;
    if (c.loc !== R && !c.moved) this.moveTo(c, R);
    const w = this.humans.find(hu => hu.key === humanKey);
    if (c.loc !== w.room || !this.watchers(w.room).includes(w)) return;
    const res = this.roll(c, { approach: "sweet", tags: ["charm"], seen: [w], important: true, why: "distract" });
    c.acted = true;
    if (works(res.result)) { w.distractedUntil = this.round + this.p.distractRounds; this.rec.event("distracted"); }
    res.apply();
  }
  lure(c) {
    // knocking something over on purpose: noise draws the closest human (CORE-RULES "A round": noise)
    c.acted = true; this.noise.push(c.loc); this.rec.event("lure");
    if (this.seenBy(c).length) this.moodChange({ side: "broom", steps: 1 }, c, "lure");
  }

  /** In the prize room (or heading there) while the prize is still to get. */
  getTurn(c) {
    if (this.prize.carriers.length) return this.escortTurn(c);
    const R = this.prize.room;
    if (c.loc !== R) {
      this.stepToward(c, R);
      if (c.loc !== R || c.acted) return;
    }
    if (c.acted) return;
    if (this.hostilePet(R) && !(this.hostilePet(R).slippedBy === `${c.id}:${this.round}`)) return;
    const seen = this.seenBy(c).length > 0;
    if (seen && this.shouldWait(c)) { this.rec.event("waited"); return; }
    const z = this.prize;
    if (z.withHuman) { this.rec.event("waitedForPrize"); return; }
    if (!z.down) {
      // each step on the way to the prize needs one roll that works (counter, then foil…)
      const step = z.spotSteps[z.spotSteps.length - z.stepsLeft];
      const best = this.bestOption(c, step.map(o => z.kind === "delicious" ? [...o, "food"] : o));
      const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: "reach prize" });
      c.acted = true;
      if (works(res.result)) { z.stepsLeft--; z.down = z.stepsLeft === 0; }
      res.apply();
      return;
    }
    if (z.kind === "delicious") {
      c.acted = true;
      if (this.simpleInView(c, "eat") && z.portionsLeft > 0) { z.portionsLeft--; z.eaten++; this.rec.event("ate"); }
      return;
    }
    this.tryPickUp(c);
  }
  shouldWait(c) {
    const b = this.p.boldness;
    if (b === "bold") return false;
    const left = this.goneAt - this.round;
    const danger = this.room("broom") <= 2;
    if (b === "careful") return left > 2 || danger && left > 1;
    return danger ? left > 1 : (left > 4 && this.room("broom") <= 2);
  }
  canCarry(group) {
    const z = this.prize;
    if (z.size === "small") return group.length >= 1;
    const chonky = group.some(c => c.body === "chonky");
    if (z.size === "medium") return chonky || group.length >= 2;
    return group.length >= 3 || (group.length >= 2 && chonky);
  }
  tryPickUp(c) {
    const R = this.prize.room;
    const z = this.prize;
    if (z.carriers.length) return;
    // everyone in the room who hasn't acted joins in (group action, CORE-RULES "Together")
    const group = this.catsIn(R).filter(x => !x.acted && !x.carrying && !x.tempted);
    if (!group.includes(c)) group.unshift(c);
    let need = group;
    if (z.size === "small") need = [c];
    else {
      need = [];
      for (const x of group.sort((a, b) => (b.body === "chonky") - (a.body === "chonky"))) { need.push(x); if (this.canCarry(need)) break; }
    }
    if (!this.canCarry(need)) return; // wait for the others
    for (const x of need) x.acted = true;
    if (!this.simpleInView(c, "take prize")) return;
    z.carriers = need.map(x => x.id);
    for (const x of need) x.carrying = true;
    this.rec.event("tookPrize");
  }

  carryTurn(c) {
    const z = this.prize;
    const group = z.carriers.map(id => this.cats.find(x => x.id === id));
    if (group[0] !== c) return; // the group moves on its leader's turn
    const ex = this.bestExit(c, z.size);
    if (!ex) return;
    if (c.loc !== ex.room) {
      if (group.some(x => x.moved)) return;
      const path = this.path(c.loc, ex.room, { carry: z.size });
      if (!path || !path.length) return;
      const way = this.wayBetween(c.loc, path[0]);
      if (!way.open) {
        const opener = group.find(x => !x.acted) ?? c;
        if (!this.openWay(opener, way)) return;
      }
      for (const x of group) { x.loc = path[0]; x.moved = true; x.hidden = false; }
      z.room = path[0];
      if (this.seenBy(c).length) this.moodChange({ side: "broom", steps: 1 }, c, "carrying in view");
      if (c.status !== "in" || c.loc !== ex.room) return;
    }
    // go out through the entrance
    if (!group.some(x => x.moved) || ex.opts.length === 0) this.exitThrough(group, ex);
  }

  /** Someone else has the prize: head for their exit and wait inside until it's out (policy). */
  escortTurn(c) {
    const lead = this.cats.find(x => x.id === this.prize.carriers[0]);
    const ex = lead && this.bestExit(lead, this.prize.size);
    if (!ex) return;
    if (c.loc !== ex.room) this.stepToward(c, ex.room);
  }

  bestExit(c, carry = null) {
    let best = null; let bs = -Infinity;
    for (const e of this.entrances) {
      if (!e.open) continue;
      if (e.rounds && !e.rounds.includes(this.round)) continue;
      if (e.size === "tight" && c.body !== "lean") continue;
      if (carry && (PRIZE_RANK[carry] > WAY_RANK[e.size] || (e.climb && carry !== "small"))) continue;
      const path = this.path(c.loc, e.room, { lean: c.body === "lean", carry });
      if (path === null) continue;
      const pr = e.opts.length ? chanceAtLeast(poolSize({ rating: c.r[this.bestOption(c, e.opts)[0]], difficulty: this.bestOption(c, e.opts)[1] }, this.p), "scrape") : 1;
      const score = pr - 0.35 * path.length;
      if (score > bs) { bs = score; best = e; }
    }
    return best;
  }

  exitThrough(group, e) {
    const lead = group[0];
    if (e.opts.length) {
      const best = this.bestOption(lead, e.opts);
      const res = this.roll(lead, { approach: best[0], diff: best[1], tags: best.slice(2), helpers: group.length - 1, important: true, why: "exit" });
      for (const x of group) x.acted = true;
      res.apply();
      if (!works(res.result) || lead.status !== "in") return false;
    } else if (lead.carrying && this.seenBy(lead).length) {
      for (const x of group) x.acted = true;
      if (!this.simpleInView(lead, "out with the prize")) return false;
    }
    if (e.noisy) this.noise.push(e.room);
    for (const x of group) {
      if (x.status !== "in") continue;
      x.status = "out"; x.loc = "outside"; x.hidden = false; x.moved = true;
      if (x.carrying) { x.carrying = false; }
    }
    if (group[0].id === this.prize.carriers[0]) {
      this.prize.out = true; this.prize.carriers = []; this.rec.event("prizeOut");
    }
    return true;
  }

  outTurn(c) {
    // rescue a shut-in gang mate if there's time (policy)
    const shut = this.cats.filter(x => x.status === "shut");
    if (shut.length && this.lightsOut - this.round >= 2 && this.denWay && !this.denWay.open) {
      const outside = this.waysFrom(this.h.den).map(x => x.to)[0];
      if (c.loc !== outside) { this.stepToward(c, outside); }
      if (c.loc === outside && !c.acted) {
        const best = this.bestOption(c, DEN_DOOR);
        const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: "rescue" });
        c.acted = true;
        if (works(res.result)) { this.denWay.open = true; for (const s of shut) { s.status = "in"; s.loc = this.h.den; } this.rec.event("rescued"); }
        res.apply();
      }
      return;
    }
    const ex = this.bestExit(c);
    if (!ex) return;
    if (c.loc !== ex.room) this.stepToward(c, ex.room);
    if (c.loc === ex.room && !c.acted) this.exitThrough([c], ex);
  }

  outsideTurn(c) {
    if (c.acted) return;
    const ph = this.phase();
    const rescue = ph === "out" && this.cats.some(x => x.status === "shut") && this.lightsOut - this.round >= 3 && !this.freeInside().length;
    if (ph !== "get" && !rescue) return;
    if (this.round > 1 && ph === "get" && this.goneAt - this.round < 1) return;
    // pick an entrance (policy: best chance, closest to the prize)
    let best = null; let bs = -Infinity;
    const goal = ph === "get" ? this.prize.room : this.h.den;
    for (const e of this.entrances) {
      if (!e.open || (e.rounds && !e.rounds.includes(this.round))) continue;
      if (e.size === "tight" && c.body !== "lean") continue;
      const opt = e.opts.length ? this.bestOption({ ...c, loc: e.room }, e.opts) : null;
      const pr = opt ? chanceAtLeast(poolSize({ rating: c.r[opt[0]], knack: hasKnack(c, opt.slice(2)), difficulty: opt[1] }, this.p), "scrape") : 1;
      const d = this.dist(e.room, goal);
      const score = pr - 0.15 * d - (this.pets.some(pt => pt.room === e.room && pt.kind === "dog" && pt.mode !== "hiding" && pt.mode !== "friendly") ? 0.3 : 0);
      if (score > bs) { bs = score; best = e; }
    }
    if (!best) return;
    c.moved = true;
    if (best.opts.length) {
      const prev = c.loc; c.loc = best.room; c.status = "in"; // the roll is made at the entrance, in view of that room
      const opt = this.bestOption(c, best.opts);
      const res = this.roll(c, { approach: opt[0], diff: opt[1], tags: opt.slice(2), important: true, why: `enter:${best.key}` });
      c.acted = true;
      if (!works(res.result)) { c.loc = prev; c.status = "out"; res.apply(); return; }
      if (best.jam) best.opts = [];
      if (best.key === "front" && opt[0] === "sweet") this.rec.event("letIn");
      res.apply();
    } else {
      c.loc = best.room; c.status = "in";
      if (best.noisy) this.noise.push(best.room);
    }
    c.hidden = false;
    this.rec.entrance(best.key);
  }

  heldTurn(c) {
    // limp (keep the holder busy) if a gang mate is working in this room; otherwise wriggle (CORE-RULES "Caught")
    const holder = this.humans.find(hu => hu.key === c.heldBy);
    const mates = this.catsIn(holder.room).length > 0 && this.phase() === "get";
    if (mates) { this.rec.event("limp"); return; }
    const res = this.roll(c, { approach: "savage", diff: this.p.wriggleDiff, bodyDie: c.body === "chonky",
      seen: [holder], important: true, why: "wriggle" });
    if (works(res.result)) {
      holder.holding = null; c.status = "in"; c.loc = holder.room; c.heldBy = null; this.rec.event("wriggledFree");
    }
    res.apply();
  }
  shutTurn(c) {
    if (this.denWay.open) { c.status = "in"; c.loc = this.h.den; return; }
    const res = this.roll(c, { approach: "streetwise", diff: 2, tags: ["open"], seen: [], important: true, why: "escape den" });
    if (works(res.result)) { this.denWay.open = true; c.status = "in"; c.loc = this.h.den; this.rec.event("escapedDen"); }
    res.apply();
  }

  // ------------------------------------------------------------ the house (CORE-RULES "A round", house)
  houseActs() {
    // pets
    for (const pt of this.pets) this.petActs(pt);
    // noise: each noise room draws the closest awake human within range
    const answered = new Set();
    const rooms = [...new Set(this.noise)];
    for (const room of rooms) {
      const cands = this.humans.filter(hu => !hu.holding && hu.asleepUntil < this.round && hu.kind !== "teen" && !answered.has(hu.key))
        .map(hu => ({ hu, d: this.dist(hu.room, room) })).filter(x => x.d <= this.p.noiseRange).sort((a, b) => a.d - b.d);
      const takers = this.p.noiseAnswer === "all" ? cands : cands.slice(0, 1);
      for (const { hu } of takers) { if (hu.room !== room) this.rec.event("answeredNoise"); hu.room = room; answered.add(hu.key); }
    }
    // routines
    for (const hu of this.humans) {
      if (hu.holding) { this.holderActs(hu); continue; }
      if (answered.has(hu.key)) continue;
      const res = hu.routine[this.rng.d6() - 1];
      if (res !== "stay") hu.room = res;
      if (hu.kind === "grandparent" && this.rng.d6() <= 2) hu.asleepUntil = this.round + 1;
    }
    // driven-off pets come back
    for (const pt of this.pets) if (pt.mode === "hiding" && this.round >= pt.until) { pt.mode = "awake"; pt.room = pt.start; }
  }

  petActs(pt) {
    const catsHere = () => this.cats.filter(c => c.status === "in" && c.loc === pt.room);
    if (pt.kind === "vacuum") {
      const opts = this.waysFrom(pt.room).map(x => x.to).filter(r => pt.roam.includes(r));
      if (opts.length) pt.room = this.rng.pick(opts);
      return;
    }
    if (pt.kind === "parrot") {
      if (pt.mode !== "covered" && catsHere().some(c => !c.hidden)) { this.noise.push(pt.room); this.rec.event("squawk"); }
      return;
    }
    if (pt.kind === "housecat") return;
    // dog
    if (pt.mode === "hiding" || pt.mode === "friendly") return;
    if (pt.mode === "asleep") {
      const near = this.noise.some(r => this.dist(r, pt.room) <= 1);
      if (!near) return;
      pt.mode = "awake";
    }
    if (catsHere().length) { pt.mode = "angry"; this.noise.push(pt.room); this.rec.event("bark"); return; }
    pt.mode = "awake";
    const f = this.rng.d6();
    if (f >= 3) {
      const opts = this.waysFrom(pt.room).filter(x => x.way.open && pt.roam.includes(x.to)).map(x => x.to);
      let to = null;
      if (f >= 5) {
        // sniff toward the nearest cat
        let bd = Infinity;
        for (const o of opts) for (const c of this.freeInside()) { const d = this.dist(o, c.loc); if (d < bd) { bd = d; to = o; } }
      }
      if (!to && opts.length) to = this.rng.pick(opts);
      if (to) pt.room = to;
    }
    if (catsHere().length) { pt.mode = "angry"; this.noise.push(pt.room); this.rec.event("bark"); }
  }

  holderActs(hu) {
    const c = this.cats.find(x => x.id === hu.holding);
    if (!c || c.status !== "held") { hu.holding = null; return; }
    const what = holderRoll(this.rng.d6(), this.p);
    if (what === "keep") return;
    hu.holding = null; c.heldBy = null;
    if (what === "den") {
      c.status = "shut"; c.loc = this.h.den; hu.room = this.h.den;
      if (this.denWay) this.denWay.open = false;
      this.rec.event("shutIn");
    } else {
      c.status = "out"; c.loc = "outside"; this.rec.event("putOut");
    }
  }

  // ------------------------------------------------------------ ending (CORE-RULES "Ending")
  checkEnd() {
    if (this.round >= this.lightsOut) return "lightsOut";
    const inside = this.freeInside().length;
    const caught = this.cats.some(c => c.status === "held" || c.status === "shut");
    if (inside) return null;
    if (this.phase() === "out") {
      if (!caught) return "allOut";
      const canRescue = this.entrances.some(e => e.open && !e.rounds) && this.lightsOut - this.round >= 3 && this.cats.some(c => c.status === "shut");
      return canRescue || this.cats.some(c => c.status === "held") ? null : "allOut";
    }
    const canEnter = this.cats.some(c => c.status === "out") && this.entrances.some(e => e.open && (!e.rounds || e.rounds.includes(this.round + 1)));
    if (canEnter || caught) return null;
    return "lockedOut";
  }

  finish(reason) {
    this.t(`END ${reason}; cats: ${this.cats.map(c => `${c.id}:${c.status}@${c.loc}`).join(" ")}; prize ${JSON.stringify({ room: this.prize.room, down: this.prize.down, left: this.prize.portionsLeft, out: this.prize.out, gone: this.prize.gone })}`);
    const left = this.cats.filter(c => c.status === "in" || c.status === "held" || c.status === "shut");
    const got = this.prizeGot();
    // Messy: at least half the portions eaten (CORE-RULES "Ending")
    const partial = !got && this.prize.kind === "delicious" && this.prize.eaten * 2 >= this.prize.portions;
    let outcome = "busted";
    if (got && !left.length) outcome = "clean";
    else if (got || partial) outcome = "messy";
    const out = {
      outcome, reason, rounds: this.round, leftBehind: left.length, prizeGot: got, partial,
      everCaught: this.cats.filter(c => c.everCaught).length, cats: this.cats, trace: this.trace,
    };
    this.rec.finish(out);
    return out;
  }
}

function nullRecorder() {
  const f = () => {};
  return { event: f, mood: f, roll: f, instinct: f, entrance: f, finish: f };
}

export { Robbery };
