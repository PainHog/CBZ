/**
 * Integration smoke test on the fake Foundry (tools/fake-foundry.mjs): a GM and
 * two players run a whole robbery at The Chicken at Number 12 through the real
 * system — the start dialog's API, the Robbery Tracker's buttons, roll dialogs,
 * roll cards (help, Push, Seen/Not seen, Accept), the temptation prompt and
 * card, the Storyteller's meters, a seen roll that fills Broom (Shoo!), house
 * turns with noise and routines, the Prize Clock, hauling the chicken out and
 * the outcome card — and a second robbery where the GM is offline when a roll
 * is made and reconciles it on coming back (AUTOMATION.md §9).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  installFoundry, asUser, settle, diceQueue, dialogResponders, fakeForm, renderMessage, clickButton, buttonLabels, log
} from "../tools/fake-foundry.mjs";

const { game, CONFIG } = installFoundry({ users: [
  { id: "gmUser0000000000", name: "Storyteller", isGM: true },
  { id: "playerOne0000000", name: "Lena" },
  { id: "playerTwo0000000", name: "Sam" }
] });
await import("../module/cat-burglars.mjs");
Hooks.callAll("init");
Hooks.callAll("ready");
await settle();

const [gmU, p1, p2] = game.users;
const api = () => game.catBurglars;
const state = () => api().state();
const catOf = id => state().cats.find(c => c.id === id);
const pell = () => state().humans.find(h => h.key === "pell");
const meters = () => { const f = api().logic.moodNow(state()); return [f.broom, f.cuddle, f.patience]; };
const cardMsgs = kind => game.messages.filter(m => m.flags?.["cat-burglars"]?.card?.kind === kind);
const lastCard = kind => cardMsgs(kind).at(-1);
const flags = m => m.flags["cat-burglars"].card;

async function makeCat(name, owner, system) {
  return asUser(gmU, () => Actor.create({ name, type: "cat", ownership: { default: 0, [owner.id]: 3 }, system }));
}

/** A player rolls for an option: the dialog is answered with `form`, the dice are `faces`. */
async function rollAs(user, actor, optionId, form, faces) {
  diceQueue.push(...faces);
  dialogResponders.push(opts => opts.buttons.find(b => b.action === "roll").callback({}, { form: fakeForm(form) }));
  const msg = await asUser(user, () => api().dice.rollFor(actor, { optionId }));
  await settle();
  assert.equal(diceQueue.length, 0, `${actor.name} ${optionId}: rolled exactly ${faces.length} dice`);
  return msg;
}
async function click(msg, user, label) {
  clickButton(renderMessage(msg, user), label, user);
  await settle();
}
async function trackerAction(user, name, dataset) {
  const app = asUser(user, () => api().openTracker());
  await settle();
  await asUser(user, () => app.runAction(name, dataset));
  await settle();
}
async function houseTurn(faces) {
  diceQueue.push(...faces);
  await asUser(gmU, () => api().robbery.endRound());
  await settle();
  diceQueue.length = 0;
}

