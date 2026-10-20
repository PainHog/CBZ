// The cover, the four part pages, the back-cover panel and the end-of-chapter spots.
// Part pages sit on the book's dark part-page background, so each is a framed night
// panel (900×300) with an amber border. Spots are 4:3 (400×300), drawn on the page
// with the shared stage glow and ground line; each spot is built at the vignettes'
// scale (counter 150, cat 0.3) and scaled up as a whole, so sizes stay consistent.
import { C, svg, stage } from "./lib.mjs";
import { setPrefix, path, circ, ell, r1 } from "../lib.mjs";
import { catSide, catSit, catCurl } from "../cats.mjs";
import { dogLie } from "../residents.mjs";
import { nightSky, moon, bricks, litWindow, streetLamp, wheelieBin, door, fence, box, cushion, table, die, dogBed, shadowAt, balloon, broom, windowWall } from "../kit.mjs";
import { vacuum, parrotStand } from "../residents.mjs";

/**
 * A roast chicken carried in a side-view cat's mouth: the cat grips one drumstick and the bird
 * hangs straight down under its chin, clear of the front legs and the ground. Same transform as
 * catSide({ x, y, s, flip }) with head = 0.
 */
function carriedChicken(x, y, s, flip = false) {
  let g = `<g transform="translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})">`;
  // the other drumstick, sticking out behind the bird, bone end showing
  g += path(`M212 -98 L238 -114 L244 -104 L220 -86 Z`, C.gingerDeep, C.ink, 3) + circ(244, -112, 7, C.light, C.ink, 2.4);
  // the bird, hanging under the chin: a plump roast body with a shine and a crisp seam
  g += ell(186, -76, 46, 34, C.ginger, C.ink, 3.4) + ell(168, -90, 16, 9, C.accentB, C.ink, 0, ` opacity="0.7"`);
  g += path(`M150 -66 Q186 -54 226 -70`, "none", C.gingerDeep, 3);
  // the gripped drumstick: meat widening down into the bird, the bone end held in the teeth
  g += path(`M162 -146 L156 -116 Q170 -100 190 -108 L174 -146 Z`, C.gingerDeep, C.ink, 3) + circ(168, -150, 6.5, C.light, C.ink, 2.4);
  return g + "</g>";
}

/** A framed night panel for a part page: rounded corners, amber border. */
function panel(id, inner) {
  return `<clipPath id="${id}-clip"><rect x="5" y="5" width="890" height="290" rx="22"/></clipPath><g clip-path="url(#${id}-clip)">${inner}</g>` +
    `<rect x="5" y="5" width="890" height="290" rx="22" fill="none" stroke="${C.accent}" stroke-width="5"/>`;
}

// ------------------------------------------------------------------ cover
/** The cover: the gang outside a lit house at night; Big Biscuit walks off with the chicken. */
export function cover() {
  setPrefix("cover");
  const W = 612, H = 792, G = 700;
  let b = nightSky(W, H, 77) + moon(206, 300, 34);
  // the house, set back from the garden wall: slate roof, chimney, brick front, lit window, open door
  b += `<rect x="540" y="292" width="38" height="56" fill="${C.brick}" stroke="${C.ink}" stroke-width="3"/><rect x="534" y="284" width="50" height="12" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.6"/>`;
  b += `<path d="M300 392L332 340H630V392Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>`;
  b += path(`M322 356H630 M312 374H630`, "none", C.deep, 2);
  b += bricks(306, 392, 320, 220, { seed: 12 });
  b += litWindow(334, 420, 92, 80);
  b += `<rect x="472" y="430" width="74" height="170" fill="${C.accentB}" stroke="${C.ink}" stroke-width="3"/>`; // the open doorway, lit
  b += `<path d="M472 430L448 440V600H472Z" fill="${C.wood}" stroke="${C.ink}" stroke-width="3"/>`; // the door, swung open on its hinges
  b += `<path d="M472 430L546 430L620 600H472Z" fill="${C.accentB}" opacity="0.18"/>`; // light falling out of the door
  // the street lamp on the left, its light on the pavement
  b += streetLamp(64, G + 4, 456);
  // the garden wall across the whole width, and the pavement in front of it
  b += bricks(-10, 600, W + 20, G - 600, { coping: true, seed: 6 });
  b += `<rect x="0" y="${G}" width="${W}" height="${H - G}" fill="${C.soft}"/>` + path(`M0 ${G}H${W}`, "none", C.ink, 3);
  const top = 588; // the wall's coping
  b += catSit({ look: "velvet", x: 156, y: top, s: 0.44, id: "cv" });
  b += catSit({ look: "tilly", x: 262, y: top, s: 0.46, id: "ct", headTilt: 6 });
  b += catSide({ look: "mags", x: 446, y: top, s: 0.4, flip: true, step: 0.4, tailUp: 0.9, head: 0.1, id: "cm" });
  // on the pavement: Pip looking up at the chicken, Biscuit carrying it off
  b += catSit({ look: "pip", x: 124, y: G + 14, s: 0.42, id: "cp", headTilt: -12 });
  b += catSide({ look: "biscuit", x: 360, y: G + 18, s: 0.52, flip: true, step: 0.6, tailUp: 0.9, head: 0, id: "cb" });
  b += carriedChicken(360, G + 18, 0.52, true);
  return svg(`0 0 ${W} ${H}`, "Cover: at night outside a lit house, Velvet, Tilly and Mags sit and walk along the garden wall while Big Biscuit walks off down the pavement with a whole roast chicken in his mouth and Pip looks up at it", b);
}

