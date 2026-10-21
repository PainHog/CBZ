// The cat model: every cat in the book is drawn by these functions, so a
// recurring cat keeps one design everywhere (ART-CHECKLIST §10–11). A cat is a
// "look" (coat, markings, eyes, ears, tail, body, the gang's gear) plus a pose.
//
// Anatomy rules built in: four legs (two near, two far, never hidden behind each
// other), one tail, two ears, whiskers on both sides of the muzzle, paws with toe
// beans (never fingers), hind legs that bend at the knee (forward) and hock (back).
// Local frame: ground at y = 0, the cat faces +x; scale with the figure transform.
//
// One silhouette (the author's note, 2026-10-21: side-view cats must not look like
// jointed animatronics). In the side poses the near parts (body, neck, head, near ear,
// near legs and paws, tail) are drawn as ONE shape: every part's outline is laid down
// first and every part's fill on top, so only the outer silhouette is inked and no line
// crosses the body where a leg, the neck or the tail joins it. Legs are single tapered
// shapes (no joints drawn) ending in small round paws. The far legs and far ear sit
// behind, in the deeper shade.
//
// Which side shows (checked against the reference sheets, ART-CHECKLIST §10):
// a cat facing right (+x) shows the viewer its RIGHT side; flipped (facing left) it
// shows its LEFT side. Seen from the front, the cat's left is on the viewer's right.
// Every one-sided mark is placed from that rule: Biscuit's notched left ear and his
// right-shoulder tattoo, Tilly's right-foreleg tattoo and right-ear stud, Mags's
// left-ear hoop, Velvet's white left forepaw, Pip's ginger left face and black right ear.
import { C, r1, ell, circ, path, GANG_SIGN } from "./lib.mjs";

const P = p => `${r1(p[0])} ${r1(p[1])}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Scale of each look against an adult cat drawn at the same s (Pip is a kitten; Pom-Pom is large). */
export const SIZE = { kitten: 0.82, large: 1.2 };

/**
 * The premade gang's looks (reference sheets: book/art/ref-*.svg; README "The premade gang").
 * Gear (the author's design calls, 2026-10-21): a gang of cat burglars who love shiny things, played for
 * laughs: kerchiefs a bit too big, bling a bit too heavy, daft tattoos, tough looks that don't quite work.
 * - bandana: { on: "head" | "neck", col, dots, big } — a do-rag knotted at the back of the head, or a
 *   kerchief knotted at the nape with its point hanging down the chest (big: hangs to the paws).
 * - tattoos: [{ mark, at }] — daft ink on the fur: "sign" (the gang's cat-head 9), "mum" (MUM in a heart),
 *   "fishbone", "sardine" (a sardine with wings); at: "rightShoulder" | "leftShoulder" | "rightFore" | "rightHip".
 * - chain (a chunky gold chain round the neck), stud / hoop: "left" | "right" (which ear),
 *   cap (a shiny bottle cap worn on a string as a medal).
 * - cool: the gang's tough look (a lopsided squint and a crooked grin with one fang); grin: Pip's big
 *   eager grin, wide-eyed. Velvet keeps an innocent face (she passes as a pet).
 */
export const LOOKS = {
  tilly: { name: "Two-Bin Tilly", coat: C.grey, deep: C.greyDeep, stripe: C.greyDeep, belly: C.whiteDeep, eye: C.eyeGreen, tabby: true,
    body: "lean", ears: "tall", notch: null, tail: "plain", collar: { col: C.alarmB, tag: true },
    tattoos: [{ mark: "fishbone", at: "rightFore" }], stud: "right", cool: true },
  biscuit: { name: "Big Biscuit", coat: C.brown, deep: C.brownDeep, stripe: C.brownDeep, belly: C.cream, eye: C.eyeAmber, tabby: true,
    muzzle: C.cream, body: "chonky", ears: "round", notch: "left", tail: "plain", collar: null,
    bandana: { on: "head", col: C.black }, chain: true, tattoos: [{ mark: "sign", at: "rightShoulder" }, { mark: "mum", at: "leftShoulder" }], cool: true },
  velvet: { name: "Velvet", coat: C.black, deep: "#1a1820", stripe: null, belly: C.black, eye: C.eyeAmber, tabby: false,
    chestStar: C.white, sock: "leftFront", body: "lean", ears: "tall", notch: null, tail: "plain", collar: null, rim: C.soft },
  mags: { name: "Marmalade Mags", coat: C.ginger, deep: C.gingerDeep, stripe: C.gingerDeep, belly: C.cream, eye: C.eyeGreen, tabby: true,
    body: "lean", ears: "tall", notch: null, tail: "kinked", collar: null,
    bandana: { on: "neck", col: C.dark, dots: C.light, roomy: true }, hoop: "left", tattoos: [{ mark: "sardine", at: "rightHip" }], cool: true },
  // Pip's patches belong to her own left and right sides: left face and left flank ginger,
  // right ear and right flank black, a black spot on the shoulders, a black tail tip.
  pip: { name: "Pip", coat: C.white, deep: C.whiteDeep, stripe: null, belly: C.white, eye: C.eyeBlue, tabby: false,
    patches: { left: { face: C.ginger, flank: C.ginger }, right: { ear: C.black, flank: C.black }, shoulder: C.black, tailTip: C.black },
    body: "lean", ears: "small", notch: null, tail: "fluffy", collar: null, young: true, fluffy: "kitten", size: SIZE.kitten,
    bandana: { on: "neck", col: C.eyeBlue, big: true }, cap: true, grin: true },
};

// ---------------------------------------------------------------- geometry helpers
/** An outlined tube (front-view limb, tail) along a smooth path: ink underlay, coat on top. */
function tube(d, w, col, ink = C.ink, sw = 3.2) {
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${r1(w + sw * 2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
/** Catmull-Rom control points for the segment p1→p2. */
function cr(p0, p1, p2, p3) {
  return [[p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]];
}
/** A smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(pts, closed = false) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${P(p[1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [c1, c2] = cr(p[i - 1], p[i], p[i + 1], p[i + 2]);
    d += ` C${P(c1)} ${P(c2)} ${P(p[i + 1])}`;
  }
  return d + (closed ? "Z" : "");
}
/** Points along that same smooth closed curve (for tufted fur outlines). */
function sampleSmooth(pts, per = 6) {
  const p = [pts[pts.length - 1], ...pts, pts[0], pts[1]], out = [];
  for (let i = 1; i < p.length - 2; i++) {
    const [c1, c2] = cr(p[i - 1], p[i], p[i + 1], p[i + 2]), a = p[i], b = p[i + 1];
    for (let j = 0; j < per; j++) {
      const t = j / per, u = 1 - t;
      out.push([u ** 3 * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * b[0],
        u ** 3 * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * b[1]]);
    }
  }
  return out;
}
/**
 * A fluffy outline: the smooth closed curve through pts, scalloped into soft tufts of fur (each a
 * rounded bump pushed outward and swept a little downward, as long fur lies). from/to limit the tufts
 * to part of the outline (0..1 of the way round). Returns a path d.
 */
function tufted(pts, amp = 8, per = 4, from = 0, to = 1) {
  const q = sampleSmooth(pts, per), n = q.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const a = q[i], b = q[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area > 0 ? 1 : -1;
  let d = `M${P(q[0])}`;
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n], f = i / n;
    if (f >= from && f <= to) {
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const nx = (dy / L) * sgn, ny = (-dx / L) * sgn;
      const tip = [b[0] + nx * amp * 0.5, b[1] + ny * amp * 0.5 + amp * 0.3]; // the tuft's point, just past b
      const c = [(a[0] + b[0]) / 2 + nx * amp * 1.3, (a[1] + b[1]) / 2 + ny * amp * 1.3 + amp * 0.2];
      d += ` Q${P(c)} ${P(tip)} L${P(b)}`;
    } else d += ` L${P(b)}`;
  }
  return d + "Z";
}
/** An ellipse as a path d (so it can join a silhouette). */
const ellD = (cx, cy, rx, ry) => `M${r1(cx - rx)} ${r1(cy)}A${r1(rx)} ${r1(ry)} 0 1 0 ${r1(cx + rx)} ${r1(cy)}A${r1(rx)} ${r1(ry)} 0 1 0 ${r1(cx - rx)} ${r1(cy)}Z`;
/**
 * A tapered limb (leg, tail) as one smooth closed shape: a centreline c (from the root to the end)
 * with a width at each point, a rounded end. The root end lies inside the body, so it never shows.
 */
function limbD(c, w) {
  const n = c.length, Lf = [], Rt = [];
  for (let i = 0; i < n; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    Lf.push([c[i][0] - dy * w[i] / 2, c[i][1] + dx * w[i] / 2]);
    Rt.push([c[i][0] + dy * w[i] / 2, c[i][1] - dx * w[i] / 2]);
  }
  const a = c[n - 2], b = c[n - 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const cap = [b[0] + (b[0] - a[0]) / l * w[n - 1] * 0.5, b[1] + (b[1] - a[1]) / l * w[n - 1] * 0.5];
  return smooth([...Lf, cap, ...Rt.reverse()], true);
}
/** Bars across a limb (tabby stripes on a leg or tail): short strokes square to the centreline. */
function bars(c, w, ts, col, sw = 4) {
  let d = "";
  for (const t of ts) {
    const f = t * (c.length - 1), i = Math.min(c.length - 2, Math.floor(f)), u = f - i;
    const p = [c[i][0] + (c[i + 1][0] - c[i][0]) * u, c[i][1] + (c[i + 1][1] - c[i][1]) * u];
    const dx = c[i + 1][0] - c[i][0], dy = c[i + 1][1] - c[i][1], l = Math.hypot(dx, dy) || 1, ww = (w[i] + (w[i + 1] - w[i]) * u) * 0.62;
    d += `M${r1(p[0] - dy / l * ww)} ${r1(p[1] + dx / l * ww)}L${r1(p[0] + dy / l * ww)} ${r1(p[1] - dx / l * ww)}`;
  }
  return d ? path(d, "none", col, sw) : "";
}
/** A point part-way along a polyline (t 0..1 by segment). */
function along(c, t) {
  const f = t * (c.length - 1), i = Math.min(c.length - 2, Math.floor(f)), u = f - i;
  return [c[i][0] + (c[i + 1][0] - c[i][0]) * u, c[i][1] + (c[i + 1][1] - c[i][1]) * u];
}
/** The sole of a raised paw: one big pad and four toe beans (pink). */
export function beans(x, y, s = 1, rot = 0) {
  let g = `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})">`;
  g += ell(0, 4, 8, 6.5, C.pink, C.ink, 1.6);
  for (const [bx, by] of [[-9, -6], [-3, -10], [3, -10], [9, -6]]) g += ell(bx, by, 3.2, 3.6, C.pink, C.ink, 1.4);
  return g + "</g>";
}
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const quad = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]];

