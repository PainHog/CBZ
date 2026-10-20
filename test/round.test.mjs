/**
 * module/logic/round.mjs + residents.mjs + prize.mjs — setting up, the Prize
 * Clock, temptation, Shoo!/Scooped!, the house's turn and the outcome.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  beginRound, endRound, tempt, temptationOptions, answerTemptation, moodNow, addMood, undoMood, manualMood, setMood,
  confirmMood, finishRobbery, endCheck, placeCat, placeResident, setOpen, markNoise, clone, roomTemptations
} from "../module/logic/round.mjs";
import { applyRoll, doAction } from "../module/logic/actions.mjs";
import { stepEntry } from "../module/logic/mood.mjs";
import { robbery, dice, arrange, cat, human, pet, texts } from "./fixtures.mjs";

/* ---------------------------------------------------------------- set up -- */

test("a new robbery: cats outside, Patience and Clock scaled for gang size, portions per cat", () => {
  const s4 = robbery("number-12");
  assert.equal(s4.patience0, 4);
  assert.deepEqual(s4.clock, { goneAt: 10, lightsOut: 12 });
  assert.equal(s4.cattitudeStart, 2);
  assert.equal(s4.prize.portions, 5, "1 per cat + 1");
  assert.ok(s4.cats.every(c => c.status === "outside" && c.where === "outside"));
  assert.equal(s4.prize.withHuman, "pell");
  assert.equal(s4.prize.room, "hall", "the prize starts in the human's arms");
  assert.equal(s4.ways.find(w => w.den).id, "hall~loo");
  assert.equal(s4.ways.find(w => w.id === "kitchen~utility").open, false, "the utility door is shut");
  const s3 = robbery("number-12", ["tilly", "biscuit", "velvet"]);
  assert.equal(s3.patience0, 5, "3 cats: Patience +1");
  assert.deepEqual(s3.clock, { goneAt: 12, lightsOut: 14 }, "…the prize goes 2 rounds later");
  assert.equal(s3.cattitudeStart, 3, "…and each cat starts with 3 Cattitude");
  assert.equal(s3.prize.portions, 4);
  const s5 = robbery("number-12", ["tilly", "biscuit", "velvet", "mags", "pip"]);
  assert.equal(s5.patience0, 3, "5 cats: Patience −1");
  assert.deepEqual(s5.clock, { goneAt: 9, lightsOut: 11 }, "…and 1 round sooner");
  assert.equal(robbery("okafor-box", ["tilly", "biscuit", "velvet"]).patience0, 8);
  assert.equal(robbery("okafor-box", ["tilly", "biscuit", "velvet", "mags", "pip"]).patience0, 6);
  assert.equal(robbery("birthday-cake").prize.portions, 8, "a cake is 2 per cat");
  assert.equal(robbery("okafor-box").prize.portions, 0, "a box has no portions");
  assert.equal(pet(robbery("okafor-box"), "noodle").mode, "asleep");
  assert.deepEqual(human(robbery("wendell-mouse"), "wendell").traits, ["dozes"]);
  assert.deepEqual(human(robbery("marchetti-salmon"), "chef").traits, ["busy"]);
  assert.deepEqual(human(robbery("birthday-cake"), "mia").traits, ["kid"]);
});

/* ------------------------------------------------------------ the Clock -- */

