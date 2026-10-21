/**
 * The playtest fix round (simulator package P14; book/REVIEW.md rows 149–152) —
 * the rulings outside the getaway and Cred (those are in getaway.test.mjs and
 * cred.test.mjs): the Den, the dog that walks in, the driven-off pet, the cat
 * flap after a Shoo!, and the human still carrying the prize.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { beginRound, endRound, setMood, markNoise } from "../module/logic/round.mjs";
import { rollContext, applyRoll, findOption, doAction } from "../module/logic/actions.mjs";
import { robbery, dice, arrange, cat, human, pet, texts } from "./fixtures.mjs";

let n = 0;
function roll(s, id, optionId, approach, result) {
  const ctx = rollContext(s, id, optionId);
  return applyRoll(s, { eventId: `p14-${++n}`, catId: id, optionId, approach, result, seen: ctx.seenBy.length > 0, seenBy: ctx.seenBy, kid: ctx.kid });
}
const number12 = (extra = {}) => arrange(beginRound(robbery("number-12")).state, { round: 3, pets: { pudding: { mode: "hiding", until: 99 } }, humans: { pell: "living" }, ...extra });

test("walking into the Den isn't being shut in: only a cat a human shuts in is Shut In", () => {
  let s = number12({ cats: { tilly: "hall" } });
  s = doAction(s, "tilly", "move:loo").state;
  assert.deepEqual([cat(s, "tilly").where, cat(s, "tilly").status], ["loo", "free"]);
  assert.equal(s.ways.find(w => w.den).open, true, "the Den's door stays open");
  assert.ok(findOption(s, "tilly", "move:hall"), "and she can walk out again");
});

test("a dog that walks into the cats' room on its routine barks from next turn", () => {
  let s = number12({ cats: { tilly: { where: "living", status: "free", dealt: ["pudding"] } }, pets: { pudding: { mode: "awake", room: "kitchen" } } });
  let r = endRound(s, { d6: dice(3, 1, 1, 1, 1, 1) }); // Pudding: 3, the living room
  assert.equal(pet(r.state, "pudding").room, "living");
  assert.ok(!r.events.some(e => e.type === "bark"), "no bark the turn it walks in");
  s = beginRound(r.state).state;
  cat(s, "tilly").dealt = ["pudding"]; // she slipped past him this turn
  r = endRound(s, { d6: dice(1, 1, 1, 1, 1, 1) });
  assert.match(texts(r.events), /Pudding barks at the cat in the living room/);
});

test("a driven-off pet comes back in the room it started in", () => {
  const s = number12({ pets: { pudding: { mode: "hiding", until: 3, room: "living" } } });
  const r = endRound(s, { d6: dice(1, 1, 1, 1, 1, 1) });
  assert.deepEqual([pet(r.state, "pudding").mode, pet(r.state, "pudding").room], ["awake", "kitchen"]);
  assert.match(texts(r.events), /Pudding is back in the kitchen/);
});

test("after a Shoo!, a cat flap gets locked: Streetwise, Hard, to open it again from inside", () => {
  let s = setMood(number12({ cats: { tilly: "utility", mags: "utility" }, humans: { pell: "utility" } }), { broom: 3 }).state;
  const r = roll(s, "tilly", "free", "savage", "scrape");
  assert.equal(cat(r.state, "tilly").status, "outside");
  assert.match(texts(r.events), /out through the Cat flap in the back door, locks it and stays in the utility room/);
  assert.equal(r.state.entrances.find(e => e.key === "flap").open, false);
  assert.deepEqual(findOption(r.state, "mags", "reopen:flap").roll.options, [["streetwise", 2, "open"]]);
});

test("the human carrying the prize answers noise and follows their routine until the Clock first puts it down", () => {
  let s = arrange(beginRound(robbery("number-12")).state, { pets: { pudding: { mode: "hiding", until: 99 } } });
  assert.equal(s.prize.withHuman, "pell", "round 1: Mr Pell still has the chicken");
  s = markNoise(s, "living").state;
  let r = endRound(s, { d6: dice(1, 1, 1, 1, 1, 1) });
  assert.equal(human(r.state, "pell").room, "living", "he goes to see, chicken and all");
  r = endRound(arrange(beginRound(robbery("number-12")).state, { pets: { pudding: { mode: "hiding", until: 99 } } }), { d6: dice(5, 1, 1, 1, 1, 1) });
  assert.equal(human(r.state, "pell").room, "living", "no noise: his routine (5, the living room)");
  assert.equal(beginRound(r.state).state.prize.room, "kitchen", "round 2: the Clock puts it in the kitchen (he takes it there)");
});
