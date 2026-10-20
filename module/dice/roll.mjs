/**
 * NINE LIVES GANG — rolling (Ch 4; AUTOMATION.md §4).
 *
 * rollFor(actor, { approach, optionId }):
 *   1. inside a robbery, pick what the cat is doing (an option from the robbery
 *      state: a door, a step, an entrance, a dog… or a free roll);
 *   2. the roll dialog shows the pool, filled in from the robbery (Knack, help,
 *      Difficulty, the pet, Attention, Seen) — anything can be changed;
 *   3. the dice are rolled and a roll card is posted. The card is PENDING:
 *      its owner may Push once (1 Cattitude, or +1 Mood step) or Accept; the
 *      GM may flip Seen. It becomes FINAL on a Push, an Accept, the same cat's
 *      next roll or move, or the end of the round — and then the GM's client
 *      applies it to the robbery (automation.mjs).
 */
import { SYSTEM_ID, FLAG, CARD, SETTINGS, OPS } from "../contracts.mjs";
import { CATB } from "../config.mjs";
import { buildRollPlan, readDice, readIndex, pushIndices, applyPush, canPush, chanceAtLeast, clampCattitude, attentionApplies } from "../logic/rules.mjs";
import { foldMood } from "../logic/mood.mjs";
import { rollEntry, upsertEntry } from "../logic/mood.mjs";
import { catOptions, rollContext } from "../logic/actions.mjs";
import { watchers, kidAmong, highestAttention, humanByKey } from "../logic/residents.mjs";
import { getState, running } from "../robbery/store.mjs";
import { gm, isActiveGM } from "../robbery/gm-ops.mjs";
import { setting } from "../settings.mjs";
import { TEMPLATES, render, cardOf, registerButtons, button } from "../chat/cards.mjs";

const RESULT = CATB.results;
const odds = p => (p >= 0.995 ? "always" : p <= 0.005 ? "never" : `${Math.round(p * 100)}%`);
const actorOf = card => game.actors.get(card.actorId) ?? null;

/* ------------------------------------------------------------ rolling -- */

/** Roll for a cat actor. Resolves to the roll card message (or null if cancelled). */
export async function rollFor(actor, { approach = null, optionId = null } = {}) {
  if (!actor) throw new Error("Roll for whom?");
  if (actor.type !== "cat") { ui.notifications?.warn("Only cats roll: the house never does."); return null; }
  await finalizePendingFor(actor.id);
  const state = getState();
  const inRobbery = running(state) && state.cats.some(c => c.id === actor.id);
  if (inRobbery && !optionId) {
    optionId = await chooseOption(state, actor, approach);
    if (!optionId) return null; // the player closed the chooser
  }
  const ctx = inRobbery ? rollContext(state, actor.id, optionId ?? "free") : freeContext(actor);
  if (!ctx) { ui.notifications?.warn(`${actor.name} can't do that now.`); return null; }
  const answer = await rollDialog(actor, ctx, approach);
  if (!answer) return null;
  return makeRoll(actor, ctx, answer, inRobbery ? state : null);
}

/** Step 1: what is the cat doing? (only options that need a roll; a free roll is always there) */
async function chooseOption(state, actor, approach) {
  const all = catOptions(state, actor.id).options.filter(o => o.roll && o.id !== "free");
  const usable = all.filter(o => !o.disabled && (!approach || o.roll.options.some(x => x[0] === approach)));
  if (!usable.length) return "free";
  const buttons = usable.map(o => ({ action: o.id, label: o.label }));
  buttons.push({ action: "free", label: "Something else (a free roll)" });
  const res = await foundry.applications.api.DialogV2.wait({
    window: { title: `${actor.name}: what are you doing?` },
    content: `<p>${approach ? `${CATB.approaches[approach].label}: ` : ""}choose what ${foundry.utils.escapeHTML?.(actor.name) ?? actor.name} is trying.</p>`,
    buttons, rejectClose: false
  });
  return res ?? null;
}

