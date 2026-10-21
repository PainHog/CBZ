// Residents: dogs, house cats, the parrot, the robot vacuum. Same rules as the
// cats (ART-CHECKLIST §9–11): four legs and one tail on every dog, two ears,
// contact shadows, and one design per named resident across the book.
import { C, r1, ell, circ, path } from "./lib.mjs";
import { LOOKS, SIZE, smooth, limbD, ellD, union } from "./cats.mjs";

/** Named residents' designs (kept like the gang's reference sheets). */
export const DOGS = {
  // an old spaniel: cream with brown patches, long wavy ears, a feathered tail, a greying muzzle
  pudding: { name: "Pudding", coat: C.cream, deep: C.creamDeep, patch: C.brown, ears: "spaniel", len: 1, leg: 1, muzzle: 1, tail: "feather", old: true },
  // a sausage dog: long and low, ginger, a long snout, a long thin tail
  noodle: { name: "Noodle", coat: C.ginger, deep: C.gingerDeep, patch: null, ears: "floppy", len: 1.35, leg: 0.5, muzzle: 1.3, tail: "thin" },
  // a mastiff: enormous, fawn with a black mask and black folded ears, a thick short tail
  brutus: { name: "Brutus", coat: C.creamDeep, deep: C.wood, patch: null, chest: null, mask: C.blackSoft, earCol: C.blackSoft, ears: "folded", len: 1.2, leg: 1.15, muzzle: 0.8, tail: "stub", big: true },
};
/**
 * Pom-Pom, Grandpa Wendell's house cat: "a large fluffy grey cat". Long silver fur (a tufted outline),
 * a cream ruff, small ears half lost in the fluff, amber eyes under level, half-closed lids (contempt,
 * not a frown), no collar. Drawn 1.2× an adult gang cat. Not a tabby and no red collar, so she never
 * reads as Tilly.
 */
LOOKS.pompom = { name: "Pom-Pom", coat: C.silver, deep: C.silverDeep, stripe: null, belly: C.whiteDeep, bib: C.cream, eye: C.eyeAmber, tabby: false,
  body: "chonky", ears: "small", notch: null, tail: "fluffy", collar: null, fluffy: "long", lids: true, size: SIZE.large };
/** A generic house cat (Chapter 10): a cream-and-white cat in a green collar, no tag. Not a gang cat, not Pom-Pom. */
LOOKS.housecat = { name: "a house cat", coat: C.cream, deep: C.creamDeep, stripe: null, belly: C.white, muzzle: C.white, eye: C.eyeGreen, tabby: false,
  body: "chonky", ears: "tall", notch: null, tail: "plain", collar: { col: C.leaf, tag: false } };

