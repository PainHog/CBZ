/**
 * NINE LIVES GANG — running a robbery in Foundry (AUTOMATION.md §5–6).
 *
 * Storyteller commands (active GM only): start, begin round (Prize Clock,
 * temptation prompt), tempt, end round (the house's turn, rolled and applied),
 * end the robbery (outcome), and the manual overrides the tracker offers.
 * Player commands go to the active GM as operations (gm-ops.mjs): a Move or
 * simple thing, help, "I acted", answering a temptation, spending a Life.
 * Everything that changes the robbery is a pure function from module/logic/
 * applied through the serialised store; chat cards announce what happened.
 */
import { CARD, OPS, HOOKS, SETTINGS, FLAG } from "../contracts.mjs";
import { CATB } from "../config.mjs";
import * as Round from "../logic/round.mjs";
import { findOption, doAction, queueHelp, markTurn as markTurnPure } from "../logic/actions.mjs";
import { findHouse, HOUSES } from "../logic/house-catalog.mjs";
import { catById, humanByKey, roomName } from "../logic/residents.mjs";
import * as Getaway from "../logic/getaway.mjs";
import * as Cred from "../logic/cred.mjs";
import { clampCattitude } from "../logic/rules.mjs";
import { catSnapshot } from "../data/actor-data.mjs";
import { getState, running, onGetaway, mutate } from "./store.mjs";
import { gm, isActiveGM, owns } from "./gm-ops.mjs";
import { finalizePending, applyCattitude, applyRollMessage } from "./automation.mjs";
import { postMoodCards, metersOf, outcomeView, postGetawayCards, postOutcome, postCredCard } from "./announce.mjs";
import { postEventCard, rerenderEvent, cardOf, registerButtons, button } from "../chat/cards.mjs";
import { rollFor, updateRollCard } from "../dice/roll.mjs";
import { automation, setting } from "../settings.mjs";

const lines = events => events.map(e => e.text).filter(Boolean);
const requireGM = () => { if (!isActiveGM()) throw new Error("Only the active Storyteller can do that."); };
const notify = res => { if (res && res.ok === false && res.error && res.error !== "no-gm") ui.notifications?.warn(res.error); return res; };

/* ------------------------------------------------------- the Storyteller -- */

/** The cats a new robbery uses by default: every cat with a player owner (else every cat). */
export function defaultGang() {
  const cats = game.actors.filter(a => a.type === "cat");
  const owned = cats.filter(a => a.hasPlayerOwner);
  return owned.length ? owned : cats;
}

