// The cat model: every cat in the book is drawn by these functions, so a
// recurring cat keeps one design everywhere (ART-CHECKLIST §10–11). A cat is a
// "look" (coat, markings, eyes, ears, tail, body) plus a pose.
//
// Anatomy rules built in: four legs (two near, two far), one tail, two ears,
// whiskers on both sides of the muzzle, paws with toe beans (never fingers),
// hind legs that bend at the knee (forward) and hock (back).
// Local frame: ground at y = 0, the cat faces +x; scale with the figure transform.
import { C, r1, ell, circ, path } from "./lib.mjs";

const P = p => `${r1(p[0])} ${r1(p[1])}`;

/** The premade gang's looks (reference sheets: book/art/ref-*.svg). */
export const LOOKS = {
  tilly: { name: "Two-Bin Tilly", coat: C.grey, deep: C.greyDeep, stripe: C.greyDeep, belly: C.whiteDeep, eye: C.eyeGreen, tabby: true,
    body: "lean", ears: "tall", notch: null, tail: "plain", collar: { col: C.alarmB, tag: true } },
  biscuit: { name: "Big Biscuit", coat: C.brown, deep: C.brownDeep, stripe: C.brownDeep, belly: C.cream, eye: C.eyeAmber, tabby: true,
    muzzle: C.cream, body: "chonky", ears: "round", notch: "left", tail: "plain", collar: null },   // notch: in his own left ear
  velvet: { name: "Velvet", coat: C.black, deep: "#1a1820", stripe: null, belly: C.black, eye: C.eyeAmber, tabby: false,
    chestStar: C.white, sock: "leftFront", body: "lean", ears: "tall", notch: null, tail: "plain", collar: null, rim: C.soft },
  mags: { name: "Marmalade Mags", coat: C.ginger, deep: C.gingerDeep, stripe: C.gingerDeep, belly: C.cream, eye: C.eyeGreen, tabby: true,
    body: "lean", ears: "tall", notch: null, tail: "kinked", collar: null },
  // Pip's patches belong to her own left and right sides: left face and left flank ginger,
  // right ear and right flank black, a black spot on the shoulders, a black tail tip.
  pip: { name: "Pip", coat: C.white, deep: C.whiteDeep, stripe: null, belly: C.white, eye: C.eyeBlue, tabby: false,
    patches: { left: { face: C.ginger, flank: C.ginger }, right: { ear: C.black, flank: C.black }, shoulder: C.black, tailTip: C.black },
    body: "lean", ears: "small", notch: null, tail: "fluffy", collar: null, young: true },   // drawn at 0.85 scale beside the others
};

