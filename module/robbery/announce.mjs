/**
 * NINE LIVES GANG — chat announcements for robbery events (Shoo!, Scooped!, …).
 * Kept apart from robbery.mjs so automation.mjs can use it without a cycle.
 */
import { CARD, HOOKS } from "../contracts.mjs";
import { moodNow } from "../logic/round.mjs";
import { postEventCard } from "../chat/cards.mjs";

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
