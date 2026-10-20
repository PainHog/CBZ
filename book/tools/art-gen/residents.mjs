// Residents: dogs, house cats, the parrot, the robot vacuum. Same rules as the
// cats (ART-CHECKLIST §9–11): four legs and one tail on every dog, two ears,
// contact shadows, and one design per named resident across the book.
import { C, r1, ell, circ, path } from "./lib.mjs";
import { LOOKS } from "./cats.mjs";

/** Named residents' designs (kept like the gang's reference sheets). */
export const DOGS = {
  pudding: { name: "Pudding", coat: C.cream, deep: C.creamDeep, patch: C.brown, ears: "floppy", len: 1, leg: 1, muzzle: 1, tail: "wag" },        // an old spaniel
  noodle: { name: "Noodle", coat: C.ginger, deep: C.gingerDeep, patch: null, ears: "floppy", len: 1.35, leg: 0.55, muzzle: 1.2, tail: "thin" },   // a sausage dog
  brutus: { name: "Brutus", coat: C.greyDeep, deep: C.ink, patch: C.white, ears: "folded", len: 1.25, leg: 1.2, muzzle: 0.8, tail: "stub", big: true }, // a mastiff
};
LOOKS.pompom = { name: "Pom-Pom", coat: C.grey, deep: C.greyDeep, stripe: null, belly: C.whiteDeep, eye: C.eyeAmber, tabby: false,
  body: "chonky", ears: "small", notch: null, tail: "fluffy", collar: { col: C.cuddle, tag: true } };