/** Start a robbery at a house (a catalog key or name, or a house journal) with these cat actors. */
export async function startRobbery(houseRef, { actorIds = null } = {}) {
  requireGM();
  const house = findHouse(houseRef);
  if (!house) throw new Error(`There's no house called "${houseRef?.name ?? houseRef}".`);
  const actors = (actorIds ?? defaultGang().map(a => a.id)).map(id => game.actors.get(id)).filter(a => a?.type === "cat");
  if (!actors.length) throw new Error("Choose at least one cat for the gang.");
  if (actors.length < 3 || actors.length > 5) ui.notifications?.info("The houses are written for 3 to 5 cats.");
  const state = Round.newRobbery(house, { id: foundry.utils.randomID(), cats: actors.map(catSnapshot) });
  for (const r of [...state.humans, ...state.pets]) {
    const a = game.actors.find(x => (x.type === "human" || x.type === "pet") && x.system.house === house.key && x.system.key === r.key);
    if (a) r.actorId = a.id;
  }
  await mutate(() => ({ state }));
  if (setting(SETTINGS.autoCattitude)) for (const a of actors) await a.update({ "system.cattitude": clampCattitude(state.cattitudeStart) });
  const who = [...house.humans.map(h => h.name), ...house.pets.map(p => p.name)].join(", ");
  const cr = state.cred;
  const route = house.getaway ?? Getaway.DEFAULT_ROUTE;
  const credBits = [
    cr?.catnip ? `the catnip stash is ${cr.catnipName} (the ${roomName(state, cr.catnip).toLowerCase()})` : "",
    cr?.rivals ? `${cr.rivals}${cr.rivalTag ? ` have tagged the ${roomName(state, cr.rivalTag).toLowerCase()}` : " are about"}${Number.isInteger(cr.patch) && route[cr.patch] ? `, and hang about at ${route[cr.patch].name} on the getaway` : ""}` : ""
  ].filter(Boolean);
  const credLine = `Cred: ${credBits.length ? credBits.join("; ") : "tag a room for 1 (one tag a room for the whole gang)"}. Show off!`;
  await postEventCard({ kind: CARD.robbery, robberyId: state.id, houseKey: house.key }, {
    title: house.name, subtitle: `${({ easy: "Easy", standard: "Standard", hard: "Hard" })[house.label] ?? house.label} · ${actors.length} cats`,
    lines: [
      `Patience ${state.patience0}${state.ownScaling ? ` (this house's own number for ${state.gangSize <= 3 ? "three" : "five"} cats)` : ""}. Every cat starts with ${state.cattitudeStart} Cattitude${state.repBonus ? ` (the gang's Rep ${state.rep}: +${state.repBonus})` : ""}.`,
      `The ${house.prize.name} (${house.prize.size}${state.prize.portions ? `, ${state.prize.portions} portions` : ""}) is gone at the start of round ${state.clock.goneAt}; Lights Out at the end of round ${state.clock.lightsOut}.`,
      `Who lives here: ${who}.`,
      `Ways in: ${house.entrances.map(e => e.name).join("; ")}.`,
      `The gang: ${actors.map(a => a.name).join(", ")} — all outside.`,
      credLine
    ]
  });
  return state;
}

/** Begin the next round: the Prize Clock, then the temptation prompt (AUTOMATION.md §5). */
export async function beginRound() {
  requireGM();
  await finalizePending();
  const auto = automation();
  const res = await mutate(s => Round.beginRound(s, { prizeClock: auto.prizeClock, mood: auto.mood, d6: auto.d6 }));
  const s = res.state;
  await postEventCard({ kind: CARD.round, robberyId: s.id, round: s.round }, { title: `Round ${s.round}`, lines: lines(res.events), meters: metersOf(s) });
  Hooks.callAll(HOOKS.roundBegan, s);
  await postMoodCards(res.events, s);
  if (res.tempt?.length) {
    if (auto.temptation === "prompt") {
      await postEventCard({ kind: CARD.temptPrompt, robberyId: s.id, round: s.round, options: res.tempt }, {
        title: "Temptation", subtitle: "Tempt one cat this round, or nobody. The tempted cat goes first.",
        lines: res.tempt.map(o => `${o.catName} (${o.label}): ${o.tempt}, in the ${o.roomName.toLowerCase()}.`)
      }, { whisperGM: true });
    } else if (auto.temptation === "auto") await temptCat("random");
  }
  return res;
}

/** Tempt a cat: { catId, instinct }, or "random" (a d6 among the eligible). */
export async function temptCat(pick) {
  requireGM();
  let p = pick;
  if (pick === "random") {
    const n = Round.temptationOptions(getState()).length;
    if (!n) throw new Error("Nobody can be tempted now.");
    const roll = await new Roll(`1d${n}`).evaluate();
    p = roll.total;
  }
  const res = await mutate(s => Round.tempt(s, p));
  const t = res.temptation;
  const c = catById(res.state, t.catId);
  const ins = Round.temptInfo(res.state, t.instinct);
  const zoom = Cred.zoomies(c, { cred: automation().cred });
  await postEventCard({ kind: CARD.temptation, robberyId: res.state.id, round: res.state.round, catId: t.catId, instinct: t.instinct, answered: null }, {
    title: `Temptation: ${c.name}`, subtitle: `${ins.label} — ${t.tempt ?? ins.tempt}, in the ${roomName(res.state, t.room).toLowerCase()}`,
    lines: [`Give in: +1 Cattitude. ${ins.giveInText} It's ${c.name}'s Action this round, done before it moves${c.carrying ? ", and it drops the prize first" : ""}.`,
      zoom ? `Resist? ${c.name} has the zoomies: it can't resist anything.` : "Resist: spend 1 Cattitude (with none, you must give in).", `${c.name} goes first this round.`]
  });
  return res;
}

