// The scene kit: furniture, prizes and residents, all in one flat front-on
// elevation with a shared floor line, so every scene has one ground plane and
// one eye level (ART-CHECKLIST §4). Every piece stands on the floor (y = floorY)
// or on something drawn under it, and gets a contact shadow (§1–2).
import { C, r1, ell, circ, path, rng, uid, GANG_SIGN } from "./lib.mjs";

const rect = (x, y, w, h, fill, sw = 3, rx = 0, extra = "") =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"${rx ? ` rx="${rx}"` : ""} fill="${fill}"${sw ? ` stroke="${C.ink}" stroke-width="${sw}"` : ""}${extra}/>`;
// A contact shadow lies on the floor: never taller than the skirting board's lowest edge allows (§4).
export const shadowAt = (x, y, rx, op = 0.18) => ell(x, y + 1, rx, Math.min(6, Math.max(3, rx * 0.12)), C.ink, C.ink, 0, ` opacity="${op}"`);

/**
 * The book shows a 3:1 vignette in a chapter-head box that is nearly 4:1, centred, with the SVG's
 * overflow visible (scenes/lib.mjs svg(..., { bleed: true })). So every backdrop (wall, floor, sky,
 * fence, roofs) runs BLEED units past both side edges, and the side bands show more of the same
 * place instead of blank paper. Nothing that matters is drawn in the bleed.
 */
export const BLEED = 170;

/** Room backdrop: wall, skirting board, floorboards to the bottom edge (running BLEED past both sides). */
export function room(w, h, floorY, { wall = C.wall, floor = C.floor, seed = 3, bleed = BLEED } = {}) {
  const x0 = -bleed, x1 = w + bleed, W = x1 - x0;
  let s = rect(x0, 0, W, floorY, wall, 0);
  // faint wallpaper stripes
  let d = "";
  for (let x = 24 - Math.ceil(bleed / 48) * 48; x < x1; x += 48) d += `M${x} 0V${floorY - 14}`;
  s += `<path d="${d}" stroke="${C.wallDeep}" stroke-width="5" opacity="0.35"/>`;
  s += rect(x0, floorY - 14, W, 14, C.light, 0) + path(`M${x0} ${floorY - 14}H${x1}`, "none", C.ink, 2);
  s += rect(x0, floorY, W, h - floorY, floor, 0);
  const R = rng(seed);
  let b = "";
  for (let y = floorY + 16; y < h; y += 16) {
    b += `M${x0} ${y}H${x1}`;
    for (let x = x0 + R() * 120; x < x1; x += 110 + R() * 90) b += `M${r1(x)} ${y - 16}V${y}`;
  }
  s += `<path d="${b}" stroke="${C.floorDeep}" stroke-width="1.6" opacity="0.6"/>`;
  return s + path(`M${x0} ${floorY}H${x1}`, "none", C.ink, 3);
}

/** A window in the wall: frame, panes, sill. night: dark sky outside with a moon. open: the lower sash raised. */
export function windowWall(x, y, w, h, { night = true, open = false } = {}) {
  let s = rect(x - 8, y - 8, w + 16, h + 16, C.light);
  s += rect(x, y, w, h, night ? C.sky : C.accentB, 2.5);
  if (night) s += circ(x + w * 0.72, y + h * 0.28, Math.min(w, h) * 0.12, C.accentB, C.ink, 1.6) + circ(x + w * 0.2, y + h * 0.2, 2, C.accentB) + circ(x + w * 0.42, y + h * 0.12, 1.6, C.accentB);
  const midY = open ? y + h * 0.36 : y + h / 2;
  s += path(`M${x + w / 2} ${y}V${y + h} M${x} ${midY}H${x + w}`, "none", C.ink, 5);
  if (open) s += rect(x, midY - h * 0.18, w, h * 0.18, "none", 3);
  s += rect(x - 14, y + h + 8, w + 28, 10, C.light, 2.5); // sill, fixed to the wall
  return s;
}

/**
 * The book's scale (ART-CHECKLIST §12), in the interior vignettes' units (900×300, floor at y = 262):
 * a gang cat is drawn at s = SCALE.cat (a sitting adult is about 74 tall; Pip and Pom-Pom are scaled by
 * their looks), a kitchen counter is 150 tall, a table 120, a chair seat 86. A door is SCALE.door tall,
 * so its top always runs out of the top of the frame like the humans' legs: no visible part of a person
 * is ever taller than a door.
 */
export const SCALE = { cat: 0.26, counter: 150, table: 120, door: 330, doorW: 150 };

/** A door in the wall, standing on the floor. ajar 0..1 shows a dark gap. catFlap draws a flap at the bottom. */
export function door(x, floorY, w = 110, h = 230, { col = C.wood, ajar = 0, catFlap = false } = {}) {
  const y = floorY - h;
  let s = rect(x - 8, y - 8, w + 16, h + 8, C.light, 3);
  if (ajar) s += rect(x, y, w * ajar, h, C.deep, 0);
  s += rect(x + w * ajar, y, w * (1 - ajar), h, col, 3);
  const dx = x + w * ajar, dw = w * (1 - ajar);
  if (dw > 30) {
    s += rect(dx + dw * 0.14, y + h * 0.1, dw * 0.72, h * 0.34, "none", 2.2) + rect(dx + dw * 0.14, y + h * 0.52, dw * 0.72, h * 0.34, "none", 2.2);
    s += circ(dx + dw * 0.84, y + h * 0.52, 5, C.accent, C.ink, 2);
    if (catFlap) s += rect(dx + dw * 0.5 - 22, floorY - 52, 44, 40, C.woodDeep, 2.5, 4) + path(`M${dx + dw * 0.5 - 22} ${floorY - 44}H${dx + dw * 0.5 + 22}`, "none", C.ink, 2);
  }
  return s;
}

/** Kitchen counter on the floor: cupboards and a worktop at height h. Returns { svg, top } (top = worktop y). */
export function counter(x, floorY, w, h = 150) {
  const y = floorY - h;
  let s = rect(x, y + 14, w, h - 14, C.light, 3);
  const n = Math.max(1, Math.round(w / 90));
  for (let i = 0; i < n; i++) {
    const cx = x + (w / n) * i;
    s += rect(cx + 8, y + 26, w / n - 16, h - 46, C.paper2, 2.2, 3);
    s += path(`M${cx + w / n / 2 - 10} ${y + 40}h20`, "none", C.ink, 3.5);
  }
  s += rect(x - 10, y, w + 20, 16, C.woodDeep, 3); // worktop
  return { svg: s, top: y };
}

/** A table: top at height h, two legs on the floor (the other two hidden behind them). */
export function table(x, floorY, w, h = 120, { cloth = null } = {}) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.5);
  s += rect(x + 14, y + 10, 14, h - 10, C.woodDeep, 3) + rect(x + w - 28, y + 10, 14, h - 10, C.woodDeep, 3);
  s += rect(x, y, w, 14, C.wood, 3);
  if (cloth) s += path(`M${x - 6} ${y - 2}H${x + w + 6}L${x + w + 2} ${y + 34}Q${x + w / 2} ${y + 44} ${x - 2} ${y + 34}Z`, cloth, C.ink, 3);
  return { svg: s, top: y };
}

/** A sofa on the floor, with an armrest at each end. Returns { svg, seat } (seat y). */
export function sofa(x, floorY, w = 300, { col = C.dark } = {}) {
  let s = shadowAt(x + w / 2, floorY, w * 0.5);
  s += rect(x + 18, floorY - 14, 14, 14, C.woodDeep, 2) + rect(x + w - 32, floorY - 14, 14, 14, C.woodDeep, 2);
  s += rect(x + 20, floorY - 150, w - 40, 80, col, 3, 16); // back
  s += rect(x + 10, floorY - 84, w - 20, 70, col, 3, 10);  // seat base
  s += rect(x + 40, floorY - 96, (w - 80) / 2, 22, C.soft, 3, 8) + rect(x + w / 2, floorY - 96, (w - 80) / 2, 22, C.soft, 3, 8); // cushions
  s += rect(x, floorY - 112, 44, 98, col, 3, 14) + rect(x + w - 44, floorY - 112, 44, 98, col, 3, 14); // armrests
  return { svg: s, seat: floorY - 96 };
}

/** A fridge on the floor. Returns { svg, top }. */
export function fridge(x, floorY, w = 120, h = 280) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.5);
  s += rect(x, y, w, h, C.light, 3, 10) + path(`M${x} ${y + h * 0.36}H${x + w}`, "none", C.ink, 3);
  s += path(`M${x + w - 18} ${y + 30}v40 M${x + w - 18} ${y + h * 0.42}v60`, "none", C.ink, 5);
  return { svg: s, top: y };
}

