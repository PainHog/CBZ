/**
 * NINE LIVES GANG — what the Robbery Tracker shows (AUTOMATION.md §6).
 * Foundry-free: robbery state + who is looking → a plain view object the
 * tracker's Handlebars templates render (precomputed, so the templates need no
 * helpers beyond if/each). The GM sees routines and every control; a player
 * sees the house and the buttons for their own cats.
 */
import { CATB } from "../config.mjs";
import { moodNow, temptationOptions, roomTemptations, endCheck } from "../logic/round.mjs";
import { catOptions } from "../logic/actions.mjs";
import { watchers, isAsleep, isDistracted, roomName, hasTrait, humanByKey } from "../logic/residents.mjs";
import { optionsText } from "../logic/house-catalog.mjs";
import { OUTCOME_LABEL, carryCap } from "../logic/prize.mjs";
import { getawayView } from "../logic/getaway.mjs";
import { credOf, credSummary, tagged, rivalsRoom, rivalsName } from "../logic/cred.mjs";

const STATUS = { outside: "Outside", free: "In the house", held: "Held", shut: "Shut in the Den" };
const STAGE = { cats: "The cats' turn", house: "The house's turn", between: "Between rounds", getaway: "The getaway" };
const LABEL = { easy: "Easy", standard: "Standard", hard: "Hard" };
const low = s => String(s ?? "").toLowerCase();

function meter(value, patience, cls) {
  return { value, patience, boxes: Array.from({ length: Math.max(patience, 1) }, (_, i) => ({ cls: i < value ? `${cls} filled` : cls })) };
}

function catView(s, c, { canControl, isGM }) {
  const badges = [];
  const r = s.phase === "getaway" ? s.getaway?.cats?.[c.id] : null;
  if (r) {
    // Ch 9: the getaway
    if (r.carry) badges.push(`Carrying ${r.carry} piece${r.carry > 1 ? "s" : ""} of loot`);
    if (r.state === "home") badges.push("Home in the hideout");
    if (r.state === "pinched") badges.push(r.where === "house" ? "Pinched (still in the house)" : "Pinched (in the van)");
    if (r.state === "running") badges.push(s.getaway.cornered.includes(c.id) ? "Cornered: dodge!" : r.acted ? "Went this round" : "Still to go");
  }
  if (c.hidden && !r) badges.push(c.riding ? "Riding the vacuum (hidden)" : "Hidden");
  if (c.carrying && !r) badges.push(`Carrying the ${s.prize.name}`);
  if (c.status === "held" && !r) badges.push(`Held by ${humanByKey(s, c.heldBy)?.name ?? "a human"}`);
  if (c.status === "shut" && !r) badges.push("Shut in the Den");
  if (s.phase === "robbery" && s.stage === "cats" && s.round >= 1) { badges.push(c.moved ? "Moved" : "Move left"); badges.push(c.acted ? "Acted" : "Action left"); }
  if (s.temptation?.catId === c.id && !s.temptation.choice) badges.push("Tempted: answer first");
  // Ch 9 "Cred"
  if (c.nip) badges.push("Zoomies!");
  if (c.cred) badges.push(`Cred ${c.cred}`);
  const mine = canControl(c.id);
  const opts = mine || isGM ? catOptions(s, c.id) : null;
  const options = (opts?.options ?? []).filter(o => o.id !== "free" || mine).map(o => ({
    id: o.id, label: `${o.roll ? "Roll: " : ""}${o.label}`, roll: !!o.roll, disabled: !!o.disabled, reason: o.disabled ?? "",
    cls: o.roll ? "catb-opt catb-opt-roll" : "catb-opt"
  }));
  const usable = options.filter(o => !o.disabled);
  const blocked = options.filter(o => o.disabled);
  return {
    id: c.id, name: c.name, img: c.img, status: STATUS[c.status] ?? c.status, badges: badges.join(" · "), mine, isGM,
    usable, blocked, hasBlocked: blocked.length > 0, hasOptions: options.length > 0,
    blockedBy: opts?.blockedBy ? `${opts.blockedBy.name} is in the way: deal with it or leave.` : "",
    notes: (opts?.notes ?? []).join(" "),
    helpTargets: mine ? (opts?.helpTargets ?? []).map(t => ({ ...t, label: t.queued ? `Helping ${t.name} (cancel)` : `Help ${t.name}` })) : [],
    helping: s.help?.[c.id] ? `Will help ${s.cats.find(x => x.id === s.help[c.id])?.name ?? ""}` : "",
    places: isGM && !r ? [{ value: "outside", label: "Outside", selected: c.where === "outside" }, ...Object.entries(s.rooms).map(([k, rm]) => ({ value: k, label: rm.name, selected: c.where === k }))] : [],
    // the getaway by hand (GM): where the cat is on the route, and its loot
    spots: isGM && r ? [...s.getaway.route.map((o, i) => ({ value: String(i), label: i === 0 ? "The garden" : `Past ${s.getaway.route[i - 1].name}`, selected: r.state === "running" && r.pos === i })),
      { value: "home", label: "Home", selected: r.state === "home" }, { value: "pinched", label: "Pinched", selected: r.state === "pinched" }] : [],
    carries: isGM && r ? Array.from({ length: carryCap(c) + 1 }, (_, n) => ({ value: String(n), label: `${n} piece${n === 1 ? "" : "s"}`, selected: r.carry === n })) : [],
    onRoute: !!r,
    // Cred by hand (GM): − / + and the zoomies
    cred: c.cred ?? 0, nip: !!c.nip, zoomiesLabel: c.nip ? "Zoomies: off" : "Zoomies: on"
  };
}

