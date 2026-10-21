/**
 * Parity: the table's rules (module/logic/) and the simulator's (sim/) must
 * agree on the package the system follows (the simulator's ADOPTED P14: core rules v0.9 with the
 * getaway, shiny loot, Cred and the playtest fix round), and the house catalog must be an exact copy
 * of sim/houses.mjs (AUTOMATION.md §9).
 * module/ never imports from sim/; this test is the only bridge.
 */
import test from "node:test";
import assert from "node:assert/strict";
import * as table from "../module/logic/rules.mjs";
import * as sim from "../sim/rules.mjs";
import { makeParams, ADOPTED, PACKAGES } from "../sim/params.mjs";
import { KNACK, hasKnack as simHasKnack } from "../sim/character.mjs";
import { HOUSES as SIM_HOUSES } from "../sim/houses.mjs";
import { HOUSES } from "../module/logic/house-catalog.mjs";
import { CATB } from "../module/config.mjs";
import { foldMood, upsertEntry } from "../module/logic/mood.mjs";
import { gangScaling } from "../module/logic/prize.mjs";

const p = makeParams(PACKAGES.P14); // the getaway, shiny loot, Cred and the playtest fix round

test("the system follows the simulator's adopted package P14 (core rules v0.9 with the getaway, shiny loot, Cred and the playtest fixes)", () => {
  assert.equal(ADOPTED, "P14");
  assert.equal(p.cred, true, "Ch 9 Cred: tags, the catnip stash, the rivals (test/cred.test.mjs)");
  assert.equal(p.tagMess, true, "an unseen tag is a mess");
  assert.equal(p.seenTagNoMess, true, "P14: a tag made in view isn't a mess");
  assert.equal(p.zoomiesTagRoll, true, "P14: with the zoomies every tag is a roll");
  assert.equal(p.nipDie, CATB.rules.cred.nipDie, "the zoomies: +1 die");
  assert.equal(p.wardenLag, CATB.rules.wardenLag, "P14: the warden pulls up at the end of round 2 (3 if nobody was caught)");
  assert.equal(p.wardenNoPass, true, "P14: the warden never passes a cat");
  assert.equal(p.dodgeStun, true, "P14: a dodge that works leaves the cat put and the warden sprawling");
  assert.equal(p.mouthFull, true, "P14: no Sweet with loot");
  assert.equal(p.eatCap, 0, "no limit on the portions one cat eats");
  assert.equal(p.getaway, true, "v0.10 (Ch 9): the getaway");
  assert.equal(p.shinyTempts, true, "shiny things tempt Curious and Knocker cats in every room");
  assert.deepEqual([p.wardenLag, p.wardenFlop, p.dodgeDiff], [2, true, 0], "the warden: two rounds on the way (three if nobody was caught), 2 spaces after a Flop; dodges are plain");
  assert.equal(p.carrierRules, true, "v0.6: hauling, finding it, Searching for the prize");
  assert.equal(p.tableRules, true, "v0.7: holders see, eating is a roll, temptation rotates");
  assert.equal(p.holdRules, true, "v0.8: the Clock's hold beats noise, any cat helps a haul, a house may make hauling Tricky (test/v08.test.mjs)");
  // v0.9 (test/v09.test.mjs)
  assert.equal(p.cattitudeDie, false, "v0.9: Cattitude no longer buys a die");
  assert.equal(p.shooKeepLast, true, "v0.9: Shoo! uses the nearest entrance the cat fits through, opened if shut; the last open one stays open");
  assert.equal(p.meterCap, true, "v0.9: the other meter drops to one below the new Patience");
  assert.equal(p.giveInNoFill, true, "v0.9: a give-in never fills a meter");
  assert.equal(p.knockerOneBroom, true, "v0.9: a Knocker give-in seen: +1 Broom and no mess");
  assert.equal(p.hunterNoFight, true, "v0.9: Hunter's Knack is pounce and chase only");
  assert.equal(p.lapCountsDistract, true, "v0.9: a Lap Cat's fuss counts as a distraction");
  assert.equal(p.heldBroomDen, false, "a held cat whose own roll fills Broom is still put outside");
  assert.equal(p.searchHold, false, "declined: a Searching human beside the prize still answers noise");
  assert.equal(p.resetTo, "calm", "a trigger empties its meter");
  for (const [k, v] of Object.entries(PACKAGES.P14)) assert.deepEqual(p[k], v, k);
});

