/**
 * NINE LIVES GANG — tokens follow the robbery (setting tokensFollow, on by default).
 *
 * On a ready-to-play scene (its flags["cat-burglars"].layout, from the Ready to Play compendium),
 * whenever the robbery changes, the active GM moves the tokens of whoever moved to a free spot in
 * the right room, outside by an entrance, or on the getaway row (the van, the garden, three spaces,
 * the hideout); a hiding cat's token goes see-through and a driven-off pet's is hidden from the
 * players; on the getaway the warden's tile stands above his space. Where everything goes is worked
 * out by module/logic/ready-to-play.mjs (pure, tested).
 *
 * The state is the truth and the tokens only the picture. Moving a token by hand changes nothing in
 * the robbery; a token left in the right room stays where it was put, one anywhere else goes back at
 * the next change. Each change is one batch of token updates (and the warden's tile), written by the
 * active GM only, in the order the changes happened (a change that comes while one is being drawn is
 * drawn once, from the newest state).
 */
import { FLAG, HOOKS, SETTINGS } from "../contracts.mjs";
import { planTokens, planWarden } from "../logic/ready-to-play.mjs";
import { getState } from "./store.mjs";
import { isActiveGM } from "./gm-ops.mjs";
import { setting } from "../settings.mjs";

/** A ready-to-play scene's layout (or null). */
export const layoutOf = scene => scene?.flags?.[FLAG]?.layout ?? null;

/** The ready-to-play scene for this robbery's house: the active scene if it is one, else the viewed one, else the first. */
export function robberyScene(state = getState()) {
  if (!state?.houseKey) return null;
  const ok = sc => !!sc && !!layoutOf(sc) && sc.flags[FLAG].house === state.houseKey;
  if (ok(game.scenes?.active)) return game.scenes.active;
  if (ok(game.scenes?.viewed)) return game.scenes.viewed;
  return game.scenes?.find?.(ok) ?? null;
}

/** Who a ref is: its actor's id. */
function actorIdOf(state, ref) {
  const [kind, key] = ref.split(":");
  if (kind === "cat") { const c = state.cats.find(x => x.id === key); return c ? (c.actorId ?? c.id) : null; }
  if (kind === "human") return state.humans.find(x => x.key === key)?.actorId ?? null;
  if (kind === "pet") return state.pets.find(x => x.key === key)?.actorId ?? null;
  return null;
}

/** The scene's tokens that stand for someone in the robbery: [{ token, ref }] (one token per actor: the first). */
function robberyTokens(scene, state) {
  const byActor = new Map();
  for (const c of state.cats ?? []) byActor.set(c.actorId ?? c.id, `cat:${c.id}`);
  for (const h of state.humans ?? []) if (h.actorId) byActor.set(h.actorId, `human:${h.key}`);
  for (const p of state.pets ?? []) if (p.actorId) byActor.set(p.actorId, `pet:${p.key}`);
  const seen = new Set(), out = [];
  for (const token of scene.tokens ?? []) {
    const ref = byActor.get(token.actorId);
    if (!ref || seen.has(ref)) continue;
    seen.add(ref);
    out.push({ token, ref });
  }
  return out;
}

const wardenTileOf = scene => (scene.tiles ?? []).find(t => t.flags?.[FLAG]?.warden) ?? null;

/** Draw the robbery on its scene: one batch of token moves; with `create`, the missing tokens and the warden's tile too. */
async function draw({ create = false, scene = null } = {}) {
  const state = getState();
  if (!state || !isActiveGM()) return null;
  const sc = scene ?? robberyScene(state);
  const layout = layoutOf(sc);
  if (!layout) return null;
  const ox = sc.dimensions?.sceneX ?? 0, oy = sc.dimensions?.sceneY ?? 0;
  const mine = robberyTokens(sc, state);
  const plan = planTokens(state, layout, mine.map(({ token, ref }) => ({ id: token.id, ref, x: token.x - ox, y: token.y - oy, hidden: token.hidden, alpha: token.alpha })));
  const updates = plan.moves.map(m => ({ _id: m.id, ...("x" in m ? { x: m.x + ox, y: m.y + oy } : {}), ...("hidden" in m ? { hidden: m.hidden } : {}), ...("alpha" in m ? { alpha: m.alpha } : {}) }));
  if (updates.length) await sc.updateEmbeddedDocuments("Token", updates);
  let created = 0;
  if (create) {
    const have = new Set(mine.map(x => x.ref));
    const size = layout.token / layout.grid;
    const data = [];
    for (const [ref, p] of Object.entries(plan.places)) {
      if (have.has(ref)) continue;
      const actor = game.actors.get(actorIdOf(state, ref));
      if (!actor) continue;
      const td = await actor.getTokenDocument({ x: p.x + ox, y: p.y + oy, width: size, height: size, hidden: !!p.hidden, alpha: p.alpha });
      data.push(td.toObject());
    }
    if (data.length) created = (await sc.createEmbeddedDocuments("Token", data)).length;
  }
  // the warden's tile: made with the scene's tokens (or when the getaway starts), moved with the gang
  const w = planWarden(state, layout);
  if (w) {
    const tile = wardenTileOf(sc);
    const at = { x: w.x + ox, y: w.y + oy, width: w.w, height: w.h, hidden: w.hidden };
    if (!tile && (create || state.phase === "getaway")) {
      await sc.createEmbeddedDocuments("Tile", [{ ...at, texture: { src: layout.getaway.img }, flags: { [FLAG]: { warden: true } } }]);
    } else if (tile && (tile.x !== at.x || tile.y !== at.y || !!tile.hidden !== at.hidden)) {
      await sc.updateEmbeddedDocuments("Tile", [{ _id: tile.id, x: at.x, y: at.y, hidden: at.hidden }]);
    }
  }
  return { scene: sc, moved: updates.length, created };
}

let chain = Promise.resolve();
let waiting = false;
/**
 * Draw the robbery on its scene (active GM only). Calls run one after another; following calls (no
 * options) that pile up while one is drawing are drawn once, from the newest state.
 * opts: { scene, create } — the quick start draws its new scene and makes the tokens.
 */
export function syncTokens(opts = {}) {
  const follow = !opts.create && !opts.scene;
  if (follow && waiting) return chain;
  if (follow) waiting = true;
  chain = chain.then(async () => {
    if (follow) waiting = false;
    try { return await draw(opts); }
    catch (err) { console.error("Nine Lives Gang | tokens", err); ui.notifications?.warn(`Nine Lives Gang: the tokens couldn't follow (${err?.message ?? err}).`); return null; }
  });
  return chain;
}

/** Every robbery change: the active GM's tokens follow (unless tokensFollow is off). Call once at init. */
export function registerTokenFollow() {
  Hooks.on(HOOKS.robberyChanged, () => {
    if (isActiveGM() && setting(SETTINGS.tokensFollow)) syncTokens();
  });
}
