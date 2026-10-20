/**
 * Shared test fixtures (no tests here): the ready-made gang from Chapter 3 as
 * robbery cats, scripted dice, and small helpers for driving round.mjs.
 */
import { findHouse } from "../module/logic/house-catalog.mjs";
import { newRobbery, clone } from "../module/logic/round.mjs";

/** Chapter 3, "The Ready-Made Gang". */
export const GANG = {
  tilly: { id: "tilly", name: "Two-Bin Tilly", r: { streetwise: 3, sneaky: 2, sweet: 1, savage: 1 }, instincts: ["curious", "climber"], body: "lean" },
  biscuit: { id: "biscuit", name: "Big Biscuit", r: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instincts: ["scrapper", "foodie"], body: "chonky" },
  velvet: { id: "velvet", name: "Velvet", r: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instincts: ["lapCat", "knocker"], body: "lean" },
  mags: { id: "mags", name: "Marmalade Mags", r: { sneaky: 3, savage: 2, streetwise: 1, sweet: 1 }, instincts: ["boxSitter", "hunter"], body: "lean" },
  pip: { id: "pip", name: "Pip", r: { sweet: 3, savage: 2, sneaky: 1, streetwise: 1 }, instincts: ["hunter", "curious"], body: "lean" }
};

/** A robbery with these gang members (default: the four without Pip). */
export function robbery(houseKey = "number-12", names = ["tilly", "biscuit", "velvet", "mags"]) {
  return newRobbery(findHouse(houseKey), { cats: names.map(n => GANG[n]) });
}

/** A d6 source that plays these faces in order, then throws (so a test sees every die it uses). */
export function dice(...faces) {
  const q = [...faces];
  const f = () => { if (!q.length) throw new Error("the test ran out of scripted dice"); return q.shift(); };
  f.left = () => q.length;
  return f;
}

/** Put cats, humans and pets where a test wants them (mutates a clone). */
export function arrange(state, { cats = {}, humans = {}, pets = {}, round = null, stage = "cats" } = {}) {
  const s = clone(state);
  if (round !== null) s.round = round;
  s.stage = stage;
  for (const [id, v] of Object.entries(cats)) Object.assign(s.cats.find(c => c.id === id), typeof v === "string" ? { where: v, status: v === "outside" ? "outside" : "free" } : v);
  for (const [k, v] of Object.entries(humans)) Object.assign(s.humans.find(h => h.key === k), typeof v === "string" ? { room: v } : v);
  for (const [k, v] of Object.entries(pets)) Object.assign(s.pets.find(p => p.key === k), typeof v === "string" ? { room: v } : v);
  return s;
}

export const cat = (s, id) => s.cats.find(c => c.id === id);
export const human = (s, k) => s.humans.find(h => h.key === k);
export const pet = (s, k) => s.pets.find(p => p.key === k);
export const texts = events => events.map(e => e.text).join("\n");
