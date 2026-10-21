/**
 * NINE LIVES GANG — System Configuration
 * ---------------------------------------
 * Static, version-agnostic game data lives here (approaches, instincts, the
 * adopted rules numbers …) so data models, sheets, dice code and the pure rules
 * logic can all share it without importing any Foundry API. Pure data only: no
 * `game`, `ui`, `foundry` or DOM, so `module/logic/` can import it under plain Node.
 *
 * Source of truth: the rulebook (book/src/chapters/, core rules v0.9). The
 * numbers in CATB.rules are the simulator's adopted package P13 (sim/params.mjs: the getaway,
 * shiny loot and Cred); test/parity.test.mjs keeps the two in step.
 */

export const CATB = {};

/** The system id (must match system.json "id" and contracts.mjs SYSTEM_ID). */
CATB.id = "cat-burglars";

/** The four approaches (Ch 2 §3, Ch 5 "Mood steps": Sweet fills Cuddle, the rest fill Broom). */
CATB.approaches = Object.freeze({
  sneaky: { key: "sneaky", label: "Sneaky", role: "the Shadow", fills: "broom",
    hint: "Doing things without being noticed: hiding, slipping past, creeping, snatching." },
  sweet: { key: "sweet", label: "Sweet", role: "the Charmer", fills: "cuddle",
    hint: "Charming humans and soft pets: distract, persuade, befriend, be let in or out." },
  savage: { key: "savage", label: "Savage", role: "the Muscle", fills: "broom",
    hint: "Force and speed: hiss, shove, bolt, face down a dog, wriggle free." },
  streetwise: { key: "streetwise", label: "Streetwise", role: "the Brains", fills: "broom",
    hint: "Knowing how things work: doors, latches, cupboards, bags, flaps." }
});
CATB.approachKeys = Object.freeze(["sneaky", "sweet", "savage", "streetwise"]);

/**
 * The eight instincts (Ch 7). `knack` lists the action tags the Knack die covers
 * (the simulator's table, sim/character.mjs KNACK); `giveIn` is what giving in
 * to a temptation does (Ch 7 table): noise, a mess, hidden, the Mood step if a
 * human sees it, and the special effects (Lap Cat's fuss: +2 Cuddle for a kid).
 */
CATB.instincts = Object.freeze({
  curious: { key: "curious", label: "Curious", knack: ["open"], knackText: "open, search, figure things out",
    tempt: "a bag, a drawer, something new or shiny", giveInText: "You rummage in it. Noise.",
    giveIn: { noise: true, mess: false, hidden: false, seen: { side: "broom", steps: 1 } } },
  // v0.9: seen, it's +1 Broom and no mess (one Broom per event); unseen, a mess for whoever comes
  knocker: { key: "knocker", label: "Knocker", knack: ["knock"], knackText: "knock, push, topple",
    tempt: "something on the edge of a table — especially if it sparkles", giveInText: "You knock it off. Noise — and, if nobody saw it fall, a mess for whoever comes to look.",
    giveIn: { noise: true, mess: "unseen", hidden: false, seen: { side: "broom", steps: 1 } } },
  boxSitter: { key: "boxSitter", label: "Box Sitter", knack: ["hide"], knackText: "hide",
    tempt: "a box, a bag, a basket", giveInText: "You get in. Quiet, and you're hidden.",
    giveIn: { noise: false, mess: false, hidden: true, seen: null } },
  // v0.9 (Ch 2, Ch 7): pounce and chase only — not fighting animals (the simulator's hunterNoFight)
  hunter: { key: "hunter", label: "Hunter", knack: ["chase"], knackText: "pounce, chase (not fighting animals)",
    tempt: "anything that moves", giveInText: "You chase it round the room. Noise.",
    giveIn: { noise: true, mess: false, hidden: false, seen: null } },
  lapCat: { key: "lapCat", label: "Lap Cat", knack: ["charm"], knackText: "charm a human",
    tempt: "a lap, a sunny spot, a hand to rub", giveInText: "You go for a fuss: the human you pick is Distracted until the house's turn (it counts as a distraction of them). No human? A sunny spot: quiet.",
    giveIn: { noise: false, mess: false, hidden: false, seen: { side: "cuddle", steps: 1, kid: 2 }, fuss: true } },
  foodie: { key: "foodie", label: "Foodie", knack: ["food"], knackText: "find, steal and eat food",
    tempt: "food that isn't the prize", giveInText: "You eat it. Quiet.",
    giveIn: { noise: false, mess: false, hidden: false, seen: { side: "broom", steps: 1 } } },
  climber: { key: "climber", label: "Climber", knack: ["climb"], knackText: "climb, jump, balance",
    tempt: "somewhere high", giveInText: "You go up there. Quiet, and you're hidden.",
    giveIn: { noise: false, mess: false, hidden: true, seen: null } },
  scrapper: { key: "scrapper", label: "Scrapper", knack: ["fight"], knackText: "face down and fight animals",
    tempt: "an awake dog or cat", giveInText: "You square up to it. Noise.",
    giveIn: { noise: true, mess: false, hidden: false, seen: { side: "broom", steps: 1 } } }
});
CATB.instinctKeys = Object.freeze(Object.keys(CATB.instincts));

