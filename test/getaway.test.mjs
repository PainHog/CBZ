/**
 * Chapter 9, The Getaway (core rules v0.10 draft; the simulator's package P12,
 * sim/engine.mjs finishWithGetaway), and the outcomes and shiny loot that came
 * with it: module/logic/getaway.mjs and prize.mjs.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { beginRound, finishRobbery, setMood, temptationOptions, newRobbery } from "../module/logic/round.mjs";
import { applyRoll, catOptions, rollContext, doAction, queueHelp } from "../module/logic/actions.mjs";
import { endGetawayRound, finishGetaway, placeRunner, setWarden, setCarry, getawayView, DEFAULT_ROUTE, lootDie } from "../module/logic/getaway.mjs";
import { lootOf, robberyOutcome } from "../module/logic/prize.mjs";
import { moodNow } from "../module/logic/round.mjs";
import { findHouse } from "../module/logic/house-catalog.mjs";
import { robbery, arrange, cat, texts, GANG } from "./fixtures.mjs";

let n = 0;
const over = (s, id, approach, result, helpers = [], ctx = {}) =>
  applyRoll(s, { eventId: `ga-${++n}`, catId: id, optionId: "over", approach, result, helpers }, ctx);
const dodge = (s, id, approach, result) => applyRoll(s, { eventId: `ga-${++n}`, catId: id, optionId: "dodge", approach, result });
const g = s => s.getaway;
const run = (s, id) => s.getaway.cats[id];

/** Number 12 after a good night: the chicken out of the house (5 portions, none eaten), all four cats outside. */
function chickenOut({ caught = false, eaten = 0, inside = [] } = {}) {
  let s = arrange(beginRound(robbery("number-12")).state, { round: 6 });
  Object.assign(s.prize, { withHuman: null, out: true, room: null, eaten, portionsLeft: s.prize.portions - eaten });
  for (const id of inside) Object.assign(cat(s, id), { status: "free", where: "hall" });
  if (caught) s.moodLedger.push({ id: "t1", seq: 99, kind: "trigger", side: "broom", target: "biscuit" });
  return finishRobbery(s, "allOut").state;
}

test("the getaway starts when the house part ends: cats inside are pinched, the loot is shared out, the van is on its way", () => {
  let s = chickenOut({ inside: ["velvet"] });
  assert.equal(s.phase, "getaway");
  assert.deepEqual(g(s).route.map(o => o.name), ["Mr Pell's back fence", "the allotments", "the alley wall", "Station Road"]);
  assert.deepEqual(Object.fromEntries(Object.entries(g(s).cats).map(([id, r]) => [id, [r.state, r.carry]])),
    { tilly: ["running", 1], biscuit: ["running", 2], velvet: ["pinched", 0], mags: ["running", 1] }, "Chonky Biscuit carries two; one piece is left in the garden");
  assert.deepEqual(g(s).drops, [1, 0, 0, 0]);
  assert.equal(g(s).arrives, 2, "nobody was Shooed or Scooped tonight: the van comes at the end of round 2");
  assert.equal(chickenOut({ caught: true }).getaway.arrives, 1, "somebody was: the end of round 1");
  // a house with no route of its own uses the default one
  const plain = { ...findHouse("number-12"), getaway: undefined };
  let p = beginRound(newRobbery(plain, { cats: Object.values(GANG).slice(0, 4) })).state;
  p.prize.out = true;
  assert.deepEqual(finishRobbery(p).state.getaway.route.map(o => o.name), DEFAULT_ROUTE.map(o => o.name));
});