const tube = (d, w, col, sw = 3.2) =>
  `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${r1(w + sw * 2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** A dog's ear seen from the side: far (behind the head, deep tone) or near (over the side of the head). */
function dogEar(D, hx, hy, R, nearEar) {
  const col = nearEar ? (D.earCol ?? D.patch ?? D.deep) : (D.earCol ?? D.deep);
  if (D.ears === "spaniel") { // long, wavy-edged, hanging below the jaw
    const x0 = hx - R * (nearEar ? 0.3 : 0.55), y0 = hy - R * 0.45;
    return path(`M${r1(x0 - 8)} ${r1(y0)} Q${r1(x0 - 22)} ${r1(y0 + R * 0.9)} ${r1(x0 - 10)} ${r1(y0 + R * 1.5)} l6 -5 l5 6 l6 -6 l5 5 Q${r1(x0 + 16)} ${r1(y0 + R * 0.9)} ${r1(x0 + 10)} ${r1(y0)} Z`, col, C.ink, 3);
  }
  if (D.ears === "floppy") return ell(hx - R * (nearEar ? 0.3 : 0.55), hy + R * (nearEar ? 0.25 : 0.1), nearEar ? 12 : 10, nearEar ? 30 : 26, col, C.ink, 3, ` transform="rotate(${nearEar ? 8 : 14} ${r1(hx - R * (nearEar ? 0.3 : 0.55))} ${r1(hy)})"`);
  // folded (a mastiff's): a small flap folded over at the top back of the head, hanging forward
  const x0 = hx - R * (nearEar ? 0.42 : 0.7), y0 = hy - R * (nearEar ? 0.72 : 0.62);
  return path(`M${r1(x0)} ${r1(y0 + 6)} q2 -18 20 -16 q10 8 2 24 q-10 4 -22 -8 Z`, col, C.ink, 3);
}
const dogCut = (D, k) => `dg${k}`;
/**
 * A dog from the side, standing, facing +x: one smooth silhouette (body, neck, head and muzzle, near
 * legs, tail, inked as one shape like the cats), the far legs behind in the deep tone. Four legs, one
 * tail, two ears, one eye in profile. o: { dog, x, y, s, flip, bark }
 */
export function dogSide(o) {
  const D = typeof o.dog === "string" ? DOGS[o.dog] : o.dog;
  const { x = 0, y = 0, s = 1, flip = false, bark = false } = o;
  const k = `${D.name}${Math.round(x)}${Math.round(y)}`.replace(/\W/g, "");
  const len = 100 * D.len, legH = 70 * D.leg, bodyH = D.big ? 84 : 58;
  const top = -(legH + bodyH), bot = -legH;
  const lw = D.big ? 26 : 17;
  // the head: skull and muzzle
  const R = D.big ? 44 : 32, hx = len + 16 + (D.big ? 6 : 0), hy = top - 8 - (D.big ? 4 : 0);
  const mz = 30 * D.muzzle, mx0 = hx + R * 0.36, mh = R * (D.big ? 0.78 : 0.66);
  // the far legs (deep), each one shape with its paw
  const legShape = (x0, y0, x1, w, hock) => hock
    ? limbD([[x0, y0], [x0 + 10, (y0 + 0) * 0.45 - 6], [x1 - 6, -16], [x1, -8]], [w * 1.5, w, w * 0.8, w * 0.75])
    : limbD([[x0, y0], [x0 + 2, (y0 - 8) * 0.5], [x1, -8]], [w * 1.2, w * 0.92, w * 0.8]);
  const paw = (px, w) => ellD(px + 5, -5, w * 0.62 + 2, 6);
  let g = "";
  for (const [lx0, lx1, hock] of [[len * 0.56, len * 0.62, false], [-len * 0.62, -len * 0.66, true]])
    g += union([legShape(lx0, bot - bodyH * 0.4, lx1, lw - 2, hock), paw(lx1, lw - 2)], D.deep, 3);
  g += dogEar(D, hx, hy, R, false);
  // the near side, one silhouette
  const body = smooth([[-len - 6, top + bodyH * 0.3], [-len * 0.6, top - 2], [len * 0.2, top + 4], [len * 0.62, top - 6], [hx - R * 0.6, hy + R * 0.2],
    [hx + R * 0.2, hy + R * 0.8], [len + 14, top + bodyH * 0.55], [len * 0.72, bot + 2], [len * 0.1, bot - 6], [-len * 0.62, bot - 2], [-len - 8, top + bodyH * 0.75]], true);
  const tail = D.tail === "feather" ? limbD([[-len, top + 18], [-len - 26, top - 4], [-len - 34, top - 36]], [16, 13, 10])
    : D.tail === "thin" ? limbD([[-len, top + 16], [-len - 34, top + 8], [-len - 68, top - 12]], [12, 8, 5])
      : limbD([[-len + 2, top + 16], [-len - 18, top + 4], [-len - 28, top - 18]], [22, 18, 14]);
  const head = smooth([[hx - R, hy + R * 0.1], [hx - R * 0.5, hy - R * 0.86], [hx + R * 0.3, hy - R * 0.9], [hx + R * 0.86, hy - R * 0.36],
    [mx0 + mz * 0.5, hy - R * 0.1], [mx0 + mz + 10, hy + R * 0.08], [mx0 + mz + 12, hy + mh * 0.5], [mx0 + mz + 4, hy + mh * (bark ? 0.55 : 0.98)],
    [mx0, hy + mh + 2], [hx - R * 0.2, hy + R * 0.82]], true);
  const jaw = bark ? path(`M${r1(mx0 - 6)} ${r1(hy + mh * 0.62)} L${r1(mx0 + mz + 2)} ${r1(hy + mh * 1.25)} L${r1(mx0 + mz - 4)} ${r1(hy + mh * 1.45)} L${r1(mx0 - 8)} ${r1(hy + mh * 1.0)} Z`, D.mask ?? D.coat, C.ink, 3) : "";
  const fN = legShape(len * 0.7, bot - bodyH * 0.45, len * 0.74, lw, false), hN = legShape(-len * 0.5, bot - bodyH * 0.45, -len * 0.52, lw, true);
  const parts = [tail, body, fN, paw(len * 0.74, lw), hN, paw(-len * 0.52, lw), head];
  if (bark) g += path(`M${r1(mx0 - 4)} ${r1(hy + mh * 0.5)} L${r1(mx0 + mz + 8)} ${r1(hy + mh * 0.56)} L${r1(mx0 + mz)} ${r1(hy + mh * 1.3)} L${r1(mx0 - 6)} ${r1(hy + mh * 1.0)} Z`, C.ink, C.ink, 2) +
    path(`M${r1(mx0 + 4)} ${r1(hy + mh * 0.95)} q${r1(mz * 0.4)} 5 ${r1(mz * 0.7)} 4`, "none", C.pinkDeep, 5) + jaw; // the open mouth, tongue and dropped lower jaw (behind the head)
  g += union(parts, D.coat, 3.4);
  let m = "";
  if (D.patch) m += ell(-len * 0.2, top + bodyH * 0.32, len * 0.38, bodyH * 0.3, D.patch) + ell(len * 0.5, top + bodyH * 0.2, len * 0.16, bodyH * 0.22, D.patch);
  if (D.chest) m += ell(len + 4, top + bodyH * 0.7, 22, bodyH * 0.42, D.chest);
  if (D.mask) m += ell(mx0 + mz * 0.5, hy + mh * 0.45, mz * 0.75 + 6, mh * 0.62, D.mask);
  if (D.old) m += path(`M${r1(mx0 + 6)} ${r1(hy + 10)} l6 4 M${r1(mx0 + 14)} ${r1(hy + 8)} l5 5 M${r1(mx0 + 22)} ${r1(hy + 10)} l4 4`, "none", C.light, 2.2); // a greying muzzle
  if (D.big) m += path(`M${r1(mx0 + 4)} ${r1(hy + mh * 0.75)} q${r1(mz * 0.4)} 10 ${r1(mz * 0.85)} 0`, "none", C.ink, 2.2, ` opacity="0.5"`); // jowls
  g += `<clipPath id="${k}-u">${parts.map(d => `<path d="${d}"/>`).join("")}</clipPath><g clip-path="url(#${k}-u)">${m}</g>`;
  if (bark) g += path(`M${r1(mx0 + mz + 2)} ${r1(hy + mh * 0.56)} l-3 6 M${r1(mx0 + 10)} ${r1(hy + mh * 0.54)} l-2 5`, "none", C.light, 2.4); // teeth
  g += ell(mx0 + mz + 7, hy + 4, D.big ? 9 : 7, D.big ? 7 : 5.5, C.ink); // nose
  if (!bark) g += path(`M${r1(mx0 + 6)} ${r1(hy + mh * 0.78)} q${r1(mz * 0.5)} 5 ${r1(mz)} 0`, "none", C.ink, 2.4);
  // the near eye (profile), set forward of the ear so the ear never covers it; a brow above it
  const ex = hx + R * 0.34, ey = hy - R * 0.24;
  g += ell(ex, ey, 6, 5.4, C.light, C.ink, 2) + circ(ex + 1.5, ey, 3.4, C.ink) + circ(ex + 0.5, ey - 1.4, 1.1, C.light);
  g += path(`M${r1(ex - 8)} ${r1(ey - 9)} q8 ${bark ? 3 : -5} 16 ${bark ? 4 : 0}`, "none", C.ink, 2.6);
  g += dogEar(D, hx, hy, R, true);
  if (bark) g += path(`M${r1(mx0 + mz + 26)} ${r1(hy - 6)} l14 -10 M${r1(mx0 + mz + 28)} ${r1(hy + 6)} l16 0 M${r1(mx0 + mz + 26)} ${r1(hy + 18)} l14 8`, "none", C.ink, 2.4); // the bark
  // toes on the near paws, a contact shadow under the four paws
  g += path(`M${r1(len * 0.74 + 10)} -9 l1.5 5 M${r1(len * 0.74 + 15)} -8 l1 4 M${r1(-len * 0.52 + 10)} -9 l1.5 5 M${r1(-len * 0.52 + 15)} -8 l1 4`, "none", C.ink, 1.6);
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})">` + ell(0, 2, len + 24, 7, C.ink, C.ink, 0, ` opacity="0.16"`) + g + "</g>";
}

