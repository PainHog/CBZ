/**
 * Chapter 9 "Cred: showing off" (the simulator's package P13): tagging rooms,
 * the catnip stash and the zoomies, the rivals on the getaway, and the Cat's
 * Whiskers at the end of the night — module/logic/cred.mjs and where it
 * plugs into actions.mjs, round.mjs, rules.mjs and getaway.mjs.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { beginRound, tempt, answerTemptation, temptationOptions, finishRobbery, moodNow } from "../module/logic/round.mjs";
import { rollContext, applyRoll, findOption, doAction, catOptions } from "../module/logic/actions.mjs";
import { endGetawayRound, placeRunner } from "../module/logic/getaway.mjs";
import { credSummary, whiskersText, setCred, setZoomies, tagWorth } from "../module/logic/cred.mjs";
import { buildRollPlan, poolSize } from "../module/logic/rules.mjs";
import { robbery, arrange, cat, texts } from "./fixtures.mjs";

let n = 0;
function roll(s, id, optionId, approach, result, ctx = {}) {
  const rc = rollContext(s, id, optionId);
  return applyRoll(s, { eventId: `cred-${++n}`, catId: id, optionId, approach, result, seen: rc.seenBy.length > 0, seenBy: rc.seenBy, kid: rc.kid }, ctx);
}
/** Number 12 in round 3: Mr Pell in the living room, Pudding driven off. The catnip cushion is in the living room; the Bin Lid Boys tagged the kitchen. */
const number12 = (extra = {}) => arrange(beginRound(robbery("number-12")).state, { round: 3, pets: { pudding: { mode: "hiding", until: 99 } }, humans: { pell: "living" }, ...extra });
const noises = s => (s.noise ?? []).map(x => x.room);

test("the house's Cred line comes from the catalog: the catnip stash, the rivals' tag and their patch on the getaway", () => {
  const s = robbery("number-12");
  assert.deepEqual(s.cred, { catnip: "living", catnipName: "a catnip cushion on Mr Pell’s armchair", rivals: "the Bin Lid Boys", rivalTag: "kitchen", patch: 1, tags: [], nipBy: null });
  assert.ok(s.cats.every(c => c.cred === 0 && c.nip === false));
  assert.equal(robbery("wendell-mouse").cred.rivalTag, "cellar");
});

test("tagging unseen: a simple thing — 1 Cred, the room tagged for the whole gang, and a mess (no noise)", () => {
  let s = number12({ cats: { tilly: "hall", mags: "hall" } });
  const o = findOption(s, "tilly", "tag");
  assert.equal(o.roll, null, "nobody sees: no roll");
  assert.match(o.label, /Tag the hall: leave the gang's mark \(1 Cred; it's a mess\)/);
  const r = doAction(s, "tilly", "tag");
  s = r.state;
  assert.deepEqual(s.cred.tags, ["hall"]);
  assert.equal(cat(s, "tilly").cred, 1);
  assert.ok(cat(s, "tilly").acted, "it's the cat's Action");
  assert.ok(s.messes.includes("hall"), "the next human in here finds it (+1 Broom)");
  assert.deepEqual(noises(s), [], "a tag is a mess, not a noise");
  assert.match(texts(r.events), /Two-Bin Tilly leaves the gang's mark on the hall\./);
  assert.match(texts(r.events), /Two-Bin Tilly \+1 Cred for tagging the hall/);
  assert.equal(findOption(s, "mags", "tag"), null, "one tag a room for the whole gang");
});