// ------------------------------------------------------------------ part pages
/** Part One: the gang, sitting in a row along a garden wall under a street lamp. */
export function part_gang() {
  setPrefix("part-gang");
  let s = nightSky(900, 300, 41) + moon(110, 64, 26);
  s += streetLamp(806, 300, 270);
  s += bricks(-10, 214, 920, 90, { coping: true, seed: 3 });
  const top = 202;
  s += catSit({ look: "pip", x: 228, y: top, s: 0.31, id: "g5", headTilt: -8 });
  s += catSit({ look: "velvet", x: 336, y: top, s: 0.36, id: "g3" });
  s += catSit({ look: "biscuit", x: 452, y: top, s: 0.4, id: "g2" });
  s += catSit({ look: "tilly", x: 568, y: top, s: 0.37, id: "g1", headTilt: 6 });
  s += catSit({ look: "mags", x: 676, y: top, s: 0.36, id: "g4", headTilt: -4 });
  return svg("0 0 900 300", "The gang sits in a row along a garden wall under a street lamp: Pip, Velvet, Big Biscuit, Tilly and Mags", panel("pg", s));
}

/** Part Two: the robbery — Biscuit walks off across the back garden with the chicken; the cat flap behind is still swinging. */
export function part_robbery() {
  setPrefix("part-rob");
  const G = 270;
  let s = nightSky(900, 300, 52) + moon(820, 60, 22);
  s += fence(330, G, 600, 112);
  // the back of the house: brick wall and the back door with its cat flap swinging out
  s += bricks(-10, 20, 330, G - 20, { seed: 8 });
  s += door(140, G, 112, 214);
  const fx = 196, fy = G - 54;
  s += `<rect x="${fx - 24}" y="${fy}" width="48" height="42" rx="4" fill="${C.deep}" stroke="${C.ink}" stroke-width="2.6"/>`; // the flap's opening
  s += `<path d="M${fx - 24} ${fy}H${fx + 24}L${fx + 28} ${fy + 22}H${fx - 28}Z" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2.6"/>`; // the flap, swung out toward us on its top hinge
  s += path(`M${fx + 36} ${fy + 4}q8 12 0 24 M${fx + 44} ${fy}q10 16 0 32`, "none", C.accentB, 2.4);
  // the garden: grass along the ground
  s += `<rect x="0" y="${G}" width="900" height="${300 - G}" fill="${C.leafDeep}"/>` + path(`M0 ${G}H900`, "none", C.ink, 3);
  let d = ""; for (let x = 8; x < 900; x += 14) d += `M${x} ${G + 2}l${(x % 28) ? 3 : -3} -9`;
  s += path(d, "none", C.leaf, 2.4);
  s += catSide({ look: "pip", x: 362, y: G, s: 0.26, step: -0.4, tailUp: 1, head: 0.3, id: "rp" });
  s += catSide({ look: "biscuit", x: 540, y: G, s: 0.42, step: 0.6, tailUp: 0.9, id: "rb" });
  s += carriedChicken(540, G, 0.42);
  s += catSide({ look: "tilly", x: 760, y: G - 122, s: 0.3, step: 0.3, tailUp: 0.7, head: 0.2, id: "rt" });
  return svg("0 0 900 300", "Big Biscuit walks across a back garden at night with a whole roast chicken in his mouth; behind him the cat flap is still swinging, Pip trots after him and Tilly leads the way along the fence", panel("pr", s));
}