/**
 * A dog lying down, facing +x: body flat on the ground (y), the near hind leg folded with its paw
 * tucked forward, both front legs stretched out in front, the chin resting on the front paws (or held
 * up when awake), both ears (the far one shows behind the head), one tail along the ground. The body,
 * head and legs are one silhouette. o: { dog, x, y, s, flip, awake } — awake: head up, eye open, tail wagging.
 */
export function dogLie(o) {
  const D = typeof o.dog === "string" ? DOGS[o.dog] : o.dog;
  const { x = 0, y = 0, s = 1, flip = false, awake = false } = o;
  const k = `${D.name}L${Math.round(x)}${Math.round(y)}`.replace(/\W/g, "");
  const len = 100 * D.len, bodyH = (D.big ? 74 : 58) * 0.86, R = D.big ? 40 : 32;
  const fx = len * 0.62, hx = fx + 50, hy = awake ? -R * 0.72 - 34 : -R * 0.72 - 10;
  const mz = 30 * D.muzzle;
  let g = "";
  // far front leg (deep tone), stretched forward along the ground
  g += union([limbD([[fx - 10, -bodyH * 0.4], [fx + 44, -9]], [14, 12]), ellD(fx + 52, -7, 12, 6)], D.deep, 3);
  g += dogEar(D, hx, hy, R, false);
  // tail
  const tw = D.tail === "thin" ? 9 : D.tail === "stub" ? 16 : 13;
  const tail = awake ? limbD([[-len + 6, -bodyH * 0.55], [-len - 26, -bodyH * 0.9], [-len - 40, -bodyH * 1.3]], [tw + 2, tw, tw - 3])
    : D.tail === "stub" ? limbD([[-len + 2, -bodyH * 0.4], [-len - 18, -bodyH * 0.3]], [tw, tw - 2])
      : limbD([[-len + 6, -bodyH * 0.4], [-len - 30, -bodyH * 0.22], [-len - 44, -8], [-len * 0.5, -7]], [tw, tw, tw - 1, tw - 3]);
  const body = smooth([[-len, -bodyH * 0.5], [-len * 0.6, -bodyH], [len * 0.3, -bodyH * 0.96], [fx + 10, -bodyH * 0.8], [hx - R * 0.7, hy + R * 0.3],
    [fx + 20, -10], [len * 0.2, -2], [-len * 0.7, -2], [-len - 4, -bodyH * 0.2]], true);
  const haunch = ellD(-len * 0.58, -bodyH * 0.46, bodyH * 0.56, bodyH * 0.44);
  const fore = limbD([[fx - 8, -bodyH * 0.34], [fx + 74, -9]], [16, 14]);
  const head = smooth([[hx - R, hy + R * 0.1], [hx - R * 0.5, hy - R * 0.8], [hx + R * 0.3, hy - R * 0.84], [hx + R * 0.86, hy - R * 0.32],
    [hx + R * 0.35 + mz + 8, hy - R * 0.08], [hx + R * 0.35 + mz + 10, hy + R * 0.5], [hx + R * 0.3, hy + R * 0.6], [hx - R * 0.3, hy + R * 0.76]], true);
  const parts = [tail, body, haunch];
  g += union(parts, D.coat);
  // the near foreleg lies in front of the chest, its paw out past the chin; the head rests on it
  g += union([fore, ellD(fx + 82, -6, 13, 6.5)], D.coat, 3) + union([head], D.coat, 3.4);
  parts.push(head);
  let m = "";
  if (D.patch) m += ell(-len * 0.2, -bodyH * 0.62, len * 0.38, bodyH * 0.28, D.patch);
  if (D.mask) m += ell(hx + R * 0.35 + mz * 0.5, hy + R * 0.2, mz * 0.7 + 6, R * 0.4, D.mask);
  if (D.old) m += path(`M${r1(hx + R * 0.4 + 6)} ${r1(hy + 6)} l6 4 M${r1(hx + R * 0.4 + 14)} ${r1(hy + 4)} l5 5`, "none", C.light, 2.2);
  m += path(`M${r1(-len * 0.58 - bodyH * 0.4)} ${r1(-bodyH * 0.2)} Q${r1(-len * 0.58)} ${r1(-bodyH * 1.0)} ${r1(-len * 0.58 + bodyH * 0.5)} ${r1(-bodyH * 0.4)}`, "none", D.deep, 3, ` opacity="0.35"`); // the haunch, as shade
  g += `<clipPath id="${k}-u">${parts.map(d => `<path d="${d}"/>`).join("")}</clipPath><g clip-path="url(#${k}-u)">${m}</g>`;
  g += ell(-len * 0.22, -6, 15, 7, D.coat, C.ink, 3); // the folded hind paw, tucked forward
  if (awake) g += path(`M${r1(-len - 56)} ${r1(-bodyH * 1.1)} q-6 10 0 20 M${r1(-len - 28)} ${r1(-bodyH * 1.6)} q10 -4 18 2`, "none", C.ink, 2.2); // thump, thump
  g += ell(hx + R * 0.35 + mz + 7, hy + 2, 7, 5.5, C.ink); // nose
  if (awake) {
    const ex = hx + R * 0.1, ey = hy - R * 0.28;
    g += ell(ex, ey, 6, 5.4, C.light, C.ink, 2) + circ(ex + 1.5, ey - 0.5, 3.4, C.ink) + circ(ex + 0.5, ey - 1.8, 1.1, C.light);
    g += path(`M${r1(ex - 8)} ${r1(ey - 10)} q8 -4 16 2`, "none", C.ink, 2.4); // a hopeful brow
  } else g += path(`M${r1(hx + R * 0.05)} ${r1(hy - R * 0.22)} q7 6 14 0`, "none", C.ink, 2.6); // closed eye
  g += path(`M${r1(hx + R * 0.45)} ${r1(hy + R * 0.42)} q${r1(mz * 0.4)} 4 ${r1(mz * 0.8)} 0`, "none", C.ink, 2);
  g += dogEar(D, hx, hy, R, true);
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})">` + ell(0, 2, len + 50, 7, C.ink, C.ink, 0, ` opacity="0.16"`) + g + "</g>";
}

