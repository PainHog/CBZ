/**
 * Core rules v0.8 (after the Wendell and cake playtests; book/REVIEW.md rows
 * 71–93): one test per ruling the Foundry logic follows — the Prize Clock's
 * hold, hauling, the parrot, the prize's steps, Shoo!, the waiting meter,
 * noise, entrances, the Small prize / vacuum / house cat, the Foundry
 * rulings (holders, dozing, chased back outside, small gangs, wrappings) and
 * five-cat scaling.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { beginRound, endRound, moodNow, setMood, manualMood, placeResident, resolvePendingTrigger, finishRobbery, markNoise } from "../module/logic/round.mjs";
import { rollContext, applyRoll, findOption, doAction, catOptions } from "../module/logic/actions.mjs";
import { prizeGot } from "../module/logic/prize.mjs";
import { buildRollPlan } from "../module/logic/rules.mjs";
import { trackerView } from "../module/apps/tracker-view.mjs";
import { robbery, dice, arrange, cat, human, pet, texts } from "./fixtures.mjs";

let n = 0;
function roll(s, id, optionId, approach, result, extra = {}) {
  const ctx = rollContext(s, id, optionId);
  return applyRoll(s, { eventId: `v8-${++n}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, ...extra });
}
/** Number 12 in round 3, the chicken down on the kitchen counter, Pudding out of the way. */
const number12 = (extra = {}) => {
  const s = arrange(beginRound(robbery("number-12")).state, { round: 3, pets: { pudding: { mode: "hiding", until: 99 } }, humans: { pell: "living" }, ...extra });
  s.prize = { ...s.prize, withHuman: null, room: "kitchen", spotRoom: "kitchen", spotSteps: [[["sneaky", 1, "climb"], ["savage", 1, "climb"]], [["streetwise", 1, "open"], ["savage", 1]]], stepsLeft: 0, down: true };
  return s;
};
const carrying = (s, ids, room) => {
  for (const id of ids) Object.assign(cat(s, id), { where: room, status: "free", carrying: true });
  s.prize.carriers = [...ids]; s.prize.room = room;
  return s;
};

test("1. the Prize Clock's hold beats noise: the human it moves stays with the prize and answers no noise until the next round", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { humans: { pell: "utility" } });
  s = beginRound(s).state; // round 2: Mr Pell puts the chicken on the kitchen counter
  assert.equal(human(s, "pell").staysRound, 2);
  s = markNoise(s, "utility").state;
  let r = endRound(s, { d6: dice(), routines: false });
  assert.equal(human(r.state, "pell").room, "kitchen", "the noise next door doesn't draw him");
  assert.match(texts(r.events), /Mr Pell stays with the rotisserie chicken \(the Prize Clock's hold\)/);
  assert.match(texts(r.events), /Nobody comes to see the noise in the utility room/);
  // next round there's no hold: the same noise draws him
  s = markNoise(beginRound(r.state).state, "utility").state;
  r = endRound(s, { d6: dice(), routines: false });
  assert.equal(human(r.state, "pell").room, "utility");
  // with someone else in range, the noise draws them instead (the cake: Dad holds, Aunt Rosalind comes)
  let c = beginRound(robbery("birthday-cake")).state;
  assert.equal(human(c, "dad").staysRound, 1);
  c = markNoise(c, "utility").state;
  r = endRound(c, { d6: dice(), routines: false });
  assert.equal(human(r.state, "dad").room, "kitchen");
  assert.equal(human(r.state, "rosalind").room, "utility", "dining → kitchen → utility: two rooms");
  // the tracker says so
  const v = trackerView(c, { isGM: true });
  const dad = v.floors[0].rooms.find(x => x.key === "kitchen").humans.find(h => h.key === "dad");
  assert.match(dad.badges, /answers no noise this round/);
});