/** End the round: the house's turn, rolled and applied (setting autoHouseTurn). */
export async function endRound({ confirm = null } = {}) {
  requireGM();
  const auto = automation();
  if (auto.houseTurn === "prompt" && confirm !== true) {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "End the round" },
      content: "<p>Run the house's turn now? Pets, then noise, then routines and holders, then Finding it.</p>"
    });
    if (!ok) return null;
  }
  await finalizePending();
  const manual = auto.houseTurn === "manual";
  const d6 = manual ? null : await houseDice(getState());
  const res = await mutate(s => Round.endRound(s, { d6, routines: auto.routines, houseTurn: !manual, mood: auto.mood }));
  const s = res.state;
  await postEventCard({ kind: CARD.houseTurn, robberyId: s.id, round: s.round }, {
    title: `The house's turn — round ${s.round}`, lines: lines(res.events).slice(1), meters: metersOf(s),
    footer: res.end?.due ? res.end.text : ""
  });
  Hooks.callAll(HOOKS.roundEnded, s, res.events);
  await postMoodCards(res.events, s);
  if (res.end?.due && auto.outcome) await endRobbery(res.end.reason);
  return res;
}

/**
 * The house's dice for one turn, rolled in the open with one Foundry Roll (so a
 * dice module shows them); if the turn needs more, Foundry's own RNG adds them.
 */
async function houseDice(state) {
  const n = Math.max(1, (state?.humans?.length ?? 0) * 2 + (state?.pets?.length ?? 0) + 4);
  const roll = await new Roll(`${n}d6`).evaluate();
  const faces = roll.dice[0].results.map(r => r.result);
  const rnd = CONFIG.Dice?.randomUniform ?? Math.random;
  return () => (faces.length ? faces.shift() : 1 + Math.floor(rnd() * 6));
}

/**
 * End the house part now (Ch 8): Lights Out, nobody free inside with the prize
 * out, eaten or gone, or the gang running for it (the Storyteller's End). Any
 * cat still inside is pinched, and the getaway starts (Ch 9); the outcome card
 * comes when everyone is home or pinched.
 */
export async function endRobbery(reason = "manual") {
  requireGM();
  await finalizePending();
  if (onGetaway()) return finishGetaway();
  const res = await mutate(s => Round.finishRobbery(s, reason));
  await postGetawayCards(res.events, res.state, { title: "Leg it!", always: true });
  return res;
}

/** The end of a getaway round (Ch 9): the warden comes on, loot behind it is lost, stragglers are cornered. */
export async function endGetawayRound() {
  requireGM();
  await finalizePending();
  const auto = automation();
  const res = await mutate(s => Getaway.endGetawayRound(s, { getaway: auto.getaway }));
  await postGetawayCards(res.events, res.state, { title: "The warden", always: true });
  return res;
}

/** The Storyteller ends the getaway (every cat home or pinched) and counts the loot. */
export async function finishGetaway() {
  requireGM();
  await finalizePending();
  const res = await mutate(s => Getaway.finishGetaway(s));
  await postGetawayCards(res.events, res.state);
  return res;
}

/** Throw the robbery away (the tracker's Clear). */
export async function clearRobbery() {
  requireGM();
  await mutate(() => ({ state: null }));
}

/* ------------------------------------------ the Storyteller's overrides -- */