/**
 * A parrot in a domed cage hanging from a stand that stands on the floor. The stand's arm ends in a
 * J-hook, and the cage's ring hangs on the hook (the ring passes round the hook's bend). Every bar runs
 * from the base ring up to the dome; the perch is fixed to the bars. o: { x, floorY, s, cover }
 * cover: a cloth thrown over one side of the dome (draped from the top, hanging down the side).
 */
export function parrotStand(o) {
  const { x, floorY, s = 1, cover = false } = o;
  const k = v => r1(v * s);
  const W = 40; // the cage's half-width (unscaled)
  let g = ell(x, floorY + 2, 46 * s, 6 * s, C.ink, C.ink, 0, ` opacity="0.16"`);
  g += path(`M${x - k(40)} ${floorY}L${x} ${floorY - k(16)}L${x + k(40)} ${floorY}`, "none", C.ink, 4); // the stand's feet
  g += `<rect x="${x - k(4)}" y="${floorY - k(250)}" width="${k(8)}" height="${k(236)}" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2"/>`;
  const cx = x + k(64);
  const armY = floorY - k(246);
  // the arm, out from the top of the post, then the hook: down, round a bend, and up to its tip
  const bendY = armY + k(22), hr = k(6);
  const ringR = k(7), ringCy = bendY + ringR - k(1); // the ring's top sits inside the hook's bend, so the hook passes through it
  g += circ(cx, ringCy, ringR, "none", C.accentDeep, 3);
  g += path(`M${x} ${armY}H${cx - hr} V${r1(bendY)} A${hr} ${hr} 0 0 0 ${r1(cx + hr)} ${r1(bendY)} V${r1(bendY - k(8))}`, "none", C.ink, 4);
  g += path(`M${r1(cx)} ${r1(ringCy - ringR)} A${ringR} ${ringR} 0 0 1 ${r1(cx + ringR)} ${r1(ringCy)}`, "none", C.accentDeep, 3); // where the ring crosses in front of the hook
  // the cage: a finial under the ring, the dome, the bars, the base
  const top = ringCy + ringR, domeTop = top + k(8), domeBase = domeTop + k(26), base = domeBase + k(96);
  const domeY = dx => domeBase - (domeBase - domeTop) * Math.sqrt(Math.max(0, 1 - (dx / W) ** 2)); // the dome's height above each bar
  g += `<rect x="${r1(cx - k(3))}" y="${r1(top - k(1))}" width="${k(6)}" height="${k(10)}" fill="${C.accentDeep}" stroke="${C.ink}" stroke-width="1.6"/>`;
  let bars = "";
  for (let i = -3; i <= 3; i++) { const bx = i * 12; bars += `M${r1(cx + k(bx))} ${r1(base)}V${r1(domeY(bx))}`; }
  // parrot inside, standing on the perch (grey with a brick-red tail): body, head, beak, eye, two feet on the perch
  const py = base - k(22);
  g += ell(cx, py - k(26), k(15), k(23), C.grey, C.ink, 2.6) + circ(cx + k(4), py - k(50), k(12), C.grey, C.ink, 2.6);
  g += path(`M${r1(cx + k(14))} ${r1(py - k(52))} q${k(10)} ${k(4)} ${k(2)} ${k(12)} Z`, C.ink, C.ink, 1.6) + circ(cx + k(8), py - k(54), k(2.4), C.ink);
  g += path(`M${r1(cx - k(6))} ${r1(py - k(6))} l${k(-4)} ${k(16)} l${k(10)} 0 Z`, C.brick, C.ink, 2);
  g += path(`M${r1(cx - k(36))} ${r1(py)}H${r1(cx + k(36))}`, "none", C.woodDeep, k(4)); // perch, fixed to the bars at both ends
  g += path(`M${r1(cx - k(4))} ${r1(py - k(4))}v${k(4)} M${r1(cx + k(6))} ${r1(py - k(4))}v${k(4)}`, "none", C.ink, 2.6);
  g += `<path d="${bars}" stroke="${C.accentDeep}" stroke-width="${k(2.4)}"/>`;
  g += path(`M${r1(cx - k(W))} ${r1(domeBase)} A${k(W)} ${k(domeBase / s - domeTop / s)} 0 0 1 ${r1(cx + k(W))} ${r1(domeBase)}`, "none", C.accentDeep, k(3.4)); // the dome
  g += path(`M${r1(cx - k(W))} ${r1(domeBase)}H${r1(cx + k(W))}`, "none", C.accentDeep, k(2.4)); // the band where the dome meets the bars
  g += `<rect x="${r1(cx - k(W + 4))}" y="${r1(base - k(2))}" width="${k(2 * W + 8)}" height="${k(10)}" rx="${k(3)}" fill="${C.accentDeep}" stroke="${C.ink}" stroke-width="2"/>`; // the base tray
  if (cover) {
    // a tea towel thrown over the dome: it lies on the dome's top and hangs straight down the right side
    g += path(`M${r1(cx - k(10))} ${r1(domeTop - k(1))} Q${r1(cx + k(30))} ${r1(domeTop + k(2))} ${r1(cx + k(W + 3))} ${r1(domeBase)} L${r1(cx + k(W + 4))} ${r1(domeBase + k(60))} L${r1(cx + k(W - 22))} ${r1(domeBase + k(54))} L${r1(cx + k(W - 20))} ${r1(domeBase + k(6))} Q${r1(cx)} ${r1(domeTop + k(16))} ${r1(cx - k(10))} ${r1(domeTop - k(1))} Z`, C.eyeBlue, C.ink, 2.4);
    g += path(`M${r1(cx + k(W - 8))} ${r1(domeBase + k(10))} V${r1(domeBase + k(54))} M${r1(cx + k(W - 15))} ${r1(domeBase + k(8))} V${r1(domeBase + k(52))}`, "none", C.light, 2);
  }
  return g;
}