/**
 * An ear's geometry: back base b0, tip, front base b1 (pointed), or with ctrl [c0, c1] a round ear
 * (b0 –Q c0→ tip –Q c1→ b1). notch {edge: "a"|"b", t} cuts a V into that edge (a = b0→tip,
 * b = tip→b1): the V is clipped out of the ear, so whatever is behind shows through it, and the cut's
 * two sides are inked. Returns { d, open (the free edges, for re-inking), def, wrap(svg), v (the V's ink) }.
 */
let EAR = 0;
function earGeom({ b0, tip, b1, ctrl = null, notch = null, id = "ear", sw = 3.2 }) {
  const d = ctrl ? `M${P(b0)} Q${P(ctrl[0])} ${P(tip)} Q${P(ctrl[1])} ${P(b1)} Z` : `M${P(b0)} L${P(tip)} L${P(b1)} Z`;
  const open = ctrl ? `M${P(b0)} Q${P(ctrl[0])} ${P(tip)} Q${P(ctrl[1])} ${P(b1)}` : `M${P(b0)} L${P(tip)} L${P(b1)}`;
  if (!notch) return { d, open, wrap: x => x, v: "", def: "" };
  const at = t => notch.edge === "a" ? (ctrl ? quad(b0, ctrl[0], tip, t) : lerp(b0, tip, t)) : (ctrl ? quad(tip, ctrl[1], b1, t) : lerp(tip, b1, t));
  const A = at(notch.t - 0.1), B = at(notch.t + 0.1), M = at(notch.t);
  // the V's point goes straight into the ear, square to its edge (toward the ear's middle)
  const cx = (b0[0] + tip[0] + b1[0]) / 3, cy = (b0[1] + tip[1] + b1[1]) / 3;
  const tx = B[0] - A[0], ty = B[1] - A[1], tl = Math.hypot(tx, ty) || 1;
  let ux = -ty / tl, uy = tx / tl;
  if (ux * (cx - M[0]) + uy * (cy - M[1]) < 0) { ux = -ux; uy = -uy; }
  const depth = tl * 0.8, I = [M[0] + ux * depth, M[1] + uy * depth];
  const far = (p, k) => [I[0] + (p[0] - I[0]) * k, I[1] + (p[1] - I[1]) * k];
  const k = `${id}-n${EAR++}`;
  const def = `<clipPath id="${k}"><path d="M-2000 -2000H2000V2000H-2000Z M${P(far(A, 2.2))} L${P(I)} L${P(far(B, 2.2))}Z" clip-rule="evenodd"/></clipPath>`;
  return { d, open, def, wrap: x => `<g clip-path="url(#${k})">${x}</g>`, v: path(`M${P(A)} L${P(I)} L${P(B)}`, "none", C.ink, sw * 0.85), k };
}
/** A whole ear drawn on its own (fill, outline, pink inside, notch). */
function ear(o) {
  const e = earGeom(o);
  return e.def + e.wrap(path(e.d, o.fill, C.ink, o.sw ?? 3.2) + (o.inner ? path(o.inner, C.pink, C.ink, 0) : "")) + e.v;
}
/** An ear re-drawn over a do-rag: fill, its free edges inked (its base comes out of the cloth), pink inside. */
function earOver(e, fill, inner, sw = 3.2) {
  const k2 = e.k ? `${e.k}b` : null;
  const def = k2 ? e.def.replace(`id="${e.k}"`, `id="${k2}"`) : "";
  const body = path(e.d, fill, C.ink, 0) + path(e.open, "none", C.ink, sw) + path(inner, C.pink, C.ink, 0);
  return def + (k2 ? `<g clip-path="url(#${k2})">${body}</g>` : body) + e.v;
}

/**
 * The moonlit rim line for a black cat (README, ART-CHECKLIST §13): the same drawing, every shape
 * recoloured to the rim colour with its stroke widened, laid under the cat, so a thin blue line runs
 * round the whole silhouette (body, head, ears, legs, tail) and shows on any dark ground.
 */
function halo(svg, rim, w = 7) {
  return svg
    .replace(/id="([^"]+)"/g, 'id="$1-rim"').replace(/url\(#([^)]+)\)/g, "url(#$1-rim)")
    .replace(/fill="(?!none)[^"]*"/g, `fill="${rim}"`).replace(/stroke="(?!none)[^"]*"/g, `stroke="${rim}"`)
    .replace(/ opacity="[^"]*"/g, "")
    .replace(/stroke-width="([\d.]+)"/g, (_, v) => `stroke-width="${r1(+v + Math.min(w, +v * 1.4))}"`);
}
const look = o => typeof o.look === "string" ? LOOKS[o.look] : o.look;
const OUT = 3.4; // the silhouette's ink line

/** Several shapes inked as one silhouette: all outlines first, then all fills (no inner seams). */
function union(ds, fill, out = OUT) {
  return ds.map(d => path(d, C.ink, C.ink, out * 2)).join("") + ds.map(d => path(d, fill, C.ink, 0)).join("");
}

