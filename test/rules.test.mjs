/**
 * module/logic/rules.mjs — the roll plan, dice reading, Push and Mood steps (Ch 4, Ch 5).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRollPlan, poolSize, readDice, readIndex, pushIndices, applyPush, canPush, moodDelta, holderOutcome,
  hasKnack, knackInstincts, attentionApplies, fillsMeter, clampCattitude, validateApproaches, validateInstincts, chanceAtLeast
} from "../module/logic/rules.mjs";

test("roll plan: rating + Knack + help, capped at 5 BEFORE dice are removed (v0.9: no Cattitude die)", () => {
  const p = buildRollPlan({ approach: "savage", rating: 4, knack: true, helpers: 2, difficulty: 1 });
  assert.equal(p.raw, 7);
  assert.equal(p.capped, 5);
  assert.equal(p.overCap, true);
  assert.equal(p.total, 4, "the cap bites first, so Difficulty still removes a die");
  assert.equal(p.dice, 4);
  assert.deepEqual(p.add.map(a => a.key), ["rating", "knack", "help"]);
  assert.deepEqual(p.remove.map(a => a.key), ["difficulty"]);
  const old = buildRollPlan({ approach: "savage", rating: 2, cattitudeDie: true });
  assert.equal(old.total, 2, "a Cattitude die asked for is ignored");
  assert.equal(old.cattitudeCost, undefined);
});

test("roll plan: help counts at most +2; Knack and the Chonky wriggle die are one extra die between them", () => {
  assert.equal(buildRollPlan({ approach: "sneaky", rating: 1, helpers: 4 }).total, 3);
  assert.equal(buildRollPlan({ approach: "sneaky", rating: 1, helpers: 4 }).add.some(a => a.key === "helpCapped"), true);
  assert.equal(buildRollPlan({ approach: "savage", rating: 2, knack: true, bodyDie: true }).total, 3);
  assert.equal(buildRollPlan({ approach: "savage", rating: 2, bodyDie: true, difficulty: 1 }).total, 2, "wriggle: Savage Tricky, Chonky +1");
});

test("roll plan: Attention removes dice from Sneaky and Sweet only; a pet's rating from anything", () => {
  assert.equal(buildRollPlan({ approach: "sneaky", rating: 3, attention: 2 }).total, 1);
  assert.equal(buildRollPlan({ approach: "sweet", rating: 3, attention: 1 }).total, 2);
  const sav = buildRollPlan({ approach: "savage", rating: 3, attention: 2 });
  assert.equal(sav.total, 3);
  assert.equal(sav.attentionIgnored, true);
  assert.equal(buildRollPlan({ approach: "streetwise", rating: 2, attention: 2 }).total, 2);
  assert.equal(buildRollPlan({ approach: "savage", rating: 3, knack: true, opposition: 2 }).total, 2, "the Ch 4 example: Big Biscuit vs the dog");
  assert.ok(attentionApplies("sneaky") && attentionApplies("sweet") && !attentionApplies("savage") && !attentionApplies("streetwise"));
});

test("roll plan: 0 or fewer dice → roll two and keep the lower", () => {
  const p = buildRollPlan({ approach: "sneaky", rating: 1, difficulty: 2 });
  assert.equal(p.total, -1);
  assert.equal(p.zero, true);
  assert.equal(p.dice, 2);
  assert.equal(buildRollPlan({ approach: "sneaky", rating: 2, difficulty: 2 }).zero, true, "exactly 0 is a zero pool");
  assert.throws(() => buildRollPlan({ approach: "fly", rating: 2 }));
  assert.equal(poolSize({ rating: 4, knack: true, helpers: 2 }), 5);
  assert.equal(poolSize({ rating: 2, cattitudeDie: true }), 2, "v0.9: no Cattitude die");
});

test("reading the dice: the highest die; two 6s Purrfect; a zero pool keeps the lower, never above Scrape", () => {
  assert.equal(readDice([1, 2, 3]), "flop");
  assert.equal(readDice([3, 4]), "scrape");
  assert.equal(readDice([5]), "scrape");
  assert.equal(readDice([2, 6]), "clean");
  assert.equal(readDice([6, 6]), "purrfect");
  assert.equal(readDice([6, 6, 6, 1]), "purrfect");
  assert.equal(readDice([6, 3], true), "flop");
  assert.equal(readDice([4, 6], true), "scrape");
  assert.equal(readDice([6, 6], true), "scrape");
  assert.throws(() => readDice([]));
  assert.equal(readIndex([2, 5, 3]), 1);
  assert.equal(readIndex([6, 2], true), 1);
});

test("Push: every die that isn't a 6 is rolled again", () => {
  assert.deepEqual(pushIndices([6, 2, 6, 4]), [1, 3]);
  assert.deepEqual(applyPush([6, 2, 6, 4], [5, 1]), [6, 5, 6, 1]);
  assert.throws(() => applyPush([1, 2], [3]));
  assert.equal(canPush([6, 6]), false);
  assert.equal(canPush([6, 1]), true);
  // v0.9: a Push on a zero-dice roll rerolls both dice
  assert.deepEqual(pushIndices([6, 2], true), [0, 1]);
  assert.deepEqual(applyPush([6, 2], [3, 5], true), [3, 5]);
  assert.equal(canPush([6, 6], true), true);
});

test("Mood steps (Ch 5): seen Clean/Scrape 1 on the approach's meter, Sneaky Clean 0, Purrfect 0, Flop 2 on the fuller", () => {
  const m0 = { broom: 0, cuddle: 0 };
  assert.deepEqual(moodDelta({ result: "clean", approach: "savage", seen: true, mood: m0 }), { side: "broom", steps: 1 });
  assert.deepEqual(moodDelta({ result: "clean", approach: "sneaky", seen: true, mood: m0 }), { side: "broom", steps: 0 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "sneaky", seen: true, mood: m0 }), { side: "broom", steps: 1 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "sweet", seen: true, mood: m0 }), { side: "cuddle", steps: 1 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "streetwise", seen: true, mood: m0 }), { side: "broom", steps: 1 });
  assert.deepEqual(moodDelta({ result: "purrfect", approach: "savage", seen: true, mood: m0 }), { side: "broom", steps: 0 });
  assert.deepEqual(moodDelta({ result: "flop", approach: "sweet", seen: true, mood: m0 }), { side: "cuddle", steps: 2 }, "level: its own meter");
  assert.deepEqual(moodDelta({ result: "flop", approach: "sneaky", seen: true, mood: { broom: 1, cuddle: 1 } }), { side: "broom", steps: 2 }, "the Ch 5 example");
  assert.deepEqual(moodDelta({ result: "flop", approach: "sweet", seen: true, mood: { broom: 3, cuddle: 1 } }), { side: "broom", steps: 2 }, "a flop makes their mood worse");
  assert.equal(moodDelta({ result: "flop", approach: "savage", seen: false, mood: m0 }).steps, 0, "unseen: nothing");
});

test("Mood steps: a kid doubles Cuddle steps (once); a Push paid with the Mood adds 1, seen or not", () => {
  const m0 = { broom: 0, cuddle: 0 };
  assert.deepEqual(moodDelta({ result: "clean", approach: "sweet", seen: true, mood: m0, kidDoubles: true }), { side: "cuddle", steps: 2 });
  assert.deepEqual(moodDelta({ result: "flop", approach: "sweet", seen: true, mood: m0, kidDoubles: true }), { side: "cuddle", steps: 4 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "savage", seen: true, mood: m0, kidDoubles: true }), { side: "broom", steps: 1 }, "kids only double Cuddle");
  assert.deepEqual(moodDelta({ result: "clean", approach: "savage", seen: false, mood: m0, pushedWithMood: true }), { side: "broom", steps: 1 });
  assert.deepEqual(moodDelta({ result: "flop", approach: "savage", seen: false, mood: { broom: 0, cuddle: 2 }, pushedWithMood: true }), { side: "cuddle", steps: 1 },
    "an unseen pushed Flop pays on the fuller meter");
  assert.deepEqual(moodDelta({ result: "scrape", approach: "sweet", seen: true, mood: m0, pushedWithMood: true }), { side: "cuddle", steps: 2 });
  // v0.9: the step paid with the Mood always lands — even on a Purrfect — and a kid doesn't double it
  assert.deepEqual(moodDelta({ result: "purrfect", approach: "sweet", seen: true, mood: m0, pushedWithMood: true, kidDoubles: true }), { side: "cuddle", steps: 1 });
  assert.deepEqual(moodDelta({ result: "scrape", approach: "sweet", seen: true, mood: m0, pushedWithMood: true, kidDoubles: true }), { side: "cuddle", steps: 3 }, "2 (doubled) + 1 (not)");
});

test("holder's d6 (Ch 9): 1–3 keeps cuddling, 4–5 the Den, 6 outside", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(holderOutcome), ["keep", "keep", "keep", "den", "den", "outside"]);
});

test("Knacks, meters, Cattitude and legal cats", () => {
  assert.equal(hasKnack(["curious", "climber"], ["climb"]), true);
  assert.equal(hasKnack(["curious", "climber"], ["food"]), false);
  assert.deepEqual(knackInstincts(["curious", "knocker"], ["open", "knock"]), ["curious", "knocker"], "two fit, still one die");
  assert.deepEqual(knackInstincts(["hunter", "scrapper"], ["fight"]), ["scrapper"], "v0.9: Hunter's Knack isn't fighting animals");
  assert.equal(hasKnack(["hunter", "climber"], ["chase"]), true);
  assert.equal(fillsMeter("sweet"), "cuddle");
  assert.equal(fillsMeter("streetwise"), "broom");
  assert.equal(clampCattitude(7), 5);
  assert.equal(clampCattitude(-1), 0);
  assert.equal(validateApproaches({ sneaky: 3, sweet: 2, savage: 1, streetwise: 1 }).starting, true);
  assert.equal(validateApproaches({ sneaky: 4, sweet: 2, savage: 1, streetwise: 1 }).starting, false);
  assert.deepEqual(validateApproaches({ sneaky: 5, sweet: 2, savage: 1, streetwise: 1 }).errors.length, 1);
  assert.deepEqual(validateInstincts(["curious", "climber"]), []);
  assert.ok(validateInstincts(["curious", "curious"]).length);
  assert.ok(validateInstincts(["flying"]).length >= 1);
});

test("the Ch 4 odds table", () => {
  const near = (a, b) => Math.abs(a - b) < 0.03; // the book rounds (11/36 is printed "1 in 3")
  assert.ok(near(chanceAtLeast(0, "scrape"), 1 / 4));
  assert.ok(near(chanceAtLeast(1, "scrape"), 1 / 2));
  assert.ok(near(chanceAtLeast(2, "scrape"), 3 / 4));
  assert.ok(near(chanceAtLeast(3, "scrape"), 7 / 8));
  assert.ok(near(chanceAtLeast(2, "clean"), 1 / 3));
  assert.ok(near(chanceAtLeast(5, "clean"), 3 / 5));
  assert.ok(near(chanceAtLeast(4, "purrfect"), 1 / 8));
  assert.equal(chanceAtLeast(0, "clean"), 0);
});
