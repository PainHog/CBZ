/**
 * Smoke test on the fake Foundry (tools/fake-foundry.mjs): the Robbery Tracker's "Play a ready-made
 * game" at every house, as a Storyteller with two players. The house's scene comes from the Ready
 * to Play compendium with its journal linked, the ready-made cats and the residents come in once (in
 * their folders), every resident's token stands in its starting room and every cat's outside by an
 * entrance, the robbery starts as Start a robbery starts it; then a round runs and the tokens follow
 * — one batch of moves per change, a dragged token left alone until the next change puts it back,
 * the getaway's spaces, the van and the warden. Playing again reuses everything; players' own cats
 * come along; with the setting off, tokens stay put.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { installFoundry, asUser, settle, diceQueue, dialogResponders, fakeForm, renderMessage, log } from "../tools/fake-foundry.mjs";
import { HOUSES } from "../module/logic/house-catalog.mjs";
import { fits } from "../module/logic/map.mjs";

const { game } = installFoundry({ users: [
  { id: "gmUser0000000000", name: "Storyteller", isGM: true },
  { id: "playerOne0000000", name: "Lena" },
  { id: "playerTwo0000000", name: "Sam" }
] });
await import("../module/cat-burglars.mjs");
Hooks.callAll("init");
Hooks.callAll("ready");
await settle();

const [gmU, p1] = game.users;
const api = () => game.catBurglars;
const state = () => api().state();
const FLAG = "cat-burglars";
const SIZE = 72;
const layoutOf = sc => sc.flags[FLAG].layout;
const sceneOf = key => game.scenes.filter(sc => sc.flags?.[FLAG]?.house === key);
const tokenOf = (sc, actorId) => sc.tokens.filter(t => t.actorId === actorId);
const inRect = (t, r) => t.x >= r.x && t.y >= r.y && t.x + SIZE <= r.x + r.w && t.y + SIZE <= r.y + r.h;
const overlaps = (a, b) => a.x < b.x + SIZE && b.x < a.x + SIZE && a.y < b.y + SIZE && b.y < a.y + SIZE;
const tokenUpdates = () => log.embedded.filter(e => e.op === "update" && e.type === "Token");
const cardMsgs = kind => game.messages.filter(m => m.flags?.[FLAG]?.card?.kind === kind);

async function trackerAction(user, name, dataset = {}) {
  const app = asUser(user, () => api().openTracker());
  await settle();
  const r = await asUser(user, () => app.runAction(name, dataset));
  await settle();
  return r;
}
/** The Storyteller presses Play a ready-made game and answers the dialog. Returns the dialog's options. */
async function playReadyMade(house, readyMade, own = []) {
  let seen = null;
  dialogResponders.push(opts => {
    seen = opts;
    const values = { house, ...Object.fromEntries(readyMade.map(k => [`gang-${k}`, true])), ...Object.fromEntries(own.map(id => [`own-${id}`, true])) };
    return opts.buttons.find(b => b.action === "play").callback({}, { form: fakeForm(values) });
  });
  await trackerAction(gmU, "quickStart");
  return seen;
}
const gangActor = key => game.actors.find(a => a.type === "cat" && a.flags?.[FLAG]?.gang === key);

/** Every token stands where the robbery says, and no two share a spot. */
function tokensMatchState(sc, why = "") {
  const s = state(), L = layoutOf(sc), g = s.getaway;
  const onRoute = (s.phase === "getaway" || s.phase === "ended") && g;
  const placed = [];
  for (const c of s.cats) {
    const [t, ...more] = tokenOf(sc, c.actorId);
    assert.ok(t && !more.length, `${why}${c.name} has one token`);
    placed.push(t);
    if (onRoute) {
      const r = g.cats[c.id];
      const rect = r.state === "pinched" ? L.getaway.van : L.getaway.spaces[r.state === "home" ? 4 : r.pos];
      assert.ok(inRect(t, rect), `${why}${c.name} on the getaway (${r.state} ${r.pos})`);
    } else if (c.status === "outside") {
      assert.ok(Object.values(L.entrances).some(e => inRect(t, e.outside)), `${why}${c.name} waits outside by an entrance`);
    } else assert.ok(inRect(t, L.rooms[c.where]), `${why}${c.name} in the ${c.where}`);
    assert.equal(t.alpha, c.hidden && !onRoute ? 0.5 : 1, `${why}${c.name}'s token shows whether it hides`);
  }
  for (const r of [...s.humans, ...s.pets]) {
    const [t, ...more] = tokenOf(sc, r.actorId);
    assert.ok(t && !more.length, `${why}${r.name} has one token`);
    placed.push(t);
    assert.ok(inRect(t, L.rooms[r.room]), `${why}${r.name} in the ${r.room}`);
    assert.equal(t.hidden, r.mode === "hiding", `${why}${r.name} hidden only while driven off`);
  }
  for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) assert.ok(!overlaps(placed[i], placed[j]), `${why}two tokens share a spot`);
}