test("tagging in view is a roll (Sneaky unnoticed or Savage): +1 if it works, and no mess; a Flop leaves no tag", () => {
  let s = number12({ cats: { tilly: "living", velvet: "living" } });
  const o = findOption(s, "tilly", "tag");
  assert.deepEqual(o.roll.options.map(x => x[0]), ["sneaky", "savage"]);
  assert.match(o.label, /\+1 if it works in view\)$/, "no mess when they see it go on");
  const ok = roll(s, "tilly", "tag", "sneaky", "clean");
  assert.equal(cat(ok.state, "tilly").cred, 2, "1, +1 in view (a Sneaky Clean too): they watched and still couldn't stop it");
  assert.match(texts(ok.events), /right under their noses/);
  assert.ok(!ok.state.messes.includes("living"), "P14: a tag made in view isn't a mess — they already know");
  assert.equal(moodNow(ok.state).broom, 0, "a Sneaky Clean: nobody noticed");
  const flop = roll(s, "velvet", "tag", "savage", "flop");
  assert.deepEqual(flop.state.cred.tags, [], "no tag");
  assert.equal(cat(flop.state, "velvet").cred, 0);
  assert.match(texts(flop.events), /gets rumbled mid-scratch: no tag/);
  assert.equal(moodNow(flop.state).broom, 2, "the Flop's Mood as any roll in view");
});