test("the loot in pieces: food is its uneaten portions (if it was carried out); anything else Small 1, Medium 2, Large 3 — shiny things too", () => {
  let s = robbery("number-12");
  assert.deepEqual(lootOf(s), { total: 5, safe: 0, pieces: 0 }, "still in the house: nothing to carry");
  Object.assign(s.prize, { out: true, eaten: 2, portionsLeft: 3 });
  assert.deepEqual(lootOf(s), { total: 5, safe: 2, pieces: 3 }, "eaten inside is safe; the rest is loot");
  assert.equal(lootOf(robbery("wendell-mouse")).total, 1, "the catnip mouse: Small, 1 piece");
  assert.equal(lootOf(robbery("okafor-box")).total, 3, "the box: Large, 3 pieces");
  const shiny = { ...findHouse("wendell-mouse"), prize: { ...findHouse("wendell-mouse").prize, kind: "shiny", name: "jewellery box", size: "medium" } };
  const j = newRobbery(shiny, { cats: Object.values(GANG).slice(0, 4) });
  assert.equal(j.prize.kind, "shiny");
  assert.equal(lootOf(j).total, 2, "a Medium shiny thing: 2 pieces, carried like a fun one");
});

test("over an obstacle: the obstacle's roll, a loot die, the pet's rating, Knacks; a leader and up to two helpers go over together", () => {
  let s = chickenOut();
  assert.deepEqual(catOptions(s, "tilly").options.map(o => o.id), ["over", "gdrop"]);
  let ctx = rollContext(s, "tilly", "over");
  assert.deepEqual(ctx.options.map(o => [o.approach, o.difficulty, o.knack]), [["savage", 1, true], ["sneaky", 1, true]], "plain, −1 for her piece of chicken; climbing is a Climber's Knack");
  assert.deepEqual([ctx.seenBy, ctx.attention, ctx.kid], [[], 0, false], "nobody's watching from a window out here");
  assert.deepEqual(ctx.helpers.map(h => h.id), ["biscuit", "velvet", "mags"]);
  assert.equal(lootDie(GANG.biscuit, 1), 0, "a Chonky cat with one piece runs free");
  assert.equal(lootDie(GANG.biscuit, 2), 1);
  s = queueHelp(s, "velvet", "tilly").state;
  assert.equal(rollContext(s, "tilly", "over").helpers.find(h => h.id === "velvet").queued, true);
  const r = over(s, "tilly", "sneaky", "clean", ["velvet", "mags", "biscuit"]);
  assert.deepEqual(["tilly", "velvet", "mags", "biscuit"].map(id => run(r.state, id).pos), [1, 1, 1, 0], "a leader and two helpers; the third stays");
  assert.ok(["tilly", "velvet", "mags"].every(id => run(r.state, id).acted));
  assert.equal(moodNow(r.state).broom, 0, "getaway rolls fill no meters");
  assert.match(texts(r.events), /Two-Bin Tilly, Velvet and Marmalade Mags get over Mr Pell's back fence/);
  // the Okafors' terrier takes its rating off; Hunter's Knack bolts across a road
  let o = arrange(beginRound(robbery("okafor-box")).state, { round: 6 });
  Object.assign(o.prize, { withHuman: null, out: true, room: null });
  o = finishRobbery(o).state;
  o = placeRunner(o, "mags", 1).state;
  assert.equal(rollContext(o, "mags", "over").opposition, 1, "next door's terrier: rating 1");
  o = placeRunner(o, "mags", 3).state;
  assert.equal(rollContext(o, "mags", "over").options.find(x => x.approach === "savage").knack, true, "the main road: a Hunter's Knack to bolt");
});

test("a Flop: the group is stuck and every carrier drops a piece; the warden comes on two spaces that round", () => {
  let s = chickenOut({ caught: true });
  let r = over(s, "tilly", "sneaky", "flop", ["velvet"]);
  assert.deepEqual([run(r.state, "tilly").pos, run(r.state, "tilly").carry, run(r.state, "velvet").carry, g(r.state).drops[0]], [0, 0, 0, 2]);
  assert.match(texts(r.events), /Flop! Two-Bin Tilly and Velvet are stuck at Mr Pell's back fence this round, and Two-Bin Tilly and Velvet each drop a piece of loot/);
  r = over(r.state, "biscuit", "savage", "clean");
  r = over(r.state, "mags", "sneaky", "clean");
  r = endGetawayRound(r.state);
  assert.equal(g(r.state).warden, 0, "the van pulls up at the end of round 1");
  assert.match(texts(r.events), /scoops up 2 pieces of dropped loot/);
  assert.equal(g(r.state).stage, "cornered", "Tilly and Velvet are still in the garden");
  assert.deepEqual(g(r.state).cornered, ["tilly", "velvet"]);
  assert.deepEqual(catOptions(r.state, "tilly").options.map(o => o.id), ["dodge"]);
  assert.deepEqual(rollContext(r.state, "tilly", "dodge").options.map(o => [o.approach, o.difficulty]), [["sneaky", 0], ["savage", 0], ["sweet", 0]], "dodging is plain");
  assert.deepEqual(catOptions(r.state, "biscuit").options, [], "everyone waits for the dodges");
  assert.throws(() => endGetawayRound(r.state), /dodge first/);
  r = dodge(r.state, "tilly", "sneaky", "scrape");
  assert.equal(run(r.state, "tilly").pos, 1, "she bolts to the space just ahead of the warden");
  r = dodge(r.state, "velvet", "sweet", "flop");
  assert.equal(run(r.state, "velvet").state, "pinched");
  assert.match(texts(r.events), /Pinched! The warden's net comes down on Velvet/);
  assert.equal(g(r.state).round, 2, "the last dodge done: round 2");
  // round 2: a Flop over the allotments — the warden comes on two spaces
  r = over(r.state, "tilly", "sneaky", "flop", ["biscuit", "mags"]);
  r = endGetawayRound(r.state);
  assert.equal(g(r.state).warden, 2, "0 → 2 after a Flop");
  assert.match(texts(r.events), /hears the racket and charges on to the alley wall — two spaces!/);
  assert.deepEqual(g(r.state).cornered.sort(), ["biscuit", "mags", "tilly"]);
});

test("dropping a piece on purpose loses the loot die (no turn used); a cat can grab a dropped piece instead of going on", () => {
  let s = chickenOut();
  let r = doAction(s, "biscuit", "gdrop");
  assert.deepEqual([run(r.state, "biscuit").carry, run(r.state, "biscuit").acted, g(r.state).drops[0]], [1, false, 1]);
  assert.equal(rollContext(r.state, "biscuit", "over").options[0].difficulty, 0, "one piece: a Chonky cat runs free");
  assert.match(texts(r.events), /drops a piece of loot on purpose/);
  r = doAction(r.state, "tilly", "gdrop");
  assert.deepEqual(catOptions(r.state, "tilly").options.map(o => o.id), ["over", "gpick"]);
  r = doAction(r.state, "tilly", "gpick");
  assert.deepEqual([run(r.state, "tilly").carry, run(r.state, "tilly").acted, g(r.state).drops[0]], [1, true, 1]);
  assert.match(catOptions(r.state, "tilly").options[0].disabled, /already went/);
});

test("the warden: on the way, then 1 space a round, never past the last obstacle; loot on or behind it is gone", () => {
  let s = chickenOut();
  let r = endGetawayRound(s);
  assert.equal(g(r.state).warden, null, "nobody was caught tonight: the van is still on its way at the end of round 1");
  assert.match(texts(r.events), /a van is on its way/);
  for (const id of ["tilly", "biscuit", "velvet", "mags"]) r = { state: placeRunner(r.state, id, 3).state };
  r = endGetawayRound(r.state);
  assert.equal(g(r.state).warden, 0);
  for (let i = 0; i < 3; i++) r = endGetawayRound(r.state);
  assert.equal(g(r.state).warden, 3, "it stops at the last obstacle");
  assert.equal(g(r.state).stage, "cornered", "and now everyone on space 3 must dodge");
});

const settle = (s, where = {}) => {
  for (const id of ["tilly", "biscuit", "velvet", "mags"]) if (s.phase === "getaway" && run(s, id).state === "running") s = placeRunner(s, id, where[id] ?? "home").state;
  return s;
};

test("the outcome: the loot home plus the portions eaten in the house — Clean, Messy or Busted; it ends when every cat is home or pinched", () => {
  let s = settle(chickenOut());
  assert.deepEqual([s.phase, s.outcome.result, s.outcome.loot, s.outcome.lootTotal, s.outcome.pinched], ["ended", "clean", 5, 5, []]);
  // a piece lost on the way: Messy
  s = chickenOut();
  s = doAction(s, "tilly", "gdrop").state;
  s = settle(s);
  assert.deepEqual([s.outcome.result, s.outcome.loot], ["messy", 4]);
  // all of it home, but somebody pinched: Messy
  s = chickenOut({ eaten: 1 });
  s = setCarry(s, "biscuit", 2).state;
  s = settle(s, { mags: "pinched" });
  assert.equal(s.outcome.result, "messy");
  assert.deepEqual(s.outcome.leftBehind, ["mags"]);
  assert.match(texts(s.log.slice(-1)), /Messy Getaway! Loot home: 5 of 5 \(1 eaten in the house\)\. Pinched: Marmalade Mags — off to the pound\./);
  // less than half: Busted
  s = settle(chickenOut(), { biscuit: "pinched", velvet: "pinched" });
  assert.deepEqual([s.outcome.result, s.outcome.loot], ["busted", 2]);
  // eaten in the house counts: 3 eaten + 2 carried home
  s = settle(chickenOut({ eaten: 3 }));
  assert.deepEqual([s.outcome.result, s.outcome.loot, s.outcome.eaten], ["clean", 5, 3]);
  // the Storyteller can't count it while someone is still running
  assert.throws(() => finishGetaway(chickenOut()), /still running/);
  // the outcome without a getaway (it hasn't run): every cat outside home with its share
  const o = robberyOutcome({ ...robbery("number-12"), prize: { ...robbery("number-12").prize, out: true } });
  assert.deepEqual([o.result, o.loot], ["clean", 5]);
});

test("the getaway automation off: rolls and the warden move nothing; the Storyteller moves the cats, the loot and the warden by hand", () => {
  let s = chickenOut({ caught: true });
  let r = over(s, "tilly", "sneaky", "clean", [], { getaway: false });
  assert.equal(run(r.state, "tilly").pos, 0);
  assert.match(texts(r.events), /the Storyteller moves the gang by hand/);
  r = endGetawayRound(r.state, { getaway: false });
  assert.deepEqual([g(r.state).warden, g(r.state).round], [null, 2]);
  r = { state: setWarden(r.state, 2).state };
  assert.equal(g(r.state).warden, 2);
  r = { state: placeRunner(r.state, "tilly", 3).state };
  assert.equal(run(r.state, "tilly").pos, 3);
  r = { state: setCarry(r.state, "tilly", 5).state };
  assert.equal(run(r.state, "tilly").carry, 1, "never more than she can carry");
  const v = getawayView(r.state);
  assert.deepEqual(v.spaces.map(sp => sp.cats.map(c => c.id)), [["biscuit", "velvet", "mags"], [], [], ["tilly"], []]);
  assert.equal(v.spaces[2].warden, true);
});

test("shiny loot: any room tempts Curious and Knocker cats with something shiny", () => {
  const s = arrange(beginRound(robbery("number-12")).state, { cats: { tilly: "loo", velvet: "loo" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  assert.deepEqual(temptationOptions(s).map(o => [o.catId, o.instinct, o.tempt]).sort(), [
    ["tilly", "curious", "something shiny lying about"], ["velvet", "knocker", "something sparkly on the edge of a table"]], "the loo tempts nobody — but shiny things lie about everywhere");
});
