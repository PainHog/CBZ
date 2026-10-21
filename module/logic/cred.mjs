/**
 * NINE LIVES GANG — Cred (pure)
 * ----------------------------
 * Ch 9 "Cred: showing off" (core rules v0.9 with the getaway and Cred; the
 * simulator's package P13: sim/engine.mjs showOff, addCred, getNip). Cred is
 * scored per cat, and it never changes how the night went — only who gets to
 * brag about it:
 *   - Tag a room: 1 Cred. One tag a room for the whole gang; it's the cat's
 *     Action — unseen a simple thing (no roll, no noise) and a mess (the next
 *     human in that room finds it: +1 Broom); in view a roll (Sneaky to do it
 *     unnoticed, Savage to just do it), +1 if it works, and no mess (they already
 *     know: P14 seenTagNoMess); +1 more over the rivals' tag. With the zoomies
 *     every tag is a roll (P14 zoomiesTagRoll).
 *   - The catnip stash: 1 Cred. One stash, one cat: given in to as a temptation
 *     (any cat in its room, whatever its instincts) or taken on purpose as an
 *     Action (in view, a roll). That cat has the zoomies ("on the nip") until the
 *     house part ends: +1 die (still no more than 5), every roll it makes is a
 *     noise, it can't resist a temptation, and its Cred counts double (not the
 *     catnip's own point). It ends when the getaway starts.
 *   - The getaway (getaway.mjs): the cat who leads a group past the rivals with
 *     a Clean or a Purrfect 1, a Purrfect on any obstacle 1; loot dropped where
 *     the rivals hang about is nicked at once.
 *   - The end of the night: the most Cred is the Cat's Whiskers (ties share it);
 *     in a campaign a night when the gang's Cred adds up to 8 or more (P14) and
 *     it wasn't Busted is worth 1 Rep.
 *
 * State: `s.cred = { catnip, catnipName, rivals, rivalTag, patch, tags: [room], nipBy }`
 * (the house's Cred line, from the catalog) and each cat's `cred` (tonight's
 * points) and `nip` (the zoomies). `ctx.cred === false` (the autoCred setting
 * off): tags and the stash are still recorded, but nothing scores by itself and
 * the zoomies change no roll — the Storyteller keeps Cred by hand (setCred,
 * setZoomies).
 */
import { CATB } from "../config.mjs";
import { addNoise, roomName } from "./residents.mjs";
import { dropPrize } from "./prize.mjs";

const C = CATB.rules.cred;
const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const low = s => String(s ?? "").toLowerCase();
const LOG_CAP = 200;
const log = (s, ev) => { for (const e of ev) if (e?.text) (s.log ??= []).push({ round: s.round, type: e.type, text: e.text }); if (s.log.length > LOG_CAP) s.log.splice(0, s.log.length - LOG_CAP); };
const catOf = (s, id) => (s.cats ?? []).find(c => c.id === id) ?? null;

/** The house's Cred line (Ch 9; the catalog's `cred`), and tonight's tags and stash. */
export function newCred(house) {
  const h = house?.cred ?? {};
  return { catnip: h.catnip ?? null, catnipName: h.catnipName ?? "the catnip stash", rivals: h.rivals ?? null,
    rivalTag: h.rivalTag ?? null, patch: Number.isInteger(h.patch) ? h.patch : null, tags: [], nipBy: null };
}

/** The Cred state, for a robbery started before Cred was built too. */
export const credOf = s => s?.cred ?? { catnip: null, catnipName: "the catnip stash", rivals: null, rivalTag: null, patch: null, tags: [], nipBy: null };
/** "The Bin Lid Boys" — the rivals with a capital, for the start of a sentence. */
export const rivalsName = s => { const r = credOf(s).rivals ?? "the rival gang"; return r[0].toUpperCase() + r.slice(1); };
/** Does this cat have the zoomies, and are they automated? */
export const zoomies = (c, ctx = {}) => !!c?.nip && ctx.cred !== false;

/**
 * Score Cred for a cat (doubled on the zoomies). MUTATES s. With ctx.cred false
 * nothing is added: a note says the Storyteller scores it. Returns the points.
 */
export function addCred(s, c, n, why, ev, ctx = {}) {
  if (!c || !n) return 0;
  if (ctx.cred === false) {
    ev.push({ type: "credManual", cat: c.id, text: `(Cred is kept by hand: ${c.name} has ${n} Cred coming for ${why}${c.nip ? ", doubled for the zoomies" : ""}.)` });
    return 0;
  }
  const pts = n * (c.nip ? C.nipTimes : 1);
  c.cred = (c.cred ?? 0) + pts;
  ev.push({ type: "cred", cat: c.id, points: pts, why, text: `${c.name} +${pts} Cred for ${why}${c.nip ? " (doubled: the zoomies)" : ""}. ${c.name} has ${c.cred} tonight.` });
  return pts;
}

/* ------------------------------------------------------------ tagging -- */

/** Has the gang tagged this room yet? (one tag a room for the whole gang) */
export const tagged = (s, room) => (credOf(s).tags ?? []).includes(room);
/** Is this the room the rivals tagged? */
export const rivalsRoom = (s, room) => !!room && credOf(s).rivalTag === room;
/** What tagging this room is worth before the in-view bonus (1, or 2 over the rivals' tag). */
export const tagWorth = (s, room) => C.tag + (rivalsRoom(s, room) ? C.overRivals : 0);

/**
 * The tag goes on (Ch 9): the room is tagged for the whole gang; unseen it's a
 * mess for the next human in that room (no noise), in view it isn't (they saw
 * it: P14); the cat scores 1, +1 for doing it in view (a roll that worked), +1
 * over the rivals' tag. MUTATES s.
 */