/** A pedal bin on the floor. */
export function bin(x, floorY, w = 64, h = 90) {
  let s = shadowAt(x + w / 2, floorY, w * 0.55);
  s += path(`M${x} ${floorY - h + 14}L${x + 6} ${floorY}H${x + w - 6}L${x + w} ${floorY - h + 14}Z`, C.grey, C.ink, 3);
  s += rect(x - 4, floorY - h, w + 8, 16, C.greyDeep, 3, 6) + rect(x + w / 2 - 10, floorY - 8, 20, 8, C.ink, 0);
  return s;
}

/** A potted plant on the floor (or on a surface at y = base). */
export function plant(x, base, s = 1) {
  const k = v => r1(v * s), rim = base - 46 * s, soil = rim + 6 * s;
  let g = shadowAt(x, base, 26 * s);
  // the soil, seen just inside the pot's rim; every stem grows out of it
  g += path(`M${x - k(20)} ${r1(soil)}Q${x} ${r1(soil - 8 * s)} ${x + k(20)} ${r1(soil)}Z`, C.brownDeep, C.ink, 2);
  // each leaf sits on its own stem: the stem runs from the soil to the leaf's base
  const leaves = [[-34, -118, -30], [0, -140, 0], [32, -114, 30], [-30, -84, -62], [30, -80, 62]];
  for (const [dx, dy, a] of leaves) {
    const lx = x + dx * s, ly = base + dy * s, rad = a * Math.PI / 180;
    const bx = lx - Math.sin(rad) * 28 * s, by = ly + Math.cos(rad) * 28 * s; // the leaf's base (its lower tip)
    g += path(`M${r1(x + dx * 0.15 * s)} ${r1(soil - 2 * s)}Q${r1(x + dx * 0.3 * s)} ${r1((soil + by) / 2)} ${r1(bx)} ${r1(by)}`, "none", C.leafDeep, Math.max(2, 4 * s));
  }
  for (const [dx, dy, a] of leaves)
    g += ell(x + dx * s, base + dy * s, 12 * s, 30 * s, C.leaf, C.ink, 2.6, ` transform="rotate(${a} ${r1(x + dx * s)} ${r1(base + dy * s)})"`) +
      path(`M${r1(x + dx * s)} ${r1(base + dy * s + 24 * s)}V${r1(base + dy * s - 20 * s)}`, "none", C.leafDeep, 1.6, ` transform="rotate(${a} ${r1(x + dx * s)} ${r1(base + dy * s)})"`);
  // the pot, in front of the stems' feet
  g += path(`M${x - 24 * s} ${r1(rim)}H${x + 24 * s}L${x + 18 * s} ${base}H${x - 18 * s}Z`, C.brick, C.ink, 3) + path(`M${x - 25 * s} ${r1(rim)}H${x + 25 * s}`, "none", C.ink, 3);
  return g;
}

/** A floor lamp on the floor with a warm glow. */
export function lamp(x, floorY, h = 260) {
  let s = circ(x, floorY - h + 10, 120, C.accentB, C.ink, 0, ` opacity="0.35"`);
  s += shadowAt(x, floorY, 34) + ell(x, floorY - 6, 32, 8, C.woodDeep, C.ink, 3);
  s += rect(x - 4, floorY - h + 30, 8, h - 34, C.woodDeep, 2.4);
  s += path(`M${x - 40} ${floorY - h + 40}L${x - 26} ${floorY - h - 10}H${x + 26}L${x + 40} ${floorY - h + 40}Z`, C.accent, C.ink, 3);
  return s;
}

/** A rug lying flat on the floor (a thin ellipse at the scene's eye level). */
export const rug = (x, floorY, rx, col = C.leafDeep) => ell(x, floorY + 22, rx, rx * 0.12, col, C.ink, 2.6) + ell(x, floorY + 22, rx * 0.8, rx * 0.08, "none", C.accentB, 2);

// ---------------------------------------------------------------- prizes
/**
 * A plate seen from the side (the scenes are flat elevations), standing on a surface at y = top:
 * a low dish, its foot on the surface, its rim a little wider. It lies wholly on the surface: keep
 * x ± w inside the surface's length. Returns the plate's top (where food rests).
 */
export function plate(x, top, w, col = C.light) {
  const h = Math.max(4, w * 0.11);
  return { svg: path(`M${r1(x - w)} ${r1(top - h)}H${r1(x + w)}L${r1(x + w * 0.72)} ${r1(top)}H${r1(x - w * 0.72)}Z`, col, C.ink, 2.4), top: top - h };
}
/** A bone end, as on a drumstick: two round knobs side by side. */
const knob = (x, y, r, a = 0) => `<g transform="rotate(${a} ${r1(x)} ${r1(y)})">${circ(x - r * 0.62, y, r, C.light, C.ink, 2.2)}${circ(x + r * 0.62, y, r, C.light, C.ink, 2.2)}</g>`;
/**
 * The book's one roast chicken (cover, part pages, every kitchen): a plump golden body lying breast
 * up, two meaty drumsticks rising from its back end, each ending in a white double-knobbed bone, on a
 * plate on a surface at y = top. The far drumstick is behind the body, in the deep tone.
 */
export function chicken(x, top, s = 1, { foil = false } = {}) {
  const p = plate(x, top, 58 * s);
  const b = p.top, k = v => v * s;
  // the far drumstick, behind the body
  let g = path(`M${r1(x + k(14))} ${r1(b - k(40))}Q${r1(x + k(22))} ${r1(b - k(66))} ${r1(x + k(36))} ${r1(b - k(70))}L${r1(x + k(42))} ${r1(b - k(64))}Q${r1(x + k(36))} ${r1(b - k(46))} ${r1(x + k(34))} ${r1(b - k(30))}Z`, C.gingerDeep, C.ink, 2.6) + knob(x + k(40), b - k(72), k(5.5), 30);
  g += ell(x - k(4), b - k(25), k(46), k(26), C.ginger, C.ink, 3); // the body
  g += ell(x - k(18), b - k(36), k(14), k(7), C.accentB, C.ink, 0, ` opacity="0.7"`) + path(`M${r1(x - k(40))} ${r1(b - k(14))}Q${r1(x - k(6))} ${r1(b - k(4))} ${r1(x + k(30))} ${r1(b - k(16))}`, "none", C.gingerDeep, 2.4);
  g += path(`M${r1(x - k(30))} ${r1(b - k(30))}q${r1(k(10))} ${r1(k(12))} ${r1(k(24))} ${r1(k(8))}`, "none", C.gingerDeep, 2.6); // the tucked wing
  // the near drumstick: meat swelling out of the body's back end, up to its bone
  g += path(`M${r1(x + k(20))} ${r1(b - k(20))}Q${r1(x + k(28))} ${r1(b - k(58))} ${r1(x + k(50))} ${r1(b - k(62))}L${r1(x + k(56))} ${r1(b - k(54))}Q${r1(x + k(50))} ${r1(b - k(30))} ${r1(x + k(40))} ${r1(b - k(12))}Z`, C.gingerDeep, C.ink, 2.8) + knob(x + k(55), b - k(64), k(6), 35);
  if (foil) { // the foil it came home in, peeled open and crumpled round the bird's lower half
    const fy = b - k(18);
    g += path(`M${r1(x - k(54))} ${r1(b)}L${r1(x - k(56))} ${r1(fy - k(4))}l${r1(k(8))} ${r1(k(6))}l${r1(k(8))} ${r1(-k(8))}l${r1(k(10))} ${r1(k(7))}l${r1(k(10))} ${r1(-k(6))}l${r1(k(12))} ${r1(k(8))}l${r1(k(10))} ${r1(-k(7))}l${r1(k(12))} ${r1(k(6))}l${r1(k(10))} ${r1(-k(8))}l${r1(k(14))} ${r1(k(9))}L${r1(x + k(54))} ${r1(b)}Z`, C.whiteDeep, C.ink, 2.4);
    g += path(`M${r1(x - k(40))} ${r1(b - k(3))}l${r1(k(6))} ${r1(-k(8))} M${r1(x - k(6))} ${r1(b - k(2))}l${r1(k(4))} ${r1(-k(9))} M${r1(x + k(26))} ${r1(b - k(3))}l${r1(k(5))} ${r1(-k(8))}`, "none", C.light, 2);
  }
  return g + p.svg; // the dish's rim in front of the bird's underside
}
/** Wall tiles (a splashback) behind a worktop: a light panel of square tiles, from y up h. */
export function tiles(x, y, w, h, t = 22) {
  let s = rect(x, y - h, w, h, C.light, 2.4);
  let d = "";
  for (let xx = x + t; xx < x + w - 2; xx += t) d += `M${xx} ${y - h}V${y}`;
  for (let yy = y - t; yy > y - h + 2; yy -= t) d += `M${x} ${yy}H${x + w}`;
  return s + path(d, "none", C.edge, 1.6);
}
/** A sink's mixer tap standing on the worktop at y = top (the basin is sunk into the worktop, out of sight). */
export function tap(x, top) {
  return rect(x - 14, top - 4, 28, 4, C.grey, 2, 2) + path(`M${x} ${top - 4}V${top - 34}Q${x} ${top - 44} ${x + 12} ${top - 44}H${x + 20}V${top - 36}`, "none", C.ink, 7) +
    path(`M${x} ${top - 4}V${top - 34}Q${x} ${top - 44} ${x + 12} ${top - 44}H${x + 20}V${top - 36}`, "none", C.grey, 3.4) + rect(x - 4, top - 30, 8, 6, C.grey, 1.6, 2);
}
/** An electric kettle standing on its base on the worktop at y = top. */
export function kettle(x, top, col = C.eyeBlue) {
  let s = rect(x - 22, top - 6, 44, 6, C.ink, 0, 2);
  s += path(`M${x - 18} ${top - 6}L${x - 15} ${top - 46}Q${x} ${top - 52} ${x + 15} ${top - 46}L${x + 18} ${top - 6}Z`, col, C.ink, 2.6);
  s += path(`M${x + 16} ${top - 40}q14 2 12 16q-2 10 -10 10`, "none", C.ink, 5) + path(`M${x - 16} ${top - 40}l-10 -6`, "none", C.ink, 4); // handle, spout
  return s + rect(x - 6, top - 54, 12, 5, C.ink, 0, 2);
}

