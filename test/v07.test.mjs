/**
 * Core rules v0.7 (after the third pair of playtests): holders still see,
 * the Storyteller picks the cat for a meter filled with no roll, temptation
 * rotates, dogs chase a cat that ends its turn without dealing with them,
 * hauling (Knocker's Knack, its noise, out of a dog's room), the holder's 6,
 * pets through closed doors.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { beginRound, endRound, moodNow, setMood, undoMood, resolvePendingTrigger, tempt, answerTemptation, temptationOptions, addMood } from "../module/logic/round.mjs";
import { rollContext, applyRoll, findOption, doAction } from "../module/logic/actions.mjs";
import { watchers } from "../module/logic/residents.mjs";
import { stepEntry } from "../module/logic/mood.mjs";
import { robbery, dice, arrange, cat, human, pet, texts } from "./fixtures.mjs";

let n = 0;
function roll(s, id, optionId, approach, result, extra = {}) {
  const ctx = rollContext(s, id, optionId);
  return applyRoll(s, { eventId: `v7-${++n}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid, ...extra });
}
const base = (extra = {}) => {
  const s = arrange(beginRound(robbery("number-12")).state, { round: 3, pets: { pudding: { mode: "hiding", until: 99 } }, humans: { pell: "living" }, ...extra });
  s.prize = { ...s.prize, withHuman: null, room: "kitchen", spotRoom: "kitchen", spotSteps: [[["sneaky", 1]], [["streetwise", 1]]], stepsLeft: 0, down: true };
  return s;
};

test("a human holding a cat still sees their room — but only acts on the cat they hold, and doesn't answer noise or find things", () => {
  let s = base({ cats: { velvet: { where: "living", status: "held", heldBy: "pell" }, mags: "living" }, humans: { pell: { room: "living", holding: "velvet" } } });
  assert.deepEqual(watchers(s, "living").map(h => h.key), ["pell"]);
  assert.deepEqual(rollContext(s, "mags", "free").seenBy, ["pell"]);
  s = setMood(s, { broom: 3 }).state;
  const r = roll(s, "mags", "free", "savage", "scrape");
  assert.equal(cat(r.state, "mags").status, "free", "his hands are full: Broom waits for the next cat seen");
  assert.equal(moodNow(r.state).full.broom, true);
  s.noise = [{ room: "hall" }];
  const e = endRound(s, { d6: dice(1) });
  assert.equal(human(e.state, "pell").room, "living", "a holder doesn't come to see a noise");
});

test("a meter filled with no roll falls on a cat that human can see: one cat at once, several — the Storyteller's pick", () => {
  let s = base({ cats: { mags: "living", tilly: "living" }, humans: { pell: { room: "living", searching: true } } });
  s = setMood(s, { broom: 3 }).state;
  let r = endRound(s, { d6: dice() });
  assert.ok(r.state.pendingTrigger, "two cats in sight: the Storyteller picks");
  assert.deepEqual(r.state.pendingTrigger.candidates.sort(), ["mags", "tilly"]);
  assert.match(texts(r.events), /the Storyteller picks which cat Mr Pell chases out/);
  const p = resolvePendingTrigger(r.state, "tilly");
  assert.equal(cat(p.state, "tilly").status, "outside");
  assert.equal(cat(p.state, "mags").status, "free");
  assert.equal(p.state.pendingTrigger, null);
  assert.equal(moodNow(p.state).patience, 3);
  assert.throws(() => resolvePendingTrigger(p.state, "mags"), /No meter is waiting/);
  const u = undoMood(p.state).state;
  assert.equal(cat(u, "tilly").status, "free", "Undo brings Tilly back…");
  assert.deepEqual(u.pendingTrigger?.candidates.sort(), ["mags", "tilly"], "…and the pick waits again");
  const u2 = undoMood(u).state;
  assert.equal(moodNow(u2).full.broom, false);
  assert.equal(u2.pendingTrigger, null, "undoing what filled the meter drops the pick");
  s = base({ cats: { mags: "living" }, humans: { pell: { room: "living", searching: true } } });
  s = setMood(s, { broom: 3 }).state;
  r = endRound(s, { d6: dice() });
  assert.equal(cat(r.state, "mags").status, "outside", "one cat in sight: it's that cat");
  const ev = [];
  const m = setMood(base({ humans: { pell: "loo" } }), { broom: 3 }).state;
  addMood(m, stepEntry({ side: "broom", steps: 1, cause: "a mess", candidates: [], seenBy: ["pell"] }), ev);
  assert.match(texts(ev), /stays full/, "nobody in sight");
});

test("temptation: never the same cat two rounds running; it decides at once; only a cat that gives in has acted first", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { cats: { tilly: "kitchen", biscuit: "kitchen" }, pets: { pudding: { mode: "hiding", until: 99 } } });
  s = tempt(s, { catId: "tilly", instinct: "climber" }).state;
  assert.match(findOption(s, "biscuit", "move:hall").disabled, /tempted and goes first/);
  s = answerTemptation(s, { choice: "resisted", cattitude: 1 }).state;
  assert.equal(findOption(s, "biscuit", "move:hall").disabled, null, "she resisted: no going first");
  assert.equal(cat(s, "tilly").acted, false);
  s = beginRound(s).state;
  assert.deepEqual(temptationOptions(s).map(o => o.catId), ["biscuit"]);
});

test("a cat that ends its turn in an awake dog's room without dealing with it is chased back the way it came", () => {
  const dog = s => arrange(s, { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  let s = dog(base({ cats: { tilly: { where: "kitchen", status: "free", cameFrom: "hall" }, mags: { where: "kitchen", status: "free", cameFrom: "hall", dealt: ["pudding"] }, biscuit: { where: "kitchen", status: "free", arrivedSpent: null } } }));
  s.roundSerial = 3;
  cat(s, "biscuit").arrivedSpent = 3; // climbed in: deals with it first thing next turn
  let r = endRound(s, { d6: dice(1, 1, 1, 1) });
  assert.equal(cat(r.state, "tilly").where, "hall", "chased back the way it came");
  assert.equal(cat(r.state, "mags").where, "kitchen", "it dealt with the dog (or helped)");
  assert.equal(cat(r.state, "biscuit").where, "kitchen", "it had no Action left");
  assert.match(texts(r.events), /Pudding chases Two-Bin Tilly back into the hall/);
  // helping the cat who deals with it counts as dealing
  s = dog(base({ cats: { tilly: "kitchen", velvet: "kitchen" } }));
  r = roll(s, "tilly", "confront:pudding", "sneaky", "clean", { helpers: ["velvet"] });
  assert.deepEqual(cat(r.state, "velvet").dealt, ["pudding"]);
  r = endRound(r.state, { d6: dice(1, 1, 1) });
  assert.equal(cat(r.state, "velvet").where, "kitchen");
  assert.equal(cat(r.state, "tilly").where, "kitchen", "slipped past this turn");
  // P14: a Scrapper facing the dog can be tempted by it — it squares up, which isn't dealing with it, so it's chased back
  s = dog(base({ cats: { biscuit: { where: "kitchen", status: "free", cameFrom: "hall" } } }));
  s.rooms.kitchen.tempt = [];
  s = tempt(s, { catId: "biscuit", instinct: "scrapper" }).state;
  r = answerTemptation(s, { choice: "gaveIn", cattitude: 2 });
  assert.match(texts(r.events), /You square up to it\. Noise\. \(That isn't dealing with it: you still have to\.\)/);
  assert.deepEqual(cat(r.state, "biscuit").dealt ?? [], [], "squaring up isn't dealing with it");
  assert.ok((r.state.noise ?? []).some(x => x.room === "kitchen"));
  r = endRound(r.state, { d6: dice(1, 1, 1) });
  assert.equal(cat(r.state, "biscuit").where, "hall", "chased back at the end of its turn");
  // P14 (Charge): a cat with no Action left — it gave in first — that walks into the dog's room stays, and deals with it next turn
  s = base({ cats: { tilly: "hall" }, pets: { pudding: { mode: "awake", room: "kitchen" } } });
  s = tempt(s, { catId: "tilly", instinct: "curious" }).state;
  s = answerTemptation(s, { choice: "gaveIn", cattitude: 2 }).state;
  s = doAction(s, "tilly", "move:kitchen").state;
  r = endRound(s, { d6: dice(1, 1, 1) });
  assert.equal(cat(r.state, "tilly").where, "kitchen", "it had no Action left");
});

test("hauling (v0.7): a Knocker's Knack, its noise in the room it ends up in, and a failed haul in a dog's room is chased back", () => {
  let s = base({ cats: { velvet: { where: "kitchen", status: "free", carrying: true, cameFrom: "hall" }, tilly: { where: "kitchen", status: "free", carrying: true, cameFrom: "hall" } } });
  s.prize.carriers = ["velvet", "tilly"];
  const ctx = rollContext(s, "velvet", "move:hall");
  assert.deepEqual(ctx.options.map(o => [o.approach, o.difficulty, o.knack]), [["sneaky", 0, true], ["savage", 0, true]], "plain; pushing is a Knocker's Knack");
  let r = roll(s, "velvet", "move:hall", "savage", "scrape", { helpers: ["tilly"] });
  assert.deepEqual(r.state.noise.map(x => x.room), ["hall"], "the noise is where it ends up");
  s = arrange(s, { pets: { pudding: { mode: "awake", room: "kitchen" } } });
  assert.equal(findOption(s, "velvet", "move:hall").disabled, null, "hauling it out of the dog's room counts as leaving");
  r = roll(s, "velvet", "move:hall", "savage", "flop", { helpers: ["tilly"] });
  assert.ok(["velvet", "tilly"].every(id => cat(r.state, id).where === "hall"), "a failed haul there: chased back");
  assert.equal(r.state.prize.carriers.length, 0, "…and the prize dropped");
  assert.equal(r.state.prize.room, "hall", "v0.9: where they end up");
});

test("the holder's 6: out through the nearest entrance, which stays open; pets pass closed doors", () => {
  let s = base({ cats: { velvet: { where: "kitchen", status: "held", heldBy: "pell" } }, humans: { pell: { room: "kitchen", holding: "velvet" } } });
  let r = endRound(s, { d6: dice(6) });
  assert.equal(cat(r.state, "velvet").status, "outside");
  assert.match(texts(r.events), /out through the Open kitchen window/);
  assert.equal(r.state.entrances.find(e => e.key === "window").open, true);
  s = arrange(base({ cats: { mags: "kitchen" } }), { pets: { pudding: { mode: "awake", room: "utility" } } });
  assert.equal(s.ways.find(w => w.id === "kitchen~utility").open, false);
  r = endRound(s, { d6: dice(6, 1) });
  assert.equal(pet(r.state, "pudding").room, "kitchen", "Pudding sniffs through the shut door");
});