test("2. hauling: any other cat in the room may help (+1 die, its Action, +2 at most); only carriers move; seen from both rooms; plain unless the prize says (the cake: Tricky)", () => {
  let s = carrying(number12({ cats: { biscuit: "kitchen", mags: "kitchen" } }), ["tilly", "velvet"], "kitchen");
  const ctx = rollContext(s, "velvet", "move:hall");
  assert.deepEqual(ctx.helpers.map(h => [h.id, h.locked, h.queued]), [["tilly", true, true], ["biscuit", false, false], ["mags", false, false]]);
  assert.deepEqual(ctx.options.map(o => [o.approach, o.difficulty, o.knack]), [["sneaky", 0, true], ["savage", 0, true]], "plain at Number 12; Velvet the Knocker pushes");
  const plan = buildRollPlan({ approach: "sneaky", rating: 2, knack: true, helpers: 3 });
  assert.equal(plan.total, 5, "help counts +2 at most (Sneaky 2 + Knack + 2)");
  const r = roll(s, "velvet", "move:hall", "sneaky", "clean", { helpers: ["tilly", "biscuit", "mags"] });
  assert.equal(r.state.prize.room, "hall");
  assert.deepEqual(["tilly", "velvet"].map(id => cat(r.state, id).where), ["hall", "hall"]);
  assert.deepEqual(["biscuit", "mags"].map(id => [cat(r.state, id).where, cat(r.state, id).acted]), [["kitchen", true], ["kitchen", true]], "helpers stay behind, Actions spent");
  // seen by a human in the room it leaves or the room it enters
  assert.deepEqual(rollContext(arrange(s, { humans: { pell: "hall" } }), "velvet", "move:hall").seenBy, ["pell"]);
  assert.deepEqual(rollContext(arrange(s, { humans: { pell: "kitchen" } }), "velvet", "move:hall").seenBy, ["pell"]);
  assert.deepEqual(rollContext(s, "velvet", "move:hall").seenBy, [], "Mr Pell in the living room sees neither");
  // the cake wobbles: Tricky to haul, through a way or out of the patio door
  let c = arrange(beginRound(robbery("birthday-cake")).state, { round: 3 });
  c.prize = { ...c.prize, withHuman: null, spotRoom: "kitchen", spotSteps: [], stepsLeft: 0, down: true };
  c = carrying(c, ["biscuit"], "dining");
  assert.equal(c.prize.haulDiff, 1);
  assert.deepEqual(rollContext(c, "biscuit", "move:kitchen").options.map(o => o.difficulty), [1, 1]);
  assert.deepEqual(findOption(c, "biscuit", "exit:patio").roll.options.map(o => o[1]), [1, 1], "out of the patio door too");
});

test("3. the parrot squawks in the Pets step if it saw an unhidden cat at any time this round", () => {
  const cake = () => beginRound(robbery("birthday-cake")).state;
  // Tilly walks in through the patio door (Captain sees her), then hides: he still squawks
  let s = arrange(cake(), { humans: { rosalind: "living" } });
  s = doAction(s, "tilly", "enter:patio").state;
  assert.equal(pet(s, "captain").sawRound, 1);
  s = doAction(s, "tilly", "hide").state;
  assert.equal(cat(s, "tilly").hidden, true);
  const view = trackerView(s, { isGM: true }).floors[0].rooms.find(x => x.key === "dining").pets[0];
  assert.match(view.mode, /saw a cat this round: squawks in the Pets step/);
  let r = endRound(s, { d6: dice(), routines: false });
  assert.match(texts(r.events), /Captain the parrot squawks \(it saw a cat earlier this round\)/);
  assert.ok(r.events.some(e => e.type === "noiseAnswered" && e.room === "dining" && e.human === "rosalind"), "a noise: Aunt Rosalind comes (Dad stays with the cake)");
  // a cat there at the start of the round that walks out: seen, so it squawks
  let w = arrange(robbery("birthday-cake"), { round: 2, stage: "between", cats: { velvet: "dining" }, humans: { rosalind: "living" } });
  w = beginRound(w).state;
  w = doAction(w, "velvet", "move:kitchen").state;
  r = endRound(w, { d6: dice(), routines: false });
  assert.ok(r.events.some(e => e.type === "squawk"));
  // covered after it saw her: quiet for the rest of the robbery
  s = arrange(cake(), { humans: { rosalind: "living" } });
  s = doAction(s, "tilly", "enter:patio").state;
  s = roll(s, "tilly", "cover:captain", "streetwise", "clean").state;
  r = endRound(s, { d6: dice(), routines: false });
  assert.ok(!r.events.some(e => e.type === "squawk"));
  // hidden all round: nothing to see
  s = arrange(cake(), { cats: { mags: { where: "dining", status: "free", hidden: true } }, humans: { rosalind: "living" } });
  r = endRound(s, { d6: dice(), routines: false });
  assert.ok(!r.events.some(e => e.type === "squawk"));
});