/** A robot vacuum on the floor: a low disc with a bumper, a button and its dust lid. */
export function vacuum(x, floorY, s = 1) {
  let g = ell(x, floorY + 1, 48 * s, 6 * s, C.ink, C.ink, 0, ` opacity="0.18"`);
  g += `<path d="M${r1(x - 46 * s)} ${r1(floorY - 3 * s)}V${r1(floorY - 11 * s)}Q${r1(x - 44 * s)} ${r1(floorY - 17 * s)} ${x} ${r1(floorY - 17 * s)}Q${r1(x + 44 * s)} ${r1(floorY - 17 * s)} ${r1(x + 46 * s)} ${r1(floorY - 11 * s)}V${r1(floorY - 3 * s)}Z" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="3"/>`;
  g += `<rect x="${r1(x - 46 * s)}" y="${r1(floorY - 8 * s)}" width="${r1(92 * s)}" height="${r1(5 * s)}" fill="${C.ink}"/>`; // the bumper
  g += circ(x + 18 * s, floorY - 13 * s, 2.6 * s, C.leaf) + path(`M${r1(x - 24 * s)} ${r1(floorY - 14 * s)}h${r1(30 * s)}`, "none", C.grey, 2);
  return g;
}

// ---------------------------------------------------------------- animal control (the getaway)
const limb = (d, w, col, sw = 3) => tube(d, w, col, sw);
/**
 * A closed hand gripping a pole that runs through it at angle a (deg), at (x, y): the four fingers
 * wrapped round the pole (three creases between them on the back of the hand) and the thumb laid
 * over the top. Five digits, the thumb on the side toward the pole's far end.
 */
