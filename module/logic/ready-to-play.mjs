/**
 * NINE LIVES GANG — the ready-to-play games (pure)
 * ------------------------------------------------
 * Two things the quick start and the following tokens need, with no Foundry in them:
 *
 * 1. Who plays by default (Chapter 3, "Meet the Gang"): "With three players, leave out Pip and one
 *    of Tilly, Biscuit and Mags — keep Velvet, because every gang needs a charmer; with four, leave
 *    out Pip." The quick start ticks that many ready-made cats; the Storyteller changes the ticks.
 *
 * 2. Where the tokens stand on a ready-to-play scene. The scene (the Ready to Play compendium)
 *    carries its house's layout in flags["cat-burglars"].layout, in scene pixels from the
 *    background's top left: every room (and what is drawn in it), every entrance with a place to
 *    wait outside it, and the getaway row — the van, five spaces from the garden to the hideout, and
 *    where the warden's tile stands above each. The robbery state says where everyone is:
 *      targetsFor  which area each cat and resident belongs in ("room:<key>", "out:<entrance>",
 *                  "route:<space>" with 4 the hideout, "van"), hidden or see-through
 *      spotsIn     the spots in an area for tokens of one size: an even lattice, spots clear of
 *                  what is drawn there (a name, the stairs, a marker) first
 *      planTokens  every token's position with no two on top of each other. A token already in the
 *                  right area stays where it is, so a token the Storyteller dragged within the right
 *                  room isn't shuffled; one anywhere else goes to the first free spot of its area.
 *      planWarden  where the warden's tile goes, and whether it shows.
 *    The state is the truth and the tokens only the picture: nothing here changes the robbery.
 */
import { nearestEntrances, fits } from "./map.mjs";

/* -------------------------------------------------- who plays (Ch 3) -- */

/** The ready-made gang in Chapter 3's order (the Meet the Gang compendium's keys). */
export const READY_MADE = Object.freeze(["two-bin-tilly", "big-biscuit", "velvet", "marmalade-mags", "pip"]);

/**
 * How many cats to tick for this many players: one each, three to five (a gang of one or two plays
 * as three, Ch 12); with no players yet, four (the houses' own numbers are for four cats).
 */
export function defaultGangSize(players) {
  const n = Math.floor(Number(players) || 0);
  if (n <= 0) return 4;
  return Math.min(5, Math.max(3, n));
}

/**
 * Chapter 3's advice for a gang of this size: five, everyone; four, leave out Pip; three, leave out
 * Pip and one of Tilly, Biscuit and Mags and keep Velvet (ticked: Tilly, Biscuit and Velvet; the
 * Storyteller can swap Mags in).
 */
export function readyMadeFor(size) {
  if (size >= 5) return [...READY_MADE];
  if (size === 4) return READY_MADE.filter(k => k !== "pip");
  return ["two-bin-tilly", "big-biscuit", "velvet"];
}

/* --------------------------------------------- where the tokens stand -- */

/** How see-through a hiding cat's token is (it's tucked away, but its player still finds it). */
export const HIDDEN_ALPHA = 0.5;

const overlaps = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const KIND_ORDER = { human: 0, pet: 1, cat: 2 };

/** Every area of a layout: key → { rect, avoid, toward } (toward: an outside place's entrance marker). */
export function areas(layout) {
  const out = new Map();
  for (const [k, r] of Object.entries(layout?.rooms ?? {})) out.set(`room:${k}`, { rect: r, avoid: r.avoid ?? [] });
  for (const [k, e] of Object.entries(layout?.entrances ?? {})) out.set(`out:${k}`, { rect: e.outside, avoid: e.outside?.avoid ?? [], toward: e.marker ?? null });
  (layout?.getaway?.spaces ?? []).forEach((r, i) => out.set(`route:${i}`, { rect: r, avoid: [] }));
  if (layout?.getaway?.van) out.set("van", { rect: layout.getaway.van, avoid: [] });
  return out;
}