/** Ch 9: the getaway as the tracker shows it. */
function getawaySection(s, { canControl, isGM }) {
  const v = getawayView(s);
  const g = s.getaway;
  const anyRunning = Object.values(g.cats).some(r => r.state === "running");
  return {
    round: v.round, cornered: v.stage === "cornered", wardenText: v.wardenText,
    lootText: `Loot: ${v.loot.start} piece${v.loot.start === 1 ? "" : "s"} of the ${s.prize.name} carried out${v.loot.safe ? `, ${v.loot.safe} eaten in the house (safe)` : ""} — ${v.loot.total} in all.`,
    spaces: v.spaces.map(sp => ({
      name: sp.name, next: sp.next, hideout: sp.next === null, warden: sp.warden, loot: sp.loot,
      obstacle: sp.next ? `Next: ${sp.next} — ${optionsText(sp.opts)}${sp.pet ? `; it takes ${sp.pet} ${sp.pet > 1 ? "dice" : "die"} off` : ""}` : "",
      rivals: sp.rivals ? `${sp.rivals[0].toUpperCase()}${sp.rivals.slice(1)} hang about here: dropped loot is nicked at once; lead the gang past them on a Clean or a Purrfect for 1 Cred.` : "",
      cats: sp.cats.map(x => catView(s, s.cats.find(c => c.id === x.id), { canControl, isGM }))
    })),
    pinched: v.pinched.map(x => catView(s, s.cats.find(c => c.id === x.id), { canControl, isGM })),
    wardenSpots: isGM ? [{ value: "none", label: "On the way", selected: g.warden === null }, ...g.route.map((o, i) => ({ value: String(i), label: o.name, selected: g.warden === i }))] : [],
    canEndRound: isGM && v.stage === "run" && anyRunning, canFinish: isGM && !anyRunning
  };
}

function humanView(s, h, isGM) {
  const badges = [];
  if (isAsleep(s, h)) badges.push("Asleep");
  if (isDistracted(s, h)) badges.push("Distracted");
  if (h.holding) badges.push(`Holding ${s.cats.find(c => c.id === h.holding)?.name ?? "a cat"}`);
  if (h.searching) badges.push("Searching");
  if (h.staysRound === s.round) badges.push("Stays with the prize: answers no noise this round");
  if (h.shooRound === s.round && h.staysRound !== s.round) badges.push("Stays by the entrance they shooed a cat out of: answers no noise this round");
  if (s.pendingTrigger?.human === h.key) badges.push(`About to ${s.pendingTrigger.side === "broom" ? "chase a cat out" : "pick a cat up"}: the Storyteller's pick`);
  for (const t of h.traits ?? []) badges.push({ kid: "Kid", dozes: "Dozes", busy: "Busy", headphones: "Headphones" }[t] ?? t);
  return {
    key: h.key, name: h.name, attention: h.attention, badges: badges.join(" · "),
    routine: isGM ? h.routine.map((r, i) => `${i + 1}: ${r === "stay" ? "stay" : roomName(s, r)}`).join(", ") : "",
    places: isGM ? Object.entries(s.rooms).map(([k, r]) => ({ value: k, label: r.name, selected: h.room === k })) : []
  };
}

function petView(s, p, isGM) {
  const bits = [CATB.petKinds[p.kind] ?? p.kind];
  if (p.rating) bits.push(`rating ${p.rating}`);
  if (p.soft) bits.push("soft");
  let mode = CATB.petModes[p.mode] ?? p.mode;
  if (p.mode === "hiding") mode = `${mode} (back at the end of round ${p.until})`;
  // v0.8: a parrot that saw an unhidden cat (v0.9: or a held one) at any time this round squawks in the Pets step
  if (p.kind === "parrot" && p.mode !== "covered" && p.sawRound === s.round && s.stage !== "between") mode = `${mode} · saw a cat this round: squawks in the Pets step`;
  return {
    key: p.key, name: p.name, info: bits.join(", "), mode,
    routine: isGM && p.routine ? p.routine.map((r, i) => `${i + 1}: ${r === "stay" ? "stay" : r === "sniff" ? "sniff" : roomName(s, r)}`).join(", ") : "",
    places: isGM ? Object.entries(s.rooms).map(([k, r]) => ({ value: k, label: r.name, selected: p.room === k })) : []
  };
}