test("the Prize Clock puts the prize down at the start of its round; the human stays with it", () => {
  let { state: s, events } = beginRound(robbery("number-12"));
  assert.equal(s.round, 1);
  assert.equal(s.prize.withHuman, "pell");
  assert.equal(events.length, 1);
  s = arrange(s, { humans: { pell: "living" } });
  ({ state: s, events } = beginRound(s));
  assert.equal(s.round, 2);
  assert.equal(s.prize.room, "kitchen");
  assert.equal(s.prize.spotRoom, "kitchen");
  assert.equal(s.prize.stepsLeft, 2);
  assert.equal(s.prize.down, false);
  assert.equal(human(s, "pell").room, "kitchen");
  assert.equal(human(s, "pell").staysRound, 2);
  assert.match(texts(events), /puts the rotisserie chicken in the kitchen and stays there this round, answering no noise \(2 steps/);
});

test("the prize is gone at the start of its Clock's last round — unless the gang is carrying it", () => {
  let s = arrange(robbery("number-12"), { round: 9 });
  s.prize.withHuman = null;
  let r = beginRound(s);
  assert.equal(r.state.prize.gone, true);
  assert.match(texts(r.events), /gone: eaten/);
  s.cats[1].where = "hall"; s.cats[1].status = "free"; s.cats[1].carrying = true; s.prize.carriers = ["biscuit"]; s.prize.spotRoom = "kitchen";
  r = beginRound(s);
  assert.equal(r.state.prize.gone, false);
});

test("the prize not where the Clock left it: the owner goes there, stays, finds it gone (+1 Broom and Searching, once)", () => {
  let s = beginRound(robbery("okafor-box")).state;
  assert.equal(s.prize.spotRoom, "hall");
  s = arrange(s, { round: 4, cats: { tilly: { where: "kitchen", status: "free", carrying: true }, biscuit: { where: "kitchen", status: "free", carrying: true } }, humans: { mum: "living" } });
  s.prize.carriers = ["tilly", "biscuit"]; s.prize.room = "kitchen";
  const { state, events } = beginRound(s);
  const mum = human(state, "mum");
  assert.equal(mum.room, "hall");
  assert.equal(mum.searching, true);
  assert.equal(mum.staysRound, 5);
  assert.equal(moodNow(state).broom, 1);
  assert.equal(state.prize.room, "kitchen", "the prize stays with the carriers");
  assert.match(texts(events), /finds it gone: \+1 Broom/);
  // dropped in another room (not carried) counts too; a human already Searching adds nothing more
  let d = beginRound(robbery("okafor-box")).state;
  d = arrange(d, { round: 4, humans: { mum: { room: "living", searching: true } } });
  d.prize.room = "kitchen"; d.prize.down = true;
  const r2 = beginRound(d);
  assert.equal(human(r2.state, "mum").room, "hall");
  assert.equal(moodNow(r2.state).broom, 0, "already Searching: no new Broom");
  assert.equal(r2.state.prize.room, "kitchen");
});

/* ------------------------------------------------------------ temptation -- */

test("temptation: free cats in a room with one of their instincts' temptations, one per round, never twice", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { tilly: "kitchen", velvet: "living", mags: "hall" } });
  const opts = temptationOptions(s);
  assert.deepEqual(opts.map(o => `${o.catId}:${o.instinct}`).sort(), ["tilly:climber", "velvet:knocker", "velvet:lapCat"]);
  s = tempt(s, { catId: "tilly", instinct: "climber" }).state;
  assert.deepEqual(temptationOptions(s), [], "only one cat per round");
  s = answerTemptation(s, { choice: "resisted", cattitude: 2 }).state;
  s = beginRound(s).state;
  assert.ok(!temptationOptions(s).some(o => o.catId === "tilly"), "v0.7: never the same cat two rounds running");
  assert.ok(temptationOptions(beginRound(s).state).some(o => o.catId === "tilly" && o.instinct === "climber"), "…but the round after, the same thing may tempt her again");
  s.cats.find(c => c.id === "velvet").moved = true;
  assert.ok(!temptationOptions(s).some(o => o.catId === "velvet"), "a cat that already moved can't be tempted this round");
  assert.throws(() => tempt(s, { catId: "biscuit" }));
  const w = arrange(beginRound(robbery("wendell-mouse")).state, { cats: { mags: "hall" }, pets: { roomba: "hall" } });
  assert.ok(roomTemptations(w, "hall").includes("hunter"), "the robot vacuum tempts Hunters");
  assert.ok(temptationOptions(w).some(o => o.catId === "mags" && o.instinct === "hunter"));
  const fresh = arrange(beginRound(robbery("number-12")).state, { cats: { tilly: "kitchen" } });
  const pick = tempt(fresh, 1);
  assert.equal(pick.temptation.catId, "tilly", "a d6 picks at random among the eligible");
});

