/**
 * NINE LIVES GANG
 * A tabletop roleplaying game by Richard Moore.
 * Foundry VTT game system — entry point.
 *
 * This file only wires things up: data models, sheets, settings, GM
 * operations, chat-card buttons and the robbery automation in "init"; the GM's
 * reconcile in "ready". Rules logic lives in module/logic/ (Foundry-free,
 * tested with node --test); shared names in module/contracts.mjs.
 */

import { CATB } from "./config.mjs";
import { SYSTEM_ID, SETTINGS } from "./contracts.mjs";
import { ACTOR_MODELS } from "./data/actor-data.mjs";
import { registerSettings, setting } from "./settings.mjs";
import { gm, registerTransport, isActiveGM } from "./robbery/gm-ops.mjs";
import { registerRobberyOps, registerRobberyButtons, robberyApi } from "./robbery/robbery.mjs";
import { registerAutomation, reconcile, finalizePending } from "./robbery/automation.mjs";
import { onRenderChatMessage } from "./chat/cards.mjs";
import { registerDice, rollFor, push, accept, toggleSeen } from "./dice/roll.mjs";
import { registerSheets } from "./sheets/actor-sheets.mjs";
import { openTracker, currentTracker } from "./apps/robbery-tracker.mjs";
import { getState, flush } from "./robbery/store.mjs";
import * as logic from "./logic/round.mjs";
import * as actions from "./logic/actions.mjs";
import * as rules from "./logic/rules.mjs";

/* -------------------------------------------- */
/*  Init                                        */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log("Nine Lives Gang | Initialising the system.");

  // Static game data, reachable as CONFIG.CATB (and from macros/modules via the API below).
  CONFIG.CATB = CATB;
  Object.assign(CONFIG.Actor.dataModels, ACTOR_MODELS);
  CONFIG.Actor.trackableAttributes = { cat: { bar: [], value: ["cattitude", "lives"] } };

  registerSettings();
  registerTransport();
  registerRobberyOps();
  registerDice();
  registerRobberyButtons();
  registerSheets();
  registerAutomation();
  Hooks.on("renderChatMessageHTML", onRenderChatMessage);

  // Public API namespace for macros and other modules.
  game.catBurglars = Object.assign(game.catBurglars ?? {}, {
    CATB, id: SYSTEM_ID, gm,
    robbery: robberyApi,
    dice: { rollFor, push, accept, toggleSeen },
    logic: { ...logic, ...actions, rules },
    openTracker,
    state: getState, flush, finalizePending
  });
  // a live getter (Object.assign would copy its value once): the setting's onChange refreshes the open tracker
  Object.defineProperty(game.catBurglars, "tracker", { get: currentTracker, configurable: true, enumerable: true });

  foundry.applications.handlebars?.loadTemplates?.([
    "templates/chat/event-card.hbs", "templates/chat/roll-card.hbs", "templates/dialogs/roll-dialog.hbs", "templates/dialogs/start-robbery.hbs",
    "templates/apps/tracker-header.hbs", "templates/apps/tracker-house.hbs", "templates/apps/tracker-footer.hbs",
    "templates/actor/cat-sheet.hbs", "templates/actor/human-sheet.hbs", "templates/actor/pet-sheet.hbs"
  ].map(p => `systems/${SYSTEM_ID}/${p}`));
});

/** The Robbery Tracker's button on the token controls (v13 object form; v12 array form). */
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user?.isGM && !setting(SETTINGS.trackerForPlayers)) return;
  const tool = { name: "catbTracker", title: "Robbery Tracker", icon: "fa-solid fa-cat", button: true, visible: true, order: 99,
    onChange: () => openTracker(), onClick: () => openTracker() };
  if (Array.isArray(controls)) controls.find(c => c.name === "token")?.tools?.push(tool);
  else if (controls?.tokens?.tools) controls.tokens.tools.catbTracker = tool;
});

/* -------------------------------------------- */
/*  Ready                                       */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  console.log("Nine Lives Gang | Ready.");
  if (!isActiveGM()) return;
  if (setting(SETTINGS.migrationVersion) !== game.system.version) await game.settings.set(SYSTEM_ID, SETTINGS.migrationVersion, game.system.version);
  const n = await reconcile();
  if (n) ui.notifications?.info(`Nine Lives Gang: applied ${n} roll${n > 1 ? "s" : ""} made while the Storyteller was away.`);
});
