/**
 * module/logic/mood.mjs — the two-meter Mood ledger (Ch 5; AUTOMATION.md §3).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { foldMood, upsertEntry, rollEntry, stepEntry, undoLast, liveEntries, nextSeq, roomLeft } from "../module/logic/mood.mjs";

const roll = (eventId, approach, result, seen = true, extra = {}) => rollEntry({ eventId, approach, result, seen, ...extra });
const build = entries => entries.reduce((l, e) => upsertEntry(l, e).ledger, []);

test("the meters are a fold of the ledger: Sweet fills Cuddle, the rest Broom", () => {
  const l = build([roll("a", "sweet", "clean"), roll("b", "savage", "scrape"), roll("c", "sneaky", "clean"), roll("d", "streetwise", "clean")]);
  const f = foldMood(l, 6);
  assert.equal(f.cuddle, 1);
  assert.equal(f.broom, 2);
  assert.equal(f.patience, 6);
  assert.deepEqual(f.full, { broom: false, cuddle: false });
});

test("one event, one change: re-applying a roll card replaces its entry (a Push re-folds)", () => {
  let l = build([roll("a", "savage", "flop")]);
  assert.equal(foldMood(l, 6).broom, 2);
  const again = upsertEntry(l, roll("a", "savage", "flop"));
  assert.equal(again.replaced, true);
  assert.equal(foldMood(again.ledger, 6).broom, 2, "the same card twice still counts once");
  l = upsertEntry(again.ledger, roll("a", "savage", "clean", true, { pushedWithMood: true })).ledger;
  assert.equal(foldMood(l, 6).broom, 2, "pushed with the Mood into a Clean: 1 + 1");
  assert.equal(l.length, 1);
  assert.equal(liveEntries([...l, { ...l[0], id: "dup", seq: 9 }]).length, 1, "duplicates by eventId keep the latest");
});

test("a Flop goes on whichever meter is fuller at that point in the fold", () => {
  const l = build([roll("a", "sweet", "clean"), roll("b", "sweet", "clean"), roll("c", "savage", "flop")]);
  const f = foldMood(l, 6);
  assert.equal(f.cuddle, 4, "Cuddle was fuller, so the Savage Flop went there");
  assert.equal(f.broom, 0);
  assert.deepEqual(f.resolved[l[2].id], { side: "cuddle", steps: 2, applied: 2, lost: 0, stopped: false, before: { broom: 0, cuddle: 2 } });
});

test("a kid doubles Cuddle; unseen rolls change nothing unless pushed with the Mood", () => {
  const l = build([roll("a", "sweet", "scrape", true, { kid: true }), roll("b", "savage", "flop", false), roll("c", "savage", "clean", false, { pushedWithMood: true })]);
  const f = foldMood(l, 6);
  assert.equal(f.cuddle, 2);
  assert.equal(f.broom, 1);
});

test("meters stop at Patience and report full; a trigger empties one and drops Patience by 1 (min 2)", () => {
  let l = build([roll("a", "savage", "flop"), roll("b", "savage", "flop")]);
  let f = foldMood(l, 3);
  assert.equal(f.broom, 3, "clamped at Patience");
  assert.equal(f.full.broom, true);
  l = upsertEntry(l, { kind: "trigger", side: "broom", target: "cat1" }).ledger;
  f = foldMood(l, 3);
  assert.equal(f.broom, 0);
  assert.equal(f.patience, 2);
  l = build([...l, roll("c", "savage", "flop"), { kind: "trigger", side: "broom", target: "cat1" }]);
  assert.equal(foldMood(l, 3).patience, 2, "never below 2");
  assert.equal(foldMood([], 1).patience, 2, "a house can't start below 2 either");
});

test("v0.9: after a trigger the other meter drops to one below the new Patience if it's at or above it (no instant chains)", () => {
  const l = build([roll("a", "sweet", "clean"), roll("b", "sweet", "clean"), roll("c", "sweet", "clean"),
    roll("d", "savage", "scrape"), roll("e", "savage", "scrape"), roll("f", "savage", "scrape"), roll("g", "savage", "scrape"),
    { kind: "trigger", side: "broom", target: "x" }]);
  const f = foldMood(l, 4);
  assert.equal(f.patience, 3);
  assert.equal(f.cuddle, 2, "Cuddle 3 is at the new Patience 3: one below");
  assert.equal(f.full.cuddle, false);
  assert.equal(f.resolved[l.at(-1).id].otherDropped, "cuddle");
  // below the new Patience: it stays where it is
  const k = build([roll("a", "sweet", "clean"), ...["d", "e", "f", "g"].map(id => roll(id, "savage", "scrape")), { kind: "trigger", side: "broom", target: "x" }]);
  assert.deepEqual([foldMood(k, 4).cuddle, foldMood(k, 4).patience], [1, 3]);
  assert.equal(foldMood(k, 4).resolved[k.at(-1).id].otherDropped, null);
});

test("v0.9: steps beyond a full meter are lost, and a give-in's step never fills it", () => {
  const l = build([roll("a", "savage", "flop"), roll("b", "savage", "flop")]);
  const f = foldMood(l, 3);
  assert.deepEqual([f.broom, f.resolved[l[1].id].applied, f.resolved[l[1].id].lost], [3, 1, 1]);
  const m = build([roll("a", "savage", "flop"), stepEntry({ side: "broom", steps: 1, cause: "gave in", noFill: true })]);
  const g = foldMood(m, 3);
  assert.equal(g.broom, 2, "it stops one short");
  assert.equal(g.full.broom, false);
  assert.equal(g.resolved[m[1].id].stopped, true);
  const n = build([stepEntry({ side: "cuddle", steps: 2, cause: "a kid's fuss", noFill: true })]);
  assert.equal(foldMood(n, 4).cuddle, 2, "room enough: the whole step lands");
});

test("pending (autoMood confirm) and rejected entries don't count; set entries assign", () => {
  let l = build([{ ...stepEntry({ side: "broom", steps: 1, cause: "mess" }), pending: true }]);
  assert.equal(foldMood(l, 4).broom, 0);
  l = build([...l, { ...stepEntry({ side: "broom", steps: 2, cause: "x" }), rejected: true }, { kind: "set", broom: 2, cuddle: 1, patience: 5 }]);
  const f = foldMood(l, 4);
  assert.deepEqual([f.broom, f.cuddle, f.patience], [2, 1, 5]);
  assert.equal(roomLeft(f, "broom"), 3);
});

test("step entries, manual minus, undo and sequence numbers", () => {
  let l = build([stepEntry({ side: "broom", steps: 1, cause: "mess" }), stepEntry({ side: "broom", steps: 2, cause: "x" }), stepEntry({ side: "broom", steps: -1, cause: "manual" })]);
  assert.equal(foldMood(l, 6).broom, 2);
  assert.equal(nextSeq(l), 4);
  const u = undoLast(l);
  assert.equal(u.removed.steps, -1);
  assert.equal(foldMood(u.ledger, 6).broom, 3);
  assert.deepEqual(undoLast([]), { ledger: [], removed: null });
  assert.throws(() => stepEntry({ side: "sideways", steps: 1 }));
  assert.equal(foldMood(build([stepEntry({ side: "cuddle", steps: -3, cause: "x" })]), 4).cuddle, 0, "never below 0");
});
