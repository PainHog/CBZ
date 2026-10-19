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
  distractEscalation: { def: true, alt: [false], title: "Each repeat distraction of the same human is 1 harder", ref: "CORE-RULES Sweet", pkg: true,
    doc: "They're getting wise to it: −1 die per earlier distraction of that human." },
  attentionVs: { def: "sneaky+sweet", alt: ["sneaky"], title: "Which rolls a watching human's Attention resists", ref: "CORE-RULES Rolling", pkg: true,
    doc: "sneaky: only Sneaky. sneaky+sweet: fooling them either way; Savage ignores Attention." },
  lureMess: { def: true, alt: [false], title: "A human who answers a noise made on purpose finds a mess: 1 Broom step", ref: "CORE-RULES A round", pkg: true, doc: "" },
  discovery: { def: true, alt: [false], title: "A human who walks in on a disturbed prize: 1 Broom step", ref: "CORE-RULES The prize", pkg: true,
    doc: "Disturbed = got down, partly eaten, or missing from its spot." },
  lifeEffect: { def: "bolt", alt: ["hide"], title: "Where a cat ends up after spending a Life", ref: "CORE-RULES Lives", pkg: true,
    doc: "bolt: it bolts outside (the entrance stays open). hide: it slips free, hidden in the same room." },
  // ---- caught ----
  holdTable: { def: [3, 5], alt: [[2, 5], [4, 5]], title: "Holder's d6", ref: "CORE-RULES Caught",
    doc: "[keep up to, den up to]; above that the cat is put outside." },
  wriggleDiff: { def: 1, alt: [0, 2], title: "Wriggle-free Difficulty", ref: "CORE-RULES Caught", pkg: true, doc: "" },
  livesPerRobbery: { def: 0, alt: [1], title: "Lives a cat may spend per robbery (0 = Lives are a campaign rule only)", ref: "CORE-RULES Lives", pkg: true, doc: "" },
  lightsOut: { def: 2, alt: [1, 3], title: "Rounds after the Prize Clock until Lights Out", ref: "CORE-RULES Ending", pkg: true,
    doc: "Any cat still inside at Lights Out is left behind." },
  // ---- resources ----
  cattitudeStart: { def: 2, alt: [1, 3], title: "Starting Cattitude", ref: "CORE-RULES Your cat", pkg: true, doc: "" },
  cattitudeMax: { def: 5, alt: [3], title: "Most Cattitude", ref: "CORE-RULES Your cat", pkg: true, doc: "" },
  cattitudeDie: { def: true, alt: [false], title: "Cattitude can also buy +1 die before a roll", ref: "CORE-RULES Push", pkg: true,
    doc: "Within the 5-dice cap; policy spends it on important rolls when it has 2+." },
  pushWithMood: { def: true, alt: [false], title: "A Push can be paid with the Mood", ref: "CORE-RULES Push", pkg: true, doc: "" },
  // ---- temptation ----
  temptPerRound: { def: 1, alt: [0, 2], title: "Temptations per round (whole gang)", ref: "CORE-RULES A round", pkg: true, doc: "" },
  tempter: { def: "random", alt: ["mean"], title: "Which cat the Storyteller tempts", ref: "CORE-RULES A round",
    doc: "random: any eligible cat. mean: the one where giving in hurts most (seen, carrying, at the prize)." },
  // ---- prize ----
  portionScale: { def: 1, alt: [0.75, 1.5], title: "Scale food portions", ref: "houses.mjs", pkg: true, doc: "" },
  clockShift: { def: 0, alt: [-2, 2], title: "Shift every Prize Clock (rounds)", ref: "houses.mjs", pkg: true, doc: "" },
  // ---- gang (players' policy, not rules) ----
  gangScaling: { def: true, alt: [false], title: "Gang-size scaling", ref: "CORE-RULES The table", pkg: true,
    doc: "3 cats: Patience +1 and Prize Clock +1. 5 cats: Prize Clock −1." },
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

/**
 * Rule-change packages (sim/README.md §4). Every lever is listed explicitly so a
 * package keeps meaning the same thing when the defaults move.
 * P1 = core rules v0.2 base (two Mood meters, every Action in view is a roll, zero-dice fix,
 *      one-round distraction, Lives bolt outside, front door lets one cat in, meow to be let out).
 * P6 = adopted for core rules v0.3 (2026-10-19); the defaults above equal P6.
 */
const OFF = { distractEscalation: false, attentionVs: "sneaky", lureMess: false, discovery: false, gangScaling: false,
  livesPerRobbery: 1, cattitudeDie: false };
export const PACKAGES = {
  P1: { ...OFF },
  P2: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet" },
  P3: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true },
  P4: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true },
  P5: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0 },
  P6: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true },
};
export const ADOPTED = "P6";

export function makeParams(overrides = {}) {
  return { ...defaults(), ...overrides };
}