// ---------------------------------------------------------------- helpers
/** An outlined tube (limb, tail) along a smooth path: ink underlay, coat on top. */
function tube(d, w, col, ink = C.ink, sw = 3.2) {
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${r1(w + sw * 2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
/** A smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(pts, closed = false) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${P(p[1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return d + (closed ? "Z" : "");
}
/** A paw resting on the ground: an oval with toe lines (toes, not fingers). */
function pawSide(x, y, col, w = 15) {
  return ell(x + 3, y - 5, w, 7, col, C.ink, 3) +
    path(`M${r1(x + w * 0.35)} ${r1(y - 9)} l1.5 6 M${r1(x + w * 0.85)} ${r1(y - 8)} l1 5`, "none", C.ink, 1.8);
}
/** The sole of a raised paw: one big pad and four toe beans (pink). */
export function beans(x, y, s = 1, rot = 0) {
  let g = `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})">`;
  g += ell(0, 4, 8, 6.5, C.pink, C.ink, 1.6);
  for (const [bx, by] of [[-9, -6], [-3, -10], [3, -10], [9, -6]]) g += ell(bx, by, 3.2, 3.6, C.pink, C.ink, 1.4);
  return g + "</g>";
}

// ---------------------------------------------------------------- side view
/**
 * A cat seen from the side, standing or walking, facing +x.
 * o: { look, x, y, s, flip, step (-1 … 1: which pair of legs is forward), tailUp (0..1), head (-1 down … 1 up) }
 */
export function catSide(o) {
  const L = typeof o.look === "string" ? LOOKS[o.look] : o.look;
  const { x = 0, y = 0, s = 1, flip = false, step = 0.5, tailUp = 0.8, head = 0 } = o;
  const chonk = L.body === "chonky" ? 1 : 0;
  const k = `${o.id ?? "cat"}${Math.round(x)}${Math.round(y)}`;
  const coat = L.coat, deep = L.deep;
  const near = flip ? "right" : "left"; // facing +x the cat shows its left side; flipped, its right
  const pz = L.patches ? L.patches[near] : null;
  const backY = -128 - chonk * 6, bellyY = -70 + chonk * 12;
  const legW = 17 + chonk * 4;
  const hx = 124, hy = -162 - head * 12; // head centre
  const tf = `translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})`;
  let g = `<g transform="${tf}">`;
  g += ell(0, 2, 118 + chonk * 10, 7, C.ink, C.ink, 0, ` opacity="0.16"`); // contact shadow (ART-CHECKLIST §2)

  // --- far legs (behind the body, deep tone), offset from the near ones
  const fF = 56 - step * 16, fH = -60 + step * 18;
  const farSock = L.sock === "leftFront" && flip;
  g += tube(smooth([[54, -84], [52, -40], [fF, 0]]), legW - 2, deep);
  if (farSock) g += tube(smooth([[52, -24], [fF, 0]]), legW - 2, C.whiteDeep, C.ink, 0);
  g += pawSide(fF, 0, farSock ? C.whiteDeep : deep, 13);
  g += tube(smooth([[-72, -78], [-58, -56], [fH - 14, -26], [fH, 0]]), legW - 2, deep) + pawSide(fH, 0, deep, 13);

  // --- tail (one tail, from the rump)
  const t0 = [-90, -108];
  const tailPts = L.tail === "kinked"
    ? [t0, [-124, -122], [-148, -146 - tailUp * 30], [-152, -182 - tailUp * 40], [-136, -196 - tailUp * 44]]
    : [t0, [-124, -120], [-152, -146 - tailUp * 28], [-158, -184 - tailUp * 36], [-148, -208 - tailUp * 40]];
  const tw = L.tail === "fluffy" ? 24 : 15 + chonk * 2;
  g += tube(smooth(tailPts), tw, coat);
  if (L.tabby) for (let i = 1; i < tailPts.length - 1; i++) {
    const [a, b] = [tailPts[i], tailPts[i + 1]];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
    const dx = Math.cos(ang) * tw * 0.45, dy = Math.sin(ang) * tw * 0.45;
    g += path(`M${r1(mx - dx)} ${r1(my - dy)} L${r1(mx + dx)} ${r1(my + dy)}`, "none", L.stripe, 4);
  }
  if (L.patches?.tailTip) g += tube(smooth(tailPts.slice(2)), tw, L.patches.tailTip);

  // --- body, with the neck rising behind the head
  const body = [[-90, -110], [-56, backY], [10, backY + 4], [62, backY - 2], [96, -158], [128, -124],
    [104, -92], [80, bellyY - 4], [20, bellyY], [-44, bellyY - 2], [-86, -82]];
  const bd = smooth(body, true);
  g += `<clipPath id="${k}-b"><path d="${bd}"/></clipPath>`;
  g += path(bd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-b)">`;
  g += ell(20, bellyY + 4, 78, 22 + chonk * 6, L.belly);
  g += ell(0, backY + 2, 104, 14, deep, C.ink, 0, ` opacity="0.3"`);
  if (L.tabby) for (let i = 0; i < 5; i++) {
    const sx = 52 - i * 24;
    g += path(`M${sx} ${backY - 2} q-6 ${20 + (i % 2) * 6} 4 ${36 + chonk * 4}`, "none", L.stripe, 5.5);
  }
  if (pz?.flank) g += ell(-30, backY + 22, 40, 26, pz.flank);
  if (L.patches?.shoulder) g += ell(40, backY + 4, 22, 14, L.patches.shoulder);
  if (L.chestStar) g += ell(110, -104, 9, 13, L.chestStar);
  g += `</g>`;
  if (L.rim) g += path(bd, "none", L.rim, 2);
  g += path(bd, "none", C.ink, 3.4);

  // --- near hind leg: haunch (thigh) on the body, then shin back to the hock and down to the paw
  const nH = -62 - step * 16, nF = 78 + step * 14;
  const thigh = smooth([[-80, -100], [-52, -112], [-28, -90], [-34, -62], [-60, -56], [-84, -72]], true);
  g += path(thigh, coat, C.ink, 0);
  if (pz?.flank) g += `<g clip-path="url(#${k}-b)">${ell(-56, -96, 26, 16, pz.flank)}</g>`;
  g += tube(smooth([[-42, -66], [nH - 12, -28], [nH, 0]]), legW, coat);
  g += path(thigh, coat, C.ink, 0);
  g += path(`M-84 -74 Q-60 -54 -34 -62 Q-26 -86 -40 -104`, "none", C.ink, 3); // haunch contour
  if (L.tabby) g += path(`M-66 -96 q12 8 20 0 M-70 -80 q14 8 26 0`, "none", L.stripe, 4.5);
  g += pawSide(nH, 0, coat, 15);

  // --- near front leg (merges into the chest)
  const sockCol = L.sock === "leftFront" && !flip ? C.white : coat;
  g += tube(smooth([[80, -84], [78, -40], [nF, 0]]), legW, coat);
  if (sockCol !== coat) g += tube(smooth([[78, -24], [nF, 0]]), legW, sockCol, C.ink, 0);
  g += ell(84, -84, 14, 12, coat);
  g += path(`M${r1(80 - legW / 2 - 3)} -60 Q${r1(80 - legW / 2 - 3)} -76 72 -84`, "none", C.ink, 3);
  g += pawSide(nF, 0, sockCol, 15);

  // --- head
  g += headSide(L, hx, hy, k, { ...o, near });
  return g + "</g>";
}

function headSide(L, hx, hy, k, o) {
  const coat = L.coat, deep = L.deep;
  const young = L.young ? 1 : 0;
  const R = 38 + young * 3;
  let g = "";
  // far ear (behind the head, deep tone)
  const earH = L.ears === "tall" ? 34 : L.ears === "small" ? 22 : 26;
  const farSide = o.near === "left" ? "right" : "left";
  g += path(`M${hx - 22} ${hy - 22} L${hx - 26} ${hy - 22 - earH} L${hx - 2} ${hy - 30} Z`, L.patches?.[farSide]?.ear ?? deep, C.ink, 3);
  // head shape with muzzle
  const hd = smooth([[hx - R, hy + 4], [hx - R * 0.6, hy - R * 0.85], [hx + 6, hy - R], [hx + R * 0.8, hy - R * 0.55],
    [hx + R + 8, hy - 6], [hx + R + 6, hy + 10], [hx + R * 0.6, hy + R * 0.62], [hx - 4, hy + R * 0.7], [hx - R * 0.8, hy + R * 0.45]], true);
  g += `<clipPath id="${k}-h"><path d="${hd}"/></clipPath>`;
  g += path(hd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-h)">`;
  if (L.muzzle) g += ell(hx + R * 0.72, hy + 12, 22, 16, L.muzzle);
  if (L.tabby) g += path(`M${hx - 6} ${hy - R + 4} l4 14 M${hx + 6} ${hy - R + 2} l2 14 M${hx - 20} ${hy - 24} l10 8`, "none", L.stripe, 4);
  const pzh = L.patches ? L.patches[o.near] : null;
  if (pzh?.face) g += ell(hx - 14, hy - 14, 24, 20, pzh.face);
  g += `</g>`;
  g += path(hd, "none", L.rim ?? C.ink, L.rim ? 2 : 0) + path(hd, "none", C.ink, 3.4);
  // near ear (in front)
  const nx = hx + 2, ny = hy - R * 0.82;
  let ear = `M${nx - 14} ${ny + 6} L${nx - 4} ${ny - earH} L${nx + 18} ${ny + 2} Z`;
  if (L.ears === "round") ear = `M${nx - 14} ${ny + 6} Q${nx - 8} ${ny - earH - 4} ${nx + 4} ${ny - earH + 2} Q${nx + 14} ${ny - 6} ${nx + 18} ${ny + 2} Z`;
  g += path(ear, pzh?.ear ?? coat, C.ink, 3.2);
  g += path(`M${nx - 6} ${ny + 2} L${nx - 2} ${ny - earH * 0.6} L${nx + 10} ${ny} Z`, C.pink, C.ink, 0);
  if (L.notch === o.near) {
    // a notch bitten out of the ear's back edge (a scar), drawn as a V cut in the page colour
    g += path(`M${nx + 6} ${ny - earH * 0.42} l7 3 l-3 6`, C.paper, C.ink, 2.4);
  }
  // eye (profile: one eye shows), nose, mouth
  const ex = hx + R * 0.42, ey = hy - 6;
  g += path(`M${ex - 9} ${ey} Q${ex} ${ey - 9} ${ex + 9} ${ey - 1} Q${ex} ${ey + 7} ${ex - 9} ${ey} Z`, L.eye, C.ink, 2.4);
  g += ell(ex + 2, ey - 1, 2.6, 5.6, C.ink);
  g += circ(ex - 1, ey - 3, 1.6, C.light);
  const mx = hx + R + 7, my = hy + 2;
  g += path(`M${mx - 4} ${my - 3} L${mx + 2} ${my - 2} L${mx} ${my + 3} Z`, C.pinkDeep, C.ink, 1.6);
  g += path(`M${mx} ${my + 3} q-2 7 -9 7 M${mx} ${my + 3} q3 6 0 9`, "none", C.ink, 2);
  // whiskers: near side (three, in front of the muzzle) and the far side's tips beyond it
  const wy = my + 6;
  g += path(`M${mx - 10} ${wy} l30 -8 M${mx - 10} ${wy + 3} l32 1 M${mx - 10} ${wy + 6} l28 9`, "none", C.ink, 1.5);
  g += path(`M${mx + 2} ${wy - 6} l22 -10 M${mx + 3} ${wy - 3} l22 -4`, "none", C.inkSoft, 1.2, ` opacity="0.8"`);
  // collar
  if (L.collar) {
    g += path(`M${hx - R * 0.55} ${hy + R * 0.42} Q${hx} ${hy + R * 0.95} ${hx + R * 0.55} ${hy + R * 0.66}`, "none", L.collar.col, 7);
    if (L.collar.tag) g += circ(hx + 4, hy + R * 0.95 + 6, 6, C.accentB, C.ink, 2) + circ(hx + 4, hy + R * 0.95 + 6, 1.5, C.ink);
  }
  return g;
}

// ---------------------------------------------------------------- front view, sitting
/**
 * A cat sitting, seen from the front: both eyes, both ears, whiskers both sides,
 * two front legs straight down, haunches at the sides, tail curled round the front paws.
 * o: { look, x, y, s, blink (0..1), headTilt (deg) }
 */
export function catSit(o) {
  const L = typeof o.look === "string" ? LOOKS[o.look] : o.look;
  const { x = 0, y = 0, s = 1, headTilt = 0 } = o;
  const chonk = L.body === "chonky" ? 1 : 0;
  const k = `${o.id ?? "sit"}${Math.round(x)}${Math.round(y)}`;
  const coat = L.coat, deep = L.deep;
  const W = 62 + chonk * 16;
  let g = `<g transform="translate(${r1(x)} ${r1(y)}) scale(${s})">`;
  g += ell(0, 2, W + 34, 8, C.ink, C.ink, 0, ` opacity="0.16"`);
  // tail: from behind the right haunch, curling round the front paws to the left
  const tw = L.tail === "fluffy" ? 22 : 15;
  const tailPts = [[W - 6, -30], [W + 22, -14], [W + 8, -2], [W * 0.2, -4], [-W * 0.55, -6], [-W * 0.75, -16]];
  g += tube(smooth(tailPts), tw, coat);
  if (L.tabby) for (const [tx, ty] of [[W + 14, -10], [W * 0.5, -3], [-W * 0.1, -4], [-W * 0.5, -6]]) g += path(`M${tx} ${ty - tw * 0.4} l0 ${r1(tw * 0.8)}`, "none", L.stripe, 4);
  if (L.patches?.tailTip) g += tube(smooth(tailPts.slice(3)), tw, L.patches.tailTip);
  // haunches
  g += ell(-W * 0.62, -36, 34 + chonk * 6, 36, coat, C.ink, 3.2) + ell(W * 0.62, -36, 34 + chonk * 6, 36, coat, C.ink, 3.2);
  // hind paws peeking out at the sides
  g += ell(-W * 0.9, -6, 18, 8, coat, C.ink, 3) + ell(W * 0.9, -6, 18, 8, coat, C.ink, 3);
  // body (pear)
  const bd = smooth([[0, -170], [W * 0.62, -148], [W * 0.82, -80], [W * 0.66, -14], [0, -8], [-W * 0.66, -14], [-W * 0.82, -80], [-W * 0.62, -148]], true);
  g += `<clipPath id="${k}-b"><path d="${bd}"/></clipPath>`;
  g += path(bd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-b)">`;
  g += ell(0, -64, W * 0.46, 62, L.belly);
  if (L.tabby) for (let i = 0; i < 3; i++) { g += path(`M${-W * 0.8} ${-120 + i * 26} q16 6 22 18 M${W * 0.8} ${-120 + i * 26} q-16 6 -22 18`, "none", L.stripe, 5); }
  // in the front view the cat's left side is on the viewer's right
  if (L.patches) g += ell(W * 0.55, -110, 30, 36, L.patches.left.flank) + ell(-W * 0.55, -76, 26, 32, L.patches.right.flank);
  if (L.chestStar) g += path(`M0 -132 l6 12 l13 2 l-10 8 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -8 l13 -2 Z`, L.chestStar, C.ink, 0);
  g += `</g>`;
  g += path(bd, "none", L.rim ?? C.ink, L.rim ? 2 : 0) + path(bd, "none", C.ink, 3.4);
  // front legs and paws (two, straight down)
  const lw = 20 + chonk * 4;
  for (const side of [-1, 1]) {
    const lx = side * (W * 0.26);
    const col = (L.sock === "leftFront" && side === 1) ? C.white : coat;
    g += tube(`M${lx} -96 L${lx} -12`, lw, coat);
    if (col !== coat) g += tube(`M${lx} -34 L${lx} -12`, lw, col, C.ink, 0);
    g += ell(lx, -8, lw * 0.62, 9, col, C.ink, 3) + path(`M${lx - 4} -14 l0 6 M${lx + 4} -14 l0 6`, "none", C.ink, 1.6);
  }
  g += ell(0, -104, W * 0.52, 24, L.belly === coat ? coat : L.belly); // merge leg tops under the chest
  if (L.chestStar) g += path(`M0 -132 l6 12 l13 2 l-10 8 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -8 l13 -2 Z`, L.chestStar, C.ink, 0);
  // head
  g += `<g transform="rotate(${headTilt} 0 -190)">` + headFront(L, 0, -196, k) + `</g>`;
  return g + "</g>";
}

function headFront(L, hx, hy, k) {
  const coat = L.coat, deep = L.deep;
  const R = 48 + (L.young ? 4 : 0) + (L.body === "chonky" ? 4 : 0);
  let g = "";
  const earH = L.ears === "tall" ? 40 : L.ears === "small" ? 26 : 30;
  for (const side of [-1, 1]) {
    const bx = hx + side * R * 0.62, by = hy - R * 0.55;
    let d = `M${bx - side * 18} ${by + 8} L${bx + side * 6} ${by - earH} L${bx + side * 22} ${by + 14} Z`;
    if (L.ears === "round") d = `M${bx - side * 18} ${by + 8} Q${bx - side * 6} ${by - earH - 6} ${bx + side * 8} ${by - earH + 4} Q${bx + side * 22} ${by} ${bx + side * 22} ${by + 14} Z`;
    const catSide = side > 0 ? "left" : "right"; // viewer's right is the cat's left
    g += path(d, L.patches?.[catSide]?.ear ?? coat, C.ink, 3.2);
    g += path(`M${bx - side * 8} ${by + 6} L${bx + side * 5} ${by - earH * 0.62} L${bx + side * 13} ${by + 10} Z`, C.pink, C.ink, 0);
    if (L.notch === catSide) g += path(`M${bx + side * 14} ${by - earH * 0.35} l${side * 8} 2 l${-side * 4} 7`, C.paper, C.ink, 2.4);
  }
  const hd = smooth([[hx, hy - R], [hx + R * 0.82, hy - R * 0.62], [hx + R * 1.06, hy + R * 0.1], [hx + R * 0.7, hy + R * 0.72], [hx, hy + R * 0.86],
    [hx - R * 0.7, hy + R * 0.72], [hx - R * 1.06, hy + R * 0.1], [hx - R * 0.82, hy - R * 0.62]], true);
  g += `<clipPath id="${k}-hf"><path d="${hd}"/></clipPath>`;
  g += path(hd, coat, C.ink, 0);
  g += `<g clip-path="url(#${k}-hf)">`;
  if (L.muzzle) g += ell(hx, hy + R * 0.42, R * 0.52, R * 0.34, L.muzzle);
  if (L.tabby) g += path(`M${hx - 12} ${hy - R + 6} l6 18 M${hx} ${hy - R + 2} l0 20 M${hx + 12} ${hy - R + 6} l-6 18 M${hx - R} ${hy} l16 2 M${hx + R} ${hy} l-16 2`, "none", L.stripe, 4.5);
  if (L.patches?.left?.face) g += ell(hx + R * 0.5, hy - R * 0.36, R * 0.5, R * 0.46, L.patches.left.face);
  g += `</g>`;
  g += path(hd, "none", L.rim ?? C.ink, L.rim ? 2 : 0) + path(hd, "none", C.ink, 3.4);
  // two eyes
  for (const side of [-1, 1]) {
    const ex = hx + side * R * 0.4, ey = hy - 2;
    g += path(`M${ex - 12} ${ey} Q${ex} ${ey - 13} ${ex + 12} ${ey} Q${ex} ${ey + 11} ${ex - 12} ${ey} Z`, L.eye, C.ink, 2.4);
    g += ell(ex, ey, 3, 8, C.ink) + circ(ex - 3, ey - 4, 2, C.light);
  }
  // nose and mouth
  const ny = hy + R * 0.3;
  g += path(`M${hx - 7} ${ny - 4} L${hx + 7} ${ny - 4} L${hx} ${ny + 4} Z`, C.pinkDeep, C.ink, 1.8);
  g += path(`M${hx} ${ny + 4} l0 6 q-6 6 -12 2 M${hx} ${ny + 10} q6 6 12 2`, "none", C.ink, 2);
  // whiskers on both sides
  for (const side of [-1, 1]) {
    const wx = hx + side * 14, wy = ny + 6;
    g += path(`M${wx} ${wy - 2} l${side * 44} -10 M${wx} ${wy + 2} l${side * 46} 2 M${wx} ${wy + 6} l${side * 42} 12`, "none", C.ink, 1.5);
  }
  if (L.collar) {
    g += path(`M${hx - R * 0.68} ${hy + R * 0.7} Q${hx} ${hy + R * 1.08} ${hx + R * 0.68} ${hy + R * 0.7}`, "none", L.collar.col, 8);
    if (L.collar.tag) g += circ(hx, hy + R * 1.0 + 8, 7, C.accentB, C.ink, 2) + circ(hx, hy + R + 8, 1.6, C.ink);
  }
  return g;
}