test("resisting costs 1 Cattitude; with none the cat must give in; giving in pays 1 and uses the Action", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { mags: "living" }, humans: { pell: "kitchen" } });
  s = tempt(s, { catId: "mags", instinct: "boxSitter" }).state;
  let r = answerTemptation(s, { choice: "resisted", cattitude: 1 });
  assert.deepEqual(r.cattitude, [{ catId: "mags", delta: -1, why: "resisted a temptation" }]);
  assert.equal(cat(r.state, "mags").acted, false);
  r = answerTemptation(s, { choice: "resisted", cattitude: 0 });
  assert.equal(r.cattitude[0].delta, 1);
  assert.equal(r.state.temptation.choice, "gaveIn");
  assert.match(texts(r.events), /no Cattitude left/);
  assert.equal(cat(r.state, "mags").acted, true);
  assert.equal(cat(r.state, "mags").hidden, true, "a Box Sitter gets in: hidden");
  assert.throws(() => answerTemptation(r.state, { choice: "gaveIn" }), /No temptation/);
});

/** Give in to `instinct` with cat `id` in `room`, Mr Pell watching (or not). */
function giveIn(id, instinct, room, { watch = true, house = "number-12", setup = {} } = {}) {
  let s = arrange(beginRound(robbery(house)).state, { cats: { [id]: room }, humans: house === "number-12" ? { pell: watch ? room : "loo" } : {}, ...setup });
  s.rooms[room].tempt = [instinct];
  s = tempt(s, { catId: id, instinct }).state;
  return answerTemptation(s, { choice: "gaveIn" });
}

test("giving in, instinct by instinct (Ch 7 table)", () => {
  let r = giveIn("tilly", "curious", "hall");
  assert.deepEqual(r.state.noise.map(n => n.room), ["hall"]);
  assert.equal(moodNow(r.state).broom, 1, "Curious in view: +1 Broom");
  r = giveIn("tilly", "curious", "hall", { watch: false });
  assert.equal(moodNow(r.state).broom, 0, "unseen: noise only");
  r = giveIn("velvet", "knocker", "living");
  assert.deepEqual(r.state.messes, ["living"], "a Knocker leaves a mess");
  assert.equal(moodNow(r.state).broom, 1);
  r = giveIn("mags", "hunter", "hall");
  assert.equal(r.state.noise.length, 1);
  assert.equal(moodNow(r.state).broom, 0, "chasing a fly looks innocent");
  r = giveIn("biscuit", "foodie", "kitchen");
  assert.equal(r.state.noise.length, 0, "Foodie is quiet");
  assert.equal(moodNow(r.state).broom, 1);
  r = giveIn("tilly", "climber", "kitchen");
  assert.equal(cat(r.state, "tilly").hidden, true);
  assert.equal(moodNow(r.state).broom, 0);
  r = giveIn("biscuit", "scrapper", "kitchen");
  assert.equal(pet(r.state, "pudding").mode, "awake", "v0.6: squaring up is noise, nothing more");
  assert.equal(moodNow(r.state).broom, 1);
  assert.equal(r.state.noise.length, 1);
});

test("any room with an awake dog or house cat tempts Scrappers (v0.6)", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: "kitchen" } });
  s.rooms.kitchen.tempt = [];
  assert.ok(roomTemptations(s, "kitchen").includes("scrapper"));
  assert.ok(temptationOptions(s).some(o => o.catId === "biscuit" && o.instinct === "scrapper"));
  s = arrange(s, { pets: { pudding: { mode: "asleep" } } });
  assert.ok(!roomTemptations(s, "kitchen").includes("scrapper"), "a sleeping dog doesn't");
  const w = beginRound(robbery("wendell-mouse")).state;
  assert.ok(roomTemptations(w, "living").includes("scrapper"), "Pom-Pom guards the living room");
});

test("Lap Cat: its player picks a human there — Distracted until the house's turn, +1 Cuddle (2 for a kid); nobody, a sunny spot", () => {
  let r = giveIn("velvet", "lapCat", "living");
  assert.equal(human(r.state, "pell").distractedRound, 1);
  assert.equal(moodNow(r.state).cuddle, 1);
  assert.match(texts(r.events), /gives Velvet a fuss/);
  let c = arrange(beginRound(robbery("birthday-cake")).state, { cats: { velvet: "living" } });
  c = tempt(c, { catId: "velvet", instinct: "lapCat" }).state;
  const kid = answerTemptation(c, { choice: "gaveIn", human: "leo" });
  assert.equal(human(kid.state, "leo").distractedRound, 1, "the player picked Leo");
  assert.equal(human(kid.state, "mia").distractedRound, -1);
  assert.equal(moodNow(kid.state).cuddle, 2, "a kid: 2 Cuddle");
  r = giveIn("velvet", "lapCat", "living", { watch: false });
  assert.equal(moodNow(r.state).cuddle, 0);
  assert.match(texts(r.events), /sunny spot/);
});