test("4. nothing is picked up or eaten until every step is done; a part-eaten prize carried out is got; a Foodie's Knack either way", () => {
  let s = number12({ cats: { tilly: "kitchen", biscuit: "kitchen" } });
  s.prize.stepsLeft = 1; s.prize.down = false;
  const ids = o => catOptions(s, o).options.map(x => x.id);
  assert.ok(ids("biscuit").includes("step"));
  assert.ok(!ids("biscuit").includes("take") && !ids("biscuit").includes("eat"), "one step still to do");
  s = roll(s, "tilly", "step", "streetwise", "clean").state;
  assert.ok(catOptions(s, "biscuit").options.some(x => x.id === "take") && catOptions(s, "biscuit").options.some(x => x.id === "eat"));
  // a Foodie gets its Knack eating, Sneaky or Savage; Tilly doesn't
  assert.deepEqual(rollContext(s, "biscuit", "eat").options.map(o => [o.approach, o.knack]), [["sneaky", true], ["savage", true]]);
  assert.deepEqual(rollContext(s, "tilly", "eat").options.map(o => o.knack), [false, false]);
  // a part-eaten chicken carried out is got: a Clean Getaway
  let e = roll(number12({ cats: { biscuit: "kitchen" } }), "biscuit", "eat", "savage", "scrape").state;
  assert.equal(e.prize.eaten, 1);
  e = carrying(arrange(e, { round: 4, cats: { biscuit: { acted: false, moved: false } } }), ["biscuit"], "utility");
  e = roll(e, "biscuit", "exit:flap", "savage", "clean").state;
  assert.equal(prizeGot(e), true);
  const out = finishRobbery(e).outcome;
  assert.deepEqual([out.result, out.eaten, out.portions], ["clean", 1, 5]);
});

test("5. Shoo!: the nearest entrance that works this round (ties: the Storyteller's pick); the human stays in that room; a prize put back needs every step again", () => {
  // the front door only works in round 1: from the hall in round 3, the kitchen window is the nearest that works
  let s = setMood(number12({ cats: { biscuit: "hall" }, humans: { pell: "hall" } }), { broom: 3 }).state;
  let r = roll(s, "biscuit", "free", "savage", "clean"); // a Clean: no noise to draw him off
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.equal(r.state.entrances.find(e => e.key === "window").open, false);
  assert.equal(r.state.entrances.find(e => e.key === "front").open, true);
  assert.equal(human(r.state, "pell").room, "kitchen", "he stays in that entrance's room");
  assert.match(texts(r.events), /out through the Open kitchen window \(up the bins\), shuts it and stays in the kitchen/);
  let e = endRound(r.state, { d6: dice() });
  assert.equal(human(e.state, "pell").room, "kitchen", "no routine this round (a noise could still draw him)");
  // round 1: the front door works, and it's right there
  let one = setMood(arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: "hall" } }), { broom: 3 }).state;
  one = roll(one, "biscuit", "free", "savage", "scrape").state;
  assert.equal(one.entrances.find(e => e.key === "front").open, false);
  // a tie: from the cake's kitchen the patio door and the utility window are both one room away
  let c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { mags: "kitchen" } }), { broom: 5 }).state;
  r = roll(c, "mags", "free", "savage", "scrape");
  assert.match(texts(r.events), /out through the Patio door, ajar \(as near as another: the Storyteller's pick\), shuts it and stays in the dining room/);
  assert.equal(human(r.state, "dad").room, "dining");
  // the chicken goes back on the counter with both steps to do again: nobody can pick it up yet
  s = carrying(setMood(number12({ cats: { tilly: "kitchen" }, humans: { pell: "hall" } }), { broom: 3 }).state, ["biscuit"], "hall");
  r = roll(s, "biscuit", "free", "savage", "scrape");
  assert.deepEqual([r.state.prize.room, r.state.prize.stepsLeft, r.state.prize.down], ["kitchen", 2, false]);
  assert.ok(!catOptions(r.state, "tilly").options.some(o => o.id === "take"));
  assert.match(findOption(r.state, "tilly", "step").label, /step 1 of 2/);
});