test("a GM and two players rob Number 12 (core rules v0.9) from start to Clean Getaway", async () => {
  const tilly = await makeCat("Two-Bin Tilly", p1, { approaches: { streetwise: 3, sneaky: 2, sweet: 1, savage: 1 }, instinct1: "curious", instinct2: "climber", body: "lean" });
  const velvet = await makeCat("Velvet", p1, { approaches: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instinct1: "lapCat", instinct2: "knocker", body: "lean" });
  const biscuit = await makeCat("Big Biscuit", p2, { approaches: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instinct1: "scrapper", instinct2: "foodie", body: "chonky", cattitude: 4 });
  const mags = await makeCat("Marmalade Mags", p2, { approaches: { sneaky: 3, savage: 2, streetwise: 1, sweet: 1 }, instinct1: "boxSitter", instinct2: "hunter", body: "lean" });
  assert.equal(velvet.system.lives, 9, "the data model fills in its defaults");

  // ---- Start: the Storyteller picks the house and the gang
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [tilly.id, velvet.id, biscuit.id, mags.id] }));
  await settle();
  assert.equal(state().name, "The Chicken at Number 12");
  assert.equal(biscuit.system.cattitude, 2, "every cat starts the robbery with 2 Cattitude");
  assert.ok(lastCard("robbery"));
  assert.deepEqual(buttonLabels(lastCard("robbery"), p1), ["Open the Robbery Tracker"]);
  await assert.rejects(() => asUser(p1, () => api().robbery.beginRound()), /Only the active Storyteller/);

  // ---- Round 1: three ways in
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  assert.equal(state().round, 1);
  let m = await rollAs(p1, velvet, "enter:front", { approach: "sweet" }, [6, 2, 3]); // Sweet 3 + Lap Cat − Attention 1
  assert.equal(flags(m).status, "pending");
  assert.deepEqual(buttonLabels(m, p1), ["Push (1 Cattitude)", "Push (+1 Mood)", "Accept"]);
  assert.deepEqual(buttonLabels(m, p2), [], "another player sees no buttons");
  assert.deepEqual(buttonLabels(m, gmU), ["Accept", "Not seen"]);
  await click(m, p1, "Accept");
  assert.equal(flags(m).applied, true);
  assert.equal(catOf(velvet.id).where, "hall");
  assert.deepEqual(meters(), [0, 1, 4], "seen by Mr Pell: Cuddle 1");

  await trackerAction(p2, "act", { cat: mags.id, option: "enter:flap" });
  assert.equal(catOf(mags.id).where, "utility");
  const warned = log.warnings.length;
  await trackerAction(p1, "help", { cat: tilly.id, target: biscuit.id });
  assert.equal(state().help[tilly.id], undefined, "v0.9: cats outside can't help one coming in");
  assert.ok(log.warnings.slice(warned).some(w => /outside isn't a room/.test(w)));

  m = await rollAs(p2, biscuit, "enter:window", { approach: "savage" }, [3, 2]); // 3 − Tricky
  assert.equal(flags(m).result, "flop");
  diceQueue.push(6, 4);
  await click(m, p2, "Push (1 Cattitude)");
  assert.equal(flags(m).result, "clean");
  assert.equal(flags(m).pushed, true);
  assert.equal(biscuit.system.cattitude, 1, "the roller pays for the Push");
  assert.equal(flags(m).applied, true, "a Push makes the roll final");
  assert.equal(catOf(biscuit.id).where, "kitchen");
  m = await rollAs(p1, tilly, "enter:window", { approach: "sneaky" }, [6, 4]); // Sneaky 2 + Climber − Tricky
  await click(m, p1, "Accept");
  assert.equal(catOf(tilly.id).where, "kitchen", "Tilly climbs in after him");
  assert.equal(catOf(tilly.id).acted, true);

  await houseTurn([1, 1, 1, 1, 1, 1, 1]); // Pudding barks; Mr Pell answers the cat flap's clack first
  assert.equal(pell().room, "utility");
  assert.ok(log.dialogs.some(d => d.kind === "confirm" && d.title === "End the round"), "the Storyteller was asked first");
  assert.match(lastCard("houseTurn").content, /Pudding barks/);

  // ---- Round 2: the Prize Clock, a temptation, the Storyteller's meters, Shoo!
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  assert.equal(state().prize.room, "kitchen");
  assert.equal(pell().room, "kitchen", "the Prize Clock: Mr Pell puts the chicken down and stays");
  const prompt = lastCard("temptPrompt");
  assert.deepEqual(prompt.whisper, [gmU.id], "the temptation prompt is whispered to the Storyteller");
  assert.ok(buttonLabels(prompt, gmU).includes("Tempt Marmalade Mags: Hunter"));
  await click(prompt, gmU, "Tempt Marmalade Mags: Hunter");
  const tc = lastCard("temptation");
  assert.deepEqual(buttonLabels(tc, p2), ["Give in (+1 Cattitude)", "Resist (1 Cattitude)"]);
  assert.deepEqual(buttonLabels(tc, p1), []);
  await click(tc, p2, "Resist (1 Cattitude)");
  assert.equal(mags.system.cattitude, 1);
  assert.equal(flags(tc).answered, "resisted");

  for (let i = 0; i < 3; i++) await trackerAction(gmU, "mood", { side: "broom", steps: "1" });
  assert.deepEqual(meters(), [3, 1, 4]);

  await trackerAction(p1, "act", { cat: velvet.id, option: "move:kitchen" });
  m = await rollAs(p1, velvet, "confront:pudding", { approach: "sweet" }, [5, 4]); // 3 − Pudding 2 − Attention 1: keep the lower of two
  assert.equal(flags(m).plan.zero, true);
  await click(m, p1, "Accept");
  assert.equal(state().pets[0].mode, "friendly", "Pudding is befriended for the whole gang");
  assert.deepEqual(meters(), [3, 2, 4]);

  m = await rollAs(p2, biscuit, "free", { approach: "savage" }, [5, 2, 1]); // a free roll in view: Savage 3, a Scrape
  await click(m, p2, "Accept");
  assert.equal(catOf(biscuit.id).status, "outside", "Broom filled: Shoo!");
  assert.equal(state().entrances.find(e => e.key === "window").open, false, "out through the kitchen window (the nearest that works this round), which is shut");
  assert.equal(pell().room, "kitchen", "…and Mr Pell stays in that room");
  assert.deepEqual(meters(), [0, 2, 3], "Broom empties; Patience drops to 3");
  assert.match(lastCard("mood").content, /Shoo! Mr Pell grabs the broom and chases Big Biscuit out through the Open kitchen window \(up the bins\), shuts it and stays in the kitchen/);

  m = await rollAs(p1, tilly, "hide", { approach: "sneaky" }, [6]); // Sneaky 2 − Attention 1
  await click(m, gmU, "Not seen");
  assert.equal(flags(m).seen, false);
  await click(m, gmU, "Seen");
  assert.deepEqual(flags(m).seenBy, ["pell"]);
  await click(m, p1, "Accept");
  assert.equal(catOf(tilly.id).hidden, true);
  assert.deepEqual(meters(), [0, 2, 3], "a Sneaky Clean: he never noticed");

  m = await rollAs(p2, mags, "open:kitchen~utility", { approach: "streetwise" }, [5, 4]);
  await click(m, p2, "Accept");
  assert.equal(state().ways.find(w => w.id === "kitchen~utility").open, true);
  await houseTurn([1, 1, 1, 1, 1, 1, 1]); // the utility room's noise doesn't draw Mr Pell: he has just put the chicken down
  assert.equal(pell().room, "kitchen", "v0.8: the Prize Clock's hold beats noise");
  assert.match(lastCard("houseTurn").content, /Prize Clock(&#x27;|')s hold/);
  assert.equal(pell().searching, false, "nobody touched the chicken in the put-down round");

  // ---- Round 3: Biscuit comes back in, Velvet keeps Mr Pell busy, the steps get done; the flap's clack lures him
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  await trackerAction(p2, "act", { cat: biscuit.id, option: "enter:flap" });
  assert.equal(catOf(biscuit.id).where, "utility");
  m = await rollAs(p1, velvet, "distract:pell", { approach: "sweet" }, [6, 6, 1]); // Sweet 3 + Lap Cat − Attention 1
  await click(m, p1, "Accept");
  assert.equal(flags(m).result, "purrfect");
  assert.equal(velvet.system.cattitude, 3, "a Purrfect: +1 Cattitude, and no Mood step");
  assert.deepEqual(meters(), [0, 2, 3]);
  m = await rollAs(p1, tilly, "step", { approach: "sneaky" }, [6, 4]); // Sneaky 2 + Climber − Tricky; Mr Pell is Distracted
  await click(m, p1, "Accept");
  assert.equal(state().prize.stepsLeft, 1, "the step stays done");
  await trackerAction(p2, "act", { cat: mags.id, option: "move:kitchen" });
  m = await rollAs(p2, mags, "step", { approach: "savage" }, [5]); // Savage 2 − Tricky
  await click(m, p2, "Accept");
  assert.equal(state().prize.down, true);
  await houseTurn([1, 1, 1, 1, 1, 1, 1]); // the flap's clack was the first noise: Mr Pell goes to the utility room
  assert.equal(pell().room, "utility");
  assert.equal(pell().searching, false, "he wasn't beside the chicken at the end of the house's turn");

  // ---- Round 4: Tilly and Velvet pick the chicken up; Biscuit slips out past Mr Pell
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  await trackerAction(p1, "help", { cat: velvet.id, target: tilly.id });
  await trackerAction(p1, "act", { cat: tilly.id, option: "take" });
  assert.deepEqual(state().prize.carriers.sort(), [tilly.id, velvet.id].sort(), "two Lean cats carry a Medium prize");
  await trackerAction(p2, "act", { cat: biscuit.id, option: "exit:flap" });
  assert.equal(catOf(biscuit.id).status, "outside");
  await houseTurn([1, 5, 1, 1, 1, 1, 1]); // Pudding (befriended, but still wandering: v0.9) stays; Mr Pell wanders to the living room
  assert.equal(pell().room, "living");

  // ---- Round 5: hauling the chicken — Mags helps, but only the carriers move with it
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  m = await rollAs(p1, velvet, "move:utility", { approach: "sneaky", [`help-${mags.id}`]: true }, [6, 4, 2, 1, 1]); // Sneaky 2 + Knocker + Tilly + Mags
  assert.deepEqual(flags(m).helpers, [tilly.id, mags.id], "the other carrier is locked in; Mags ticked to help");
  await click(m, p1, "Accept");
  assert.equal(state().prize.room, "utility");
  assert.equal(catOf(mags.id).where, "kitchen", "a helper isn't a carrier: Mags stays behind");
  assert.equal(catOf(mags.id).acted, true);
  await trackerAction(p2, "act", { cat: mags.id, option: "move:utility" });
  await houseTurn([1, 1, 1, 1, 1, 1, 1]); // Mr Pell stays in the living room

  // ---- Round 6: out through the cat flap
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  m = await rollAs(p1, tilly, "exit:flap", { approach: "sneaky" }, [6, 2, 2]); // hauling it out: a roll, seen or not
  await click(m, p1, "Accept");
  assert.equal(state().prize.out, true);
  await trackerAction(p2, "act", { cat: mags.id, option: "exit:flap" });
  await houseTurn([1, 1, 1, 1, 1, 1, 1]);

  // ---- The getaway (Ch 9): the chicken in 5 pieces — Biscuit 2, the others 1 each; Biscuit was Shooed, so the van comes at once
  assert.equal(state().phase, "getaway");
  assert.match(lastCard("getaway").content, /Leg it!/);
  assert.match(lastCard("getaway").content, /Big Biscuit 2 pieces/);
  assert.match(lastCard("getaway").content, /the van pulls up at the end of round 1/);
  const over = async (user, actor, approach, faces, helpers = []) => {
    const msg = await rollAs(user, actor, "over", { approach, ...Object.fromEntries(helpers.map(h => [`help-${h.id}`, true])) }, faces);
    assert.ok(!buttonLabels(msg, user).includes("Push (+1 Mood)"), "out here a Push costs Cattitude only");
    await click(msg, user, "Accept");
    return msg;
  };
  const pos = c => state().getaway?.cats[c.id];
  m = await over(p1, tilly, "sneaky", [6, 4, 2, 1], [velvet, mags]); // Sneaky 2 + Climber + 2 helpers − 1 for her piece of chicken
  assert.equal(flags(m).plan.total, 4);
  assert.match(flags(m).moodText ?? m.content, /no meters/);
  assert.deepEqual([tilly, velvet, mags].map(c => pos(c).pos), [1, 1, 1], "over the back fence together");
  m = await over(p2, biscuit, "savage", [5, 1]); // Savage 3 − 1: two pieces is a load even for a Chonky cat
  assert.equal(pos(biscuit).pos, 1);
  await trackerAction(gmU, "endGetawayRound");
  assert.match(lastCard("getaway").content, /the warden jumps out into the garden/);
  assert.equal(state().getaway.warden, 0);
  for (const [faces, bFaces] of [[[6, 1, 1], [6, 2]], [[6, 2, 2], [6]], [[6, 1, 1, 1], [4, 1]]]) { // the allotments, the alley wall, Station Road
    await over(p1, tilly, tilly.system.approaches.streetwise && state().getaway.cats[tilly.id].pos === 3 ? "streetwise" : "sneaky", faces, [velvet, mags]);
    await over(p2, biscuit, "savage", bFaces);
    if (state().phase === "getaway") await trackerAction(gmU, "endGetawayRound");
  }
  assert.equal(state().phase, "ended");
  assert.ok([tilly, velvet, mags, biscuit].every(c => pos(c).state === "home"));
  const out = lastCard("outcome");
  assert.match(out.content, /Clean Getaway/);
  assert.match(out.content, /Loot home: 5 of 5/);
  assert.deepEqual(buttonLabels(out, gmU), ["Give the gang +1 Rep (campaign: a Clean Getaway)"]);
  await click(out, gmU, "Give the gang +1 Rep (campaign: a Clean Getaway)");
  assert.equal(tilly.system.rep, 1);
  assert.equal(flags(out).repGiven, true);

  // ---- the sheets and the tracker render for everyone
  const { CatSheet } = await import("../module/sheets/actor-sheets.mjs");
  const sheet = new CatSheet({ document: tilly });
  await asUser(p1, () => sheet.render(true));
  assert.ok(sheet.element.buttons().some(b => b.textContent === "Roll Streetwise"));
  const app = asUser(p2, () => api().openTracker());
  await settle();
  assert.match(app.element.innerHTML, /The Chicken at Number 12/);
  assert.deepEqual(log.errors, []);
});

test("a roll made while the Storyteller is offline is applied when they come back", async () => {
  const pip = await makeCat("Pip", p1, { approaches: { sweet: 3, savage: 2, sneaky: 1, streetwise: 1 }, instinct1: "hunter", instinct2: "curious", body: "lean" });
  await asUser(gmU, () => api().robbery.startRobbery("wendell-mouse", { actorIds: [pip.id] }));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  assert.equal(state().cattitudeStart, 3, "a gang this small counts as three: 3 Cattitude each");
  gmU.active = false;
  const before = log.warnings.length;
  const m = await rollAs(p1, pip, "enter:flap", { approach: "streetwise" }, [6]);
  await click(m, p1, "Accept");
  assert.equal(flags(m).status, "final");
  assert.equal(flags(m).applied, false, "nobody to apply it");
  await trackerAction(p1, "act", { cat: pip.id, option: "enter:cellarwin" });
  assert.ok(log.warnings.slice(before).some(w => /Storyteller isn't connected — nothing was changed/.test(w)), "a Move needs the Storyteller");
  assert.equal(catOf(pip.id).status, "outside");
  gmU.active = true;
  const n = await asUser(gmU, () => import("../module/robbery/automation.mjs").then(a => a.reconcile()));
  await settle();
  assert.equal(n, 1);
  assert.equal(flags(m).applied, true);
  assert.equal(catOf(pip.id).where, "kitchen", "the jammed flap let Pip in");
  assert.deepEqual(log.errors, []);
});

test("every automation can be switched off; Push with the Mood; giving in from the temptation card", async () => {
  const set = (k, v) => asUser(gmU, () => game.settings.set("cat-burglars", k, v));
  const dot = await makeCat("Lucky Dot", p1, { approaches: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instinct1: "lapCat", instinct2: "curious", body: "lean", cattitude: 0 });
  const joe = await makeCat("Gutter Joe", p2, { approaches: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instinct1: "scrapper", instinct2: "hunter", body: "chonky" });
  await set("autoMood", "confirm"); await set("autoCattitude", false); await set("autoHouseTurn", "manual"); await set("autoTemptation", "off");
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [dot.id, joe.id] }));
  assert.equal(dot.system.cattitude, 0, "autoCattitude off: nobody's sheet is touched");
  const prompts = cardMsgs("temptPrompt").length;
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  assert.equal(cardMsgs("temptPrompt").length, prompts, "autoTemptation off: no prompt");

  let m = await rollAs(p1, dot, "enter:front", { approach: "sweet" }, [6, 2, 3]);
  assert.ok(buttonLabels(m, p1).includes("Push (1 Cattitude)"), "with Cattitude off, the Push is advice only");
  diceQueue.push(6, 1);
  await click(m, p1, "Push (+1 Mood)");
  assert.equal(flags(m).result, "purrfect");
  assert.equal(flags(m).pushedWithMood, true);
  assert.equal(dot.system.cattitude, 0, "no Purrfect Cattitude either");
  assert.deepEqual(meters(), [0, 0, 5], "autoMood confirm: the change waits (two cats: Patience 4 + 1)");
  const pending = state().moodLedger.find(e => e.pending);
  assert.ok(pending);
  await trackerAction(gmU, "confirm", { entry: pending.id });
  assert.deepEqual(meters(), [0, 1, 5], "a Purrfect adds nothing, but a Push paid with the Mood adds 1");

  await set("autoEffects", false);
  m = await rollAs(p2, joe, "enter:window", { approach: "savage" }, [6, 1]);
  await click(m, p2, "Accept");
  assert.equal(catOf(joe.id).status, "outside", "effects off: the Storyteller moves him by hand");
  assert.equal(catOf(joe.id).acted, true);
  assert.ok(flags(m).appliedText.some(t => /Effects are off/.test(t)));
  await trackerAction(gmU, "place", { cat: joe.id, to: "kitchen" });
  assert.equal(catOf(joe.id).where, "kitchen");

  const dialogs = log.dialogs.length;
  await houseTurn([]);
  assert.equal(log.dialogs.length, dialogs, "manual: no question, no dice");
  assert.match(lastCard("houseTurn").content, /runs the house(&#x27;|')s turn by hand/);
  assert.equal(pell().room, "hall", "nobody moved");

  for (const [k, v] of [["autoMood", "auto"], ["autoCattitude", true], ["autoHouseTurn", "prompt"], ["autoTemptation", "prompt"], ["autoEffects", true]]) await set(k, v);
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  await trackerAction(gmU, "place", { cat: dot.id, to: "living" });
  await trackerAction(gmU, "place", { key: "pell", to: "living" });
  await trackerAction(gmU, "tempt", { cat: dot.id, instinct: "lapCat" });
  const tc = lastCard("temptation");
  assert.deepEqual(buttonLabels(tc, p1), ["Give in (+1 Cattitude)"], "no Cattitude: only Give in");
  await click(tc, p1, "Give in (+1 Cattitude)");
  assert.equal(dot.system.cattitude, 1);
  assert.equal(pell().distractedRound, state().round, "the fuss Distracts Mr Pell");
  assert.deepEqual(meters(), [0, 2, 5], "+1 Cuddle");
  assert.equal(catOf(dot.id).acted, true, "giving in was her Action");
  assert.deepEqual(log.errors, []);
});

test("the sheet's Roll buttons: what am I doing (in a robbery), or a free roll (outside one)", async () => {
  const kit = await makeCat("Midnight Kit", p1, { approaches: { sneaky: 3, sweet: 2, savage: 1, streetwise: 1 }, instinct1: "climber", instinct2: "foodie", body: "lean" });
  const { CatSheet } = await import("../module/sheets/actor-sheets.mjs");
  const sheet = new CatSheet({ document: kit });
  await asUser(p1, () => sheet.render(true));
  // outside any robbery this cat is in: straight to the roll dialog
  diceQueue.push(4, 2, 6);
  dialogResponders.push(opts => opts.buttons.find(b => b.action === "roll").callback({}, { form: fakeForm({ approach: "sneaky" }) }));
  await asUser(p1, () => sheet.runAction("roll", { approach: "sneaky" }));
  await settle();
  const free = game.messages.at(-1);
  assert.equal(flags(free).result, "clean");
  assert.equal(flags(free).robberyId, null);
  assert.equal(flags(free).plan.total, 3);
  // in a robbery: first "what are you doing?", then the dialog for that option
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [kit.id] }));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  let asked = null;
  dialogResponders.push(opts => { asked = opts.buttons.map(b => b.action); return "enter:window"; });
  dialogResponders.push(opts => opts.buttons.find(b => b.action === "roll").callback({}, { form: fakeForm({ approach: "sneaky" }) }));
  diceQueue.push(6, 6, 2);
  await asUser(p1, () => sheet.runAction("roll", { approach: "sneaky" }));
  await settle();
  assert.ok(asked.includes("enter:window") && asked.includes("enter:front") && asked.includes("free"));
  const m = game.messages.at(-1);
  assert.equal(flags(m).optionId, "enter:window");
  assert.equal(flags(m).result, "purrfect", "Sneaky 3 + Climber − Tricky = 3 dice, two 6s");
  // an open tracker follows every change to the robbery
  const app = asUser(p1, () => api().openTracker());
  await settle();
  const before = app._renders;
  await asUser(gmU, () => api().robbery.overrides.placeResident("pell", "living"));
  await settle();
  assert.ok(app._renders > before, "the tracker re-rendered when the robbery changed");
  assert.equal(api().tracker, app);
  assert.deepEqual(log.errors, []);
});