/** A big cardboard box standing on the floor (flaps open). */
export function box(x, floorY, w = 170, h = 120) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.55);
  s += path(`M${x + 2} ${y}L${x + 10} ${y - 12}H${x + w - 10}L${x + w - 2} ${y}Z`, C.wood, C.ink, 2.4); // the inside of the back wall, in shadow
  s += rect(x, y, w, h, C.creamDeep, 3);
  s += path(`M${x} ${y}L${x - 24} ${y - 34}L${x + w * 0.3} ${y - 30}L${x + w * 0.42} ${y}Z`, C.cream, C.ink, 3);
  s += path(`M${x + w} ${y}L${x + w + 22} ${y - 30}L${x + w * 0.66} ${y - 34}L${x + w * 0.56} ${y}Z`, C.cream, C.ink, 3);
  s += rect(x + w * 0.4, y + 2, w * 0.2, h - 4, C.cream, 0, 0, ` opacity="0.7"`); // tape
  s += path(`M${x + 16} ${y + h - 30}h40 M${x + 16} ${y + h - 20}h26`, "none", C.ink, 2);
  return s;
}
/**
 * A felt toy mouse lying on a surface at y = top, facing +x: a teardrop body on the surface, a round
 * ear, an eye, a pink nose, and a string tail lying along the surface. About a quarter of a sitting
 * cat's height at s = 1 beside a cat at the vignette scale.
 */
export function toyMouse(x, top, s = 1) {
  const k = v => r1(v * s);
  let g = shadowAt(x, top, 18 * s);
  g += path(`M${r1(x - k(16))} ${r1(top)}Q${r1(x - k(18))} ${r1(top - k(16))} ${r1(x - k(2))} ${r1(top - k(16))}Q${r1(x + k(12))} ${r1(top - k(14))} ${r1(x + k(20))} ${r1(top - k(4))}L${r1(x + k(18))} ${r1(top)}Z`, C.brick, C.ink, 2.2);
  g += circ(x + k(4), top - k(16), k(5), C.brick, C.ink, 2) + circ(x + k(4), top - k(16), k(2.4), C.pink); // ear
  g += circ(x + k(11), top - k(9), k(1.6), C.ink) + circ(x + k(20), top - k(4), k(2), C.pinkDeep, C.ink, 1);
  g += path(`M${r1(x - k(16))} ${r1(top - k(2))}Q${r1(x - k(28))} ${r1(top - k(1))} ${r1(x - k(34))} ${r1(top)}H${r1(x - k(44))}`, "none", C.ink, 1.8); // the string tail, on the surface
  return g;
}

// ---------------------------------------------------------------- humans (from a cat's eye level)
/**
 * A human's legs and lower body from the floor up to the top of the frame — the way a cat sees
 * them. Two legs, two shoes flat on the floor. o: { x, floorY, top, trousers, shoe, walking }
 */
export function legs(o) {
  const { x, floorY, top = 0, trousers = C.dark, shoe = C.woodDeep, walking = 0, w = 46 } = o;
  let s = shadowAt(x, floorY, 70);
  for (const side of [-1, 1]) {
    const fx = x + side * (28 + walking * 30);
    const hipX = x + side * 26;
    s += path(`M${hipX - w / 2} ${top}L${fx - w / 2 + 4} ${floorY - 26}H${fx + w / 2 - 4}L${hipX + w / 2} ${top}Z`, trousers, C.ink, 3);
    s += path(`M${fx - w / 2 - 2} ${floorY}V${floorY - 24}Q${fx} ${floorY - 32} ${fx + w / 2 + side * 0} ${floorY - 24}L${fx + w / 2 + 28 * (side > 0 ? 1 : 0.4)} ${floorY - 10}V${floorY}Z`, shoe, C.ink, 3);
  }
  return s;
}

/**
 * A wall shelf with jars standing on it, on two brackets screwed to the wall. Seen from the front, each
 * bracket is a tapering upright strut under the shelf (its arm runs back under the board, out of sight),
 * fixed with two screws.
 */
export function shelf(x, y, w, items = 3) {
  let s = "";
  for (const bx of [x + 18, x + w - 18]) s += path(`M${bx - 5} ${y + 10}H${bx + 5}L${bx + 3} ${y + 40}H${bx - 3}Z`, C.greyDeep, C.ink, 2.2) + circ(bx, y + 18, 1.6, C.light) + circ(bx, y + 32, 1.6, C.light);
  s += `<rect x="${x}" y="${y}" width="${w}" height="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.6"/>`;
  const cols = [C.leaf, C.accent, C.eyeBlue, C.brown];
  for (let i = 0; i < items; i++) {
    const jx = x + 18 + i * ((w - 36) / Math.max(1, items - 1)) - 10;
    s += `<rect x="${jx}" y="${y - 30}" width="22" height="30" rx="4" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>` +
      `<rect x="${jx - 1}" y="${y - 36}" width="24" height="8" rx="2" fill="${cols[i % 4]}" stroke="${C.ink}" stroke-width="2"/>`;
  }
  return s;
}
/** A round wall clock hanging on a nail. */
export function wallClock(x, y, r = 22) {
  return circ(x, y - r - 4, 2.4, C.ink) + path(`M${x} ${y - r - 4}l0 4`, "none", C.ink, 2) +
    circ(x, y, r, C.light, C.ink, 3) + path(`M${x} ${y}l0 ${-r * 0.65} M${x} ${y}l${r * 0.45} ${r * 0.2}`, "none", C.ink, 2.6);
}

// ---------------------------------------------------------------- outside, at night
/** Night sky band with a moon and a few stars. */
export function nightSky(w, h, seed = 5, bleed = 0) {
  const R = rng(seed);
  let s = `<rect x="${-bleed}" width="${w + 2 * bleed}" height="${h}" fill="${C.deep}"/>`;
  for (let i = 0; i < 26; i++) s += circ(R() * w, R() * h * 0.6, 1 + R() * 1.6, C.accentB, C.ink, 0, ` opacity="${r1(0.5 + R() * 0.5)}"`);
  const R2 = rng(seed + 101); // a few more stars in the side bands
  if (bleed) for (let i = 0; i < 12; i++) { const side = i % 2 ? w : -bleed; s += circ(side + R2() * bleed, R2() * h * 0.6, 1 + R2() * 1.6, C.accentB, C.ink, 0, ` opacity="${r1(0.5 + R2() * 0.5)}"`); }
  return s;
}
export const moon = (x, y, r = 24) => circ(x, y, r + 14, C.accentB, C.ink, 0, ` opacity="0.15"`) + circ(x, y, r, C.accentB, C.ink, 2.4) + circ(x - r * 0.3, y - r * 0.2, r * 0.18, C.cream);