test("6. a meter waiting for someone with free hands: as soon as a human can see a cat, the highest Attention acts at once, on a cat the Storyteller picks", () => {
  // Broom fills with Mr Pell Distracted: nobody sees, it waits; when the house's turn starts he looks round and acts
  let s = number12({ cats: { tilly: "kitchen" }, humans: { pell: { room: "kitchen", distractedRound: 3 } } });
  s = setMood(s, { broom: 4 }).state;
  assert.equal(moodNow(s).full.broom, true);
  assert.equal(cat(s, "tilly").status, "free", "a Distracted human sees nobody");
  let r = endRound(s, { d6: dice(1) });
  assert.match(texts(r.events), /Broom was waiting full: Mr Pell can see Two-Bin Tilly and acts at once/);
  assert.equal(cat(r.state, "tilly").status, "outside");
  // two cats in sight: the Storyteller picks at once — the cats wait for it
  s = setMood(number12({ cats: { tilly: "hall", mags: "hall" }, humans: { pell: "loo" } }), { broom: 4 }).state;
  r = placeResident(s, "pell", "hall");
  assert.deepEqual(r.state.pendingTrigger?.candidates.sort(), ["mags", "tilly"]);
  assert.match(findOption(r.state, "tilly", "move:living").disabled, /the Storyteller first picks which cat Mr Pell chases out/);
  r = resolvePendingTrigger(r.state, "mags");
  assert.equal(cat(r.state, "mags").status, "outside");
  assert.equal(findOption(r.state, "tilly", "move:living").disabled, null, "picked: on with the round");
  // a holder sees the cat but can't act; when his hands are free (a 6: the held cat goes out), he acts at once
  s = setMood(number12({ cats: { velvet: { where: "living", status: "held", heldBy: "pell" }, mags: "living" }, humans: { pell: { room: "living", holding: "velvet" } } }), { broom: 4 }).state;
  assert.equal(cat(s, "mags").status, "free", "his hands are full");
  r = endRound(s, { d6: dice(6) });
  assert.equal(cat(r.state, "velvet").status, "outside", "the holder's 6");
  assert.equal(cat(r.state, "mags").status, "outside", "…then Broom goes off on the cat he can see");
  // the highest Attention acts (the cake: Aunt Rosalind, 2, over Dad, 1)
  let c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { round: 3, humans: { rosalind: "hall", dad: "hall" } }), { broom: 6 }).state;
  r = doAction(arrange(c, { cats: { tilly: "loo" } }), "tilly", "move:hall");
  assert.ok(r.events.some(e => e.type === "shoo" && e.human === "rosalind"));
  // switched off (autoMood "manual"): a full meter never goes off by itself
  s = setMood(number12({ cats: { tilly: "hall" }, humans: { pell: "loo" } }), { broom: 3 }).state;
  r = manualMood(placeResident(s, "pell", "hall", { mood: "manual" }).state, "broom", 1, { mood: "manual" });
  assert.equal(moodNow(r.state).full.broom, true);
  assert.equal(cat(r.state, "tilly").status, "free");
  assert.equal(cat(manualMood(placeResident(s, "pell", "hall").state, "broom", 1).state, "tilly").status, "outside", "on: at once");
});

test("7. several noises in one room count as one and leave one mess; a Searching human still answers noise first", () => {
  let s = arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { tilly: "hall", mags: "hall" }, pets: { captain: { mode: "covered" } } });
  s = doAction(s, "tilly", "noise").state;
  s = doAction(s, "mags", "noise").state;
  assert.equal(s.noise.filter(x => x.room === "hall").length, 2);
  assert.deepEqual(s.messes, ["hall"], "one mess");
  const r = endRound(s, { d6: dice(), routines: false });
  assert.equal(r.events.filter(e => e.type === "noiseAnswered").length, 1, "one human comes");
  assert.equal(human(r.state, "rosalind").room, "hall", "Dad, Rosalind, Mia and Leo are all one room away: v0.9, the higher Attention goes (Aunt Rosalind, 2)");
  assert.equal(moodNow(r.state).broom, 1, "one mess found: +1 Broom");
  // Searching beside the prize, he still goes to see a noise (not in a round the Clock moved him)
  let p = number12({ cats: { tilly: "kitchen" }, humans: { pell: { room: "kitchen", searching: true } } });
  p = markNoise(p, "living").state;
  const e = endRound(p, { d6: dice() });
  assert.equal(human(e.state, "pell").room, "living");
});