/** A roll outside any robbery: the actor's own numbers, nobody watching. */
function freeContext(actor) {
  const s = actor.system;
  return {
    option: { id: "free", kind: "free", label: "", roll: { options: CATB.approachKeys.map(a => [a, 0]) } },
    cat: { id: actor.id, name: actor.name, r: s.approaches, instincts: s.instincts ?? [s.instinct1, s.instinct2] },
    room: null, roomName: "", options: CATB.approachKeys.map(a => ({ approach: a, label: CATB.approaches[a].label, difficulty: 0, tags: [], knack: false, knackFrom: [], rating: s.approaches?.[a] ?? 1, attention: 0 })),
    opposition: 0, bodyDie: false, seenBy: [], seenNames: [], attention: 0, kid: false, helpers: [], autoHelpers: false, free: true
  };
}

/** Step 2: the roll dialog. Resolves to the player's choices or null. */
async function rollDialog(actor, ctx, approach) {
  const autoSeen = setting(SETTINGS.autoSeen);
  const autoCattitude = setting(SETTINGS.autoCattitude);
  const cattitude = Number(actor.system.cattitude ?? 0);
  const best = ctx.options.find(o => o.approach === approach) ?? [...ctx.options].sort((a, b) => b.rating - a.rating)[0];
  const seenDefault = autoSeen ? ctx.seenBy.length > 0 : false;
  const queued = ctx.helpers.filter(h => h.queued).length;
  const approaches = ctx.options.map(o => {
    const plan = buildRollPlan({ approach: o.approach, rating: o.rating, knack: o.knack, bodyDie: ctx.bodyDie, helpers: queued,
      difficulty: o.difficulty, opposition: ctx.opposition, attention: seenDefault ? o.attention : 0 });
    const n = plan.zero ? 0 : plan.total;
    const bits = [`${o.label} ${o.rating}`];
    if (o.difficulty) bits.push(CATB.difficulties[o.difficulty] ?? `−${o.difficulty}`);
    if (o.knack) bits.push(`Knack (${o.knackFrom.join(", ")})`);
    return {
      approach: o.approach, label: o.label, selected: o.approach === best?.approach, text: bits.join(", "),
      diceText: plan.zero ? "0 (keep the lower of 2)" : String(plan.total), works: odds(chanceAtLeast(n, "scrape")), clean: odds(chanceAtLeast(n, "clean"))
    };
  });
  const diffText = ctx.options.map(o => `${o.label} ${CATB.difficulties[o.difficulty] ?? o.difficulty}`).join(", ");
  const data = {
    catName: actor.name, optionLabel: ctx.option?.label ?? "", roomName: ctx.roomName,
    approaches,
    difficulties: [{ value: "auto", label: `From what you're doing (${diffText})`, selected: true },
      ...[0, 1, 2].map(d => ({ value: String(d), label: CATB.difficulties[d], selected: false }))],
    knacks: [{ value: "auto", label: knackAutoText(ctx), selected: true }, { value: "yes", label: "Yes: an instinct suits it", selected: false }, { value: "no", label: "No", selected: false }],
    helpers: ctx.helpers.map(h => ({ ...h, locked: h.locked ?? ctx.autoHelpers })),
    canCattitude: cattitude > 0 || !autoCattitude, cattitude,
    bodyDie: ctx.bodyDie, opposition: ctx.opposition,
    seenChoices: [{ value: "auto", label: autoSeen ? (ctx.seenBy.length ? `As the house is: seen by ${ctx.seenNames.join(", ")}` : "As the house is: nobody sees") : "Not seen (fill in by hand)", selected: true },
      { value: "seen", label: "Seen", selected: false }, { value: "unseen", label: "Not seen", selected: false }],
    attention: seenDefault ? ctx.attention : 0,
    seenText: ctx.free ? "A free roll outside a robbery: nothing in the house changes." : (ctx.seenBy.length ? `${ctx.seenNames.join(" and ")} can see this${ctx.kid ? " (a kid: Cuddle steps double)" : ""}.` : "No human can see this."),
    warnings: ctx.option?.disabled ? [ctx.option.disabled] : []
  };
  const content = await render(TEMPLATES.rollDialog, data);
  return foundry.applications.api.DialogV2.wait({
    window: { title: `${actor.name} rolls` },
    content,
    buttons: [
      { action: "roll", label: "Roll", default: true, callback: (event, btn) => readRollForm(btn?.form ?? event?.target?.form, ctx) },
      { action: "cancel", label: "Cancel" }
    ],
    rejectClose: false
  }).then(r => (r && typeof r === "object" ? r : null));
}