/** Brick wall rectangle (a house front or a garden wall). coping: a stone strip on top. */
export function bricks(x, y, w, h, { coping = false, col = C.brick, seed = 2 } = {}) {
  const R = rng(seed);
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="${C.ink}" stroke-width="3"/>`;
  let d = "";
  for (let r = 0, yy = y + 14; yy < y + h; yy += 14, r++) {
    d += `M${x} ${yy}H${x + w}`;
    for (let xx = x + (r % 2) * 18 + 6; xx < x + w; xx += 36) d += `M${r1(xx)} ${yy - 14}V${yy}`;
  }
  s += `<path d="${d}" stroke="${C.brickDeep}" stroke-width="1.6" opacity="0.7"/>`;
  for (let i = 0; i < w * h / 2200; i++) s += `<rect x="${r1(x + R() * (w - 30))}" y="${r1(y + Math.floor(R() * (h / 14)) * 14 + 2)}" width="30" height="10" fill="${C.brickDeep}" opacity="0.35"/>`;
  if (coping) s += `<rect x="${x - 8}" y="${y - 12}" width="${w + 16}" height="14" fill="${C.edge}" stroke="${C.ink}" stroke-width="3"/>`;
  return s;
}

/** A lit window in a house front (warm glow, curtains tied back). */
export function litWindow(x, y, w, h) {
  let s = `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2.4"/>`;
  s += path(`M${x} ${y}Q${x + w * 0.22} ${y + h * 0.4} ${x + w * 0.1} ${y + h}H${x}Z M${x + w} ${y}Q${x + w * 0.78} ${y + h * 0.4} ${x + w * 0.9} ${y + h}H${x + w}Z`, C.accentDeep, C.ink, 2.4);
  s += path(`M${x + w / 2} ${y}V${y + h}`, "none", C.ink, 4);
  s += `<rect x="${x - 12}" y="${y + h + 6}" width="${w + 24}" height="10" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`;
  return s;
}

/** A street lamp standing on the pavement, with its pool of light. */
export function streetLamp(x, groundY, h = 250) {
  const id = uid("lampglow"); // the one gradient the house style allows: a lamp glow
  let s = `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${C.accentB}" stop-opacity="0.6"/><stop offset="0.45" stop-color="${C.accentB}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.accentB}" stop-opacity="0"/></radialGradient></defs>`;
  s += circ(x, groundY - h + 8, Math.min(150, h * 0.5), `url(#${id})`);
  s += ell(x, groundY + 4, 110, 14, C.accent, C.ink, 0, ` opacity="0.3"`); // its pool of light on the ground
  s += `<rect x="${x - 6}" y="${groundY - h + 20}" width="12" height="${h - 20}" fill="${C.ink}"/>`;
  s += `<rect x="${x - 16}" y="${groundY - 14}" width="32" height="14" fill="${C.ink}"/>`;
  s += path(`M${x - 26} ${groundY - h + 22}L${x - 16} ${groundY - h - 6}H${x + 16}L${x + 26} ${groundY - h + 22}Z`, C.accentB, C.ink, 3);
  s += `<rect x="${x - 30}" y="${groundY - h + 20}" width="60" height="8" fill="${C.ink}"/>`;
  return s;
}

/**
 * A wheelie bin on the pavement: the wheel at the back (left) and a moulded foot at the front (right)
 * both stand on the ground; the lid on its hinge, a handle at the back. h: the body's height.
 */
export function wheelieBin(x, groundY, col = C.leafDeep, h = 110) {
  let s = shadowAt(x + 34, groundY, 42);
  s += path(`M${x} ${groundY - h}L${x + 8} ${groundY - 10}H${x + 60}L${x + 68} ${groundY - h}Z`, col, C.ink, 3);
  s += path(`M${x + 44} ${groundY - 10}V${groundY}H${x + 62}L${x + 60} ${groundY - 10}Z`, col, C.ink, 2.6); // the front foot, on the ground
  s += path(`M${x + 6} ${groundY - h + 30}H${x + 62} M${x + 8} ${groundY - h + 40}H${x + 60}`, "none", C.ink, 1.6, ` opacity="0.4"`);
  s += `<rect x="${x - 6}" y="${groundY - h - 12}" width="80" height="14" rx="4" fill="${col}" stroke="${C.ink}" stroke-width="3"/>`;
  s += `<rect x="${x - 12}" y="${groundY - h - 8}" width="10" height="8" rx="2" fill="${C.ink}"/>`; // the handle at the back
  s += circ(x + 14, groundY - 10, 10, C.ink) + circ(x + 14, groundY - 10, 4, C.grey);
  return s;
}

/**
 * A grown-up seen from behind (no face to get wrong), walking away: hair, coat, two legs, two shoes on
 * the ground, one arm carrying a shopping bag whose handles hide the hand. o: { x, groundY, s, coat, bag }
 */
export function humanBack(o) {
  const { x, groundY, s = 1, coat = C.dark, trousers = C.dark, hair = C.brownDeep, bagCol = C.light, bag = true } = o;
  const k = (v) => r1(v * s);
  const gy = groundY;
  let g = shadowAt(x, gy, 46 * s);
  // legs and shoes (both feet on the ground, one a little ahead)
  for (const [dx, lift] of [[-12, 0], [12, 0]]) {
    g += `<path d="M${r1(x + dx * s - 9 * s)} ${r1(gy - 96 * s)}L${r1(x + dx * s - 8 * s)} ${r1(gy - 10 * s)}H${r1(x + dx * s + 8 * s)}L${r1(x + dx * s + 9 * s)} ${r1(gy - 96 * s)}Z" fill="${trousers}" stroke="${C.ink}" stroke-width="3"/>`;
    g += ell(x + dx * s, gy - 6 * s - lift, 12 * s, 7 * s, C.ink);
  }
  // coat
  g += `<path d="M${r1(x - 30 * s)} ${r1(gy - 210 * s)}Q${r1(x - 36 * s)} ${r1(gy - 140 * s)} ${r1(x - 34 * s)} ${r1(gy - 90 * s)}H${r1(x + 34 * s)}Q${r1(x + 36 * s)} ${r1(gy - 140 * s)} ${r1(x + 30 * s)} ${r1(gy - 210 * s)}Q${x} ${r1(gy - 222 * s)} ${r1(x - 30 * s)} ${r1(gy - 210 * s)}Z" fill="${coat}" stroke="${C.ink}" stroke-width="3"/>`;
  g += `<path d="M${x} ${r1(gy - 150 * s)}V${r1(gy - 92 * s)}" stroke="${C.ink}" stroke-width="2"/>`;
  // the arms (two), each ending in a hand seen from the back: knuckles, finger creases, the thumb tip on the inner side
  const arm = (x0, cx, x1, y1) => `<path d="M${r1(x0)} ${r1(gy - 205 * s)}Q${r1(cx)} ${r1(gy - 160 * s)} ${r1(x1)} ${r1(y1)}" fill="none" stroke="${C.ink}" stroke-width="${k(15)}" stroke-linecap="round"/>` +
    `<path d="M${r1(x0)} ${r1(gy - 205 * s)}Q${r1(cx)} ${r1(gy - 160 * s)} ${r1(x1)} ${r1(y1)}" fill="none" stroke="${coat}" stroke-width="${k(9)}" stroke-linecap="round"/>`;
  const hand = (hx, hy, inner, fist) => { // inner: -1 when the body is to the hand's left, +1 to its right
    let h = path(`M${r1(hx + inner * 3 * s)} ${r1(hy - 2 * s)}q${r1(inner * 4 * s)} ${r1(2 * s)} ${r1(inner * 3 * s)} ${r1(7 * s)}`, C.cream, C.ink, 2); // thumb tip
    h += `<rect x="${r1(hx - 6.5 * s)}" y="${r1(hy - 6 * s)}" width="${r1(13 * s)}" height="${r1((fist ? 13 : 16) * s)}" rx="${r1(5 * s)}" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.2"/>`;
    const fy = hy + (fist ? 2 : 4) * s; // the creases between the four fingers
    h += path(`M${r1(hx - 3.2 * s)} ${r1(fy)}v${r1(4.5 * s)} M${r1(hx)} ${r1(fy)}v${r1(5 * s)} M${r1(hx + 3.2 * s)} ${r1(fy)}v${r1(4.5 * s)}`, "none", C.ink, 1.3);
    if (fist) h += path(`M${r1(hx - 6 * s)} ${r1(hy + 1 * s)}h${r1(12 * s)}`, "none", C.ink, 1.3); // the knuckle line of a closed hand
    return h;
  };
  g += arm(x - 30 * s, x - 42 * s, x - 34 * s, gy - 126 * s) + hand(x - 34 * s, gy - 122 * s, 1, false); // left arm hanging, hand relaxed
  if (bag) {
    // the bag's two handles rise from its rim into the closed right hand, which grips them
    g += `<path d="M${r1(x + 30 * s)} ${r1(gy - 104 * s)}Q${r1(x + 34 * s)} ${r1(gy - 122 * s)} ${r1(x + 42 * s)} ${r1(gy - 126 * s)} M${r1(x + 54 * s)} ${r1(gy - 104 * s)}Q${r1(x + 50 * s)} ${r1(gy - 122 * s)} ${r1(x + 43 * s)} ${r1(gy - 126 * s)}" fill="none" stroke="${C.ink}" stroke-width="${k(4)}"/>`;
    g += path(`M${r1(x + 52 * s)} ${r1(gy - 110 * s)}l${r1(5 * s)} ${r1(-9 * s)}`, "none", C.gingerDeep, k(6)) + knob(x + 58 * s, gy - 121 * s, 3 * s, 30); // a drumstick sticking up out of the bag
    g += ell(x + 42 * s, gy - 106 * s, 13 * s, 8 * s, C.ginger, C.ink, 2.4); // the chicken inside, its top showing
    g += `<path d="M${r1(x + 22 * s)} ${r1(gy - 104 * s)}H${r1(x + 62 * s)}L${r1(x + 58 * s)} ${r1(gy - 56 * s)}H${r1(x + 26 * s)}Z" fill="${bagCol}" stroke="${C.ink}" stroke-width="3"/>`;
    g += arm(x + 30 * s, x + 44 * s, x + 42 * s, gy - 134 * s) + hand(x + 42 * s, gy - 130 * s, -1, true);
  } else g += arm(x + 30 * s, x + 42 * s, x + 34 * s, gy - 126 * s) + hand(x + 34 * s, gy - 122 * s, -1, false);
  // head from behind: hair, two ears
  g += ell(x - 22 * s, gy - 236 * s, 5 * s, 8 * s, C.cream, C.ink, 2.4) + ell(x + 22 * s, gy - 236 * s, 5 * s, 8 * s, C.cream, C.ink, 2.4);
  g += circ(x, gy - 242 * s, 23 * s, hair, C.ink, 3);
  return g;
}