/** Part Three: the Storyteller's house — lit windows, someone at the upstairs window, and five pairs of eyes in the hedge. */
export function part_storyteller() {
  setPrefix("part-story");
  let s = nightSky(900, 300, 63) + moon(780, 56, 24);
  // the house: roof, brick front, windows, the front door with its cat flap
  s += `<path d="M150 64L210 18H690L750 64Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>`;
  s += bricks(170, 64, 560, 240, { seed: 21 });
  s += litWindow(220, 92, 110, 74);
  // someone standing at the upstairs window, lit from behind: head and shoulders only, no face
  s += `<clipPath id="part-story-win"><rect x="220" y="92" width="110" height="74"/></clipPath><g clip-path="url(#part-story-win)">` +
    path(`M248 170Q250 132 275 128Q300 132 302 170Z`, C.dark, C.ink, 2.6) + circ(275, 116, 15, C.dark, C.ink, 2.6) + `</g>`;
  s += litWindow(570, 92, 110, 74) + litWindow(570, 196, 110, 64);
  s += door(400, 300, 100, 176, { catFlap: true });
  // the hedge in front, and in it the gang's eyes — each cat's own eye colour
  let h = "";
  for (let x = -30; x < 940; x += 58) h += circ(x, 262 + (x % 3) * 4, 44, C.leafDeep, C.ink, 3);
  s += h + `<rect x="0" y="262" width="900" height="40" fill="${C.leafDeep}"/>`;
  s += path(`M0 300H900`, "none", C.ink, 3);
  const eyes = [[104, 254, C.eyeGreen], [254, 266, C.eyeAmber], [372, 248, C.eyeAmber], [622, 262, C.eyeGreen], [790, 256, C.eyeBlue]];
  for (const [x, y, col] of eyes) for (const dx of [-11, 11]) s += path(`M${x + dx - 8} ${y}Q${x + dx} ${y - 8} ${x + dx + 8} ${y}Q${x + dx} ${y + 7} ${x + dx - 8} ${y}Z`, col, C.ink, 1.8) + ell(x + dx, y, 1.6, 5, C.ink);
  return svg("0 0 900 300", "A house at night: someone stands at a lit upstairs window, and in the dark hedge out front five pairs of cat's eyes are watching", panel("ps", s));
}