test("8. no out-and-back-in on one turn; an entrance's roll is seen from the room it leads into; a noise made on purpose is a noise whatever the roll", () => {
  let s = number12({ cats: { mags: "utility" } });
  s = doAction(s, "mags", "exit:flap").state;
  assert.match(findOption(s, "mags", "enter:flap").disabled, /went out this turn/);
  assert.equal(findOption(beginRound(s).state, "mags", "enter:flap").disabled, null, "next round, in it comes");
  // the window's climb is seen by whoever is in the kitchen
  const one = beginRound(robbery("number-12")).state;
  assert.deepEqual(rollContext(one, "tilly", "enter:window").seenBy, [], "Mr Pell is in the hall");
  assert.deepEqual(rollContext(arrange(one, { humans: { pell: "kitchen" } }), "tilly", "enter:window").seenBy, ["pell"]);
  assert.equal(rollContext(arrange(one, { humans: { pell: "kitchen" } }), "tilly", "enter:window").attention, 1);
  // a lure in view is a roll — a Clean is still a noise, a Flop is one noise, and both leave a mess
  const seen = number12({ cats: { tilly: "kitchen" }, humans: { pell: "kitchen" } });
  assert.ok(findOption(seen, "tilly", "noise").roll);
  for (const result of ["clean", "flop"]) {
    const r = roll(seen, "tilly", "noise", "sneaky", result);
    assert.equal(r.state.noise.filter(x => x.room === "kitchen").length, 1, result);
    assert.deepEqual(r.state.messes, ["kitchen"], result);
  }
});

test("9. a Small prize moved unseen just walks; a carrier can't ride the vacuum; the house cat guards like a dog's charge", () => {
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 2, humans: { wendell: "bedroom", june: "bedroom" } });
  w.prize = { ...w.prize, withHuman: null, room: "hall", spotRoom: "hall", spotSteps: [], stepsLeft: 0, down: true, carriers: [] };
  let m = carrying(arrange(w, {}), ["mags"], "hall");
  assert.equal(findOption(m, "mags", "move:kitchen").roll, null);
  m = doAction(m, "mags", "move:kitchen").state;
  assert.deepEqual([cat(m, "mags").moved, cat(m, "mags").acted], [true, false], "the carrier just walks: its Action is still free");
  // the vacuum: a carrier can't hop on; picking the prize up hops a rider off
  let v = carrying(arrange(w, { pets: { roomba: "hall" } }), ["mags"], "hall");
  assert.equal(findOption(v, "mags", "ride:roomba"), null);
  v = arrange(w, { cats: { tilly: { where: "hall", status: "free", riding: "roomba", hidden: true } }, pets: { roomba: "hall" } });
  v = doAction(v, "tilly", "take").state;
  assert.deepEqual([cat(v, "tilly").carrying, cat(v, "tilly").riding, cat(v, "tilly").hidden], [true, null, false]);
  // Pom-Pom guards the living room: deal with her first; helping counts; a cat that ends its turn there without it is chased back
  let p = arrange(w, { cats: { tilly: { where: "living", status: "free", cameFrom: "hall" }, mags: { where: "living", status: "free", cameFrom: "hall" }, velvet: { where: "living", status: "free", cameFrom: "hall" } } });
  assert.match(findOption(p, "velvet", "hide").disabled, /Pom-Pom is in the way/);
  assert.deepEqual(rollContext(p, "tilly", "confront:pompom").helpers.map(h => h.id), ["velvet", "mags"], "her charges may help the roll that deals with her");
  assert.deepEqual(rollContext(p, "tilly", "free").helpers.map(h => h.id), [], "…but nothing else");
  p = roll(p, "tilly", "confront:pompom", "sneaky", "clean", { helpers: ["mags"] }).state;
  const r = endRound(p, { d6: dice(), routines: false });
  assert.deepEqual(["tilly", "mags", "velvet"].map(id => cat(r.state, id).where), ["living", "living", "hall"]);
  assert.match(texts(r.events), /Pom-Pom chases Velvet back into the hall/);
});