/**
 * A die standing on a surface, seen a little from above and to the left: its front face (the pips
 * given), its top face and its right side, so it sits in the same view as the floor and rugs (§4).
 */
export function die(x, base, size, face, col = C.light) {
  const y = base - size, dx = size * 0.26, dy = size * 0.2;
  let s = shadowAt(x + size / 2 + dx / 2, base, size * 0.66);
  const pipsOf = f => ({ 1: ["c"], 2: ["tl", "br"], 3: ["tl", "c", "br"], 4: ["tl", "tr", "bl", "br"], 5: ["tl", "tr", "c", "bl", "br"], 6: ["tl", "tr", "ml", "mr", "bl", "br"] }[f]);
  const grid = { tl: [-1, -1], tr: [1, -1], ml: [-1, 0], mr: [1, 0], bl: [-1, 1], br: [1, 1], c: [0, 0] };
  // top face (a parallelogram leaning back) and right side, then the front face over their edges
  s += path(`M${r1(x)} ${r1(y)}L${r1(x + dx)} ${r1(y - dy)}H${r1(x + size + dx)}L${r1(x + size)} ${r1(y)}Z`, C.paper2, C.ink, 3);
  s += path(`M${r1(x + size)} ${r1(y)}L${r1(x + size + dx)} ${r1(y - dy)}V${r1(base - dy)}L${r1(x + size)} ${r1(base)}Z`, C.edge, C.ink, 3);
  s += `<rect x="${r1(x)}" y="${r1(y)}" width="${size}" height="${size}" rx="${r1(size * 0.12)}" fill="${col}" stroke="${C.ink}" stroke-width="3"/>`;
  const p = size * 0.26, c = [x + size / 2, y + size / 2];
  for (const k of pipsOf(face)) s += circ(c[0] + grid[k][0] * p, c[1] + grid[k][1] * p, size * 0.08, C.ink);
  // the top face's pips, squashed into its slant
  const top = face === 2 || face === 5 ? 1 : face === 3 || face === 4 ? 2 : 3, tc = [x + size / 2 + dx / 2, y - dy / 2];
  for (const k of pipsOf(top)) s += ell(tc[0] + grid[k][0] * p * 0.9 + grid[k][1] * dx * 0.22, tc[1] + grid[k][1] * dy * 0.26, size * 0.07, size * 0.04, C.ink);
  return s;
}

/** A drinking glass standing on a surface (half full). */
export function glass(x, base, h = 46) {
  return shadowAt(x, base, 14) + path(`M${x - 13} ${base - h}L${x - 10} ${base}H${x + 10}L${x + 13} ${base - h}Z`, C.light, C.ink, 2.6) +
    path(`M${x - 11.5} ${base - h * 0.5}L${x - 10} ${base}H${x + 10}L${x + 11.5} ${base - h * 0.5}Z`, C.eyeBlue, C.ink, 0, ` opacity="0.6"`);
}

/** A broom standing upright on its bristles against the wall, its handle held by a clip screwed to the wall. */
export function broom(x, floorY, h = 210) {
  let s = shadowAt(x, floorY, 34);
  s += `<rect x="${x - 4}" y="${floorY - h}" width="8" height="${h - 50}" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2"/>`;
  s += `<rect x="${x - 12}" y="${floorY - h + 16}" width="24" height="10" rx="3" fill="${C.grey}" stroke="${C.ink}" stroke-width="2.2"/>` + circ(x - 8, floorY - h + 21, 1.8, C.ink) + circ(x + 8, floorY - h + 21, 1.8, C.ink); // wall clip
  s += path(`M${x - 18} ${floorY - 56}H${x + 18}L${x + 34} ${floorY}H${x - 34}Z`, C.accent, C.ink, 3);
  let d = ""; for (let i = -28; i <= 28; i += 8) d += `M${x + i * 0.5} ${floorY - 50}L${x + i} ${floorY - 2}`;
  return s + path(d, "none", C.accentDeep, 1.6) + `<rect x="${x - 20}" y="${floorY - 62}" width="40" height="10" rx="3" fill="${C.alarm}" stroke="${C.ink}" stroke-width="2.4"/>`;
}

/** A cushion lying on the floor, pink (Cuddle). */
export const cushion = (x, floorY, w = 90) => shadowAt(x, floorY, w * 0.5) +
  path(`M${x - w / 2} ${floorY - 4}Q${x - w / 2 - 6} ${floorY - 34} ${x - w / 2 + 6} ${floorY - 40}Q${x} ${floorY - 46} ${x + w / 2 - 6} ${floorY - 40}Q${x + w / 2 + 6} ${floorY - 34} ${x + w / 2} ${floorY - 4}Q${x} ${floorY + 2} ${x - w / 2} ${floorY - 4}Z`, C.pink, C.ink, 3) +
  circ(x, floorY - 22, 4, C.cuddle, C.ink, 1.8);

/** A height chart painted on the wall (police line-up joke), with marks every 30 units. */
export function heightChart(w, floorY, top) {
  let s = `<rect x="0" y="${top}" width="${w}" height="${floorY - top}" fill="${C.light}"/>`;
  let d = "";
  for (let y = floorY - 30; y > top; y -= 30) d += `M0 ${y}H${w}`;
  s += path(d, "none", C.edge, 2);
  return s;
}

/** A wooden fence top rail (a run of planks), standing on the ground. */
export function fence(x, groundY, w, h) {
  let s = "";
  for (let px = x; px < x + w; px += 34) s += `<rect x="${px}" y="${groundY - h}" width="30" height="${h}" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.6"/>`;
  s += `<rect x="${x - 6}" y="${groundY - h - 10}" width="${w + 12}" height="12" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2.6"/>`;
  return s;
}

// ---------------------------------------------------------------- more furniture and props
const box4 = (x0, y0, x1, y1, fill, sw = 3, rx = 0) => rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), fill, sw, rx);

/**
 * A dining chair from the side: the back post runs from the floor up past the seat (it is the back
 * leg), a front leg, a stretcher between them. The seat runs toward +x (−x when flipped).
 * Returns { svg, seat (seat top y), backTop [x, y] (top of the back post) }.
 */
export function chair(x, floorY, { flip = false, col = C.wood } = {}) {
  const f = flip ? -1 : 1, X = v => x + f * v;
  const seatY = floorY - 76, d = 72, top = floorY - 164;
  let s = shadowAt(X(d / 2), floorY, d * 0.62);
  s += box4(X(d - 12), seatY, X(d), floorY, C.woodDeep, 2.6);            // front leg
  s += box4(X(4), floorY - 30, X(d - 8), floorY - 22, C.woodDeep, 2.2);    // stretcher, joined to both legs
  s += box4(X(0), top, X(12), floorY, C.woodDeep, 2.6);                 // back post = back leg, one piece
  s += box4(X(-3), top, X(15), top + 12, col, 2.6, 3) + box4(X(-1), top + 40, X(13), top + 50, col, 2.4, 2); // back rails
  s += box4(X(-2), seatY - 10, X(d + 4), seatY, col, 2.8, 3);             // seat
  return { svg: s, seat: seatY - 10, backTop: [X(6), top] };
}

