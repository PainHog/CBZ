/**
 * NINE LIVES GANG — the GM client reacts to roll cards (AUTOMATION.md §1).
 * A player's roll is a chat message with structured flags. When it becomes
 * final, the ACTIVE GM's client applies it to the robbery (the option's effect,
 * noise, helpers, the Mood — one roll, one change), writes Cattitude for a
 * Purrfect, marks the card applied, and announces Shoo!/Scooped!.
 * If no GM was online, nothing is lost: on `ready` the GM reconciles recent
 * final cards whose eventId isn't applied yet.
 */
import { CARD, HOOKS, SETTINGS } from "../contracts.mjs";
import { applyRoll } from "../logic/actions.mjs";
import { isApplied } from "../logic/round.mjs";
import { clampCattitude } from "../logic/rules.mjs";
import { getState, running, mutate } from "./store.mjs";
import { isActiveGM } from "./gm-ops.mjs";
import { cardOf } from "../chat/cards.mjs";
import { updateRollCard, pendingRollMessages } from "../dice/roll.mjs";
import { automation, setting } from "../settings.mjs";
import { postMoodCards, postGetawayCards } from "./announce.mjs";

/** Apply a final roll card to the robbery (once). Active GM only. */
export async function applyRollMessage(message) {
  if (!isActiveGM()) return null;
  const card = cardOf(message);
  if (card?.kind !== CARD.roll || card.status !== "final" || card.applied || !card.robberyId) return null;
  const auto = automation();
  const res = await mutate(s => {
    if (!running(s) || s.id !== card.robberyId) return null;
    if (isApplied(s, card.eventId)) return { state: s, events: [], skipped: true };
    return applyRoll(s, cardOf(message), { mood: auto.mood, effects: auto.effects, d6: auto.d6, getaway: auto.getaway });
  });
  if (!res?.state || res.skipped) return res;
  await applyCattitude(res.cattitude);
  await updateRollCard(message, { applied: true, appliedText: res.events.slice(1).map(e => e.text) });
  Hooks.callAll(HOOKS.rollResolved, message, cardOf(message));
  await postMoodCards(res.events, res.state);
  // the getaway's big moments (home, pinched, the next round after the last dodge, the outcome)
  await postGetawayCards(res.events.filter(e => ["home", "pinched", "getawayRound", "outcome"].includes(e.type)), res.state, { always: true });
  return res;
}

/** Cattitude changes the pure logic asked for (Purrfect, temptation). Off: advice only. */
export async function applyCattitude(list = []) {
  if (!list?.length || !setting(SETTINGS.autoCattitude)) return;
  for (const { catId, delta } of list) {
    const a = game.actors.get(catId);
    if (!a) continue;
    await a.update({ "system.cattitude": clampCattitude(Number(a.system.cattitude ?? 0) + delta) });
  }
}

/** The Storyteller makes pending roll cards final and applies them (End round, Begin round, a cat's next move). */
export async function finalizePending({ catId = null } = {}) {
  if (!isActiveGM()) return;
  for (const m of pendingRollMessages({ catId })) {
    await updateRollCard(m, { status: "final" });
    await applyRollMessage(m);
  }
}

/** On ready: apply final roll cards the GM missed while offline. */
export async function reconcile() {
  if (!isActiveGM() || !running(getState())) return 0;
  const msgs = (game.messages?.contents ?? [...(game.messages ?? [])]).slice(-100);
  let n = 0;
  for (const m of msgs) {
    const c = cardOf(m);
    if (c?.kind === CARD.roll && c.status === "final" && !c.applied && c.robberyId === getState()?.id) { await applyRollMessage(m); n++; }
  }
  return n;
}

function onMessage(message) {
  if (!isActiveGM()) return;
  const c = cardOf(message);
  if (c?.kind === CARD.roll && c.status === "final" && !c.applied && c.robberyId) applyRollMessage(message);
}

export function registerAutomation() {
  Hooks.on("createChatMessage", onMessage);
  Hooks.on("updateChatMessage", onMessage);
}
