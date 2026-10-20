// The scene kit: furniture, prizes and residents, all in one flat front-on
// elevation with a shared floor line, so every scene has one ground plane and
// one eye level (ART-CHECKLIST §4). Every piece stands on the floor (y = floorY)
// or on something drawn under it, and gets a contact shadow (§1–2).
import { C, r1, ell, circ, path, rng } from "./lib.mjs";

const rect = (x, y, w, h, fill, sw = 3, rx = 0, extra = "") =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"${rx ? ` rx="${rx}"` : ""} fill="${fill}"${sw ? ` stroke="${C.ink}" stroke-width="${sw}"` : ""}${extra}/>`;
export const shadowAt = (x, y, rx, op = 0.18) => ell(x, y + 1, rx, Math.max(3, rx * 0.12), C.ink, C.ink, 0, ` opacity="${op}"`);

/** Room backdrop: wall, skirting board, floorboards to the bottom edge. */
export function room(w, h, floorY, { wall = C.wall, floor = C.floor, seed = 3 } = {}) {
  let s = rect(0, 0, w, floorY, wall, 0);
  // faint wallpaper stripes
  let d = "";
  for (let x = 24; x < w; x += 48) d += `M${x} 0V${floorY - 14}`;
  s += `<path d="${d}" stroke="${C.wallDeep}" stroke-width="5" opacity="0.35"/>`;
  s += rect(0, floorY - 14, w, 14, C.light, 0) + path(`M0 ${floorY - 14}H${w}`, "none", C.ink, 2);
  s += rect(0, floorY, w, h - floorY, floor, 0);
  const R = rng(seed);
  let b = "";
  for (let y = floorY + 16; y < h; y += 16) {
    b += `M0 ${y}H${w}`;
    for (let x = R() * 120; x < w; x += 110 + R() * 90) b += `M${r1(x)} ${y - 16}V${y}`;
  }
  s += `<path d="${b}" stroke="${C.floorDeep}" stroke-width="1.6" opacity="0.6"/>`;
  return s + path(`M0 ${floorY}H${w}`, "none", C.ink, 3);
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
  let g = shadowAt(x, base, 26 * s);
  g += path(`M${x - 24 * s} ${base - 46 * s}H${x + 24 * s}L${x + 18 * s} ${base}H${x - 18 * s}Z`, C.brick, C.ink, 3);
  for (const [dx, dy, a] of [[-26, -96, -30], [0, -116, 0], [24, -92, 30], [-12, -78, -60], [14, -74, 60]])
    g += ell(x + dx * s, base - 46 * s + (dy + 46) * s, 12 * s, 30 * s, C.leaf, C.ink, 2.6, ` transform="rotate(${a} ${r1(x + dx * s)} ${r1(base - 46 * s + (dy + 46) * s)})"`);
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
export const rug = (x, floorY, rx, col = C.alarmB) => ell(x, floorY + 22, rx, rx * 0.12, col, C.ink, 2.6) + ell(x, floorY + 22, rx * 0.8, rx * 0.08, "none", C.accentB, 2);

// ---------------------------------------------------------------- prizes
/** A roast chicken on a plate resting on a surface at y = top. */
export function chicken(x, top, s = 1) {
  let g = ell(x, top - 4 * s, 60 * s, 9 * s, C.light, C.ink, 2.6); // plate, flat
  g += ell(x, top - 34 * s, 44 * s, 30 * s, C.ginger, C.ink, 3);
  g += ell(x - 12 * s, top - 46 * s, 14 * s, 8 * s, C.accentB, C.ink, 0, ` opacity="0.7"`);
  for (const sd of [-1, 1]) g += path(`M${x + sd * 34 * s} ${top - 24 * s}q${sd * 22 * s} ${-6 * s} ${sd * 26 * s} ${-26 * s}`, "none", C.ink, 3) +
    ell(x + sd * 58 * s, top - 52 * s, 7 * s, 6 * s, C.light, C.ink, 2.4);
  return g;
}
/** A big cardboard box standing on the floor (flaps open). */
export function box(x, floorY, w = 170, h = 120) {
  const y = floorY - h;
  let s = shadowAt(x + w / 2, floorY, w * 0.55);
  s += rect(x, y, w, h, C.creamDeep, 3);
  s += path(`M${x} ${y}L${x - 24} ${y - 34}L${x + w * 0.3} ${y - 30}L${x + w * 0.42} ${y}Z`, C.cream, C.ink, 3);
  s += path(`M${x + w} ${y}L${x + w + 22} ${y - 30}L${x + w * 0.66} ${y - 34}L${x + w * 0.56} ${y}Z`, C.cream, C.ink, 3);
  s += rect(x + w * 0.4, y + 2, w * 0.2, h - 4, C.cream, 0, 0, ` opacity="0.7"`); // tape
  s += path(`M${x + 16} ${y + h - 30}h40 M${x + 16} ${y + h - 20}h26`, "none", C.ink, 2);
  return s;
}
/** A catnip mouse toy lying on a surface at y = top. */
export function toyMouse(x, top, s = 1) {
  let g = ell(x, top - 9 * s, 18 * s, 10 * s, C.alarmB, C.ink, 2.4);
  g += circ(x + 14 * s, top - 15 * s, 5 * s, C.alarmB, C.ink, 2) + circ(x + 18 * s, top - 10 * s, 1.6 * s, C.ink);
  g += path(`M${x - 18 * s} ${top - 8 * s}q-14 ${-4 * s} -22 ${4 * s}`, "none", C.ink, 2);
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

/** A wall shelf held by two brackets screwed to the wall, with jars standing on it. */
export function shelf(x, y, w, items = 3) {
  let s = "";
  for (const bx of [x + 14, x + w - 22]) s += path(`M${bx} ${y + 10}v26h10`, "none", C.ink, 3) + circ(bx, y + 30, 2, C.ink);
  s += `<rect x="${x}" y="${y}" width="${w}" height="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.6"/>`;
  const cols = [C.alarmB, C.accent, C.leaf, C.cuddle];
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
export function nightSky(w, h, seed = 5) {
  const R = rng(seed);
  let s = `<rect width="${w}" height="${h}" fill="${C.deep}"/>`;
  for (let i = 0; i < 26; i++) s += circ(R() * w, R() * h * 0.6, 1 + R() * 1.6, C.accentB, C.ink, 0, ` opacity="${r1(0.5 + R() * 0.5)}"`);
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
  s += path(`M${x} ${y}Q${x + w * 0.22} ${y + h * 0.4} ${x + w * 0.1} ${y + h}H${x}Z M${x + w} ${y}Q${x + w * 0.78} ${y + h * 0.4} ${x + w * 0.9} ${y + h}H${x + w}Z`, C.alarmB, C.ink, 2.4);
  s += path(`M${x + w / 2} ${y}V${y + h}`, "none", C.ink, 4);
  s += `<rect x="${x - 12}" y="${y + h + 6}" width="${w + 24}" height="10" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`;
  return s;
}

/** A street lamp standing on the pavement, with its pool of light. */
export function streetLamp(x, groundY, h = 250) {
  let s = ell(x, groundY + 4, 120, 16, C.accentB, C.ink, 0, ` opacity="0.35"`);
  s += path(`M${x - 70} ${groundY - h + 30}L${x - 150} ${groundY}H${x + 150}L${x + 70} ${groundY - h + 30}Z`, C.accentB, C.ink, 0, ` opacity="0.16"`);
  s += `<rect x="${x - 6}" y="${groundY - h + 20}" width="12" height="${h - 20}" fill="${C.ink}"/>`;
  s += `<rect x="${x - 16}" y="${groundY - 14}" width="32" height="14" fill="${C.ink}"/>`;
  s += path(`M${x - 26} ${groundY - h + 22}L${x - 16} ${groundY - h - 6}H${x + 16}L${x + 26} ${groundY - h + 22}Z`, C.accentB, C.ink, 3);
  s += `<rect x="${x - 30}" y="${groundY - h + 20}" width="60" height="8" fill="${C.ink}"/>`;
  return s;
}

/** A wheelie bin on the pavement, wheels touching the ground. */
export function wheelieBin(x, groundY, col = C.leafDeep) {
  let s = shadowAt(x + 34, groundY, 40);
  s += path(`M${x} ${groundY - 110}L${x + 8} ${groundY - 10}H${x + 60}L${x + 68} ${groundY - 110}Z`, col, C.ink, 3);
  s += `<rect x="${x - 6}" y="${groundY - 122}" width="80" height="14" rx="4" fill="${col}" stroke="${C.ink}" stroke-width="3"/>`;
  s += circ(x + 14, groundY - 10, 10, C.ink) + circ(x + 14, groundY - 10, 4, C.grey);
  return s;
}

/**
 * A grown-up seen from behind (no face to get wrong), walking away: hair, coat, two legs, two shoes on
 * the ground, one arm carrying a shopping bag whose handles hide the hand. o: { x, groundY, s, coat, bag }
 */
export function humanBack(o) {
  const { x, groundY, s = 1, coat = C.alarm, trousers = C.dark, hair = C.brownDeep, bagCol = C.light } = o;
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
  // left arm hanging, hand in pocket
  g += `<path d="M${r1(x - 30 * s)} ${r1(gy - 205 * s)}Q${r1(x - 42 * s)} ${r1(gy - 160 * s)} ${r1(x - 34 * s)} ${r1(gy - 124 * s)}" fill="none" stroke="${C.ink}" stroke-width="${k(15)}" stroke-linecap="round"/>` +
    `<path d="M${r1(x - 30 * s)} ${r1(gy - 205 * s)}Q${r1(x - 42 * s)} ${r1(gy - 160 * s)} ${r1(x - 34 * s)} ${r1(gy - 124 * s)}" fill="none" stroke="${coat}" stroke-width="${k(9)}" stroke-linecap="round"/>`;
  // right arm down to the bag; the bag's handles wrap the hand
  g += `<path d="M${r1(x + 30 * s)} ${r1(gy - 205 * s)}Q${r1(x + 44 * s)} ${r1(gy - 160 * s)} ${r1(x + 42 * s)} ${r1(gy - 128 * s)}" fill="none" stroke="${C.ink}" stroke-width="${k(15)}" stroke-linecap="round"/>` +
    `<path d="M${r1(x + 30 * s)} ${r1(gy - 205 * s)}Q${r1(x + 44 * s)} ${r1(gy - 160 * s)} ${r1(x + 42 * s)} ${r1(gy - 128 * s)}" fill="none" stroke="${coat}" stroke-width="${k(9)}" stroke-linecap="round"/>`;
  g += `<path d="M${r1(x + 28 * s)} ${r1(gy - 104 * s)}Q${r1(x + 42 * s)} ${r1(gy - 140 * s)} ${r1(x + 56 * s)} ${r1(gy - 104 * s)}" fill="none" stroke="${C.ink}" stroke-width="${k(4)}"/>`;
  g += `<path d="M${r1(x + 22 * s)} ${r1(gy - 104 * s)}H${r1(x + 62 * s)}L${r1(x + 58 * s)} ${r1(gy - 56 * s)}H${r1(x + 26 * s)}Z" fill="${bagCol}" stroke="${C.ink}" stroke-width="3"/>`;
  g += ell(x + 42 * s, gy - 112 * s, 13 * s, 8 * s, C.ginger, C.ink, 2.4); // the chicken peeking out of the bag
  // head from behind: hair, two ears
  g += ell(x - 22 * s, gy - 236 * s, 5 * s, 8 * s, C.cream, C.ink, 2.4) + ell(x + 22 * s, gy - 236 * s, 5 * s, 8 * s, C.cream, C.ink, 2.4);
  g += circ(x, gy - 242 * s, 23 * s, hair, C.ink, 3);
  return g;
}
