/**
 * The ready-to-play games' pure part (module/logic/ready-to-play.mjs): Chapter 3's default gang for
 * the quick start, the scenes' layouts (from the Ready to Play compendium's sources), and where the
 * tokens stand — every resident in its room, every cat outside by an entrance, no two tokens on top
 * of each other, a token in the right room left alone, a held cat beside its holder, the getaway's
 * spaces, the van and the warden.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { HOUSES, houseByKey } from "../module/logic/house-catalog.mjs";
import { newRobbery, clone } from "../module/logic/round.mjs";
import { startGetaway } from "../module/logic/getaway.mjs";
import {
  READY_MADE, defaultGangSize, readyMadeFor, areas, areaAt, spotsIn, targetsFor, planTokens, planWarden, HIDDEN_ALPHA
} from "../module/logic/ready-to-play.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const layoutOf = key => JSON.parse(readFileSync(join(ROOT, "packs/_source/scenes", `${key}.json`), "utf8")).flags["cat-burglars"].layout;
const overlaps = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const inside = (p, r, size) => p.x >= r.x && p.y >= r.y && p.x + size <= r.x + r.w && p.y + size <= r.y + r.h;
const boxOf = r => [r.x, r.y, r.x + r.w, r.y + r.h];

const CATS = [
  { id: "tilly", name: "Two-Bin Tilly", body: "lean", instincts: ["curious", "climber"] },
  { id: "biscuit", name: "Big Biscuit", body: "chonky", instincts: ["scrapper", "foodie"] },
  { id: "velvet", name: "Velvet", body: "lean", instincts: ["lapCat", "knocker"] },
  { id: "mags", name: "Marmalade Mags", body: "lean", instincts: ["boxSitter", "hunter"] },
  { id: "pip", name: "Pip", body: "lean", instincts: ["hunter", "curious"] }
];
const robbery = (key, n = 5) => newRobbery(houseByKey[key], { id: "r", cats: CATS.slice(0, n) });
/** Tokens standing where a plan put everyone. */
const tokensAt = places => Object.entries(places).map(([ref, p], i) => ({ id: `t${i}`, ref, x: p.x, y: p.y, hidden: p.hidden, alpha: p.alpha }));

function noOverlaps(places, size) {
  const list = Object.entries(places);
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const [ra, a] = list[i], [rb, b] = list[j];
    assert.ok(!overlaps([a.x, a.y, a.x + size, a.y + size], [b.x, b.y, b.x + size, b.y + size]), `${ra} and ${rb} overlap`);
  }
}

test("the quick start ticks Chapter 3's gang for the number of players", () => {
  assert.deepEqual(READY_MADE, ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags", "pip"]);
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(defaultGangSize), [4, 3, 3, 3, 4, 5, 5]);
  assert.deepEqual(readyMadeFor(5), READY_MADE);
  assert.deepEqual(readyMadeFor(4), ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags"], "four: leave out Pip");
  const three = readyMadeFor(3);
  assert.equal(three.length, 3);
  assert.ok(three.includes("velvet"), "three: keep Velvet");
  assert.ok(!three.includes("pip"), "three: leave out Pip");
  assert.equal(three.filter(k => ["two-bin-tilly", "big-biscuit", "marmalade-mags"].includes(k)).length, 2, "and one of Tilly, Biscuit and Mags");
});

test("spots: an even lattice inside the area, never overlapping, clear spots first, nearest the entrance first", () => {
  const r = { x: 100, y: 50, w: 288, h: 200 };
  const s = spotsIn(r, 72);
  assert.equal(s.length, 3 * 2);
  for (const p of s) assert.ok(inside(p, r, 72), JSON.stringify(p));
  for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) assert.ok(!overlaps([s[i].x, s[i].y, s[i].x + 72, s[i].y + 72], [s[j].x, s[j].y, s[j].x + 72, s[j].y + 72]));
  const avoid = [[100, 50, 250, 130]];
  const a = spotsIn(r, 72, { avoid });
  assert.ok(!overlaps([a[0].x, a[0].y, a[0].x + 72, a[0].y + 72], avoid[0]), "a spot clear of the room's name comes first");
  assert.ok(overlaps([a.at(-1).x, a.at(-1).y, a.at(-1).x + 72, a.at(-1).y + 72], avoid[0]), "covered spots are last");
  const t = spotsIn(r, 72, { toward: { x: 388, y: 250 } });
  assert.deepEqual(t[0], s.at(-1), "nearest the marker first");
  assert.equal(spotsIn({ x: 0, y: 0, w: 60, h: 60 }, 72).length, 1, "a tiny area still has one spot");
});

