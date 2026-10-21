/**
 * Core rules v0.9 (the outside review of v0.8; simulator package P11): one
 * test per ruling the Foundry logic follows — Shoo!'s entrance, after a catch,
 * full meters, no Cattitude die, the Push, temptation, Hunter's Knack,
 * Distract and the Scoop, noise, Searching, pets and dozing, Caught, the front
 * door, hauling, the end, gang size and Rep — and the book's other v0.9
 * clarifications the system follows (no help from outside, meowing at any
 * door, a prize put down after its Gone round).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  beginRound, endRound, moodNow, setMood, manualMood, markNoise, tempt, answerTemptation, temptationOptions, endCheck, finishRobbery, newRobbery, setOpen
} from "../module/logic/round.mjs";
import { rollContext, applyRoll, findOption, doAction, catOptions, queueHelp } from "../module/logic/actions.mjs";
import { shooEntrances, isDoorEntrance } from "../module/logic/map.mjs";
import { repBonus, startingCattitude, pickByDie, buildRollPlan } from "../module/logic/rules.mjs";
import { findHouse } from "../module/logic/house-catalog.mjs";
import { CATB } from "../module/config.mjs";
import { robbery, dice, arrange, cat, human, pet, texts, GANG } from "./fixtures.mjs";

let n = 0;
function roll(s, id, optionId, approach, result, extra = {}) {
  const ctx = rollContext(s, id, optionId);
  const { ctx: c2 = {}, ...card } = extra;
  return applyRoll(s, { eventId: `v9-${++n}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, ...card }, c2);
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
const entrance = (s, key) => s.entrances.find(e => e.key === key);

test("1. Shoo!: the nearest entrance the cat fits through that works this round, opened if shut; shut after — unless it's the last one open; the human stays and answers no noise", () => {
  // a Chonky cat doesn't fit a Tight one: from Chef Marchetti's landing, Mags goes out of the skylight, Biscuit off the balcony
  let m = arrange(beginRound(robbery("marchetti-salmon")).state, { round: 3, cats: { biscuit: "landing", mags: "landing" }, humans: { sam: "landing" }, pets: { brutus: { mode: "hiding", until: 99 } } });
  assert.deepEqual(shooEntrances(m, "landing", cat(m, "mags")).map(e => e.key), ["skylight"]);
  assert.deepEqual(shooEntrances(m, "landing", cat(m, "biscuit")).map(e => e.key), ["balcony"]);
  let r = roll(setMood(m, { broom: 6 }).state, "biscuit", "free", "savage", "scrape");
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.match(texts(r.events), /chases Big Biscuit out through the Balcony door \(up the tree\), shuts it and stays in the bedroom/);
  assert.equal(human(r.state, "sam").room, "bedroom");
  // shut: the human opens it to put the cat out, then shuts it (the cat flap is still open)
  let s = setMood(setOpen(number12({ cats: { biscuit: "kitchen" }, humans: { pell: "kitchen" } }), { entrance: "window", open: false }).state, { broom: 3 }).state;
  r = roll(s, "biscuit", "free", "savage", "clean");
  assert.match(texts(r.events), /out through the Open kitchen window \(up the bins\) \(opening it first\), shuts it and stays in the kitchen/);
  assert.equal(entrance(r.state, "window").open, false);
  assert.equal(entrance(r.state, "flap").open, true);
  // …and he answers no noise this round; the cat can come back in next round at the earliest
  assert.match(findOption(r.state, "biscuit", "enter:flap").disabled, /went out this turn/);
  let e = endRound(markNoise(r.state, "hall").state, { d6: dice() });
  assert.equal(human(e.state, "pell").room, "kitchen");
  assert.match(texts(e.events), /Mr Pell stays by the entrance they shooed a cat out of: the noise in the hall doesn't draw them this round/);
  assert.equal(findOption(beginRound(e.state).state, "biscuit", "enter:flap").disabled, null);
  // the last entrance still open (the front door has a round limit, so it doesn't count): left open
  s = setMood(setOpen(number12({ cats: { biscuit: "kitchen" }, humans: { pell: "kitchen" } }), { entrance: "flap", open: false }).state, { broom: 3 }).state;
  r = roll(s, "biscuit", "free", "savage", "clean");
  assert.equal(entrance(r.state, "window").open, true);
  assert.match(texts(r.events), /leaves it open \(it's the last way in still open\) and stays in the kitchen/);
  // no entrance works for that cat: the nearest it fits through; none fits: the nearest of all
  const odd = { ...number12(), entrances: number12().entrances.map(x => (x.key === "front" ? x : { ...x, size: "tight" })) };
  assert.deepEqual(shooEntrances(odd, "kitchen", GANG.biscuit).map(x => x.key), ["front"], "only the front door fits a Chonky cat, though it doesn't work in round 3");
  assert.deepEqual(shooEntrances({ ...odd, entrances: odd.entrances.filter(x => x.key !== "front") }, "kitchen", GANG.biscuit).map(x => x.key), ["window"], "none fits: the nearest");
  // the holder's 6 uses the same choice, and leaves the entrance open (opening it if it was shut)
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, cats: { biscuit: { where: "cellar", status: "held", heldBy: "june" }, mags: "landing" },
    humans: { june: { room: "cellar", holding: "biscuit" }, wendell: { room: "bedroom", asleepUntil: 99 } } });
  w = setOpen(w, { entrance: "flap", open: false }).state;
  r = endRound(w, { d6: dice(6) });
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.match(texts(r.events), /June \(d6 6\) opens the Pom-Pom's microchip cat flap \(jam it open\), puts Big Biscuit out and leaves it open/, "Chonky: not the Tight cellar window");
  assert.equal(entrance(r.state, "flap").open, true);
});

test("2. after a catch: only a carried prize goes back (eaten portions stay eaten; caught by the roll that picked it up counts); the other meter drops to one below the new Patience", () => {
  // not carrying: the prize stays where it lies
  let s = number12({ cats: { biscuit: "hall" }, humans: { pell: "hall" } });
  Object.assign(s.prize, { room: "hall", down: true, stepsLeft: 0 });
  let r = roll(setMood(s, { broom: 3 }).state, "biscuit", "free", "savage", "scrape");
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.deepEqual([r.state.prize.room, r.state.prize.stepsLeft], ["hall", 0], "the prize stays as it is");
  // carrying a part-eaten chicken: back on the counter, every step again, the eaten portions stay eaten
  s = carrying(number12({ humans: { pell: "hall" } }), ["biscuit"], "hall");
  Object.assign(s.prize, { eaten: 2, portionsLeft: 3 });
  r = roll(setMood(s, { broom: 3 }).state, "biscuit", "free", "savage", "scrape");
  assert.deepEqual([r.state.prize.room, r.state.prize.stepsLeft, r.state.prize.eaten, r.state.prize.portionsLeft], ["kitchen", 2, 2, 3]);
  assert.match(texts(r.events), /every step to do again \(the eaten portions stay eaten\)/);
  // the very roll that picked it up: it was carrying it
  s = setMood(number12({ cats: { biscuit: "kitchen" }, humans: { pell: "kitchen" } }), { broom: 3 }).state;
  assert.ok(findOption(s, "biscuit", "take").roll, "picking it up in view is a roll");
  r = roll(s, "biscuit", "take", "savage", "scrape");
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.deepEqual([r.state.prize.carriers, r.state.prize.stepsLeft, r.state.prize.down], [[], 2, false], "put back on the counter");
  // the other meter: Cuddle 3 with Patience dropping 4 → 3 goes to 2 — no Scoop straight after the Shoo!
  s = setMood(number12({ cats: { biscuit: "kitchen", velvet: "kitchen" }, humans: { pell: "kitchen" } }), { broom: 3, cuddle: 3 }).state;
  r = roll(s, "biscuit", "free", "savage", "scrape");
  const f = moodNow(r.state);
  assert.deepEqual([f.broom, f.cuddle, f.patience], [0, 2, 3]);
  assert.equal(cat(r.state, "velvet").status, "free", "no instant chain");
  assert.match(texts(r.events), /Broom empties; Patience drops to 3\. Cuddle drops to 2, one below it/);
});

test("3. full meters: steps beyond full are lost; steps on a full meter that waits are lost; both full and waiting — Broom goes first", () => {
  let s = setMood(number12({ cats: { biscuit: "kitchen" }, humans: { pell: "kitchen" } }), { broom: 3 }).state;
  let r = roll(s, "biscuit", "free", "savage", "flop");
  assert.match(texts(r.events), /Broom \+1 \(4\/4\)[^\n]*\(1 lost: the meter is full\)/);
  // waiting (Mr Pell Distracted): another step is lost
  s = setMood(number12({ cats: { tilly: "kitchen" }, humans: { pell: { room: "kitchen", distractedRound: 3 } } }), { broom: 4 }).state;
  r = manualMood(s, "broom", 1);
  assert.equal(moodNow(r.state).broom, 4);
  assert.match(texts(r.events), /lost: the meter is already full/);
  // both waiting: as the house's turn starts he looks round — Broom first, which drops Cuddle below the new Patience
  s = setMood(s, { broom: 4, cuddle: 4 }).state;
  r = endRound(s, { d6: dice(1) });
  const acts = r.events.filter(x => x.type === "waitingActs").map(x => x.side);
  assert.deepEqual(acts, ["broom"]);
  assert.equal(cat(r.state, "tilly").status, "outside", "Shoo!, not Scooped!");
  assert.deepEqual([moodNow(r.state).cuddle, moodNow(r.state).patience], [2, 3]);
});

test("4. no Cattitude die: the pool ignores it, and the roll dialog doesn't offer it", () => {
  assert.equal(buildRollPlan({ approach: "sneaky", rating: 2, cattitudeDie: true }).total, 2);
  const dialog = readFileSync(new URL("../templates/dialogs/roll-dialog.hbs", import.meta.url), "utf8");
  assert.doesNotMatch(dialog, /cattitudeDie|Cattitude for \+1 die/);
  const code = readFileSync(new URL("../module/dice/roll.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(code, /cattitudeDie/);
  assert.doesNotMatch(readFileSync(new URL("../lang/en.json", import.meta.url), "utf8"), /Cattitude dice/);
});

test("5. a Push paid with the Mood always lands — on a Purrfect too — and a kid doesn't double it", () => {
  let c = arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { velvet: "living" }, humans: { rosalind: "dining", dad: "kitchen", leo: "hall" }, pets: { captain: { mode: "covered" } } });
  assert.equal(rollContext(c, "velvet", "free").kid, true, "Mia is watching");
  let r = roll(c, "velvet", "free", "sweet", "purrfect", { pushedWithMood: true });
  assert.equal(moodNow(r.state).cuddle, 1, "Purrfect: nothing — but the Mood step paid for the Push: 1, not 2");
  r = roll(c, "velvet", "free", "sweet", "scrape", { pushedWithMood: true });
  assert.equal(moodNow(r.state).cuddle, 3, "a Scrape doubled by the kid (2) + the Push's step (1)");
});

test("6. temptation: only a free cat inside; not one that must deal with a pet; a give-in never fills a meter; a seen Knocker leaves no mess; a Lap Cat's fuss is a distraction", () => {
  let s = number12({ cats: { tilly: "hall", velvet: { where: "living", status: "held", heldBy: "pell" } }, humans: { pell: { room: "living", holding: "velvet" } } });
  assert.deepEqual(temptationOptions(s).map(o => o.catId), ["tilly"], "the held cat and the cats outside can't be tempted");
  s = arrange(number12({ cats: { biscuit: "kitchen" } }), { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  assert.deepEqual(temptationOptions(s), [], "Biscuit has to deal with Pudding first");
  assert.ok(temptationOptions(arrange(s, { cats: { biscuit: { dealt: ["pudding"] } } })).some(o => o.catId === "biscuit"), "once it has dealt with him, it can be");
  // Broom one short of full: Curious in view stops one short — no Shoo!
  s = setMood(number12({ cats: { tilly: "hall" }, humans: { pell: "hall" } }), { broom: 3 }).state;
  s = tempt(s, { catId: "tilly", instinct: "curious" }).state;
  let r = answerTemptation(s, { choice: "gaveIn" });
  assert.equal(moodNow(r.state).broom, 3);
  assert.equal(cat(r.state, "tilly").status, "free");
  assert.match(texts(r.events), /giving in never fills a meter: it stops one short/);
  // a kid's +2 fuss with Cuddle at 3 of 6: it stops at 5
  let c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { cats: { velvet: "living" } }), { cuddle: 3 }).state;
  c = tempt(c, { catId: "velvet", instinct: "lapCat" }).state;
  r = answerTemptation(c, { choice: "gaveIn", human: "mia" });
  assert.equal(moodNow(r.state).cuddle, 5);
  assert.equal(cat(r.state, "velvet").status, "free", "no Scoop");
  // the fuss counts as a distraction of Mia: her next Distract costs a die
  assert.equal(human(r.state, "mia").distractions, 1);
  const later = arrange(beginRound(r.state).state, { cats: { tilly: { where: "living", status: "free" } }, humans: { mia: "living" } });
  assert.equal(rollContext(later, "tilly", "distract:mia").options[0].difficulty, 1);
  // a Knocker seen by a human: +1 Broom, no mess; unseen: a mess, no Broom
  s = number12({ cats: { velvet: "living" }, humans: { pell: "living" } });
  r = answerTemptation(tempt(s, { catId: "velvet", instinct: "knocker" }).state, { choice: "gaveIn" });
  assert.deepEqual([moodNow(r.state).broom, r.state.messes], [1, []]);
  s = number12({ cats: { velvet: "living" }, humans: { pell: "loo" } });
  r = answerTemptation(tempt(s, { catId: "velvet", instinct: "knocker" }).state, { choice: "gaveIn" });
  assert.deepEqual([moodNow(r.state).broom, r.state.messes], [0, ["living"]]);
});

test("7. Hunter's Knack is pounce and chase — not fighting animals", () => {
  assert.deepEqual(CATB.instincts.hunter.knack, ["chase"]);
  const s = arrange(number12({ cats: { mags: "kitchen", biscuit: "kitchen" } }), { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  assert.deepEqual(rollContext(s, "mags", "confront:pudding").options.map(o => [o.approach, o.knack]), [["savage", false], ["sneaky", false], ["sweet", false]], "Mags the Hunter: no Knack against the dog");
  assert.equal(rollContext(s, "biscuit", "confront:pudding").options[0].knack, true, "Biscuit the Scrapper: yes");
});

test("8. Distract: if the roll fills Cuddle, the Scoop wins — that human picks the cat up and isn't Distracted", () => {
  let s = setMood(number12({ cats: { velvet: "kitchen", tilly: "kitchen" }, humans: { pell: "kitchen" } }), { cuddle: 3 }).state;
  let r = roll(s, "velvet", "distract:pell", "sweet", "clean");
  assert.equal(cat(r.state, "velvet").status, "held");
  assert.equal(human(r.state, "pell").holding, "velvet");
  assert.notEqual(human(r.state, "pell").distractedRound, 3, "not Distracted");
  assert.equal(human(r.state, "pell").distractions, 0, "and it doesn't count as a distraction");
  assert.match(texts(r.events), /The Scoop wins: Mr Pell picks Velvet up instead, and isn't Distracted/);
  assert.ok(findOption(r.state, "tilly", "hide").roll, "he still sees Tilly");
  // the human it was aimed at picks the cat up, even with a higher Attention watching
  let c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { velvet: "kitchen" }, humans: { dad: "kitchen", rosalind: "kitchen" } }), { cuddle: 5 }).state;
  r = roll(c, "velvet", "distract:dad", "sweet", "scrape");
  assert.equal(human(r.state, "dad").holding, "velvet");
  assert.equal(human(r.state, "rosalind").holding, null);
  // a Distract that doesn't fill Cuddle works as before
  r = roll(setMood(c, { cuddle: 0 }).state, "velvet", "distract:dad", "sweet", "scrape");
  assert.deepEqual([human(r.state, "dad").distractedRound, human(r.state, "dad").distractions], [3, 1]);
});

test("9. noise: not a human staying put (the Clock's, or one who shooed a cat); ties go to the higher Attention, then a die; a mess is found once", () => {
  // a Shoo! in the cake's kitchen: Dad stays by the patio door, so the noise in the hall draws someone else
  let c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { mags: "dining" }, humans: { dad: "dining", rosalind: "living", mia: "living", leo: "loo" }, pets: { captain: { mode: "covered" } } }), { broom: 5 }).state;
  let r = roll(c, "mags", "free", "savage", "clean");
  assert.equal(human(r.state, "dad").shooRound, 3);
  r = endRound(markNoise(r.state, "kitchen").state, { d6: dice(), routines: false });
  assert.equal(human(r.state, "dad").room, "dining", "dining is next to the kitchen, but Dad stays put");
  assert.equal(human(r.state, "rosalind").room, "kitchen", "living → hall → kitchen: Aunt Rosalind (Attention 2) beats Mia (1)");
  // a tie on Attention: a die (1–3 the first in house order, 4–6 the second)
  c = arrange(beginRound(robbery("birthday-cake")).state, { round: 3, humans: { dad: "dining", rosalind: "dining", mia: "living", leo: "living" }, pets: { captain: { mode: "covered" } } });
  r = endRound(markNoise(c, "hall").state, { d6: dice(5), routines: false });
  assert.equal(human(r.state, "rosalind").room, "hall", "Rosalind in the dining room is one room away");
  r = endRound(markNoise(arrange(c, { humans: { rosalind: "loo", dad: "loo" } }), "hall").state, { d6: dice(5), routines: false });
  assert.deepEqual(["dad", "rosalind", "mia", "leo"].map(k => human(r.state, k).room), ["loo", "hall", "living", "living"], "Rosalind again: the higher Attention");
  r = endRound(markNoise(arrange(c, { humans: { rosalind: "kitchen", dad: "kitchen" } }), "utility").state, { d6: dice(5), routines: false });
  assert.equal(human(r.state, "dad").room, "kitchen");
  assert.equal(human(r.state, "rosalind").room, "utility");
  r = endRound(markNoise(arrange(c, { humans: { rosalind: "dining", dad: "kitchen", mia: "kitchen" } }), "utility").state, { d6: dice(5), routines: false });
  assert.deepEqual([human(r.state, "dad").room, human(r.state, "mia").room], ["kitchen", "utility"], "Dad and Mia: tied on Attention 1, a 5 — the second");
  assert.match(texts(r.events), /Mia comes to see the noise in the utility room \(as close as another and tied on Attention: a die, 5\)/);
  // a mess is found once, then cleared
  let s = markNoise(number12({ humans: { pell: "living" } }), "living", { mess: true }).state;
  s.noise = [];
  r = endRound(s, { d6: dice(1) });
  assert.deepEqual([moodNow(r.state).broom, r.state.messes], [1, []]);
  r = endRound(beginRound(r.state).state, { d6: dice(1) });
  assert.equal(moodNow(r.state).broom, 1, "nothing more to find");
});

test("10. Searching: an all-eaten prize isn't inside; a held cat counts as seen for Spotted and for the parrot", () => {
  const base = number12({ humans: { pell: { room: "hall", searching: true } }, cats: { mags: "living" } });
  let r = endRound(base, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "kitchen", "the chicken next door first");
  const eaten = number12({ humans: { pell: { room: "hall", searching: true } }, cats: { mags: "living" } });
  Object.assign(eaten.prize, { eaten: 5, portionsLeft: 0 });
  r = endRound(eaten, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "living", "all eaten: it isn't inside, so he goes for the cat in sight next door");
  // Spotted: Grandpa Wendell, Searching, can see Velvet in June's arms: +1 Broom
  const w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, cats: { velvet: { where: "living", status: "held", heldBy: "june" } },
    humans: { june: { room: "living", holding: "velvet" }, wendell: { room: "living", searching: true } } });
  w.prize = { ...w.prize, withHuman: null, room: "living", spotRoom: "living", spotSteps: [], stepsLeft: 0, down: true };
  r = endRound(w, { d6: dice(6, 1) }); // Wendell stays with the mouse; his doze die 6; June keeps cuddling
  assert.match(texts(r.events), /Grandpa Wendell is Searching and can see Velvet \(held\): \+1 Broom/);
  assert.equal(moodNow(r.state).broom, 1);
  assert.equal(cat(r.state, "velvet").status, "held", "the Broom falls on a free cat he can see, or waits");
  // the parrot squawks at a held cat
  const c = arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { velvet: { where: "dining", status: "held", heldBy: "rosalind" } }, humans: { rosalind: { room: "dining", holding: "velvet" } } });
  r = endRound(c, { d6: dice(1), routines: false });
  assert.ok(r.events.some(e => e.type === "squawk"));
});

test("11. pets: a befriended dog doesn't bark (it still wanders); sniff toward the nearest free cat; the vacuum's die; a Flop chases back only the roller; dozing every house's turn", () => {
  let s = arrange(number12({ cats: { tilly: "kitchen" } }), { pets: { pudding: { mode: "friendly", room: "kitchen" } } });
  let r = endRound(s, { d6: dice(3, 1) });
  assert.ok(!r.events.some(e => e.type === "bark"));
  assert.equal(pet(r.state, "pudding").room, "living", "it still follows its routine (3: the living room)");
  // sniff: toward Mags (free, in the loo), not Velvet (held in the utility room next door)
  s = arrange(number12({ cats: { mags: "loo", velvet: { where: "utility", status: "held", heldBy: "pell" } }, humans: { pell: { room: "utility", holding: "velvet" } } }), { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  r = endRound(s, { d6: dice(6, 1) });
  assert.equal(pet(r.state, "pudding").room, "hall");
  // the robot vacuum: a die between the rooms on its list next to it (Chef Marchetti's hall: kitchen 1–3, living room 4–6)
  let m = arrange(beginRound(robbery("marchetti-salmon")).state, { round: 3, pets: { roomba: "hall" } });
  m.pets = m.pets.filter(p => p.kind === "vacuum");
  r = endRound(m, { d6: dice(5, 1, 1) });
  assert.equal(pet(r.state, "roomba").room, "living");
  assert.deepEqual(pickByDie(["a", "b", "c", "d"], dice(6, 5, 3)), { pick: "c", face: 3 }, "four rooms: a 5 or 6 is rolled again");
  // a Flop dealing with a dog: only the cat who rolled is chased back
  s = arrange(number12({ cats: { tilly: { where: "kitchen", status: "free", cameFrom: "hall" }, velvet: { where: "kitchen", status: "free", cameFrom: "hall" } } }), { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  r = roll(s, "tilly", "confront:pudding", "savage", "flop", { helpers: ["velvet"] });
  assert.deepEqual([cat(r.state, "tilly").where, cat(r.state, "velvet").where], ["hall", "kitchen"]);
  // dozing: Grandpa Wendell answers a noise (no routine) and still rolls his doze die
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, humans: { wendell: "hall", june: "bedroom" } });
  r = endRound(markNoise(w, "living").state, { d6: dice(2, 1) });
  assert.equal(human(r.state, "wendell").room, "living");
  assert.equal(human(r.state, "wendell").asleepUntil, 4, "he nods off in the living room");
  assert.match(texts(r.events), /Grandpa Wendell nods off \(d6 2\)/);
});

test("12. caught: the Den — the human stays in the room next to its door; cats in the room may help a wriggle", () => {
  let s = number12({ cats: { velvet: { where: "living", status: "held", heldBy: "pell" } }, humans: { pell: { room: "living", holding: "velvet" } } });
  let r = endRound(s, { d6: dice(4) });
  assert.equal(cat(r.state, "velvet").status, "shut");
  assert.equal(human(r.state, "pell").room, "hall", "just outside the downstairs loo's door");
  const w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, cats: { velvet: { where: "living", status: "held", heldBy: "june" } }, humans: { june: { room: "living", holding: "velvet" }, wendell: { room: "hall", asleepUntil: 99 } } });
  r = endRound(w, { d6: dice(5) });
  assert.equal(human(r.state, "june").room, "landing");
  // help a wriggle
  s = number12({ cats: { biscuit: { where: "hall", status: "held", heldBy: "pell" }, tilly: "hall" }, humans: { pell: { room: "hall", holding: "biscuit" } } });
  assert.deepEqual(catOptions(s, "tilly").helpTargets.map(t => t.id), ["biscuit"]);
  s = queueHelp(s, "tilly", "biscuit").state;
  const ctx = rollContext(s, "biscuit", "wriggle");
  assert.deepEqual(ctx.helpers.map(h => [h.id, h.queued]), [["tilly", true]]);
  r = roll(s, "biscuit", "wriggle", "savage", "clean", { helpers: ["tilly"] });
  assert.equal(cat(r.state, "biscuit").status, "free");
  assert.equal(cat(r.state, "tilly").acted, true);
});

test("13. the front door: one cat each round it works (the party: rounds 1 and 2); a failed try uses that round's chance; Sweet is plain", () => {
  let c = beginRound(robbery("birthday-cake")).state;
  assert.deepEqual(rollContext(c, "velvet", "enter:front").options.map(o => [o.approach, o.difficulty]), [["sneaky", 2], ["sweet", 0]]);
  let r = roll(c, "velvet", "enter:front", "sweet", "flop");
  assert.equal(cat(r.state, "velvet").status, "outside");
  assert.match(findOption(r.state, "tilly", "enter:front").disabled, /one cat a round/);
  c = beginRound(r.state).state; // round 2: the guests keep coming
  assert.equal(findOption(c, "tilly", "enter:front").disabled, null);
  r = roll(c, "tilly", "enter:front", "sweet", "clean");
  assert.equal(cat(r.state, "tilly").where, "hall");
  assert.match(findOption(r.state, "velvet", "enter:front").disabled, /one cat a round/);
  assert.match(findOption(beginRound(r.state).state, "velvet", "enter:front").disabled, /only in round 1 or 2/);
});

test("14. hauling: the dog takes no dice off a haul out; a failed one there drops the prize where the carriers end up; hauled into a dog's room, they stay; eating is plain", () => {
  let s = carrying(arrange(number12({}), { pets: { pudding: { mode: "awake", room: "kitchen" } } }), ["tilly", "velvet"], "kitchen");
  for (const id of ["tilly", "velvet"]) cat(s, id).cameFrom = "hall";
  assert.equal(rollContext(s, "velvet", "move:hall").opposition, 0);
  let r = roll(s, "velvet", "move:hall", "sneaky", "flop", { helpers: ["tilly"] });
  assert.deepEqual([cat(r.state, "velvet").where, cat(r.state, "tilly").where, r.state.prize.room, r.state.prize.carriers], ["hall", "hall", "hall", []]);
  assert.match(texts(r.events), /drops the rotisserie chicken there, in the hall/);
  // into the dog's room: it used their Actions, so they stay and deal with him first thing next turn
  s = carrying(arrange(number12({}), { pets: { pudding: { mode: "awake", room: "kitchen" } } }), ["tilly", "velvet"], "hall");
  r = roll(s, "velvet", "move:kitchen", "sneaky", "clean", { helpers: ["tilly"] });
  r = endRound(r.state, { d6: dice(1) });
  assert.deepEqual(["tilly", "velvet"].map(id => cat(r.state, id).where), ["kitchen", "kitchen"]);
  const next = beginRound(r.state).state;
  assert.match(findOption(next, "tilly", "eat")?.disabled ?? findOption(next, "tilly", "drop").disabled, /Pudding is in the way/);
  // eating: plain unless the house says
  s = number12({ cats: { biscuit: "kitchen" } });
  assert.deepEqual(rollContext(s, "biscuit", "eat").options.map(o => o.difficulty), [0, 0]);
  s.prize.eatDiff = 1;
  assert.deepEqual(rollContext(s, "biscuit", "eat").options.map(o => o.difficulty), [1, 1]);
});

test("15. the end: at the end of a round with no free cat inside and the prize got or gone (a cat still inside is adopted); the gang going home is the Storyteller's End", () => {
  let s = number12({ cats: { velvet: { where: "living", status: "held", heldBy: "pell" } }, humans: { pell: { room: "living", holding: "velvet" } } });
  s.prize.out = true;
  assert.deepEqual([endCheck(s).due, endCheck(s).reason], [true, "allOut"]);
  assert.match(endCheck(s).text, /got: the robbery ends at the end of the round \(still inside, so adopted: Velvet\)/);
  const end = finishRobbery(s, "allOut");
  assert.deepEqual([end.outcome.result, end.outcome.leftBehind], ["messy", ["velvet"]]);
  s = number12({});
  assert.equal(endCheck(s).due, false, "the prize still to get: cats outside can come back in");
  assert.equal(finishRobbery(s, "manual").outcome.result, "busted", "…unless the gang goes home");
  s = number12({ cats: { mags: "hall" } });
  s.prize.gone = true;
  assert.equal(endCheck(s).due, false, "a free cat is still inside");
});

test("16. gang size: a house's own three- and five-cat numbers, else the general rule", () => {
  const three = ["tilly", "biscuit", "velvet"], five = ["tilly", "biscuit", "velvet", "mags", "pip"];
  const nums = (key, gang) => { const s = robbery(key, gang); return [s.patience0, s.clock.goneAt, s.clock.lightsOut, s.cattitudeStart]; };
  assert.deepEqual(nums("wendell-mouse", ["tilly", "biscuit", "velvet", "mags"]), [8, 9, 11, 2], "v0.9: Patience 8");
  assert.deepEqual(nums("wendell-mouse", three), [10, 11, 13, 3], "Patience +2 here");
  assert.deepEqual(nums("birthday-cake", three), [7, 9, 11, 3], "the Clock moves 1 for three…");
  assert.deepEqual(nums("birthday-cake", five), [5, 9, 11, 2], "…and for five");
  assert.deepEqual(nums("marchetti-salmon", ["tilly", "biscuit", "velvet", "mags"]), [7, 8, 10, 2], "v0.9: Patience 7");
  assert.deepEqual(nums("marchetti-salmon", three), [8, 11, 13, 3], "the salmon 3 rounds later");
  assert.deepEqual(nums("number-12", three), [5, 12, 14, 3], "the general rule");
  assert.deepEqual(nums("okafor-box", five), [6, 13, 15, 2]);
});

test("17. Rep: at 3, 6 and 9 every cat starts each robbery with 1 more Cattitude (never above 5)", () => {
  assert.deepEqual([0, 2, 3, 5, 6, 9, 12].map(repBonus), [0, 0, 1, 1, 2, 3, 3]);
  assert.equal(startingCattitude(3, 9), 5, "never above 5");
  const house = findHouse("number-12");
  const gang = rep => ["tilly", "biscuit", "velvet", "mags"].map((k, i) => ({ ...GANG[k], rep: i === 0 ? rep : 0 }));
  assert.equal(newRobbery(house, { cats: gang(0) }).cattitudeStart, 2);
  assert.equal(newRobbery(house, { cats: gang(3) }).cattitudeStart, 3, "the gang's Rep: a cat who joined later gets it too");
  assert.equal(newRobbery(house, { cats: gang(6) }).cattitudeStart, 4);
  assert.equal(newRobbery(house, { cats: gang(9).slice(0, 3) }).cattitudeStart, 5, "three cats (3) + 3: capped at 5");
  assert.match(newRobbery(house, { cats: gang(6) }).log[0].text, /4 Cattitude each, 2 of it from the gang's Rep/);
});

test("the book's other v0.9 clarifications: no help from outside; meow at any door; a prize put down after its Gone round is gone; tied watchers roll a die", () => {
  // outside isn't a room
  const one = beginRound(robbery("number-12")).state;
  assert.throws(() => queueHelp(one, "tilly", "biscuit"), /outside isn't a room/);
  // meow at any entrance that is a door — not a window — when walking out isn't free
  assert.deepEqual(findHouse("marchetti-salmon").entrances.map(isDoorEntrance), [true, true, false, false]);
  assert.deepEqual(findHouse("okafor-box").entrances.map(isDoorEntrance), [true, true, false, true]);
  let s = number12({ cats: { mags: "utility", tilly: "kitchen" }, humans: { pell: "utility" } });
  s.ways.find(w => w.id === "kitchen~utility").open = true;
  assert.equal(findOption(s, "mags", "meow:flap"), null, "the flap is open and needs no roll: just walk out");
  s = setOpen(s, { entrance: "flap", open: false }).state;
  assert.equal(findOption(s, "mags", "meow:flap").disabled, null, "shut: meow, and Mr Pell lets you out");
  s = setOpen(arrange(s, { humans: { pell: "kitchen" } }), { entrance: "window", open: false }).state;
  assert.equal(findOption(s, "tilly", "meow:window"), null, "never at a window");
  // the chicken held past its Gone round: put down, it's gone
  s = carrying(number12({ cats: {}, humans: { pell: "loo" } }), ["biscuit"], "hall");
  s.round = 10;
  let r = beginRound(arrange(s, { round: 9, stage: "between" }));
  assert.equal(r.state.prize.gone, false, "a cat is holding it");
  r = doAction(r.state, "biscuit", "drop");
  assert.equal(r.state.prize.gone, true);
  assert.match(texts(r.events), /once it's put down it's gone/);
  // two watchers tied on Attention when a meter fills: a die picks who acts
  const c = setMood(arrange(beginRound(robbery("birthday-cake")).state, { round: 3, cats: { mags: "kitchen" }, humans: { dad: "kitchen", mia: "kitchen" }, pets: { captain: { mode: "covered" } } }), { broom: 5 }).state;
  r = roll(c, "mags", "free", "savage", "clean", { ctx: { d6: dice(5) } });
  assert.match(texts(r.events), /Shoo! Mia \(tied on Attention: a die, 5\) grabs the broom/);
  r = roll(c, "mags", "free", "savage", "clean", { ctx: { d6: dice(2) } });
  assert.match(texts(r.events), /Shoo! Dad \(tied on Attention: a die, 2\) grabs the broom/);
});