const gmMutate = fn => { requireGM(); return mutate(fn).then(async res => { await postMoodCards(res?.events ?? [], res?.state); return res; }); };
// v0.8: a change by hand also lets a waiting meter go off (a human with free hands who can see a cat acts at once);
// v0.9: a tie between humans is settled by Attention, then a die
const moodMode = () => ({ mood: automation().mood, d6: automation().d6, cred: automation().cred });
export const overrides = {
  moodAdjust: (side, steps) => gmMutate(s => Round.manualMood(s, side, steps, moodMode())),
  moodUndo: () => gmMutate(s => Round.undoMood(s)),
  moodConfirm: (entryId, accept = true) => gmMutate(s => Round.confirmMood(s, entryId, { accept, ...moodMode() })),
  placeCat: (catId, where, opts) => gmMutate(s => Round.placeCat(s, catId, where, { ...moodMode(), ...(opts ?? {}) })),
  placeResident: (key, room) => gmMutate(s => Round.placeResident(s, key, room, moodMode())),
  setOpen: args => gmMutate(s => Round.setOpen(s, args)),
  markNoise: (room, opts) => gmMutate(s => Round.markNoise(s, room, opts)),
  patch: (key, patch) => gmMutate(s => Round.patchResident(s, key, patch, moodMode())),
  /** The Storyteller picks the cat a full meter falls on (a meter filled with no roll, or one that was waiting). */
  pickTarget: catId => gmMutate(s => Round.resolvePendingTrigger(s, catId, moodMode())),
  /** The Storyteller does a cat's option by hand, even when it's normally refused. */
  force: (catId, optionId, args = {}) => gmMutate(s => doAction(s, catId, optionId, { ...args, force: true }, moodMode())),
  /** The getaway by hand (Ch 9): a cat to a space (0–3), "home" or "pinched"; the warden to a space (or "none"); a cat's loot. */
  runner: (catId, where) => getawayMutate(s => Getaway.placeRunner(s, catId, where)),
  warden: pos => getawayMutate(s => Getaway.setWarden(s, pos)),
  carry: (catId, n) => getawayMutate(s => Getaway.setCarry(s, catId, n)),
  /** Cred by hand (Ch 9): a cat's Cred tonight, and the zoomies on or off. */
  cred: (catId, n) => gmMutate(s => Cred.setCred(s, catId, n)),
  zoomies: (catId, on) => gmMutate(s => Cred.setZoomies(s, catId, on))
};
function getawayMutate(fn) {
  requireGM();
  return mutate(fn).then(async res => { await postGetawayCards((res?.events ?? []).filter(e => e.type === "outcome"), res?.state); return res; });
}

/* --------------------------------------------------------------- players -- */

/** A cat does an option. One that needs a roll opens the roll dialog; the rest go to the GM. */
export async function act(catId, optionId, { helpers } = {}) {
  const o = findOption(getState(), catId, optionId);
  if (!o) { ui.notifications?.warn("That isn't possible now."); return null; }
  if (o.disabled) { ui.notifications?.warn(o.disabled); return null; }
  if (o.roll) return rollFor(game.actors.get(catId), { optionId });
  return notify(await gm.run(OPS.catAct, { catId, optionId, helpers }));
}
export const help = async (catId, targetId) => notify(await gm.run(OPS.catHelp, { catId, targetId }));
export const markTurn = async (catId, patch) => notify(await gm.run(OPS.catTurn, { catId, ...patch }));
export const answerTemptation = async (catId, choice, { human = null } = {}) => notify(await gm.run(OPS.temptAnswer, { catId, choice, human }));
export const spendLife = async catId => notify(await gm.run(OPS.campaignLife, { catId }));

/** The check every cat op shares: a robbery, the cat is in it, the user owns it. */
function catCheck({ catId } = {}, user) {
  const s = getState();
  if (!running(s)) return "There is no robbery running.";
  if (!catById(s, catId)) return "That cat isn't in this robbery.";
  const actor = game.actors.get(catId);
  if (!actor) return "That cat's actor is missing.";
  if (!owns(user, actor)) return `${user?.name ?? "That player"} doesn't own ${actor.name}.`;
  return null;
}