test("giving in while carrying drops the prize where the cat is", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: { where: "hall", status: "free", carrying: true } }, humans: { pell: "loo" } });
  s.prize = { ...s.prize, withHuman: null, spotRoom: "kitchen", room: "hall", carriers: ["biscuit"], down: true };
  s.rooms.hall.tempt = ["foodie"];
  s = tempt(s, { catId: "biscuit", instinct: "foodie" }).state;
  const r = answerTemptation(s, { choice: "gaveIn" });
  assert.equal(r.state.prize.carriers.length, 0);
  assert.equal(r.state.prize.room, "hall");
  assert.equal(cat(r.state, "biscuit").carrying, false);
});

/* ----------------------------------------------------- Shoo! / Scooped! -- */

const seenRoll = (s, id, approach, result, eventId) => applyRoll(s, {
  eventId, catId: id, optionId: "free", approach, result, seen: true,
  seenBy: s.humans.filter(h => h.room === cat(s, id).where).map(h => h.key), kid: false
});

test("Shoo!: Broom fills, the watcher chases that cat out of the nearest entrance and shuts it; Patience −1", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: "kitchen" }, humans: { pell: "kitchen" } });
  s = setMood(s, { broom: 3 }).state;
  const r = seenRoll(s, "biscuit", "savage", "scrape", "e1");
  const c = cat(r.state, "biscuit");
  assert.equal(c.status, "outside");
  assert.equal(r.state.entrances.find(e => e.key === "window").open, false, "the kitchen window is the nearest entrance: shut");
  const f = moodNow(r.state);
  assert.deepEqual([f.broom, f.patience], [0, 3]);
  assert.match(texts(r.events), /Shoo! Mr Pell grabs the broom and chases Big Biscuit out through the Open kitchen window/);
  // undo puts everything back
  const u = undoMood(r.state).state;
  assert.equal(cat(u, "biscuit").status, "free");
  assert.equal(u.entrances.find(e => e.key === "window").open, true);
  assert.equal(moodNow(u).broom, 4, "the roll's step is still there");
});

test("Scooped!: Cuddle fills, the watcher picks the cat up (Held) and the carried prize goes back", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { velvet: { where: "hall", status: "free" }, tilly: { where: "hall", status: "free", carrying: true } }, humans: { pell: "hall" } });
  s.prize = { ...s.prize, withHuman: null, spotRoom: "kitchen", spotSteps: [[["sneaky", 1]]], stepsLeft: 0, room: "hall", carriers: ["tilly"], down: true };
  s = setMood(s, { cuddle: 3 }).state;
  let r = seenRoll(s, "velvet", "sweet", "clean", "e2");
  assert.equal(cat(r.state, "velvet").status, "held");
  assert.equal(human(r.state, "pell").holding, "velvet");
  assert.equal(r.state.prize.carriers.length, 1, "Tilly still has it: Velvet wasn't carrying");
  s = setMood(s, { broom: 3 }).state;
  r = seenRoll(s, "tilly", "savage", "scrape", "e3");
  assert.equal(r.state.prize.room, "kitchen", "the human puts it back where it was");
  assert.equal(r.state.prize.stepsLeft, 1, "…and its steps start over");
  assert.equal(cat(r.state, "tilly").carrying, false);
});

test("a meter that fills with no cat in sight stays full until a human with free hands can see one — who acts at once (v0.8)", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: "hall" }, humans: { pell: "loo" } });
  s = setMood(s, { broom: 3 }).state;
  const ev = [];
  addMood(s, stepEntry({ side: "broom", steps: 1, cause: "mess" }), ev);
  assert.equal(moodNow(s).full.broom, true);
  assert.match(texts(ev), /stays full/);
  assert.equal(cat(s, "biscuit").status, "free");
  // an unseen Push paid with the Mood: still nobody watching
  let r = applyRoll(s, { eventId: "e6", catId: "biscuit", optionId: "free", approach: "savage", result: "clean", seen: false, seenBy: [], pushedWithMood: true });
  assert.equal(cat(r.state, "biscuit").status, "free");
  // Big Biscuit walks into the loo, where Mr Pell is: he can see a cat, and acts at once
  r = doAction(s, "biscuit", "move:loo");
  assert.equal(cat(r.state, "biscuit").status, "outside");
  assert.match(texts(r.events), /Broom was waiting full: Mr Pell can see Big Biscuit and acts at once/);
  assert.equal(moodNow(r.state).broom, 0);
});

