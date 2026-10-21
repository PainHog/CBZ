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
    // gang-size scaling (CORE-RULES "Ending"): [Patience, Clock] for 3 cats and for 5 cats
    // a house may print its own three- and five-cat numbers (v0.9: house.scale3 / house.scale5)
    const sc = !p.gangScaling ? [0, 0] : gang.length <= 3 ? (house.scale3 ?? p.scale3) : gang.length >= 5 ? (house.scale5 ?? p.scale5) : [0, 0];
    const scaleP = sc[0], scaleC = sc[1];
    this.patience = Math.max(p.minPatience, house.patience + p.patienceShift + scaleP - (p.wary ?? 0));
    this.mood = { broom: 0, cuddle: 0 };
    this.goneAt = house.prize.goneAt + p.clockShift + scaleC - (p.waryClock ?? 0);
    this.lightsOut = this.goneAt + p.lightsOut;
    this.round = 0;
    // campaign (Ch 13): each Rep raise lifts one approach by 1 (the best one still under 4)
    const raise = r => { const k = Object.keys(r).filter(a => r[a] < 4).sort((x, y) => r[y] - r[x])[0]; if (k) r[k]++; return r; };
    const raised = c => { const r = { ...c.r }; for (let i = 0; i < (p.repRaises ?? 0); i++) raise(r); return r; };
    this.cats = gang.map(c => ({
      ...c, r: raised(c), instincts: [...c.instincts], cattitude: p.cattitudeStart + (p.gangScaling && gang.length <= 3 ? p.scale3Cat : 0), lives: p.livesPerRobbery,
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
      // food portions scale with the gang: perCat × cats + plus (CORE-RULES "The prize")
      carriers: [], portionsLeft: pz.kind === "delicious" ? Math.max(1, Math.round(((pz.perCat ?? 0) * Math.min(gang.length, p.portionCats ?? 99) + (pz.plus ?? pz.portions ?? 0)) * p.portionScale)) : 0,
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
    return this.humans.filter(hu => hu.room === room && hu.asleepUntil < this.round && hu.distractedUntil < this.round && (!hu.holding || this.tr("holderSees")));
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
    z.spotRoom = room; z.spotSteps = steps; z.room = room; z.stepsLeft = steps.length; z.down = steps.length === 0; z.withHuman = null; z.disturbed = false;
  }

  dropPrize(cat, { here = false } = {}) {
    if (!cat.carrying) return;
    const z = this.prize;
    for (const id of z.carriers) { const c = this.cats.find(x => x.id === id); if (c) c.carrying = false; }
    z.carriers = [];
    if (here && this.p.carrierRules) { z.room = cat.loc; z.down = true; z.stepsLeft = 0; this.markDisturbed(); }
    // the human puts it back where it was (CORE-RULES "Shoo!/Scooped!": the cat drops what it carries)
    else this.placePrize(z.spotRoom, z.spotSteps);
    this.rec.event("prizeDropped");
  }
  /** v0.6 "Finding it": the prize isn't as the Clock left it. */
  markDisturbed() { this.prize.disturbed = true; }

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
    if (cat && cat.status === "held" && kind === "shoo") {
      // a held cat whose own roll fills Broom: the holder lets go and shoos it outside (CORE-RULES v0.7)
      const holder = this.humans.find(hu => hu.key === cat.heldBy);
      if (holder) holder.holding = null;
      const after = afterTrigger(this.mood, this.patience, "broom", this.p);
      this.patience = after.patience; this.mood = after.mood;
      if (this.p.heldBroomDen) {
        // v0.9: "that's it, in you go" — the holder shuts it in the Den instead of letting it out
        cat.status = "shut"; cat.loc = this.h.den; cat.heldBy = null; cat.hidden = false; this.denWay.open = false;
        if (holder) holder.room = this.h.den;
        this.rec.event("shoo"); this.rec.event("denned");
        return;
      }
      cat.status = "out"; cat.loc = "outside"; cat.heldBy = null; cat.hidden = false;
      this.rec.event("shoo"); this.rec.event("shooed");
      return;
    }
    if (!cat || cat.status !== "in") {
      // nobody in sight: the meter stays full and the next cat seen on that side gets it (CORE-RULES "Shoo!/Scooped!")
      this.rec.event(`${kind}Pending`);
      return;
    }
    this.rec.event(kind);
    this.t(`TRIGGER ${kind} on ${cat?.id}`);
    const after = afterTrigger(this.mood, this.patience, kind === "shoo" ? "broom" : "cuddle", this.p);
    this.patience = after.patience; this.mood = after.mood;
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
      const ent = this.p.shooKeepLast ? this.shooEntrance(cat) : this.nearestEntrance(cat.loc);
      cat.status = "out"; cat.loc = "outside"; cat.hidden = false;
      if (ent && this.p.shutOnShoo) {
        // v0.9: the human opens it if need be, puts the cat out and shuts it — unless it's the last way in still open
        const othersOpen = this.entrances.some(e => e !== ent && e.open && !e.rounds);
        if (!this.p.shooKeepLast || othersOpen) ent.open = false; else ent.open = true;
      }
      this.rec.event("shooed");
    } else {
      const ws = this.watchers(cat.loc).filter(hu => !hu.holding).sort((a, b) => b.attention - a.attention); // a holder has their hands full
      const holder = ws[0] ?? this.humans.find(hu => hu.room === cat.loc && !hu.holding) ?? this.humans.find(hu => !hu.holding);
      if (!holder) return;
      holder.holding = cat.id; holder.room = cat.loc;
      cat.status = "held"; cat.heldBy = holder.key; cat.hidden = false;
      this.rec.event("held");
    }
  }
  /**
   * v0.9 Shoo!: the nearest entrance that works this round and that cat fits through (shut or not —
   * the human opens it); if none works, the nearest it fits through; ties in house order.
   */
  shooEntrance(cat) {
    const fits = e => !(e.size === "tight" && cat.body !== "lean");
    const works = e => !e.rounds || e.rounds.includes(this.round);
    let pool = this.entrances.filter(e => fits(e) && works(e));
    if (!pool.length) pool = this.entrances.filter(fits);
    if (!pool.length) pool = this.entrances;
    let best = null; let bd = Infinity;
    for (const e of pool) { const d = this.dist(cat.loc, e.room); if (d < bd) { bd = d; best = e; } }
    return best;
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
    const resists = opts.approach === "sneaky" || (opts.approach === "sweet" && p.attentionVs === "sneaky+sweet");
    const attention = resists && seen ? Math.max(...seenList.map(hu => hu.attention)) : 0;
    const knack = hasKnack(cat, opts.tags ?? [], this.p) || !!opts.bodyDie; // Chonky's wriggle die counts like a Knack (max +1)
    let extra = 0;
    if (p.cattitudeDie && opts.important && cat.cattitude >= 2) { cat.cattitude--; cat.cattitudeSpent++; extra = 1; this.rec.event("cattitudeDie"); }
    const n = poolSize({ rating: cat.r[opts.approach] + extra, knack, helpers: opts.helpers ?? 0, difficulty: opts.diff ?? 0,
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
    if (makesNoise(roll.result) && !opts.quiet) this.noise.push(opts.noiseRoom && works(roll.result) ? opts.noiseRoom : cat.loc);
    cat.hidden = false; // CORE-RULES "Seen": doing anything ends hiding
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

  /**
   * An Action done where a human can see it is always a roll (CORE-RULES "The Mood"):
   * Sneaky to do it unnoticed (their Attention removes dice), Savage to just do it.
   * Policy: the approach with the lowest expected Mood cost, failures weighted heavily.
   */
  simpleInView(cat, why, tags = [], always = false) {
    const seen = this.seenBy(cat);
    if (!seen.length && !always) return true;
    const att = seen.length ? Math.max(...seen.map(hu => hu.attention)) : 0;
    const cost = (approach, n) => {
      const pC = chanceAtLeast(n, "clean"), pS = chanceAtLeast(n, "scrape");
      const clean = approach === "sneaky" ? 0 : 1;
      return pC * clean + (pS - pC) * 1 + (1 - pS) * 4;
    };
    const opts = [["sneaky", att], ["savage", 0]];
    let best = null; let bc = Infinity;
    for (const [a, rm] of opts) {
      const n = poolSize({ rating: cat.r[a], knack: hasKnack(cat, tags, this.p), difficulty: 0 }, this.p) - rm;
      const k = cost(a, n);
      if (k < bc) { bc = k; best = a; }
    }
    const res = this.roll(cat, { approach: best, tags, why, important: true });
    res.apply();
    return works(res.result) && cat.status === "in";
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
      if (s.round !== this.round) continue;
      if (z.carriers.length) {
        // the owner comes for it, finds it gone, and starts Searching (CORE-RULES v0.5 "The prize")
        const by = this.humans.find(hu => hu.key === s.by);
        if (this.p.ownerFetch && by && !by.holding && z.spotRoom) {
          by.room = z.spotRoom; by.staysUntil = this.round;
          if (!(this.p.carrierRules && by.searching)) {
            if (this.p.searching) by.searching = true;
            this.rec.event("ownerFoundItGone");
            this.moodChange({ side: "broom", steps: 1 }, null, "owner finds it gone");
          }
        }
        continue;
      }
      this.placePrize(s.room, s.steps);
      const by = this.humans.find(hu => hu.key === s.by);
      if (by && !by.holding) { by.room = s.room; by.staysUntil = this.round; } // puts it down and stays with it this round
      this.rec.event("prizeMoved");
    }
    if (this.round >= this.goneAt && !z.carriers.length && !z.out) {
      z.gone = true; this.rec.event("prizeGone");
    }
  }

  // ------------------------------------------------------------ temptation (CORE-RULES "A round", start)
  temptations() {
    for (const c of this.cats) c.tempted = null;
    this.lastTempted = this.temptedNow ?? null; this.temptedNow = null;
    for (let k = 0; k < this.p.temptPerRound; k++) {
      const eligible = [];
      for (const c of this.freeInside()) {
        if (c.tempted) continue;
        const here = [...(this.h.rooms[c.loc]?.tempt ?? [])];
        if (this.pets.some(pt => pt.kind === "vacuum" && pt.room === c.loc)) here.push("hunter");
        if (this.p.carrierRules && this.pets.some(pt => pt.room === c.loc && (pt.kind === "dog" || pt.kind === "housecat") && pt.mode !== "asleep" && pt.mode !== "hiding")) here.push("scrapper");
        for (const i of c.instincts) {
          const key = `${c.loc}:${i}`;
          const fresh = this.tr("tempt") ? c.id !== this.lastTempted : !c.temptUsed.has(key);
          if (here.includes(i) && fresh) eligible.push({ c, i, key, cost: this.temptCost(c, i) });
        }
      }
      if (!eligible.length) return;
      const pick = this.p.tempter === "mean" ? eligible.sort((a, b) => b.cost - a.cost)[0] : this.rng.pick(eligible);
      pick.c.temptUsed.add(pick.key); this.temptedNow = pick.c.id;
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
    if (c.carrying && (i !== "boxSitter" || this.p.carrierRules)) this.dropPrize(c, { here: true });
    if (i === "boxSitter" || i === "climber") { c.hidden = true; return; }
    const watchers = this.seenBy(c).filter(hu => !hu.holding);
    // v0.9: a give-in's Mood steps never fill a meter (they stop one short)
    const giveInSteps = (side, steps) => this.p.giveInNoFill ? Math.max(0, Math.min(steps, this.room(side) - 1)) : steps;
    if (i === "lapCat") {
      // a fuss from a human here: that human is Distracted until the round ends (Cuddle +1); no human: a sunny spot, quiet
      if (watchers.length) {
        const w = watchers[0];
        w.distractedUntil = Math.max(w.distractedUntil, this.round);
        if (this.p.lapCountsDistract) w.distractions = (w.distractions ?? 0) + 1;
        this.moodChange({ side: "cuddle", steps: giveInSteps("cuddle", w.kind === "kid" && this.p.carrierRules ? 2 : 1) }, c, "temptation:lapCat");
      }
      return;
    }
    if (i === "foodie") { if (watchers.length) this.moodChange({ side: "broom", steps: giveInSteps("broom", 1) }, c, "temptation:foodie"); return; } // munching is quiet
    this.noise.push(c.loc);
    if (i === "hunter") return; // chasing a fly in view looks innocent: noise only
    // it's on the floor now: whoever comes finds a mess (v0.9: unless a human saw it fall — that's the +1 Broom, once)
    if (i === "knocker" && !(this.p.knockerOneBroom && watchers.length)) (this.messes ??= new Set()).add(c.loc);
    if (i === "scrapper") for (const pt of this.pets) if (pt.room === c.loc && pt.kind === "dog" && pt.mode === "asleep") pt.mode = "awake";
    if (watchers.length) this.moodChange({ side: "broom", steps: giveInSteps("broom", 1) }, c, `temptation:${i}`);
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
    // policy (v0.6): a cat with its Action left and nobody watching hides (free when unseen)
    if (this.cr("spotted")) for (const c of this.freeInside()) if (!c.acted && !c.carrying && !this.seenBy(c).length) c.hidden = true;
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
    if (this.phase() !== "get") return plan;
    let R = this.prize.room;
    if (this.prize.carriers.length) {
      // cover the carriers: keep whoever watches their next room busy
      const lead = this.cats.find(x => x.id === this.prize.carriers[0]);
      const ex = this.bestExit(lead, this.prize.size);
      const path = ex && this.path(lead.loc, ex.room, { carry: this.prize.size });
      const watchedHere = this.watchers(lead.loc).length;
      R = watchedHere || !path?.length ? lead.loc : path[0];
    }
    const ws = this.watchers(R).filter(hu => !hu.holding); // a holder can't be Distracted (their hands are full)
    if (!ws.length) return plan;
    const cand = this.freeInside().filter(c => !c.carrying && !c.tempted && c.r.sweet >= 2 &&
      (c.loc === R || (this.path(c.loc, R, { lean: c.body === "lean" })?.length === 1 && this.wayBetween(c.loc, R)?.open)))
      .sort((a, b) => b.r.sweet - a.r.sweet);
    plan.room = R;
    let cuddleRoom = this.room("cuddle") - 1;
    for (const w of ws) {
      const c = cand.shift();
      const cost = w.kind === "kid" ? 2 : 1;
      if (!c || cuddleRoom - cost < 0) break;
      cuddleRoom -= cost;
      plan.distract.set(c.id, w.key);
    }
    if (plan.distract.size < ws.length && ws.length === 1 && !this.prize.carriers.length) {
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
      if (hu.holding || hu.asleepUntil >= this.round || hu.kind === "teen" || hu.busy) continue;
      const d = this.dist(hu.room, room);
      if (d < bd) { bd = d; best = hu; }
    }
    return bd <= this.p.noiseRange ? best : null;
  }

  hostilePet(room) {
    return this.pets.find(pt => pt.room === room && pt.mode !== "hiding" && pt.mode !== "friendly" &&
      ((pt.kind === "dog" && (pt.mode === "angry" || (this.p.dogOnEntry && pt.mode === "awake"))) || pt.kind === "housecat"));
  }

  insideTurn(c) {
    if (c.tempted) { this.doTemptation(c); c.acted = true; if (c.status !== "in") return; }
    // a cat starting its turn with an angry dog / guarding house cat must deal with it or leave (CORE-RULES "Residents")
    const pet = this.hostilePet(c.loc);
    if (pet && !(c.carrying && this.tr("haulLeaves"))) {
      const stay = this.phase() === "get" && (c.loc === this.prize.room || c.carrying) && this.confrontChance(c, pet) >= 0.4;
      if (stay && !c.acted) { this.confront(c, pet); if (c.status !== "in") return; }
      else if (!c.moved) { this.stepToward(c, this.goalRoom(c)) || this.fleeRandom(c); }
      if (this.hostilePet(c.loc) === pet) return; // still stuck with it
    }
    if (this.plan.distract.has(c.id) && !c.acted) { this.distract(c, this.plan.distract.get(c.id)); return; }
    // cover a squawking parrot in the prize's room (Streetwise, Tricky; CORE-RULES "Residents")
    const parrot = this.pets.find(pt => pt.kind === "parrot" && pt.mode !== "covered" && pt.room === c.loc);
    if (parrot && !c.acted && !c.carrying && !this.seenBy(c).length && c.loc === this.prize.room && c.r.streetwise >= 2 && this.phase() === "get") {
      const res = this.roll(c, { approach: "streetwise", diff: 1, tags: ["open"], important: true, why: "cover parrot" });
      c.acted = true;
      if (works(res.result)) { parrot.mode = "covered"; this.rec.event("parrotCovered"); }
      res.apply();
      return;
    }
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
      if (!this.worthTrying(c, way.opts, this.freeInside())) { this.rec.event("doorTooHard"); return false; }
      if (!this.openWay(c, way)) return false;
    }
    return this.moveTo(c, next);
  }
  moveTo(c, room) {
    if (c.moved) return false;
    const way = this.wayBetween(c.loc, room);
    if (!way || !way.open) return false;
    if (way.size === "tight" && c.body !== "lean") return false;
    c.cameFrom = c.loc; c.loc = room; c.moved = true; c.hidden = false;
    return true;
  }
  fleeRandom(c, back = null) {
    const opts = this.waysFrom(c.loc).filter(x => x.way.open && (x.way.size !== "tight" || c.body === "lean"));
    if (!opts.length) return false;
    const to = opts.find(x => x.to === back)?.to ?? this.rng.pick(opts).to;
    if (c.carrying) this.dropPrize(c, { here: true });
    c.cameFrom = c.loc; c.loc = to; c.moved = true; c.hidden = false;
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
  attOf(approach, seen) {
    const resists = approach === "sneaky" || (approach === "sweet" && this.p.attentionVs === "sneaky+sweet");
    return resists && seen.length ? Math.max(...seen.map(h => h.attention)) : 0;
  }
  /** P(works) for a cat's best option (policy input). */
  optChance(c, opts) {
    const o = this.bestOption(c, opts);
    const seen = this.seenBy(c);
    const att = this.attOf(o[0], seen);
    return chanceAtLeast(poolSize({ rating: c.r[o[0]], knack: hasKnack(c, o.slice(2), this.p), difficulty: o[1], attention: att }, this.p), "scrape");
  }
  /** Policy: don't try a long shot unless time is short or nobody better is coming. */
  worthTrying(c, opts, others = []) {
    const mine = this.optChance(c, opts);
    if (mine >= 0.45) return true;
    const desperate = this.goneAt - this.round <= 2 || this.lightsOut - this.round <= 2;
    if (desperate) return mine > 0.2;
    const better = others.some(o => o !== c && this.optChance(o, opts) > mine + 0.15);
    return !better && mine >= 0.3;
  }
  bestOption(c, opts) {
    let best = opts[0]; let bp = -1;
    for (const o of opts) {
      const seen = this.seenBy(c);
      const att = this.attOf(o[0], seen);
      const n = poolSize({ rating: c.r[o[0]], knack: hasKnack(c, o.slice(2), this.p), difficulty: o[1], attention: att }, this.p);
      const pr = chanceAtLeast(n, "scrape") + 0.3 * chanceAtLeast(n, "clean");
      if (pr > bp) { bp = pr; best = o; }
    }
    return best;
  }

  confrontOptions(pet) {
    const options = [["savage", pet.rating, "fight"], ["sneaky", pet.rating]];
    if (pet.soft) options.push(["sweet", pet.rating]);
    return options;
  }
  confrontChance(c, pet) {
    const o = this.bestOption(c, this.confrontOptions(pet));
    return chanceAtLeast(poolSize({ rating: c.r[o[0]], knack: hasKnack(c, o.slice(2), this.p), difficulty: o[1] }, this.p), "scrape");
  }
  confront(c, pet) {
    // choose Savage (drive off), Sweet (befriend a soft one), or Sneaky (slip past this turn)
    const best = this.bestOption(c, this.confrontOptions(pet));
    const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: `vs ${pet.kind}` });
    c.acted = true;
    if (works(res.result)) {
      if (best[0] === "savage") { pet.mode = "hiding"; pet.until = this.round + (this.p.carrierRules ? 2 : 3); this.rec.event("petDrivenOff"); }
      else if (best[0] === "sweet") { pet.mode = "friendly"; this.rec.event("petBefriended"); }
      else { pet.slippedBy = `${c.id}:${this.round}`; this.rec.event("petSlipped"); }
    } else {
      if (pet.kind === "dog" && !this.p.carrierRules) { pet.mode = "angry"; }
      if (!c.moved || this.p.carrierRules) this.fleeRandom(c, c.cameFrom);
      this.rec.event("chased");
    }
    res.apply();
  }

  distract(c, humanKey) {
    const R = this.plan.room ?? this.prize.room;
    if (c.loc !== R && !c.moved) this.moveTo(c, R);
    const w = this.humans.find(hu => hu.key === humanKey);
    if (c.loc !== w.room || !this.watchers(w.room).includes(w)) return;
    const diff = this.p.distractEscalation ? (w.distractions ?? 0) : 0;
    const res = this.roll(c, { approach: "sweet", diff, tags: ["charm"], seen: [w], important: true, why: "distract" });
    c.acted = true;
    if (works(res.result)) { w.distractedUntil = this.round + this.p.distractRounds; w.distractions = (w.distractions ?? 0) + 1; this.rec.event("distracted"); }
    res.apply();
  }
  lure(c) {
    // knocking something over on purpose: noise draws the closest human (CORE-RULES "A round": noise)
    c.acted = true; this.rec.event("lure");
    if (this.seenBy(c).length && !this.simpleInView(c, "lure", ["knock"])) return;
    this.noise.push(c.loc);
    (this.messes ??= new Set()).add(c.loc);
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
    const pet = this.hostilePet(R);
    if (pet && pet.slippedBy !== `${c.id}:${this.round}`) {
      // CORE-RULES v0.5: a cat that enters a room with a dog (or a guarding house cat) deals with it before anything else
      if (this.confrontChance(c, pet) >= 0.4) { this.confront(c, pet); }
      return;
    }
    const seen = this.seenBy(c).length > 0;
    if (seen && this.shouldWait(c)) { this.rec.event("waited"); return; }
    const z = this.prize;
    if (z.withHuman) { this.rec.event("waitedForPrize"); return; }
    if (!z.down) {
      // each step on the way to the prize needs one roll that works (counter, then foil…)
      const step = z.spotSteps[z.spotSteps.length - z.stepsLeft].map(o => z.kind === "delicious" ? [...o, "food"] : o);
      if (!this.worthTrying(c, step, this.catsIn(R).filter(x => !x.acted))) { this.rec.event("leftItToOthers"); return; }
      const best = this.bestOption(c, step);
      const res = this.roll(c, { approach: best[0], diff: best[1], tags: best.slice(2), important: true, why: "reach prize" });
      c.acted = true;
      if (works(res.result)) { z.stepsLeft--; z.down = z.stepsLeft === 0; this.markDisturbed(); }
      res.apply();
      return;
    }
    if (z.kind === "delicious" && this.wantsToCarryFood(c)) return this.tryPickUp(c);
    if (z.kind === "delicious") {
      c.acted = true;
      if (this.simpleInView(c, "eat", ["food"], this.tr("eat")) && z.portionsLeft > 0) { z.portionsLeft--; z.eaten++; this.markDisturbed(); this.rec.event("ate"); }
      return;
    }
    this.tryPickUp(c);
  }
  /** Policy (v0.7): carry food out instead of eating it when that's fewer rolls and there's a way out for it. */
  wantsToCarryFood(c) {
    const pol = this.p.foodPolicy ?? "eat";
    if (pol === "eat") return false;
    const z = this.prize;
    if (pol === "smart" && (z.portionsLeft <= 2 || this.watchers(z.room).length)) return false;
    const group = this.catsIn(this.prize.room).filter(x => !x.acted && !x.carrying && !x.tempted);
    if (!group.includes(c)) group.push(c);
    return this.canCarry(group) && !!this.bestExit(c, z.size);
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
    for (const x of need) { x.carrying = true; x.hidden = false; }
    this.markDisturbed();
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
      // moving the prize past a human is an Action: the leader rolls for the group (Sneaky or Savage)
      // v0.6 hauling: a Medium or Large prize always takes that roll (Large: Tricky), seen or not
      const ws = [...new Set([...this.watchers(c.loc), ...this.watchers(path[0])])];
      if (ws.length || this.mustHaul()) {
        if (ws.length && !ws.some(h => h.searching && this.cr("spotted")) && this.lightsOut - this.round > 3 && this.p.boldness !== "bold") { this.rec.event("carrierWaited"); return; }
        if (!this.haul(group, ws, path[0])) return;
      }
      for (const x of group) { x.loc = path[0]; x.moved = true; x.hidden = false; }
      z.room = path[0];
      if (c.status !== "in" || c.loc !== ex.room) return;
    }
    // go out through the entrance: the Move, or the Action when it needs no roll (CORE-RULES "In and out")
    const movedNow = group.some(x => x.moved);
    if (this.p.carrierRules && movedNow && (group.some(x => x.acted) || ex.opts.length || this.mustHaul() || this.seenBy(c).length)) return;
    if (!movedNow || ex.opts.length === 0) this.exitThrough(group, ex);
  }

  mustHaul() { return this.cr("haul") && this.prize.size !== "small"; }
  /** One piece of the v0.6 fix round (sim/params.mjs carrierRules; crOff switches pieces off for study). */
  cr(k) { return this.p.carrierRules && !(this.p.crOff ?? "").split(",").includes(k); }
  /** One piece of the v0.7 fix round (sim/params.mjs tableRules; trOff switches pieces off for study). */
  tr(k) { return this.p.tableRules && !(this.p.trOff ?? "").split(",").includes(k); }
  /** One piece of the v0.8 fix round (sim/params.mjs holdRules; hrOff switches pieces off for study). */
  hr(k) { return this.p.holdRules && !(this.p.hrOff ?? "").split(",").includes(k); }
  /** The carriers' roll to move the prize (v0.6 "Carrying"): every carrier's Action; the others help. */
  haul(group, ws, to = null) {
    const c = group[0];
    // v0.8: any other cat in the room may help a haul (+1 die, its Action); only carriers move with the prize
    const extra = this.hr("haulHelp") ? this.catsIn(c.loc).filter(x => !group.includes(x) && !x.acted && !x.tempted).slice(0, Math.max(0, 2 - (group.length - 1))) : [];
    const helpers = group.length - 1 + extra.length;
    for (const x of [...group, ...extra]) x.acted = true;
    const diff = this.hr("haulDiff") ? (this.prize.haulDiff ?? 0) : 0; // plain, unless the house says (the cake wobbles: Tricky)
    const old = !this.p.carrierRules && ws.length ? Math.max(...ws.map(h => h.attention)) : 0; // v0.5 double-counted Attention
    const opt = this.bestOption(c, [["sneaky", diff + old], ["savage", diff]]);
    const res = this.roll(c, { approach: opt[0], diff: opt[1], helpers, seen: ws, important: true, why: "haul",
      tags: this.tr("haulKnack") ? ["knock"] : [], noiseRoom: this.tr("haulNoise") ? to : null });
    res.apply();
    const ok = works(res.result) && c.status === "in";
    // v0.7: hauling out of an awake dog's room is leaving it; a haul that fails there is chased back and drops the prize
    if (!ok && this.tr("haulLeaves") && c.status === "in" && this.hostilePet(c.loc)) {
      const back = c.cameFrom;
      for (const x of group) if (x.status === "in") this.fleeRandom(x, back);
      this.rec.event("haulChased");
    }
    return ok;
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
      if (e.letOut && !carry && !c.carrying) {
        // meow at the front door and a human there lets you out (Sweet; CORE-RULES "Getting in")
        const path = this.path(c.loc, e.room, { lean: c.body === "lean" });
        if (path !== null && (this.watchers(e.room).length || this.humans.some(hu => hu.room === e.room))) {
          const pr = chanceAtLeast(poolSize({ rating: c.r.sweet, knack: hasKnack(c, ["charm"], this.p) }, this.p), "scrape");
          const score = pr - 0.35 * path.length - (this.room("cuddle") <= 1 ? 1 : 0.2);
          if (score > bs) { bs = score; best = { ...e, viaLetOut: true }; }
        }
      }
      if (!e.open && !(this.p.reopenEntrance && !e.rounds)) continue;
      if (e.rounds && !e.rounds.includes(this.round)) continue;
      if (e.size === "tight" && c.body !== "lean") continue;
      if (carry && (PRIZE_RANK[carry] > WAY_RANK[e.size] || (e.climb && carry !== "small"))) continue;
      const path = this.path(c.loc, e.room, { lean: c.body === "lean", carry });
      if (path === null) continue;
      const opts = e.open ? e.opts : [["streetwise", 2, "open"]]; // reopening a shut entrance from inside
      const pr = opts.length ? chanceAtLeast(poolSize({ rating: c.r[this.bestOption(c, opts)[0]], difficulty: this.bestOption(c, opts)[1] }, this.p), "scrape") : 1;
      const score = pr - 0.35 * path.length - (e.open ? 0 : 0.3);
      if (score > bs) { bs = score; best = e.open ? e : { ...e, opts, reopen: e }; }
    }
    return best;
  }

  exitThrough(group, e) {
    const lead = group[0];
    if (e.viaLetOut) {
      const ws = this.watchers(e.room);
      if (!ws.length) return false;
      const res = this.roll(lead, { approach: "sweet", tags: ["charm"], seen: ws, important: true, why: "let me out" });
      lead.acted = true;
      res.apply();
      if (!works(res.result) || lead.status !== "in") return false;
      lead.status = "out"; lead.loc = "outside"; lead.hidden = false; this.rec.event("letOut");
      return true;
    }
    if (e.opts.length) {
      const best = this.bestOption(lead, e.opts);
      const res = this.roll(lead, { approach: best[0], diff: best[1], tags: best.slice(2), helpers: group.length - 1, important: true, why: "exit" });
      for (const x of group) x.acted = true;
      res.apply();
      if (!works(res.result) || lead.status !== "in") return false;
    } else if (lead.carrying && (this.seenBy(lead).length || this.mustHaul())) {
      if (this.p.carrierRules) { if (!this.haul(group, this.seenBy(lead))) return false; }
      else { for (const x of group) x.acted = true; if (!this.simpleInView(lead, "out with the prize")) return false; }
    }
    if (e.reopen) { e.reopen.open = true; this.rec.event("reopened"); }
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
      const pr = opt ? chanceAtLeast(poolSize({ rating: c.r[opt[0]], knack: hasKnack(c, opt.slice(2), this.p), difficulty: opt[1] }, this.p), "scrape") : 1;
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
      if (best.one) best.open = false; // the human shuts the front door behind them: one cat at most
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
    const mates = !this.tr("holderSees") && this.catsIn(holder.room).length > 0 && this.phase() === "get";
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
    const before = new Map(this.humans.map(hu => [hu.key, hu.room]));
    // pets
    for (const pt of this.pets) this.petActs(pt);
    // noise: each noise room draws the closest awake human within range
    const answered = new Set();
    const rooms = [...new Set(this.noise)];
    for (const room of rooms) {
      // the closest awake human within range who isn't already in that room; the Storyteller breaks ties
      const guarding = hu => this.p.searchHold && hu.searching && this.phase() === "get" && !this.prize.withHuman && this.prize.room === hu.room;
      const cands = this.humans.filter(hu => !hu.holding && hu.asleepUntil < this.round && hu.kind !== "teen" && !hu.busy && !answered.has(hu.key) && hu.room !== room && !guarding(hu)
        && !(this.hr("clockHold") && hu.staysUntil === this.round))
        .map(hu => ({ hu, d: this.dist(hu.room, room), t: this.rng.next() })).filter(x => x.d <= this.p.noiseRange).sort((a, b) => a.d - b.d || a.t - b.t);
      const takers = this.p.noiseAnswer === "all" ? cands : cands.slice(0, 1);
      for (const { hu } of takers) {
        if (hu.room !== room) this.rec.event("answeredNoise");
        hu.room = room; answered.add(hu.key);
        if (this.p.lureMess && !this.p.carrierRules && this.messes?.has(room)) { this.messes.delete(room); this.moodChange({ side: "broom", steps: 1 }, null, "mess found"); }
      }
    }
    if (!this.p.carrierRules) this.messes?.clear();
    // routines
    for (const hu of this.humans) {
      if (hu.holding) { this.holderActs(hu); continue; }
      if (answered.has(hu.key)) continue;
      if (hu.staysUntil === this.round) continue;
      if (hu.searching && hu.asleepUntil < this.round) {
        // Searching: stay with a cat in sight, else step into a next room with a cat in sight (carriers first), else the routine
        const visible = room => this.cats.filter(c => c.status === "in" && c.loc === room && !c.hidden);
        if (this.cr("search") && this.phase() === "get" && !this.prize.withHuman) {
          // v0.6: they go for the prize first: stay with it, or step into its room next door
          const z = this.prize;
          if (z.room === hu.room) { this.rec.event("searchStayed"); continue; }
          if (this.waysFrom(hu.room).some(x => x.to === z.room)) { hu.room = z.room; this.rec.event("searchFound"); continue; }
        }
        if (visible(hu.room).length) { this.rec.event("searchStayed"); continue; }
        const next = this.waysFrom(hu.room).map(x => x.to).filter(r => visible(r).length);
        if (next.length) {
          const carrierRoom = next.find(r => visible(r).some(c => c.carrying));
          hu.room = carrierRoom ?? next[Math.floor(this.rng.next() * next.length)];
          this.rec.event("searchFound");
          continue;
        }
      }
      if (hu.asleepUntil >= this.round) continue; // dozing: sees nothing, hears nothing, stays put
      const res = hu.routine[this.rng.d6() - 1];
      if (res !== "stay") hu.room = res;
      if (hu.kind === "grandparent" && this.rng.d6() <= 2) hu.asleepUntil = this.round + 1;
    }
    // v0.6 finding: at the end of the House phase, a human not yet Searching in the prize's room
    // (where it is, or where the Clock put it) finds it disturbed: +1 Broom each, and starts Searching
    if (this.p.carrierRules) {
      const z = this.prize;
      // a Searching human who can see a cat now: +1 Broom (once a round; checked before anyone new starts Searching)
      const inSight = hu => this.cats.find(c => c.status === "in" && c.loc === hu.room && !c.hidden);
      const spotter = this.cr("spotted") && this.humans.find(hu => hu.searching && !hu.holding && hu.asleepUntil < this.round && inSight(hu));
      if (spotter) { this.rec.event("spotted"); this.moodChange({ side: "broom", steps: 1 }, inSight(spotter), "spotted"); }
      if (this.p.discovery && !z.withHuman && this.phase() === "get" && z.disturbed && this.cr("find")) {
        // +1 Broom once, however many find it; each of them starts Searching
        const finders = this.humans.filter(hu => !hu.searching && !hu.holding && hu.asleepUntil < this.round && (hu.room === z.room || hu.room === z.spotRoom));
        for (const hu of finders) if (this.p.searching) hu.searching = true;
        const seenCat = finders.map(hu => this.cats.find(c => c.status === "in" && c.loc === hu.room && !c.hidden)).find(Boolean) ?? null;
        if (finders.length) { this.rec.event("discovered"); this.moodChange({ side: "broom", steps: 1 }, seenCat, "found it"); }
      }
      if (!this.cr("mess")) this.messes?.clear();
      if (this.p.lureMess) for (const room of [...(this.messes ?? [])]) {
        if (this.humans.some(hu => hu.room === room && !hu.holding && hu.asleepUntil < this.round)) {
          this.messes.delete(room); this.moodChange({ side: "broom", steps: 1 }, null, "mess found");
        }
      }
    }
    // discovery: a human who has just walked in on a disturbed prize (CORE-RULES "The prize")
    else if (this.p.discovery && !this.prize.withHuman && this.phase() === "get") {
      const z = this.prize;
      const disturbed = z.down && (z.spotSteps.length > 0 || z.eaten > 0) || z.carriers.length > 0 || z.eaten > 0;
      for (const hu of this.humans) {
        if (hu.room === z.spotRoom && before.get(hu.key) !== hu.room && disturbed && !hu.holding) {
          this.rec.event("discovered");
          if (this.p.searching) hu.searching = true;
          this.moodChange({ side: "broom", steps: 1 }, null, "discovered");
        }
      }
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
    if (pt.routine) {
      // six results like a human's: "stay", a room, or "sniff" (one room toward the nearest cat)
      const r = pt.routine[f - 1];
      if (r === "sniff") {
        let bd = Infinity, to = null;
        for (const o of this.waysFrom(pt.room).filter(x => x.way.open).map(x => x.to)) for (const c of this.freeInside()) { const d = this.dist(o, c.loc); if (d < bd) { bd = d; to = o; } }
        if (to) pt.room = to;
      } else if (r !== "stay") pt.room = r;
    } else if (f >= 3) {
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