/** Part Four: the Block — the five houses side by side along the street at night. */
export function part_houses() {
  setPrefix("part-houses");
  const G = 268;
  let s = nightSky(900, 300, 74) + moon(450, 40, 20);
  const num = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="${C.accentB}">${t}</text>`;
  // Number 12: a small brick terrace, a cat flap in the door
  s += `<path d="M14 120L100 74L186 120Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + bricks(24, 120, 152, G - 120, { seed: 31 });
  s += litWindow(44, 140, 50, 44) + door(116, G, 46, 96, { catFlap: false }) + `<rect x="129" y="${G - 22}" width="20" height="16" rx="2" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2"/>` + num(139, G - 70, "12");
  // Number 31, the Okafors: wider, painted, a garage with a side door
  s += `<path d="M186 108L280 62L374 108Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/><rect x="196" y="108" width="168" height="${G - 108}" fill="${C.paper2}" stroke="${C.ink}" stroke-width="3"/>`;
  s += litWindow(212, 128, 54, 44) + litWindow(296, 128, 54, 44) + door(212, G, 46, 92) + num(235, G - 68, "31");
  s += `<rect x="282" y="${G - 74}" width="70" height="74" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="3"/>` + path(`M282 ${G - 58}H352 M282 ${G - 42}H352 M282 ${G - 26}H352`, "none", C.ink, 1.6);
  // Grandpa Wendell's: a cream cottage, Pom-Pom's shape in the front window
  s += `<path d="M370 132L455 92L540 132Z" fill="${C.brickDeep}" stroke="${C.ink}" stroke-width="3"/><rect x="380" y="132" width="150" height="${G - 132}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  s += litWindow(396, 156, 62, 50);
  s += `<clipPath id="part-houses-pp"><rect x="396" y="156" width="62" height="50"/></clipPath><g clip-path="url(#part-houses-pp)">` +
    ell(426, 206, 16, 14, C.greyDeep) + circ(426, 188, 10, C.greyDeep) + path(`M418 182l-3 -9 l7 4Z M434 182l3 -9 l-7 4Z`, C.greyDeep, C.greyDeep, 1) + `</g>`;
  s += door(476, G, 40, 86);
  // Number 5: the birthday house, balloons tied to the gatepost
  s += `<path d="M536 100L622 56L708 100Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + bricks(546, 100, 152, G - 100, { seed: 51, col: C.brickDeep });
  s += litWindow(560, 120, 50, 44) + litWindow(634, 120, 50, 44) + litWindow(634, 190, 50, 44) + door(566, G, 44, 92) + num(588, G - 68, "5");
  s += `<rect x="540" y="${G - 40}" width="12" height="40" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`; // the gatepost
  s += balloon(546, G - 36, 528, G - 86, C.accent, 12) + balloon(546, G - 36, 556, G - 92, C.eyeBlue, 12);
  // Chef Marchetti's: tall, a balcony upstairs, a tree up to it, a skylight in the roof
  s += `<path d="M708 84L796 40L884 84Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/><rect x="824" y="56" width="26" height="14" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2" transform="rotate(-27 837 63)"/>`;
  s += bricks(718, 84, 156, G - 84, { seed: 61 });
  s += litWindow(740, 104, 54, 48) + litWindow(800, 180, 56, 48) + door(740, G, 46, 92);
  s += `<rect x="730" y="166" width="78" height="8" fill="${C.ink}"/>` + path(`M734 174V146H806V174 M746 146V174 M758 146V174 M770 146V174 M782 146V174 M794 146V174`, "none", C.ink, 2.4); // balcony railing on its slab
  s += path(`M890 ${G}V150`, "none", C.woodDeep, 10) + circ(884, 136, 36, C.leafDeep, C.ink, 3) + circ(902, 112, 26, C.leafDeep, C.ink, 3);
  // the pavement
  s += `<rect x="0" y="${G}" width="900" height="${300 - G}" fill="${C.soft}"/>` + path(`M0 ${G}H900`, "none", C.ink, 3);
  return svg("0 0 900 300", "The Block at night: five houses side by side — the little terrace at Number 12, the Okafors' with its garage, Grandpa Wendell's cottage with Pom-Pom in the window, the party house with balloons on the gate, and Chef Marchetti's tall house with a balcony and a tree", panel("ph", s));
}

// ------------------------------------------------------------------ back cover and spots
const FL = 262; // the vignettes' floor line, used inside each spot before scaling
/** A 4:3 spot: the stage glow and ground line, then the scene (drawn at vignette scale) scaled about the ground line. */
function spot(id, title, scene, { k = 1.6, cx = 200, gy = 250 } = {}) {
  setPrefix(id);
  const body = stage(id, { w: 400, h: 300, groundY: gy, cx: 200, gw: 0.86 }) +
    `<g transform="translate(${cx} ${gy}) scale(${k}) translate(${-cx} ${-FL})">${scene}</g>`;
  return svg("0 0 400 300", title, body);
}