const GANGS = {
  "number-12": ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags"],
  "okafor-box": ["two-bin-tilly", "big-biscuit", "velvet"],
  "wendell-mouse": ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags", "pip"],
  "birthday-cake": ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags"],
  "marchetti-salmon": ["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags", "pip"]
};

test("Play a ready-made game at every house: the table set, the robbery started, the tokens following", async () => {
  for (const h of HOUSES) {
    const why = `${h.key}: `;
    const opts = await playReadyMade(h.key, GANGS[h.key]);
    // the dialog: Chapter 3's ticks for two players (a gang of three: Tilly, Biscuit, Velvet), the ownership hint
    assert.match(opts.content, /name="gang-velvet" checked/);
    assert.match(opts.content, /name="gang-big-biscuit" checked/);
    assert.doesNotMatch(opts.content, /name="gang-pip" checked/);
    assert.doesNotMatch(opts.content, /name="gang-marmalade-mags" checked/);
    assert.match(opts.content, /right-click a cat → Configure Ownership/);
    assert.match(opts.content, /assets\/ui\/tag-small\.webp/);
    await settle();

    // the scene, its journal, the folders, the actors
    const [sc, ...dupes] = sceneOf(h.key);
    assert.ok(sc && !dupes.length, `${why}one scene`);
    assert.equal(sc.active, true, `${why}the scene is active`);
    assert.equal(game.scenes.viewed, sc);
    assert.equal(sc.background.src, `systems/cat-burglars/assets/scenes/${h.key}.webp`);
    assert.equal(sc.grid.size, 144);
    assert.equal(sc.padding, 0);
    const journal = game.journal.get(sc.journal);
    assert.equal(journal?.flags[FLAG].house, h.key, `${why}the scene's journal is the house's`);
    assert.match(JSON.stringify(journal.pages), /Play a ready-made game/, `${why}the journal says how`);
    const gangFolder = game.folders.find(f => f.flags[FLAG].folder === "gang");
    const houseFolder = game.folders.find(f => f.flags[FLAG].folder === `house:${h.key}`);
    for (const k of GANGS[h.key]) assert.equal(gangActor(k)?.folder, gangFolder.id, `${why}${k} in the gang's folder`);
    for (const r of [...h.humans, ...h.pets]) {
      const a = game.actors.filter(x => x.system.house === h.key && x.system.key === r.key);
      assert.equal(a.length, 1, `${why}${r.name} came in once`);
      assert.equal(a[0].folder, houseFolder.id, `${why}${r.name} in the house's folder`);
    }
    assert.equal(game.folders.filter(f => f.type === "Actor" && f.flags[FLAG].folder === "gang").length, 1, "one gang folder");

    // the robbery, as Start a robbery starts it
    const s = state();
    assert.equal(s.houseKey, h.key);
    assert.equal(s.phase, "robbery");
    assert.deepEqual(s.cats.map(c => c.actorId).sort(), GANGS[h.key].map(k => gangActor(k).id).sort());
    for (const r of [...s.humans, ...s.pets]) assert.ok(r.actorId, `${why}${r.name} is linked to its actor`);
    const start = cardMsgs("robbery").at(-1);
    assert.equal(start.flags[FLAG].card.houseKey, h.key, `${why}the start card is the house's`);
    assert.match(start.content, /right-click a cat → Configure Ownership/, `${why}the start card's hint`);

    // the tokens: residents in their starting rooms, cats outside by the entrances, the warden waiting
    assert.equal(sc.tokens.length, s.cats.length + s.humans.length + s.pets.length);
    tokensMatchState(sc, why);
    for (const r of [...h.humans, ...h.pets]) assert.ok(inRect(tokenOf(sc, s[r.attention !== undefined ? "humans" : "pets"].find(x => x.key === r.key).actorId)[0], layoutOf(sc).rooms[r.start]), `${why}${r.name} starts in the ${r.start}`);
    for (const c of s.cats) assert.equal(tokenOf(sc, c.actorId)[0].width, 0.5, "a cat's token is half a square (one cat length)");
    assert.equal(tokenOf(sc, gangActor("velvet").id)[0].texture.src, "systems/cat-burglars/assets/gang/velvet-token.webp");
    const warden = sc.tiles.find(t => t.flags[FLAG]?.warden);
    assert.ok(warden && warden.hidden, `${why}the warden's tile waits, hidden`);

    // round 1: a cat comes in by a way in with no roll; only its token moves, in one batch
    await asUser(gmU, () => api().robbery.beginRound());
    await settle();
    const tilly = s.cats.find(c => c.actorId === gangActor("two-bin-tilly").id);
    const way = s.entrances.find(e => !e.opts.length && !e.rounds && fits(e.size, { body: "lean" }));
    let before = tokenUpdates().length;
    await trackerAction(gmU, "act", { cat: tilly.id, option: `enter:${way.key}` });
    assert.equal(state().cats.find(c => c.id === tilly.id).where, way.room, `${why}Tilly comes in through the ${way.name}`);
    const batches = tokenUpdates().slice(before);
    assert.equal(batches.length, 1, `${why}one batch of token moves for the change`);
    assert.deepEqual(batches[0].ids, [tokenOf(sc, tilly.actorId)[0].id], `${why}only Tilly's token moves`);
    tokensMatchState(sc, why);

    // the house's turn: routines move the residents; their tokens follow, in one batch
    before = tokenUpdates().length;
    diceQueue.push(...Array(40).fill(5));
    await asUser(gmU, () => api().robbery.endRound({ confirm: true }));
    await settle();
    diceQueue.length = 0;
    assert.ok(tokenUpdates().length - before <= 1, `${why}the house's turn moves the tokens in one batch`);
    tokensMatchState(sc, `${why}after the house's turn: `);

    // the Storyteller drags a resident's token into another room: the robbery doesn't change, and the token stays…
    const who = state().humans[0];
    const t = tokenOf(sc, who.actorId)[0];
    const other = Object.entries(layoutOf(sc).rooms).find(([k]) => k !== who.room)[1];
    await asUser(gmU, () => sc.updateEmbeddedDocuments("Token", [{ _id: t.id, x: other.x + 8, y: other.y + 8 }]));
    await settle();
    assert.equal(state().humans[0].room, who.room, "dragging a token changes nothing in the robbery");
    assert.ok(inRect(t, other), "and nobody snaps it back at once");
    // …until the next change puts it back where the robbery says
    await trackerAction(gmU, "mood", { side: "broom", steps: "1" });
    assert.ok(inRect(t, layoutOf(sc).rooms[who.room]), `${why}the next change puts ${who.name} back`);
    tokensMatchState(sc, why);

    // the Storyteller puts Tilly outside: she waits by her room's entrance
    await trackerAction(gmU, "place", { cat: tilly.id, to: "outside" });
    assert.ok(inRect(tokenOf(sc, tilly.actorId)[0], layoutOf(sc).entrances[way.key].outside), `${why}Tilly waits by the ${way.name}`);

    // Biscuit goes in and stays: the gang runs for it, so he's pinched — in the van; the others in the garden
    const biscuit = s.cats.find(c => c.actorId === gangActor("big-biscuit").id);
    await trackerAction(gmU, "place", { cat: biscuit.id, to: h.humans[0].start });
    await asUser(gmU, () => api().robbery.endRobbery("manual"));
    await settle();
    assert.equal(state().phase, "getaway");
    tokensMatchState(sc, `${why}the getaway: `);
    assert.ok(inRect(tokenOf(sc, biscuit.actorId)[0], layoutOf(sc).getaway.van), `${why}Biscuit in the van`);
    assert.equal(sc.tiles.find(x => x.flags[FLAG]?.warden).hidden, true, "the van hasn't pulled up yet");
    for (let r = 0; r < 4 && state().getaway?.warden === null; r++) await trackerAction(gmU, "endGetawayRound");
    const g = state().getaway;
    assert.ok(Number.isInteger(g.warden), `${why}the warden has landed`);
    const tile = sc.tiles.find(x => x.flags[FLAG]?.warden);
    assert.equal(tile.hidden, false, `${why}the warden's tile shows`);
    assert.deepEqual([tile.x, tile.y], [layoutOf(sc).getaway.warden[g.warden].x, layoutOf(sc).getaway.warden[g.warden].y], `${why}above his space`);
    tokensMatchState(sc, `${why}the getaway: `);
    await asUser(gmU, () => api().robbery.clearRobbery());
    await settle();
  }
  assert.deepEqual(log.errors, []);
});

