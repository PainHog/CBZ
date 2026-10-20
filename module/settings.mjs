/**
 * CAT BURGLARS — settings (AUTOMATION.md §8). Every automation can be switched
 * off; names and hints are in lang/en.json under CATB.Settings.<key>.
 */
import { SYSTEM_ID, SETTINGS, HOOKS } from "./contracts.mjs";

const L = key => ({ name: `CATB.Settings.${key}.Name`, hint: `CATB.Settings.${key}.Hint` });

/** Setting definitions (exported so tests can check the lang file covers them). */
export const SETTING_DEFS = {
  [SETTINGS.migrationVersion]: { scope: "world", config: false, type: String, default: "" },
  [SETTINGS.robberyState]: { scope: "world", config: false, type: Object, default: null,
    onChange: state => {
      Hooks.callAll(HOOKS.robberyChanged, state);
      game.catBurglars?.tracker?.refresh?.();
    } },
  [SETTINGS.autoMood]: { ...L("autoMood"), scope: "world", config: true, type: String, default: "auto",
    choices: { auto: "CATB.Settings.autoMood.auto", confirm: "CATB.Settings.autoMood.confirm", manual: "CATB.Settings.autoMood.manual" } },
  [SETTINGS.autoSeen]: { ...L("autoSeen"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.autoEffects]: { ...L("autoEffects"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.autoHouseTurn]: { ...L("autoHouseTurn"), scope: "world", config: true, type: String, default: "prompt",
    choices: { prompt: "CATB.Settings.autoHouseTurn.prompt", auto: "CATB.Settings.autoHouseTurn.auto", manual: "CATB.Settings.autoHouseTurn.manual" } },
  [SETTINGS.autoRoutines]: { ...L("autoRoutines"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.autoTemptation]: { ...L("autoTemptation"), scope: "world", config: true, type: String, default: "prompt",
    choices: { prompt: "CATB.Settings.autoTemptation.prompt", auto: "CATB.Settings.autoTemptation.auto", off: "CATB.Settings.autoTemptation.off" } },
  [SETTINGS.autoCattitude]: { ...L("autoCattitude"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.autoPrizeClock]: { ...L("autoPrizeClock"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.autoOutcome]: { ...L("autoOutcome"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.trackerForPlayers]: { ...L("trackerForPlayers"), scope: "world", config: true, type: Boolean, default: true },
  [SETTINGS.trackerPosition]: { scope: "client", config: false, type: Object, default: {} }
};

export function registerSettings() {
  for (const [key, def] of Object.entries(SETTING_DEFS)) game.settings.register(SYSTEM_ID, key, def);
}

/** Read a setting (with the default when the registry isn't ready, e.g. during init). */
export function setting(key) {
  try { return game.settings.get(SYSTEM_ID, key); }
  catch { return SETTING_DEFS[key]?.default; }
}

/** The current automation switches as one object (for the pure logic's ctx). */
export function automation() {
  return {
    mood: setting(SETTINGS.autoMood),
    seen: setting(SETTINGS.autoSeen),
    effects: setting(SETTINGS.autoEffects),
    houseTurn: setting(SETTINGS.autoHouseTurn),
    routines: setting(SETTINGS.autoRoutines),
    temptation: setting(SETTINGS.autoTemptation),
    cattitude: setting(SETTINGS.autoCattitude),
    prizeClock: setting(SETTINGS.autoPrizeClock),
    outcome: setting(SETTINGS.autoOutcome)
  };
}
