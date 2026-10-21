/**
 * NINE LIVES GANG — chat announcements for robbery events (Shoo!, Scooped!, …,
 * the getaway and the outcome). Kept apart from robbery.mjs so automation.mjs
 * can use it without a cycle.
 */
import { CARD, HOOKS, SETTINGS } from "../contracts.mjs";
import { moodNow } from "../logic/round.mjs";
import { OUTCOME_LABEL } from "../logic/prize.mjs";
import { postEventCard } from "../chat/cards.mjs";
import { setting } from "../settings.mjs";

/** The meters as a card shows them. */
export function metersOf(state) {
  if (!state) return null;
  const f = moodNow(state);
  return { broom: f.broom, cuddle: f.cuddle, patience: f.patience };
}

/** Post a card for every Shoo!/Scooped! in these events, and fire HOOKS.moodTriggered; ask the Storyteller to pick when needed. */
export async function postMoodCards(events = [], state = null) {
  for (const e of events.filter(x => x.type === "pickTarget")) {
    await postEventCard({ kind: CARD.moodPick, robberyId: state?.id ?? null, side: e.side, human: e.human, candidates: e.cats },
      { title: e.side === "broom" ? "Broom is full" : "Cuddle is full", subtitle: "The Storyteller's pick", lines: [e.text] }, { whisperGM: true });
  }
  for (const e of events.filter(x => x.type === "shoo" || x.type === "scooped")) {
    const after = events.slice(events.indexOf(e) + 1).find(x => x.type === "patience");
    await postEventCard({ kind: CARD.mood, robberyId: state?.id ?? null, side: e.type === "shoo" ? "broom" : "cuddle", catId: e.cat, human: e.human },
      { title: e.type === "shoo" ? "Shoo!" : "Scooped!", lines: [e.text, after?.text].filter(Boolean), meters: metersOf(state) });
    Hooks.callAll(HOOKS.moodTriggered, e, state);
  }
}

/** The outcome card's view (Ch 9 "How did it go?"): the loot home, who was pinched, the campaign. */
export function outcomeView(s, o, escaped = []) {
  const pinched = (o.pinched ?? o.leftBehind ?? []).map(id => s.cats.find(c => c.id === id)).filter(Boolean);
  const z = s.prize;
  return {
    title: OUTCOME_LABEL[o.result],
    subtitle: s.name,
    lines: [
      o.lootTotal ? `Loot home: ${o.loot} of ${o.lootTotal}${o.eaten ? ` (${o.eaten} portion${o.eaten > 1 ? "s" : ""} of the ${z.name} eaten in the house — the best hiding place for food is inside a cat)` : ` — the ${z.name}`}.` : "",
      pinched.length ? `Pinched, and off to the pound: ${pinched.map(c => c.name).join(", ")}.` : "Nobody was pinched. Not a whisker.",
      ...pinched.filter(c => escaped.includes(c.id)).map(c => `${c.name} spends a Life and busts out of the pound in the night.`),
      o.result === "clean" ? "Campaign: the gang gets 1 Rep for a Clean Getaway (at 3, 6 and 9 Rep every cat starts each robbery with 1 more Cattitude)." : ""
    ],
    meters: metersOf(s)
  };
}

/** Post the outcome card (when the robbery is over and autoOutcome is on) and fire HOOKS.robberyEnded. */
export async function postOutcome(state) {
  if (!state || state.phase !== "ended" || !state.outcome) return;
  const o = state.outcome;
  if (setting(SETTINGS.autoOutcome)) {
    await postEventCard({ kind: CARD.outcome, robberyId: state.id, result: o.result, leftBehind: o.leftBehind, escaped: [], repGiven: false }, outcomeView(state, o, []));
  }
  Hooks.callAll(HOOKS.robberyEnded, state, o);
}

/** The getaway's big moments in chat: the start, the warden, cornered cats, drops, pinches, getting home. */
const GETAWAY_EVENTS = new Set(["getawayStart", "loot", "pinched", "warden", "lootLost", "cornered", "dropped", "picked", "home", "getawayManual"]);
export async function postGetawayCards(events = [], state = null, { title = "The getaway", always = false } = {}) {
  const lines = events.filter(e => GETAWAY_EVENTS.has(e.type) || (always && e.type === "getawayRound")).map(e => e.text);
  if (lines.length) {
    const g = state?.getaway;
    await postEventCard({ kind: CARD.getaway, robberyId: state?.id ?? null, round: g?.round ?? null },
      { title, subtitle: g && state.phase === "getaway" ? `Getaway round ${g.round}${g.warden === null ? " — the van is on its way" : ""}` : "", lines, speaker: "The street" });
  }
  if (events.some(e => e.type === "outcome")) await postOutcome(state);
}