test("every house's scene layout covers its rooms and entrances on whole grid squares, with nothing overlapping", () => {
  for (const h of HOUSES) {
    const L = layoutOf(h.key);
    assert.deepEqual(Object.keys(L.rooms).sort(), Object.keys(h.rooms).sort(), `${h.key}: every room`);
    assert.deepEqual(Object.keys(L.entrances).sort(), h.entrances.map(e => e.key).sort(), `${h.key}: every entrance`);
    for (const [k, r] of Object.entries(L.rooms)) {
      for (const v of [r.x, r.y, r.w, r.h]) assert.equal(v % L.grid, 0, `${h.key}/${k} sits on the grid`);
      const fl = h.map.floors[r.floor].rooms[k];
      assert.deepEqual([r.w / L.grid, r.h / L.grid], [fl[2], fl[3]], `${h.key}/${k} is the map's size`);
    }
    // same-floor rooms keep the map's places relative to each other
    for (const [k, r] of Object.entries(L.rooms)) {
      const f = h.map.floors[r.floor], origin = Object.entries(f.rooms)[0];
      const o = L.rooms[origin[0]];
      assert.deepEqual([(r.x - o.x) / L.grid, (r.y - o.y) / L.grid], [f.rooms[k][0] - origin[1][0], f.rooms[k][1] - origin[1][1]], `${h.key}/${k} is where the map puts it`);
    }
    const all = [...areas(L)];
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
      assert.ok(!overlaps(boxOf(all[i][1].rect), boxOf(all[j][1].rect)), `${h.key}: ${all[i][0]} and ${all[j][0]} overlap`);
    }
    for (const [k, a] of all) assert.ok(spotsIn(a.rect, L.token, a).length >= 6, `${h.key}: ${k} holds at least six tokens`);
    assert.equal(L.getaway.spaces.length, 5, "the garden, three spaces and the hideout");
    assert.equal(L.getaway.warden.length, 5);
    for (const [k, e] of Object.entries(L.entrances)) {
      const room = L.rooms[e.room];
      const d = e.side === "top" || e.side === "roof" ? room.y - (e.outside.y + e.outside.h) : e.side === "bottom" ? e.outside.y - (room.y + room.h) : e.side === "left" ? room.x - (e.outside.x + e.outside.w) : e.outside.x - (room.x + room.w);
      if (e.side !== "roof") assert.ok(d >= 0 && d < L.grid / 2, `${h.key}/${k}: the place to wait is right outside the wall`);
    }
  }
});

test("a new robbery: every resident in its starting room, every cat outside by an entrance, no two tokens overlapping", () => {
  for (const h of HOUSES) {
    const L = layoutOf(h.key), s = robbery(h.key);
    const { places, moves } = planTokens(s, L, []);
    assert.deepEqual(moves, [], "no tokens yet, so nothing to move");
    for (const x of h.humans) assert.ok(inside(places[`human:${x.key}`], L.rooms[x.start], L.token), `${h.key}: ${x.name} in the ${x.start}`);
    for (const p of h.pets) assert.ok(inside(places[`pet:${p.key}`], L.rooms[p.start], L.token), `${h.key}: ${p.name} in the ${p.start}`);
    for (const c of CATS) {
      const p = places[`cat:${c.id}`];
      assert.match(p.area, /^out:/, `${h.key}: ${c.name} waits outside`);
      assert.ok(inside(p, L.entrances[p.area.slice(4)].outside, L.token), `${h.key}: ${c.name} inside its place to wait`);
      const e = h.entrances.find(x => x.key === p.area.slice(4));
      if (c.body === "chonky") assert.notEqual(e.size, "tight", `${h.key}: Big Biscuit never waits at a Tight entrance`);
    }
    assert.ok(new Set(CATS.map(c => places[`cat:${c.id}`].area)).size > 1, `${h.key}: the gang spreads over the entrances`);
    noOverlaps(places, L.token);
  }
});