/** Bodies (Ch 2 §5). */
CATB.bodies = Object.freeze({
  lean: { key: "lean", label: "Lean", hint: "Fits through Tight gaps; carries Small things." },
  chonky: { key: "chonky", label: "Chonky", hint: "Can't fit Tight gaps; carries a Medium thing alone; +1 die to wriggle free." }
});

/** Roll results (Ch 4 "Reading the dice"). */
CATB.results = Object.freeze({
  flop: { key: "flop", label: "Flop", works: false, noise: true, text: "It doesn't work, and you made a noise." },
  scrape: { key: "scrape", label: "Scrape", works: true, noise: true, text: "It works, but you made a noise." },
  clean: { key: "clean", label: "Clean", works: true, noise: false, text: "It works, quietly." },
  purrfect: { key: "purrfect", label: "Purrfect", works: true, noise: false, text: "It works so smoothly that nobody minds: no Mood step, and +1 Cattitude." }
});

/** Difficulty rungs (Ch 4, Ch 12 "Calling the roll"). */
CATB.difficulties = Object.freeze({ 0: "Plain", 1: "Tricky", 2: "Hard" });

/** Prize kinds (Ch 8; d8: 1–2 delicious, 3–4 fun, 5–6 shiny, 7–8 a box). Shiny things are carried like fun ones. */
CATB.prizeKinds = Object.freeze({ delicious: "Delicious", fun: "Fun", shiny: "Shiny", box: "A box" });

/**
 * Ch 9 "Cred: showing off": the house's catnip stash, as a temptation the
 * Storyteller can offer any cat in its room (whatever its instincts).
 */
CATB.catnip = Object.freeze({
  label: "The catnip stash",
  giveInText: "It dives into the catnip and rolls about in it, yowling (a noise; +1 Broom if a human sees) — 1 Cred, and the zoomies until the house part ends."
});

/** Sizes (Ch 8): ways and prizes. */
CATB.waySizes = Object.freeze({ tight: 0, normal: 1, big: 2 });
CATB.prizeSizes = Object.freeze({ small: 0, medium: 1, large: 2 });

/** Residents (Ch 11). */
CATB.humanKinds = Object.freeze({ grownup: "Grown-up", kid: "Kid", grandparent: "Grandparent", teen: "Teen" });
CATB.humanTraits = Object.freeze({
  kid: "Kid: doubles Cuddle steps from any roll they see.",
  dozes: "Dozes: every house's turn, on a 1–2 on an extra d6, falls asleep until the end of the next round; only a Prize Clock job wakes them.",
  busy: "Busy: too busy to answer noise; still sees everything in the room.",
  headphones: "Headphones: doesn't answer noise."
});
CATB.petKinds = Object.freeze({ dog: "Dog", housecat: "House cat", parrot: "Parrot", vacuum: "Robot vacuum" });
CATB.petModes = Object.freeze({
  awake: "Awake", asleep: "Asleep", hiding: "Driven off", friendly: "Befriended", covered: "Covered"
});