export function registerRobberyOps() {
  gm.register(OPS.catAct, {
    check: catCheck,
    apply: async ({ catId, optionId, helpers, force }, user) => {
      await finalizePending({ catId });
      const res = await mutate(s => doAction(s, catId, optionId, { helpers, force: !!(user?.isGM && force) }, moodMode()));
      await postCredCard(res.events, res.state);
      await postMoodCards(res.events, res.state);
      await postGetawayCards(res.events, res.state);
      return { events: lines(res.events), done: res.ok !== false };
    }
  });
  gm.register(OPS.catHelp, {
    check: catCheck,
    apply: async ({ catId, targetId }) => ({ events: lines((await mutate(s => queueHelp(s, catId, targetId))).events) })
  });
  gm.register(OPS.catTurn, {
    check: (args, user) => catCheck(args, user) ?? ((!user?.isGM && (args.moved === false || args.acted === false)) ? "Only the Storyteller gives a Move or Action back." : null),
    apply: async ({ catId, moved, acted }) => { await mutate(s => markTurnPure(s, catId, { moved, acted })); return {}; }
  });
  gm.register(OPS.temptAnswer, {
    check: (args, user) => {
      const err = catCheck(args, user);
      if (err) return err;
      const t = getState().temptation;
      if (!t || t.catId !== args.catId || t.choice) return "There's no temptation waiting for that cat.";
      return ["gaveIn", "resisted"].includes(args.choice) ? null : "Give in or resist?";
    },
    apply: async ({ catId, choice, human }) => {
      const actor = game.actors.get(catId);
      const cattitude = setting(SETTINGS.autoCattitude) ? Number(actor.system.cattitude ?? 0) : 1;
      const res = await mutate(s => Round.answerTemptation(s, { choice, cattitude, human }, moodMode()));
      await applyCattitude(res.cattitude);
      const final = res.state.temptation.choice;
      for (const m of game.messages.filter(x => { const c = cardOf(x); return c?.kind === CARD.temptation && c.robberyId === res.state.id && c.round === res.state.round && c.catId === catId && !c.answered; })) {
        const card = { ...cardOf(m), answered: final };
        await rerenderEvent(m, card, { title: `Temptation: ${actor.name}`, subtitle: final === "gaveIn" ? "Gave in" : "Resisted", lines: lines(res.events) });
      }
      await postMoodCards(res.events, res.state);
      return { choice: final, events: lines(res.events) };
    }
  });
  gm.register(OPS.rollFinalize, {
    check: ({ messageId }, user) => {
      const m = game.messages.get(messageId);
      if (!m) return "No such message.";
      return user?.isGM || cardOf(m)?.userId === user?.id ? null : "Only its roller or the Storyteller can do that.";
    },
    apply: async ({ messageId }) => {
      const m = game.messages.get(messageId);
      if (cardOf(m)?.status === "pending") await updateRollCard(m, { status: "final" });
      await applyRollMessage(m);
      return {};
    }
  });
  gm.register(OPS.campaignLife, {
    check: ({ catId }, user) => {
      const s = getState();
      const actor = game.actors.get(catId);
      if (s?.phase !== "ended" || !s.outcome?.leftBehind?.includes(catId)) return "Only a cat pinched at the end of a robbery can spend a Life to bust out of the pound.";
      if (!owns(user, actor)) return "That isn't your cat.";
      if ((actor.system.lives ?? 0) < 1) return `${actor.name} has no Lives left: somebody adopts it from the pound, and it lives on a lap for ever.`;
      return null;
    },
    apply: async ({ catId }) => {
      const actor = game.actors.get(catId);
      await actor.update({ "system.lives": Math.max(0, (actor.system.lives ?? 0) - 1) });
      const s = getState();
      for (const m of game.messages.filter(x => { const c = cardOf(x); return c?.kind === CARD.outcome && c.robberyId === s.id; })) {
        const card = cardOf(m);
        const escaped = [...new Set([...(card.escaped ?? []), catId])];
        await rerenderEvent(m, { ...card, escaped }, outcomeView(s, s.outcome, escaped));
      }
      return { lives: actor.system.lives };
    }
  });
}

/* --------------------------------------------------------- card buttons -- */

