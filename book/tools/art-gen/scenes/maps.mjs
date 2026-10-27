// Floor plans for the five ready-to-run houses, drawn from the same data the
// simulator plays (sim/houses.mjs), so a map can never disagree with its house
// (LESSONS: check the scenario text against its map). The data is read, never changed here.
//   node book/tools/art-gen/scenes/build.mjs map-number-12 …
//
// One scale for every map: each map's viewBox is W = 1028 units wide and the book prints a map
// figure across the full text width (7.14in = 514pt, book.css figure.map), so 1 unit = 0.5pt and one
// grid square (U = 72) is 36pt, half an inch, on every map. Text sizes are set in units: the smallest
// is 15 units = 7.5pt (the rule: every label at least 7pt in print). All text is set in the book's
// faces (Alegreya Sans, Fraunces for room names). If the figure's printed width changes, recheck this.
import { C, svg } from "./lib.mjs";
import { van } from "../residents.mjs";
import { HOUSES } from "../../../../sim/houses.mjs";

const W = 1028;        // every map's width in units (= 514pt in print)
const U = 72;          // one grid square (36pt)
const SANS = `font-family="Alegreya Sans, sans-serif"`, SERIF = `font-family="Fraunces, serif"`;
const SIZE_WORD = { tight: "Tight", normal: "Normal", big: "Big" };
const APPROACH = { sneaky: "Sneaky", sweet: "Sweet", savage: "Savage", streetwise: "Streetwise" };
const DIFF = ["", "Tricky", "Hard"];
/** Text for the page: curly apostrophes, XML-safe. */
const tx = t => String(t).replace(/'/g, "’").replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** "Sneaky or Savage, Tricky" from [[approach, diff, …tags], …] */
export function optText(opts) {
  if (!opts || !opts.length) return "no roll";
  const byDiff = {};
  for (const [a, d] of opts) (byDiff[d] ??= []).push(APPROACH[a]);
  return Object.entries(byDiff).map(([d, as]) => `${as.join(" or ")}${DIFF[d] ? ", " + DIFF[d] : ""}`).join("; or ");
}

/**
 * Where each floor panel goes (top-left corner of its rooms, in units) and where the legend goes,
 * chosen so the five maps share one scale: floors side by side when they fit across the 1028 units,
 * otherwise stacked, with the legend beside or below. Every panel keeps 48 units clear on any side
 * that has an entrance marker, and its floor name sits above any marker on its top wall.
 */
const LAYOUT = {
  "number-12": { floors: [[48, 84]], legend: [560, 52, 440] },
  "birthday-cake": { floors: [[64, 84]], legend: [700, 52, 312] },
  "marchetti-salmon": { floors: [[28, 84], [584, 84]], legend: [28, 512, 972] },
  "okafor-box": { floors: [[52, 84], [64, 560]], legend: [690, 52, 320] },
  "wendell-mouse": { floors: [[40, 84], [512, 84], [40, 590]], legend: [446, 372, 566] },
};

function sharedWall(a, b) {
  // a, b: [x, y, w, h] in squares → the shared wall segment, or null
  const [ax, ay, aw, ah] = a, [bx, by, bw, bh] = b;
  if (ax + aw === bx || bx + bw === ax) {
    const x = ax + aw === bx ? bx : ax;
    const y0 = Math.max(ay, by), y1 = Math.min(ay + ah, by + bh);
    if (y1 > y0) return { vertical: true, x, y0, y1 };
  }
  if (ay + ah === by || by + bh === ay) {
    const y = ay + ah === by ? by : ay;
    const x0 = Math.max(ax, bx), x1 = Math.min(ax + aw, bx + bw);
    if (x1 > x0) return { vertical: false, y, x0, x1 };
  }
  return null;
}
/** An entrance named after its room's short name takes the room's full name ("Bedroom window" into the Spare bedroom). */
function entranceName(h, e) {
  const roomName = h.rooms[e.room].name, first = e.name.split(" ")[0];
  return roomName.toLowerCase() !== first.toLowerCase() && roomName.toLowerCase().endsWith(" " + first.toLowerCase()) ? roomName + e.name.slice(first.length) : e.name;
}
/** Rough width of a run of text in units (good enough to keep labels inside rooms and apart). */
const textW = (t, size, bold = false) => t.length * size * (bold ? 0.56 : 0.5);
const overlap = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/**
 * One house's plan. opts (all optional; the book's maps use none of them):
 *   layout    where the floors go, instead of LAYOUT (the tabletop plan's grid-aligned places)
 *   legend    false: no ENTRANCES list and no notes under it
 *   extra     more drawing, laid over the plan (the tabletop plan's getaway row and entrance key)
 *   width, height, title   the drawing's size and title
 *   geometry  an object to fill in with where everything was drawn (map units): the floors, the rooms,
 *             what is drawn in each room, the entrance markers and the floor names
 */
function houseMap(h, opts = {}) {
  const L = opts.layout ?? LAYOUT[h.key];
  const geo = opts.geometry ?? null;
  const floors = h.map.floors;
  const floorOf = {};
  floors.forEach((f, i) => { for (const k of Object.keys(f.rooms)) floorOf[k] = i; });
  const panels = floors.map((f, i) => {
    const w = Math.max(...Object.values(f.rooms).map(r => r[0] + r[2]));
    const hh = Math.max(...Object.values(f.rooms).map(r => r[1] + r[3]));
    return { f, x: L.floors[i][0], y: L.floors[i][1], w: w * U, h: hh * U };
  });
  const R = (k) => { const p = panels[floorOf[k]]; const r = p.f.rooms[k]; return { p, x: p.x + r[0] * U, y: p.y + r[1] * U, w: r[2] * U, h: r[3] * U, r }; };
  const boxes = {}; // what is drawn in each room, to keep the room's name clear of it
  const used = (k, b) => (boxes[k] ??= []).push(b);
  let bottom = 0;
  const grow = y => { bottom = Math.max(bottom, y); };

  let b = "";
  // floors: their names, the rooms, the grid
  for (const p of panels) {
    const topMarker = Object.entries(h.map.entrances).some(([key, side]) => side === "top" && floorOf[h.entrances.find(e => e.key === key)?.room] === panels.indexOf(p));
    b += `<text x="${p.x}" y="${p.y - (topMarker ? 50 : 16)}" ${SANS} font-weight="800" font-size="18" letter-spacing="2" fill="${C.accentDeep}">${tx(p.f.name.toUpperCase())}</text>`;
    if (geo) (geo.floorLabels ??= []).push([p.x, p.y - (topMarker ? 50 : 16) - 18, p.x + textW(p.f.name, 18, true) + 2 * p.f.name.length, p.y - (topMarker ? 50 : 16) + 5]);
    for (const [k, r] of Object.entries(p.f.rooms)) {
      const x = p.x + r[0] * U, y = p.y + r[1] * U, w = r[2] * U, hh = r[3] * U;
      b += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${k === h.den ? C.paper2 : C.light}"/>`;
      let grid = "";
      for (let gx = 1; gx < r[2]; gx++) grid += `M${x + gx * U} ${y}V${y + hh}`;
      for (let gy = 1; gy < r[3]; gy++) grid += `M${x} ${y + gy * U}H${x + w}`;
      if (grid) b += `<path d="${grid}" stroke="${C.edge}" stroke-width="1.2"/>`;
    }
    grow(p.y + p.h);
  }
  // walls (each room outlined; shared walls drawn twice, same place)
  for (const p of panels) for (const r of Object.values(p.f.rooms))
    b += `<rect x="${p.x + r[0] * U}" y="${p.y + r[1] * U}" width="${r[2] * U}" height="${r[3] * U}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="square"/>`;

  // the room names' places (centred, or to the left of a stairs block), worked out first so door swings can avoid them
  const stairsIn = {};
  for (const [a, bb] of h.ways.filter(w => floorOf[w[0]] !== floorOf[w[1]])) { stairsIn[a] = true; stairsIn[bb] = true; }
  const nameBox = {};
  for (const [k, room] of Object.entries(h.rooms)) {
    const r = R(k), size = r.w < 2.1 * U ? 18 : 21, tw = textW(room.name, size, true);
    const cx = stairsIn[k] && r.w - 150 > tw + 20 ? r.x + (r.w - 140) / 2 : r.x + r.w / 2;
    const cy = stairsIn[k] && r.h < 2.5 * U ? r.y + r.h - 22 - (k === h.den ? 22 : 0) : r.y + r.h / 2 + 8;
    nameBox[k] = { cx, cy, size, box: [cx - tw / 2 - 4, cy - size, cx + tw / 2 + 4, cy + 4 + (k === h.den ? 24 : 0)] };
  }

  // ways: gaps in shared walls; a closed door is drawn shut across its gap, with a dashed arc for its swing
  const stairs = [];
  for (const [a, bb, size, opts] of h.ways) {
    if (floorOf[a] !== floorOf[bb]) { stairs.push([a, bb, opts]); continue; }
    const ra = R(a), rb = R(bb), sw = sharedWall(ra.r, rb.r);
    if (!sw) throw new Error(`${h.key}: ${a} and ${bb} share no wall`);
    const gap = (size === "big" ? 0.8 : 0.6) * U, p = ra.p;
    if (sw.vertical) {
      const x = p.x + sw.x * U, ym = p.y + ((sw.y0 + sw.y1) / 2) * U, y0 = ym - gap / 2, y1 = ym + gap / 2;
      b += `<path d="M${x} ${y0}V${y1}" stroke="${C.light}" stroke-width="9"/>`;
      if (opts) {
        // the swing goes into whichever room keeps the arc clear of that room's name
        const left = ra.x < rb.x ? a : bb, right = left === a ? bb : a;
        const arcBox = dir => [Math.min(x, x + dir * gap), y0 - 4, Math.max(x, x + dir * gap), y1 + 4];
        const dir = overlap(arcBox(1), nameBox[right].box) ? -1 : 1;
        b += `<path d="M${x} ${y0}V${y1}" stroke="${C.ink}" stroke-width="5"/>` + // the leaf, shut across the doorway
          `<path d="M${x} ${y1}A${gap} ${gap} 0 0 ${dir > 0 ? 0 : 1} ${x + dir * gap} ${y0}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="5 5"/>`;
        used(dir > 0 ? right : left, arcBox(dir));
      }
    } else {
      const y = p.y + sw.y * U, xm = p.x + ((sw.x0 + sw.x1) / 2) * U, x0 = xm - gap / 2, x1 = xm + gap / 2;
      b += `<path d="M${x0} ${y}H${x1}" stroke="${C.light}" stroke-width="9"/>`;
      if (opts) {
        const top = ra.y < rb.y ? a : bb, below = top === a ? bb : a;
        const arcBox = dir => [x0 - 4, Math.min(y, y + dir * gap), x1 + 4, Math.max(y, y + dir * gap)];
        const dir = overlap(arcBox(1), nameBox[below].box) ? -1 : 1;
        b += `<path d="M${x0} ${y}H${x1}" stroke="${C.ink}" stroke-width="5"/>` +
          `<path d="M${x1} ${y}A${gap} ${gap} 0 0 ${dir > 0 ? 1 : 0} ${x0} ${y + dir * gap}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="5 5"/>`;
        used(dir > 0 ? below : top, arcBox(dir));
      }
    }
  }
  // stairs: an icon in the top right of both rooms, its label under it (right-aligned, inset from the wall);
  // a closed door at the top of the stairs is drawn shut across the icon's top step, with its dashed swing
  const stairBlock = (k, l1, l2, door) => {
    const r = R(k), x = r.x + r.w - 52, y = r.y + 34, tr = r.x + r.w - 12;
    let s = `<rect x="${x - 24}" y="${y - 18}" width="48" height="36" fill="${C.paper2}" stroke="${C.ink}" stroke-width="2"/>`;
    for (let i = 1; i < 5; i++) s += `<path d="M${x - 24 + i * 9.6} ${y - 18}V${y + 18}" stroke="${C.ink}" stroke-width="1.5"/>`;
    if (door) s += `<path d="M${x - 27} ${y - 18}V${y + 18}" stroke="${C.ink}" stroke-width="5"/><path d="M${x - 27} ${y + 18}A36 36 0 0 1 ${x - 63} ${y - 18}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="5 5"/>`;
    s += `<text x="${tr}" y="${y + 38}" text-anchor="end" ${SANS} font-size="15" fill="${C.ink}">${tx(l1)}</text>`;
    s += `<text x="${tr}" y="${y + 55}" text-anchor="end" ${SANS} font-size="15" fill="${C.ink}">${tx(l2)}</text>`;
    used(k, [Math.min(x - 64, tr - Math.max(textW(l1, 15), textW(l2, 15))), r.y, r.x + r.w, y + 60]);
    return s;
  };
  for (const [a, bb, opts] of stairs) {
    for (const [k, other] of [[a, bb], [bb, a]]) {
      const otherName = panels[floorOf[other]].f.name.toLowerCase(), thisName = panels[floorOf[k]].f.name.toLowerCase();
      const up = otherName === "upstairs" || thisName === "cellar";
      // the door is at the top of the stairs, so it is drawn in the room on the upper floor
      const doorHere = opts && !up;
      b += stairBlock(k, `stairs ${up ? "up" : "down"}`, `to ${h.rooms[other].name}${opts ? " (door)" : ""}`, doorHere);
    }
  }
  // the prize: a star where it is put down, with its round (bottom left of the room; stacked if it comes back)
  h.prize.script.forEach((sc, i) => {
    const r = R(sc.room), px = r.x + 24, py = r.y + r.h - 26 - i * 28;
    b += `<path d="M${px} ${py - 13} l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1 Z" fill="${C.accent}" stroke="${C.ink}" stroke-width="2"/>`;
    b += `<text x="${px + 16}" y="${py + 5}" ${SANS} font-size="15" font-weight="700" fill="${C.ink}">round ${sc.round}</text>`;
    used(sc.room, [px - 12, py - 16, px + 16 + textW(`round ${sc.round}`, 15, true), py + 8]);
  });
  // entrances: numbered markers outside the wall they cross (or a dashed square for a roof light)
  const marks = [];
  h.entrances.forEach((e, i) => {
    const r = R(e.room), side = h.map.entrances[e.key], off = 26;
    let mx, my, wx0, wy0, wx1, wy1;
    if (side === "top") { mx = r.x + r.w * 0.36; my = r.y - off; wx0 = mx - 16; wx1 = mx + 16; wy0 = wy1 = r.y; }
    if (side === "bottom") { mx = r.x + r.w * 0.5; my = r.y + r.h + off; wx0 = mx - 22; wx1 = mx + 22; wy0 = wy1 = r.y + r.h; }
    if (side === "left") { mx = r.x - off; my = r.y + r.h * 0.5; wy0 = my - 16; wy1 = my + 16; wx0 = wx1 = r.x; }
    if (side === "right") { mx = r.x + r.w + off; my = r.y + r.h * 0.5; wy0 = my - 22; wy1 = my + 22; wx0 = wx1 = r.x + r.w; }
    if (side === "roof") { mx = r.x + r.w * 0.5; my = r.y + r.h - 40; }
    if (side === "roof") { b += `<rect x="${mx - 22}" y="${my - 22}" width="44" height="44" fill="none" stroke="${C.accentDeep}" stroke-width="2.4" stroke-dasharray="6 4"/>`; used(e.room, [mx - 24, my - 24, mx + 24, my + 24]); }
    else b += `<path d="M${wx0} ${wy0}L${wx1} ${wy1}" stroke="${C.accent}" stroke-width="9"/>`;
    b += `<circle cx="${mx}" cy="${my}" r="15" fill="${C.accent}" stroke="${C.ink}" stroke-width="2.4"/>`;
    if (geo) (geo.markers ??= {})[e.key] = { room: e.room, side, n: i + 1, x: mx, y: my, r: 15 };
    b += `<text x="${mx}" y="${my + 6}" text-anchor="middle" ${SANS} font-weight="800" font-size="17" fill="${C.ink}">${i + 1}</text>`;
    grow(my + 16);
    const name = entranceName(h, e);
    const when = e.rounds ? ` (round${e.rounds.length > 1 ? "s" : ""} ${e.rounds.join("–")} only${e.one ? ", one cat" : ""})` : "";
    const extras = [e.climb ? "a climb: Small things only" : null, e.noisy ? "makes noise" : null, e.jam ? "stays open once jammed" : null].filter(Boolean).join(", ");
    marks.push(`${i + 1}. ${name} — ${SIZE_WORD[e.size]}; ${optText(e.opts)}${extras ? "; " + extras : ""}${when}`);
  });
  // room names (and the Den), placed clear of what is drawn in the room
  for (const [k, room] of Object.entries(h.rooms)) {
    let { cx, cy, size, box } = nameBox[k];
    for (let tries = 0; tries < 6 && (boxes[k] ?? []).some(u => overlap(u, box)); tries++) { cy += 18; box = [box[0], box[1] + 18, box[2], box[3] + 18]; }
    b += `<text x="${cx}" y="${cy}" text-anchor="middle" ${SERIF} font-weight="700" font-size="${size}" fill="${C.ink}">${tx(room.name)}</text>`;
    if (geo) (geo.labels ??= {})[k] = box;
    if (k === h.den) b += `<text x="${cx}" y="${cy + 22}" text-anchor="middle" ${SANS} font-weight="800" font-size="15" letter-spacing="2" fill="${C.cuddle}">THE DEN</text>`;
  }
  if (geo) {
    geo.U = U;
    geo.floors = panels.map(p => ({ name: p.f.name, x: p.x, y: p.y, w: p.w, h: p.h }));
    geo.rooms = Object.fromEntries(Object.keys(h.rooms).map(k => { const r = R(k); return [k, { x: r.x, y: r.y, w: r.w, h: r.h, floor: floorOf[k] }]; }));
    geo.drawn = Object.fromEntries(Object.keys(h.rooms).map(k => [k, [...(boxes[k] ?? [])]]));
  }
  if (opts.extra) b += opts.extra;
  if (opts.legend === false) return svg(`0 0 ${opts.width} ${opts.height}`, opts.title, `<rect width="${opts.width}" height="${opts.height}" fill="${C.paper}"/>` + b);
  // the legend: the entrances, then how doors and the prize star are drawn, and the scale
  const [LX, LY, LW] = L.legend;
  const wrap = (t, size) => {
    const max = Math.floor(LW / (size * 0.5)), out = []; let cur = "";
    for (const w of t.split(" ")) { if (cur && (cur + " " + w).length > max) { out.push(cur); cur = "   " + w; } else cur = cur ? cur + " " + w : w; }
    return cur ? [...out, cur] : out;
  };
  let ly = LY;
  b += `<text x="${LX}" y="${ly}" ${SANS} font-weight="800" font-size="17" letter-spacing="2" fill="${C.accentDeep}">ENTRANCES</text>`;
  ly += 6;
  for (const m of marks) for (const ln of wrap(m, 16)) { ly += 21; b += `<text x="${LX}" y="${ly}" ${SANS} font-size="16" fill="${C.ink}" xml:space="preserve">${tx(ln)}</text>`; }
  ly += 10;
  const note = `A door drawn shut with a dashed swing is closed (${optText([["streetwise", 1], ["savage", 2]])} to open, unless the house says otherwise). The star marks where the prize is put down, and in which round. One square is about two cat lengths.`;
  for (const ln of wrap(note, 15)) { ly += 19; b += `<text x="${LX}" y="${ly}" ${SANS} font-size="15" fill="${C.inkSoft}">${tx(ln.trim())}</text>`; }
  grow(ly + 6);
  const H = Math.ceil(bottom + 14);
  return svg(`0 0 ${W} ${H}`, tx(`Floor plan: ${h.name}`), `<rect width="${W}" height="${H}" fill="${C.paper}"/>` + b);
}

export const map_number_12 = () => houseMap(HOUSES.find(h => h.key === "number-12"));
export const map_okafor_box = () => houseMap(HOUSES.find(h => h.key === "okafor-box"));
export const map_wendell_mouse = () => houseMap(HOUSES.find(h => h.key === "wendell-mouse"));
export const map_birthday_cake = () => houseMap(HOUSES.find(h => h.key === "birthday-cake"));
export const map_marchetti_salmon = () => houseMap(HOUSES.find(h => h.key === "marchetti-salmon"));

/* ------------------------------------------------------------------------------------------------
 * The plan for a virtual tabletop (the Foundry system's ready-to-play scenes: tools/build-assets.mjs
 * renders it, tools/pack-content.mjs reads its geometry). The same rooms, doors, stairs, entrance
 * markers, prize stars and names as the book's map, drawn by houseMap() from the same data, but:
 *  - every floor sits on whole grid squares, so a tabletop's square grid lines up with the rooms;
 *  - every side of a floor with an entrance keeps two squares clear outside it, where the cats wait
 *    (one square on the other sides);
 *  - no ENTRANCES list: a one-line key of the numbered markers instead;
 *  - the getaway under the house: the van, the garden, the far side of each of the route's first three
 *    obstacles and the hideout as a row of spaces, each obstacle's name between two spaces, and a row
 *    above them where the warden stands.
 * Returns { svg, geometry } (map units; one square is U). The geometry says where every room, entrance
 * marker, place to wait outside and getaway space is, and what is drawn in each (to keep tokens off it).
 * ------------------------------------------------------------------------------------------------ */
const STRIP = { van: 2, space: 1.5, rowH: 2, gap: 2, lead: 0.5 }; // the getaway row, in squares (a space holds six tokens)
const STRIP_W = STRIP.van + STRIP.lead + 5 * STRIP.space + 4 * STRIP.gap; // 18 squares
const STRIP_H = 4;                                         // the heading, the warden's row, the spaces, the labels
const OUT_PAD = 6;                                         // units kept clear of a wall by the places to wait outside

/** Lines of text no wider than `width` units at `size` (the same rough measure as the labels). */
function wrapText(t, width, size) {
  const max = Math.max(4, Math.floor(width / (size * 0.5))), out = []; let cur = "";
  for (const w of String(t).split(" ")) { if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; }
  return cur ? [...out, cur] : out;
}

export function canvasMap(h) {
  const floors = h.map.floors;
  const floorOf = {};
  floors.forEach((f, i) => { for (const k of Object.keys(f.rooms)) floorOf[k] = i; });
  // which sides of each floor have an entrance (a roof light counts as the top: the cats wait on the roof above it)
  const sides = floors.map(() => ({ top: false, bottom: false, left: false, right: false }));
  for (const e of h.entrances) { const side = h.map.entrances[e.key]; sides[floorOf[e.room]][side === "roof" ? "top" : side] = true; }
  const M = (i, side) => (sides[i][side] ? 2 : 1);
  const size = floors.map(f => [Math.max(...Object.values(f.rooms).map(r => r[0] + r[2])), Math.max(...Object.values(f.rooms).map(r => r[1] + r[3]))]);
  // the floors side by side, their tops level
  const top = Math.max(...floors.map((f, i) => M(i, "top")));
  const houseH = Math.max(...floors.map((f, i) => top + size[i][1] + M(i, "bottom")));
  let x = 0;
  const at = floors.map((f, i) => { x += M(i, "left"); const p = x; x += size[i][0] + M(i, "right"); return p; });
  const houseW = x;
  const Wsq = Math.max(houseW, STRIP_W + 2), dx = Math.floor((Wsq - houseW) / 2);
  const keyRows = 1, Hsq = houseH + keyRows + STRIP_H;
  const width = Wsq * U, height = Hsq * U;
  const layout = { floors: at.map(fx => [(fx + dx) * U, top * U]) };

  // the entrance key, under the house: "1 Front door (behind Mr Pell) · 2 …"
  let extra = "";
  const keyY = houseH * U + 26;
  const key = h.entrances.map((e, i) => `${i + 1} ${entranceName(h, e)}`);
  const keyLines = []; let cur = "";
  for (const k of key) { const next = cur ? `${cur}  ·  ${k}` : k; if (cur && textW(next, 16) > width - 2 * U - 130) { keyLines.push(cur); cur = k; } else cur = next; }
  if (cur) keyLines.push(cur);
  extra += `<text x="${U}" y="${keyY}" ${SANS} font-weight="800" font-size="15" letter-spacing="2" fill="${C.accentDeep}">ENTRANCES</text>`;
  keyLines.forEach((ln, i) => { extra += `<text x="${U + 124}" y="${keyY + i * 20}" ${SANS} font-size="16" fill="${C.ink}" xml:space="preserve">${tx(ln)}</text>`; });

  // the getaway row
  const route = h.getaway;
  const sx = Math.floor((Wsq - STRIP_W) / 2) * U, sy = (houseH + keyRows) * U;
  const rowY = sy + 1.5 * U, rowH = STRIP.rowH * U, mid = rowY + rowH / 2;
  const vanBox = { x: sx, y: rowY, w: STRIP.van * U, h: rowH };
  const spaceX = k => sx + (STRIP.van + STRIP.lead) * U + k * (STRIP.space + STRIP.gap) * U;
  const spaces = [0, 1, 2, 3, 4].map(k => ({ x: spaceX(k), y: rowY, w: STRIP.space * U, h: rowH }));
  const wardenAt = r => ({ x: r.x + r.w / 2 - U / 2, y: sy + 0.5 * U, w: U, h: U });
  extra += `<text x="${sx}" y="${sy + 26}" ${SANS} font-weight="800" font-size="18" letter-spacing="2" fill="${C.accentDeep}">THE GETAWAY</text>`;
  extra += `<text x="${sx + 172}" y="${sy + 26}" ${SANS} font-size="15" fill="${C.inkSoft}">${tx("the warden stands above the space he’s on")}</text>`;
  // the van (where pinched cats go), drawn as the book draws it
  extra += `<rect x="${vanBox.x}" y="${vanBox.y}" width="${vanBox.w}" height="${vanBox.h}" rx="10" fill="none" stroke="${C.edge}" stroke-width="3" stroke-dasharray="8 6"/>`;
  extra += van(vanBox.x + vanBox.w / 2 - 4, vanBox.y + vanBox.h - 14, 0.4);
  const label = (r, t) => `<text x="${r.x + r.w / 2}" y="${r.y + r.h + 22}" text-anchor="middle" ${SANS} font-weight="800" font-size="15" letter-spacing="1.5" fill="${C.accentDeep}">${tx(t)}</text>`;
  extra += label(vanBox, "IN THE VAN");
  spaces.forEach((r, k) => {
    extra += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="10" fill="${k === 4 ? C.accentB : C.light}" stroke="${C.ink}" stroke-width="3"/>`;
    if (k === 0) extra += label(r, "THE GARDEN");
    if (k === 4) extra += label(r, "THE HIDEOUT");
  });
  // each obstacle between two spaces: an arrow, its name under it (and the rivals, where they hang about)
  route.forEach((o, k) => {
    const x0 = spaces[k].x + spaces[k].w + 10, x1 = spaces[k + 1].x - 10, cx = (x0 + x1) / 2;
    extra += `<path d="M${x0} ${mid}H${x1 - 4}" stroke="${C.ink}" stroke-width="3"/><path d="M${x1 - 14} ${mid - 9}L${x1} ${mid}L${x1 - 14} ${mid + 9}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    const name = wrapText(o.name, STRIP.gap * U - 4, 15);
    const rivals = h.cred?.patch === k && h.cred?.rivals ? wrapText(`${h.cred.rivals} hang about here`, STRIP.gap * U - 4, 15) : [];
    name.forEach((ln, i) => { extra += `<text x="${cx}" y="${mid + 24 + i * 18}" text-anchor="middle" ${SANS} font-size="15" font-weight="700" fill="${C.ink}">${tx(ln)}</text>`; });
    rivals.forEach((ln, i) => { extra += `<text x="${cx}" y="${mid + 24 + (name.length + i) * 18}" text-anchor="middle" ${SANS} font-size="15" font-style="italic" fill="${C.inkSoft}">${tx(ln)}</text>`; });
  });

  const geo = {};
  const svgText = houseMap(h, { layout, legend: false, extra, width, height, geometry: geo, title: tx(`Floor plan for the table: ${h.name}`) });

  // the places to wait outside each entrance: a band two squares deep along the wall its marker is on
  // (above the room for a roof light), as long as the room's wall, keeping clear of the marker and the floor names
  const entrances = {};
  for (const e of h.entrances) {
    const m = geo.markers[e.key], r = geo.rooms[e.room], fl = geo.floors[floorOf[e.room]];
    const deep = 2 * U - 2 * OUT_PAD;
    let band;
    if (m.side === "top" || m.side === "roof") band = { x: r.x, y: (m.side === "roof" ? fl.y : r.y) - OUT_PAD - deep, w: r.w, h: deep };
    if (m.side === "bottom") band = { x: r.x, y: r.y + r.h + OUT_PAD, w: r.w, h: deep };
    if (m.side === "left") band = { x: r.x - OUT_PAD - deep, y: r.y, w: deep, h: r.h };
    if (m.side === "right") band = { x: r.x + r.w + OUT_PAD, y: r.y, w: deep, h: r.h };
    const avoid = [[m.x - m.r - 8, m.y - m.r - 8, m.x + m.r + 8, m.y + m.r + 8], ...geo.floorLabels];
    entrances[e.key] = { room: e.room, side: m.side, n: m.n, marker: { x: m.x, y: m.y }, outside: { ...band, avoid } };
  }
  const rooms = Object.fromEntries(Object.entries(geo.rooms).map(([k, r]) => [k, { ...r, avoid: [geo.labels[k], ...geo.drawn[k]] }]));
  return {
    svg: svgText,
    geometry: {
      key: h.key, U, width, height, floors: geo.floors, rooms, entrances,
      getaway: { van: vanBox, spaces, warden: spaces.map(wardenAt), wardenVan: wardenAt(vanBox) }
    }
  };
}

/** The tabletop plans by house key (for tools that need them all). */
export const canvasMaps = () => Object.fromEntries(HOUSES.map(h => [h.key, canvasMap(h)]));