test("playing again reuses the scene, the actors and the tokens; players' own cats come along; an earlier cat's token comes off", async () => {
  const scenes = game.scenes.length, actors = game.actors.length;
  const own = await asUser(gmU, () => Actor.create({ name: "Sir Pounce", type: "cat", ownership: { default: 0, [p1.id]: 3 }, system: { approaches: { sneaky: 3, savage: 2, sweet: 1, streetwise: 1 }, instinct1: "hunter", instinct2: "climber", body: "lean" } }));
  await playReadyMade("number-12", ["two-bin-tilly", "big-biscuit", "velvet"], [own.id]);
  await settle();
  assert.equal(game.scenes.length, scenes, "no second scene");
  assert.equal(game.actors.length, actors + 1, "no actor imported twice (only Sir Pounce is new)");
  const [sc] = sceneOf("number-12");
  assert.equal(sc.active, true);
  assert.deepEqual(state().cats.map(c => c.name), ["Two-Bin Tilly", "Big Biscuit", "Velvet", "Sir Pounce"]);
  assert.equal(tokenOf(sc, own.id).length, 1, "the player's own cat gets a token");
  assert.equal(tokenOf(sc, gangActor("marmalade-mags").id).length, 0, "Mags isn't playing this time: her old token comes off");
  for (const a of [...state().cats.map(c => c.actorId), ...state().humans.map(x => x.actorId), ...state().pets.map(x => x.actorId)]) assert.equal(tokenOf(sc, a).length, 1);
  tokensMatchState(sc, "again: ");
  // a player sees the start card (no buttons for them on it but the tracker's) and can't start one themselves
  assert.ok(renderMessage(cardMsgs("robbery").at(-1), p1));
  await assert.rejects(() => asUser(p1, () => api().quickStart({ house: "number-12", readyMade: ["velvet"] })), /Only the active Storyteller/);
  assert.deepEqual(log.errors, []);
});