test("v0.7: a meter filled with no roll — the Storyteller picks the cat from a whispered card", async () => {
  const a = await makeCat("Alley Pearl", p1, { approaches: { sneaky: 3, sweet: 2, savage: 1, streetwise: 1 }, instinct1: "curious", instinct2: "hunter", body: "lean" });
  const b = await makeCat("Lamppost Sully", p2, { approaches: { savage: 3, sneaky: 2, sweet: 1, streetwise: 1 }, instinct1: "scrapper", instinct2: "climber", body: "chonky" });
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [a.id, b.id] }));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  for (const c of [a, b]) await trackerAction(gmU, "place", { cat: c.id, to: "living" });
  await asUser(gmU, () => api().robbery.overrides.patch("pell", { room: "living", searching: true }));
  for (let i = 0; i < 4; i++) await trackerAction(gmU, "mood", { side: "broom", steps: "1" });
  assert.deepEqual(meters(), [4, 0, 5], "two cats: Patience 5");
  await houseTurn([1, 1, 1, 1, 1, 1, 1]); // Mr Pell is Searching and sees both cats: Broom +1 fills it
  assert.ok(state().pendingTrigger, "the meter waits for the Storyteller's pick");
  const pick = lastCard("moodPick");
  assert.deepEqual(pick.whisper, [gmU.id]);
  assert.deepEqual(buttonLabels(pick, p1), []);
  assert.deepEqual(buttonLabels(pick, gmU), ["Mr Pell chases out Alley Pearl", "Mr Pell chases out Lamppost Sully"]);
  await click(pick, gmU, "Mr Pell chases out Lamppost Sully");
  assert.equal(catOf(b.id).status, "outside");
  assert.equal(catOf(a.id).status, "free");
  assert.equal(state().pendingTrigger, null);
  assert.match(lastCard("mood").content, /Shoo! Mr Pell grabs the broom and chases Lamppost Sully out/);
  assert.deepEqual(meters(), [0, 0, 4]);
  assert.deepEqual(log.errors, []);
});

