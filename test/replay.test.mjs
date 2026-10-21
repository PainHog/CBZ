/**
 * A whole robbery at The Chicken at Number 12, replayed through the pure logic
 * with fixed dice (AUTOMATION.md §9), under core rules v0.9: every roll is built
 * with the roll plan from the robbery state (approach, Knack, help, Difficulty,
 * pet, Attention), read from scripted faces, and applied as a final roll card
 * would be; the house's turns use scripted d6s.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildRollPlan, readDice } from "../module/logic/rules.mjs";
import { beginRound, endRound, tempt, answerTemptation, moodNow, finishRobbery } from "../module/logic/round.mjs";
import { rollContext, applyRoll, doAction, findOption, queueHelp } from "../module/logic/actions.mjs";
import { robbery, dice, cat, human, pet, runHome } from "./fixtures.mjs";

let ev = 0;
/** Roll for an option with these faces; checks the pool is what the state says it should be. */
function rollWith(s, id, optionId, approach, faces, { helpers = null, expectDice } = {}) {
  const ctx = rollContext(s, id, optionId);
  const o = ctx.options.find(x => x.approach === approach);
  assert.ok(o, `${optionId} offers ${approach}`);
  const help = helpers ?? ctx.helpers.filter(h => h.locked).map(h => h.id); // a haul's other carriers are locked in
  const plan = buildRollPlan({ approach, rating: o.rating, knack: o.knack, bodyDie: ctx.bodyDie, helpers: help.length,
    difficulty: o.difficulty, opposition: ctx.opposition, attention: ctx.seenBy.length ? o.attention : 0 });
  if (expectDice !== undefined) assert.equal(plan.total, expectDice, `${id} ${optionId}: dice`);
  assert.equal(faces.length, plan.dice, `${id} ${optionId}: ${plan.dice} dice to roll`);
  const result = readDice(faces, plan.zero);
  return applyRoll(s, { eventId: `r${++ev}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, helpers: help });
}

test("a whole robbery at Number 12 (v0.9) ends in a Clean Getaway, with every rule applied on the way", () => {
  const log = [];
  const keep = r => { log.push(...r.events.map(e => e.text)); return r.state; };
  let s = robbery("number-12");
  assert.deepEqual(s.clock, { goneAt: 10, lightsOut: 12 });

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

  // ---- Round 2: the chicken goes on the kitchen counter, and Mr Pell stays with it whatever the noise.
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
  s = keep(rollWith(s, "mags", "open:kitchen~utility", "streetwise", [5, 4], { expectDice: 0 })); // 1 − Tricky: keep the lower of two
  assert.equal(s.ways.find(w => w.id === "kitchen~utility").open, true);
  assert.deepEqual(s.noise.map(x => x.room), ["utility"], "a Scrape next door: a lure");
  let h = endRound(s, { d6: dice() });
  s = keep(h);
  assert.equal(human(s, "pell").room, "kitchen", "v0.8: the Prize Clock's hold beats noise");
  assert.ok(h.events.some(e => e.type === "holdIgnoresNoise" && e.human === "pell"));
  assert.equal(human(s, "pell").searching, false, "nobody touched the chicken in the put-down round");

  // ---- Round 3: Velvet keeps Mr Pell busy, the steps get done, and Mags lures him next door.
  s = keep(beginRound(s));
  s = keep(rollWith(s, "velvet", "distract:pell", "sweet", [6, 1, 2], { expectDice: 3 }));
  assert.equal(moodNow(s).cuddle, 2);
  s = keep(rollWith(s, "tilly", "step", "sneaky", [4, 2], { expectDice: 2 })); // nobody sees: Mr Pell is Distracted
  assert.equal(s.prize.stepsLeft, 1);
  s = keep(rollWith(s, "biscuit", "step", "savage", [6, 3, 1], { expectDice: 3 })); // 3 + Foodie − Tricky
  assert.equal(s.prize.down, true);
  s = keep(doAction(s, "mags", "noise")); // unseen: a simple thing
  assert.deepEqual(s.messes, ["utility"]);
  s = keep(endRound(s, { d6: dice() })); // the kitchen noise: Mr Pell's already there; the utility noise draws him
  assert.equal(human(s, "pell").room, "utility", "no Clock this round: the lure works");
  assert.equal(human(s, "pell").searching, false, "he wasn't beside the chicken at the end of the house's turn");
  assert.equal(moodNow(s).broom, 2, "…but he found the mess");
  assert.deepEqual(s.messes, []);

  // ---- Round 4: Biscuit picks it up; Mags and Tilly slip out.
  s = keep(beginRound(s));
  s = keep(doAction(s, "biscuit", "take")); // nobody sees: a simple thing
  assert.deepEqual(s.prize.carriers, ["biscuit"]);
  assert.match(findOption(s, "biscuit", "move:utility").disabled, /already acted/, "picking it up was the Action; hauling needs one too");
  s = keep(doAction(s, "mags", "exit:flap")); // going out through an entrance with no roll: free in view
  assert.equal(cat(s, "mags").status, "outside");
  assert.match(findOption(s, "mags", "enter:flap").disabled, /went out this turn/, "v0.8: no out-and-back-in on one turn");
  s = keep(rollWith(s, "tilly", "exit:window", "sneaky", [6, 4], { expectDice: 2 }));
  s = keep(endRound(s, { d6: dice(5) })); // the flap's clack is in Mr Pell's own room; his routine takes him to the living room
  assert.equal(human(s, "pell").room, "living");
  assert.equal(pet(s, "pudding").mode, "awake", "Pudding is back after three rounds, counting the first");
  assert.equal(pet(s, "pudding").room, "kitchen");

  // ---- Round 5: hauling it out of Pudding's kitchen counts as leaving it; Velvet can't help (the dog first).
  s = keep(beginRound(s));
  assert.equal(findOption(s, "biscuit", "move:utility").disabled, null);
  assert.deepEqual(rollContext(s, "biscuit", "move:utility").helpers, [], "a cat Pudding is stopping deals with him before helping");
  s = keep(rollWith(s, "biscuit", "move:utility", "savage", [5, 2, 1], { expectDice: 3 })); // a Medium prize: a roll, seen or not
  assert.equal(s.prize.room, "utility");
  assert.deepEqual(s.noise.map(x => x.room), ["utility"], "a haul's noise is in the room it ends up in");
  assert.equal(moodNow(s).broom, 2, "nobody saw it");
  s = keep(doAction(s, "velvet", "move:utility")); // leaving the dog's room is always allowed
  s = keep(endRound(s, { d6: dice(1, 1) })); // Pudding and Mr Pell stay put; the living room is three rooms from the noise

  // ---- Round 6: out through the flap — Velvet helps the haul, but only the carrier goes with the chicken.
  s = keep(beginRound(s));
  s = keep(queueHelp(s, "velvet", "biscuit"));
  const haul = rollContext(s, "biscuit", "exit:flap");
  assert.deepEqual(haul.helpers.map(x => [x.id, x.locked, x.queued]), [["velvet", false, true]]);
  s = keep(rollWith(s, "biscuit", "exit:flap", "savage", [6, 2, 2, 1], { helpers: ["velvet"], expectDice: 4 }));
  assert.equal(s.prize.out, true);
  assert.equal(cat(s, "velvet").where, "utility", "a helper isn't a carrier: Velvet stays behind");
  assert.equal(cat(s, "velvet").acted, true);
  s = keep(doAction(s, "velvet", "exit:flap")); // …and goes out as her Move
  const end = endRound(s, { d6: dice(1, 1) });
  s = keep(end);
  assert.deepEqual([end.end.due, end.end.reason], [true, "allOut"]);
  const fin = runHome(s, { reason: end.end.reason }); // the getaway settled by hand: everyone gets home with the loot
  log.push(...fin.events.map(e => e.text));
  assert.equal(fin.outcome.result, "clean");
  assert.equal(fin.outcome.label, "Clean Getaway");
  assert.deepEqual([fin.outcome.loot, fin.outcome.lootTotal], [5, 5]);
  const f = moodNow(fin.state);
  assert.deepEqual([f.broom, f.cuddle, f.patience], [2, 2, 4]);
  assert.match(log.join("\n"), /Clean Getaway! Loot home: 5 of 5\. Nobody was pinched/);
  assert.equal(fin.state.log.length, log.length + 1, "the robbery log has every event (plus the start line)");
});