/** Back cover: home again — Big Biscuit asleep on a cushion under the window, beside a plate of picked-clean chicken bones. */
export function spot_back() {
  const px = 292;
  // a corner of the gang's den: a patch of wall with its skirting, and a night window
  let s = path(`M54 ${FL}V${FL - 222}Q54 ${FL - 240} 72 ${FL - 240}H338Q356 ${FL - 240} 356 ${FL - 222}V${FL}Z`, C.wall, C.ink, 0) + `<rect x="54" y="${FL - 14}" width="302" height="14" fill="${C.light}"/>` + path(`M54 ${FL - 14}H356`, "none", C.ink, 2);
  s += windowWall(110, FL - 214, 120, 90, { night: true });
  s += cushion(158, FL, 156) + catCurl({ look: "biscuit", x: 152, y: FL - 36, s: 0.42, id: "bk" });
  s += ell(px, FL - 4, 50, 8, C.light, C.ink, 2.6); // the plate, lying flat on the floor
  // cartoon bones (a shaft with two knobs at each end), picked clean
  const bone = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * 4.5, ny = Math.cos(a) * 4.5;
    const knobs = [[x1, y1], [x2, y2]].map(([x, y]) => circ(x + nx, y + ny, 5.5, C.paper2, C.ink, 2.6) + circ(x - nx, y - ny, 5.5, C.paper2, C.ink, 2.6)).join("");
    return knobs + path(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, "none", C.ink, 10) + path(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, "none", C.paper2, 5);
  };
  s += bone(px - 34, FL - 9, px + 2, FL - 8) + bone(px + 2, FL - 7, px + 36, FL - 9); // two lying on the plate
  s += bone(px - 18, FL - 19, px + 20, FL - 20);                                      // one lying across both of them
  return spot("spot-back", "Home again: Big Biscuit asleep on a cushion under the window, beside a plate of picked-clean chicken bones", s, { k: 1.0, cx: 205 });
}

/** Pip asleep, curled up on a pink cushion. */
export function spot_curl() {
  const s = cushion(200, FL, 170) + catCurl({ look: "pip", x: 192, y: FL - 38, s: 0.4, id: "sc" });
  return spot("spot-curl", "Pip curled up asleep on a pink cushion", s, { k: 1.7 });
}

/** Mags sitting in a cardboard box, only her top half showing over its front. */
export function spot_box() {
  let s = box(122, FL, 156, 96);
  s += catSit({ look: "mags", x: 200, y: FL - 44, s: 0.32, id: "sb" });
  s += `<rect x="122" y="${FL - 56}" width="156" height="56" fill="${C.creamDeep}" stroke="${C.ink}" stroke-width="3"/>` + path(`M138 ${FL - 26}h40 M138 ${FL - 16}h26`, "none", C.ink, 2);
  return spot("spot-box", "Mags sitting in a cardboard box, her top half showing over the front", s, { k: 1.55 });
}

/** Two-Bin Tilly sitting on the lid of a wheelie bin. */
export function spot_bin() {
  const s = wheelieBin(166, FL) + catSit({ look: "tilly", x: 200, y: FL - 122, s: 0.3, id: "sbn" });
  return spot("spot-bin", "Two-Bin Tilly sitting on the lid of a wheelie bin", s, { k: 1.12 });
}

/** Knocked off: a mug on its side on the floor in a puddle; Velvet sits on the table above, looking innocent. */
export function spot_mug() {
  const t = table(60, FL, 160, 120);
  let s = t.svg + catSit({ look: "velvet", x: 160, y: t.top, s: 0.3, id: "smv", headTilt: 14 });
  s += ell(290, FL + 4, 54, 7, C.eyeBlue, C.ink, 2, ` opacity="0.75"`); // the puddle, flat on the floor
  // the mug on its side: body, open mouth toward us at the right, handle on top
  s += `<rect x="252" y="${FL - 32}" width="50" height="32" rx="5" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` + ell(302, FL - 16, 6, 16, C.brown, C.ink, 2.6);
  s += path(`M266 ${FL - 32}q8 -16 20 0`, "none", C.ink, 7) + path(`M266 ${FL - 32}q8 -16 20 0`, "none", C.light, 3);
  s += circ(326, FL + 2, 3, C.eyeBlue) + circ(334, FL - 1, 2, C.eyeBlue); // drops, lying on the floor
  return spot("spot-mug", "A mug lying on its side in a puddle on the floor; Velvet sits on the table above looking innocent", s, { k: 1.0, cx: 200 });
}