function knackAutoText(ctx) {
  const k = ctx.options.filter(o => o.knack);
  return k.length ? `From your instincts (${k.map(o => `${o.label}: ${o.knackFrom.join(", ")}`).join("; ")})` : "From your instincts (none suits this)";
}

/** Read the dialog's form (FormDataExtended-free, so it works on any client). */
export function readRollForm(form, ctx) {
  const el = name => form?.elements?.[name] ?? form?.elements?.namedItem?.(name) ?? null;
  const val = (name, d) => { const e = el(name); return e ? e.value : d; };
  const on = name => !!el(name)?.checked;
  // a haul's other carriers are locked in (v0.8); anyone else helps if ticked
  const helpers = ctx.helpers.filter(h => (h.locked ?? ctx.autoHelpers) || on(`help-${h.id}`)).map(h => h.id);
  return {
    approach: val("approach", ctx.options[0]?.approach),
    difficulty: val("difficulty", "auto"),
    knack: val("knack", "auto"),
    helpers,
    cattitudeDie: on("cattitudeDie"),
    opposition: Number(val("opposition", ctx.opposition)) || 0,
    seen: val("seen", "auto"),
    attention: Number(val("attention", ctx.attention)) || 0
  };
}

/** Step 3: build the plan, spend, roll, post the card. */
export async function makeRoll(actor, ctx, answer, state) {
  const o = ctx.options.find(x => x.approach === answer.approach) ?? ctx.options[0];
  const approach = o.approach;
  const autoSeen = setting(SETTINGS.autoSeen);
  let seen = answer.seen === "seen" ? true : answer.seen === "unseen" ? false : (autoSeen ? ctx.seenBy.length > 0 : false);
  let seenBy = seen ? (ctx.seenBy.length ? ctx.seenBy : []) : [];
  const kid = seen && !!ctx.kid;
  const difficulty = answer.difficulty === "auto" ? o.difficulty : Number(answer.difficulty) || 0;
  const knack = answer.knack === "auto" ? o.knack : answer.knack === "yes";
  const attention = seen && attentionApplies(approach) ? answer.attention : 0;
  const cattitude = Number(actor.system.cattitude ?? 0);
  const autoCattitude = setting(SETTINGS.autoCattitude);
  let cattitudeDie = !!answer.cattitudeDie;
  if (cattitudeDie && autoCattitude && cattitude < 1) { ui.notifications?.warn(`${actor.name} has no Cattitude to spend.`); cattitudeDie = false; }
  const plan = buildRollPlan({ approach, rating: Number(actor.system.approaches?.[approach] ?? o.rating), knack, bodyDie: ctx.bodyDie,
    helpers: answer.helpers.length, cattitudeDie, difficulty, opposition: answer.opposition, attention });
  if (cattitudeDie && autoCattitude) await actor.update({ "system.cattitude": clampCattitude(cattitude - 1) });
  const roll = await new Roll(`${plan.dice}d6`).evaluate();
  const faces = roll.dice[0].results.map(r => r.result);
  const result = readDice(faces, plan.zero);
  const id = foundry.utils.randomID();
  const card = {
    v: 1, kind: CARD.roll, version: 1, eventId: id, robberyId: state?.id ?? null, roundSerial: state?.roundSerial ?? null,
    actorId: actor.id, catId: actor.id, catName: actor.name, userId: game.user.id,
    optionId: ctx.free ? null : (ctx.option?.id ?? "free"), optionLabel: ctx.option?.label ?? "", room: ctx.room, roomName: ctx.roomName ?? "",
    approach, plan, faces, zero: plan.zero, result, firstResult: result,
    pushes: [], pushed: false, pushedWithMood: false,
    seen, seenBy, seenNames: seenBy.map(k => humanByKey(state ?? { humans: [] }, k)?.name ?? k), kid, attention,
    helpers: answer.helpers, helperNames: answer.helpers.map(h => ctx.helpers.find(x => x.id === h)?.name ?? h),
    cattitudeSpent: cattitudeDie ? 1 : 0, status: "pending", applied: false, appliedText: [], quiet: false
  };
  const content = await renderRollCard(card);
  return ChatMessage.create({ _id: id, content, speaker: ChatMessage.getSpeaker({ actor }), rolls: [roll], flags: { [FLAG]: { card } } }, { keepId: true });
}