/** A party balloon on its string, tied at (ax, ay) to something real; the string rises to the knot at (bx, by). */
export function balloon(ax, ay, bx, by, col = C.accent, r = 22) {
  let s = path(`M${r1(ax)} ${r1(ay)}Q${r1((ax + bx) / 2 + 8)} ${r1((ay + by) / 2)} ${r1(bx)} ${r1(by)}`, "none", C.ink, 1.6);
  s += path(`M${r1(bx - 5)} ${r1(by + 1)}L${r1(bx)} ${r1(by - 7)}L${r1(bx + 5)} ${r1(by + 1)}Z`, col, C.ink, 2); // knot
  s += ell(bx, by - 7 - r * 1.15, r, r * 1.18, col, C.ink, 3) + ell(bx - r * 0.35, by - 7 - r * 1.55, r * 0.2, r * 0.32, C.light, C.ink, 0, ` opacity="0.7"`);
  return s;
}

/** Bunting: a string hung between two nails in the wall, sagging, with triangle flags hanging from it. */
export function bunting(x1, y1, x2, y2, sagBy = 26, n = 9) {
  const cols = [C.accent, C.leaf, C.eyeBlue, C.accentB, C.cream];
  const qx = (x1 + x2) / 2, qy = (y1 + y2) / 2 + sagBy * 2;
  const at = t => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * qx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * qy + t * t * y2];
  let s = "";
  for (let i = 0; i < n; i++) {
    const [ax, ay] = at((i + 0.5) / n - 0.035), [bx, by] = at((i + 0.5) / n + 0.035);
    s += path(`M${r1(ax)} ${r1(ay)}L${r1(bx)} ${r1(by)}L${r1((ax + bx) / 2)} ${r1((ay + by) / 2 + 30)}Z`, cols[i % cols.length], C.ink, 2.2);
  }
  return s + path(`M${x1} ${y1}Q${qx} ${qy} ${x2} ${y2}`, "none", C.ink, 2) + circ(x1, y1, 3.5, C.ink) + circ(x2, y2, 3.5, C.ink); // the nails
}

/** A three-layer chocolate birthday cake on a flat plate resting on a surface at y = top, with four unlit candles. */
export function cake(x, top, s = 1) {
  const k = v => v * s;
  const p = plate(x, top, k(50)); // the cake plate, standing wholly on the table (seen from the side)
  let g = "";
  let y = p.top + k(1);
  for (const [w, h] of [[40, 18], [32, 16], [24, 14]]) {
    g += rect(x - k(w), y - k(h), k(w * 2), k(h), C.brownDeep, 3, 4);
    const n = Math.round(w / 6), step = k(w * 2) / n;
    let d = `M${r1(x - k(w))} ${r1(y - k(h))}V${r1(y - k(h) + k(4))}`;
    for (let i = 0; i < n; i++) d += `q${r1(step / 2)} ${r1(k(7))} ${r1(step)} 0`;
    g += path(d + `V${r1(y - k(h))}Z`, C.light, C.ink, 2); // icing dripping down each layer's top edge
    y -= k(h);
  }
  for (const dx of [-14, -5, 4, 13]) g += rect(x + k(dx) - k(2.4), y - k(16), k(4.8), k(16), C.light, 2, 1) + path(`M${r1(x + k(dx))} ${r1(y - k(16))}v${r1(-k(5))}`, "none", C.ink, 1.6) +
    path(`M${r1(x + k(dx) - k(2.4))} ${r1(y - k(11))}l${r1(k(4.8))} ${r1(-k(3))}M${r1(x + k(dx) - k(2.4))} ${r1(y - k(5))}l${r1(k(4.8))} ${r1(-k(3))}`, "none", C.eyeBlue, 1.4);
  return g + p.svg;
}

/** Two wrapped presents on the floor, the smaller one sitting wholly on top of the bigger one. */
export function presents(x, floorY) {
  let s = shadowAt(x + 40, floorY, 50);
  s += rect(x, floorY - 56, 80, 56, C.leaf, 3) + rect(x + 34, floorY - 56, 12, 56, C.accentB, 2) + rect(x, floorY - 34, 80, 10, C.accentB, 2);
  s += rect(x + 16, floorY - 92, 48, 36, C.eyeBlue, 3) + rect(x + 34, floorY - 92, 12, 36, C.light, 2);
  s += path(`M${x + 40} ${floorY - 92}q-16 -16 -22 -2q6 6 22 2q16 -16 22 -2q-6 6 -22 2`, C.light, C.ink, 2.2); // the bow, tied on top
  return s;
}

/** Pet-shop paper bag standing on the floor, its rim folded down; the catnip mouse's head peeks out and its string tail hangs over the rim. */
export function paperBag(x, floorY, w = 70, h = 92) {
  const y = floorY - h, mx = x + w * 0.5;
  let s = shadowAt(x + w / 2, floorY, w * 0.55);
  // the bag's open mouth: its back edge and the dark inside, seen just above the near edge
  s += path(`M${x} ${y + 2}L${x + 8} ${y - 10}H${x + w - 8}L${x + w} ${y + 2}Z`, C.creamDeep, C.ink, 2.6) + path(`M${x + 4} ${y + 2}L${x + 10} ${y - 6}H${x + w - 10}L${x + w - 4} ${y + 2}Z`, C.brownDeep, C.ink, 0);
  s += rect(x, y, w, h, C.creamDeep, 3);
  s += path(`M${x + 6} ${y + 14}V${floorY - 6} M${x + w - 6} ${y + 14}V${floorY - 6}`, "none", C.wood, 1.6);
  // the felt mouse inside, its head poking up out of the bag's mouth: two round ears, an eye, a pointed nose
  s += circ(mx - 12, y - 14, 7, C.brick, C.ink, 2.4) + circ(mx - 1, y - 20, 7, C.brick, C.ink, 2.4) + circ(mx - 12, y - 14, 3.4, C.pink) + circ(mx - 1, y - 20, 3.4, C.pink);
  s += path(`M${mx - 18} ${y + 6}Q${mx - 20} ${y - 12} ${mx - 4} ${y - 14}Q${mx + 12} ${y - 16} ${mx + 26} ${y - 6}Q${mx + 14} ${y + 4} ${mx + 4} ${y + 6}Z`, C.brick, C.ink, 2.6);
  s += circ(mx + 6, y - 7, 2.4, C.ink) + circ(mx + 26, y - 6, 2.6, C.pinkDeep, C.ink, 1.2) + path(`M${mx + 22} ${y - 3}l12 3 M${mx + 22} ${y - 5}l12 -3`, "none", C.ink, 1.2);
  s += rect(x - 2, y, w + 4, 10, C.cream, 3); // the near edge of the mouth, folded down, in front of the mouse
  // the string tail: from the mouse's back end inside, out over the rim, hanging straight down the outside of the bag
  s += path(`M${x + 12} ${y + 4}Q${x + 2} ${y - 8} ${x - 3} ${y + 4}V${y + 50}`, "none", C.ink, 2.6);
  s += path(`M${x + w * 0.28} ${y + h * 0.5}h${w * 0.44} M${x + w * 0.28} ${y + h * 0.5 + 9}h${w * 0.3}`, "none", C.woodDeep, 2.2); // the shop's stamp: squiggles only
  return s;
}

/** A big sealed delivery box on the floor: tape across the lid and down the front, a label (squiggles), two this-way-up arrows. Returns { svg, top }. */
export function parcel(x, floorY, w = 260, h = 170) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.55);
  s += rect(x, y, w, h, C.creamDeep, 3.4) + path(`M${x} ${y + 12}H${x + w}`, "none", C.wood, 2);
  s += rect(x + w * 0.46, y + 1.7, w * 0.08, h * 0.5, C.cream, 0, 0, ` opacity="0.85"`) + path(`M${x + w * 0.46} ${y}v${h * 0.5} M${x + w * 0.54} ${y}v${h * 0.5}`, "none", C.wood, 1.6);
  s += rect(x + 22, y + h * 0.58, 70, 44, C.light, 2.4, 3) + path(`M${x + 30} ${y + h * 0.58 + 12}h44 M${x + 30} ${y + h * 0.58 + 22}h52 M${x + 30} ${y + h * 0.58 + 32}h30`, "none", C.inkSoft, 2.2);
  for (const ax of [x + w - 66, x + w - 36]) s += path(`M${ax} ${y + h - 30}V${y + h - 64} M${ax - 9} ${y + h - 54}L${ax} ${y + h - 66}L${ax + 9} ${y + h - 54}`, "none", C.ink, 3);
  return { svg: s, top: y };
}