function grip(x, y, a, k = 1, skin = C.cream) {
  const r = v => r1(v * k);
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})">` +
    `<rect x="${r(-8)}" y="${r(-9)}" width="${r(16)}" height="${r(18)}" rx="${r(6)}" fill="${skin}" stroke="${C.ink}" stroke-width="2.4"/>` +
    path(`M${r(-8)} ${r(-3)}h${r(16)} M${r(-8)} ${r(2)}h${r(16)} M${r(-8)} ${r(6)}h${r(15)}`, "none", C.ink, 1.2) +   // finger creases
    path(`M${r(-6)} ${r(-9)}q${r(10)} ${r(-6)} ${r(16)} ${r(-1)}`, skin, C.ink, 2.2) + `</g>`;                             // the thumb, over the pole
}
/**
 * The animal control warden (the getaway's chaser), comic, not scary: a full figure seen from the
 * side, running toward +x, holding a catch net on a long pole out in front with both hands. Peaked cap
 * with a paw badge, a big moustache, a green uniform jacket with a pale reflective band, navy
 * trousers, black boots. Two arms, two hands (closed round the pole: four fingers and a thumb each),
 * two legs, one boot on the ground. At s = 1 he is about 270 tall (the book's humans are about 265).
 * o: { x, groundY, s, flip, swing (deg: how far the net is raised, 0 = level) }
 */