test("v0.9: a Shoo! through a shut entrance, the last open entrance staying open, the other meter dropping, a give-in stopping one short", async () => {
  const sooty = await makeCat("Sooty Boots", p2, { approaches: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instinct1: "curious", instinct2: "scrapper", body: "chonky" });
  const pickles = await makeCat("Pickles", p2, { approaches: { sneaky: 3, savage: 2, streetwise: 1, sweet: 1 }, instinct1: "climber", instinct2: "hunter", body: "lean" });
  const lady = await makeCat("Lady Whiskers", p1, { approaches: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instinct1: "lapCat", instinct2: "knocker", body: "lean" });
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [sooty.id, pickles.id, lady.id] }));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  await asUser(gmU, () => api().robbery.overrides.patch("pudding", { mode: "hiding", until: 99 }));
  for (const c of [sooty, pickles, lady]) await trackerAction(gmU, "place", { cat: c.id, to: "kitchen" });
  await trackerAction(gmU, "place", { key: "pell", to: "kitchen" });
  await trackerAction(gmU, "toggleEntrance", { entrance: "window", open: "true" });
  assert.equal(state().entrances.find(e => e.key === "window").open, false, "the Storyteller shut the kitchen window");
  for (let i = 0; i < 4; i++) await trackerAction(gmU, "mood", { side: "broom", steps: "1" });
  for (let i = 0; i < 4; i++) await trackerAction(gmU, "mood", { side: "cuddle", steps: "1" });
  assert.deepEqual(meters(), [4, 4, 5], "three cats: Patience 5");

  // a seen Scrape fills Broom: out through the nearest entrance Sooty fits — the shut window, opened and shut again (the cat flap is open)
  let m = await rollAs(p2, sooty, "free", { approach: "savage" }, [5, 2, 1]);
  await click(m, p2, "Accept");
  assert.equal(catOf(sooty.id).status, "outside");
  assert.match(lastCard("mood").content, /out through the Open kitchen window \(up the bins\) \(opening it first\), shuts it and stays in the kitchen/);
  assert.equal(state().entrances.find(e => e.key === "window").open, false);
  assert.deepEqual(meters(), [0, 3, 4], "Patience 4, and Cuddle drops to 3: one below it");

  // the cat flap shut too: the window is the last way in still open, so Mr Pell leaves it open
  await trackerAction(gmU, "toggleEntrance", { entrance: "flap", open: "true" });
  for (let i = 0; i < 3; i++) await trackerAction(gmU, "mood", { side: "broom", steps: "1" });
  m = await rollAs(p2, pickles, "free", { approach: "savage" }, [5, 1]);
  await click(m, p2, "Accept");
  assert.equal(catOf(pickles.id).status, "outside");
  assert.match(lastCard("mood").content, /leaves it open \(it(&#x27;|')s the last way in still open\)/);
  assert.equal(state().entrances.find(e => e.key === "window").open, true);
  assert.deepEqual(meters(), [0, 2, 3], "Cuddle 3 drops to 2");

  // Lady gives in to a lap in the living room: Cuddle would fill, so it stops one short — no Scoop
  await trackerAction(gmU, "place", { cat: lady.id, to: "living" });
  await trackerAction(gmU, "place", { key: "pell", to: "living" });
  await trackerAction(gmU, "tempt", { cat: lady.id, instinct: "lapCat" });
  await click(lastCard("temptation"), p1, "Give in (+1 Cattitude)");
  assert.deepEqual(meters(), [0, 2, 3], "the fuss's Cuddle step stops one short");
  assert.equal(catOf(lady.id).status, "free");
  assert.equal(pell().distractedRound, state().round, "Mr Pell is Distracted…");
  assert.equal(pell().distractions, 1, "…and it counts as a distraction of him");
  assert.equal(lady.system.cattitude, 4, "3 (a gang of three) + 1 for giving in");
  assert.deepEqual(log.errors, []);
});

test("the getaway (Ch 9): a piece dropped on purpose, a Flop, the van, a dodge, pinched — and busting out of the pound", async () => {
  const fudge = await makeCat("Fudge", p1, { approaches: { savage: 3, sneaky: 2, sweet: 1, streetwise: 1 }, instinct1: "hunter", instinct2: "climber", body: "chonky" });
  const wisp = await makeCat("Wisp", p2, { approaches: { sneaky: 3, sweet: 2, savage: 1, streetwise: 1 }, instinct1: "boxSitter", instinct2: "curious", body: "lean" });
  await asUser(gmU, () => api().robbery.startRobbery("number-12", { actorIds: [fudge.id, wisp.id] }));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  // the house part as it ends: the chicken (3 portions for two cats) carried out, nobody caught
  const s = JSON.parse(JSON.stringify(state()));
  Object.assign(s.prize, { withHuman: null, out: true, room: null });
  s.cred.patch = null; // the Bin Lid Boys stay in tonight (the Cred test has them on the allotments)
  await asUser(gmU, () => game.settings.set("cat-burglars", "robberyState", s));
  await settle();
  await asUser(gmU, () => api().robbery.endRobbery("manual"));
  await settle();
  assert.equal(state().phase, "getaway");
  assert.match(lastCard("getaway").content, /Fudge 2 pieces, Wisp 1 piece/);
  assert.match(lastCard("getaway").content, /the van pulls up at the end of round 2/);
  const app = asUser(p1, () => api().openTracker());
  await settle();
  assert.match(app.element.innerHTML, /The getaway — round 1/);
  const at = c => state().getaway.cats[c.id];

  // round 1: Fudge drops a piece on purpose (two is a load), then climbs the back fence; Wisp Flops and drops hers
  await trackerAction(p1, "act", { cat: fudge.id, option: "gdrop" });
  assert.match(lastCard("getaway").content, /Fudge drops a piece of loot on purpose/);
  let m = await rollAs(p1, fudge, "over", { approach: "savage" }, [6, 2, 1, 1]); // Savage 3 + Climber, no loot die now
  await click(m, p1, "Accept");
  assert.equal(at(fudge).pos, 1);
  m = await rollAs(p2, wisp, "over", { approach: "sneaky" }, [2, 1]); // Sneaky 3 − 1 for her piece
  await click(m, p2, "Accept");
  assert.match(m.content, /Wisp is stuck at Mr Pell(&#x27;|')s back fence/);
  assert.deepEqual([at(wisp).pos, at(wisp).carry, state().getaway.drops[0]], [0, 0, 2]);
  await trackerAction(gmU, "endGetawayRound");
  assert.match(lastCard("getaway").content, /a van is on its way/);

  // round 2: Wisp grabs a dropped piece; Fudge Flops in the allotments and drops his; the van pulls up
  await trackerAction(p2, "act", { cat: wisp.id, option: "gpick" });
  m = await rollAs(p1, fudge, "over", { approach: "savage" }, [1, 1, 2, 3]); // Savage 3 + Hunter (chase)
  await click(m, p1, "Accept");
  assert.deepEqual([at(fudge).pos, at(fudge).carry, state().getaway.drops[1]], [1, 0, 1]);
  await trackerAction(gmU, "endGetawayRound");
  const card = lastCard("getaway");
  assert.match(card.content, /the warden jumps out into the garden/);
  assert.match(card.content, /scoops up 1 piece of dropped loot/);
  assert.match(card.content, /Cornered! Wisp must dodge the warden/);
  assert.deepEqual(buttonLabels(card, gmU), ["Open the Robbery Tracker"], "no End the getaway round while a cat must dodge");
  m = await rollAs(p2, wisp, "dodge", { approach: "sneaky" }, [1, 1, 1, 2]); // Sneaky 3 + Box Sitter (hide)
  await click(m, p2, "Accept");
  assert.equal(at(wisp).state, "pinched");
  assert.match(lastCard("getaway").content, /Pinched! The warden(&#x27;|')s net comes down on Wisp, loot and all/);
  assert.equal(state().getaway.round, 3);

  // rounds 3–5: Fudge grabs his piece back, dodges the warden, and gets home
  await trackerAction(p1, "act", { cat: fudge.id, option: "gpick" });
  assert.ok(buttonLabels(lastCard("getaway"), gmU).includes("End the getaway round"));
  await click(lastCard("getaway"), gmU, "End the getaway round");
  assert.deepEqual(state().getaway.cornered, [fudge.id], "the warden stomps on to the allotments");
  m = await rollAs(p1, fudge, "dodge", { approach: "savage" }, [6, 1, 1, 1]);
  await click(m, p1, "Accept");
  assert.equal(at(fudge).pos, 2, "he bolts to the space just ahead of the warden");
  m = await rollAs(p1, fudge, "over", { approach: "savage" }, [6, 1, 1]); // the alley wall: Savage 3 + Climber − Tricky
  await click(m, p1, "Accept");
  await trackerAction(gmU, "endGetawayRound");
  m = await rollAs(p1, fudge, "over", { approach: "savage" }, [5, 1, 1, 1]); // Station Road: Savage 3 + Hunter
  await click(m, p1, "Accept");
  assert.equal(state().phase, "ended");
  const out = lastCard("outcome");
  assert.match(out.content, /Busted/);
  assert.match(out.content, /Loot home: 1 of 3/);
  assert.match(out.content, /Pinched, and off to the pound: Wisp/);
  assert.deepEqual(buttonLabels(out, p2), ["Wisp: spend a Life to bust out of the pound"]);
  await click(out, p2, "Wisp: spend a Life to bust out of the pound");
  assert.equal(wisp.system.lives, 8);
  assert.match(lastCard("outcome").content, /Wisp spends a Life and busts out of the pound in the night/);
  assert.deepEqual(log.errors, []);
});