test("tokens follow: only who moved moves; a token dragged within its room stays, one dragged elsewhere goes back", () => {
  const L = layoutOf("number-12");
  let s = robbery("number-12", 4);
  const first = planTokens(s, L, []);
  let tokens = tokensAt(first.places);
  assert.deepEqual(planTokens(s, L, tokens).moves, [], "nothing changed, nothing moves");

  // Velvet comes in at the front door
  s = clone(s);
  Object.assign(s.cats.find(c => c.id === "velvet"), { where: "hall", status: "free", enteredBy: "front" });
  let plan = planTokens(s, L, tokens);
  assert.deepEqual(plan.moves.map(m => m.id), [tokens.find(t => t.ref === "cat:velvet").id], "only Velvet's token moves");
  assert.ok(inside(plan.places["cat:velvet"], L.rooms.hall, L.token));
  noOverlaps(plan.places, L.token);
  tokens = tokensAt(plan.places);

  // the Storyteller drags Velvet to another spot in the hall: she stays there
  const v = tokens.find(t => t.ref === "cat:velvet");
  const spot = spotsIn(L.rooms.hall, L.token).find(p => !tokens.some(t => t !== v && overlaps([p.x, p.y, p.x + 72, p.y + 72], [t.x, t.y, t.x + 72, t.y + 72])) && (p.x !== v.x || p.y !== v.y));
  Object.assign(v, spot);
  assert.deepEqual(planTokens(s, L, tokens).moves, [], "a token in the right room is left alone");
  // … dragged into the kitchen, it goes back to the hall at the next change
  Object.assign(v, { x: L.rooms.kitchen.x + 200, y: L.rooms.kitchen.y + 100 });
  plan = planTokens(s, L, tokens);
  assert.ok(inside(plan.places["cat:velvet"], L.rooms.hall, L.token), "back in the hall");

  // Velvet leaves the hall: she waits by the front door, the hall's entrance
  tokens = tokensAt(plan.places);
  s = clone(s);
  Object.assign(s.cats.find(c => c.id === "velvet"), { where: "outside", status: "outside" });
  plan = planTokens(s, L, tokens);
  assert.equal(plan.places["cat:velvet"].area, "out:front");
  // and a cat shooed out of the kitchen waits by the kitchen window
  tokens = tokensAt(plan.places);
  s = clone(s);
  Object.assign(s.cats.find(c => c.id === "tilly"), { where: "kitchen", status: "free" });
  tokens = tokensAt(planTokens(s, L, tokens).places);
  s = clone(s);
  Object.assign(s.cats.find(c => c.id === "tilly"), { where: "outside", status: "outside" });
  assert.equal(planTokens(s, L, tokens).places["cat:tilly"].area, "out:window");
});