export function warden(o) {
  const { x, groundY: gy, s = 1, flip = false, swing = 30 } = o;
  const coat = C.leafDeep, trou = C.dark, skin = C.cream;
  let g = `<g transform="translate(${r1(x)} ${r1(gy)}) scale(${flip ? -s : s} ${s})">`;
  g += ell(4, 2, 70, 7, C.ink, C.ink, 0, ` opacity="0.16"`);
  // the far leg, kicked up behind (deep tone), and the far arm reaching to the pole
  g += limb(`M-4 -128 L-26 -70 L-66 -46`, 26, C.deep) + path(`M-66 -46 l-24 6 l-4 -16 l22 -6 Z`, C.ink, C.ink, 2);       // far boot, lifted
  const shoulder = [18, -206], A = -swing * Math.PI / 180, ux = Math.cos(A), uy = Math.sin(A);
  const h1 = [74, -168], h2 = [h1[0] + ux * 40, h1[1] + uy * 40];                                                            // the two hands on the pole
  g += limb(`M${shoulder[0] - 6} ${shoulder[1] + 6} Q40 -150 ${h1[0]} ${h1[1] + 4}`, 20, C.leafDeep);                           // far arm (behind the body)
  // the pole and its net: a hoop on the far end with a mesh bag hanging from it
  const p0 = [h1[0] - ux * 40, h1[1] - uy * 40], p1 = [h1[0] + ux * 210, h1[1] + uy * 210];
  g += path(`M${r1(p0[0])} ${r1(p0[1])} L${r1(p1[0])} ${r1(p1[1])}`, "none", C.ink, 9) + path(`M${r1(p0[0])} ${r1(p0[1])} L${r1(p1[0])} ${r1(p1[1])}`, "none", C.grey, 5);
  const hc = [p1[0] + ux * 30, p1[1] + uy * 30];
  const net = `M${r1(hc[0] - 34)} ${r1(hc[1])} Q${r1(hc[0] - 26)} ${r1(hc[1] + 62)} ${r1(hc[0] + 4)} ${r1(hc[1] + 70)} Q${r1(hc[0] + 30)} ${r1(hc[1] + 56)} ${r1(hc[0] + 34)} ${r1(hc[1])} Z`;
  const nid = `wd-net${Math.round(x)}${Math.round(gy)}`;
  let mesh = ""; for (let i = -40; i <= 40; i += 10) mesh += `M${r1(hc[0] + i)} ${r1(hc[1] - 4)}l24 80 M${r1(hc[0] + i)} ${r1(hc[1] - 4)}l-24 80 `;
  g += path(net, C.light, C.ink, 0, ` opacity="0.35"`) + `<clipPath id="${nid}"><path d="${net}"/></clipPath><g clip-path="url(#${nid})">${path(mesh, "none", C.ink, 1.3)}</g>` + path(net, "none", C.ink, 2);
  g += ell(hc[0], hc[1], 36, 10, "none", C.ink, 5) + ell(hc[0], hc[1], 36, 10, "none", C.grey, 2.6);                           // the hoop
  // the near leg, planted, its boot flat on the ground
  g += limb(`M8 -126 L30 -66 L36 -14`, 28, trou) + path(`M20 -18 H50 Q66 -16 66 -2 V0 H20 Z`, C.ink, C.ink, 2);
  // the body: jacket leaning into the run, reflective band, paw badge
  g += path(`M-16 -212 Q24 -226 44 -204 L40 -120 Q10 -110 -14 -120 Z`, coat, C.ink, 3);
  g += path(`M-14 -140 L41 -138`, "none", C.light, 7) + path(`M-14 -140 L41 -138`, "none", C.ink, 1, ` opacity="0.4"`);
  g += circ(28, -180, 8, C.accentB, C.ink, 2) + `<g fill="${C.dark}"><ellipse cx="28" cy="-178" rx="3.2" ry="2.6"/><circle cx="24.4" cy="-182.6" r="1.3"/><circle cx="27" cy="-184.6" r="1.3"/><circle cx="29.8" cy="-184.6" r="1.3"/><circle cx="32.2" cy="-182.4" r="1.3"/></g>`;
  // the head in profile: ear, eye, nose, a big moustache, mouth open in a shout; a peaked cap with a paw badge
  const hx = 30, hy = -238;
  g += circ(hx, hy, 23, skin, C.ink, 3) + path(`M${hx + 20} ${hy - 4} q10 4 2 12`, skin, C.ink, 2.4);                     // head, nose
  g += ell(hx - 8, hy + 2, 5, 7, skin, C.ink, 2) + circ(hx + 10, hy - 6, 2.6, C.ink) + path(`M${hx + 4} ${hy - 13} l12 -2`, "none", C.ink, 2.4); // ear, eye, brow
  g += path(`M${hx + 6} ${hy + 8} q8 -2 16 4 q-8 6 -16 2 Z`, C.greyDeep, C.ink, 1.8) + path(`M${hx + 10} ${hy + 14} q6 6 10 0`, C.ink, C.ink, 1.6);  // moustache, open mouth
  g += path(`M${hx - 22} ${hy - 6} Q${hx - 20} ${hy - 30} ${hx + 4} ${hy - 30} Q${hx + 22} ${hy - 28} ${hx + 22} ${hy - 12} Z`, coat, C.ink, 3);   // cap crown
  g += path(`M${hx + 14} ${hy - 12} L${hx + 40} ${hy - 8} L${hx + 14} ${hy - 6} Z`, C.ink, C.ink, 2) + circ(hx + 2, hy - 20, 4.4, C.accentB, C.ink, 1.4);
  // the near arm, from the shoulder to the second hand, then both hands closed round the pole
  g += limb(`M${shoulder[0] + 4} ${shoulder[1] + 4} Q60 -186 ${r1(h2[0])} ${r1(h2[1] + 6)}`, 22, coat);
  g += path(`M${r1(h2[0] - 18)} ${r1(h2[1] + 2)} l8 -8 M${r1(h2[0] - 14)} ${r1(h2[1] + 8)} l8 -8`, "none", C.light, 3);           // cuff band
  g += grip(h1[0], h1[1], -swing, 1, skin) + grip(h2[0], h2[1], -swing, 1, skin);
  return g + "</g>";
}

