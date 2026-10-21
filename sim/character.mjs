/**
 * Legal random cats, made the way CORE-RULES "Your cat" says players make them,
 * and a validator that rejects an illegal cat (sim/README.md §1).
 */
import { APPROACHES, INSTINCTS } from "./rules.mjs";

const NAMES = ["Patch", "Two-Bin Tilly", "Smudge", "Biscuit Joe", "Fishbone", "Velvet", "Alley Pearl", "Gutter Prince",
  "Muddy Paws", "Scratch", "Bins", "Marmalade Mags", "Soot", "Lucky Lou", "Wonky", "Pip"];

export function makeCat(rng, id, p) {
  const ratings = rng.shuffle([3, 2, 1, 1]);
  const r = Object.fromEntries(APPROACHES.map((a, i) => [a, ratings[i]]));
  const first = rng.pick(INSTINCTS);
  let second = rng.pick(INSTINCTS);
  while (second === first) second = rng.pick(INSTINCTS); // reroll duplicates
  return {
    id, name: NAMES[rng.int(0, NAMES.length - 1)],
    r, instincts: [first, second], body: rng.chance(0.5) ? "lean" : "chonky",
    cattitude: p.cattitudeStart, lives: p.livesPerRobbery,
  };
}

/** The book's ready-made gang (Chapter 3), in the order the book adds them: four cats, then Pip. */
export const READY_MADE = [
  { name: "Two-Bin Tilly", r: { streetwise: 3, sneaky: 2, sweet: 1, savage: 1 }, instincts: ["curious", "climber"], body: "lean" },
  { name: "Big Biscuit", r: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instincts: ["scrapper", "foodie"], body: "chonky" },
  { name: "Velvet", r: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instincts: ["lapCat", "knocker"], body: "lean" },
  { name: "Marmalade Mags", r: { sneaky: 3, savage: 2, streetwise: 1, sweet: 1 }, instincts: ["boxSitter", "hunter"], body: "lean" },
  { name: "Pip", r: { sweet: 3, savage: 2, sneaky: 1, streetwise: 1 }, instincts: ["hunter", "curious"], body: "lean" },
];

/**
 * A gang: random legal cats (the default), or the ready-made gang (p.gang === "ready"; a gang of
 * three is the book's advice, "leave out Pip and one other", cycling which other cat sits out).
 */
export function makeGang(rng, size, p) {
  if (p.gang === "ready") {
    let picks = READY_MADE.slice(0, Math.min(size, 5));
    if (size === 3) { const out = rng.int(0, 3); picks = READY_MADE.slice(0, 4).filter((_, i) => i !== out); }
    return picks.map((c, i) => ({ id: `cat${i + 1}`, name: c.name, r: { ...c.r }, instincts: [...c.instincts], body: c.body,
      cattitude: p.cattitudeStart, lives: p.livesPerRobbery }));
  }
  return Array.from({ length: size }, (_, i) => makeCat(rng, `cat${i + 1}`, p));
}

export function validateCat(cat) {
  const errors = [];
  const vals = APPROACHES.map(a => cat.r[a]).sort((x, y) => y - x);
  if (vals.join() !== "3,2,1,1") errors.push(`ratings must be 3,2,1,1, got ${vals.join()}`);
  if (cat.instincts.length !== 2 || cat.instincts[0] === cat.instincts[1]) errors.push("two different instincts");
  for (const i of cat.instincts) if (!INSTINCTS.includes(i)) errors.push(`unknown instinct ${i}`);
  if (!["lean", "chonky"].includes(cat.body)) errors.push(`bad body ${cat.body}`);
  return errors;
}

/** The action tags each instinct's Knack covers (CORE-RULES "Your cat"; DESIGN.md Instincts). */
export const KNACK = {
  curious: ["open"], knocker: ["knock"], boxSitter: ["hide"], hunter: ["chase", "fight"],
  lapCat: ["charm"], foodie: ["food"], climber: ["climb"], scrapper: ["fight"],
};

export function hasKnack(cat, tags, p) {
  return cat.instincts.some(i => KNACK[i].some(t => tags.includes(t) && !(p?.hunterNoFight && i === "hunter" && t === "fight")));
}