export function tagRoom(s, c, { inView = false } = {}, ev, ctx = {}) {
  const room = c.where;
  const cr = (s.cred ??= credOf(s));
  (cr.tags ??= []).push(room);
  if (!inView && !(s.messes ??= []).includes(room)) s.messes.push(room);
  const over = rivalsRoom(s, room);
  const name = low(roomName(s, room));
  ev.push({ type: "tag", cat: c.id, room,
    text: `${c.name} leaves the gang's mark on the ${name}${inView ? " — right under their noses, and they couldn't stop it" : ""}${over ? `, slap over ${cr.rivals ?? "the rivals"}' tag. Take that!` : "."}${inView ? " (They saw it go on: no mess to find later.)" : " A tag is a mess: the next human in here finds it."}` });
  addCred(s, c, C.tag + (inView ? C.inView : 0) + (over ? C.overRivals : 0),
    `tagging the ${name}${inView ? " in view" : ""}${over ? ` over ${cr.rivals ?? "the rivals"}` : ""}`, ev, ctx);
}

/* --------------------------------------------------------- the catnip -- */

/** Is the catnip stash in this room, and still there for the taking? */
export const stashHere = (s, room) => { const cr = credOf(s); return !!room && cr.catnip === room && !cr.nipBy; };

/**
 * A cat gets into the catnip (Ch 9), as a give-in or on purpose: a carrier
 * drops the prize first, it rolls about yowling (a noise), scores 1 Cred and has
 * the zoomies until the house part ends; nobody else can have the stash. The
 * +1 Broom when a human sees a give-in is the caller's (round.mjs: the Mood).
 * MUTATES s.
 */
export function getNip(s, c, ev, ctx = {}) {
  const cr = (s.cred ??= credOf(s));
  const room = c.where;
  if (c.carrying) {
    ev.push({ type: "dropped", cat: c.id, text: `${c.name} drops the ${s.prize.name} — catnip first, loot later.` });
    dropPrize(s, { ev });
  }
  c.hidden = false; c.riding = null;
  cr.nipBy = c.id;
  addNoise(s, room, `${c.name} in the catnip`, c.id);
  ev.push({ type: "nip", cat: c.id, room,
    text: `${c.name} dives into ${cr.catnipName} and rolls about in it, yowling: noise! ${c.name} has the zoomies until the house part ends — +1 die on every roll, every roll a noise, no resisting a temptation, and Cred counts double.` });
  // the nip itself scores 1 (the book's table); the zoomies double what comes after (question X)
  c.nip = false;
  addCred(s, c, C.nip, "getting into the catnip", ev, ctx);
  c.nip = true;
}

/** "By the back fence it has worn off" (Ch 9): the zoomies end with the house part. MUTATES s. */
export function wearOff(s, ev) {
  const had = (s.cats ?? []).filter(c => c.nip);
  for (const c of s.cats ?? []) c.nip = false;
  if (had.length) ev.push({ type: "zoomiesOff", cats: had.map(c => c.id), text: `By the back fence ${had.map(c => c.name).join(" and ")}'s zoomies have worn off.` });
}

/* -------------------------------------------------- the end of the night -- */

/**
 * Tonight's Cred (Ch 9 "The Cat's Whiskers"): every cat's points, the gang's
 * total, the cats with the most (ties share; nobody with none), and whether the
 * night is worth 1 Rep in a campaign (5 or more Cred, and not Busted).
 */
export function credSummary(s, result = null) {
  const cats = (s.cats ?? []).map(c => ({ id: c.id, name: c.name, cred: c.cred ?? 0 }));
  const total = cats.reduce((a, c) => a + c.cred, 0);
  const top = Math.max(0, ...cats.map(c => c.cred));
  const whiskers = top > 0 ? cats.filter(c => c.cred === top).map(c => c.id) : [];
  return { cats, total, top, whiskers, rep: total >= C.repNight && result !== "busted", tags: (credOf(s).tags ?? []).length, nipBy: credOf(s).nipBy };
}

/** The Cat's Whiskers in words. */
export function whiskersText(sum) {
  if (!sum?.whiskers?.length) return "Nobody scored any Cred tonight: no Cat's Whiskers. Shocking.";
  const names = sum.cats.filter(c => sum.whiskers.includes(c.id)).map(c => c.name);
  return names.length > 1
    ? `${names.join(" and ")} tie on ${sum.top} Cred: they share the Cat's Whiskers (and argue about it all the way home).`
    : `${names[0]} is the Cat's Whiskers with ${sum.top} Cred: bragging rights, the warm spot on the boiler, and the last word on which house is next.`;
}

/* ------------------------------------------------------- the Storyteller -- */

/** A cat's Cred tonight, by hand (the tracker's − / +). */
export function setCred(state, catId, n) {
  const s = clone(state);
  const c = catOf(s, catId);
  if (!c) throw new Error("That cat isn't in this robbery.");
  c.cred = Math.max(0, Math.trunc(Number(n) || 0));
  const ev = [{ type: "credSet", cat: c.id, text: `The Storyteller puts ${c.name} on ${c.cred} Cred.` }];
  log(s, ev);
  return { state: s, events: ev };
}

/** The zoomies on or off, by hand (the cat sheet's or the tracker's Zoomies). */
export function setZoomies(state, catId, on) {
  const s = clone(state);
  const c = catOf(s, catId);
  if (!c) throw new Error("That cat isn't in this robbery.");
  c.nip = !!on;
  const ev = [{ type: "zoomiesSet", cat: c.id, text: on ? `The Storyteller says ${c.name} has the zoomies.` : `The Storyteller says ${c.name}'s zoomies are over.` }];
  log(s, ev);
  return { state: s, events: ev };
}