const tube = (d, w, col, sw = 3.2) =>
  `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${r1(w + sw * 2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * A dog from the side, standing, facing +x. Four legs (two far in the deep tone), one tail, two ears.
 * o: { dog, x, y, s, flip, bark, asleep }
 */
export function dogSide(o) {
  const D = typeof o.dog === "string" ? DOGS[o.dog] : o.dog;
  const { x = 0, y = 0, s = 1, flip = false, bark = false } = o;
  const len = 100 * D.len, legH = 70 * D.leg, bodyH = D.big ? 74 : 58;
  const top = -(legH + bodyH);
  let g = `<g transform="translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})">`;
  g += ell(0, 2, len + 20, 7, C.ink, C.ink, 0, ` opacity="0.16"`);
  // far legs
  for (const lx of [len * 0.62, -len * 0.6]) g += tube(`M${r1(lx - 8)} ${r1(-legH - 10)} L${r1(lx - 10)} -6`, 15 + (D.big ? 6 : 0), D.deep) + ell(lx - 6, -5, 12, 6, D.deep, C.ink, 3);
  // tail
  if (D.tail === "wag") g += tube(`M${r1(-len)} ${r1(top + 22)} Q${r1(-len - 40)} ${r1(top - 10)} ${r1(-len - 30)} ${r1(top - 40)}`, 14, D.coat);
  if (D.tail === "thin") g += tube(`M${r1(-len)} ${r1(top + 18)} Q${r1(-len - 50)} ${r1(top + 6)} ${r1(-len - 70)} ${r1(top - 10)}`, 9, D.coat);
  if (D.tail === "stub") g += tube(`M${r1(-len)} ${r1(top + 20)} l-22 -14`, 16, D.coat);
  // body
  g += `<rect x="${r1(-len - 8)}" y="${r1(top)}" width="${r1(len * 2 + 16)}" height="${bodyH}" rx="${r1(bodyH / 2)}" fill="${D.coat}" stroke="${C.ink}" stroke-width="3.4"/>`;
  if (D.patch) g += `<ellipse cx="${r1(-len * 0.2)}" cy="${r1(top + bodyH * 0.35)}" rx="${r1(len * 0.38)}" ry="${r1(bodyH * 0.3)}" fill="${D.patch}"/>`;
  // near legs
  for (const lx of [len * 0.72, -len * 0.5]) g += tube(`M${r1(lx)} ${r1(-legH - 10)} L${r1(lx + 2)} -6`, 16 + (D.big ? 6 : 0), D.coat) + ell(lx + 6, -5, 13, 6, D.coat, C.ink, 3);
  // head
  const hx = len + 14, hy = top - 6, R = D.big ? 40 : 32;
  g += ell(hx, hy, R, R * 0.9, D.coat, C.ink, 3.4);
  const mz = 30 * D.muzzle;
  g += `<rect x="${r1(hx + R * 0.4)}" y="${r1(hy + 2)}" width="${r1(mz + 10)}" height="${r1(R * 0.7)}" rx="10" fill="${D.coat}" stroke="${C.ink}" stroke-width="3"/>`;
  g += ell(hx + R * 0.4 + mz + 6, hy + 6, 8, 6, C.ink); // nose
  if (bark) g += path(`M${r1(hx + R * 0.5)} ${r1(hy + R * 0.7 + 2)} l${r1(mz)} 8`, "none", C.ink, 3) + path(`M${r1(hx + R + mz + 16)} ${r1(hy - 6)} l14 -10 M${r1(hx + R + mz + 18)} ${r1(hy + 4)} l16 0`, "none", C.ink, 2.4);
  else g += path(`M${r1(hx + R * 0.5)} ${r1(hy + R * 0.62)} q${r1(mz * 0.5)} 6 ${r1(mz)} 0`, "none", C.ink, 2.4);
  g += circ(hx + R * 0.25, hy - R * 0.2, 4.6, C.ink) + circ(hx + R * 0.22, hy - R * 0.28, 1.4, C.light); // the near eye (profile)
  // ears: the far one behind, the near one in front
  if (D.ears === "floppy") {
    g += ell(hx - R * 0.55, hy + R * 0.1, 10, 26, D.deep, C.ink, 3, ` transform="rotate(14 ${r1(hx - R * 0.55)} ${r1(hy)})"`);
    g += ell(hx - R * 0.3, hy + R * 0.25, 12, 30, D.patch ?? D.deep, C.ink, 3, ` transform="rotate(8 ${r1(hx - R * 0.3)} ${r1(hy)})"`);
  } else {
    g += path(`M${r1(hx - R * 0.6)} ${r1(hy - R * 0.5)} l-8 -22 l22 10 Z`, D.deep, C.ink, 3) + path(`M${r1(hx - R * 0.3)} ${r1(hy - R * 0.7)} l4 -18 l16 16 Z`, D.coat, C.ink, 3);
  }
  return g + "</g>";
}

/** A parrot on a perch in a cage, hanging from a stand that stands on the floor. o: { x, floorY, s } */
export function parrotStand(o) {
  const { x, floorY, s = 1 } = o;
  const k = v => r1(v * s);
  let g = ell(x, floorY + 2, 46 * s, 6 * s, C.ink, C.ink, 0, ` opacity="0.16"`);
  g += path(`M${x - k(40)} ${floorY}L${x} ${floorY - k(16)}L${x + k(40)} ${floorY}`, "none", C.ink, 4); // the stand's feet
  g += `<rect x="${x - k(4)}" y="${floorY - k(250)}" width="${k(8)}" height="${k(236)}" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2"/>`;
  g += path(`M${x} ${floorY - k(246)}h${k(60)}v${k(16)}`, "none", C.ink, 4); // the hook arm
  const cx = x + k(60), cy = floorY - k(220);
  // the cage hangs from the hook by its ring
  g += circ(cx, cy + k(4), k(6), "none", C.ink, 2.4);
  let bars = "";
  for (let i = -3; i <= 3; i++) bars += `M${r1(cx + i * k(12))} ${r1(cy + k(14))}V${r1(cy + k(110))}`;
  // parrot inside, standing on the perch (grey with a red tail): body, head, beak, eye, two feet on the perch
  g += ell(cx, cy + k(64), k(16), k(24), C.grey, C.ink, 2.6) + circ(cx + k(4), cy + k(40), k(12), C.grey, C.ink, 2.6);
  g += path(`M${r1(cx + k(14))} ${r1(cy + k(38))} q${k(10)} ${k(4)} ${k(2)} ${k(12)} Z`, C.ink, C.ink, 1.6) + circ(cx + k(8), cy + k(36), k(2.4), C.ink);
  g += path(`M${r1(cx - k(6))} ${r1(cy + k(84))} l${k(-4)} ${k(16)} l${k(10)} 0 Z`, C.alarmB, C.ink, 2);
  g += path(`M${r1(cx - k(26))} ${r1(cy + k(88))}H${r1(cx + k(26))}`, "none", C.woodDeep, 4); // perch, fixed to the bars
  g += path(`M${r1(cx - k(4))} ${r1(cy + k(86))}v${k(4)} M${r1(cx + k(6))} ${r1(cy + k(86))}v${k(4)}`, "none", C.ink, 2.6);
  g += `<path d="${bars}" stroke="${C.accentDeep}" stroke-width="${k(2.4)}"/>`;
  g += path(`M${r1(cx - k(40))} ${r1(cy + k(110))}H${r1(cx + k(40))} M${r1(cx - k(36))} ${r1(cy + k(14))}Q${cx} ${r1(cy - k(10))} ${r1(cx + k(36))} ${r1(cy + k(14))}`, "none", C.accentDeep, 4);
  return g;
}

/** A robot vacuum on the floor. */
export function vacuum(x, floorY, s = 1) {
  let g = ell(x, floorY + 1, 48 * s, 6 * s, C.ink, C.ink, 0, ` opacity="0.18"`);
  g += `<path d="M${r1(x - 46 * s)} ${r1(floorY - 4 * s)}Q${r1(x - 46 * s)} ${r1(floorY - 24 * s)} ${x} ${r1(floorY - 24 * s)}Q${r1(x + 46 * s)} ${r1(floorY - 24 * s)} ${r1(x + 46 * s)} ${r1(floorY - 4 * s)}Z" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="3"/>`;
  g += `<rect x="${r1(x - 46 * s)}" y="${r1(floorY - 6 * s)}" width="${r1(92 * s)}" height="${r1(6 * s)}" fill="${C.ink}"/>`;
  g += circ(x + 18 * s, floorY - 16 * s, 3.2 * s, C.leaf);
  return g;
}