test("held cats stand beside their holder, hiding cats are see-through, driven-off pets are hidden", () => {
  const L = layoutOf("birthday-cake");
  let s = robbery("birthday-cake", 5);
  let tokens = tokensAt(planTokens(s, L, []).places);
  s = clone(s);
  const dad = s.humans.find(h => h.key === "dad");
  Object.assign(s.cats.find(c => c.id === "pip"), { where: dad.room, status: "held", heldBy: "dad" });
  dad.holding = "pip";
  Object.assign(s.cats.find(c => c.id === "mags"), { where: "living", status: "free", hidden: true });
  const plan = planTokens(s, L, tokens);
  const pip = plan.places["cat:pip"], d = plan.places["human:dad"];
  const others = spotsIn(L.rooms[dad.room], L.token, { avoid: L.rooms[dad.room].avoid }).filter(p => !Object.values(plan.places).some(q => q !== pip && q.x === p.x && q.y === p.y));
  const dist = p => Math.hypot(p.x - d.x, p.y - d.y);
  assert.ok(others.every(p => dist(p) >= dist(pip) - 0.5), "Pip is on the free spot nearest Dad");
  assert.equal(plan.places["cat:mags"].alpha, HIDDEN_ALPHA);
  assert.ok(plan.moves.some(m => m.alpha === HIDDEN_ALPHA), "a hidden cat's token goes see-through");
  tokens = tokensAt(plan.places);
  const s2 = clone(s);
  s2.cats.find(c => c.id === "mags").hidden = false;
  assert.ok(planTokens(s2, L, tokens).moves.some(m => m.alpha === 1 && !("x" in m)), "and solid again when she comes out, without moving");

  const W = layoutOf("number-12");
  let n = robbery("number-12", 4);
  const t2 = tokensAt(planTokens(n, W, []).places);
  n = clone(n);
  Object.assign(n.pets[0], { mode: "hiding", until: 4 });
  const pl = planTokens(n, W, t2);
  assert.equal(pl.places["pet:pudding"].hidden, true);
  assert.ok(pl.moves.some(m => m.hidden === true), "Pudding's token is hidden while he's driven off");
});

test("a crowded room still takes everyone, inside its walls", () => {
  const L = layoutOf("number-12");
  const s = clone(robbery("number-12", 5));
  for (const c of s.cats) Object.assign(c, { where: "utility", status: "free" });
  s.humans[0].room = "utility";
  s.pets[0].room = "utility";
  const { places } = planTokens(s, L, []);
  for (const ref of [...s.cats.map(c => `cat:${c.id}`), "human:pell", "pet:pudding"]) assert.ok(inside(places[ref], L.rooms.utility, L.token), ref);
  noOverlaps(places, L.token);
});

test("the getaway: each cat on its space, the hideout, the van; the warden above his space", () => {
  for (const h of HOUSES) {
    const L = layoutOf(h.key);
    let s = clone(robbery(h.key, 5));
    s.cats[4].status = "held"; s.cats[4].where = h.humans[0].start; s.cats[4].heldBy = h.humans[0].key; // still inside: pinched
    s = startGetaway(s, "manual").state;
    assert.deepEqual(planWarden(s, L), { ...L.getaway.wardenVan, hidden: true }, "the van hasn't pulled up yet");
    let plan = planTokens(s, L, []);
    for (const c of s.cats.slice(0, 4)) assert.ok(inside(plan.places[`cat:${c.id}`], L.getaway.spaces[0], L.token), `${h.key}: ${c.name} in the garden`);
    assert.ok(inside(plan.places[`cat:${s.cats[4].id}`], L.getaway.van, L.token), "a cat still inside is pinched: in the van");
    noOverlaps(plan.places, L.token);
    s = clone(s);
    s.getaway.cats[s.cats[0].id].pos = 2;
    s.getaway.cats[s.cats[1].id] = { ...s.getaway.cats[s.cats[1].id], state: "home", pos: 4 };
    s.getaway.warden = 1;
    plan = planTokens(s, L, tokensAt(plan.places));
    assert.ok(inside(plan.places[`cat:${s.cats[0].id}`], L.getaway.spaces[2], L.token));
    assert.ok(inside(plan.places[`cat:${s.cats[1].id}`], L.getaway.spaces[4], L.token), "home in the hideout");
    assert.deepEqual(planWarden(s, L), { ...L.getaway.warden[1], hidden: false });
    assert.equal(planWarden({ ...s, phase: "robbery" }, L).hidden, true, "no warden in the house");
  }
});

test("areaAt finds the area under a point", () => {
  const L = layoutOf("okafor-box");
  const r = L.rooms.garage;
  assert.equal(areaAt(L, r.x + 10, r.y + 10), "room:garage");
  assert.equal(areaAt(L, L.getaway.van.x + 5, L.getaway.van.y + 5), "van");
  assert.equal(areaAt(L, -10, -10), null);
  assert.deepEqual(targetsFor(null, L), []);
});