/* -------------------------------------------------------------- the card -- */

/** The roll card's HTML from its flags. */
export async function renderRollCard(card) {
  const hi = readIndex(card.faces, card.zero);
  const rerolled = new Set(card.pushes?.at(-1)?.rerolled ?? []);
  const dice = card.faces.map((f, i) => ({ face: f, cls: [f === 6 ? "six" : "", i === hi ? "read" : "", rerolled.has(i) ? "rerolled" : ""].filter(Boolean).join(" ") }));
  const p = card.plan;
  const adds = p.add.filter(a => a.value).map(a => `${a.label} ${a.value}`).join(" + ");
  const rem = p.remove.map(r => `${r.label} −${r.value}`).join(", ");
  const planText = `${adds}${p.overCap ? ` (capped at ${CATB.rules.diceCap})` : ""}${rem ? `; ${rem}` : ""} → ${p.zero ? "0 dice (two rolled, lower kept)" : `${p.total} dice`}.`
    + (card.helperNames?.length ? ` Helped by ${card.helperNames.join(" and ")}.` : "");
  const status = card.applied ? "Applied to the robbery." : card.status === "final" ? "Final — waiting for the Storyteller's client." : "Pending: Push or Accept. It's accepted anyway when this cat does something else, or at the end of the round.";
  return render(TEMPLATES.roll, {
    ...card, dice, planText, approachLabel: CATB.approaches[card.approach]?.label ?? card.approach,
    resultKey: card.result, resultLabel: RESULT[card.result]?.label ?? card.result, resultText: RESULT[card.result]?.text ?? "",
    seenNames: (card.seenNames ?? []).join(", "), moodText: moodText(card), noise: RESULT[card.result]?.noise && !card.quiet,
    pushText: card.pushes?.length ? `Pushed (${card.pushes[0].by === "mood" ? "+1 Mood step" : "1 Cattitude"}): was a ${RESULT[card.firstResult]?.label ?? card.firstResult}.` : "",
    applied: card.appliedText ?? [], statusText: status
  });
}

/** What the roll does (or did) to the Mood, in words. */
function moodText(card) {
  const state = getState();
  if (!card.robberyId || !state || state.id !== card.robberyId) return card.seen ? "Seen (no robbery running: the Mood isn't tracked)." : "";
  if (card.applied) return (card.appliedText ?? []).find(t => /^(Broom|Cuddle) [+-]/.test(t)) ?? (card.seen ? "No Mood step." : "Not seen: the Mood doesn't move.");
  const { ledger, entry } = upsertEntry(state.moodLedger ?? [], rollEntry(card));
  const f = foldMood(ledger, state.patience0);
  const r = f.resolved[entry.id];
  if (!r?.steps) return card.seen ? (card.result === "purrfect" ? "Purrfect: nobody minds — no Mood step." : card.approach === "sneaky" && card.result === "clean" ? "A Sneaky Clean: they never noticed — no Mood step." : "No Mood step.") : "Not seen: the Mood doesn't move.";
  const name = r.side === "broom" ? "Broom" : "Cuddle";
  return `If it stands: ${name} +${r.steps} (${f[r.side]}/${f.patience})${f.full[r.side] ? ` — ${name} is full: ${r.side === "broom" ? "Shoo!" : "Scooped!"}` : ""}.`;
}

/** Update a roll card's flags and content (the author, or the GM). */
export async function updateRollCard(message, patch) {
  const card = { ...cardOf(message), ...patch, version: (cardOf(message)?.version ?? 0) + 1 };
  const content = await renderRollCard(card);
  await message.update({ content, [`flags.${FLAG}.card`]: card });
  return card;
}

/* ------------------------------------------------------------- buttons -- */