test("the rules numbers in config match the simulator's adopted parameters", () => {
  const R = CATB.rules;
  assert.equal(R.diceCap, p.diceCap);
  assert.equal(R.helpCap, p.helpCap);
  assert.equal(p.capOrder, "first", "the table caps first, then removes dice");
  assert.equal(R.flopSteps, p.flopSteps);
  assert.equal(R.sneakyCleanFree, p.sneakyCleanFree);
  assert.equal(R.minPatience, p.minPatience);
  assert.equal(R.patienceDrop, p.patienceDrop);
  assert.equal(R.noiseRange, p.noiseRange);
  assert.deepEqual(R.holdTable, p.holdTable);
  assert.equal(R.wriggleDifficulty, p.wriggleDiff);
  assert.equal(R.lightsOut, p.lightsOut);
  assert.equal(R.cattitudeStart, p.cattitudeStart);
  assert.equal(R.cattitudeMax, p.cattitudeMax);
  assert.equal(p.attentionVs, "sneaky+sweet");
  assert.equal(p.flopDirection, "nearer");
  assert.equal(p.distractEscalation, true);
  assert.equal(p.gangScaling, true);
  assert.deepEqual(R.gangScaling[3], { patience: p.scale3[0], clock: p.scale3[1], cattitude: p.scale3Cat }, "3 cats");
  assert.deepEqual(R.gangScaling[5], { patience: p.scale5[0], clock: p.scale5[1], cattitude: 0 }, "5 cats");
  assert.deepEqual(R.gangScaling[4], { patience: 0, clock: 0, cattitude: 0 });
});

test("the Knack table matches the simulator's (v0.9: its Hunter entry filtered by hunterNoFight)", () => {
  const filtered = (k, tags) => tags.filter(t => !(p.hunterNoFight && k === "hunter" && t === "fight"));
  for (const [k, tags] of Object.entries(KNACK)) assert.deepEqual(CATB.instincts[k].knack, filtered(k, tags), k);
  assert.deepEqual(CATB.instincts.hunter.knack, ["chase"]);
  assert.deepEqual(Object.keys(KNACK).sort(), [...CATB.instinctKeys].sort());
  assert.deepEqual([...table.INSTINCTS].sort(), [...sim.INSTINCTS].sort());
  assert.deepEqual(table.APPROACHES, sim.APPROACHES);
  // and the two hasKnack agree for every pair of instincts and every tag
  const tags = [...new Set(Object.values(KNACK).flat())];
  for (const a of CATB.instinctKeys) for (const b of CATB.instinctKeys) for (const t of tags) {
    if (a === b) continue;
    assert.equal(table.hasKnack([a, b], [t]), simHasKnack({ instincts: [a, b] }, [t], p), `${a}+${b} ${t}`);
  }
});

test("dice reading agrees on every roll of 1–5 dice and on the zero pool", () => {
  const all = (n, prefix = []) => (n === 0 ? [prefix] : [1, 2, 3, 4, 5, 6].flatMap(f => all(n - 1, [...prefix, f])));
  let count = 0;
  for (let n = 1; n <= 5; n++) {
    for (const faces of all(n)) {
      assert.equal(table.readDice(faces, false), sim.readDice(faces, false), faces.join());
      count++;
    }
  }
  for (const faces of all(2)) assert.equal(table.readDice(faces, true), sim.readDice(faces, true), `zero ${faces}`);
  assert.equal(count, 6 + 36 + 216 + 1296 + 7776);
});

test("pool size agrees over the whole input grid (v0.9: no Cattitude die on either side; the zoomies' die is the simulator's nipDie on the rating)", () => {
  for (let rating = 1; rating <= 4; rating++)
    for (const knack of [false, true])
      for (let helpers = 0; helpers <= 4; helpers++)
        for (let difficulty = 0; difficulty <= 2; difficulty++)
          for (let opposition = 0; opposition <= 3; opposition++)
            for (let attention = 0; attention <= 2; attention++) {
              const args = { rating, knack, helpers, difficulty, opposition, attention };
              assert.equal(table.poolSize(args), sim.poolSize(args, p), JSON.stringify(args));
              assert.equal(table.poolSize({ ...args, cattitudeDie: true }), table.poolSize(args), "a Cattitude die is ignored");
              assert.equal(table.poolSize({ ...args, nip: true }), sim.poolSize({ ...args, rating: rating + p.nipDie }, p), `the zoomies ${JSON.stringify(args)}`);
              assert.equal(table.buildRollPlan({ approach: "sneaky", ...args, nip: true }).total, sim.poolSize({ ...args, rating: rating + p.nipDie }, p));
              const plan = table.buildRollPlan({ approach: "sneaky", ...args });
              assert.equal(plan.total, sim.poolSize(args, p));
              assert.equal(plan.dice, plan.total <= 0 ? 2 : plan.total);
            }
});