/** A row of coat hooks: a board screwed to the wall, hooks, coats hanging straight down from them by their loops (null = an empty hook). */
export function coatHooks(x, y, w, coats = [C.leafDeep, C.eyeBlue]) {
  let s = rect(x, y, w, 16, C.wood, 2.6, 3) + circ(x + 8, y + 8, 2, C.ink) + circ(x + w - 8, y + 8, 2, C.ink);
  coats.forEach((col, i) => {
    const hx = x + (w / (coats.length + 1)) * (i + 1);
    if (col) {
      s += path(`M${hx} ${y + 18}L${hx - 22} ${y + 32}Q${hx - 30} ${y + 80} ${hx - 26} ${y + 116}H${hx + 26}Q${hx + 30} ${y + 80} ${hx + 22} ${y + 32}Z`, col, C.ink, 3);
      s += path(`M${hx} ${y + 22}V${y + 114} M${hx - 22} ${y + 34}Q${hx - 32} ${y + 70} ${hx - 22} ${y + 96} M${hx + 22} ${y + 34}Q${hx + 32} ${y + 70} ${hx + 22} ${y + 96}`, "none", C.ink, 2);
    }
    s += path(`M${hx} ${y + 10}v10q0 6 7 4`, "none", C.ink, 3.6); // the hook, screwed into the board, over the coat's loop
  });
  return s;
}

/** A dog basket on the floor: a low oval wicker bed. Returns { back, front, bed }: draw back, then the dog, then front (the low front rim hides the dog's underside). */
export function dogBasket(x, floorY, w = 130) {
  const back = shadowAt(x, floorY, w * 0.55) +
    path(`M${x - w / 2} ${floorY - 6}Q${x - w / 2 - 4} ${floorY - 46} ${x - w / 2 + 14} ${floorY - 48}H${x + w / 2 - 14}Q${x + w / 2 + 4} ${floorY - 46} ${x + w / 2} ${floorY - 6}Q${x} ${floorY + 2} ${x - w / 2} ${floorY - 6}Z`, C.wood, C.ink, 3) +
    path(`M${x - w / 2 + 6} ${floorY - 30}Q${x} ${floorY - 40} ${x + w / 2 - 6} ${floorY - 30}`, "none", C.woodDeep, 2);
  const front = path(`M${x - w / 2 + 1} ${floorY - 24}Q${x} ${floorY - 14} ${x + w / 2 - 1} ${floorY - 24}L${x + w / 2} ${floorY - 6}Q${x} ${floorY + 2} ${x - w / 2} ${floorY - 6}Z`, C.woodDeep, C.ink, 3) +
    path(`M${x - w / 2 + 14} ${floorY - 20}v12 M${x - w / 4} ${floorY - 17}v12 M${x} ${floorY - 16}v12 M${x + w / 4} ${floorY - 17}v12 M${x + w / 2 - 14} ${floorY - 20}v12`, "none", C.wood, 2);
  return { back, front, bed: floorY - 16 };
}

/** An armchair seen from the front, standing on its four short feet (two show). Returns { svg, seat }. */
export function armchair(x, floorY, w = 170, { col = C.leafDeep, h = 176 } = {}) {
  let s = shadowAt(x + w / 2, floorY, w * 0.5);
  s += rect(x + 14, floorY - 12, 12, 12, C.woodDeep, 2) + rect(x + w - 26, floorY - 12, 12, 12, C.woodDeep, 2);
  s += rect(x + 18, floorY - h, w - 36, h - 66, col, 3, 22); // back (a tall one is a wing chair: its wings stand out at the sides)
  if (h > 200) s += rect(x + 6, floorY - h + 30, 30, h - 120, col, 3, 14) + rect(x + w - 36, floorY - h + 30, 30, h - 120, col, 3, 14);
  s += rect(x + 10, floorY - 82, w - 20, 70, col, 3, 10) + rect(x + 34, floorY - 96, w - 68, 24, C.soft, 3, 8); // seat and cushion
  s += rect(x, floorY - 118, 36, 106, col, 3, 14) + rect(x + w - 36, floorY - 118, 36, 106, col, 3, 14); // arms
  return { svg: s, seat: floorY - 96 };
}

/** A dog bed on the floor: a flat round cushion with a stitched edge. Returns { svg, bed } (the cushion's top y). */
export function dogBed(x, floorY, w = 170, col = C.leaf) {
  let s = shadowAt(x, floorY, w * 0.52);
  s += path(`M${x - w / 2} ${floorY - 4}Q${x - w / 2 - 6} ${floorY - 20} ${x - w / 2 + 12} ${floorY - 22}H${x + w / 2 - 12}Q${x + w / 2 + 6} ${floorY - 20} ${x + w / 2} ${floorY - 4}Q${x} ${floorY + 2} ${x - w / 2} ${floorY - 4}Z`, col, C.ink, 3);
  s += path(`M${x - w / 2 + 8} ${floorY - 10}Q${x} ${floorY - 4} ${x + w / 2 - 8} ${floorY - 10}`, "none", C.light, 2.4, ` stroke-dasharray="6 6"`);
  return { svg: s, bed: floorY - 19 };
}

/** A ball resting on the floor. */
export const ball = (x, floorY, r = 16, col = C.eyeBlue) => shadowAt(x, floorY, r) + circ(x, floorY - r, r, col, C.ink, 3) + path(`M${x - r} ${floorY - r}Q${x} ${floorY - r * 1.5} ${x + r} ${floorY - r}`, "none", C.light, 3);

/**
 * A whole salmon wrapped in fishmonger's paper, lying on a surface at y = top: a long paper parcel tied
 * with string, the head out of one end and the tail fin out of the other (lying flat, so it shows edge-on).
 */
export function salmon(x, top, s = 1) {
  const k = v => v * s, P = (dx, dy) => `${r1(x + k(dx))} ${r1(top - k(dy))}`;
  let g = ell(x, top, k(80), k(5), C.ink, C.ink, 0, ` opacity="0.15"`);
  g += path(`M${P(-58, 12)}L${P(-94, 2)}L${P(-86, 9)}L${P(-96, 18)}Z`, C.grey, C.ink, 2.4); // tail fin, lying flat
  g += path(`M${P(46, 26)}Q${P(80, 22)} ${P(94, 10)}Q${P(80, 0)} ${P(46, 0)}Z`, C.grey, C.ink, 2.6); // head
  g += path(`M${P(60, 24)}q${r1(k(6))} ${r1(k(12))} 0 ${r1(k(23))}`, "none", C.pinkDeep, 2.4) + circ(x + k(74), top - k(15), k(3), C.ink);
  g += path(`M${P(-64, 0)}Q${P(-70, 28)} ${P(-50, 34)}L${P(44, 32)}Q${P(58, 16)} ${P(50, 0)}Z`, C.light, C.ink, 2.8); // the paper
  g += path(`M${P(-30, 33)}L${P(-20, 0)} M${P(4, 33)}L${P(-2, 0)} M${P(28, 32)}L${P(32, 0)}`, "none", C.edge, 2); // folds
  g += path(`M${P(-12, 34)}V${r1(top)} M${P(20, 33)}V${r1(top)}`, "none", C.woodDeep, 2.4); // string
  return g;
}

/** A cooker on the floor (as tall as the counters): oven window, knobs, a pot on the hob with steam rising. Returns { svg, top }. */
export function cooker(x, floorY, w = 130, h = 150) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.5) + rect(x, y, w, h, C.light, 3);
  s += rect(x + 14, y + 44, w - 28, h - 60, C.greyDeep, 2.6, 4) + rect(x + 24, y + 62, w - 48, 40, C.ink, 0, 3, ` opacity="0.55"`);
  s += rect(x + 24, y + 50, w - 48, 6, C.grey, 2); // the oven door's handle
  for (let i = 0; i < 4; i++) s += circ(x + 22 + i * ((w - 44) / 3), y + 24, 6, C.grey, C.ink, 2.2);
  s += rect(x - 4, y - 6, w + 8, 8, C.ink, 0); // the hob top
  const px = x + w / 2, py = y - 6;
  s += rect(px - 32, py - 46, 64, 46, C.grey, 3, 4) + rect(px - 46, py - 40, 16, 7, C.greyDeep, 2, 3) + rect(px + 30, py - 40, 16, 7, C.greyDeep, 2, 3);
  s += path(`M${px - 34} ${py - 46}Q${px} ${py - 60} ${px + 34} ${py - 46}Z`, C.greyDeep, C.ink, 2.6) + circ(px, py - 56, 4, C.ink);
  const steam = `M${px - 18} ${py - 64}q-8 -14 0 -26q8 -12 0 -26 M${px + 12} ${py - 66}q-8 -14 0 -26q8 -12 0 -24`; // rising
  s += path(steam, "none", C.light, 5) + path(steam, "none", C.edge, 1.6);
  return { svg: s, top: y };
}