test("10. the Foundry rulings: holders, a held cat's own Broom, dozing, chased back outside, small gangs, wrappings", () => {
  // a holder sees, but can't chase or pick up another cat, and can't be Distracted
  let s = setMood(number12({ cats: { velvet: { where: "living", status: "held", heldBy: "pell" }, mags: "living", tilly: "living" }, humans: { pell: { room: "living", holding: "velvet" } } }), { broom: 3 }).state;
  let r = roll(s, "mags", "free", "savage", "scrape");
  assert.equal(cat(r.state, "mags").status, "free");
  assert.equal(moodNow(r.state).full.broom, true, "it waits for someone with free hands");
  assert.equal(findOption(s, "tilly", "distract:pell"), null);
  // a held cat whose own roll fills Broom is put outside: the holder lets go and shoos it out
  s = setMood(number12({ cats: { biscuit: { where: "hall", status: "held", heldBy: "pell" } }, humans: { pell: { room: "hall", holding: "biscuit" } } }), { broom: 3 }).state;
  r = roll(s, "biscuit", "wriggle", "savage", "flop");
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.equal(human(r.state, "pell").holding, null);
  assert.equal(human(r.state, "pell").room, "kitchen", "out through the kitchen window, and he stays there");
  // a dozing human: asleep, stays put (no routine, no doze die); the Prize Clock wakes him for his job
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, humans: { wendell: { room: "living", asleepUntil: 3 }, june: "kitchen" } });
  w.pets = w.pets.filter(p => p.kind !== "vacuum");
  const d = dice(1);
  r = endRound(w, { d6: d });
  assert.equal(human(r.state, "wendell").room, "living");
  assert.equal(d.left(), 0, "only June rolled");
  assert.match(texts(r.events), /Grandpa Wendell is asleep and stays put/);
  w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, stage: "between", humans: { wendell: { room: "bedroom", asleepUntil: 4 } } });
  r = beginRound(w); // round 4: he moves the mouse to the living room
  assert.equal(human(r.state, "wendell").asleepUntil, -1);
  assert.equal(human(r.state, "wendell").room, "living");
  assert.equal(r.state.prize.spotRoom, "living");
  assert.match(texts(r.events), /Grandpa Wendell wakes up/);
  // a cat chased back after coming in this round goes back outside; one that came in earlier goes back into the house
  let o = arrange(beginRound(robbery("okafor-box")).state, { pets: { noodle: { mode: "awake" } } });
  o = doAction(o, "tilly", "enter:dogdoor").state;
  assert.equal(cat(o, "tilly").where, "kitchen");
  r = endRound(o, { d6: dice(), routines: false });
  assert.equal(cat(r.state, "tilly").status, "outside");
  assert.match(texts(r.events), /Noodle chases Two-Bin Tilly back out through the Dog door/);
  o = arrange(beginRound(robbery("okafor-box")).state, { pets: { noodle: { mode: "awake" } } });
  o = doAction(o, "tilly", "enter:dogdoor").state;
  o = arrange(beginRound(endRound(arrange(o, { pets: { noodle: { mode: "asleep" } } }), { d6: dice(), routines: false }).state).state, { pets: { noodle: { mode: "awake", room: "kitchen" } } });
  r = endRound(o, { d6: dice(), routines: false });
  assert.equal(cat(r.state, "tilly").where, "hall", "came in last round: chased into the next room");
  // a gang of one or two plays as three
  for (const gang of [["tilly"], ["tilly", "biscuit"]]) {
    const g = robbery("number-12", gang);
    assert.deepEqual([g.patience0, g.clock.goneAt, g.cattitudeStart], [5, 12, 3], gang.join());
  }
  // tearing a wrapping isn't fighting: no Hunter or Scrapper Knack on the foil (the Foodie's still counts on food)
  s = number12({ cats: { mags: "kitchen", biscuit: "kitchen" } });
  s.prize.stepsLeft = 1; s.prize.down = false;
  assert.deepEqual(rollContext(s, "mags", "step").options.map(o => [o.approach, o.knack]), [["streetwise", false], ["savage", false]]);
  assert.deepEqual(rollContext(s, "biscuit", "step").options.map(o => [o.approach, o.knackFrom]), [["streetwise", ["Foodie"]], ["savage", ["Foodie"]]]);
});

test("11. five cats: Patience −1 and the Prize Clock unchanged (v0.8 final, REVIEW #103) — unless the house prints its own (v0.9: the cake)", () => {
  const five = ["tilly", "biscuit", "velvet", "mags", "pip"];
  for (const key of ["number-12", "wendell-mouse", "birthday-cake", "okafor-box", "marchetti-salmon"]) {
    const four = robbery(key);
    const s = robbery(key, five);
    assert.equal(s.clock.goneAt, four.clock.goneAt + (key === "birthday-cake" ? 1 : 0), `${key}: the Clock doesn't move (the cake: 1 round later)`);
    assert.equal(s.patience0, Math.max(2, four.patience0 - 1), `${key}: Patience −1`);
    assert.equal(s.clock.lightsOut, s.clock.goneAt + 2, `${key}: Lights Out with it`);
    assert.deepEqual(s.prize.script.map(x => x.round), four.prize.script.map(x => x.round), `${key}: the put-downs don't move`);
  }
  // Wendell with five: the mouse still moves to the living room at the start of round 4, and is gone at the start of 9
  let w = robbery("wendell-mouse", five);
  for (let i = 0; i < 4; i++) w = beginRound(w).state;
  assert.equal(w.prize.spotRoom, "living");
  assert.equal(w.clock.goneAt, 9);
});
