/**
 * NINE LIVES GANG — chat cards.
 * Every card carries structured flags (flags["cat-burglars"].card = { kind, … })
 * so the GM client can react to it (AUTOMATION.md §1). Buttons are NOT stored
 * in the message: each client adds the ones its user may press when the card
 * renders (renderChatMessageHTML), so a player never sees a GM-only button.
 */
import { SYSTEM_ID, FLAG } from "../contracts.mjs";

export const TEMPLATES = {
  event: `systems/${SYSTEM_ID}/templates/chat/event-card.hbs`,
  roll: `systems/${SYSTEM_ID}/templates/chat/roll-card.hbs`,
  rollDialog: `systems/${SYSTEM_ID}/templates/dialogs/roll-dialog.hbs`,
  startDialog: `systems/${SYSTEM_ID}/templates/dialogs/start-robbery.hbs`
};

export const render = (path, data) => foundry.applications.handlebars.renderTemplate(path, data);

/** The card flags of a message (or null). */
export const cardOf = message => message?.flags?.[FLAG]?.card ?? message?.getFlag?.(FLAG, "card") ?? null;

/** Renderers for per-viewer buttons: kind → (message, card, box) => void. */
const buttonRenderers = new Map();
export function registerButtons(kind, fn) {
  if (buttonRenderers.has(kind)) throw new Error(`card buttons for ${kind} registered twice`);
  buttonRenderers.set(kind, fn);
}
export const hasButtons = kind => buttonRenderers.has(kind);

/** The hook that adds buttons to our cards. */
export function onRenderChatMessage(message, html) {
  const card = cardOf(message);
  if (!card) return;
  const fn = buttonRenderers.get(card.kind);
  if (!fn) return;
  const box = html?.querySelector?.("div.catb-buttons");
  if (!box) return;
  try { fn(message, card, box); } catch (err) { console.error("Nine Lives Gang | card buttons", err); }
}

/** A button for a card. `onClick` runs as the clicking user. */
export function button(label, onClick, { cls = "", title = "", disabled = false } = {}) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  if (cls) b.className = cls;
  if (title) b.title = title;
  if (disabled) b.disabled = true;
  b.addEventListener("click", async ev => {
    ev?.preventDefault?.();
    if (b.disabled) return;
    b.disabled = true;
    try { await onClick(ev); }
    catch (err) { console.error("Nine Lives Gang |", err); ui.notifications?.warn(err?.message ?? String(err)); }
    finally { b.disabled = false; }
  });
  return b;
}

/**
 * Post an event card: { title, subtitle, lines: [text|{text,cls}], meters }.
 * `card` is the structured flag data (kind is required).
 */
export async function postEventCard(card, view, { whisperGM = false, speaker = null } = {}) {
  const lines = (view.lines ?? []).filter(Boolean).map(l => (typeof l === "string" ? { text: l, cls: "" } : l));
  const content = await render(TEMPLATES.event, { kind: card.kind, ...view, lines });
  const data = {
    content,
    speaker: speaker ?? { alias: view.speaker ?? "The house" },
    flags: { [FLAG]: { card: { v: 1, ...card } } }
  };
  if (whisperGM) data.whisper = game.users.filter(u => u.isGM).map(u => u.id);
  return ChatMessage.create(data);
}

/** Re-render an event card's content after its flags changed. */
export async function rerenderEvent(message, card, view) {
  const lines = (view.lines ?? []).filter(Boolean).map(l => (typeof l === "string" ? { text: l, cls: "" } : l));
  const content = await render(TEMPLATES.event, { kind: card.kind, ...view, lines });
  return message.update({ content, [`flags.${FLAG}.card`]: card });
}