test("Mood steps agree for every result, approach, seen, kid, Push-with-Mood and meter state", () => {
  const moods = [{ broom: 0, cuddle: 0 }, { broom: 2, cuddle: 1 }, { broom: 1, cuddle: 3 }, { broom: 2, cuddle: 2 }];
  let n = 0;
  for (const result of ["flop", "scrape", "clean", "purrfect"])
    for (const approach of table.APPROACHES)
      for (const seen of [false, true])
        for (const kidDoubles of [false, true])
          for (const pushedWithMood of [false, true])
            for (const mood of moods) {
              const args = { result, approach, seen, mood, kidDoubles, pushedWithMood };
              assert.deepEqual(table.moodDelta(args), sim.moodDelta(args, p), JSON.stringify(args));
              n++;
            }
  assert.equal(n, 4 * 4 * 2 * 2 * 2 * 4);
});

test("holder's d6, noise and chances agree", () => {
  for (let f = 1; f <= 6; f++) assert.equal(table.holderOutcome(f), sim.holderRoll(f, p));
  for (const r of ["flop", "scrape", "clean", "purrfect"]) {
    assert.equal(table.makesNoise(r), sim.makesNoise(r));
    assert.equal(table.works(r), sim.works(r));
    for (let n = 0; n <= 5; n++) assert.ok(Math.abs(table.chanceAtLeast(n, r) - sim.chanceAtLeast(n, r)) < 1e-12, `${n} ${r}`);
  }
});

test("v0.9: after a trigger the meters agree with the simulator's afterTrigger (meterCap)", () => {
  for (let patience = 3; patience <= 8; patience++)
    for (let broom = 0; broom <= patience; broom++)
      for (let cuddle = 0; cuddle <= patience; cuddle++)
        for (const side of ["broom", "cuddle"]) {
          if ((side === "broom" ? broom : cuddle) < patience) continue; // a trigger comes from a full meter
          let l = [{ kind: "set", broom, cuddle }].reduce((x, e) => upsertEntry(x, e).ledger, []);
          l = upsertEntry(l, { kind: "trigger", side, target: "x" }).ledger;
          const f = foldMood(l, patience);
          const s = sim.afterTrigger({ broom, cuddle }, patience, side, p);
          assert.deepEqual([f.broom, f.cuddle, f.patience], [s.mood.broom, s.mood.cuddle, s.patience], `${patience} ${broom}/${cuddle} ${side}`);
        }
});

test("v0.9: gang-size scaling uses each house's own numbers like the simulator (house.scale3 ?? p.scale3)", () => {
  for (const h of SIM_HOUSES) {
    for (const [n, sc] of [[3, h.scale3 ?? p.scale3], [4, [0, 0]], [5, h.scale5 ?? p.scale5]]) {
      const t = gangScaling(n, h);
      assert.deepEqual([t.patience, t.clock], sc, `${h.key} ×${n}`);
    }
  }
  assert.deepEqual(houseNumbers("wendell-mouse"), [9, undefined, undefined], "v0.10: Patience 9, the general rule");
  assert.deepEqual(houseNumbers("okafor-box"), [8, undefined, undefined], "v0.10: Patience 8");
  assert.deepEqual(houseNumbers("birthday-cake"), [6, [1, 1], [-1, 1]]);
  assert.deepEqual(houseNumbers("marchetti-salmon"), [7, [1, 3], undefined]);
});
const houseNumbers = key => { const h = HOUSES.find(x => x.key === key); return [h.patience, h.scale3, h.scale5]; };

test("the house catalog is an exact copy of the simulator's houses", () => {
  assert.deepEqual(HOUSES, SIM_HOUSES);
  assert.equal(HOUSES.length, 5);
});
