/**
 * Parity: the table's rules (module/logic/) and the simulator's (sim/) must
 * agree under the adopted package (sim/params.mjs ADOPTED, P7), and the house
 * catalog must be an exact copy of sim/houses.mjs (AUTOMATION.md §9).
 * module/ never imports from sim/; this test is the only bridge.
 */
import test from "node:test";
import assert from "node:assert/strict";
import * as table from "../module/logic/rules.mjs";
import * as sim from "../sim/rules.mjs";
import { makeParams, ADOPTED, PACKAGES } from "../sim/params.mjs";
import { KNACK } from "../sim/character.mjs";
import { HOUSES as SIM_HOUSES } from "../sim/houses.mjs";
import { HOUSES } from "../module/logic/house-catalog.mjs";
import { CATB } from "../module/config.mjs";

const p = makeParams();

test("the simulator's defaults are the adopted package (so parity means P7)", () => {
  assert.equal(ADOPTED, "P7");
  for (const [k, v] of Object.entries(PACKAGES[ADOPTED])) assert.deepEqual(p[k], v, k);
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
});

test("the Knack table matches the simulator's", () => {
  for (const [k, tags] of Object.entries(KNACK)) assert.deepEqual(CATB.instincts[k].knack, tags, k);
  assert.deepEqual(Object.keys(KNACK).sort(), [...CATB.instinctKeys].sort());
  assert.deepEqual([...table.INSTINCTS].sort(), [...sim.INSTINCTS].sort());
  assert.deepEqual(table.APPROACHES, sim.APPROACHES);
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

test("pool size agrees over the whole input grid (without the Cattitude die the simulator adds to the rating)", () => {
  for (let rating = 1; rating <= 4; rating++)
    for (const knack of [false, true])
      for (let helpers = 0; helpers <= 4; helpers++)
        for (let difficulty = 0; difficulty <= 2; difficulty++)
          for (let opposition = 0; opposition <= 3; opposition++)
            for (let attention = 0; attention <= 2; attention++) {
              const args = { rating, knack, helpers, difficulty, opposition, attention };
              assert.equal(table.poolSize(args), sim.poolSize(args, p), JSON.stringify(args));
              // the simulator spends a Cattitude die as +1 on the rating
              assert.equal(table.poolSize({ ...args, cattitudeDie: true }), sim.poolSize({ ...args, rating: rating + 1 }, p), `cdie ${JSON.stringify(args)}`);
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

test("the house catalog is an exact copy of the simulator's houses", () => {
  assert.deepEqual(HOUSES, SIM_HOUSES);
  assert.equal(HOUSES.length, 5);
});