/** Ch 4 "Push your luck": once per roll, reroll every die that isn't a 6. Pay 1 Cattitude or 1 Mood step. */
export async function push(message, how) {
  const card = cardOf(message);
  if (!card || card.kind !== CARD.roll) throw new Error("Not a roll card.");
  if (card.status !== "pending" || card.pushed) throw new Error("This roll can't be pushed any more.");
  if (!canPush(card.faces)) throw new Error("Every die is already a 6.");
  const actor = actorOf(card);
  if (how === "cattitude") {
    const c = Number(actor?.system.cattitude ?? 0);
    if (setting(SETTINGS.autoCattitude)) {
      if (c < 1) throw new Error(`${card.catName} has no Cattitude to push with.`);
      await actor.update({ "system.cattitude": clampCattitude(c - 1) });
    }
  }
  const idx = pushIndices(card.faces);
  const roll = await new Roll(`${idx.length}d6`).evaluate();
  const faces = applyPush(card.faces, roll.dice[0].results.map(r => r.result));
  const result = readDice(faces, card.zero);
  game.dice3d?.showForRoll?.(roll, game.user, true);
  return updateRollCard(message, {
    faces, result, pushed: true, pushedWithMood: how === "mood", status: "final",
    pushes: [...(card.pushes ?? []), { by: how, rerolled: idx, faces }],
    cattitudeSpent: (card.cattitudeSpent ?? 0) + (how === "cattitude" ? 1 : 0)
  });
}

/** Accept the roll as it is: it becomes final. */
export async function accept(message) {
  const card = cardOf(message);
  if (card?.status !== "pending") return card;
  return updateRollCard(message, { status: "final" });
}

/** The GM flips Seen / Not seen while the roll is pending (AUTOMATION.md §4). */
export async function toggleSeen(message) {
  const card = cardOf(message);
  if (!game.user.isGM) throw new Error("Only the Storyteller decides who saw it.");
  if (card.status !== "pending") throw new Error("The roll is already final.");
  if (card.seen) return updateRollCard(message, { seen: false, seenBy: [], seenNames: [], kid: false });
  const state = getState();
  const ws = state && card.room ? watchers(state, card.room) : [];
  return updateRollCard(message, { seen: true, seenBy: ws.map(h => h.key), seenNames: ws.map(h => h.name), kid: kidAmong(ws), attention: highestAttention(ws) });
}

/** Make this cat's pending roll cards final (its player starts something else). */
export async function finalizePendingFor(catId) {
  for (const m of pendingRollMessages({ catId })) {
    if (m.isOwner) await accept(m);
  }
}

/** Pending roll cards of the current robbery (newest last). */
export function pendingRollMessages({ catId = null } = {}) {
  const state = getState();
  return (game.messages?.contents ?? [...(game.messages ?? [])]).filter(m => {
    const c = cardOf(m);
    return c?.kind === CARD.roll && c.status === "pending" && (!catId || c.catId === catId) && (!state || c.robberyId === state.id);
  });
}

function rollButtons(message, card, box) {
  const actor = actorOf(card);
  // the player who rolled (or any non-GM owner of the cat); a GM who rolled for a cat counts as its player
  const owner = card.userId === game.user.id || (!!actor?.isOwner && !game.user.isGM);
  if (card.status === "pending" && !card.pushed) {
    if (owner && canPush(card.faces)) {
      const c = Number(actor?.system.cattitude ?? 0);
      if (c > 0 || !setting(SETTINGS.autoCattitude)) box.appendChild(button("Push (1 Cattitude)", () => push(message, "cattitude"), { cls: "catb-push" }));
      if (card.robberyId) box.appendChild(button("Push (+1 Mood)", () => push(message, "mood"), { cls: "catb-push" }));
    }
    if (owner || game.user.isGM) box.appendChild(button("Accept", () => accept(message)));
    if (game.user.isGM && card.robberyId) box.appendChild(button(card.seen ? "Not seen" : "Seen", () => toggleSeen(message), { cls: "catb-gm" }));
  } else if (card.status === "final" && !card.applied && card.robberyId && game.user.isGM) {
    box.appendChild(button("Apply now", () => gm.run(OPS.rollFinalize, { messageId: message.id }), { cls: "catb-gm" }));
  }
}

export function registerDice() {
  registerButtons(CARD.roll, rollButtons);
}

export { isActiveGM };
