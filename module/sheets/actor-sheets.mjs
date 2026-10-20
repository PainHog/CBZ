/**
 * CAT BURGLARS — actor sheets (ApplicationV2 + HandlebarsApplicationMixin).
 * The Cat sheet shows approaches, instincts, body, Cattitude, Lives and a Roll
 * button per approach (AUTOMATION.md §7). Human and Pet sheets edit the
 * resident's numbers and d6 routine (Ch 10). Inputs named system.* save on change.
 */
import { SYSTEM_ID } from "../contracts.mjs";
import { CATB } from "../config.mjs";
import { routineList } from "../data/actor-data.mjs";
import { getState, running } from "../robbery/store.mjs";
import { catOptions } from "../logic/actions.mjs";
import { roomName } from "../logic/residents.mjs";
import { rollFor } from "../dice/roll.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const tpl = name => `systems/${SYSTEM_ID}/templates/actor/${name}.hbs`;
const choices = (entries, value) => entries.map(([v, label]) => ({ value: v, label, selected: v === value }));

class CatBurglarsActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["cat-burglars", "catb-sheet"],
    position: { width: 620, height: 680 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false }
  };
  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.document;
    return { ...ctx, actor, system: actor.system, editable: this.isEditable, owner: actor.isOwner, cssClass: this.isEditable ? "editable" : "locked" };
  }
}

export class CatSheet extends CatBurglarsActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ["catb-cat"],
    actions: {
      roll: CatSheet.#roll,
      tracker: () => game.catBurglars?.openTracker?.()
    }
  };
  static PARTS = { sheet: { template: tpl("cat-sheet") } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const s = ctx.system;
    const insts = Object.entries(CATB.instincts).map(([k, v]) => [k, v.label]);
    const state = getState();
    const inRobbery = running(state) && state.cats.find(c => c.id === this.document.id);
    let robbery = null;
    if (inRobbery) {
      const c = inRobbery;
      robbery = {
        house: state.name, round: state.round,
        where: c.where === "outside" ? "Outside" : roomName(state, c.where),
        status: { outside: "outside", free: "free", held: "Held", shut: "Shut in the Den" }[c.status] ?? c.status,
        turn: state.stage === "cats" ? `${c.moved ? "Moved" : "Move left"} · ${c.acted ? "Acted" : "Action left"}` : "Between turns",
        hidden: c.hidden, carrying: c.carrying ? state.prize.name : "",
        rolls: catOptions(state, c.id).options.filter(o => o.roll && !o.disabled && o.id !== "free").map(o => o.label)
      };
    }
    return {
      ...ctx,
      approaches: CATB.approachKeys.map(a => ({ key: a, label: CATB.approaches[a].label, value: s.approaches?.[a] ?? 1, role: CATB.approaches[a].role, hint: CATB.approaches[a].hint })),
      instinct1: choices(insts, s.instinct1), instinct2: choices(insts, s.instinct2),
      instinctInfo: [s.instinct1, s.instinct2].map(k => CATB.instincts[k]).filter(Boolean).map(i => ({ label: i.label, knack: i.knackText, tempt: i.tempt })),
      bodies: choices(Object.entries(CATB.bodies).map(([k, v]) => [k, v.label]), s.body),
      bodyHint: CATB.bodies[s.body]?.hint ?? "",
      warnings: [
        s.instinct1 === s.instinct2 ? "A cat has two different instincts." : null,
        !s.startingSpread ? "Starting approaches are 3, 2, 1 and 1 (Rep can raise one later, up to 4)." : null
      ].filter(Boolean),
      robbery, cattitudeMax: CATB.rules.cattitudeMax, livesMax: CATB.rules.livesMax
    };
  }

  static async #roll(event, target) {
    return rollFor(this.document, { approach: target.dataset.approach });
  }
}

export class HumanSheet extends CatBurglarsActorSheet {
  static DEFAULT_OPTIONS = { classes: ["catb-human"], position: { width: 520, height: 600 } };
  static PARTS = { sheet: { template: tpl("human-sheet") } };
  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const s = ctx.system;
    return {
      ...ctx,
      kinds: choices(Object.entries(CATB.humanKinds), s.kind),
      attentions: [0, 1, 2].map(n => ({ value: n, label: String(n), selected: n === s.attention })),
      traits: Object.entries(CATB.humanTraits).map(([k, text]) => ({ key: k, text, checked: !!s.traits?.[k] })),
      routine: routineList(s.routine).map((r, i) => ({ face: i + 1, key: `r${i + 1}`, value: r }))
    };
  }
}

export class PetSheet extends CatBurglarsActorSheet {
  static DEFAULT_OPTIONS = { classes: ["catb-pet"], position: { width: 520, height: 600 } };
  static PARTS = { sheet: { template: tpl("pet-sheet") } };
  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const s = ctx.system;
    return {
      ...ctx,
      kinds: choices(Object.entries(CATB.petKinds), s.kind),
      ratings: [0, 1, 2, 3].map(n => ({ value: n, label: String(n), selected: n === s.rating })),
      routine: routineList(s.routine).map((r, i) => ({ face: i + 1, key: `r${i + 1}`, value: r })),
      showRoutine: s.kind === "dog"
    };
  }
}

export function registerSheets() {
  const DSC = foundry.applications.apps.DocumentSheetConfig;
  const ActorCls = globalThis.Actor;
  DSC.registerSheet(ActorCls, SYSTEM_ID, CatSheet, { types: ["cat"], makeDefault: true, label: "Cat Burglars: Cat" });
  DSC.registerSheet(ActorCls, SYSTEM_ID, HumanSheet, { types: ["human"], makeDefault: true, label: "Cat Burglars: Human" });
  DSC.registerSheet(ActorCls, SYSTEM_ID, PetSheet, { types: ["pet"], makeDefault: true, label: "Cat Burglars: Pet" });
}