function prizeText(s) {
  const z = s.prize;
  if (z.out) return `The ${z.name} is outside: got!`;
  if (z.gone) return `The ${z.name} is gone.`;
  if (z.withHuman) return `In ${humanByKey(s, z.withHuman)?.name ?? "the human"}'s arms`;
  const bits = [];
  if (z.carriers.length) bits.push(`carried by ${z.carriers.map(id => s.cats.find(c => c.id === id)?.name).join(" and ")}`);
  else if (!z.down) bits.push(`step ${z.spotSteps.length - z.stepsLeft + 1} of ${z.spotSteps.length}: ${optionsText(z.spotSteps[z.spotSteps.length - z.stepsLeft])}`);
  else bits.push("there for the taking");
  if (z.kind === "delicious") bits.push(`${z.portionsLeft} of ${z.portions} portions left`);
  if (z.spotRoom && z.room !== z.spotRoom) bits.push(`not where the Clock put it (the ${low(roomName(s, z.spotRoom))})`);
  return `The ${z.name} (${z.size}): ${bits.join("; ")}`;
}

/** Ch 9 "Cred": tonight's points, and who is the Cat's Whiskers so far (or at the end). */
function credText(s) {
  const sum = s.outcome?.cred ?? credSummary(s, s.outcome?.result ?? null);
  const top = sum.cats.filter(c => sum.whiskers.includes(c.id)).map(c => c.name);
  return `Cred tonight: ${sum.cats.map(c => `${c.name} ${c.cred}`).join(" · ")} (${sum.total} for the gang)${top.length ? ` — the Cat's Whiskers${s.phase === "ended" ? "" : " so far"}: ${top.join(" and ")}` : ""}.`;
}

/**
 * @param {object|null} state the robbery
 * @param {{ isGM: boolean, canControl: (catId) => boolean, houses?: object[] }} viewer
 */