/**
 * The rules numbers (core rules v0.9 with the getaway and Cred = simulator package P13). Every
 * number the automation uses comes from here, so one place follows the book.
 */
CATB.rules = Object.freeze({
  approachMax: 4,
  diceCap: 5,            // Ch 4: never more than 5 dice (cap first, then remove)
  knackCap: 1,           // Ch 7: only ever one Knack die
  helpCap: 2,            // Ch 4: +1 per helper, at most +2
  zeroDice: 2,           // Ch 4: at 0 or fewer, roll two and keep the lower (no better than a Scrape)
  cattitudeStart: 2,     // Ch 2 §7
  cattitudeMax: 5,
  livesMax: 9,
  flopSteps: 2,          // Ch 5: a seen Flop adds 2 to the fuller meter
  sneakyCleanFree: true, // Ch 5: a Sneaky Clean adds nothing
  minPatience: 2,        // Ch 5: Patience never below 2
  patienceDrop: 1,
  noiseRange: 2,         // Ch 6: the closest awake human within two rooms
  holdTable: [3, 5],     // Ch 10: 1–3 keeps cuddling, 4–5 the Den, 6 outside
  wriggleDifficulty: 1,  // Ch 10: Savage, Tricky
  lightsOut: 2,          // Ch 8: Lights Out at the end of the second round after the prize goes
  petHideRounds: 3,      // Ch 11: a driven-off pet hides for 3 rounds, counting this one
  dozeOn: 2,             // Ch 11: dozes on a 1–2
  // Ch 12 "Gang size": the houses are written for four cats. The general rule (for your own houses):
  // 3 cats: Patience +1, the prize 2 rounds later, 3 starting Cattitude each; 5 cats: Patience −1.
  // v0.9: a ready-to-run house may print its own three- and five-cat numbers (catalog scale3 / scale5).
  gangScaling: { 3: { patience: 1, clock: 2, cattitude: 1 }, 4: { patience: 0, clock: 0, cattitude: 0 }, 5: { patience: -1, clock: 0, cattitude: 0 } },
  // Ch 14 "Rep" (v0.9): at 3, 6 and 9 Rep every cat starts each robbery with 1 more Cattitude (never above 5)
  repSteps: [3, 6, 9],
  // Ch 7 (shiny loot): shiny things lie about in every house — any room tempts Curious and Knocker cats
  shinyTempts: ["curious", "knocker"],
  // Ch 9 "The Getaway" (simulator package P12): the warden arrives at the end of round 1 if anyone was
  // Shooed or Scooped tonight, else a round later (wardenLag 1); then moves 1 space a round, 2 after a Flop;
  // a cornered cat dodges plain; a group is a leader and up to 2 helpers; loot: Small 1, Medium 2, Large 3 pieces
  wardenLag: 1,
  wardenFlopSpaces: 2,
  dodgeDiff: 0,
  getawayHelpers: 2,
  lootPieces: { small: 1, medium: 2, large: 3 },
  // Ch 9 "Cred: showing off" (simulator package P13): tag a room 1 (+1 in view if it works, +1 over the
  // rivals' tag), the nip 1, leading the gang past the rivals on a Clean or a Purrfect 1, a getaway Purrfect 1;
  // on the nip (the zoomies): +1 die, every roll a noise, no resisting, Cred counts double;
  // a night with 5 or more Cred that wasn't Busted: +1 Rep (Ch 14)
  cred: Object.freeze({ tag: 1, inView: 1, overRivals: 1, nip: 1, rivals: 1, leap: 1, nipDie: 1, nipTimes: 2, repNight: 5 }),
  // Ch 10 / Ch 8: doors and the Den. Options are [approach, Difficulty, ...knack tags].
  denDoor: [["streetwise", 1, "open"], ["savage", 2]],   // a friend in the next room
  denInside: [["streetwise", 2, "open"]],               // the cat on its own
  reopenEntrance: [["streetwise", 2, "open"]],          // Ch 8: a shut entrance, from inside
  coverParrot: [["streetwise", 1, "open"]]              // Ch 11
});
