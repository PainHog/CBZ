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
  resetTo: { def: "calm", alt: ["half"], title: "Mood after a trigger", ref: "CORE-RULES Shoo!/Scooped!", pkg: true,
    doc: "calm: back to 0. half (v0.7): half the new Patience, rounded down." },
  shutOnShoo: { def: true, alt: [false], title: "Shoo! shuts the entrance", ref: "CORE-RULES Shoo!", pkg: true, doc: "" },
  shooKeepLast: { def: true, alt: [false], title: "Shoo!: the nearest entrance the cat fits through (opened if shut); the last open one stays open", ref: "Ch 5 v0.9 (review B1)", pkg: true, doc: "" },
  meterCap: { def: true, alt: [false], title: "After a catch the other meter drops to one below the new Patience", ref: "Ch 5 v0.9 (review B3)", pkg: true, doc: "" },
  heldBroomDen: { def: false, alt: [true], title: "A held cat whose own roll fills Broom is shut in the Den (not put out)", ref: "Ch 5 v0.9", pkg: true, doc: "" },
  giveInNoFill: { def: true, alt: [false], title: "A give-in's Mood steps never fill a meter", ref: "Ch 7 v0.9 (review D5)", pkg: true, doc: "" },
  knockerOneBroom: { def: true, alt: [false], title: "A Knocker give-in seen by a human leaves no mess to find (one Broom per event)", ref: "Ch 7 v0.9 (review D7)", pkg: true, doc: "" },
  hunterNoFight: { def: true, alt: [false], title: "Hunter's Knack is pounce and chase, not fighting animals", ref: "Ch 2 v0.9 (review D7)", pkg: true, doc: "" },
  getaway: { def: true, alt: [false], title: "The getaway after the house (loot in pieces, the warden, pinched)", ref: "Ch 9 v0.10", pkg: true, doc: "" },
  wardenLag: { def: 1, alt: [0, 2], title: "Getaway: extra rounds before the warden arrives", ref: "Ch 9 v0.10", doc: "" },
  wardenFlop: { def: true, alt: [false], title: "Getaway: a Flop makes the warden move 2", ref: "Ch 9 v0.10", doc: "" },
  dodgeDiff: { def: 0, alt: [1, 2], title: "Getaway: difficulty of dodging the warden", ref: "Ch 9 v0.10", doc: "" },
  shinyTempts: { def: true, alt: [false], title: "Shiny things tempt Curious and Knocker cats in every room", ref: "Ch 7 v0.9 (shiny loot)", pkg: true, doc: "" },
  lapCountsDistract: { def: true, alt: [false], title: "A Lap Cat's fuss counts as a Distraction of that human (for the next one's cost)", ref: "Ch 7 v0.9", pkg: true, doc: "" },
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
  searching: { def: true, alt: [false], title: "A human who finds the prize disturbed starts Searching", ref: "CORE-RULES v0.5 Residents", pkg: true,
    doc: "Searching humans skip their routine: they stay with a cat they can see, or step into a next room where one is." },
  ownerFetch: { def: true, alt: [false], title: "The Prize Clock's move still happens when the cats have the prize", ref: "CORE-RULES v0.5 The prize", pkg: true,
    doc: "The owner goes to its spot, finds it gone (+1 Broom) and starts Searching." },
  carrierRules: { def: true, alt: [false], title: "v0.6 fix round: hauling, finding it, Searching for the prize", ref: "CORE-RULES v0.6", pkg: true,
    doc: "Moving a Medium/Large prize is always a roll; carriers can't hide; a human in the prize's room at the end of the House phase finds it disturbed (+1 Broom, Searching); Searching goes for the prize first; messes wait to be found; a driven-off dog hides 3 rounds counting this one; a failed pet roll chases the cat back." },
  tableRules: { def: true, alt: [false], title: "v0.7 fix round: holders see, eating is a roll, temptation rotates", ref: "CORE-RULES v0.7", pkg: true,
    doc: "A human holding a cat still sees their room; eating a portion is a roll every time (Sneaky quietly, Savage wolfing); the Storyteller never tempts the same cat two rounds running (was: never the same cat with the same thing twice); a haul's noise is in the room the prize ends up in; hauling out of a dog's room counts as leaving it, and a failed haul there is chased back and drops the prize; a Knocker's knack helps hauling." },
  holdRules: { def: true, alt: [false], title: "v0.8 fix round: the Prize Clock's hold beats noise; any cat helps a haul; house haul difficulty", ref: "CORE-RULES v0.8", pkg: true,
    doc: "The human the Prize Clock moves this round stays with the prize and answers no noise that round (three playtests won by a free round-1 lure); any cat in the room may help a haul (+1 die, its Action); a house may make hauling its prize Tricky (the cake)." },
  searchHold: { def: false, alt: [true], title: "A Searching human with the prize in their room ignores noise", ref: "playtest V6-02 (declined)", pkg: false,
    doc: "Tried for v0.7 and declined: Easy fell to 69% and Hard to 38% (sim/BALANCE.md)." },
  dogOnEntry: { def: true, alt: [false], title: "An awake dog confronts a cat as soon as it enters", ref: "CORE-RULES v0.5 Residents", pkg: true, doc: "" },
  reopenEntrance: { def: true, alt: [false], title: "A shut entrance can be reopened from inside (Streetwise, Hard)", ref: "CORE-RULES v0.5 In and out", pkg: true, doc: "" },
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
  cattitudeDie: { def: false, alt: [true], title: "Cattitude can also buy +1 die before a roll", ref: "CORE-RULES Push", pkg: true,
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
    doc: "Shifts by gang size: scale3, scale3Cat, scale5 (v0.5 was 3 cats: Patience +1, Clock +1; 5 cats: Clock −1)." },
  scale3: { def: [1, 2], alt: [[1, 1], [2, 2]], title: "3 cats: [Patience, Prize Clock] shift", ref: "CORE-RULES v0.6 Ending", pkg: true, doc: "" },
  scale3Cat: { def: 1, alt: [0, 2], title: "3 cats: extra starting Cattitude each", ref: "CORE-RULES v0.6 Ending", pkg: true, doc: "" },
  scale5: { def: [-1, 0], alt: [[-1, -1], [0, -1]], title: "5 cats: [Patience, Prize Clock] shift", ref: "CORE-RULES v0.8 Ending", pkg: true, doc: "v0.8: Patience −1 only (the Clock shift put five cats 7 points behind at Hard)." },
  gangSize: { def: 4, alt: [3, 5], title: "Cats in the gang", ref: "CORE-RULES table (3–5 players)", doc: "" },
  repRaises: { def: 0, alt: [1, 2, 3], title: "Campaign: Rep raises each cat has had", ref: "Ch 13 Rep", doc: "Each raise lifts the cat's best approach still under 4 by 1." },
  wary: { def: 0, alt: [1, 2, 3], title: "Campaign: house Patience lower by", ref: "Ch 13 Houses", doc: "" },
  waryClock: { def: 0, alt: [1, 2], title: "Campaign: Prize Clock shorter by", ref: "Ch 13", doc: "" },
  gang: { def: "random", alt: ["ready"], title: "Which cats", ref: "Ch 2 tables / Ch 3 ready-made gang", doc: "random: legal cats rolled on the Ch 2 tables. ready: the book's ready-made gang (Ch 3)." },
  foodPolicy: { def: "eat", alt: ["smart", "carry"], title: "Eat food on the spot or carry it out", ref: "policy",
    doc: "eat: always eat where it is. carry: carry it out whenever the cats there can. smart: carry while more than 2 portions are left and a way out fits it." },
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
 * P6 = adopted for core rules v0.3/v0.4. P7 = core rules v0.5 (searching, the owner fetching the prize, dogs on entry,
 * reopening entrances). P8 = core rules v0.6 (hauling, finding it, Searching for the prize: the playtest fix round);
 * P9 = core rules v0.7 (holders still see, eating is a roll, temptation rotates: the third playtest round).
 * P10 = core rules v0.8 (the Clock's hold beats noise, any cat helps a haul, the cake wobbles: the fourth round).
 * The defaults above equal the ADOPTED package.
 */
const OFF = { distractEscalation: false, attentionVs: "sneaky", lureMess: false, discovery: false, gangScaling: false,
  livesPerRobbery: 1, cattitudeDie: false, getaway: false, shinyTempts: false, shooKeepLast: false, meterCap: false, heldBroomDen: false, giveInNoFill: false, knockerOneBroom: false, hunterNoFight: false, lapCountsDistract: false, searching: false, ownerFetch: false, dogOnEntry: false, reopenEntrance: false, carrierRules: false, tableRules: false, holdRules: false, resetTo: "calm",
  scale3: [1, 1], scale3Cat: 0, scale5: [0, -1] }; // the v0.5 gang scaling (used once gangScaling is on)
export const PACKAGES = {
  P1: { ...OFF },
  P2: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet" },
  P3: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true },
  P4: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true },
  P5: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0 },
  P6: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true },
  P7: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true },
  P8: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true, carrierRules: true, scale3: [1, 2], scale3Cat: 1, scale5: [-1, -1] },
  P9: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true, carrierRules: true, tableRules: true, resetTo: "calm", scale3: [1, 2], scale3Cat: 1, scale5: [-1, -1] },
  P10: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: true,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true, carrierRules: true, tableRules: true, holdRules: true, resetTo: "calm", scale3: [1, 2], scale3Cat: 1, scale5: [-1, 0] },
  P11: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: false,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true, carrierRules: true, tableRules: true, holdRules: true, resetTo: "calm", scale3: [1, 2], scale3Cat: 1, scale5: [-1, 0],
    shooKeepLast: true, meterCap: true, heldBroomDen: false, giveInNoFill: true, knockerOneBroom: true, hunterNoFight: true, lapCountsDistract: true, shinyTempts: true },  P12: { ...OFF, distractEscalation: true, attentionVs: "sneaky+sweet", lureMess: true, discovery: true, gangScaling: true, livesPerRobbery: 0, cattitudeDie: false,
    searching: true, ownerFetch: true, dogOnEntry: true, reopenEntrance: true, carrierRules: true, tableRules: true, holdRules: true, resetTo: "calm", scale3: [1, 2], scale3Cat: 1, scale5: [-1, 0],
    shooKeepLast: true, meterCap: true, heldBroomDen: false, giveInNoFill: true, knockerOneBroom: true, hunterNoFight: true, lapCountsDistract: true, shinyTempts: true, getaway: true },
};
export const ADOPTED = "P12";

export function makeParams(overrides = {}) {
  return { ...defaults(), ...overrides };
}