// ---------------------------------------------------------------- the gang's gear (shared by every pose)
/** The gang's sign as a small ink tattoo, centred on (x, y), about 16 units wide at k = 0.13. */
function signTattoo(x, y, k = 0.13, rot = 0) {
  const st = `fill="none" stroke="${C.ink}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${r1(1.3 / k)}"`;
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${k})" opacity="0.85"><path d="${GANG_SIGN.head}" ${st}/><path d="${GANG_SIGN.nine}" ${st}/><path d="${GANG_SIGN.whiskers}" ${st}/></g>`;
}
/** A fishbone tattoo along a direction (deg; 90 = pointing down), centred on (x, y), len long. */
function fishbone(x, y, len = 18, rot = 90) {
  const h = len / 2;
  let d = `M${r1(-h + 5)} 0H${r1(h - 5)}`;                          // spine
  for (const t of [-0.15, 0.15, 0.45]) d += `M${r1(t * h)} 0l${r1(-len * 0.14)} ${r1(-len * 0.18)}M${r1(t * h)} 0l${r1(-len * 0.14)} ${r1(len * 0.18)}`; // ribs
  d += `M${r1(h - 5)} 0l5 -4v8z`;                                    // tail fin
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})" opacity="0.85">${circ(-h + 3, 0, 3, "none", C.ink, 1.4)}${path(d, "none", C.ink, 1.4)}</g>`;
}
/** "MUM" in a heart, a tattoo, centred on (x, y), about 18 wide at k = 1. */
function mumHeart(x, y, k = 1, rot = 0) {
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${k})" opacity="0.85">` +
    path("M0 8C-14 -2 -12 -12 -5 -11C-2 -11 0 -8 0 -6C0 -8 2 -11 5 -11C12 -12 14 -2 0 8Z", "none", C.ink, 1.4) +
    `<text x="0" y="-1.5" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-weight="800" font-size="5.6" fill="${C.ink}">MUM</text></g>`;
}
/** A sardine with little wings, a tattoo, centred on (x, y), about 22 long at k = 1. */
function sardine(x, y, k = 1, rot = 0) {
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${k})" opacity="0.85" fill="none" stroke="${C.ink}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="M-9 0Q-2 -6 8 0Q-2 6 -9 0ZM-9 0L-14 -4V4Z"/><circle cx="5" cy="-0.8" r="0.9" fill="${C.ink}"/>` +
    `<path d="M-2 -3Q-4 -12 4 -13Q2 -8 1 -4M1 -4Q6 -11 10 -8Q6 -6 3 -3"/></g>`;
}
/** Every tattoo a look has at one place (at), drawn at (x, y). */
function tattoosAt(L, at, x, y, k = 1, rot = 0) {
  let g = "";
  for (const t of L.tattoos ?? []) if (t.at === at) {
    if (t.mark === "sign") g += signTattoo(x, y, 0.15 * k, rot - 8);
    if (t.mark === "mum") g += mumHeart(x, y + 2 * k, 1.05 * k, rot + 6);
    if (t.mark === "sardine") g += sardine(x, y, 1.1 * k, rot - 10);
    if (t.mark === "fishbone") g += fishbone(x, y, 18 * k, rot);
  }
  return g;
}
/** A shiny bottle cap (crimped edge) at (x, y) — Pip's medal. */
function bottleCap(x, y, r = 7) {
  let d = "";
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = i % 2 ? r * 0.84 : r; d += (i ? "L" : "M") + r1(x + Math.cos(a) * rr) + " " + r1(y + Math.sin(a) * rr); }
  return path(d + "Z", C.accent, C.ink, 1.8) + circ(x, y, r * 0.55, C.accentB, C.ink, 1.2) + circ(x - r * 0.25, y - r * 0.25, r * 0.16, C.light);
}
/** A chunky gold chain along a polyline: links alternately face-on and edge-on. */
function chain(pts, link = 7) {
  let g = "", tot = 0;
  const seg = [];
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); tot += l; }
  const n = Math.max(3, Math.round(tot / (link * 1.25)));
  for (let j = 0; j <= n; j++) {
    let d = j / n * tot, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const u = Math.min(1, d / seg[i]), p = lerp(pts[i], pts[i + 1], u), a = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) * 180 / Math.PI;
    g += j % 2 ? ell(p[0], p[1], link * 0.62, link * 0.24, C.accentB, C.ink, 1.3, ` transform="rotate(${r1(a)} ${r1(p[0])} ${r1(p[1])})"`)
      : ell(p[0], p[1], link * 0.66, link * 0.46, C.accent, C.ink, 1.6, ` transform="rotate(${r1(a)} ${r1(p[0])} ${r1(p[1])})"`) + circ(p[0], p[1], link * 0.18, C.paper2);
  }
  return g;
}
/** A gold hoop earring hanging from (x, y). */
const hoop = (x, y, r = 5.5) => circ(x, y + r, r, "none", C.ink, 3.6) + circ(x, y + r, r, "none", C.accent, 1.8);
/** A brass stud on the ear at (x, y). */
const stud = (x, y, r = 2.6) => circ(x, y, r, C.accentB, C.ink, 1.3);
/** Small dots scattered over a box (Mags's bandana), clipped by the caller. */
function dots(x0, y0, x1, y1, col, step = 9) {
  let g = "";
  for (let yy = y0, row = 0; yy <= y1; yy += step * 0.8, row++) for (let xx = x0 + (row % 2) * step / 2; xx <= x1; xx += step) g += circ(xx, yy, 1.5, col);
  return g;
}
/** A little glint (four-point sparkle) on something shiny. */
export function glint(x, y, r = 6) {
  const b = r * 0.28;
  return `<path d="M${r1(x)} ${r1(y - r)}Q${r1(x + b)} ${r1(y - b)} ${r1(x + r)} ${r1(y)}Q${r1(x + b)} ${r1(y + b)} ${r1(x)} ${r1(y + r)}Q${r1(x - b)} ${r1(y + b)} ${r1(x - r)} ${r1(y)}Q${r1(x - b)} ${r1(y - b)} ${r1(x)} ${r1(y - r)}Z" fill="${C.light}" stroke="${C.ink}" stroke-width="1"/>`;
}

/**
 * Loot held in the teeth at the mouth (mx, my), in a right-facing cat's frame (mirrored with it). Everything
 * hangs straight down from the grip. kind: "leg" (a drumstick by its bone), "watch" (a gold wristwatch by
 * its strap), "cake" (a slice of cake by its narrow end), "ring" (a gold ring with a stone), "chicken"
 * (the whole roast chicken by one drumstick).
 */
export function lootInMouth(kind, mx, my) {
  let g = "";
  if (kind === "leg") {
    g += path(`M${mx - 4} ${my + 2}L${mx - 2} ${my + 14}Q${mx - 14} ${my + 30} ${mx - 4} ${my + 44}Q${mx + 14} ${my + 46} ${mx + 14} ${my + 28}Q${mx + 8} ${my + 16} ${mx + 4} ${my + 12}L${mx + 5} ${my + 2}Z`, C.gingerDeep, C.ink, 2.6);
    g += circ(mx - 3, my - 2, 4.5, C.light, C.ink, 2) + circ(mx + 4, my - 2, 4.5, C.light, C.ink, 2) + path(`M${mx - 6} ${my + 26}q6 6 14 2`, "none", C.ginger, 3);
  } else if (kind === "watch") {
    g += path(`M${mx - 3} ${my}Q${mx - 12} ${my + 18} ${mx - 2} ${my + 30}M${mx + 4} ${my}Q${mx + 14} ${my + 18} ${mx + 4} ${my + 30}`, "none", C.ink, 6) +
      path(`M${mx - 3} ${my}Q${mx - 12} ${my + 18} ${mx - 2} ${my + 30}M${mx + 4} ${my}Q${mx + 14} ${my + 18} ${mx + 4} ${my + 30}`, "none", C.brownDeep, 3.6);
    g += circ(mx + 1, my + 36, 9, C.accent, C.ink, 2.2) + circ(mx + 1, my + 36, 6, C.light, C.ink, 1.2) + path(`M${mx + 1} ${my + 36}v-4 M${mx + 1} ${my + 36}l3 1`, "none", C.ink, 1.2) + glint(mx + 12, my + 28, 5);
  } else if (kind === "cake") {
    // a wedge of chocolate layer cake seen side on (like a slice on a plate, turned tip up): the iced top is its
    // right-hand long side, the cream layers run parallel to it, a blob of cream sits at the wide end
    g += path(`M${mx - 2} ${my - 2}L${mx + 18} ${my + 30}H${mx - 14}Z`, C.brownDeep, C.ink, 2.4);
    g += path(`M${mx - 5} ${my + 6}L${mx + 9.7} ${my + 30} M${mx - 7.7} ${my + 13.3}L${mx + 2.7} ${my + 30}`, "none", C.cream, 2.6);
    g += path(`M${mx} ${my + 3}L${mx + 15} ${my + 27}`, "none", C.light, 4.4) + path(`M${mx - 2} ${my - 2}L${mx + 18} ${my + 30}`, "none", C.ink, 2.4); // the icing
    g += circ(mx + 16, my + 25, 4.6, C.light, C.ink, 1.8); // the cream on top
  } else if (kind === "ring") {
    g += circ(mx + 2, my + 9, 6, "none", C.ink, 4.6) + circ(mx + 2, my + 9, 6, "none", C.accent, 2.6) + path(`M${mx - 2} ${my + 15}l4 6 l4 -6 l-4 -3 Z`, C.eyeBlue, C.ink, 1.4) + glint(mx + 12, my + 6, 5);
  } else if (kind === "chicken") {
    // the whole roast chicken hanging plumb under the grip: the gripped drumstick, the bird below it, the other leg out to the side
    g += path(`M${mx + 18} ${my + 54}L${mx + 34} ${my + 40}L${mx + 40} ${my + 46}L${mx + 26} ${my + 60}Z`, C.gingerDeep, C.ink, 2.6) + circ(mx + 38, my + 38, 4.5, C.light, C.ink, 2) + circ(mx + 43, my + 42, 4.5, C.light, C.ink, 2);
    g += ell(mx + 4, my + 72, 30, 22, C.ginger, C.ink, 3) + ell(mx - 6, my + 64, 10, 6, C.accentB, C.ink, 0, ` opacity="0.7"`) + path(`M${mx - 20} ${my + 80}Q${mx + 4} ${my + 90} ${mx + 28} ${my + 78}`, "none", C.gingerDeep, 2.4);
    g += path(`M${mx - 5} ${my + 4}L${mx - 8} ${my + 30}Q${mx + 2} ${my + 44} ${mx + 14} ${my + 34}L${mx + 6} ${my + 4}Z`, C.gingerDeep, C.ink, 2.6) + circ(mx - 3, my - 1, 4.5, C.light, C.ink, 2) + circ(mx + 4, my - 1, 4.5, C.light, C.ink, 2);
  }
  return g;
}

// ---------------------------------------------------------------- side view
/**
 * A cat seen from the side, facing +x: standing, walking, running, leaping or pulling.
 * o: { look, x, y, s, flip, rot (deg), step (-1 … 1: stride), tailUp (0..1), head (-1 down … 1 up), crouch (0..1), tailLow,
 *      run (a bolting gallop: forelegs reaching, hind legs driving, one hind paw on the ground),
 *      leap (in the air over something: forelegs reaching forward and down, hind legs stretched back, no paw on the ground),
 *      pull (tugging something along the ground: head down and forward, the forepaws braced ahead, the rear sunk back),
 *      carry (loot in the mouth: see lootInMouth), cool (half-lidded eyes) }
 */
export function catSide(o) {
  const L = look(o);
  const { x = 0, y = 0, flip = false, rot = 0, step = 0.5, tailUp = 0.8, head = 0, tailLow = false, run = false, leap = false, pull = false } = o;
  const s = (o.s ?? 1) * (L.size ?? 1);
  const crouch = pull ? 0.5 : run ? Math.max(o.crouch ?? 0, 0.15) : leap ? 0 : (o.crouch ?? 0);
  const ch = L.body === "chonky" ? 1 : 0;
  const k = `${o.id ?? "cat"}${Math.round(x)}${Math.round(y)}`;
  const near = flip ? "left" : "right", far = flip ? "right" : "left"; // facing +x the cat shows its right side
  const coat = L.coat, deep = L.deep;
  const lift = crouch * 36;
  // how far each part of the body sinks: evenly in a crouch; pulling, the rear sinks and the front stays up
  const sink = px => lift * (pull ? clamp(0.62 - px / 220, 0.12, 1) : 1);
  const S = ([px, py]) => [px, py + sink(px)];
  // Running and leaping, the body gathers rather than stretching: it stays about 2.5–3 heads long (a kitten's
  // shorter still), with the stretch going into the legs and the tail (the author's note, 2026-10-21).
  const comp = (run || leap) ? (L.young ? 0.8 : 0.86) : 1, X = v => v * comp, dX = v => X(v) - v;

  // --- the head, and the body's line from the rump to the chest
  const R = 38 + (L.young ? 3 : 0) + ch * 4;
  let hx = 124 + ch * 4, hy = -162 - head * 12;
  if (run || leap) { hx = X(136); hy = -152 - head * 10; }
  if (pull) { hx = 152; hy = -118; }
  hy += sink(hx);
  const backY = -120 - ch * 8, chestY = -68 + ch * 8, waistY = -80 + ch * 24;
  const body = [S([X(-100 - ch * 8), -100]), S([X(-78 - ch * 6), backY - 6]), S([X(-34), backY + 2]), S([X(12), backY + 4]), S([X(54), backY - 6]),
    [hx - R * 0.66, hy + R * 0.08], [hx + R * 0.08, hy + R * 0.66],
    S([X(126 + ch * 4), pull ? -84 : -110]), S([X(112 + ch * 2), chestY - 10]), S([X(82), chestY]), S([X(38), (chestY + waistY) / 2]),
    S([X(-6), waistY]), S([X(-48), waistY - 4 + ch * 2]), S([X(-88 - ch * 6), -88])];
  const bodyD = smooth(body, true);

  // --- where the four paws land: near and far legs of a pair are never on top of each other
  const sep = 24 + 12 * Math.abs(step);
  let nF = 68 + 6 * step + sep / 2, fF = 68 + 6 * step - sep / 2;   // fore: near paw ahead
  let nH = -56 - 6 * step - sep / 2, fH = -56 - 6 * step + sep / 2; // hind: far paw ahead
  let nFy = 0, fFy = 0, nHy = 0, fHy = 0;
  if (run) { nF = 150 + dX(72); fF = 128 + dX(72); nFy = -22; fFy = -10; nH = -138 + dX(-62); fH = -110 + dX(-62); nHy = 0; fHy = -16; }
  if (leap) { nF = 162 + dX(72); fF = 140 + dX(72); nFy = -44; fFy = -30; nH = -150 + dX(-62); fH = -126 + dX(-62); nHy = -40; fHy = -28; }
  if (pull) { nF = 132; fF = 112; nH = -70; fH = -44; }

  // --- legs: one tapered shape each, from inside the body down to a small round paw
  const fore = (T, px, py, thin) => {
    const Wr = [px, py - 12], len = Math.hypot(Wr[0] - T[0], Wr[1] - T[1]), comp = clamp(1 - len / 92, 0, 0.6);
    const E = [T[0] + (Wr[0] - T[0]) * 0.46 - (5 + 46 * comp), T[1] + (Wr[1] - T[1]) * 0.46];
    const c = [T, E, Wr], w = [28 + ch * 7 - thin, 19 + ch * 4 - thin, 13 + ch * 3 - thin];
    return { c, w, d: limbD(c, w), paw: ellD(px + 5, py - 5.5, 11 + ch * 2 - thin / 2, 6.2) };
  };
  const hind = (H, px, py, thin) => {
    const back = leap ? 0 : 1;
    const Ho = [px - (8 + 16 * crouch) * back + (leap ? 18 : 0), py - 24 + 8 * crouch], len = Math.hypot(Ho[0] - H[0], Ho[1] - H[1]), comp = clamp(1 - len / 82, 0, 0.7);
    const K = [(H[0] + Ho[0]) / 2 + (leap ? 6 : 13 + 34 * comp), (H[1] + Ho[1]) / 2 + 4];
    const c = [H, K, Ho, [px, py - 9]], w = [54 + ch * 10 - thin, 26 + ch * 5 - thin, 14 + ch * 3 - thin, 12 + ch * 3 - thin];
    return { c, w, d: limbD(c, w), paw: ellD(px + 3, py - 5.5, 11 + ch * 2 - thin / 2, 6.2) };
  };
  const fN = fore(S([X(72), -98]), nF, nFy, 0), fFar = fore(S([X(62), -100]), fF, fFy, 2);
  const hN = hind(S([X(-62), -98]), nH, nHy, 0), hFar = hind(S([X(-52), -100]), fH, fHy, 2);

  // --- the tail, flowing out of the end of the spine
  const t0 = S([X(-86 - ch * 6), -104]), tdx = dX(-86 - ch * 6);
  const low = L.tail === "kinked" ? [[-128, -112], [-168, -110], [-204, -104], [-216, -120]] : [[-128, -112], [-168, -110], [-206, -102], [-228, -96]];
  const tailPts = leap ? (L.tail === "kinked" ? [[-128, -116], [-168, -124], [-204, -132], [-210, -150]] : [[-128, -116], [-168, -126], [-206, -134], [-232, -138]])
    : (tailLow || run || pull) ? low.map(S)
      : L.tail === "kinked" ? [[-122, -124], [-146, -148 - tailUp * 30], [-152, -184 - tailUp * 40], [-136, -198 - tailUp * 44]]
        : [[-122, -122], [-150, -148 - tailUp * 28], [-158, -186 - tailUp * 36], [-148, -210 - tailUp * 40]];
  const tc = [t0, ...tailPts.map(([tx, ty]) => [tx + tdx, ty])];
  const tw0 = L.tail === "fluffy" ? 24 : 16 + ch * 3, tw1 = L.tail === "fluffy" ? 21 : 10 + ch * 2;
  const tws = tc.map((_, i) => tw0 + (tw1 - tw0) * i / (tc.length - 1));
  const tailD = limbD(tc, tws);

  // --- the head: skull, cheek and muzzle in one curve; the near ear
  const hp = [[hx - R, hy + 4], [hx - R * 0.6, hy - R * 0.85], [hx + 6, hy - R], [hx + R * 0.8, hy - R * 0.55],
    [hx + R + 8, hy - 6], [hx + R + 6, hy + 10], [hx + R * 0.6, hy + R * 0.62], [hx - 4, hy + R * 0.7], [hx - R * 0.8, hy + R * 0.45]];
  const headD = smooth(hp, true);
  const earH = L.ears === "tall" ? 34 : L.ears === "small" ? 22 : 26, round = L.ears === "round";
  const nx = hx + 2, ny = hy - R * 0.82;
  const nEar = earGeom({ b0: [nx - 14, ny + 6], tip: round ? [nx + 4, ny - earH + 2] : [nx - 4, ny - earH], b1: [nx + 18, ny + 2],
    ctrl: round ? [[nx - 8, ny - earH - 4], [nx + 14, ny - 6]] : null, notch: L.notch === near ? { edge: "a", t: 0.6 } : null, id: k });
  const nEarInner = `M${nx - 6} ${ny + 2} L${nx - 2} ${r1(ny - earH * 0.6)} L${nx + 10} ${ny} Z`;
  const fb0 = [hx - R * 0.66, hy - R * 0.6], fb1 = [hx - R * 0.12, hy - R * 0.94];
  const fEarO = { b0: fb0, tip: round ? [hx - R * 0.5, hy - R * 0.82 - earH] : [hx - R * 0.66, hy - R * 0.84 - earH], b1: fb1,
    ctrl: round ? [[hx - R * 0.74, hy - R * 0.8 - earH], [hx - R * 0.16, hy - R * 0.84 - earH]] : null,
    fill: L.patches?.[far]?.ear ?? deep, notch: L.notch === far ? { edge: "a", t: 0.62 } : null, sw: 3, id: k };

  let g = "";
  // far side, behind: the far legs (each one silhouette in the deep tone), the far ear, a far-ear hoop
  for (const lg of [fFar, hFar]) g += union([lg.d, lg.paw], deep, 3);
  if (L.sock === `${far}Front`) g += `<clipPath id="${k}-fs"><path d="${fFar.d}"/><path d="${fFar.paw}"/></clipPath><g clip-path="url(#${k}-fs)"><rect x="${r1(fF - 16)}" y="${r1(fFy - 26)}" width="40" height="40" fill="${C.whiteDeep}"/></g>`;
  if (L.hoop === far) g += hoop(fb0[0] + 4, fb0[1] - 2, 5);
  g += ear(fEarO);

  // near side: one silhouette
  const parts = [tailD, bodyD, hN.d, hN.paw, fN.d, fN.paw, headD];
  g += union(parts, coat) + nEar.def + nEar.wrap(path(nEar.d, C.ink, C.ink, OUT * 2) + path(nEar.d, L.patches?.[near]?.ear ?? coat, C.ink, 0));
  // markings, all inside the silhouette
  let m = "";
  m += ell(X(30), chestY - 6 + sink(30) + ch * 4, X(76 + ch * 10), 11 + ch * 9, L.belly);                 // the paler underside
  m += ell(X(-10), backY + 6 + sink(-10), X(110), 13, deep, C.ink, 0, ` opacity="0.25"`);                // shade along the back
    if (L.tabby) {
    let d = "";
    for (let i = 0; i < 5; i++) { const sx = X(52 - i * 24), by = backY + sink(sx); if ((L.tattoos ?? []).some(t => t.at === `${near}Shoulder`) && i === 0) continue; d += `M${sx} ${r1(by - 12)} q-6 ${22 + (i % 2) * 6} 4 ${38 + ch * 6}`; }
    m += path(d, "none", L.stripe, 5.5);
    m += bars(fN.c, fN.w, (L.tattoos ?? []).some(t => t.at === `${near}Fore`) ? [0.9] : [0.62, 0.8], L.stripe, 4) + bars(hN.c, hN.w, [0.4, 0.75], L.stripe, 4) + bars(tc, tws, [0.3, 0.5, 0.7, 0.88], L.stripe, 4);
    m += path(`M${hx - 6} ${hy - R + 4} l4 14 M${hx + 6} ${hy - R + 2} l2 14 M${hx - 20} ${hy - 24} l10 8`, "none", L.stripe, 4);
  }
  if (L.muzzle) m += ell(hx + R * 0.72, hy + 12, 22, 16, L.muzzle);
  const pz = L.patches?.[near];
  if (pz?.flank) m += ell(X(-30), backY + 26 + sink(-30), X(42), 26, pz.flank);
  if (pz?.face) m += ell(hx - 14, hy - 14, 24, 20, pz.face);
  if (L.patches?.shoulder) m += ell(X(42), backY + 4 + sink(42), 22, 13, L.patches.shoulder);
  if (L.patches?.tailTip) m += path(limbD(tc.slice(2), tws.slice(2)), L.patches.tailTip, C.ink, 0);
  if (L.chestStar) m += starPath(hx - 4 + (pull ? -26 : 0), hy + R * 1.42 + (pull ? 6 : 0), 10, L.chestStar); // the star on the chest
  if (L.sock === `${near}Front`) m += `<rect x="${r1(nF - 16)}" y="${r1(nFy - 26)}" width="40" height="40" fill="${C.white}"/>`;
  { const t = S([X(56), -102]); m += tattoosAt(L, `${near}Shoulder`, t[0], t[1]); }
  { const t = S([X(-70), -94]); m += tattoosAt(L, `${near}Hip`, t[0], t[1]); }
  { const a = along(fN.c, 0.66), b2 = fN.c[2], e2 = fN.c[1]; m += tattoosAt(L, `${near}Fore`, a[0], a[1], 1, Math.atan2(b2[1] - e2[1], b2[0] - e2[0]) * 180 / Math.PI); }
  g += `<clipPath id="${k}-u">${parts.map(d => `<path d="${d}"/>`).join("")}</clipPath><g clip-path="url(#${k}-u)">${m}</g>`;
  g += nEar.wrap(path(nEarInner, C.pink, C.ink, 0)) + nEar.v;
  // toes on the near paws
  g += path(`M${r1(nF + 9)} ${r1(nFy - 9)} l1.5 5 M${r1(nF + 14)} ${r1(nFy - 8)} l1 4 M${r1(nH + 7)} ${r1(nHy - 9)} l1.5 5 M${r1(nH + 12)} ${r1(nHy - 8)} l1 4`, "none", C.ink, 1.6);

  // --- face: one eye in profile, nose, mouth, whiskers (the far side's tips show past the muzzle)
  const ex = hx + R * 0.42, ey = hy - 6;
  g += path(`M${ex - 9} ${ey} Q${ex} ${ey - 9} ${ex + 9} ${ey - 1} Q${ex} ${ey + 7} ${ex - 9} ${ey} Z`, L.eye, C.ink, 2.4);
  g += ell(ex + 2, ey - 1, 2.6, 5.6, C.ink) + circ(ex - 1, ey - 3, 1.6, C.light);
  if (o.cool ?? L.cool) g += path(`M${ex - 9.5} ${ey - 0.5} Q${ex} ${ey - 10} ${ex + 9.5} ${ey - 1.5} L${ex + 9} ${ey - 2.5} Q${ex} ${ey - 3.5} ${ex - 9} ${ey - 1} Z`, coat, C.ink, 2);
  const mx = hx + R + 7, my = hy + 2;
  g += path(`M${mx - 4} ${my - 3} L${mx + 2} ${my - 2} L${mx} ${my + 3} Z`, C.pinkDeep, C.ink, 1.6);
  if ((o.cool ?? L.cool) && !(pull || o.carry)) g += path(`M${mx} ${my + 3} Q${mx - 6} ${my + 14} ${mx - 20} ${my + 6}`, "none", C.ink, 2.2) + path(`M${mx - 8} ${my + 8} l2 6 l3 -6 Z`, C.light, C.ink, 1.2); // a goofy grin, one fang
  else g += path((pull || o.carry) ? `M${mx} ${my + 3} q-3 6 -11 6` : `M${mx} ${my + 3} q-2 7 -9 7 M${mx} ${my + 3} q3 6 0 9`, "none", C.ink, 2);
  const wy = my + 6;
  g += path(`M${mx - 10} ${wy} l30 -8 M${mx - 10} ${wy + 3} l32 1 M${mx - 10} ${wy + 6} l28 9`, "none", C.ink, 1.5);
  g += path(`M${mx + 2} ${wy - 6} l22 -10 M${mx + 3} ${wy - 3} l22 -4`, "none", C.inkSoft, 1.2, ` opacity="0.8"`);
  if (L.fluffy === "kitten") g += path(`M${r1(hx - R * 0.9)} ${r1(hy + R * 0.35)} l-6 5 l7 1 l-5 6 l8 -1`, "none", C.ink, 1.8); // a tuft of kitten fluff at the cheek

  // --- gear, then anything carried in the mouth
  g += sideGear(L, { hx, hy, R, k, near, nEar, nEarInner, headD, coat, nx, ny });
  if (o.carry) g += lootInMouth(o.carry, mx - 6, my + 8);
  const shadowEl = leap ? "" : ell(pull ? 30 : 0, 2, X(120 + ch * 14), 7, C.ink, C.ink, 0, ` opacity="0.16"`); // contact shadow (ART-CHECKLIST §2)
  const tf = `translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ""} scale(${r1((flip ? -s : s) * 1000) / 1000} ${r1(s * 1000) / 1000})`;
  return `<g transform="${tf}">` + shadowEl + (L.rim ? halo(g, L.rim) : "") + g + "</g>";
}
/** Where a pulling cat's teeth grip, in its own (right-facing, unscaled) frame — for what it drags. */
export function pullGrip(lookName) {
  const L = LOOKS[lookName], ch = L.body === "chonky" ? 1 : 0, R = 38 + (L.young ? 3 : 0) + ch * 4;
  const lift = 0.5 * 36, hx = 152, hy = -118 + lift * clamp(0.62 - 152 / 220, 0.12, 1);
  return [hx + R + 1, hy + 10];
}

/** The gear seen from the side (right-facing frame; mirrored with the cat). */
function sideGear(L, { hx, hy, R, k, near, nEar, nEarInner, headD, coat, nx, ny }) {
  let g = "";
  const nape = [hx - R * 0.62, hy + R * 0.42], throat = [hx + R * 0.24, hy + R * 0.76];
  if (L.collar) {
    g += path(`M${r1(nape[0])} ${r1(nape[1])} Q${r1(hx - R * 0.1)} ${r1(hy + R * 0.95)} ${r1(throat[0] + 6)} ${r1(throat[1] - 2)}`, "none", L.collar.col, 7);
    if (L.collar.tag) g += circ(throat[0] + 2, throat[1] + 8, 6, C.accentB, C.ink, 2) + circ(throat[0] + 2, throat[1] + 8, 1.5, C.ink);
  }
  if (L.chain) g += chain([[nape[0] - 2, nape[1] - 2], [hx - R * 0.34, hy + R * 1.08], [throat[0] - 2, throat[1] + 24], [throat[0] + 12, throat[1] + 6]], 13);
  const bd = L.bandana;
  if (bd?.on === "neck") {
    // a kerchief: a band round the neck, knotted at the nape, its point hanging down the chest front
    const drop = bd.big ? 78 : bd.roomy ? 50 : 36, wide = bd.big ? 26 : bd.roomy ? 24 : 18, tip = [throat[0] + 8, throat[1] + drop];
    const flap = `M${r1(throat[0] - wide)} ${r1(throat[1] - 8)} Q${r1(throat[0])} ${r1(throat[1] - 2)} ${r1(throat[0] + wide * 0.8)} ${r1(throat[1] - 10)} Q${r1(tip[0] + 12)} ${r1(throat[1] + drop * 0.5)} ${r1(tip[0])} ${r1(tip[1])} Q${r1(throat[0] - wide * 0.4)} ${r1(throat[1] + drop * 0.4)} ${r1(throat[0] - wide)} ${r1(throat[1] - 8)} Z`;
    const band = `M${r1(nape[0])} ${r1(nape[1] - 5)} Q${r1(hx - R * 0.1)} ${r1(hy + R * 0.92)} ${r1(throat[0] + 14)} ${r1(throat[1] - 8)} L${r1(throat[0] + 10)} ${r1(throat[1] + 4)} Q${r1(hx - R * 0.14)} ${r1(hy + R * 1.12)} ${r1(nape[0] + 2)} ${r1(nape[1] + 8)} Z`;
    g += path(flap, bd.col, C.ink, 2.6) + path(band, bd.col, C.ink, 2.6);
    if (bd.dots) g += `<clipPath id="${k}-bd"><path d="${flap}"/><path d="${band}"/></clipPath><g clip-path="url(#${k}-bd)">${dots(nape[0] - 6, nape[1] - 8, tip[0] + 14, tip[1] + 2, bd.dots)}</g>`;
    // the knot at the nape and its two short ends
    g += path(`M${r1(nape[0] - 2)} ${r1(nape[1] + 1)} l-12 -4 l2 9 Z M${r1(nape[0] - 2)} ${r1(nape[1] + 3)} l-9 9 l8 3 Z`, bd.col, C.ink, 2.2) + circ(nape[0] - 1, nape[1] + 2, 4.5, bd.col, C.ink, 2.2);
  }
  if (L.cap) { // the bottle cap on its string, over the kerchief
    g += path(`M${r1(nape[0] + 4)} ${r1(nape[1] + 2)} Q${r1(hx - R * 0.2)} ${r1(hy + R * 1.05)} ${r1(throat[0] + 8)} ${r1(throat[1] + 16)}`, "none", C.inkSoft, 1.4);
    g += bottleCap(throat[0] + 8, throat[1] + 22, 7);
  }
  if (bd?.on === "head") {
    // a do-rag: the cloth over the crown from the brow to the back of the skull, knotted at the back;
    // the near ear comes out through it
    const F = [hx + R * 0.5, hy - R * 0.5], Bk = [hx - R * 1.02, hy + R * 0.1];
    g += `<clipPath id="${k}-dr"><path d="${headD}"/></clipPath><g clip-path="url(#${k}-dr)">` +
      path(`M${r1(F[0])} ${r1(F[1])} Q${r1(hx - R * 0.2)} ${r1(hy - R * 0.2)} ${r1(Bk[0])} ${r1(Bk[1])} L${r1(hx - R * 1.4)} ${r1(hy - R * 1.6)} L${r1(hx + R * 1.2)} ${r1(hy - R * 1.6)} Z`, bd.col, C.ink, 0) +
      path(`M${r1(hx - R * 0.3)} ${r1(hy - R * 0.62)} q8 -10 18 -12 M${r1(hx - R * 0.66)} ${r1(hy - R * 0.3)} q6 -12 16 -16`, "none", C.blackSoft, 2) + `</g>`;
    g += path(`M${r1(F[0])} ${r1(F[1])} Q${r1(hx - R * 0.2)} ${r1(hy - R * 0.2)} ${r1(Bk[0])} ${r1(Bk[1])}`, "none", C.ink, 2.6);
    g += path(`M${r1(Bk[0] + 2)} ${r1(Bk[1] - 4)} l-16 8 l4 9 Z M${r1(Bk[0] + 2)} ${r1(Bk[1] - 2)} l-10 15 l9 3 Z`, bd.col, C.ink, 2.2) + circ(Bk[0] + 1, Bk[1] - 3, 5, bd.col, C.ink, 2.2); // knot and its ends
    g += earOver(nEar, L.patches?.[near]?.ear ?? coat, nEarInner, OUT);
  }
  if (L.stud === near) g += stud(nx + 10, ny - 1);
  if (L.hoop === near) g += hoop(nx - 11, ny + 4, 5);
  return g;
}

/** A five-pointed star (Velvet's chest mark) centred on (x, y). */
function starPath(x, y, r, fill) {
  let d = "";
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? "L" : "M") + r1(x + Math.cos(a) * rr) + " " + r1(y + Math.sin(a) * rr); }
  return path(d + "Z", fill, C.ink, 0);
}

// ---------------------------------------------------------------- front view, sitting
/**
 * A cat sitting, seen from the front: both eyes, both ears, whiskers both sides,
 * two front legs straight down, haunches at the sides, tail curled round the front paws.
 * o: { look, x, y, s, headTilt (deg), cool (a chin-up, half-lidded, unimpressed look), lean (deg: the whole cat leans) }
 */
export function catSit(o) {
  const L = look(o);
  const { x = 0, y = 0, headTilt = 0, lean = 0 } = o;
  const cool = o.cool ?? L.cool ?? false;
  const s = (o.s ?? 1) * (L.size ?? 1);
  const chonk = L.body === "chonky" ? 1 : 0;
  const long = L.fluffy === "long" ? 1 : 0;
  const k = `${o.id ?? "sit"}${Math.round(x)}${Math.round(y)}`;
  const coat = L.coat;
  const W = 62 + chonk * 16 + long * 10;
  let g = "";
  // tail: from behind the right haunch, curling round the front paws to the left
  const tw = L.tail === "fluffy" ? 22 + long * 8 : 15;
  const tailPts = [[W - 6, -30], [W + 22, -14], [W + 8, -2], [W * 0.2, -4], [-W * 0.55, -6], [-W * 0.75, -16]];
  g += tube(smooth(tailPts), tw, coat);
  if (L.tabby) for (const [tx, ty] of [[W + 14, -10], [W * 0.5, -3], [-W * 0.1, -4], [-W * 0.5, -6]]) g += path(`M${tx} ${ty - tw * 0.4} l0 ${r1(tw * 0.8)}`, "none", L.stripe, 4);
  if (L.patches?.tailTip) g += tube(smooth(tailPts.slice(3)), tw, L.patches.tailTip);
  if (L.tail === "kinked") { // the kink: the last bit of the tail bent sharply up
    const kd = `M${r1(-W * 0.7)} -13 L${r1(-W * 0.79)} -19 L${r1(-W * 0.76)} -36`;
    g += tube(kd, tw, coat) + path(`M${r1(-W * 0.79 - 6)} -27 l12 0`, "none", L.stripe, 4);
  }
  if (long) g += path(tufted([[W - 6, -40], [W + 30, -18], [W + 14, 2], [W * 0.2, 4], [-W * 0.6, 2], [-W * 0.82, -16], [-W * 0.6, -14], [W * 0.2, -14], [W + 4, -16]], 5, 2), coat, C.ink, 3);
  // haunches
  const hw = 34 + chonk * 6 + long * 6;
  if (long) for (const sd of [-1, 1]) g += path(tufted(ellPts(sd * W * 0.62, -38, hw, 38, 8), 5, 2), coat, C.ink, 3.2);
  else g += ell(-W * 0.62, -36, hw, 36, coat, C.ink, 3.2) + ell(W * 0.62, -36, hw, 36, coat, C.ink, 3.2);
  g += tattoosAt(L, "rightHip", -W * 0.7, -44, 1.1) + tattoosAt(L, "leftHip", W * 0.7, -44, 1.1);
  // hind paws peeking out at the sides
  g += ell(-W * 0.9, -6, 18, 8, coat, C.ink, 3) + ell(W * 0.9, -6, 18, 8, coat, C.ink, 3);
  // body (pear)
  const bp = [[0, -170], [W * 0.62, -148], [W * 0.82, -80], [W * 0.66, -14], [0, -8], [-W * 0.66, -14], [-W * 0.82, -80], [-W * 0.62, -148]];
  const bd = smooth(bp, true);
  if (long) g += path(tufted(bp, 6, 3), coat, C.ink, 3.2);
  g += `<clipPath id="${k}-b"><path d="${bd}"/></clipPath>`;
  g += path(bd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-b)">`;
  g += ell(0, -64, W * 0.46, 62, L.belly);
  if (L.tabby) for (let i = 0; i < 3; i++) { g += path(`M${-W * 0.8} ${-120 + i * 26} q16 6 22 18 M${W * 0.8} ${-120 + i * 26} q-16 6 -22 18`, "none", L.stripe, 5); }
  // in the front view the cat's left side is on the viewer's right
  if (L.patches) g += ell(W * 0.55, -110, 30, 36, L.patches.left.flank) + ell(-W * 0.55, -76, 26, 32, L.patches.right.flank);
  if (L.chestStar) g += path(`M0 -132 l6 12 l13 2 l-10 8 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -8 l13 -2 Z`, L.chestStar, C.ink, 0);
  g += tattoosAt(L, "rightShoulder", -W * 0.5, -128, 1.05) + tattoosAt(L, "leftShoulder", W * 0.5, -128, 1.05); // the cat's right is the viewer's left
  g += `</g>`;
  if (!long) g += path(bd, "none", C.ink, 3.4);
  // front legs and paws (two, straight down)
  const lw = 20 + chonk * 4 + long * 4;
  for (const side of [-1, 1]) {
    const lx = side * (W * 0.26);
    const col = (L.sock === "leftFront" && side === 1) ? C.white : coat;
    g += tube(`M${lx} -96 L${lx} -12`, lw, coat);
    if (col !== coat) g += tube(`M${lx} -34 L${lx} -12`, lw, col, C.ink, 0);
    if (L.tabby && !(L.tattoos ?? []).some(t => t.at === (side < 0 ? "rightFore" : "leftFore"))) g += path(`M${lx - lw / 2} -60 h${lw} M${lx - lw / 2} -44 h${lw}`, "none", L.stripe, 4);
    g += tattoosAt(L, side < 0 ? "rightFore" : "leftFore", lx, -72, 1, 90); // the right foreleg is the viewer's left
    g += ell(lx, -8, lw * 0.62, 9, col, C.ink, 3) + path(`M${lx - 4} -14 l0 6 M${lx + 4} -14 l0 6`, "none", C.ink, 1.6);
  }
  g += ell(0, -104, W * 0.52, 24, L.belly === coat ? coat : L.belly); // merge leg tops under the chest
  if (L.chestStar) g += path(`M0 -132 l6 12 l13 2 l-10 8 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -8 l13 -2 Z`, L.chestStar, C.ink, 0);
  if (L.bib) g += path(tufted([[0, -158], [W * 0.42, -134], [W * 0.3, -100], [0, -88], [-W * 0.3, -100], [-W * 0.42, -134]], 5, 2), L.bib, C.ink, 0); // a cream bib of long fur
  // gear on the chest: kerchief, chain, the bottle cap
  const bdn = L.bandana;
  if (bdn?.on === "neck") {
    const drop = bdn.big ? -26 : bdn.roomy ? -84 : -104, hwid = bdn.big ? W * 0.62 : bdn.roomy ? W * 0.6 : W * 0.5;
    const flap = `M${r1(-hwid)} -168 Q0 -156 ${r1(hwid)} -168 L${r1(hwid * 0.2)} ${drop + 6} Q0 ${drop + 12} ${r1(-hwid * 0.2)} ${drop + 6} Z`;
    g += path(flap, bdn.col, C.ink, 2.8);
    if (bdn.dots) g += `<clipPath id="${k}-bd"><path d="${flap}"/></clipPath><g clip-path="url(#${k}-bd)">${dots(-hwid, -168, hwid, drop + 8, bdn.dots)}</g>`;
    g += path(`M${r1(-hwid * 0.6)} -158 Q0 -150 ${r1(hwid * 0.6)} -158`, "none", C.ink, 1.6, ` opacity="0.5"`); // a fold
  }
  if (L.chain) g += chain([[-W * 0.52, -170], [-W * 0.34, -140], [0, -128], [W * 0.34, -140], [W * 0.52, -170]], 13);
  if (L.cap) g += path(`M${r1(-W * 0.36)} -168 Q0 -146 ${r1(W * 0.36)} -168`, "none", C.inkSoft, 1.4) + bottleCap(0, -146, 8);
  // head
  g += `<g transform="rotate(${headTilt} 0 -190)${cool ? " translate(0 -4)" : ""}">` + headFront(L, 0, -196, k, cool) + `</g>`;
  const shadowEl = ell(0, 2, W + 34, 8, C.ink, C.ink, 0, ` opacity="0.16"`);
  const tf = `translate(${r1(x)} ${r1(y)}) scale(${r1(s * 1000) / 1000})`;
  return `<g transform="${tf}">` + shadowEl + (lean ? `<g transform="rotate(${lean} 0 0)">` : "") + (L.rim ? halo(g, L.rim) : "") + g + (lean ? "</g>" : "") + "</g>";
}
/** Points round an ellipse (for a tufted haunch). */
function ellPts(cx, cy, rx, ry, n = 10) { return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; }); }