test("autoMood confirm: entries wait for the Storyteller; manual: nothing is written", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { biscuit: "hall" }, humans: { pell: "hall" } });
  let r = applyRoll(s, { eventId: "c1", catId: "biscuit", optionId: "free", approach: "savage", result: "flop", seen: true, seenBy: ["pell"] }, { mood: "confirm" });
  assert.equal(moodNow(r.state).broom, 0);
  const id = r.state.moodLedger[0].id;
  assert.equal(moodNow(confirmMood(r.state, id).state).broom, 2);
  assert.equal(moodNow(confirmMood(r.state, id, { accept: false }).state).broom, 0);
  r = applyRoll(s, { eventId: "c2", catId: "biscuit", optionId: "free", approach: "savage", result: "flop", seen: true, seenBy: ["pell"] }, { mood: "manual" });
  assert.equal(r.state.moodLedger.length, 0);
  assert.equal(moodNow(manualMood(s, "cuddle", 2).state).cuddle, 2);
});

/* ------------------------------------------------------- the house's turn -- */

test("noise: the closest awake human within two rooms who isn't already there; one each; ties by house order", () => {
  let s = arrange(beginRound(robbery("birthday-cake")).state, { round: 3 });
  s.noise = [{ room: "utility" }, { room: "hall" }, { room: "loo" }];
  s.pets[0].mode = "covered";
  const d = dice(1, 1, 1, 1);
  const { state, events } = endRound(s, { d6: d, routines: false });
  assert.equal(human(state, "dad").room, "utility", "Dad (kitchen) is 1 away from the utility room");
  assert.equal(human(state, "rosalind").room, "hall", "a tie at 1 room: the first in house order");
  assert.equal(human(state, "mia").room, "loo");
  assert.equal(human(state, "leo").room, "living");
  assert.match(texts(events), /Aunt Rosalind comes to see the noise in the hall \(a tie/);
});

test("noise: busy and headphones never answer, asleep humans don't hear, holders don't come; beyond 2 rooms nobody", () => {
  let s = arrange(beginRound(robbery("marchetti-salmon")).state, { round: 3, humans: { sam: "hall" }, pets: { brutus: { mode: "hiding", until: 99 } } });
  s.noise = [{ room: "utility" }];
  let r = endRound(s, { d6: dice(1, 1), routines: false });
  assert.equal(human(r.state, "chef").room, "kitchen", "Chef Marchetti is busy");
  assert.equal(human(r.state, "sam").room, "utility");
  s = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, humans: { wendell: { room: "living", asleepUntil: 3 }, june: "bedroom" } });
  s.noise = [{ room: "hall" }];
  r = endRound(s, { d6: dice(1, 1, 1), routines: false });
  assert.equal(human(r.state, "wendell").room, "living", "asleep: hears nothing");
  assert.equal(human(r.state, "june").room, "hall", "bedroom → landing → hall: 2 rooms");
  s = arrange(s, { humans: { june: "bathroom" } });
  s.noise = [{ room: "kitchen" }];
  r = endRound(s, { d6: dice(1, 1, 1), routines: false });
  assert.match(texts(r.events), /Nobody comes/);
});

test("a noise made on purpose leaves a mess: the human who comes finds it, +1 Broom", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: "hall" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  s = markNoise(s, "living", { mess: true }).state;
  const r = endRound(s, { d6: dice(), routines: false });
  assert.equal(human(r.state, "pell").room, "living");
  assert.equal(moodNow(r.state).broom, 1);
  assert.deepEqual(r.state.messes, []);
});

