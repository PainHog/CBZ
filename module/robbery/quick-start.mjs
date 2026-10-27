/**
 * NINE LIVES GANG — Play a ready-made game (the Robbery Tracker's quick start; the active GM only).
 *
 * In one go:
 *  1. the house's scene from the Ready to Play compendium (or the one already in the world) and its
 *     journal from the Houses compendium, the scene's journal link pointing at it;
 *  2. the ready-made cats chosen (Meet the Gang) and the house's residents into the world, in tidy
 *     folders — each one reused if the world has it already, never doubled;
 *  3. the robbery starts exactly as Start a robbery starts it (robbery.startRobbery, the same code),
 *     with players' own cats too if the Storyteller ticked them;
 *  4. every token goes on the scene — each resident in its starting room, each cat outside by an
 *     entrance (tokens.mjs; the tokens of cats from an earlier game who aren't playing now come off);
 *  5. the scene is activated.
 * Giving each player a cat stays the Storyteller's job: the start card says how.
 */
import { SYSTEM_ID, FLAG } from "../contracts.mjs";
import { HOUSES, findHouse } from "../logic/house-catalog.mjs";
import { READY_MADE, defaultGangSize, readyMadeFor } from "../logic/ready-to-play.mjs";
import { startRobbery } from "./robbery.mjs";
import { syncTokens } from "./tokens.mjs";
import { isActiveGM } from "./gm-ops.mjs";

/** The compendium packs the quick start reads (system.json packs). */
export const QUICK_PACKS = Object.freeze({
  scenes: `${SYSTEM_ID}.ready-to-play`, houses: `${SYSTEM_ID}.houses`, gang: `${SYSTEM_ID}.gang`, residents: `${SYSTEM_ID}.residents`
});
/** The line the start card gets: player ownership stays the Storyteller's job. */
export const OWNERSHIP_HINT = "Storyteller: hand each player a cat — right-click a cat → Configure Ownership.";
const ROOT_FOLDER = "Nine Lives Gang";
const GANG_FOLDER = "The ready-made gang";

const LABEL = { easy: "Easy", standard: "Standard", hard: "Hard" };
const flagOf = d => d?.flags?.[FLAG] ?? {};
const docClass = name => CONFIG[name]?.documentClass ?? globalThis[name];
const idOf = d => d?.id ?? d?._id;

async function packDocs(id) {
  const pack = game.packs?.get(id);
  if (!pack) throw new Error(`The ${id} compendium is missing: is the Nine Lives Gang system installed properly?`);
  return { pack, docs: await pack.getDocuments() };
}

/** A folder of ours (found by its flag, else made): type "Actor" | "Scene" | "JournalEntry". */
async function folder(type, tag, name, parent = null) {
  const found = game.folders?.find(f => f.type === type && flagOf(f).folder === tag);
  if (found) return found;
  return docClass("Folder").create({ name, type, folder: parent?.id ?? null, sorting: "a", flags: { [FLAG]: { folder: tag } } });
}

/** What the quick start's dialog offers: the houses, the ready-made gang (Chapter 3's ticks for the players), the world's own cats. */
export async function quickStartChoices() {
  const players = game.users?.filter(u => !u.isGM).length ?? 0;
  const size = defaultGangSize(players);
  const ticked = new Set(readyMadeFor(size));
  let docs = [];
  try { docs = (await packDocs(QUICK_PACKS.gang)).docs; } catch { /* no pack: names from the world, or the keys */ }
  const gang = READY_MADE.map(key => {
    const d = game.actors.find(a => a.type === "cat" && flagOf(a).gang === key) ?? docs.find(x => flagOf(x).gang === key);
    return { key, name: d?.name ?? key, img: d?.img ?? "", checked: ticked.has(key) };
  });
  const own = game.actors.filter(a => a.type === "cat" && !flagOf(a).gang).map(a => ({ id: a.id, name: a.name }));
  return {
    players, size,
    houses: HOUSES.map((h, i) => ({ key: h.key, name: h.name, label: LABEL[h.label] ?? h.label, selected: i === 0 })),
    gang, own, hasOwn: own.length > 0, hint: OWNERSHIP_HINT
  };
}

