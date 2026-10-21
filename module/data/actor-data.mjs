/**
 * NINE LIVES GANG — actor data models (TypeDataModel) for cats, humans and pets
 * (AUTOMATION.md §7). Numbers follow Chapter 2 (cats) and Chapter 11
 * (residents); the limits come from CONFIG data in ../config.mjs.
 */
import { CATB } from "../config.mjs";

const R = CATB.rules;
const { fields } = foundry.data;
const int = (initial, min, max, extra = {}) => new fields.NumberField({ required: true, nullable: false, integer: true, initial, min, max, ...extra });
const str = (initial = "", extra = {}) => new fields.StringField({ required: true, blank: true, initial, ...extra });
const choice = (choices, initial) => new fields.StringField({ required: true, blank: false, initial, choices });
const bool = (initial = false) => new fields.BooleanField({ required: true, initial });

const INSTINCT_CHOICES = Object.fromEntries(CATB.instinctKeys.map(k => [k, CATB.instincts[k].label]));
const ROUTINE_HINT = 'six d6 results: "stay", a room key, or (pets) "sniff"';

/** A routine: six results for d6 1–6 (Ch 11). */
const routineField = () => new fields.SchemaField(Object.fromEntries([1, 2, 3, 4, 5, 6].map(i => [`r${i}`, str("stay")])), { hint: ROUTINE_HINT });

/** Read a routine field back as an array of six. */
export const routineList = r => [1, 2, 3, 4, 5, 6].map(i => r?.[`r${i}`] || "stay");
/** And write one. */
export const routineObject = list => Object.fromEntries([1, 2, 3, 4, 5, 6].map(i => [`r${i}`, list?.[i - 1] ?? "stay"]));

/** Ch 2 "Making Your Cat". */
export class CatData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      approaches: new fields.SchemaField(Object.fromEntries(CATB.approachKeys.map(a => [a, int(1, 1, R.approachMax)]))),
      instinct1: choice(INSTINCT_CHOICES, "curious"),
      instinct2: choice(INSTINCT_CHOICES, "climber"),
      body: choice({ lean: "Lean", chonky: "Chonky" }, "lean"),
      cattitude: int(R.cattitudeStart, 0, R.cattitudeMax),
      lives: int(R.livesMax, 0, R.livesMax),
      rep: int(0, 0, 99),
      coat: str(), mark: str(), eyes: str(), quirk: str(),
      notes: new fields.StringField({ required: true, blank: true, initial: "" })
    };
  }
  /** The two instincts as a list. */
  get instincts() { return [this.instinct1, this.instinct2].filter(Boolean); }
  prepareDerivedData() {
    this.instinctsDiffer = this.instinct1 !== this.instinct2;
    this.startingSpread = [...CATB.approachKeys.map(a => this.approaches?.[a] ?? 1)].sort((a, b) => b - a).join() === "3,2,1,1";
  }
}

/** Ch 11 "Humans". */
export class HumanData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      kind: choice(Object.fromEntries(Object.entries(CATB.humanKinds)), "grownup"),
      attention: int(1, 0, 2),
      traits: new fields.SchemaField({ kid: bool(), dozes: bool(), busy: bool(), headphones: bool() }),
      routine: routineField(),
      house: str(), key: str(), start: str(),
      notes: new fields.StringField({ required: true, blank: true, initial: "" })
    };
  }
  get routineList() { return routineList(this.routine); }
}

/** Ch 11 "Pets". */
export class PetData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      kind: choice(Object.fromEntries(Object.entries(CATB.petKinds)), "dog"),
      rating: int(1, 0, 3),
      soft: bool(false),
      asleep: bool(false),
      routine: routineField(),
      roam: str(),
      house: str(), key: str(), start: str(),
      notes: new fields.StringField({ required: true, blank: true, initial: "" })
    };
  }
  get routineList() { return routineList(this.routine); }
}

export const ACTOR_MODELS = { cat: CatData, human: HumanData, pet: PetData };

/** A robbery snapshot of a cat actor (round.mjs catEntry). */
export function catSnapshot(actor) {
  const s = actor.system;
  return {
    id: actor.id, actorId: actor.id, name: actor.name, img: actor.img,
    r: Object.fromEntries(CATB.approachKeys.map(a => [a, Number(s.approaches?.[a] ?? 1)])),
    instincts: [s.instinct1, s.instinct2].filter(Boolean), body: s.body ?? "lean",
    rep: Number(s.rep ?? 0) // v0.9 (Ch 14): the gang's Rep gives starting Cattitude
  };
}