test("routines: a d6 for every human who didn't answer a noise; the prize's human stays; dozing", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: "hall" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  let r = endRound(s, { d6: dice(3) });
  assert.equal(human(r.state, "pell").room, "kitchen");
  assert.match(texts(r.events), /Mr Pell \(d6 3\) → kitchen/);
  s = arrange(s, { humans: { pell: { staysRound: 3 } } });
  r = endRound(s, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "hall");
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 2, pets: { roomba: { mode: "hiding", until: 99 } } });
  w.pets = w.pets.filter(p => p.kind !== "vacuum");
  r = endRound(w, { d6: dice(5, 2, 1) });
  assert.equal(human(r.state, "wendell").room, "living");
  assert.equal(human(r.state, "wendell").asleepUntil, 3, "1–2 on the extra d6: asleep until the end of next round");
  assert.equal(human(r.state, "june").room, "kitchen");
});

test("Searching: stay with a cat in sight, else step into a next room with one (carriers first), else the routine", () => {
  const base = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: { room: "hall", searching: true } }, pets: { pudding: { mode: "hiding", until: 99 } } });
  let s = arrange(base, { cats: { mags: "hall" } });
  let r = endRound(s, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "hall");
  s = arrange(base, { cats: { mags: { where: "hall", status: "free", hidden: true }, tilly: "living", biscuit: { where: "kitchen", status: "free", carrying: true } } });
  s.prize.carriers = ["biscuit"]; s.prize.withHuman = null; s.prize.room = "kitchen"; s.prize.spotRoom = "living";
  r = endRound(s, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "kitchen", "walks past the hidden cat, to the carrier");
  s = arrange(base, { cats: { tilly: "living", velvet: "kitchen" } });
  r = endRound(s, { d6: dice(2) });
  assert.equal(human(r.state, "pell").room, "kitchen", "two rooms with cats: the Storyteller's pick (d6)");
  s = arrange(base, {});
  r = endRound(s, { d6: dice(5) });
  assert.equal(human(r.state, "pell").room, "living", "nobody in sight: the routine");
});

test("Finding it: everyone awake beside a disturbed prize (or where the Clock put it) finds it: +1 Broom once, and Searching", () => {
  const base = arrange(beginRound(robbery("birthday-cake")).state, { round: 3, humans: { dad: "kitchen", rosalind: "living", mia: "living", leo: "loo" }, pets: { captain: { mode: "covered" } } });
  base.prize = { ...base.prize, withHuman: null, room: "kitchen", spotRoom: "kitchen", spotSteps: [[["sneaky", 1]], [["streetwise", 1]]], stepsLeft: 1, down: false };
  let r = endRound(base, { d6: dice(), routines: false });
  assert.equal(human(r.state, "dad").searching, true, "Dad stood by it the whole time and still notices");
  assert.equal(moodNow(r.state).broom, 1);
  assert.match(texts(r.events), /Dad finds the birthday cake disturbed/);
  r = endRound(arrange(base, { humans: { rosalind: "kitchen" } }), { d6: dice(), routines: false });
  assert.equal(moodNow(r.state).broom, 1, "two of them: +1 Broom once");
  assert.ok(human(r.state, "rosalind").searching && human(r.state, "dad").searching);
  const carried = arrange(base, { cats: { tilly: { where: "hall", status: "free", carrying: true } } });
  carried.prize = { ...carried.prize, room: "hall", carriers: ["tilly"], stepsLeft: 0, down: true };
  r = endRound(carried, { d6: dice(), routines: false });
  assert.equal(human(r.state, "dad").searching, true, "in the room where the Clock put it: finds it gone");
  const quiet = arrange(base, {});
  quiet.prize.stepsLeft = 2;
  r = endRound(quiet, { d6: dice(), routines: false });
  assert.equal(moodNow(r.state).broom, 0, "nothing done to it: not disturbed");
  const asleep = arrange(beginRound(robbery("wendell-mouse")).state, { round: 3, humans: { wendell: { room: "hall", asleepUntil: 3 }, june: "bedroom" } });
  asleep.pets = [];
  asleep.prize = { ...asleep.prize, withHuman: null, room: "hall", spotRoom: "hall", spotSteps: [[["sneaky", 1]]], stepsLeft: 0, down: true };
  r = endRound(asleep, { d6: dice(), routines: false });
  assert.equal(human(r.state, "wendell").searching, false, "asleep: notices nothing");
});