/** A cooker hood fixed to the wall above the cooker, its duct running up out of the frame. */
export const hood = (x, y, w) => rect(x + w / 2 - 22, -4, 44, y + 4, C.grey, 3) + path(`M${x} ${y + 40}L${x + 30} ${y}H${x + w - 30}L${x + w} ${y + 40}Z`, C.grey, C.ink, 3) + rect(x - 2, y + 38, w + 4, 8, C.greyDeep, 2.4);

/** A pan rail: a bar on two brackets screwed to the wall, S-hooks over it, pans hanging straight down by their handles. */
export function panRail(x, y, w, n = 3) {
  let s = "";
  for (const bx of [x + 6, x + w - 6]) s += rect(bx - 5, y - 6, 10, 14, C.greyDeep, 2.2) + circ(bx, y - 1, 1.8, C.ink);
  s += rect(x, y - 2, w, 6, C.grey, 2.4, 2);
  for (let i = 0; i < n; i++) {
    const hx = x + (w / (n + 1)) * (i + 1), r = 20 + (i % 2) * 6;
    s += rect(hx - 4, y + 14, 8, 38, C.ink, 0, 3) + circ(hx, y + 20, 2.2, C.grey); // handle, hung through its hole
    s += path(`M${hx} ${y - 2}q7 0 7 6q0 6 -7 6v8`, "none", C.greyDeep, 2.4); // S-hook: over the rail, through the handle's hole
    s += circ(hx, y + 50 + r, r, C.blackSoft, C.ink, 3) + circ(hx, y + 50 + r, r - 6, C.black);
  }
  return s;
}

// ---------------------------------------------------------------- graffiti (outdoor surfaces only)
// Street graffiti in the gang's world (the author, 2026-10-21): tags and throw-ups on garden walls,
// fences, bins, the alley wall and the warden's van. Flat paint with a soft overspray, never on the
// inside of anyone's home, never in Broom red-orange or Cuddle pink, and never fake writing: the gang's
// cat-head 9, a few abstract marks (loops, crowns, stars, arrows, paw prints, a fish), and only the short real
// words "MEOW", "9 LIVES" and "NLG" as bubble-letter throw-ups. A rival crew's fish-skeleton scrawl appears once,
// tagged over by the gang (spot-rivals).

/** A sprayed stroke: a soft wide overspray under a solid core. */
export const spray = (d, col, w = 5, op = 1) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(w * 2)}" stroke-linecap="round" stroke-linejoin="round" opacity="${r1(22 * op) / 100}"/>` +
  `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;

/**
 * The Nine Lives Gang's tag, sprayed in paint: a cat's head (two ears, whiskers both sides) with a 9
 * in it, and two short drips running straight down from the chin. Centred on (x, y); at s = 1 about
 * 130 wide and 100 tall. col = "currentColor" lets the page set the colour.
 */
export function gangTag(x, y, s = 1, col = "currentColor", op = 1, rot = 0) {
  const { head, nine, whiskers, drips } = GANG_SIGN; // the same strokes as Big Biscuit's tattoo
  return `<g transform="translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ""} scale(${s})" opacity="${op}">` +
    spray(head, col, 5.5) + spray(nine, col, 5.5) + spray(whiskers, col, 3.5) + spray(drips, col, 3.5) +
    `<circle cx="-18" cy="47" r="3" fill="${col}"/><circle cx="22" cy="41" r="2.4" fill="${col}"/></g>`;
}

/**
 * An abstract tag (no letters), centred on (x, y) at scale s: "loop" (a looping squiggle with an
 * underline ending in an arrow), "crown" (a three-point crown), "star" (a star with a drip), "arrow"
 * (a fat bent arrow), "paws" (a trail of three sprayed paw prints), "fish" (a cartoon fish).
 */
export function tagMark(kind, x, y, s = 1, col = C.accentB, op = 0.9, rot = 0) {
  let g = "";
  if (kind === "loop") g = spray("M-40 6C-34 -24 -18 -24 -20 2C-22 22 -6 22 0 -4C6 -26 18 -22 16 0C14 18 30 18 36 -6M-44 18Q0 30 42 14L34 8M42 14L34 22", col, 4);
  if (kind === "crown") g = spray("M-26 14L-30 -16L-12 0L0 -22L12 0L30 -16L26 14Z", col, 4) + spray("M-24 24H24", col, 4);
  if (kind === "star") g = spray("M0 -26L7 -8L26 -8L11 4L17 23L0 12L-17 23L-11 4L-26 -8L-7 -8Z", col, 4) + spray("M6 24V36", col, 3) + `<circle cx="6" cy="40" r="2.6" fill="${col}"/>`;
  if (kind === "arrow") g = spray("M-36 16Q-30 -18 4 -14H20M10 -26L24 -14L10 -2", col, 6);
  if (kind === "fish") g = spray("M-30 0Q-8 -22 18 0Q-8 22 -30 0ZM18 0L34 -14V14Z", col, 4) + `<circle cx="-16" cy="-4" r="3.4" fill="${col}"/>` + spray("M-2 -10Q4 0 -2 10", col, 2.4) + spray("M-36 -16a3 3 0 1 0 0.1 0M-42 -28a2 2 0 1 0 0.1 0", col, 2);
  if (kind === "paws") for (const [px, py] of [[-28, 10], [0, -6], [28, 6]]) g += `<g transform="translate(${px} ${py}) rotate(20)" fill="${col}"><ellipse cx="0" cy="5" rx="7" ry="6"/><ellipse cx="-8" cy="-5" rx="2.8" ry="3.6"/><ellipse cx="-3" cy="-9" rx="2.8" ry="3.6"/><ellipse cx="3" cy="-9" rx="2.8" ry="3.6"/><ellipse cx="8" cy="-5" rx="2.8" ry="3.6"/></g>`;
  return `<g transform="translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ""} scale(${s})" opacity="${op}">${g}</g>`;
}

/**
 * A throw-up: a short real word ("MEOW", "NLG" or "9 LIVES") in fat sprayed letters (the book's spray-paint
 * face) with a thick outline and a drop shadow, centred on (x, y).
 */
export function throwUp(word, x, y, size = 40, fill = C.eyeBlue, line = C.light, rot = -4) {
  if (!["MEOW", "9 LIVES", "NLG"].includes(word)) throw new Error(`throwUp: only safe short words, not ${word}`);
  const t = (dx, dy, f, st, sw) => `<text x="${r1(dx)}" y="${r1(dy)}" text-anchor="middle" font-family="Rubik Spray Paint, Fraunces, serif" font-size="${size}" fill="${f}"${st ? ` stroke="${st}" stroke-width="${r1(sw)}" stroke-linejoin="round" paint-order="stroke"` : ""}>${word}</text>`;
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot})">` + t(4, size * 0.35 + 4, C.ink, C.ink, size * 0.16) + t(0, size * 0.35, fill, line, size * 0.12) + `</g>`;
}

/**
 * A rival crew's tag (comic, made-up): a scruffy fish-skeleton scrawl — a wobbly spine, jagged ribs, a
 * lumpy head with a cross for an eye, a ragged tail, two drips and a scribbled underline. Centred on
 * (x, y), about 150 wide at s = 1. Sprayed in a dull green, never Broom red or Cuddle pink.
 */
export function rivalTag(x, y, s = 1, col = C.leaf, op = 0.9) {
  let g = spray("M-44 2Q-30 -6 -16 2T12 0T38 2", col, 4.2);                                                     // the wobbly spine
  for (const [rx, h] of [[-30, 15], [-18, 18], [-6, 19], [6, 18], [18, 15], [28, 11]]) g += spray(`M${rx} 1L${rx - 4} ${-h}M${rx} 3L${rx - 5} ${h}`, col, 2.8); // jagged ribs
  g += spray("M38 2Q46 -18 62 -12Q74 -4 66 10Q54 22 38 2Z", col, 4) + spray("M52 -6l6 6M58 -6l-6 6", col, 2.6); // the lumpy head, a cross for an eye
  g += spray("M-44 2L-62 -16L-58 2L-64 20Z", col, 4);                                                             // the ragged tail
  g += spray("M-54 34Q-10 26 30 36T70 30", col, 3) + spray("M-20 20V32M44 20V30", col, 2.4) + `<circle cx="-20" cy="35" r="2.4" fill="${col}"/><circle cx="44" cy="33" r="2" fill="${col}"/>`;
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${s})" opacity="${op}">${g}</g>`;
}