function headFront(L, hx, hy, k, cool = false) {
  const coat = L.coat;
  const long = L.fluffy === "long" ? 1 : 0;
  const R = 48 + (L.young ? 4 : 0) + (L.body === "chonky" ? 4 : 0) + long * 4;
  let g = "";
  const earH = L.ears === "tall" ? 40 : L.ears === "small" ? 26 - long * 6 : 30;
  // a long-haired cat's ruff: a tufted collar of fur round the face
  if (long) g += path(tufted(ellPts(hx, hy + R * 0.16, R * 1.22, R * 1.0, 12), 6, 2), coat, C.ink, 3.2);
  const ears = [];
  for (const side of [-1, 1]) {
    const bx = hx + side * R * 0.62, by = hy - R * 0.55;
    const catSideName = side > 0 ? "left" : "right"; // viewer's right is the cat's left
    const round = L.ears === "round";
    const b0 = [bx - side * 18, by + 8], tip = round ? [bx + side * 8, by - earH + 4] : [bx + side * 6, by - earH], b1 = [bx + side * 22, by + 14];
    const o = { b0, tip, b1, ctrl: round ? [[bx - side * 6, by - earH - 6], [bx + side * 22, by]] : null,
      fill: L.patches?.[catSideName]?.ear ?? coat,
      inner: `M${bx - side * 8} ${by + 6} L${bx + side * 5} ${r1(by - earH * 0.62)} L${bx + side * 13} ${by + 10} Z`,
      notch: L.notch === catSideName ? { edge: "b", t: 0.24 } : null, id: `${k}f` };
    ears.push({ o, side, catSideName, bx, by, geom: earGeom(o) });
    g += ear(o);
  }
  // Biscuit's do-rag ties at the back: its two ends show behind his head on the viewer's right
  if (L.bandana?.on === "head") g += path(`M${r1(hx + R * 0.86)} ${r1(hy - R * 0.2)} l22 14 l-6 10 Z M${r1(hx + R * 0.9)} ${r1(hy - R * 0.1)} l14 24 l-10 4 Z`, L.bandana.col, C.ink, 2.4);
  const hp = [[hx, hy - R], [hx + R * 0.82, hy - R * 0.62], [hx + R * 1.06, hy + R * 0.1], [hx + R * 0.7, hy + R * 0.72], [hx, hy + R * 0.86],
    [hx - R * 0.7, hy + R * 0.72], [hx - R * 1.06, hy + R * 0.1], [hx - R * 0.82, hy - R * 0.62]];
  const hd = smooth(hp, true);
  if (L.fluffy === "kitten") for (const sd of [-1, 1]) g += path(`M${hx + sd * R * 0.98} ${r1(hy + R * 0.2)} l${sd * 9} 4 l${-sd * 6} 5 l${sd * 8} 5 l${-sd * 9} 3`, coat, C.ink, 2.6); // cheek fluff
  g += `<clipPath id="${k}-hf"><path d="${hd}"/></clipPath>`;
  g += path(hd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-hf)">`;
  if (L.muzzle) g += ell(hx, hy + R * 0.42, R * 0.52, R * 0.34, L.muzzle);
  if (L.tabby) g += path(`M${hx - 12} ${hy - R + 6} l6 18 M${hx} ${hy - R + 2} l0 20 M${hx + 12} ${hy - R + 6} l-6 18 M${hx - R} ${hy} l16 2 M${hx + R} ${hy} l-16 2`, "none", L.stripe, 4.5);
  if (L.patches?.left?.face) g += ell(hx + R * 0.5, hy - R * 0.36, R * 0.5, R * 0.46, L.patches.left.face);
  if (L.bandana?.on === "head") g += path(`M${hx - R * 1.2} ${r1(hy - R * 0.36)} Q${hx} ${r1(hy - R * 0.5)} ${hx + R * 1.2} ${r1(hy - R * 0.36)} V${hy - R * 1.3} H${hx - R * 1.2} Z`, L.bandana.col, C.ink, 0) +
    path(`M${r1(hx - R * 0.5)} ${r1(hy - R * 0.62)} q10 -10 22 -8 M${r1(hx + R * 0.2)} ${r1(hy - R * 0.7)} q10 -6 20 2`, "none", C.blackSoft, 2);
  g += `</g>`;
  if (L.bandana?.on === "head") g += path(`M${r1(hx - R * 1.0)} ${r1(hy - R * 0.33)} Q${hx} ${r1(hy - R * 0.52)} ${r1(hx + R * 1.0)} ${r1(hy - R * 0.33)}`, "none", C.ink, 2.6);
  g += path(hd, "none", C.ink, 3.4);
  // a do-rag goes under the ears: draw the ears again over it, their bases unlined (they come out of the cloth)
  if (L.bandana?.on === "head") for (const e of ears) g += earOver(e.geom, e.o.fill, e.o.inner, 3.2);
  for (const e of ears) {
    if (L.stud === e.catSideName) g += stud(e.bx + e.side * 14, e.by + 10, 3);
    if (L.hoop === e.catSideName) g += hoop(e.bx + e.side * 20, e.by + 12, 7);
  }
  // two eyes (a cool cat looks at you from under level, half-closed lids: no frown)
  for (const side of [-1, 1]) {
    const ex = hx + side * R * 0.4, ey = hy - 2;
    g += path(`M${ex - 12} ${ey} Q${ex} ${ey - 13} ${ex + 12} ${ey} Q${ex} ${ey + 11} ${ex - 12} ${ey} Z`, L.eye, C.ink, 2.4);
    g += ell(ex, ey, 3, 8, C.ink) + circ(ex - 3, ey - 4, 2, C.light);
    // a cool cat's squint is lopsided (one eye narrower than the other): tough, and not quite managing it
    const lid = cool ? (side < 0 ? 4 : -1) : -1.5;
    if (L.lids || cool) g += path(`M${ex - 12.5} ${ey - 1} Q${ex} ${ey - 14} ${ex + 12.5} ${ey - 1} L${ex + 12} ${r1(ey + lid)} Q${ex} ${r1(ey + lid - 2)} ${ex - 12} ${r1(ey + lid)} Z`, coat, C.ink, 2.2);
  }
  // nose and mouth (a cool cat's mouth is a little lopsided smirk)
  const ny = hy + R * 0.3;
  g += path(`M${hx - 7} ${ny - 4} L${hx + 7} ${ny - 4} L${hx} ${ny + 4} Z`, C.pinkDeep, C.ink, 1.8);
  if (L.grin && !cool) { // Pip's eager grin: wide open, both fangs (a kitten trying to look tough)
    g += path(`M${hx - 15} ${ny + 8} Q${hx} ${ny + 26} ${hx + 15} ${ny + 8} Z`, C.pinkDeep, C.ink, 2.2) + path(`M${hx - 9} ${ny + 9.5} l2 5 l2.5 -5 Z M${hx + 9} ${ny + 9.5} l-2 5 l-2.5 -5 Z`, C.light, C.ink, 1.2) + path(`M${hx} ${ny + 4} l0 4`, "none", C.ink, 2);
  } else if (cool) { // a goofy, crooked grin with one fang showing
    g += path(`M${hx - 16} ${ny + 8} Q${hx - 2} ${ny + 22} ${hx + 18} ${ny + 6}`, C.pinkDeep, C.ink, 2.2) + path(`M${hx + 4} ${ny + 13} l3 7 l3 -8 Z`, C.light, C.ink, 1.4) + path(`M${hx} ${ny + 4} l0 5`, "none", C.ink, 2);
  } else g += path(`M${hx} ${ny + 4} l0 6 q-6 6 -12 2 M${hx} ${ny + 10} q6 6 12 2`, "none", C.ink, 2);
  // whiskers on both sides
  for (const side of [-1, 1]) {
    const wx = hx + side * 14, wy = ny + 6;
    g += path(`M${wx} ${wy - 2} l${side * 44} -10 M${wx} ${wy + 2} l${side * 46} 2 M${wx} ${wy + 6} l${side * 42} 12`, "none", C.ink, 1.5);
  }
  if (L.collar) {
    g += path(`M${hx - R * 0.68} ${hy + R * 0.7} Q${hx} ${hy + R * 1.08} ${hx + R * 0.68} ${hy + R * 0.7}`, "none", L.collar.col, 8);
    if (L.collar.tag) g += circ(hx, hy + R * 1.0 + 8, 7, C.accentB, C.ink, 2) + circ(hx, hy + R + 8, 1.6, C.ink);
  }
  if (L.bandana?.on === "neck") g += path(`M${hx - R * 0.66} ${hy + R * 0.7} Q${hx} ${hy + R * 1.06} ${hx + R * 0.66} ${hy + R * 0.7}`, "none", C.ink, 12) + path(`M${hx - R * 0.66} ${hy + R * 0.7} Q${hx} ${hy + R * 1.06} ${hx + R * 0.66} ${hy + R * 0.7}`, "none", L.bandana.col, 7); // the band under the chin
  return g;
}