/** Pip batting a ball of wool, its loose strand looping across the floor. */
export function spot_wool() {
  let s = shadowAt(270, FL, 34) + circ(270, FL - 30, 30, C.eyeBlue, C.ink, 3);
  s += path(`M248 ${FL - 48}q22 10 44 -2 M244 ${FL - 32}q26 12 52 0 M250 ${FL - 16}q20 8 40 0 M262 ${FL - 58}q-8 26 2 56`, "none", C.soft, 2.4);
  s += path(`M240 ${FL - 4}Q200 ${FL + 4} 182 ${FL - 2}Q162 ${FL - 8} 150 ${FL}`, "none", C.eyeBlue, 3); // the strand, lying on the floor
  s += catSide({ look: "pip", x: 150, y: FL, s: 0.3, crouch: 0.8, head: -0.4, tailUp: 1, step: 0.2, id: "sw" });
  return spot("spot-wool", "Pip crouching to pounce on a ball of blue wool", s, { k: 1.45, cx: 210 });
}

/** Purrfect: two dice both showing six, and Mags looking very pleased. */
export function spot_purrfect() {
  let s = die(110, FL, 64, 6) + die(190, FL + 4, 64, 6);
  s += catSit({ look: "mags", x: 312, y: FL, s: 0.32, id: "spm", headTilt: -10 });
  for (const [x, y, r] of [[106, FL - 86, 12], [266, FL - 94, 9], [178, FL - 112, 7]]) s += path(`M${x} ${y - r}Q${x + r * 0.26} ${y - r * 0.26} ${x + r} ${y}Q${x + r * 0.26} ${y + r * 0.26} ${x} ${y + r}Q${x - r * 0.26} ${y + r * 0.26} ${x - r} ${y}Q${x - r * 0.26} ${y - r * 0.26} ${x} ${y - r}Z`, C.accentB, C.ink, 1.8);
  return spot("spot-purrfect", "Two dice both showing six, a Purrfect, with Mags looking very pleased", s, { k: 1.4, cx: 210 });
}

/** Noodle the sausage dog, asleep on his bed. */
export function spot_noodle() {
  const bd = dogBed(200, FL, 200);
  return spot("spot-noodle", "Noodle the sausage dog asleep on his bed", bd.svg + dogLie({ dog: "noodle", x: 186, y: bd.bed, s: 0.5 }), { k: 1.55 });
}

/** Pip riding the robot vacuum. */
export function spot_vacuum() {
  let s = vacuum(200, FL, 1.1) + catSit({ look: "pip", x: 200, y: FL - 26, s: 0.27, id: "sv" });
  s += path(`M120 ${FL - 10}h-34 M126 ${FL - 22}h-26`, "none", C.ink, 3); // it's moving
  return spot("spot-vacuum", "Pip riding the robot vacuum across the floor", s, { k: 1.6 });
}

