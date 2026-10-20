/**
 * module/logic/actions.mjs — a cat's turn: what it can do, what needs a roll,
 * and what each result does (Ch 4–10).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { catOptions, rollContext, doAction, applyRoll, queueHelp, eligibleHelpers, findOption, markTurn } from "../module/logic/actions.mjs";
import { beginRound, moodNow } from "../module/logic/round.mjs";
import { robbery, arrange, cat, human, pet, texts } from "./fixtures.mjs";

const opt = (s, id, optionId) => findOption(s, id, optionId);
let n = 0;
/** Apply a final roll for an option, as the GM client would from a roll card. */
function roll(s, id, optionId, approach, result, extra = {}) {
  const ctx = rollContext(s, id, optionId);
  return applyRoll(s, { eventId: `ev${++n}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, ...extra }, extra.ctx ?? {});
}
/** Number 12 in round 3, the chicken down on the kitchen counter, Pudding out of the way. */
function kitchen12(extra = {}) {
  const s = arrange(beginRound(robbery("number-12")).state, { round: 3, pets: { pudding: { mode: "hiding", until: 99 } }, humans: { pell: "living" }, ...extra });
  s.prize = { ...s.prize, withHuman: null, room: "kitchen", spotRoom: "kitchen", spotSteps: [[["sneaky", 1, "climb"], ["savage", 1, "climb"]], [["streetwise", 1, "open"], ["savage", 1, "fight"]]], stepsLeft: 0, down: true };
  return s;
}

/* -------------------------------------------------------------- getting in -- */

test("getting in: the front door works in its rounds, in view of the human, and lets in one cat", () => {
  let s = beginRound(robbery("number-12")).state;
  const front = opt(s, "velvet", "enter:front");
  assert.deepEqual(front.uses, ["move", "action"]);
  assert.equal(front.disabled, null);
  const ctx = rollContext(s, "velvet", "enter:front");
  assert.deepEqual(ctx.seenNames, ["Mr Pell"]);
  assert.deepEqual(ctx.options.map(o => [o.approach, o.difficulty, o.knack, o.attention]), [["sneaky", 2, false, 1], ["sweet", 0, true, 1]]);
  const r = roll(s, "velvet", "enter:front", "sweet", "flop");
  assert.equal(cat(r.state, "velvet").status, "outside");
  assert.equal(cat(r.state, "velvet").moved, true);
  assert.equal(r.state.entrances.find(e => e.key === "front").open, false, "it shuts after one cat tries");
  assert.match(opt(r.state, "biscuit", "enter:front").disabled, /shut/);
  assert.equal(moodNow(r.state).cuddle, 2, "a seen Flop: 2 on the fuller meter (its own when level)");
  s = beginRound(beginRound(robbery("number-12")).state).state;
  assert.match(opt(s, "velvet", "enter:front").disabled, /only in round 1/);
});

test("getting in: a free way needs no roll (a noisy flap clacks); a climb is a roll, made in view of the room", () => {
  let s = beginRound(robbery("number-12")).state;
  const flap = doAction(s, "mags", "enter:flap");
  assert.equal(cat(flap.state, "mags").where, "utility");
  assert.deepEqual(flap.state.noise.map(x => x.room), ["utility"]);
  assert.throws(() => doAction(s, "tilly", "enter:window"), /needs a roll/);
  const r = roll(s, "tilly", "enter:window", "sneaky", "scrape");
  assert.equal(cat(r.state, "tilly").where, "kitchen");
  assert.deepEqual(r.state.noise.map(x => x.room), ["kitchen"], "a Scrape's noise is in the room it was made in");
  assert.throws(() => doAction(flap.state, "mags", "enter:flap"), /can't do that now/);
});

test("getting in: Tight is for Lean cats; a jammed cat flap stays open for everyone", () => {
  let s = beginRound(robbery("wendell-mouse")).state;
  assert.match(opt(s, "biscuit", "enter:cellarwin").disabled, /too tight/);
  assert.equal(opt(s, "tilly", "enter:cellarwin").disabled, null);
  const r = roll(s, "tilly", "enter:flap", "streetwise", "clean");
  assert.equal(cat(r.state, "tilly").where, "kitchen");
  assert.equal(opt(r.state, "mags", "enter:flap").roll, null, "jammed: no roll now");
});

test("getting in together: the leader rolls, helpers add dice and come too", () => {
  let s = beginRound(robbery("number-12")).state;
  s = queueHelp(s, "biscuit", "tilly").state;
  const ctx = rollContext(s, "tilly", "enter:window");
  assert.deepEqual(ctx.helpers.map(h => [h.id, h.queued]), [["biscuit", true], ["velvet", false], ["mags", false]]);
  const r = roll(s, "tilly", "enter:window", "sneaky", "clean", { helpers: ["biscuit"] });
  assert.equal(cat(r.state, "biscuit").where, "kitchen");
  assert.equal(cat(r.state, "biscuit").acted, true);
  assert.deepEqual(r.state.help, {});
});

/* ----------------------------------------------------------- in the house -- */

test("moving: next room through an open way; a shut door is opened with an Action", () => {
  let s = kitchen12({ cats: { tilly: "kitchen" } });
  assert.equal(opt(s, "tilly", "move:hall").disabled, null);
  assert.match(opt(s, "tilly", "move:utility").disabled, /shut/);
  const door = opt(s, "tilly", "open:kitchen~utility");
  assert.deepEqual(door.roll.options, [["streetwise", 1, "open"], ["savage", 2]]);
  const r = roll(s, "tilly", "open:kitchen~utility", "streetwise", "clean");
  assert.equal(r.state.ways.find(w => w.id === "kitchen~utility").open, true);
  const m = doAction(r.state, "tilly", "move:utility");
  assert.equal(cat(m.state, "tilly").where, "utility");
  assert.match(opt(m.state, "tilly", "move:kitchen").disabled, /already moved/);
  assert.throws(() => doAction(m.state, "tilly", "move:kitchen"), /already moved/);
  assert.equal(markTurn(m.state, "tilly", { moved: false }).state.cats.find(c => c.id === "tilly").moved, false);
});

test("the prize: each step needs one working roll by any cat; a step done stays done; food adds the Foodie's Knack", () => {
  let s = kitchen12({ cats: { tilly: "kitchen", biscuit: "kitchen" } });
  s.prize.stepsLeft = 2; s.prize.down = false;
  const step = rollContext(s, "biscuit", "step");
  assert.deepEqual(step.options.map(o => [o.approach, o.difficulty, o.knack]), [["sneaky", 1, true], ["savage", 1, true]], "Foodie: +1 die at food");
  let r = roll(s, "tilly", "step", "sneaky", "clean");
  assert.equal(r.state.prize.stepsLeft, 1);
  r = roll(r.state, "biscuit", "step", "savage", "flop");
  assert.equal(r.state.prize.stepsLeft, 1, "a Flop doesn't work");
  assert.equal(opt(r.state, "biscuit", "step").disabled, "already acted this round");
  s = arrange(r.state, { cats: { velvet: "kitchen" } });
  r = roll(s, "velvet", "step", "streetwise", "scrape");
  assert.equal(r.state.prize.down, true);
  assert.ok(opt(r.state, "mags", "take") === null, "Mags isn't in the kitchen");
});

test("taking the prize: Medium needs a Chonky cat or two; carriers move together; past a human it's a roll", () => {
  let s = kitchen12({ cats: { tilly: "kitchen", biscuit: "kitchen", velvet: "kitchen" } });
  let r = doAction(s, "tilly", "take");
  assert.equal(r.ok, false);
  assert.equal(cat(r.state, "tilly").acted, false, "a pick-up that can't work costs nothing");
  assert.match(texts(r.events), /takes one Chonky cat, or two cats/);
  r = doAction(s, "tilly", "take", { helpers: ["velvet"] });
  assert.deepEqual(r.state.prize.carriers, ["tilly", "velvet"]);
  r = doAction(s, "biscuit", "take");
  assert.deepEqual(r.state.prize.carriers, ["biscuit"], "a Chonky cat carries a Medium thing alone");
  r = doAction(r.state, "biscuit", "move:hall");
  assert.equal(r.state.prize.room, "hall");
  assert.equal(cat(r.state, "biscuit").where, "hall");
  s = arrange(r.state, { round: 4, humans: { pell: "kitchen" } });
  s.cats.forEach(c => { c.moved = false; c.acted = false; });
  const past = opt(s, "biscuit", "move:kitchen");
  assert.deepEqual(past.uses, ["move", "action"]);
  assert.match(past.label, /past a human/);
  r = roll(s, "biscuit", "move:kitchen", "savage", "flop");
  assert.equal(r.state.prize.room, "hall", "a Flop: it doesn't move");
  assert.equal(moodNow(r.state).broom, 2);
});

test("getting out with the prize: no climbing with Medium or Large; Large needs Big ways; out = got", () => {
  let s = kitchen12({ cats: { biscuit: { where: "kitchen", status: "free", carrying: true } } });
  s.prize.carriers = ["biscuit"];
  assert.match(opt(s, "biscuit", "exit:window").disabled, /no climbing/);
  let o = arrange(beginRound(robbery("okafor-box")).state, { round: 3, cats: { tilly: "garage", mags: "garage", velvet: "garage" }, humans: { mum: "living", tayo: "kidsroom" } });
  o.prize = { ...o.prize, withHuman: null, room: "garage", spotRoom: "hall", down: true };
  let r = doAction(o, "tilly", "take", { helpers: ["mags"] });
  assert.equal(r.ok, false, "a Large box: three cats, or two with a Chonky");
  r = doAction(o, "tilly", "take", { helpers: ["mags", "velvet"] });
  assert.equal(r.state.prize.carriers.length, 3);
  const k = arrange(r.state, { round: 4 });
  k.cats.forEach(c => { c.moved = false; c.acted = false; });
  r = doAction(k, "mags", "exit:garage");
  assert.equal(r.state.prize.out, true);
  assert.ok(["tilly", "mags", "velvet"].every(id => cat(r.state, id).status === "outside"));
  assert.match(texts(r.events), /with the big delivery box!/);
});

test("simple things are free unseen and a roll in view; a hidden cat that acts comes out and is seen", () => {
  let s = kitchen12({ cats: { biscuit: "kitchen", mags: { where: "kitchen", status: "free", hidden: true } } });
  assert.equal(opt(s, "biscuit", "eat").roll, null);
  let r = doAction(s, "biscuit", "eat");
  assert.deepEqual([r.state.prize.portionsLeft, r.state.prize.eaten], [4, 1]);
  s = arrange(s, { humans: { pell: "kitchen" } });
  assert.deepEqual(opt(s, "biscuit", "eat").roll.options, [["sneaky", 0, "food"], ["savage", 0, "food"]]);
  assert.deepEqual(rollContext(s, "mags", "eat").seenBy, ["pell"], "hidden, but eating brings it out");
  assert.deepEqual(opt(s, "biscuit", "hide").roll.options, [["sneaky", 0, "hide"]]);
  r = roll(s, "mags", "free", "sneaky", "clean");
  assert.equal(cat(r.state, "mags").hidden, false, "doing anything else ends hiding");
  r = doAction(kitchen12({ cats: { tilly: "kitchen" } }), "tilly", "hide");
  assert.equal(cat(r.state, "tilly").hidden, true);
  r = doAction(kitchen12({ cats: { tilly: "kitchen" } }), "tilly", "noise");
  assert.deepEqual(r.state.messes, ["kitchen"], "a noise on purpose leaves a mess");
});

test("distract: a Sweet roll at a watching human; each earlier distraction takes a die; mouth full can't be Sweet", () => {
  let s = kitchen12({ cats: { velvet: "kitchen", biscuit: "kitchen" }, humans: { pell: { room: "kitchen", distractions: 2 } } });
  const ctx = rollContext(s, "velvet", "distract:pell");
  assert.deepEqual(ctx.options.map(o => [o.approach, o.difficulty, o.knack, o.attention]), [["sweet", 2, true, 1]]);
  assert.equal(ctx.diffLabel, "Distracted 2× before");
  const r = roll(s, "velvet", "distract:pell", "sweet", "clean");
  assert.equal(human(r.state, "pell").distractedRound, 3);
  assert.equal(human(r.state, "pell").distractions, 3);
  assert.equal(opt(r.state, "biscuit", "eat").roll, null, "a Distracted human sees nobody");
  s = arrange(s, { cats: { biscuit: { where: "kitchen", status: "free", carrying: true } } });
  s.prize.carriers = ["biscuit"];
  assert.match(opt(s, "biscuit", "distract:pell").disabled, /mouth full/);
});

test("a dog in the room: deal with it or leave first; Savage drives it off, Sweet befriends a soft one, Sneaky slips past", () => {
  const base = arrange(kitchen12({ cats: { tilly: "kitchen", biscuit: "kitchen" } }), { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  assert.match(opt(base, "tilly", "eat").disabled, /Pudding is in the way/);
  assert.equal(opt(base, "tilly", "move:hall").disabled, null, "leaving is always allowed");
  const ctx = rollContext(base, "biscuit", "confront:pudding");
  assert.equal(ctx.opposition, 2);
  assert.deepEqual(ctx.options.map(o => [o.approach, o.knack]), [["savage", true], ["sneaky", false], ["sweet", false]]);
  let r = roll(base, "biscuit", "confront:pudding", "savage", "clean");
  assert.equal(pet(r.state, "pudding").mode, "hiding");
  assert.equal(pet(r.state, "pudding").until, 6);
  assert.equal(opt(r.state, "tilly", "eat").disabled, null);
  r = roll(base, "biscuit", "confront:pudding", "sweet", "scrape");
  assert.equal(pet(r.state, "pudding").mode, "friendly");
  r = roll(base, "tilly", "confront:pudding", "sneaky", "clean");
  assert.deepEqual(cat(r.state, "tilly").slipped, ["pudding"]);
  assert.match(opt(r.state, "biscuit", "eat").disabled, /Pudding/, "slipping past is for that cat only");
  r = roll(base, "tilly", "confront:pudding", "sneaky", "flop");
  assert.equal(pet(r.state, "pudding").mode, "angry");
  assert.equal(cat(r.state, "tilly").where, "hall", "a Flop: the dog chases you into the next room");
  const brutus = arrange(beginRound(robbery("marchetti-salmon")).state, { cats: { biscuit: "utility" } });
  assert.deepEqual(rollContext(brutus, "biscuit", "confront:brutus").options.map(o => o.approach), ["savage", "sneaky"], "Brutus isn't soft");
});

test("held: wriggle free (Savage, Tricky; Chonky +1 die); shut in: the Den door, from inside or the next room", () => {
  let s = kitchen12({ cats: { biscuit: { where: "hall", status: "held", heldBy: "pell" } }, humans: { pell: { room: "hall", holding: "biscuit" } } });
  const w = rollContext(s, "biscuit", "wriggle");
  assert.equal(w.bodyDie, true);
  assert.deepEqual(w.seenBy, ["pell"]);
  assert.deepEqual(w.options.map(o => [o.approach, o.difficulty]), [["savage", 1]]);
  let r = roll(s, "biscuit", "wriggle", "savage", "scrape");
  assert.equal(cat(r.state, "biscuit").status, "free");
  assert.equal(cat(r.state, "biscuit").where, "hall");
  assert.equal(human(r.state, "pell").holding, null);
  s = kitchen12({ cats: { velvet: { where: "loo", status: "shut" }, tilly: "hall" } });
  s.ways.find(x => x.den).open = false;
  s.ways.find(x => x.den).opts = [["streetwise", 1, "open"], ["savage", 2]];
  assert.deepEqual(rollContext(s, "velvet", "escapeDen").options.map(o => [o.approach, o.difficulty]), [["streetwise", 2]]);
  assert.deepEqual(rollContext(s, "velvet", "escapeDen").seenBy, []);
  const door = opt(s, "tilly", "open:hall~loo");
  assert.match(door.label, /let Velvet out/);
  r = roll(s, "tilly", "open:hall~loo", "streetwise", "clean");
  assert.equal(cat(r.state, "velvet").status, "free");
  r = roll(s, "velvet", "escapeDen", "streetwise", "clean");
  assert.equal(cat(r.state, "velvet").status, "free");
  assert.equal(r.state.ways.find(x => x.den).open, true);
});

test("getting out: meow at the front door (a human there, not with your mouth full); reopen a shut entrance", () => {
  let s = kitchen12({ cats: { velvet: "hall", tilly: "kitchen" }, humans: { pell: "hall" } });
  assert.equal(opt(s, "velvet", "meow:front").disabled, null);
  let r = roll(s, "velvet", "meow:front", "sweet", "clean");
  assert.equal(cat(r.state, "velvet").status, "outside");
  s = arrange(s, { humans: { pell: "loo" } });
  assert.match(opt(s, "velvet", "meow:front").disabled, /nobody there/);
  s.entrances.find(e => e.key === "window").open = false;
  assert.match(opt(s, "tilly", "exit:window").disabled, /reopen it/);
  r = roll(s, "tilly", "reopen:window", "streetwise", "clean");
  assert.equal(r.state.entrances.find(e => e.key === "window").open, true);
  assert.match(opt(r.state, "tilly", "exit:window").disabled, /already acted/, "reopening was the Action; the climb out is a roll too");
});

test("parrot, robot vacuum, help, Purrfect, idempotence and effects off", () => {
  let c = arrange(beginRound(robbery("birthday-cake")).state, { cats: { tilly: "dining" } });
  let r = roll(c, "tilly", "cover:captain", "streetwise", "scrape");
  assert.equal(pet(r.state, "captain").mode, "covered");
  let w = arrange(beginRound(robbery("wendell-mouse")).state, { cats: { mags: "hall" }, humans: { wendell: "kitchen", june: "kitchen" }, pets: { roomba: "hall" } });
  r = doAction(w, "mags", "ride:roomba");
  assert.equal(cat(r.state, "mags").riding, "roomba");
  assert.equal(cat(r.state, "mags").hidden, true);
  r = doAction(r.state, "mags", "hopOff");
  assert.equal(cat(r.state, "mags").riding, null);
  let s = kitchen12({ cats: { tilly: "kitchen", biscuit: "kitchen", mags: "hall" } });
  assert.throws(() => queueHelp(s, "mags", "biscuit"), /must be with/);
  s = queueHelp(s, "tilly", "biscuit").state;
  assert.deepEqual(eligibleHelpers(s, cat(s, "biscuit")).map(x => x.id), ["tilly"]);
  assert.deepEqual(catOptions(s, "tilly").helpTargets, [{ id: "biscuit", name: "Big Biscuit", queued: true }]);
  r = roll(s, "biscuit", "free", "savage", "purrfect", { helpers: ["tilly"] });
  assert.deepEqual(r.cattitude, [{ catId: "biscuit", delta: 1, why: "a Purrfect" }]);
  assert.equal(cat(r.state, "tilly").acted, true);
  const again = applyRoll(r.state, { eventId: `ev${n}`, catId: "biscuit", optionId: "free", approach: "savage", result: "purrfect" });
  assert.equal(again.skipped, true, "a roll card applies once");
  r = roll(s, "biscuit", "eat", "savage", "clean", { ctx: { effects: false } });
  assert.equal(r.state.prize.portionsLeft, 5, "effects off: the Storyteller does it by hand");
  assert.equal(cat(r.state, "biscuit").acted, true);
  assert.equal(queueHelp(s, "tilly", null).state.help.tilly, undefined);
});

test("nothing to do between rounds, and a held or shut cat has only its way out", () => {
  const s = robbery("number-12");
  assert.match(opt(s, "tilly", "enter:flap").disabled, /wait for the round/);
  const h = kitchen12({ cats: { biscuit: { where: "hall", status: "held", heldBy: "pell" } }, humans: { pell: { room: "hall", holding: "biscuit" } } });
  assert.deepEqual(catOptions(h, "biscuit").options.map(o => o.id), ["wriggle"]);
  assert.equal(rollContext(h, "nobody", "free"), null);
});