test("Finding it: a Searching human who can see a cat: +1 Broom once a round; hidden cats aren't seen", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, cats: { mags: "living", tilly: "living" }, humans: { pell: { room: "living", searching: true } }, pets: { pudding: { mode: "hiding", until: 99 } } });
  let r = endRound(s, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "living", "stays with a cat in sight");
  assert.equal(moodNow(r.state).broom, 1, "two cats in sight: still +1 once");
  assert.match(texts(r.events), /is Searching and can see/);
  s = arrange(s, { cats: { mags: { hidden: true }, tilly: { hidden: true } } });
  r = endRound(s, { d6: dice(1) });
  assert.equal(moodNow(r.state).broom, 0);
});

test("messes wait until a human ends the house's turn in that room: +1 Broom, and it's cleared", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: "loo" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  s.messes = ["living"];
  let r = endRound(s, { d6: dice(1) });
  assert.deepEqual(r.state.messes, ["living"], "nobody came: the mess is still there");
  r = beginRound(r.state);
  assert.deepEqual(r.state.messes, ["living"], "it lasts into the next round");
  const k = arrange(r.state, { humans: { pell: "living" } });
  r = endRound(k, { d6: dice(1) });
  assert.deepEqual(r.state.messes, []);
  assert.equal(moodNow(r.state).broom, 1);
  assert.match(texts(r.events), /finds the mess in the living room/);
});

test("Searching goes for the prize first: stays with it, or steps into its room next door", () => {
  const base = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: { room: "living", searching: true } }, cats: { mags: "living" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  base.prize = { ...base.prize, withHuman: null, room: "hall", spotRoom: "kitchen", down: true };
  let r = endRound(base, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "hall", "the prize next door beats the cat in sight");
  base.prize.room = "living";
  r = endRound(base, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "living");
});

test("a distraction lasts until the house's turn: the human then answers noise as usual", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, humans: { pell: { room: "hall", distractedRound: 3 } }, pets: { pudding: { mode: "hiding", until: 99 } } });
  s.noise = [{ room: "living" }];
  const r = endRound(s, { d6: dice() });
  assert.equal(human(r.state, "pell").room, "living");
});

test("pets: a sleeping dog wakes on noise in its room or next door; an awake dog barks at a cat in its room", () => {
  let s = arrange(beginRound(robbery("okafor-box")).state, { round: 2, humans: { mum: "kitchen", tayo: "kidsroom" } });
  s.noise = [{ room: "landing" }];
  let r = endRound(s, { d6: dice(1, 1, 1), routines: true });
  assert.equal(pet(r.state, "noodle").mode, "asleep", "the landing is two rooms from the kitchen");
  s.noise = [{ room: "hall" }];
  r = endRound(s, { d6: dice(4, 1, 1) });
  assert.equal(pet(r.state, "noodle").mode, "awake");
  assert.equal(pet(r.state, "noodle").room, "garage", "then follows its routine (4: garage)");
  s = arrange(beginRound(robbery("number-12")).state, { round: 3, cats: { tilly: { where: "kitchen", status: "free", hidden: true, slipped: ["pudding"] } }, humans: { pell: "living" } });
  r = endRound(s, { d6: dice(1) });
  assert.equal(pet(r.state, "pudding").room, "kitchen", "it barks and stays");
  assert.match(texts(r.events), /Pudding barks/);
  assert.equal(human(r.state, "pell").room, "kitchen", "the bark draws Mr Pell");
});

test("pets: sniff goes one room toward the nearest cat; the vacuum wanders and carries its rider; the parrot squawks", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 3, cats: { mags: "living" }, humans: { pell: "loo" } });
  let r = endRound(s, { d6: dice(6, 1) });
  assert.equal(pet(r.state, "pudding").room, "hall", "kitchen → hall, toward the living room");
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { round: 2, cats: { mags: { where: "living", status: "free", riding: "roomba", hidden: true } } });
  w.pets = w.pets.filter(p => p.kind === "vacuum");
  r = endRound(w, { d6: dice(1, 1, 3, 1), routines: true });
  assert.equal(pet(r.state, "roomba").room, "hall");
  assert.equal(cat(r.state, "mags").where, "hall");
  let c = arrange(beginRound(robbery("birthday-cake")).state, { round: 2, cats: { velvet: "dining" } });
  r = endRound(c, { d6: dice(1, 1, 1, 1, 1), routines: false });
  assert.match(texts(r.events), /squawks/);
  c = arrange(c, { cats: { velvet: { where: "dining", status: "free", hidden: true } } });
  assert.doesNotMatch(texts(endRound(c, { d6: dice(), routines: false }).events), /squawks/);
  c = arrange(c, { cats: { velvet: { hidden: false } }, pets: { captain: { mode: "covered" } } });
  assert.doesNotMatch(texts(endRound(c, { d6: dice(), routines: false }).events), /squawks/);
});