test("with Tokens follow the robbery off, the tokens stay where they are", async () => {
  const [sc] = sceneOf("number-12");
  await asUser(gmU, () => game.settings.set("cat-burglars", "tokensFollow", false));
  await asUser(gmU, () => api().robbery.beginRound());
  await settle();
  const before = tokenUpdates().length;
  const velvet = state().cats.find(c => c.name === "Velvet");
  await trackerAction(gmU, "place", { cat: velvet.id, to: "kitchen" });
  assert.equal(state().cats.find(c => c.id === velvet.id).where, "kitchen");
  assert.equal(tokenUpdates().length, before, "no token moved");
  await asUser(gmU, () => game.settings.set("cat-burglars", "tokensFollow", true));
  await trackerAction(gmU, "mood", { side: "cuddle", steps: "1" });
  tokensMatchState(sc, "back on: ");
  assert.deepEqual(log.errors, []);
});

test("Start a robbery on a ready-to-play scene: the tokens follow, and the macro puts any missing ones on it", async () => {
  const [sc] = sceneOf("okafor-box");
  await asUser(gmU, () => sc.activate());
  const ids = ["two-bin-tilly", "velvet", "pip"].map(k => gangActor(k).id);
  await asUser(gmU, () => api().robbery.startRobbery("okafor-box", { actorIds: ids }));
  await settle();
  const pip = gangActor("pip").id;
  await asUser(gmU, () => sc.deleteEmbeddedDocuments("Token", tokenOf(sc, pip).map(t => t.id)));
  assert.equal(tokenOf(sc, pip).length, 0);
  await asUser(gmU, () => api().syncTokens({ create: true }));
  await settle();
  tokensMatchState(sc, "Start a robbery: ");
  assert.deepEqual(log.errors, []);
});
