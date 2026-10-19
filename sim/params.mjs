/**
 * Every judgement call the simulator makes, as a named parameter
 * (sim/README.md §2). Each has a default (the best reading of
 * docs/CORE-RULES.md v0.1), its alternatives, a title, a doc line and a ref.
 * `pkg: true` marks a rule-change lever used by packages, not an ambiguity.
 */

export const PARAMS = {
  // ---- dice ----
  diceCap: { def: 5, alt: [4, 6], title: "Most dice in one roll", ref: "CORE-RULES Rolling", pkg: true,
    doc: "Hard cap on the pool before Difficulty." },
  helpCap: { def: 2, alt: [1], title: "Most help dice", ref: "CORE-RULES Together", pkg: true,
    doc: "Help/group dice beyond this are ignored." },
  capOrder: { def: "first", alt: ["last"], title: "Cap before or after Difficulty", ref: "CORE-RULES Rolling",
    doc: "first: cap the pool at 5, then Difficulty removes dice (Difficulty always bites). last: remove first, then cap." },
  sneakyCleanFree: { def: true, alt: [false], title: "A seen Sneaky Clean takes no Mood step", ref: "CORE-RULES The Mood", pkg: true,
    doc: "They never noticed." },
  flopSteps: { def: 2, alt: [1, 3], title: "Mood steps for a seen Flop", ref: "CORE-RULES The Mood", pkg: true, doc: "" },
  flopDirection: { def: "nearer", alt: ["lean"], title: "Which way a Flop moves the Mood", ref: "CORE-RULES The Mood",
    doc: "nearer: toward the end the Mood is already nearer (a flop makes their mood worse). lean: toward the approach's lean." },
  // ---- the Mood ----
  patienceShift: { def: 0, alt: [-1, 1], title: "Shift every house's Patience", ref: "houses.mjs", pkg: true, doc: "" },
  patienceDrop: { def: 1, alt: [0], title: "Patience lost per trigger", ref: "CORE-RULES Shoo!/Scooped!", pkg: true, doc: "" },
  minPatience: { def: 2, alt: [1, 3], title: "Lowest Patience", ref: "CORE-RULES Shoo!/Scooped!", pkg: true, doc: "" },
  resetTo: { def: "calm", alt: ["stay"], title: "Mood after a trigger", ref: "CORE-RULES Shoo!/Scooped!", pkg: true,
    doc: "calm: back to 0. stay: one step back from the end it hit." },
  shutOnShoo: { def: true, alt: [false], title: "Shoo! shuts the entrance", ref: "CORE-RULES Shoo!", pkg: true, doc: "" },
  // ---- noise and humans ----
  noiseRange: { def: 2, alt: [1, 3], title: "How far noise carries (rooms)", ref: "CORE-RULES A round",
    doc: "The closest awake human within this many rooms walks in." },
  noiseAnswer: { def: "closest", alt: ["all"], title: "Who answers a noise", ref: "CORE-RULES A round",
    doc: "closest: one human per noise. all: every human in range." },
  distractRounds: { def: 0, alt: [1], title: "How long a Sweet distraction lasts", ref: "CORE-RULES Sweet",
    doc: "0: until the end of this round (the gang acts while they look). 1: until the end of the next round." },
  lifeEffect: { def: "bolt", alt: ["hide"], title: "Where a cat ends up after spending a Life", ref: "CORE-RULES Lives", pkg: true,
    doc: "bolt: it bolts outside (the entrance stays open). hide: it slips free, hidden in the same room." },
  // ---- caught ----
  holdTable: { def: [3, 5], alt: [[2, 5], [4, 5]], title: "Holder's d6", ref: "CORE-RULES Caught",
    doc: "[keep up to, den up to]; above that the cat is put outside." },
  wriggleDiff: { def: 1, alt: [0, 2], title: "Wriggle-free Difficulty", ref: "CORE-RULES Caught", pkg: true, doc: "" },
  livesPerRobbery: { def: 1, alt: [0, 2], title: "Lives a cat may spend per robbery", ref: "CORE-RULES Lives", pkg: true, doc: "" },
  lightsOut: { def: 2, alt: [1, 3], title: "Rounds after the Prize Clock until Lights Out", ref: "CORE-RULES Ending", pkg: true,
    doc: "Any cat still inside at Lights Out is left behind." },
  // ---- resources ----
  cattitudeStart: { def: 2, alt: [1, 3], title: "Starting Cattitude", ref: "CORE-RULES Your cat", pkg: true, doc: "" },
  cattitudeMax: { def: 5, alt: [3], title: "Most Cattitude", ref: "CORE-RULES Your cat", pkg: true, doc: "" },
  pushWithMood: { def: true, alt: [false], title: "A Push can be paid with the Mood", ref: "CORE-RULES Push", pkg: true, doc: "" },
  // ---- temptation ----
  temptPerRound: { def: 1, alt: [0, 2], title: "Temptations per round (whole gang)", ref: "CORE-RULES A round", pkg: true, doc: "" },
  tempter: { def: "random", alt: ["mean"], title: "Which cat the Storyteller tempts", ref: "CORE-RULES A round",
    doc: "random: any eligible cat. mean: the one where giving in hurts most (seen, carrying, at the prize)." },
  // ---- prize ----
  portionScale: { def: 1, alt: [0.75, 1.5], title: "Scale food portions", ref: "houses.mjs", pkg: true, doc: "" },
  clockShift: { def: 0, alt: [-2, 2], title: "Shift every Prize Clock (rounds)", ref: "houses.mjs", pkg: true, doc: "" },
  // ---- gang (players' policy, not rules) ----
  gangSize: { def: 4, alt: [3, 5], title: "Cats in the gang", ref: "CORE-RULES table (3–5 players)", doc: "" },
  pushPolicy: { def: "sensible", alt: ["never", "always"], title: "When players Push", ref: "policy",
    doc: "sensible: push a Flop that matters if Cattitude or safe Mood allows." },
  resistPolicy: { def: "sensible", alt: ["never", "always"], title: "When players resist a temptation", ref: "policy", doc: "" },
  boldness: { def: "mixed", alt: ["careful", "bold"], title: "How players handle a watching human", ref: "policy",
    doc: "careful: wait hidden for the human to leave while the clock allows. bold: just do it. mixed: careful early, bold late." },
};

export function defaults() {
  return Object.fromEntries(Object.entries(PARAMS).map(([k, v]) => [k, v.def]));
}

/** Readings that bracket the real game (sim/README.md §3). */
export const PRESETS = {
  generous: { noiseRange: 1, tempter: "random", noiseAnswer: "closest", distractRounds: 1, holdTable: [4, 5] },
  strict: { noiseRange: 3, tempter: "mean", noiseAnswer: "all", distractRounds: 0, holdTable: [2, 5] },
};

/** Rule-change packages (sim/README.md §4). P0 = core rules v0.1 as written. */
export const PACKAGES = {
  P0: {},
};

export function makeParams(overrides = {}) {
  return { ...defaults(), ...overrides };
}