/**
 * Set up a ready-made game at a house and start the robbery (see the top of this file).
 * @param {{ house: string, readyMade?: string[], own?: string[] }} choice  a catalog key; ready-made gang keys; ids of the world's own cats
 * @returns {{ scene, journal, state, actorIds }}
 */
export async function quickStart({ house, readyMade = [], own = [] } = {}) {
  if (!isActiveGM()) throw new Error("Only the active Storyteller sets up a ready-made game.");
  const h = findHouse(house);
  if (!h) throw new Error(`There's no house called "${house}".`);
  if (!readyMade.length && !own.length) throw new Error("Choose at least one cat for the gang.");

  // 1. the folders, the journal and the scene
  const actorRoot = await folder("Actor", "root", ROOT_FOLDER);
  const gangFolder = await folder("Actor", "gang", GANG_FOLDER, actorRoot);
  const houseFolder = await folder("Actor", `house:${h.key}`, h.name, actorRoot);
  const sceneFolder = await folder("Scene", "root", ROOT_FOLDER);
  const journalFolder = await folder("JournalEntry", "root", ROOT_FOLDER);
  let journal = game.journal?.find(j => flagOf(j).house === h.key) ?? null;
  if (!journal) {
    const { pack, docs } = await packDocs(QUICK_PACKS.houses);
    const d = docs.find(x => flagOf(x).house === h.key);
    if (d) journal = await game.journal.importFromCompendium(pack, idOf(d), { folder: journalFolder.id });
  }
  let scene = game.scenes.find(sc => flagOf(sc).readyToPlay && flagOf(sc).house === h.key) ?? null;
  if (!scene) {
    const { pack, docs } = await packDocs(QUICK_PACKS.scenes);
    const d = docs.find(x => flagOf(x).house === h.key);
    if (!d) throw new Error(`The Ready to Play compendium has no scene for ${h.name}.`);
    scene = await game.scenes.importFromCompendium(pack, idOf(d), { folder: sceneFolder.id, ...(journal ? { journal: journal.id } : {}) });
  } else if (journal && (scene.journal?.id ?? scene.journal) !== journal.id) {
    await scene.update({ journal: journal.id }); // (a scene's journal reads as the entry itself in Foundry, as its id here)
  }

  // 2. the gang and the residents, each reused if the world has it
  let gangPack = null, resPack = null;
  const gang = [];
  for (const key of READY_MADE.filter(k => readyMade.includes(k))) {
    let a = game.actors.find(x => x.type === "cat" && flagOf(x).gang === key) ?? null;
    if (!a) {
      gangPack ??= await packDocs(QUICK_PACKS.gang);
      const d = gangPack.docs.find(x => flagOf(x).gang === key);
      if (d) a = await game.actors.importFromCompendium(gangPack.pack, idOf(d), { folder: gangFolder.id });
    }
    if (a) gang.push(a);
  }
  for (const r of [...h.humans, ...h.pets]) {
    if (game.actors.find(x => (x.type === "human" || x.type === "pet") && x.system?.house === h.key && x.system?.key === r.key)) continue;
    resPack ??= await packDocs(QUICK_PACKS.residents);
    const d = resPack.docs.find(x => flagOf(x).house === h.key && flagOf(x).resident === r.key);
    if (d) await game.actors.importFromCompendium(resPack.pack, idOf(d), { folder: houseFolder.id });
  }
  const mine = own.map(id => game.actors.get(id)).filter(a => a?.type === "cat" && !gang.includes(a));
  const actorIds = [...gang, ...mine].map(a => a.id);
  if (!actorIds.length) throw new Error("Choose at least one cat for the gang.");

  // 3. the robbery, started as Start a robbery starts it
  const state = await startRobbery(h, { actorIds, notes: [OWNERSHIP_HINT] });

  // 4. the tokens (the cats of an earlier game at this house who aren't playing now come off the scene)
  const stale = (scene.tokens ?? []).filter(t => { const a = game.actors.get(t.actorId); return a?.type === "cat" && !actorIds.includes(a.id); }).map(t => t.id);
  if (stale.length) await scene.deleteEmbeddedDocuments("Token", stale);
  await syncTokens({ scene, create: true });

  // 5. everyone to the scene
  await scene.activate();
  return { scene, journal, state, actorIds };
}