export function registerRobberyButtons() {
  registerButtons(CARD.temptation, (message, card, box) => {
    const s = getState();
    const t = s?.temptation;
    if (card.answered || !t || t.catId !== card.catId || t.choice || s.id !== card.robberyId) return;
    const actor = game.actors.get(card.catId);
    if (!(game.user.isGM || actor?.isOwner)) return;
    const c = catById(s, card.catId);
    if (card.instinct === "lapCat") {
      const here = s.humans.filter(h => h.room === c.where && !h.holding && !((h.asleepUntil ?? -1) >= s.round));
      if (here.length > 1) for (const h of here) box.appendChild(button(`Give in: a fuss with ${h.name}`, () => answerTemptation(card.catId, "gaveIn", { human: h.key })));
      else box.appendChild(button("Give in (+1 Cattitude)", () => answerTemptation(card.catId, "gaveIn")));
    } else box.appendChild(button("Give in (+1 Cattitude)", () => answerTemptation(card.catId, "gaveIn")));
    const cat = Number(actor?.system.cattitude ?? 0);
    // Ch 9 "Cred": a cat with the zoomies can't resist anything
    if (Cred.zoomies(c, { cred: setting(SETTINGS.autoCred) })) return;
    if (cat > 0 || !setting(SETTINGS.autoCattitude)) box.appendChild(button("Resist (1 Cattitude)", () => answerTemptation(card.catId, "resisted")));
  });
  registerButtons(CARD.temptPrompt, (message, card, box) => {
    if (!game.user.isGM) return;
    const s = getState();
    if (!running(s) || s.id !== card.robberyId || s.round !== card.round || s.temptation) return;
    const live = Round.temptationOptions(s);
    for (const o of live) box.appendChild(button(`Tempt ${o.catName}: ${o.label}`, () => temptCat({ catId: o.catId, instinct: o.instinct })));
    if (live.length > 1) box.appendChild(button("Tempt at random", () => temptCat("random")));
  });
  registerButtons(CARD.outcome, (message, card, box) => {
    const s = getState();
    // Ch 14: 1 Rep for a Clean Getaway, and 1 for a night with 5 or more Cred that wasn't Busted (Ch 9)
    const rep = card.rep ?? (card.result === "clean" ? 1 : 0);
    if (game.user.isGM && rep > 0 && !card.repGiven) {
      box.appendChild(button(`Give the gang +${rep} Rep (campaign${card.repWhy?.length ? `: ${card.repWhy.join(" and ")}` : ""})`, async () => {
        for (const c of s?.cats ?? []) { const a = game.actors.get(c.id); if (a) await a.update({ "system.rep": Number(a.system.rep ?? 0) + rep }); }
        await message.update({ [`flags.${FLAG}.card.repGiven`]: true });
      }));
    }
    for (const id of card.leftBehind ?? []) {
      const a = game.actors.get(id);
      if (!a || (card.escaped ?? []).includes(id) || !(a.isOwner)) continue;
      box.appendChild(button(`${a.name}: spend a Life to bust out of the pound`, () => spendLife(id)));
    }
  });
  registerButtons(CARD.moodPick, (message, card, box) => {
    const s = getState();
    const p = s?.pendingTrigger;
    if (!game.user.isGM || !p || s.id !== card.robberyId || p.side !== card.side) return;
    const human = s.humans.find(h => h.key === p.human);
    for (const id of p.candidates) {
      const c = catById(s, id);
      if (c) box.appendChild(button(`${human?.name ?? "The human"} ${p.side === "broom" ? "chases out" : "picks up"} ${c.name}`, () => overrides.pickTarget(id)));
    }
  });
  const openBtn = (message, card, box) => {
    if (game.user.isGM || setting(SETTINGS.trackerForPlayers)) box.appendChild(button("Open the Robbery Tracker", () => game.catBurglars?.openTracker?.()));
  };
  registerButtons(CARD.robbery, openBtn);
  registerButtons(CARD.round, openBtn);
  registerButtons(CARD.getaway, (message, card, box) => {
    openBtn(message, card, box);
    const s = getState();
    if (game.user.isGM && onGetaway(s) && s.id === card.robberyId && s.getaway.stage === "run" && s.getaway.round === card.round) {
      box.appendChild(button("End the getaway round", () => endGetawayRound(), { cls: "catb-gm" }));
    }
  });
}

/** The robbery API on game.catBurglars.robbery. */
export const robberyApi = {
  state: getState, houses: HOUSES, startRobbery, beginRound, temptCat, endRound, endRobbery, endGetawayRound, finishGetaway, clearRobbery, overrides,
  act, help, markTurn, answerTemptation, spendLife, defaultGang
};