/** The area a point is in (a token's centre), or null. */
export function areaAt(layout, x, y, all = areas(layout)) {
  for (const [k, a] of all) {
    const r = a.rect;
    if (r && x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return k;
  }
  return null;
}

/**
 * The spots in a rectangle for square tokens of `size` px: an even lattice `inset` px in from the edges
 * (spots never overlap: they are at least `size` apart). Spots clear of every `avoid` box
 * ([x0, y0, x1, y1]) come first, then the rest; within each, nearest `toward` first (if given), then
 * row by row from the top left. Returns [{ x, y }] (a token's top left).
 */
export function spotsIn(rect, size, { avoid = [], toward = null, inset = 8 } = {}) {
  const line = (start, len) => {
    const n = Math.max(1, Math.floor((len - 2 * inset) / size));
    if (n === 1) return [Math.round(start + (len - size) / 2)];
    const step = (len - 2 * inset - size) / (n - 1);
    return Array.from({ length: n }, (_, i) => Math.round(start + inset + i * step));
  };
  const xs = line(rect.x, rect.w), ys = line(rect.y, rect.h);
  const spots = [];
  for (const y of ys) for (const x of xs) spots.push({ x, y });
  const blocked = s => avoid.some(a => overlaps([s.x, s.y, s.x + size, s.y + size], a));
  const away = s => (toward ? Math.hypot(s.x + size / 2 - toward.x, s.y + size / 2 - toward.y) : 0);
  return spots.map((s, i) => ({ s, i, b: blocked(s) ? 1 : 0, d: away(s) }))
    .sort((a, b) => (a.b - b.b) || (a.d - b.d) || (a.i - b.i))
    .map(o => o.s);
}

/**
 * Where a cat outside waits: by the entrance its token is already at; else out by the room its token
 * was in (that room's entrance, or the nearest one); else by the entrance it came in by; else the
 * cats share out the entrances they fit through (a Chonky cat never waits at a Tight one), in house order.
 */
function outsideArea(state, layout, c, index, cur) {
  const has = k => !!layout?.entrances?.[k];
  if (cur?.startsWith("out:") && has(cur.slice(4))) return cur;
  let key = null;
  if (cur?.startsWith("room:")) {
    const room = cur.slice(5);
    key = ((state.entrances ?? []).find(e => e.room === room) ?? nearestEntrances(state, room)[0])?.key ?? null;
  }
  if ((!key || !has(key)) && c.enteredBy && has(c.enteredBy)) key = c.enteredBy;
  if (!key || !has(key)) {
    const known = (state.entrances ?? []).filter(e => has(e.key));
    const fit = known.filter(e => fits(e.size, { body: c.body }));
    const list = fit.length ? fit : known;
    key = list.length ? list[index % list.length].key : Object.keys(layout?.entrances ?? {})[0];
  }
  return `out:${key}`;
}

/**
 * Which area everyone in the robbery belongs in, and how their token shows:
 * [{ ref, kind, area, hidden, alpha, near }]. ref is "cat:<id>", "human:<key>" or "pet:<key>".
 *  - a cat: its room (free, Held — beside its holder —, Shut in the Den, riding the vacuum — beside
 *    it); outside, by an entrance; on the getaway, its space (home: the hideout), and a pinched cat
 *    in the van. A hiding cat's token is see-through.
 *  - a human or a pet: its room. A driven-off pet's token is hidden (only the Storyteller sees it)
 *    until it comes back.
 * `current`: ref → the area its token stands in now (where an outside cat waits depends on it).
 */
export function targetsFor(state, layout, current = {}) {
  const out = [];
  if (!state) return out;
  const g = state.getaway;
  const onRoute = (state.phase === "getaway" || state.phase === "ended") && !!g?.cats;
  const last = Math.max(0, (layout?.getaway?.spaces?.length ?? 5) - 1);
  (state.cats ?? []).forEach((c, i) => {
    const ref = `cat:${c.id}`;
    const r = onRoute ? g.cats[c.id] : null;
    let area, near = null;
    if (r) area = r.state === "pinched" ? "van" : r.state === "home" ? `route:${last}` : `route:${Math.min(Math.max(0, r.pos ?? 0), last)}`;
    else if (c.status === "outside" || c.where === "outside") area = outsideArea(state, layout, c, i, current[ref]);
    else area = `room:${c.where}`;
    if (!r && c.status === "held" && c.heldBy) near = `human:${c.heldBy}`;
    else if (!r && c.riding) near = `pet:${c.riding}`;
    out.push({ ref, kind: "cat", area, hidden: false, alpha: !r && c.hidden ? HIDDEN_ALPHA : 1, near });
  });
  for (const h of state.humans ?? []) out.push({ ref: `human:${h.key}`, kind: "human", area: `room:${h.room}`, hidden: false, alpha: 1, near: null });
  for (const p of state.pets ?? []) out.push({ ref: `pet:${p.key}`, kind: "pet", area: `room:${p.room}`, hidden: p.mode === "hiding", alpha: 1, near: null });
  return out;
}

/**
 * Every token's place. `tokens`: [{ id, ref, x, y, hidden, alpha }] — the scene's tokens that stand for
 * someone in the robbery (x, y: top left, scene pixels). Everyone in the robbery gets a place, token
 * or not (the quick start creates the missing tokens there).
 * Returns { moves: [{ id, x?, y?, hidden?, alpha? }] (only what changes), places: { [ref]: { x, y, area, hidden, alpha } } }.
 */
export function planTokens(state, layout, tokens = []) {
  const size = layout?.token ?? 72;
  const all = areas(layout);
  const byRef = new Map();
  for (const t of tokens) if (t?.ref && !byRef.has(t.ref)) byRef.set(t.ref, t);
  const current = {};
  for (const [ref, t] of byRef) current[ref] = areaAt(layout, t.x + size / 2, t.y + size / 2, all);
  const want = targetsFor(state, layout, current).filter(w => all.has(w.area))
    .map((w, i) => ({ ...w, i })).sort((a, b) => (KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) || (a.i - b.i));
  const taken = [];
  const box = (x, y) => [x, y, x + size, y + size];
  const free = b => taken.every(t => !overlaps(t, b));
  const places = {};
  // 1. a token already in its area stays where it is (unless it sits on one that stayed before it)
  for (const w of want) {
    const t = byRef.get(w.ref);
    if (!t || current[w.ref] !== w.area) continue;
    const b = box(t.x, t.y);
    if (!free(b)) continue;
    taken.push(b);
    places[w.ref] = { x: t.x, y: t.y, area: w.area, hidden: w.hidden, alpha: w.alpha };
  }
  // 2. everyone else: the first free spot in their area (a held cat beside its holder, a rider beside the vacuum)
  const cache = new Map();
  const spots = k => { if (!cache.has(k)) { const a = all.get(k); cache.set(k, spotsIn(a.rect, size, a)); } return cache.get(k); };
  const extra = new Map();
  for (const w of want) {
    if (places[w.ref]) continue;
    let list = spots(w.area);
    const n = w.near ? places[w.near] : null;
    if (n && n.area === w.area) list = [...list].sort((a, b) => Math.hypot(a.x - n.x, a.y - n.y) - Math.hypot(b.x - n.x, b.y - n.y));
    let s = list.find(p => free(box(p.x, p.y)));
    if (!s) {
      // the area is full: stand a little off a spot, so everyone still shows (it stays inside the area)
      const k = extra.get(w.area) ?? 0;
      extra.set(w.area, k + 1);
      const base = list[k % list.length], r = all.get(w.area).rect, off = 12 * (1 + Math.floor(k / list.length));
      s = { x: Math.min(base.x + off, r.x + r.w - size), y: Math.min(base.y + off, r.y + r.h - size) };
    }
    taken.push(box(s.x, s.y));
    places[w.ref] = { x: s.x, y: s.y, area: w.area, hidden: w.hidden, alpha: w.alpha };
  }
  const moves = [];
  for (const w of want) {
    const t = byRef.get(w.ref);
    if (!t) continue;
    const p = places[w.ref], m = { id: t.id };
    if (p.x !== t.x || p.y !== t.y) Object.assign(m, { x: p.x, y: p.y });
    if (!!t.hidden !== !!w.hidden) m.hidden = !!w.hidden;
    if ((t.alpha ?? 1) !== w.alpha) m.alpha = w.alpha;
    if (Object.keys(m).length > 1) moves.push(m);
  }
  return { moves, places };
}

/**
 * The warden's tile (Ch 9): above the space he stands on during the getaway (and where he ended
 * it); before the van pulls up, and in the house, out of sight above the van.
 * Returns { x, y, w, h, hidden } or null when the layout has no getaway row.
 */
export function planWarden(state, layout) {
  const L = layout?.getaway;
  if (!L?.wardenVan) return null;
  const g = state?.getaway;
  const on = (state?.phase === "getaway" || state?.phase === "ended") && Number.isInteger(g?.warden);
  const r = on ? (L.warden?.[Math.min(g.warden, (L.warden?.length ?? 1) - 1)] ?? L.wardenVan) : L.wardenVan;
  return { x: r.x, y: r.y, w: r.w, h: r.h, hidden: !on };
}