export function trackerView(state, { isGM = false, canControl = () => false, houses = [] } = {}) {
  const base = { isGM, houses: houses.map(h => ({ key: h.key, name: h.name, label: LABEL[h.label] ?? h.label })) };
  if (!state) return { ...base, hasRobbery: false };
  const s = state;
  const f = moodNow(s);
  const running = s.phase === "robbery";
  const inGetaway = s.phase === "getaway" && !!s.getaway;
  const z = s.prize;
  const left = s.clock.goneAt - s.round;
  const clockText = z.out ? "Got it!" : z.gone ? `Gone (round ${s.clock.goneAt})` : left > 0 ? `Gone at the start of round ${s.clock.goneAt} (${left} round${left > 1 ? "s" : ""} to go)` : `Due to go — the gang is holding it`;
  const floors = (s.map?.floors?.length ? s.map.floors : [{ name: "", rooms: Object.fromEntries(Object.keys(s.rooms).map(k => [k, null])) }]).map(fl => ({
    name: fl.name,
    rooms: Object.keys(fl.rooms).filter(k => s.rooms[k]).map(key => {
      const r = s.rooms[key];
      const tempt = roomTemptations(s, key).map(i => CATB.instincts[i]?.label ?? i).join(", ");
      // Ch 9 "Cred": the gang's tag, the rivals' tag, the catnip stash
      const cr = credOf(s);
      const credNotes = [
        tagged(s, key) ? "Tagged by the gang" : "",
        rivalsRoom(s, key) ? `${rivalsName(s)}' tag${tagged(s, key) ? " (tagged over!)" : ": tag over it for +1 Cred"}` : "",
        cr.catnip === key ? (cr.nipBy ? `The catnip stash: ${s.cats.find(c => c.id === cr.nipBy)?.name ?? "a cat"} has had it` : `The catnip stash: ${cr.catnipName} (tempts every cat in here)`) : ""
      ].filter(Boolean).join(" · ");
      const cats = s.cats.filter(c => c.where === key).map(c => catView(s, c, { canControl, isGM }));
      return {
        key, name: r.name, tempt, credNotes, isDen: key === s.den, noHide: r.hide === false,
        watched: watchers(s, key).length > 0, noise: (s.noise ?? []).some(n => n.room === key), mess: (s.messes ?? []).includes(key),
        prize: z.room === key && !z.out && !z.gone ? prizeText(s) : "",
        spot: z.spotRoom === key && z.room !== key && !z.out && !z.gone,
        humans: s.humans.filter(h => h.room === key).map(h => humanView(s, h, isGM)),
        pets: s.pets.filter(p => p.room === key && p.mode !== "hiding").map(p => petView(s, p, isGM)),
        cats, hasCats: cats.length > 0,
        entrances: s.entrances.filter(e => e.room === key).map(e => ({ key: e.key, name: e.name, open: e.open,
          text: `${e.name}: ${e.size}${e.climb ? ", a climb (Small things only)" : ""}${e.opts.length ? `, ${optionsText(e.opts)}` : ", no roll"}${e.rounds ? `, round ${e.rounds.join(" or ")} only, one cat a round` : ""}${e.noisy ? ", noisy" : ""}${e.one && e.usedRound === s.round ? " — tried this round" : ""}${e.open ? "" : " — SHUT"}` }))
      };
    })
  }));
  const temptOpts = isGM && running ? temptationOptions(s) : [];
  const t = s.temptation;
  const end = running ? endCheck(s) : { due: false };
  return {
    ...base, hasRobbery: true, running, ended: s.phase === "ended", inGetaway, inHouse: !inGetaway,
    getaway: inGetaway ? getawaySection(s, { canControl, isGM }) : null,
    title: s.name, label: LABEL[s.label] ?? s.label, gangSize: s.gangSize,
    round: s.round, stage: STAGE[s.stage] ?? s.stage, inCats: running && s.stage === "cats", between: running && s.stage !== "cats",
    clockText, lightsText: `Lights Out at the end of round ${s.clock.lightsOut}`,
    rounds: Array.from({ length: s.clock.lightsOut }, (_, i) => ({ n: i + 1, cls: [i + 1 === s.round ? "now" : "", i + 1 === s.clock.goneAt ? "gone" : "", i + 1 === s.clock.lightsOut ? "lights" : "", z.script.some(x => x.round === i + 1) ? "clock" : ""].filter(Boolean).join(" ") })),
    broom: meter(f.broom, f.patience, "broom"), cuddle: meter(f.cuddle, f.patience, "cuddle"), patience: f.patience,
    broomFull: f.full.broom, cuddleFull: f.full.cuddle,
    pending: isGM ? s.moodLedger.filter(e => e.pending && !e.rejected).map(e => ({ id: e.id, cause: e.cause ?? e.kind })) : [],
    pick: s.pendingTrigger ? {
      text: `${s.pendingTrigger.side === "broom" ? "Broom" : "Cuddle"} is full: the Storyteller picks which cat ${humanByKey(s, s.pendingTrigger.human)?.name ?? "the human"} ${s.pendingTrigger.side === "broom" ? "chases out" : "picks up"}.`,
      cats: isGM ? s.pendingTrigger.candidates.map(id => ({ id, name: s.cats.find(c => c.id === id)?.name ?? id })) : []
    } : null,
    temptation: t ? `${s.cats.find(c => c.id === t.catId)?.name} was tempted (${t.label ?? CATB.instincts[t.instinct]?.label ?? t.instinct})${t.choice ? (t.choice === "gaveIn" ? ": gave in." : ": resisted.") : ": waiting for an answer."}` : "",
    credText: credText(s),
    temptOpts: temptOpts.map(o => ({ ...o, text: `Tempt ${o.catName}: ${o.label} (${o.roomName})` })), canTempt: temptOpts.length > 0,
    endDue: end.due ? end.text : "",
    outcome: s.outcome ? `${OUTCOME_LABEL[s.outcome.result]}${s.outcome.lootTotal ? ` — loot home: ${s.outcome.loot} of ${s.outcome.lootTotal}` : ""}${s.outcome.leftBehind.length ? ` — pinched: ${s.outcome.leftBehind.map(id => s.cats.find(c => c.id === id)?.name).join(", ")}` : ""}` : "",
    prize: prizeText(s),
    outside: s.cats.filter(c => c.where === "outside").map(c => catView(s, c, { canControl, isGM })),
    floors,
    ways: s.ways.map(w => ({ id: w.id, open: w.open, text: `${roomName(s, w.a)} — ${roomName(s, w.b)} (${w.size}${w.opts ? `; door: ${optionsText(w.opts)}` : ""})${w.open ? "" : " — SHUT"}`, door: !!w.opts })),
    entrances: s.entrances.map(e => ({ key: e.key, open: e.open, text: `${e.name} → ${roomName(s, e.room)}${e.open ? "" : " — SHUT"}` })),
    rooms: Object.entries(s.rooms).map(([k, r]) => ({ value: k, label: r.name })),
    log: [...s.log].slice(-16).reverse().map(l => ({ text: l.text, round: l.round }))
  };
}
