/**
 * Counts what happens in each robbery and fires issue detectors
 * (sim/README.md §6): gap = the rules don't say; broken = degenerate result;
 * info = worth knowing.
 */

export class Recorder {
  constructor() {
    this.robberies = 0;
    this.outcomes = { clean: 0, messy: 0, busted: 0 };
    this.reasons = {};
    this.events = {};
    this.results = { flop: 0, scrape: 0, clean: 0, purrfect: 0 };
    this.rollsBy = {};
    this.rolls = 0;
    this.seenRolls = 0;
    this.knackRolls = 0;
    this.poolHist = {};
    this.moodSteps = { broom: 0, cuddle: 0 };
    this.moodWhy = {};
    this.instincts = {};
    this.entrances = {};
    this.rounds = 0;
    this.leftBehindRobberies = 0;
    this.caughtRobberies = 0;
    this.cattitude = { had: 0, spent: 0, cats: 0, halfSpenders: 0 };
    this.issues = new Map();
    this.cur = null;
  }
  start() { this.cur = { events: {}, rolls: 0 }; }
  event(k) {
    this.events[k] = (this.events[k] ?? 0) + 1;
    if (this.cur) this.cur.events[k] = (this.cur.events[k] ?? 0) + 1;
  }
  mood({ side, steps }, why) {
    this.moodSteps[side] += steps;
    const k = `${side}:${String(why).replace(/:.*/, "").replace(/ \(.*/, "")}`;
    this.moodWhy[k] = (this.moodWhy[k] ?? 0) + steps;
  }
  roll(result, { approach, n, seen, knack, why }) {
    this.rolls++; this.results[result]++;
    if (this.cur) this.cur.rolls++;
    this.rollsBy[approach] = (this.rollsBy[approach] ?? 0) + 1;
    if (seen) this.seenRolls++;
    if (knack) this.knackRolls++;
    const b = n <= 0 ? "0" : String(n);
    this.poolHist[b] = (this.poolHist[b] ?? 0) + 1;
    const w = String(why).replace(/:.*/, "").replace(/ \(.*/, "");
    this.rollsBy[`why:${w}`] = (this.rollsBy[`why:${w}`] ?? 0) + 1;
  }
  instinct(i, k) { this.instincts[`${i}:${k}`] = (this.instincts[`${i}:${k}`] ?? 0) + 1; }
  entrance(k) { this.entrances[k] = (this.entrances[k] ?? 0) + 1; }
  issue(kind, title, ref) {
    const key = `${kind}|${title}`;
    const v = this.issues.get(key) ?? { kind, title, ref, count: 0 };
    v.count++; this.issues.set(key, v);
  }
  finish(out) {
    this.robberies++;
    this.outcomes[out.outcome]++;
    this.reasons[out.reason] = (this.reasons[out.reason] ?? 0) + 1;
    this.rounds += out.rounds;
    if (out.leftBehind) this.leftBehindRobberies++;
    const ev = this.cur?.events ?? {};
    if ((ev.held ?? 0) + (ev.shooed ?? 0) + (ev.lifeSpent ?? 0) > 0) this.caughtRobberies++;
    for (const c of out.cats) {
      this.cattitude.cats++; this.cattitude.had += c.cattitudeHad; this.cattitude.spent += c.cattitudeSpent;
      if (c.cattitudeSpent * 2 >= c.cattitudeHad) this.cattitude.halfSpenders++;
    }
    if (out.reason === "lightsOut" && out.leftBehind && out.cats.some(c => c.status === "in"))
      this.issue("info", "free cats still inside at Lights Out", "CORE-RULES Ending");
    if ((this.cur?.rolls ?? 0) === 0) this.issue("broken", "a robbery with no rolls at all", "CORE-RULES Rolling");
    this.cur = null;
  }

  summary() {
    const n = this.robberies || 1;
    const R = this.rolls || 1;
    const pct = x => (100 * x) / n;
    return {
      robberies: this.robberies,
      win: pct(this.outcomes.clean + this.outcomes.messy),
      clean: pct(this.outcomes.clean), messy: pct(this.outcomes.messy), busted: pct(this.outcomes.busted),
      cleanShareOfWins: (100 * this.outcomes.clean) / Math.max(1, this.outcomes.clean + this.outcomes.messy),
      caught: pct(this.caughtRobberies), leftBehind: pct(this.leftBehindRobberies),
      flop: (100 * this.results.flop) / R, scrape: (100 * this.results.scrape) / R,
      cleanRoll: (100 * this.results.clean) / R, purrfect: (100 * this.results.purrfect) / R,
      rollsPer: this.rolls / n, roundsPer: this.rounds / n, seenShare: (100 * this.seenRolls) / R,
      knackShare: (100 * this.knackRolls) / R,
      gaveIn: (100 * (this.events.gaveIn ?? 0)) / Math.max(1, this.events.tempted ?? 0),
      temptedPer: (this.events.tempted ?? 0) / n,
      halfSpenders: (100 * this.cattitude.halfSpenders) / Math.max(1, this.cattitude.cats),
      spentPerCat: this.cattitude.spent / Math.max(1, this.cattitude.cats),
      shooPer: (this.events.shoo ?? 0) / n, scoopPer: (this.events.scoop ?? 0) / n,
      livesPer: (this.events.lifeSpent ?? 0) / n,
      broomPer: this.moodSteps.broom / n, cuddlePer: this.moodSteps.cuddle / n,
      pushPer: ((this.events.pushCattitude ?? 0) + (this.events.pushMood ?? 0)) / n,
      reasons: this.reasons, events: this.events, rollsBy: this.rollsBy, poolHist: this.poolHist,
      moodWhy: this.moodWhy, entrances: this.entrances, instincts: this.instincts,
    };
  }
}
