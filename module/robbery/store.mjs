/**
 * NINE LIVES GANG — the robbery store (AUTOMATION.md §2).
 * The robbery is one world setting, written only by the active GM. Every write
 * goes through one promise queue, applies a PURE function from module/logic/
 * to the latest state, and saves it; the setting's onChange then fires
 * HOOKS.robberyChanged and refreshes the tracker on every client.
 */
import { SYSTEM_ID, SETTINGS } from "../contracts.mjs";
import { isActiveGM } from "./gm-ops.mjs";

let queue = Promise.resolve();

/** The robbery now (null when none has been started). Readable by everyone. */
export function getState() {
  try { return game.settings.get(SYSTEM_ID, SETTINGS.robberyState) ?? null; }
  catch { return null; }
}

/** Is a robbery running — in the house, or on the getaway (Ch 9)? */
export const running = (s = getState()) => s?.phase === "robbery" || s?.phase === "getaway";
/** Is the getaway running? */
export const onGetaway = (s = getState()) => s?.phase === "getaway";

/**
 * Change the robbery: fn(state) returns { state, ... } (a pure result) or null
 * for "no change". Serialised; active GM only. Resolves to fn's result.
 */
export function mutate(fn) {
  if (!isActiveGM()) return Promise.reject(new Error("Only the active Storyteller can change the robbery."));
  const run = queue.then(async () => {
    const cur = getState();
    const res = await fn(cur);
    if (res?.state !== undefined && res.state !== cur) await game.settings.set(SYSTEM_ID, SETTINGS.robberyState, res.state);
    return res ?? { state: cur, events: [] };
  });
  queue = run.catch(() => {});
  return run;
}

/** Wait for every queued write (tests and sequenced flows). */
export const flush = () => queue;
