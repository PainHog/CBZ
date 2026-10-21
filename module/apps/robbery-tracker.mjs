/**
 * NINE LIVES GANG — the Robbery Tracker (AUTOMATION.md §6).
 * ApplicationV2 + HandlebarsApplicationMixin (pattern from Heisty Spideys).
 * Opens from the token controls, from a chat card, or game.catBurglars.openTracker().
 * Header: the house, the round, the Prize Clock, the two Mood meters and
 * Patience. The house: every room with who is in it. Each cat shows what it can
 * do now (Moves and simple things as buttons, rolls open the roll dialog). The
 * Storyteller also gets Begin round / Tempt / End round, the overrides (move
 * anyone, open or shut a way, ± a meter, undo) and the routines.
 */
import { SYSTEM_ID, SETTINGS } from "../contracts.mjs";
import { HOUSES, findHouse } from "../logic/house-catalog.mjs";
import { getState } from "../robbery/store.mjs";
import { isActiveGM } from "../robbery/gm-ops.mjs";
import * as R from "../robbery/robbery.mjs";
import { trackerView } from "./tracker-view.mjs";
import { setting } from "../settings.mjs";
import { render, TEMPLATES } from "../chat/cards.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const T = part => `systems/${SYSTEM_ID}/templates/apps/tracker-${part}.hbs`;

const guard = fn => async function (event, target) {
  try { return await fn.call(this, event, target); }
  catch (err) { console.error("Nine Lives Gang |", err); ui.notifications?.warn(err?.message ?? String(err)); return null; }
};

export class RobberyTracker extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "catb-robbery-tracker",
    classes: ["cat-burglars", "catb-tracker"],
    tag: "div",
    window: { title: "Robbery Tracker", icon: "fa-solid fa-cat", resizable: true },
    position: { width: 960, height: 780 },
    actions: {
      start: guard(RobberyTracker.#start),
      beginRound: guard(() => R.beginRound()),
      endRound: guard(() => R.endRound()),
      endRobbery: guard(() => R.endRobbery("manual")),
      endGetawayRound: guard(() => R.endGetawayRound()),
      finishGetaway: guard(() => R.finishGetaway()),
      clear: guard(RobberyTracker.#clear),
      tempt: guard((event, target) => R.temptCat({ catId: target.dataset.cat, instinct: target.dataset.instinct })),
      temptRandom: guard(() => R.temptCat("random")),
      act: guard((event, target) => R.act(target.dataset.cat, target.dataset.option)),
      help: guard((event, target) => R.help(target.dataset.cat, target.dataset.queued === "true" ? null : target.dataset.target)),
      acted: guard((event, target) => R.markTurn(target.dataset.cat, { moved: true, acted: true })),
      giveBack: guard((event, target) => R.overrides.patch(target.dataset.cat, { moved: false, acted: false })),
      mood: guard((event, target) => R.overrides.moodAdjust(target.dataset.side, Number(target.dataset.steps))),
      undo: guard(() => R.overrides.moodUndo()),
      confirm: guard((event, target) => R.overrides.moodConfirm(target.dataset.entry, target.dataset.accept !== "false")),
      pickTarget: guard((event, target) => R.overrides.pickTarget(target.dataset.cat)),
      place: guard(RobberyTracker.#place),
      toggleWay: guard((event, target) => R.overrides.setOpen({ way: target.dataset.way, open: target.dataset.open !== "true" })),
      toggleEntrance: guard((event, target) => R.overrides.setOpen({ entrance: target.dataset.entrance, open: target.dataset.open !== "true" })),
      noise: guard((event, target) => R.overrides.markNoise(target.dataset.room, { mess: target.dataset.mess === "true" })),
      openSheet: guard((event, target) => game.actors.get(target.dataset.cat)?.sheet?.render(true))
    }
  };

  /** Open where it was last closed (client setting). */
  constructor(options = {}) {
    const saved = setting(SETTINGS.trackerPosition) ?? {};
    super({ ...options, position: { ...(options.position ?? {}), ...saved } });
  }

  async _onClose(options) {
    const { left, top, width, height } = this.position ?? {};
    try { await game.settings.set(SYSTEM_ID, SETTINGS.trackerPosition, { left, top, width, height }); } catch { /* not ready */ }
    return super._onClose?.(options);
  }

  static PARTS = {
    header: { template: T("header") },
    house: { template: T("house"), scrollable: [""] },
    footer: { template: T("footer") }
  };

  async _prepareContext() {
    const user = game.user;
    return trackerView(getState(), {
      isGM: !!user?.isGM,
      canControl: catId => { const a = game.actors.get(catId); return !!a && (user.isGM || a.isOwner); },
      houses: HOUSES
    });
  }

  /** Selects that move someone (GM): change → place. */
  _onRender(context, options) {
    super._onRender?.(context, options);
    for (const sel of this.element?.querySelectorAll?.("select[data-change]") ?? []) {
      sel.addEventListener("change", ev => RobberyTracker.#place.call(this, ev, { dataset: { ...sel.dataset, to: sel.value } }));
    }
  }

  /** Re-render if open (called on every robbery change). */
  refresh() { if (this.rendered) this.render(); }

  static async #start() {
    if (!isActiveGM()) throw new Error("Only the active Storyteller starts a robbery.");
    const cats = game.actors.filter(a => a.type === "cat");
    const gang = new Set(R.defaultGang().map(a => a.id));
    const content = await render(TEMPLATES.startDialog, {
      houses: HOUSES.map((h, i) => ({ key: h.key, name: h.name, label: h.label, selected: i === 0 })),
      cats: cats.map(a => ({ id: a.id, name: a.name, checked: gang.has(a.id) }))
    });
    const answer = await foundry.applications.api.DialogV2.wait({
      window: { title: "Start a robbery" }, content, rejectClose: false,
      buttons: [{ action: "start", label: "Start", default: true, callback: (event, btn) => {
        const el = n => btn?.form?.elements?.[n] ?? btn?.form?.elements?.namedItem?.(n);
        return { house: el("house")?.value, actorIds: cats.filter(a => el(`cat-${a.id}`)?.checked).map(a => a.id) };
      } }, { action: "cancel", label: "Cancel" }]
    });
    if (!answer || typeof answer !== "object") return null;
    return R.startRobbery(findHouse(answer.house) ?? answer.house, { actorIds: answer.actorIds });
  }

  static async #clear() {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Clear the robbery" }, content: "<p>Throw this robbery away? This can't be undone.</p>" });
    if (ok) return R.clearRobbery();
    return null;
  }

  static async #place(event, target) {
    const d = target.dataset;
    // the getaway by hand (Ch 9)
    if (d.change === "runner") return R.overrides.runner(d.cat, d.to);
    if (d.change === "carry") return R.overrides.carry(d.cat, d.to);
    if (d.change === "warden") return R.overrides.warden(d.to);
    if (d.cat) return R.overrides.placeCat(d.cat, d.to);
    if (d.key) return R.overrides.placeResident(d.key, d.to);
    return null;
  }
}

let tracker = null;
/** Open (or bring forward) the tracker. */
export function openTracker() {
  if (!game.user.isGM && !setting(SETTINGS.trackerForPlayers)) { ui.notifications?.warn("The Storyteller keeps the Robbery Tracker to themselves."); return null; }
  tracker ??= new RobberyTracker();
  tracker.render(true);
  return tracker;
}
export const currentTracker = () => tracker;
