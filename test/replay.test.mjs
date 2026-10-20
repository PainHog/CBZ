/**
 * A whole robbery at The Chicken at Number 12, replayed through the pure logic
 * with fixed dice (AUTOMATION.md §9), under core rules v0.7: every roll is built
 * with the roll plan from the robbery state (approach, Knack, help, Difficulty,
 * pet, Attention), read from scripted faces, and applied as a final roll card
 * would be; the house's turns use scripted d6s.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildRollPlan, readDice } from "../module/logic/rules.mjs";
import { beginRound, endRound, tempt, answerTemptation, moodNow, finishRobbery } from "../module/logic/round.mjs";
import { rollContext, applyRoll, doAction, findOption } from "../module/logic/actions.mjs";
import { robbery, dice, cat, human, pet } from "./fixtures.mjs";

let ev = 0;
/** Roll for an option with these faces; checks the pool is what the state says it should be. */
function rollWith(s, id, optionId, approach, faces, { helpers = null, cattitudeDie = false, expectDice } = {}) {
  const ctx = rollContext(s, id, optionId);
  const o = ctx.options.find(x => x.approach === approach);
  assert.ok(o, `${optionId} offers ${approach}`);
  const help = helpers ?? (ctx.autoHelpers ? ctx.helpers.map(h => h.id) : []);
  const plan = buildRollPlan({ approach, rating: o.rating, knack: o.knack, bodyDie: ctx.bodyDie, helpers: help.length, cattitudeDie,
    difficulty: o.difficulty, opposition: ctx.opposition, attention: ctx.seenBy.length ? o.attention : 0 });
  if (expectDice !== undefined) assert.equal(plan.total, expectDice, `${id} ${optionId}: dice`);
  assert.equal(faces.length, plan.dice, `${id} ${optionId}: ${plan.dice} dice to roll`);
  const result = readDice(faces, plan.zero);
  return applyRoll(s, { eventId: `r${++ev}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, helpers: help });
}

test("a whole robbery at Number 12 (v0.7) ends in a Clean Getaway, with every rule applied on the way", () => {
  const log = [];
  const keep = r => { log.push(...r.events.map(e => e.text)); return r.state; };
  let s = robbery("number-12");
  assert.deepEqual(s.clock, { goneAt: 9, lightsOut: 11 });

  // ---- Round 1: Mr Pell comes in with the chicken; the gang gets in three ways.
  s = keep(beginRound(s));
  s = keep(rollWith(s, "velvet", "enter:front", "sweet", [6, 2, 3], { expectDice: 3 })); // Sweet 3 + Lap Cat − Attention 1
  assert.equal(cat(s, "velvet").where, "hall");
  s = keep(doAction(s, "mags", "enter:flap"));
  s = keep(rollWith(s, "biscuit", "enter:window", "savage", [6, 1], { expectDice: 2 })); // Savage 3 − Tricky
  s = keep(rollWith(s, "tilly", "enter:window", "sneaky", [6, 3], { expectDice: 2 })); // Sneaky 2 + Climber − Tricky
  assert.equal(moodNow(s).cuddle, 1, "Velvet's Clean at the door, seen: Cuddle 1");
  s = keep(endRound(s, { d6: dice() })); // Pudding barks and stays (no die); Mr Pell answers the flap first
  assert.equal(human(s, "pell").room, "utility", "the cat flap's clack was the first noise");
  assert.equal(pet(s, "pudding").room, "kitchen");

  // ---- Round 2: the chicken goes on the kitchen counter; Mags is tempted and resists.
  s = keep(beginRound(s));
  assert.equal(s.prize.room, "kitchen");
  assert.equal(human(s, "pell").room, "kitchen");
  s = keep(tempt(s, { catId: "mags", instinct: "hunter" }));
  assert.match(findOption(s, "biscuit", "confront:pudding").disabled, /Marmalade Mags is tempted and goes first/);
  const t = answerTemptation(s, { choice: "resisted", cattitude: 2 });
  assert.deepEqual(t.cattitude, [{ catId: "mags", delta: -1, why: "resisted a temptation" }]);
  s = keep(t);
  s = keep(rollWith(s, "biscuit", "confront:pudding", "savage", [6, 5], { expectDice: 2 })); // 3 + Scrapper − Pudding 2
  assert.equal(pet(s, "pudding").mode, "hiding");
  assert.equal(pet(s, "pudding").until, 4, "hides for 3 rounds counting this one");
  assert.equal(moodNow(s).broom, 1, "a seen Savage Clean");
  s = keep(doAction(s, "velvet", "move:kitchen"));
  s = keep(rollWith(s, "velvet", "distract:pell", "sweet", [6, 1, 2], { expectDice: 3 }));
  assert.equal(moodNow(s).cuddle, 2);
  s = keep(rollWith(s, "tilly", "step", "sneaky", [4, 2], { expectDice: 2 })); // nobody sees: Mr Pell is Distracted
  assert.equal(s.prize.stepsLeft, 1);
  s = keep(rollWith(s, "mags", "open:kitchen~utility", "streetwise", [5, 4], { expectDice: 0 })); // 1 − Tricky: keep the lower of two
  assert.equal(s.ways.find(w => w.id === "kitchen~utility").open, true);
  s = keep(endRound(s, { d6: dice() })); // the kitchen noise: nobody else near; the utility noise draws Mr Pell
  assert.equal(human(s, "pell").room, "utility", "noise beats the Prize Clock's hold");
  assert.equal(human(s, "pell").searching, false, "he left the counter before the end of the house's turn");

  // ---- Round 3: the foil comes off, Biscuit takes it, Velvet keeps Mr Pell busy, Mags slips out.
  s = keep(beginRound(s));
  s = keep(rollWith(s, "tilly", "step", "streetwise", [6, 3, 1], { expectDice: 3 })); // 3 + Curious − Tricky
  assert.equal(s.prize.down, true);
  s = keep(doAction(s, "biscuit", "take"));
  assert.deepEqual(s.prize.carriers, ["biscuit"]);
  assert.match(findOption(s, "biscuit", "move:utility").disabled, /already acted/, "picking it up was the Action; hauling needs one too");
  s = keep(doAction(s, "velvet", "move:utility"));
  s = keep(rollWith(s, "velvet", "distract:pell", "sweet", [6, 3], { expectDice: 2 })); // 4 − once before − Attention 1
  assert.equal(moodNow(s).cuddle, 3);
  s = keep(doAction(s, "mags", "exit:flap"));
  assert.equal(cat(s, "mags").status, "outside");
  s = keep(endRound(s, { d6: dice(1) })); // Mr Pell stays put
  assert.equal(human(s, "pell").room, "utility");
  assert.equal(moodNow(s).broom, 1, "nobody beside the chicken at the end of the house's turn");

  // ---- Round 4: Velvet and Tilly slip out; Biscuit waits with the chicken while Mr Pell is in the utility room.
  s = keep(beginRound(s));
  s = keep(doAction(s, "velvet", "exit:flap")); // going out through an entrance with no roll: free in view
  s = keep(rollWith(s, "tilly", "exit:window", "sneaky", [6, 4], { expectDice: 2 }));
  s = keep(endRound(s, { d6: dice(5) })); // the flap's clack is in Mr Pell's own room; his routine takes him to the living room
  assert.equal(human(s, "pell").room, "living");
  assert.equal(human(s, "pell").searching, false, "nobody beside the chicken or where the Clock put it");
  assert.equal(pet(s, "pudding").mode, "awake", "Pudding is back after three rounds, counting the first");

  // ---- Round 5: hauling it out of Pudding's kitchen counts as leaving it.
  s = keep(beginRound(s));
  assert.equal(findOption(s, "biscuit", "move:utility").disabled, null);
  s = keep(rollWith(s, "biscuit", "move:utility", "savage", [5, 2, 1], { expectDice: 3 })); // a Medium prize: a roll, seen or not
  assert.equal(s.prize.room, "utility");
  assert.deepEqual(s.noise.map(x => x.room), ["utility"], "a haul's noise is in the room it ends up in");
  assert.equal(moodNow(s).broom, 1, "nobody saw it");
  s = keep(endRound(s, { d6: dice(1, 1) })); // Pudding and Mr Pell stay put; the living room is three rooms from the noise

  // ---- Round 6: out through the flap.
  s = keep(beginRound(s));
  s = keep(rollWith(s, "biscuit", "exit:flap", "savage", [6, 2, 2], { expectDice: 3 }));
  assert.equal(s.prize.out, true);
  const end = endRound(s, { d6: dice(1, 1) });
  s = keep(end);
  assert.deepEqual([end.end.due, end.end.reason], [true, "allOut"]);
  const fin = finishRobbery(s, end.end.reason);
  log.push(...fin.events.map(e => e.text));
  assert.equal(fin.outcome.result, "clean");
  assert.equal(fin.outcome.label, "Clean Getaway");
  const f = moodNow(fin.state);
  assert.deepEqual([f.broom, f.cuddle, f.patience], [1, 3, 4]);
  assert.match(log.join("\n"), /Clean Getaway! Nobody was left behind/);
  assert.equal(fin.state.log.length, log.length + 1, "the robbery log has every event (plus the start line)");
});