/**
 * The animal control van: a boxy white van seen from the side, facing +x, both wheels on the road,
 * headlight on, an amber roof beacon, a sliding side door, and a made-up logo (a paw print in a ring)
 * with the words ANIMAL CONTROL. About 330 long and 170 tall at s = 1.
 */
export function van(x, groundY, s = 1) {
  const k = v => r1(v * s), X = v => r1(x + v * s), Y = v => r1(groundY + v * s);
  let g = ell(x, groundY + 2, 170 * s, 9 * s, C.ink, C.ink, 0, ` opacity="0.2"`);
  g += path(`M${X(-160)} ${Y(-26)}V${Y(-150)}Q${X(-160)} ${Y(-160)} ${X(-150)} ${Y(-160)}H${X(70)}L${X(118)} ${Y(-104)}H${X(150)}Q${X(166)} ${Y(-102)} ${X(166)} ${Y(-84)}V${Y(-26)}Z`, C.light, C.ink, 3); // body and cab
  g += path(`M${X(76)} ${Y(-152)}L${X(112)} ${Y(-108)}H${X(76)}Z`, C.sky, C.ink, 2.4) + path(`M${X(84)} ${Y(-140)}l10 12`, "none", C.soft, 3); // windscreen side window
  g += path(`M${X(-40)} ${Y(-150)}V${Y(-30)} M${X(64)} ${Y(-150)}V${Y(-30)} M${X(-160)} ${Y(-60)}H${X(166)}`, "none", C.edge, 2.4);        // sliding door, the rubbing strip
  g += `<rect x="${X(150)}" y="${Y(-96)}" width="${k(16)}" height="${k(12)}" rx="${k(3)}" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/>`;   // headlight
  g += `<rect x="${X(156)}" y="${Y(-40)}" width="${k(16)}" height="${k(12)}" rx="${k(3)}" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="2"/>`; // bumper
  g += `<rect x="${X(-30)}" y="${Y(-172)}" width="${k(30)}" height="${k(12)}" rx="${k(4)}" fill="${C.accent}" stroke="${C.ink}" stroke-width="2"/>` + circ(x - 15 * s, groundY - 178 * s, 10 * s, C.accentB, C.ink, 0, ` opacity="0.6"`); // roof beacon, glowing
  // the logo: a paw print in a ring, and the words
  const lx = x - 100 * s, ly = groundY - 108 * s;
  g += circ(lx, ly, 24 * s, C.light, C.dark, 3) + `<g fill="${C.dark}"><ellipse cx="${r1(lx)}" cy="${r1(ly + 6 * s)}" rx="${k(9)}" ry="${k(7.5)}"/><ellipse cx="${r1(lx - 11 * s)}" cy="${r1(ly - 5 * s)}" rx="${k(3.6)}" ry="${k(4.6)}"/><ellipse cx="${r1(lx - 4 * s)}" cy="${r1(ly - 11 * s)}" rx="${k(3.6)}" ry="${k(4.6)}"/><ellipse cx="${r1(lx + 4 * s)}" cy="${r1(ly - 11 * s)}" rx="${k(3.6)}" ry="${k(4.6)}"/><ellipse cx="${r1(lx + 11 * s)}" cy="${r1(ly - 5 * s)}" rx="${k(3.6)}" ry="${k(4.6)}"/></g>`;
  // the words sit inside the rear panel (between its back edge and the sliding door), whole at any size
  g += `<text x="${X(-100)}" y="${Y(-70)}" text-anchor="middle" textLength="${k(100)}" lengthAdjust="spacingAndGlyphs" font-family="Alegreya Sans, sans-serif" font-weight="800" font-size="${k(12)}" fill="${C.dark}">ANIMAL CONTROL</text>`;
  for (const wx of [-100, 104]) g += circ(x + wx * s, groundY - 22 * s, 22 * s, C.ink) + circ(x + wx * s, groundY - 22 * s, 9 * s, C.grey) + path(`M${X(wx - 32)} ${Y(-26)}Q${X(wx)} ${Y(-60)} ${X(wx + 32)} ${Y(-26)}`, "none", C.ink, 3);
  return g;
}