// ---------------------------------------------------------------- curled up asleep (side)
/**
 * A cat curled up asleep, facing +x: a round body, the head resting on the front paws, eyes
 * closed (one shows from this side), both ears, the tail wrapped round the front. One silhouette
 * for the body and head (no seam where they meet); the tail and paws lie in front.
 * o: { look, x, y, s, flip }
 */
export function catCurl(o) {
  const L = look(o);
  const { x = 0, y = 0, flip = false } = o;
  const s = (o.s ?? 1) * (L.size ?? 1);
  const chonk = L.body === "chonky" ? 1 : 0;
  const near = flip ? "left" : "right", far = flip ? "right" : "left";
  const k = `${o.id ?? "curl"}${Math.round(x)}${Math.round(y)}`;
  let g = "";
  const hx = 96, hy = -44, R = 34 + (L.young ? 3 : 0) + chonk * 3;
  const earH = L.ears === "tall" ? 28 : L.ears === "small" ? 18 : 22;
  const round = L.ears === "round";
  // the far ear, behind
  g += ear({ b0: [hx - R * 0.6, hy - R * 0.5], tip: round ? [hx - R * 0.48, hy - R * 0.72 - earH] : [hx - R * 0.66, hy - R * 0.74 - earH], b1: [hx - R * 0.08, hy - R * 0.86],
    ctrl: round ? [[hx - R * 0.74, hy - R * 0.7 - earH], [hx - R * 0.12, hy - R * 0.74 - earH]] : null,
    fill: L.patches?.[far]?.ear ?? L.deep, notch: L.notch === far ? { edge: "a", t: 0.62 } : null, sw: 3, id: k });
  // body (a loaf on the floor) and head: one silhouette
  const bodyD = smooth([[-92, -4], [-98, -50], [-60, -92 - chonk * 6], [10, -98 - chonk * 6], [62, -76], [80, -30], [70, -4], [0, 0]], true);
  const headD = smooth([[hx - R, hy + 6], [hx - R * 0.6, hy - R * 0.8], [hx + 6, hy - R], [hx + R * 0.8, hy - R * 0.5], [hx + R + 6, hy + 2], [hx + R * 0.7, hy + R * 0.7], [hx - 6, hy + R * 0.8]], true);
  const nx = hx + 2, ny = hy - R * 0.8;
  const nEar = earGeom({ b0: [nx - 12, ny + 6], tip: round ? [nx + 2, ny - earH + 2] : [nx - 4, ny - earH], b1: [nx + 16, ny + 2],
    ctrl: round ? [[nx - 8, ny - earH - 4], [nx + 12, ny - 6]] : null, notch: L.notch === near ? { edge: "a", t: 0.6 } : null, sw: 3, id: k });
  const nInner = `M${nx - 5} ${ny + 2} L${nx - 2} ${r1(ny - earH * 0.6)} L${nx + 9} ${ny} Z`;
  g += union([bodyD, headD], L.coat) + nEar.def + nEar.wrap(path(nEar.d, C.ink, C.ink, 6) + path(nEar.d, L.patches?.[near]?.ear ?? L.coat, C.ink, 0));
  let m = ell(-40, -30, 34, 24, L.deep, C.ink, 0, ` opacity="0.18"`); // the tucked haunch, as shade
  if (L.tabby) for (let i = 0; i < 5; i++) m += path(`M${-70 + i * 28} -100 q-6 22 4 40`, "none", L.stripe, 5.5);
  if (L.tabby) m += path(`M${hx - 4} ${hy - R + 4} l4 12 M${hx + 8} ${hy - R + 2} l2 12`, "none", L.stripe, 4);
  if (L.patches?.[near]?.flank) m += ell(-34, -54, 40, 28, L.patches[near].flank);
  if (L.patches?.shoulder) m += ell(30, -84, 22, 14, L.patches.shoulder);
  if (L.muzzle) m += ell(hx + R * 0.7, hy + 10, 18, 14, L.muzzle);
  if (L.patches?.[near]?.face) m += ell(hx - 10, hy - 10, 20, 18, L.patches[near].face);
  m += tattoosAt(L, `${near}Shoulder`, 34, -70) + tattoosAt(L, `${near}Hip`, -44, -44);
  g += `<clipPath id="${k}-u"><path d="${bodyD}"/><path d="${headD}"/></clipPath><g clip-path="url(#${k}-u)">${m}</g>`;
  g += nEar.wrap(path(nInner, C.pink, C.ink, 0)) + nEar.v;
  // the tucked hind paw, then the tail wrapped along the floor round the front, tip by the nose
  g += ell(-40, -8, 18, 8, L.coat, C.ink, 3);
  const tc = [[-84, -12], [-60, 4], [10, 7], [80, 3], [112, -10]], tw = L.tail === "fluffy" ? 20 : 14, tailD = limbD(tc, tc.map(() => tw));
  g += union([tailD], L.coat, 3);
  if (L.patches?.tailTip) g += `<clipPath id="${k}-t"><path d="${tailD}"/></clipPath><g clip-path="url(#${k}-t)"><rect x="76" y="-30" width="60" height="40" fill="${L.patches.tailTip}"/></g>`;
  if (L.tabby) g += path(`M-40 -4 l2 12 M10 -1 l0 12 M60 -2 l-2 12`, "none", L.stripe, 4);
  if (L.tail === "kinked") g += union([limbD([[108, -8], [118, -16], [114, -28]], [14, 13, 12])], L.coat, 3);
  // front paws together under the chin: the far one behind, the near one in front
  const farPaw = L.sock === `${far}Front` ? C.white : L.coat, nearPaw = L.sock === `${near}Front` ? C.white : L.coat;
  g += ell(92, -14, 18, 9, farPaw, C.ink, 3) + ell(100, -8, 18, 9, nearPaw, C.ink, 3);
  // closed eye, nose, whiskers both sides of the muzzle (the far side's tips show)
  g += path(`M${hx + 8} ${hy - 4} q8 6 16 0`, "none", C.ink, 2.6);
  g += path(`M${hx + R + 2} ${hy - 2} l5 1 l-2 5 Z`, C.pinkDeep, C.ink, 1.4);
  g += path(`M${hx + R - 6} ${hy + 6} l24 -6 M${hx + R - 6} ${hy + 9} l26 2`, "none", C.ink, 1.4) + path(`M${hx + R + 2} ${hy + 1} l18 -8`, "none", C.inkSoft, 1.2);
  // gear
  const nape = [hx - R * 0.7, hy + R * 0.3], throat = [hx + R * 0.1, hy + R * 0.72];
  if (L.collar) {
    g += path(`M${r1(nape[0])} ${r1(nape[1])} Q${hx} ${r1(hy + R * 0.95)} ${r1(throat[0] + 10)} ${r1(throat[1] - 2)}`, "none", L.collar.col, 6);
    if (L.collar.tag) g += circ(throat[0] + 4, throat[1] + 4, 5, C.accentB, C.ink, 1.8);
  }
  if (L.bandana?.on === "neck") g += path(`M${r1(nape[0])} ${r1(nape[1] - 2)} Q${hx} ${r1(hy + R * 1.0)} ${r1(throat[0] + 12)} ${r1(throat[1] - 4)}`, "none", C.ink, 12) +
    path(`M${r1(nape[0])} ${r1(nape[1] - 2)} Q${hx} ${r1(hy + R * 1.0)} ${r1(throat[0] + 12)} ${r1(throat[1] - 4)}`, "none", L.bandana.col, 7) +
    path(`M${r1(throat[0] - 2)} ${r1(throat[1])} l14 2 l-2 ${L.bandana.big ? 16 : 10} Z`, L.bandana.col, C.ink, 2); // its point, folded under the chin
  if (L.chain) g += chain([[nape[0], nape[1]], [hx - R * 0.2, hy + R * 0.95], [throat[0] + 10, throat[1]]], 7);
  if (L.cap) g += bottleCap(throat[0] - 6, throat[1] + 6, 6);
  if (L.bandana?.on === "head") {
    const F = [hx + R * 0.45, hy - R * 0.45], Bk = [hx - R * 1.0, hy + R * 0.1];
    g += `<clipPath id="${k}-dr"><path d="${headD}"/></clipPath><g clip-path="url(#${k}-dr)">${path(`M${r1(F[0])} ${r1(F[1])} Q${r1(hx - R * 0.2)} ${r1(hy - R * 0.2)} ${r1(Bk[0])} ${r1(Bk[1])} L${r1(hx - R * 1.4)} ${r1(hy - R * 1.6)} L${r1(hx + R * 1.2)} ${r1(hy - R * 1.6)} Z`, L.bandana.col, C.ink, 0)}</g>`;
    g += path(`M${r1(F[0])} ${r1(F[1])} Q${r1(hx - R * 0.2)} ${r1(hy - R * 0.2)} ${r1(Bk[0])} ${r1(Bk[1])}`, "none", C.ink, 2.4);
    g += path(`M${r1(Bk[0] + 2)} ${r1(Bk[1] - 4)} l-14 8 l4 8 Z`, L.bandana.col, C.ink, 2) + circ(Bk[0] + 1, Bk[1] - 3, 4.5, L.bandana.col, C.ink, 2);
    g += earOver(nEar, L.patches?.[near]?.ear ?? L.coat, nInner, 3);
  }
  if (L.stud === near) g += stud(nx + 9, ny - 1, 2.4);
  if (L.hoop === near) g += hoop(nx - 9, ny + 4, 4.5);
  const shadowEl = ell(0, 2, 104 + chonk * 8, 7, C.ink, C.ink, 0, ` opacity="0.16"`);
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${r1((flip ? -s : s) * 1000) / 1000} ${r1(s * 1000) / 1000})">` + shadowEl + (L.rim ? halo(g, L.rim) : "") + g + "</g>";
}

// Shape helpers shared with residents.mjs (dogs drawn the same one-silhouette way).
export { smooth, limbD, ellD, union };