test("holders roll a d6: keep, the Den (its door shut), or outside; driven-off pets come back after 3 rounds", () => {
  const base = arrange(beginRound(robbery("number-12")).state, { round: 3, cats: { velvet: { where: "hall", status: "held", heldBy: "pell" } }, humans: { pell: { room: "hall", holding: "velvet" } }, pets: { pudding: { mode: "hiding", until: 99 } } });
  let r = endRound(base, { d6: dice(2) });
  assert.equal(cat(r.state, "velvet").status, "held");
  r = endRound(base, { d6: dice(4) });
  assert.equal(cat(r.state, "velvet").status, "shut");
  assert.equal(cat(r.state, "velvet").where, "loo");
  assert.equal(r.state.ways.find(w => w.den).open, false);
  assert.ok(r.state.ways.find(w => w.den).opts.length, "the Den door can be opened");
  assert.equal(human(r.state, "pell").holding, null);
  r = endRound(base, { d6: dice(6) });
  assert.equal(cat(r.state, "velvet").status, "outside");
  const back = arrange(base, { pets: { pudding: { mode: "hiding", until: 3, room: "kitchen" } } });
  r = endRound(back, { d6: dice(2) });
  assert.equal(pet(r.state, "pudding").mode, "awake");
});

/* ------------------------------------------------------------ the end -- */

test("the end: Lights Out at the end of the second round after the prize goes; or when no free cat is inside", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 12, humans: { pell: "loo" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  let r = endRound(s, { d6: dice(1) });
  assert.deepEqual([r.end.due, r.end.reason], [true, "lightsOut"]);
  s = arrange(s, { round: 4 });
  assert.equal(endCheck(s).due, false, "everyone outside but the prize is still to get: they can come back in");
  s.prize.gone = true;
  assert.deepEqual(endCheck(s), { due: true, reason: "allOut", text: "No free cat is inside: the robbery is over." });
  s = arrange(s, { cats: { tilly: "hall" } });
  assert.equal(endCheck(s).due, false);
});

test("the outcome: Clean, Messy (left behind, or half the food eaten) or Busted", () => {
  let s = robbery("number-12");
  s.prize.out = true;
  assert.equal(finishRobbery(s).outcome.result, "clean");
  s.cats[0].status = "held"; s.cats[0].where = "hall";
  let o = finishRobbery(s).outcome;
  assert.equal(o.result, "messy");
  assert.deepEqual(o.leftBehind, ["tilly"]);
  s = robbery("birthday-cake");
  s.prize.eaten = 4; s.prize.portionsLeft = 4;
  assert.equal(finishRobbery(s).outcome.result, "messy", "half the cake eaten");
  s.prize.eaten = 3;
  assert.equal(finishRobbery(s).outcome.result, "busted");
  s.prize.eaten = 8; s.prize.portionsLeft = 0;
  o = finishRobbery(s);
  assert.equal(o.outcome.result, "clean", "every portion eaten is the prize got");
  assert.equal(o.state.phase, "ended");
  assert.throws(() => beginRound(o.state));
});

test("the Storyteller's hands: place a cat or resident, open and shut ways and entrances", () => {
  let s = beginRound(robbery("number-12")).state;
  s = placeCat(s, "tilly", "kitchen").state;
  assert.equal(cat(s, "tilly").status, "free");
  s = placeResident(s, "pell", "living").state;
  assert.equal(human(s, "pell").room, "living");
  s = setOpen(s, { way: "kitchen~utility", open: true }).state;
  assert.equal(s.ways.find(w => w.id === "kitchen~utility").open, true);
  s = setOpen(s, { entrance: "flap", open: false }).state;
  assert.equal(s.entrances.find(e => e.key === "flap").open, false);
  s = placeCat(s, "tilly", "outside").state;
  assert.equal(cat(s, "tilly").status, "outside");
  assert.throws(() => placeCat(s, "tilly", "attic"));
  assert.throws(() => placeResident(s, "nobody", "hall"));
  assert.throws(() => endRound(s, {}), /d6/);
  assert.ok(clone(s) !== s);
});
