/**
 * Simulator tests (sim/README.md §10): dice reading, Mood rules, character
 * legality, determinism, and a whole robbery that finishes legally.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readDice, poolSize, moodDelta, applyMood, afterTrigger, chanceAtLeast, holderRoll } from "../sim/rules.mjs";
import { makeParams, PACKAGES, ADOPTED } from "../sim/params.mjs";
import { makeGang, validateCat, makeCat } from "../sim/character.mjs";
import { makeRng, Rng } from "../sim/rng.mjs";
import { HOUSES } from "../sim/houses.mjs";
import { playRobbery } from "../sim/engine.mjs";
import { runHouse } from "../sim/run.mjs";

const p = makeParams();

test("dice are read by the highest die; two 6s are Purrfect; zero dice keep the lower of two", () => {
  assert.equal(readDice([1, 2, 3], false), "flop");
  assert.equal(readDice([2, 5], false), "scrape");
  assert.equal(readDice([6, 1], false), "clean");
  assert.equal(readDice([6, 6, 2], false), "purrfect");
  assert.equal(readDice([6, 3], true), "flop", "zero pool: the lower die decides");
  assert.equal(readDice([6, 6], true), "scrape", "zero pool: never better than a Scrape");
});

test("pool: cap first, then Difficulty removes dice", () => {
  assert.equal(poolSize({ rating: 3, knack: true, helpers: 2, difficulty: 0 }, p), 5);
  assert.equal(poolSize({ rating: 3, knack: true, helpers: 2, difficulty: 2 }, p), 3);
  assert.equal(poolSize({ rating: 1, difficulty: 2 }, p), -1);
  assert.equal(poolSize({ rating: 3, helpers: 5 }, p), 5, "help is capped at +2");
});

test("Mood: seen steps by result and lean; unseen rolls never move it; flops go to the fuller meter", () => {
  const m = { broom: 0, cuddle: 0 };
  assert.deepEqual(moodDelta({ result: "clean", approach: "savage", seen: true, mood: m }, p), { side: "broom", steps: 1 });
  assert.deepEqual(moodDelta({ result: "clean", approach: "sneaky", seen: true, mood: m }, p), { side: "broom", steps: 0 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "sweet", seen: true, mood: m }, p), { side: "cuddle", steps: 1 });
  assert.deepEqual(moodDelta({ result: "purrfect", approach: "savage", seen: true, mood: m }, p), { side: "broom", steps: 0 });
  assert.equal(moodDelta({ result: "flop", approach: "savage", seen: false, mood: m }, p).steps, 0);
  assert.deepEqual(moodDelta({ result: "flop", approach: "savage", seen: true, mood: { broom: 0, cuddle: 2 } }, p), { side: "cuddle", steps: 2 },
    "a flop makes their mood worse: the fuller meter");
  assert.deepEqual(moodDelta({ result: "flop", approach: "sweet", seen: true, mood: m }, p), { side: "cuddle", steps: 2 }, "level meters: the lean");
  assert.deepEqual(moodDelta({ result: "clean", approach: "sweet", seen: true, mood: m, kidDoubles: true }, p), { side: "cuddle", steps: 2 });
  assert.deepEqual(moodDelta({ result: "clean", approach: "savage", seen: false, mood: m, pushedWithMood: true }, p), { side: "broom", steps: 1 });
});

test("Mood: a meter that reaches Patience triggers; afterwards it empties and Patience drops (min 2)", () => {
  assert.equal(applyMood({ broom: 2, cuddle: 0 }, 3, { side: "broom", steps: 1 }).trigger, "shoo");
  assert.equal(applyMood({ broom: 0, cuddle: 3 }, 4, { side: "cuddle", steps: 1 }).trigger, "scoop");
  assert.equal(applyMood({ broom: 1, cuddle: 0 }, 4, { side: "broom", steps: 1 }).trigger, null);
  const a = afterTrigger({ broom: 3, cuddle: 1 }, 3, "broom", p);
  assert.deepEqual(a, { mood: { broom: 0, cuddle: 1 }, patience: 2 });
  assert.equal(afterTrigger({ broom: 2, cuddle: 0 }, 2, "broom", p).patience, 2);
});

test("holder's d6 and exact chances", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(f => holderRoll(f, p)), ["keep", "keep", "keep", "den", "den", "outside"]);
  assert.ok(Math.abs(chanceAtLeast(2, "scrape") - 0.75) < 1e-9);
  assert.ok(Math.abs(chanceAtLeast(1, "clean") - 1 / 6) < 1e-9);
  assert.ok(Math.abs(chanceAtLeast(2, "purrfect") - 1 / 36) < 1e-9);
  assert.ok(Math.abs(chanceAtLeast(0, "scrape") - 0.25) < 1e-9);
});

test("random cats are always legal", () => {
  const rng = new Rng(5);
  for (let i = 0; i < 500; i++) assert.deepEqual(validateCat(makeCat(rng, `c${i}`, p)), []);
  assert.ok(validateCat({ r: { sneaky: 3, sweet: 3, savage: 1, streetwise: 0 }, instincts: ["foodie", "foodie"], body: "huge" }).length >= 3);
});

test("a robbery is deterministic for a seed and always ends legally", () => {
  for (const h of HOUSES) {
    for (let i = 0; i < 40; i++) {
      const g1 = makeGang(makeRng(1, "gang", 4, i), 4, p);
      const g2 = makeGang(makeRng(1, "gang", 4, i), 4, p);
      const a = playRobbery(h, g1, p, makeRng(1, "dice", h.key, i));
      const b = playRobbery(h, g2, p, makeRng(1, "dice", h.key, i));
      assert.equal(a.outcome, b.outcome); assert.equal(a.rounds, b.rounds);
      assert.ok(["clean", "messy", "busted"].includes(a.outcome));
      assert.ok(a.rounds <= h.prize.goneAt + 1 + p.lightsOut, `${h.key} ended by Lights Out`);
      if (a.outcome === "clean") assert.equal(a.leftBehind, 0);
    }
  }
});

test("the adopted package is the defaults, and every package names every lever", () => {
  const d = makeParams();
  for (const [k, v] of Object.entries(PACKAGES[ADOPTED])) assert.deepEqual(d[k], v, `default ${k} = ${ADOPTED}`);
  const keys = Object.keys(PACKAGES.P1).sort();
  for (const pk of Object.values(PACKAGES)) assert.deepEqual(Object.keys(pk).sort(), keys);
});

test("labels roughly match play (gang of 4, quick run)", () => {
  const win = key => runHouse(HOUSES.find(h => h.key === key), p, 300, 7).win;
  assert.ok(win("number-12") > win("birthday-cake"), "Easy beats Hard");
  assert.ok(win("number-12") > 80);
  assert.ok(win("marchetti-salmon") < 80);
});
