/**
 * CAT BURGLARS — System Configuration
 * ---------------------------------------
 * Static, version-agnostic game data lives here (approaches, instincts, the
 * adopted rules numbers …) so data models, sheets, dice code and the pure rules
 * logic can all share it without importing any Foundry API. Pure data only: no
 * `game`, `ui`, `foundry` or DOM, so `module/logic/` can import it under plain Node.
 *
 * Source of truth: the rulebook (book/src/chapters/, summarised in
 * docs/CORE-RULES.md v0.5). The numbers in CATB.rules are the simulator's adopted
 * package P7 (sim/params.mjs); test/parity.test.mjs keeps the two in step.
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
 * human sees it, and the special effects (Lap Cat's fuss, Scrapper's angry dog).
 */
CATB.instincts = Object.freeze({
  curious: { key: "curious", label: "Curious", knack: ["open"], knackText: "open, search, figure things out",
    tempt: "a bag, a drawer, something new", giveInText: "You rummage in it. Noise.",
    giveIn: { noise: true, mess: false, hidden: false, seen: { side: "broom", steps: 1 } } },
  knocker: { key: "knocker", label: "Knocker", knack: ["knock"], knackText: "knock, push, topple",
    tempt: "something on the edge of a table", giveInText: "You knock it off. Noise — and a mess for whoever comes to look.",
    giveIn: { noise: true, mess: true, hidden: false, seen: { side: "broom", steps: 1 } } },
  boxSitter: { key: "boxSitter", label: "Box Sitter", knack: ["hide"], knackText: "hide",
    tempt: "a box, a bag, a basket", giveInText: "You get in. Quiet, and you're hidden.",
    giveIn: { noise: false, mess: false, hidden: true, seen: null } },
  hunter: { key: "hunter", label: "Hunter", knack: ["chase", "fight"], knackText: "pounce, chase, fight",
    tempt: "anything that moves", giveInText: "You chase it round the room. Noise.",
    giveIn: { noise: true, mess: false, hidden: false, seen: null } },
  lapCat: { key: "lapCat", label: "Lap Cat", knack: ["charm"], knackText: "charm a human",
    tempt: "a lap, a sunny spot, a hand to rub", giveInText: "You go for a fuss: a human in the room is Distracted until the round ends. No human? A sunny spot: quiet.",
    giveIn: { noise: false, mess: false, hidden: false, seen: { side: "cuddle", steps: 1 }, fuss: true } },
  foodie: { key: "foodie", label: "Foodie", knack: ["food"], knackText: "find, steal and eat food",
    tempt: "food that isn't the prize", giveInText: "You eat it. Quiet.",
    giveIn: { noise: false, mess: false, hidden: false, seen: { side: "broom", steps: 1 } } },
  climber: { key: "climber", label: "Climber", knack: ["climb"], knackText: "climb, jump, balance",
    tempt: "somewhere high", giveInText: "You go up there. Quiet, and you're hidden.",
    giveIn: { noise: false, mess: false, hidden: true, seen: null } },
  scrapper: { key: "scrapper", label: "Scrapper", knack: ["fight"], knackText: "face down and fight animals",
    tempt: "an animal that stares, barks or hisses", giveInText: "You square up to it. Noise; a dog there turns angry.",
    giveIn: { noise: true, mess: false, hidden: false, seen: { side: "broom", steps: 1 }, angersDog: true } }
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

/** Difficulty rungs (Ch 4, Ch 11 "Calling the roll"). */
CATB.difficulties = Object.freeze({ 0: "Plain", 1: "Tricky", 2: "Hard" });

/** Sizes (Ch 8): ways and prizes. */
CATB.waySizes = Object.freeze({ tight: 0, normal: 1, big: 2 });
CATB.prizeSizes = Object.freeze({ small: 0, medium: 1, large: 2 });

/** Residents (Ch 10). */
CATB.humanKinds = Object.freeze({ grownup: "Grown-up", kid: "Kid", grandparent: "Grandparent", teen: "Teen" });
CATB.humanTraits = Object.freeze({
  kid: "Kid: doubles Cuddle steps from any roll they see.",
  dozes: "Dozes: each round, on a 1–2 on an extra d6, falls asleep until the end of the next round.",
  busy: "Busy: too busy to answer noise; still sees everything in the room.",
  headphones: "Headphones: doesn't answer noise."
});
CATB.petKinds = Object.freeze({ dog: "Dog", housecat: "House cat", parrot: "Parrot", vacuum: "Robot vacuum" });
CATB.petModes = Object.freeze({
  awake: "Awake", asleep: "Asleep", angry: "Angry", hiding: "Driven off", friendly: "Friendly", covered: "Covered"
});

/**
 * The adopted rules numbers (core rules v0.5 = simulator package P7). Every
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
  holdTable: [3, 5],     // Ch 9: 1–3 keeps cuddling, 4–5 the Den, 6 outside
  wriggleDifficulty: 1,  // Ch 9: Savage, Tricky
  lightsOut: 2,          // Ch 8: Lights Out at the end of the second round after the prize goes
  petHideRounds: 3,      // Ch 10: a driven-off pet hides for 3 rounds
  dozeOn: 2,             // Ch 10: dozes on a 1–2
  // Ch 8 "Gang size": the houses are written for four cats.
  gangScaling: { 3: { patience: 1, clock: 1 }, 4: { patience: 0, clock: 0 }, 5: { patience: 0, clock: -1 } },
  // Ch 9 / Ch 8: doors and the Den. Options are [approach, Difficulty, ...knack tags].
  denDoor: [["streetwise", 1, "open"], ["savage", 2]],   // a friend in the next room
  denInside: [["streetwise", 2, "open"]],               // the cat on its own
  reopenEntrance: [["streetwise", 2, "open"]],          // Ch 8: a shut entrance, from inside
  coverParrot: [["streetwise", 1, "open"]]              // Ch 10
});
