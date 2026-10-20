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

export function makeGang(rng, size, p) {
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

export function hasKnack(cat, tags) {
  return cat.instincts.some(i => KNACK[i].some(t => tags.includes(t)));
}