/** Muddy paw prints across the floorboards, seen from above. */
export function spot_paws() {
  setPrefix("spot-paws");
  let s = `<clipPath id="spot-paws-c"><rect x="30" y="40" width="340" height="220" rx="18"/></clipPath><g clip-path="url(#spot-paws-c)">`;
  s += `<rect x="30" y="40" width="340" height="220" fill="${C.floor}"/>`;
  let d = ""; for (let y = 72; y < 260; y += 32) d += `M30 ${y}H370`; for (const [x, y] of [[90, 40], [210, 72], [140, 104], [300, 136], [80, 168], [250, 200], [170, 232]]) d += `M${x} ${y}V${y + 32}`;
  s += path(d, "none", C.floorDeep, 2);
  const print = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})" fill="${C.brownDeep}" opacity="0.85">` + `<ellipse cx="0" cy="6" rx="11" ry="9"/>` +
    [[-12, -8], [-4, -13], [5, -13], [13, -8]].map(([px, py]) => `<ellipse cx="${px}" cy="${py}" rx="4.4" ry="5.6"/>`).join("") + `</g>`;
  for (const [x, y, a] of [[70, 230, 60], [104, 196, 62], [144, 200, 58], [176, 160, 60], [216, 164, 56], [248, 124, 60], [290, 128, 58], [320, 90, 60]]) s += print(x, y, a);
  s += `</g><rect x="30" y="40" width="340" height="220" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  return svg("0 0 400 300", "Muddy paw prints crossing the floorboards, seen from above", s);
}

/** A fish skeleton on a plate, licked clean, seen from above on the kitchen floor tiles. */
export function spot_fish() {
  setPrefix("spot-fish");
  let s = `<clipPath id="spot-fish-c"><rect x="40" y="30" width="320" height="240" rx="18"/></clipPath><g clip-path="url(#spot-fish-c)">`;
  for (let j = 0; j < 6; j++) for (let i = 0; i < 8; i++) s += `<rect x="${40 + i * 40}" y="${30 + j * 40}" width="40" height="40" fill="${(i + j) % 2 ? C.light : C.edge}"/>`;
  s += `</g><rect x="40" y="30" width="320" height="240" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  s += circ(206, 156, 96, C.ink, C.ink, 0, ` opacity="0.18"`) + circ(200, 150, 96, C.light, C.ink, 3) + circ(200, 150, 74, "none", C.edge, 2.4);
  // the skeleton: head, spine, ribs, tail fin — all lying flat on the plate
  s += path(`M128 150Q140 132 160 150Q140 168 128 150Z`, C.paper2, C.ink, 2.6) + circ(142, 148, 3, C.ink);
  s += path(`M160 150H246`, "none", C.ink, 3.4);
  let r = ""; for (let x = 170; x <= 238; x += 12) r += `M${x} 150l6 -20 M${x} 150l6 20`;
  s += path(r, "none", C.ink, 2.2);
  s += path(`M246 150L276 128L268 150L276 172Z`, C.paper2, C.ink, 2.6);
  return svg("0 0 400 300", "A fish skeleton licked clean on a plate, seen from above on a tiled kitchen floor", s);
}

/** Pudding, Mr Pell's old spaniel, asleep on a rug. */
export function spot_pudding() {
  const s = ell(200, FL + 2, 100, 11, C.leafDeep, C.ink, 2.6) + ell(200, FL + 2, 80, 8, "none", C.accentB, 2) + dogLie({ dog: "pudding", x: 184, y: FL, s: 0.44 });
  return spot("spot-pudding", "Pudding the old spaniel asleep on a rug", s, { k: 1.9 });
}

/** Captain the parrot in his cage on its stand. */
export function spot_parrot() {
  return spot("spot-parrot", "Captain the grey parrot on his perch in a cage hanging from a stand", parrotStand({ x: 160, floorY: FL, s: 0.9 }), { k: 1.08, cx: 196 });
}

/** Pom-Pom, the Wendells' house cat, sitting by her food bowl and not sharing. */
export function spot_pompom() {
  let s = shadowAt(268, FL, 30) + path(`M240 ${FL}L246 ${FL - 22}H290L296 ${FL}Z`, C.eyeBlue, C.ink, 3) + ell(268, FL - 22, 24, 4, C.brown, C.ink, 2); // the bowl, kibble showing
  s += catSit({ look: "pompom", x: 184, y: FL, s: 0.36, id: "spp", headTilt: 8 });
  return spot("spot-pompom", "Pom-Pom the fluffy grey house cat sitting beside her food bowl", s, { k: 1.5, cx: 214 });
}

/** The broom on its wall clip, and Tilly slinking low past it. */
export function spot_broom() {
  let s = path(`M60 ${FL}V${FL - 222}Q60 ${FL - 240} 78 ${FL - 240}H332Q350 ${FL - 240} 350 ${FL - 222}V${FL}Z`, C.wall, C.ink, 0) + `<rect x="60" y="${FL - 14}" width="290" height="14" fill="${C.light}"/>` + path(`M60 ${FL - 14}H350`, "none", C.ink, 2); // a patch of wall with its skirting
  s += broom(130, FL, 200);
  s += catSide({ look: "tilly", x: 262, y: FL, s: 0.3, crouch: 0.9, head: -0.4, tailLow: true, step: 0.4, id: "sbr" });
  return spot("spot-broom", "Tilly slinks low along the skirting board past a broom hanging on its wall clip", s, { k: 1.0, cx: 205 });
}