test("tagging over the rivals' tag is worth 1 more; with the zoomies every tag is a roll, and everything counts double", () => {
  let s = number12({ cats: { tilly: "kitchen", biscuit: "hall" } });
  assert.equal(tagWorth(s, "kitchen"), 2);
  assert.match(findOption(s, "tilly", "tag").label, /\(2 Cred, over the Bin Lid Boys' tag; it's a mess\)/);
  let r = doAction(s, "tilly", "tag");
  assert.equal(cat(r.state, "tilly").cred, 2);
  assert.match(texts(r.events), /slap over the Bin Lid Boys' tag\. Take that!/);
  cat(s, "biscuit").nip = true;
  const o = findOption(s, "biscuit", "tag");
  assert.deepEqual(o.roll.options.map(x => x[0]), ["sneaky", "savage"], "P14: with the zoomies, a tag is a roll even unseen");
  assert.match(o.label, /the zoomies: a roll/);
  r = roll(s, "biscuit", "tag", "savage", "clean");
  assert.equal(cat(r.state, "biscuit").cred, 2, "1 ×2 with the zoomies (unseen: no +1)");
  assert.match(texts(r.events), /\(doubled: the zoomies\)/);
  assert.ok(r.state.messes.includes("hall"), "unseen, it's a mess");
  assert.ok((r.state.noise ?? []).some(x => x.room === "hall"), "and, like every roll with the zoomies, a noise");
  cat(s, "tilly").nip = true;
  assert.equal(cat(roll(s, "tilly", "tag", "savage", "scrape").state, "tilly").cred, 4, "the rivals' tag with the zoomies: 2 ×2");
});

test("the catnip stash tempts every cat in its room, whatever its instincts — one stash, one cat", () => {
  let s = number12({ cats: { biscuit: "living", mags: "living" }, humans: { pell: "hall" } });
  const opts = temptationOptions(s);
  assert.ok(opts.some(o => o.catId === "biscuit" && o.instinct === "catnip"), "Biscuit (Scrapper, Foodie) is tempted by it anyway");
  assert.ok(opts.some(o => o.catId === "mags" && o.instinct === "catnip"));
  const t = opts.find(o => o.catId === "biscuit" && o.instinct === "catnip");
  assert.equal(t.tempt, "a catnip cushion on Mr Pell’s armchair");
  s = tempt(s, { catId: "biscuit", instinct: "catnip" }).state;
  const r = answerTemptation(s, { choice: "gaveIn", cattitude: 2 });
  s = r.state;
  assert.deepEqual(r.cattitude, [{ catId: "biscuit", delta: +1, why: "gave in to a temptation" }]);
  assert.ok(cat(s, "biscuit").nip, "the zoomies");
  assert.equal(cat(s, "biscuit").cred, 1, "the nip scores 1 (the book's table)");
  assert.equal(s.cred.nipBy, "biscuit");
  assert.deepEqual(noises(s), ["living"], "rolling about in it, yowling");
  assert.equal(moodNow(s).broom, 0, "nobody saw");
  assert.match(texts(r.events), /Big Biscuit dives into a catnip cushion on Mr Pell’s armchair/);
  assert.ok(!temptationOptions(beginRound(s).state).some(o => o.instinct === "catnip"), "the stash is gone");
  assert.equal(findOption(s, "mags", "catnip"), null);
});

test("giving in to the catnip in view: +1 Broom (never filling the meter); a carrier drops the prize first", () => {
  let s = number12({ cats: { velvet: "living" } }); // the cushion, with Mr Pell watching
  Object.assign(cat(s, "velvet"), { carrying: true });
  Object.assign(s.prize, { carriers: ["velvet"], room: "living", withHuman: null, down: true, stepsLeft: 0 });
  s = tempt(s, { catId: "velvet", instinct: "catnip" }).state;
  const r = answerTemptation(s, { choice: "gaveIn", cattitude: 2 });
  assert.equal(moodNow(r.state).broom, 1);
  assert.equal(r.state.prize.carriers.length, 0, "catnip first, loot later");
  assert.match(texts(r.events), /Velvet drops the rotisserie chicken — catnip first, loot later/);
});

test("getting into the catnip on purpose: unseen a simple thing, in view a roll (a Flop misses it)", () => {
  let s = number12({ cats: { mags: "living" }, humans: { pell: "hall" } });
  assert.equal(findOption(s, "mags", "catnip").roll, null);
  let r = doAction(s, "mags", "catnip");
  assert.ok(cat(r.state, "mags").nip);
  assert.equal(cat(r.state, "mags").cred, 1);
  assert.deepEqual(noises(r.state), ["living"]);
  assert.ok(!r.state.messes.includes("living"), "a noise, not a mess");
  // in view
  s = number12({ cats: { velvet: "living" } });
  assert.deepEqual(findOption(s, "velvet", "catnip").roll.options.map(x => x[0]), ["sneaky", "savage"]);
  r = roll(s, "velvet", "catnip", "sneaky", "clean");
  assert.ok(cat(r.state, "velvet").nip);
  assert.deepEqual(noises(r.state), ["living"], "one noise: the yowl");
  r = roll(s, "velvet", "catnip", "savage", "flop");
  assert.ok(!cat(r.state, "velvet").nip);
  assert.equal(r.state.cred.nipBy, null);
  assert.match(texts(r.events), /misses it by a whisker/);
});

test("the zoomies: +1 die (still no more than 5), every roll a noise even a Clean, and no resisting a temptation", () => {
  let s = number12({ cats: { tilly: "hall" } });
  cat(s, "tilly").nip = true;
  assert.equal(rollContext(s, "tilly", "free").nip, true, "the roll dialog adds the die");
  const plan = buildRollPlan({ approach: "streetwise", rating: 3, nip: true });
  assert.equal(plan.total, 4);
  assert.deepEqual(plan.add.find(a => a.key === "nip"), { key: "nip", label: "The zoomies", value: 1 });
  assert.equal(buildRollPlan({ approach: "streetwise", rating: 3, knack: true, helpers: 2, nip: true }).total, 5, "still no more than 5");
  assert.equal(poolSize({ rating: 2, nip: true }), 3);
  let r = roll(s, "tilly", "free", "streetwise", "clean");
  assert.deepEqual(noises(r.state), ["hall"], "a Clean, and still a noise");
  assert.match(texts(r.events), /even a Clean comes with a yowl/);
  assert.deepEqual(noises(roll(s, "tilly", "free", "streetwise", "clean", { cred: false }).state), [], "Cred by hand: the Storyteller rules the zoomies");
  // no resisting
  s = arrange(s, { cats: { tilly: "utility" } });
  s = tempt(s, { catId: "tilly", instinct: "curious" }).state;
  r = answerTemptation(s, { choice: "resisted", cattitude: 4 });
  assert.equal(r.state.temptation.choice, "gaveIn");
  assert.deepEqual(r.cattitude, [{ catId: "tilly", delta: +1, why: "gave in to a temptation" }]);
  assert.match(texts(r.events), /has the zoomies: resist\? Resist what\? Wheee!/);
  assert.equal(answerTemptation(s, { choice: "resisted", cattitude: 4 }, { cred: false }).state.temptation.choice, "resisted");
});

/** Number 12 after the house: the chicken out, all four outside; Tilly had the zoomies. */
function getaway() {
  const s = number12();
  Object.assign(s.prize, { withHuman: null, out: true, room: null });
  cat(s, "tilly").nip = true;
  cat(s, "tilly").cred = 3;
  return finishRobbery(s, "allOut");
}
let gn = 0;
const over = (s, id, approach, result, helpers = [], ctx = {}) => applyRoll(s, { eventId: `cg-${++gn}`, catId: id, optionId: "over", approach, result, helpers }, ctx);

test("on the getaway: the zoomies wear off; the rivals hang about on their obstacle and nick loot dropped there", () => {
  const start = getaway();
  let s = start.state;
  assert.ok(!cat(s, "tilly").nip, "by the back fence it has worn off");
  assert.match(texts(start.events), /By the back fence Two-Bin Tilly's zoomies have worn off/);
  assert.match(texts(start.events), /The Bin Lid Boys hang about at the allotments/);
  assert.equal(s.getaway.patch, 1);
  // Biscuit (2 pieces) and Tilly (1) over the back fence; on the allotments Biscuit drops one on purpose: nicked
  s = over(s, "biscuit", "savage", "scrape", ["tilly"]).state;
  assert.deepEqual([s.getaway.cats.biscuit.pos, s.getaway.cats.tilly.pos], [1, 1]);
  assert.match(findOption(s, "biscuit", "gdrop").label, /the Bin Lid Boys nick it at once!/);
  let r = doAction(s, "biscuit", "gdrop");
  assert.equal(r.state.getaway.drops[1], 0, "gone");
  assert.equal(r.state.getaway.loot.nicked, 1);
  assert.match(texts(r.events), /Nicked! The Bin Lid Boys snatch the dropped piece Big Biscuit let go of/);
  // next round, a Flop there: the dropped pieces are nicked too
  r = over(endGetawayRound(s).state, "biscuit", "savage", "flop", ["tilly"]);
  assert.deepEqual([r.state.getaway.cats.biscuit.carry, r.state.getaway.cats.tilly.carry, r.state.getaway.drops[1], r.state.getaway.loot.nicked], [1, 0, 0, 2]);
  assert.match(texts(r.events), /Flop![\s\S]*Nicked! The Bin Lid Boys snatch the 2 dropped pieces/);
  // anywhere else a dropped piece lies there for a friend
  const g0 = doAction(start.state, "biscuit", "gdrop").state;
  assert.equal(g0.getaway.drops[0], 1, "it lies in the garden for a friend to grab");
});

test("on the getaway: leading the gang past the rivals on a Clean or a Purrfect scores 1 (the leader); a Purrfect anywhere scores 1", () => {
  let s = getaway().state;
  s = over(s, "mags", "sneaky", "purrfect").state;
  assert.equal(cat(s, "mags").cred, 1, "what a leap (Mr Pell's back fence)");
  s = over(s, "biscuit", "savage", "scrape", ["tilly", "velvet"]).state;
  assert.equal(cat(s, "biscuit").cred, 0);
  // round 2, the allotments: the rivals' patch
  s = endGetawayRound(s).state;
  let r = over(s, "biscuit", "savage", "scrape", ["tilly"]);
  assert.equal(cat(r.state, "biscuit").cred, 0, "a Scrape gets past, but doesn't show them");
  r = over(s, "biscuit", "savage", "clean", ["tilly", "velvet"]);
  assert.equal(cat(r.state, "biscuit").cred, 1);
  assert.equal(cat(r.state, "tilly").cred, 3, "the helpers don't score");
  assert.match(texts(r.events), /Big Biscuit leads the gang right past the Bin Lid Boys, tail high/);
  r = over(s, "mags", "sneaky", "purrfect");
  assert.equal(cat(r.state, "mags").cred, 3, "a Purrfect past the rivals: 1 for the leap, 1 for the rivals");
  assert.equal(cat(over(s, "mags", "sneaky", "purrfect", [], { cred: false }).state, "mags").cred, 1, "Cred by hand: nothing scores by itself");
  // a dodge's Purrfect isn't an obstacle
  let w = endGetawayRound(endGetawayRound(endGetawayRound(getaway().state).state).state).state; // nobody was caught: the van at the end of round 3
  assert.equal(w.getaway.stage, "cornered");
  w = applyRoll(w, { eventId: `cg-${++gn}`, catId: "velvet", optionId: "dodge", approach: "sneaky", result: "purrfect" }).state;
  assert.equal(cat(w, "velvet").cred, 0);
});

test("the end of the night: everyone's Cred and the Cat's Whiskers on the outcome; the gang's Cred adding up to 8, not Busted, is worth 1 Rep", () => {
  let s = getaway().state;
  for (const id of ["biscuit", "velvet", "mags"]) s = placeRunner(s, id, "home").state;
  s = setCred(s, "mags", 3).state;
  s = setCred(s, "velvet", 2).state;
  const r = placeRunner(s, "tilly", "home");
  const o = r.state.outcome;
  assert.equal(o.result, "clean");
  assert.deepEqual(o.cred.cats.map(c => [c.id, c.cred]), [["tilly", 3], ["biscuit", 0], ["velvet", 2], ["mags", 3]]);
  assert.equal(o.cred.total, 8);
  assert.deepEqual(o.cred.whiskers, ["tilly", "mags"], "ties share it");
  assert.equal(o.cred.rep, true);
  assert.match(texts(r.events), /Two-Bin Tilly and Marmalade Mags tie on 3 Cred: they share the Cat's Whiskers/);
  assert.match(whiskersText(credSummary({ cats: [{ id: "a", name: "Tilly", cred: 4 }, { id: "b", name: "Mags", cred: 1 }] })), /Tilly is the Cat's Whiskers with 4 Cred/);
  assert.match(whiskersText(credSummary({ cats: [{ id: "a", name: "Tilly", cred: 0 }] })), /no Cat's Whiskers/);
  const eight = { cats: [{ id: "a", name: "A", cred: 5 }, { id: "b", name: "B", cred: 3 }] };
  assert.equal(credSummary(eight, "busted").rep, false, "a Busted night earns no Rep however much Cred");
  assert.equal(credSummary(eight, "messy").rep, true, "the gang's Cred adds up");
  assert.equal(credSummary({ cats: [{ id: "a", name: "A", cred: 7 }] }, "clean").rep, false, "P14: 8 or more");
});

test("Cred by hand: the Storyteller sets a cat's Cred and the zoomies; with Cred by hand a tag still goes on but scores nothing", () => {
  let s = number12({ cats: { tilly: "hall" } });
  s = setCred(s, "tilly", 4).state;
  assert.equal(cat(s, "tilly").cred, 4);
  assert.equal(cat(setCred(s, "tilly", -2).state, "tilly").cred, 0);
  s = setZoomies(s, "tilly", true).state;
  assert.ok(cat(s, "tilly").nip);
  assert.ok(!cat(setZoomies(s, "tilly", false).state, "tilly").nip);
  const r = doAction(number12({ cats: { tilly: "hall" } }), "tilly", "tag", {}, { cred: false });
  assert.deepEqual(r.state.cred.tags, ["hall"]);
  assert.equal(cat(r.state, "tilly").cred, 0);
  assert.match(texts(r.events), /Cred is kept by hand: Two-Bin Tilly has 1 Cred coming/);
  assert.ok(catOptions(r.state, "tilly").options.every(o => o.id !== "tag"));
});
