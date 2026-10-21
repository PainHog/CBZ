// The cover, the four part pages, the gang's tag, the back-cover panel and the end-of-chapter spots.
// Part pages sit on the book's dark part-page background, so each is a framed night panel (900×300)
// with an amber border. Spots are 4:3 (400×300), drawn on the page with the shared stage glow and
// ground line; each spot is built at the vignettes' scale (kit.mjs SCALE) and scaled up as a whole,
// so sizes stay consistent. Every spot is a tiny scene: its subject plus a little supporting detail.
// The gang are thugs played for laughs (the author, 2026-10-21): comical and light, never menacing.
import { C, svg, stage } from "./lib.mjs";
import { setPrefix, path, circ, ell, r1, GANG_SIGN } from "../lib.mjs";
import { catSide, catSit, catCurl, pullGrip, glint, lootInMouth } from "../cats.mjs";
import { dogLie, vacuum, parrotStand, van, warden } from "../residents.mjs";
import { nightSky, moon, bricks, litWindow, streetLamp, wheelieBin, door, fence, box, cushion, table, die, dogBed, dogBasket, shadowAt, balloon, broom, windowWall,
  gangTag, tagMark, throwUp, rivalTag, spray, plate, ball, SCALE } from "../kit.mjs";

const CAT = SCALE.cat;
/** A framed night panel for a part page: rounded corners, amber border. */
function panel(id, inner) {
  return `<clipPath id="${id}-clip"><rect x="5" y="5" width="890" height="290" rx="22"/></clipPath><g clip-path="url(#${id}-clip)">${inner}</g>` +
    `<rect x="5" y="5" width="890" height="290" rx="22" fill="none" stroke="${C.accent}" stroke-width="5"/>`;
}

// ------------------------------------------------------------------ the gang's tag
export { gangTag };

/** The tag on its own, for the part pages, the credits page and the back cover (the page sets its colour). */
export function orn_tag() {
  setPrefix("orn-tag");
  return svg("0 0 140 110", "The Nine Lives Gang's tag: a cat's head with a 9 in it, sprayed in paint", gangTag(70, 52, 1));
}

/**
 * The same tag, small and clean, for use at 0.3–0.6in (house pages, the tracker, the Cred rule): the
 * cat's head, the 9 and the whiskers drawn as bold flat strokes, without the overspray and drips that
 * clog at that size. One colour (currentColor: the page sets it).
 */
export function tag_small() {
  setPrefix("tag-small");
  const { head, nine, whiskers } = GANG_SIGN;
  const st = w => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  return svg("-70 -52 140 92", "The Nine Lives Gang's tag, small: a cat's head with a 9 in it", `<path d="${head}" ${st(8)}/><g transform="translate(1 2) scale(1.12)"><path d="${nine}" ${st(7.5)}/></g><path d="${whiskers}" ${st(6)}/>`);
}

// ------------------------------------------------------------------ cover
/**
 * The cover: the getaway. Night on the street; the animal control van has pulled up under the street
 * lamp and the warden is running with his net. The gang go over a tagged garden fence with the loot:
 * Tilly springing with a slice of cake, Biscuit at the top of his leap with the whole chicken, Mags
 * coming down with a gold watch, Velvet already over and away, and Pip, last, tumbling head over heels
 * just ahead of the net, a drumstick falling behind her. The top third is sky, for the title.
 */
export function cover() {
  setPrefix("cover");
  const W = 612, H = 792, FT = 470, FB = 626, PV = 700; // fence top, fence foot, kerb
  let b = nightSky(W, H, 77) + moon(520, 300, 30);
  // the backs of the houses beyond the fence: roofs and a lit window or two
  b += path(`M-10 ${FT - 40}L60 ${FT - 96}L150 ${FT - 40}L200 ${FT - 74}L292 ${FT - 74}L330 ${FT - 44}L420 ${FT - 112}L520 ${FT - 46}L560 ${FT - 80}L622 ${FT - 80}V${FT + 10}H-10Z`, C.dark, C.ink, 3);
  b += `<rect x="70" y="${FT - 66}" width="26" height="22" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/><rect x="408" y="${FT - 84}" width="26" height="22" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/>`;
  // the garden fence, tagged
  b += fence(-10, FB, W + 20, FB - FT);
  b += gangTag(150, FT + 76, 0.6, C.accentB, 0.9, -5) + throwUp("NLG", 420, FT + 118, 34, C.eyeBlue, C.light, -6) + tagMark("fish", 566, FT + 60, 0.55, C.light, 0.75, 10);
  // the pavement and the road
  b += `<rect x="0" y="${FB}" width="${W}" height="${PV - FB}" fill="${C.soft}"/>` + path(`M0 ${FB}H${W}`, "none", C.ink, 3);
  b += `<rect x="0" y="${PV}" width="${W}" height="${H - PV}" fill="${C.dark}"/>` + path(`M0 ${PV}H${W}`, "none", C.ink, 3) + `<rect x="0" y="${PV}" width="${W}" height="8" fill="${C.edge}"/>`;
  // the street lamp on the pavement, and the van pulled up at the kerb, all of it in the picture (its words
  // ANIMAL CONTROL whole and clear of the warden), tagged by the gang on its front panel
  b += streetLamp(44, PV - 4, 380);
  b += van(268, H - 26, 0.62) + gangTag(300, H - 72, 0.16, C.dark, 0.85, -6);
  // the gang, over the fence (leaping cats are mid-air: dotted arcs trail behind them)
  const arc = (d) => path(d, "none", C.light, 2.4, ` opacity="0.7" stroke-dasharray="2 9"`);
  b += arc(`M356 ${FT - 26}Q376 ${FT - 66} 404 ${FT - 64}`) + arc(`M384 ${FT - 100}Q410 ${FT - 150} 440 ${FT - 156}`) + arc(`M470 ${FT - 136}Q510 ${FT - 126} 524 ${FT - 50}`);
  b += catSide({ look: "velvet", x: 468, y: PV - 2, s: 0.38, run: true, id: "cv" });
  b += catSide({ look: "tilly", x: 452, y: FT - 14, s: 0.38, leap: true, rot: -26, carry: "cake", id: "ct" });
  b += catSide({ look: "biscuit", x: 476, y: FT - 100, s: 0.4, leap: true, rot: -2, carry: "chicken", id: "cb" });
  b += catSide({ look: "mags", x: 498, y: FT + 34, s: 0.38, leap: true, rot: 30, carry: "watch", id: "cm" });
  // Pip, last: head over heels at the fence top, her kerchief flying, a dropped drumstick falling behind her
  b += catSide({ look: "pip", x: 322, y: FT + 4, s: 0.46, leap: true, rot: 100, id: "cp" });
  b += `<g transform="rotate(30 292 ${FT - 8})">${lootInMouth("leg", 292, FT - 30)}</g>` + path(`M280 ${FT - 46}v-14 M294 ${FT - 50}v-16 M308 ${FT - 46}v-12`, "none", C.light, 2.2, ` opacity="0.8"`); // falling straight into the net
  b += path(`M392 ${FT + 50}l12 -6 M394 ${FT + 64}l14 0 M390 ${FT + 78}l12 6`, "none", C.accentB, 2.6); // a burst of surprise by Pip's face
  // the warden, out of the van and running along the road in front of it, his net swiping just behind Pip
  b += warden({ x: 112, groundY: H - 8, s: 0.8, swing: 52 });
  return svg(`0 0 ${W} ${H}`, "Cover: the getaway at night. The animal control van has pulled up at the kerb and the warden runs with his net under a street lamp, while the gang go over a tagged garden fence with the loot: Tilly with a slice of cake, Big Biscuit with a whole roast chicken, Mags with a gold watch, Velvet already away, and Pip tumbling head over heels just ahead of the net, which catches only the drumstick she dropped", b);
}

// ------------------------------------------------------------------ part pages
/** Part One: the gang hanging out on a tagged garden wall under a street lamp, with plenty of swagger. */
export function part_gang() {
  setPrefix("part-gang");
  let s = nightSky(900, 300, 41) + moon(110, 64, 26);
  s += streetLamp(806, 300, 270);
  s += bricks(-10, 214, 920, 90, { coping: true, seed: 3 });
  s += gangTag(300, 254, 0.42, C.accentB, 0.9, -4) + throwUp("NLG", 560, 252, 36, C.eyeBlue, C.light, -5) + tagMark("crown", 690, 256, 0.6, C.light, 0.8, 8) + tagMark("fish", 120, 258, 0.55, C.eyeBlue, 0.8);
  const top = 202;
  s += catSide({ look: "mags", x: 190, y: top, s: 0.3, flip: true, step: 0.2, head: 1, tailUp: 1, id: "g4" }); // on lookout, chin up
  s += catSit({ look: "pip", x: 296, y: top, s: 0.36, id: "g5", headTilt: -8 });
  s += catSit({ look: "velvet", x: 396, y: top, s: 0.36, id: "g3" });
  s += catSit({ look: "biscuit", x: 512, y: top, s: 0.37, id: "g2", headTilt: 6 });
  s += catSit({ look: "tilly", x: 768, y: top, s: 0.36, id: "g1", lean: 9 }); // leaning on the lamp post
  return svg("0 0 900 300", "The gang hangs out on a tagged garden wall under a street lamp: Mags on lookout, Pip grinning, Velvet looking innocent, Big Biscuit in his chain and Tilly leaning on the lamp post", panel("pg", s));
}

/** The whole roast chicken lying on the ground with one drumstick lifted into a pulling cat's teeth, in that cat's (right-facing) frame. */
function draggedChicken(look) {
  const [gx, gy] = pullGrip(look);
  let g = ell(gx + 70, 2, 66, 6, C.ink, C.ink, 0, ` opacity="0.18"`); // its contact shadow
  g += path(`M${gx + 126} -3h22 M${gx + 132} -11h18 M${gx + 124} 4h26`, "none", C.ink, 2.2, ` opacity="0.55"`); // scuff marks where it has been dragged
  // the bird, tipped up at the front by the gripped leg, its back end on the ground
  g += `<g transform="rotate(16 ${gx + 64} -30)">`;
  g += path(`M${gx + 92} -52L${gx + 116} -78L${gx + 124} -70L${gx + 102} -46Z`, C.gingerDeep, C.ink, 2.6) + circ(gx + 120, -80, 5, C.light, C.ink, 2) + circ(gx + 126, -76, 5, C.light, C.ink, 2); // the other drumstick
  g += ell(gx + 70, -30, 50, 30, C.ginger, C.ink, 3) + ell(gx + 56, -42, 15, 8, C.accentB, C.ink, 0, ` opacity="0.7"`) + path(`M${gx + 26} -16Q${gx + 70} -2 ${gx + 112} -18`, "none", C.gingerDeep, 2.4);
  g += `</g>`;
  // the gripped drumstick: from the bird's raised front end up to the bone in his teeth
  g += path(`M${gx + 14} -56L${gx + 1} ${r1(gy + 9)}L${gx + 9} ${r1(gy + 11)}L${gx + 32} -50Z`, C.gingerDeep, C.ink, 2.6);
  g += circ(gx - 3, gy - 1, 4.6, C.light, C.ink, 2) + circ(gx + 4, gy - 3, 4.6, C.light, C.ink, 2);
  return g;
}

/** Part Two: the robbery — Biscuit drags the whole chicken across the back garden; the cat flap behind is still swinging. */
export function part_robbery() {
  setPrefix("part-rob");
  const G = 270;
  let s = nightSky(900, 300, 52) + moon(820, 60, 22);
  s += fence(330, G, 600, 112);
  s += tagMark("paws", 700, G - 52, 0.6, C.light, 0.75, -6) + gangTag(860, G - 58, 0.32, C.accentB, 0.85);
  // the back of the house: its gutter and roof edge, the brick wall and the back door with its cat flap swinging out
  s += bricks(-10, 26, 330, G - 26, { seed: 8 });
  s += `<path d="M-14 26H324L314 6H-14Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/><rect x="-14" y="22" width="342" height="8" rx="3" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="2.4"/>`;
  s += door(140, G, 112, 214);
  const fx = 196, fy = G - 54;
  s += `<rect x="${fx - 24}" y="${fy}" width="48" height="42" rx="4" fill="${C.deep}" stroke="${C.ink}" stroke-width="2.6"/>`; // the flap's opening
  s += `<path d="M${fx - 24} ${fy}H${fx + 24}L${fx + 30} ${fy + 34}H${fx - 30}Z" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2.6"/>`; // the flap, swung out toward us on its top hinge
  s += path(`M${fx + 38} ${fy + 8}q8 12 0 24 M${fx + 46} ${fy + 4}q10 16 0 32`, "none", C.accentB, 2.4);
  // the garden: grass along the ground
  s += `<rect x="0" y="${G}" width="900" height="${300 - G}" fill="${C.leafDeep}"/>` + path(`M0 ${G}H900`, "none", C.ink, 3);
  let d = ""; for (let x = 8; x < 900; x += 14) d += `M${x} ${G + 2}l${(x % 28) ? 3 : -3} -9`;
  s += path(d, "none", C.leaf, 2.4);
  s += catSide({ look: "pip", x: 330, y: G, s: 0.3, step: -0.4, tailUp: 1, head: 0.3, id: "rp" });
  // Biscuit, braced and leaning back, hauls the chicken along by one drumstick (he walks backwards, to the left)
  const bx = 470, bs = 0.4;
  s += catSide({ look: "biscuit", x: bx, y: G, s: bs, pull: true, id: "rb" });
  s += `<g transform="translate(${bx} ${G}) scale(${bs})">${draggedChicken("biscuit")}</g>`;
  s += path(`M${bx + 86} ${G - 92}l6 -10 M${bx + 98} ${G - 86}l10 -6`, "none", C.accentB, 2.4); // effort
  s += catSide({ look: "tilly", x: 760, y: G - 122, s: 0.3, step: 0.3, tailUp: 0.7, head: 0.2, id: "rt" });
  return svg("0 0 900 300", "Big Biscuit, braced and leaning back, drags a whole roast chicken across a back garden at night by one drumstick; behind him the cat flap is still swinging, Pip trots after him and Tilly keeps watch along a tagged fence", panel("pr", s));
}

/** Part Three: the Storyteller's house — lit windows, someone at the upstairs window, and five pairs of eyes in the hedge. */
export function part_storyteller() {
  setPrefix("part-story");
  let s = nightSky(900, 300, 63) + moon(830, 44, 22);
  // the house: two storeys under its roof, the front door with its cat flap on the ground floor
  s += `<path d="M150 64L210 18H690L750 64Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>`;
  s += bricks(170, 64, 560, 240, { seed: 21 });
  s += litWindow(220, 88, 110, 66);
  // someone standing at the upstairs window, lit from behind, seen through the glass: head and shoulders only
  s += `<clipPath id="part-story-win"><rect x="220" y="88" width="110" height="66"/></clipPath><g clip-path="url(#part-story-win)">` +
    path(`M248 160Q250 124 275 120Q300 124 302 160Z`, C.dark, C.ink, 2.6) + circ(275, 108, 15, C.dark, C.ink, 2.6) + `</g>` +
    path(`M275 88V154`, "none", C.ink, 4) + path(`M220 88Q242 116 232 154H220Z M330 88Q308 116 318 154H330Z`, C.accentDeep, C.ink, 2.4); // the glazing bar and curtains in front of them
  s += litWindow(570, 88, 110, 66) + litWindow(570, 196, 110, 58);
  s += door(410, 300, 90, 128, { catFlap: true });
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
  let s = nightSky(900, 300, 74) + moon(470, 34, 18);
  const num = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-weight="800" font-size="14" fill="${C.accentB}">${t}</text>`;
  // Number 12: a small brick terrace, a cat flap in the door
  s += `<path d="M14 120L100 74L186 120Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + bricks(24, 120, 152, G - 120, { seed: 31 });
  s += litWindow(40, 140, 50, 44) + door(116, G, 46, 96) + `<rect x="129" y="${G - 22}" width="20" height="16" rx="2" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2"/>` + num(139, G - 70, "12");
  // Number 31, the Okafors: wider, painted, a garage; the door well clear of the window sills
  s += `<path d="M186 108L280 62L374 108Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/><rect x="196" y="108" width="168" height="${G - 108}" fill="${C.paper2}" stroke="${C.ink}" stroke-width="3"/>`;
  s += litWindow(212, 124, 54, 40) + litWindow(296, 124, 54, 40) + door(222, G, 44, 74) + num(244, G - 52, "31");
  s += `<rect x="282" y="${G - 74}" width="70" height="74" fill="${C.greyDeep}" stroke="${C.ink}" stroke-width="3"/>` + path(`M282 ${G - 58}H352 M282 ${G - 42}H352 M282 ${G - 26}H352`, "none", C.ink, 1.6);
  // Grandpa Wendell's: a cream cottage, Pom-Pom's fluffy shape behind the glass of the front window
  s += `<path d="M370 132L455 92L540 132Z" fill="${C.brickDeep}" stroke="${C.ink}" stroke-width="3"/><rect x="380" y="132" width="150" height="${G - 132}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  s += litWindow(396, 156, 62, 50);
  s += `<clipPath id="part-houses-pp"><rect x="396" y="156" width="62" height="50"/></clipPath><g clip-path="url(#part-houses-pp)">` +
    ell(418, 206, 19, 16, C.greyDeep) + circ(418, 188, 12, C.greyDeep) + path(`M409 180l-3 -8 l7 4Z M427 180l3 -8 l-7 4Z`, C.greyDeep, C.greyDeep, 1) + `</g>` + path(`M427 156V206`, "none", C.ink, 4); // the glazing bar in front of her
  s += door(484, G, 38, 80);
  // Number 5: the birthday house, balloons tied to the gatepost; the door below the windows, clear of their sills
  s += `<path d="M536 100L612 58L688 100Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + bricks(546, 100, 132, G - 100, { seed: 51, col: C.brickDeep });
  s += litWindow(558, 116, 44, 38) + litWindow(624, 116, 44, 38) + litWindow(624, 196, 44, 38) + door(562, G, 42, 74) + num(583, G - 52, "5");
  s += `<rect x="540" y="${G - 40}" width="12" height="40" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`; // the gatepost
  s += balloon(546, G - 36, 528, G - 86, C.accent, 12) + balloon(546, G - 36, 556, G - 92, C.eyeBlue, 12);
  // Chef Marchetti's: tall, with a skylight in the roof slope over the landing, and the bedroom's balcony on the left-hand side wall, the tree growing up to it
  s += `<path d="M736 84L812 40L888 84Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>`;
  // the skylight, set in the left-hand roof slope over the landing and propped open: its frame in the slope, the glass lifted on a stick
  s += `<g transform="rotate(-30 786 70)"><rect x="772" y="66" width="28" height="9" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/><path d="M772 66L800 66L798 58L774 58Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="1.6"/></g>`;
  s += bricks(746, 84, 132, G - 84, { seed: 61 });
  s += litWindow(762, 104, 46, 40) + litWindow(822, 104, 44, 40) + litWindow(834, 188, 30, 32) + door(764, G, 44, 84);
  // the balcony on the side wall: its slab and railing stick out from the wall at the upstairs floor, a lit door-glow beside it
  s += `<rect x="716" y="150" width="32" height="7" fill="${C.ink}"/>` + path(`M718 150V128H746 M724 150V128 M732 150V128 M740 150V128`, "none", C.ink, 2.4) + `<rect x="742" y="112" width="4" height="38" fill="${C.accentB}"/>`;
  s += path(`M708 ${G}V158 M708 178L722 158`, "none", C.woodDeep, 9) + circ(704, 154, 20, C.leafDeep, C.ink, 3) + circ(714, 132, 15, C.leafDeep, C.ink, 3); // the tree, between the houses, its branch reaching to the balcony
  // the pavement, and a low garden wall at the end of the street with the gang's sign on it
  s += `<rect x="0" y="${G}" width="900" height="${300 - G}" fill="${C.soft}"/>` + path(`M0 ${G}H900`, "none", C.ink, 3);
  return svg("0 0 900 300", "The Block at night: five houses side by side — the little terrace at Number 12, the Okafors' with its garage, Grandpa Wendell's cottage with Pom-Pom in the window, the party house with balloons on the gate, and Chef Marchetti's tall house with a skylight, a side balcony and a tree", panel("ph", s));
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
/** A patch of wall with its skirting board, standing on the floor line (a corner of a room for a spot). */
const wallPatch = (x0, x1, h = 240) => path(`M${x0} ${FL}V${FL - h + 18}Q${x0} ${FL - h} ${x0 + 18} ${FL - h}H${x1 - 18}Q${x1} ${FL - h} ${x1} ${FL - h + 18}V${FL}Z`, C.wall, C.ink, 0) +
  `<rect x="${x0}" y="${FL - 14}" width="${x1 - x0}" height="14" fill="${C.light}"/>` + path(`M${x0} ${FL - 14}H${x1}`, "none", C.ink, 2);

/** Back cover: home again — Big Biscuit asleep on a cushion under the window, beside a plate of picked-clean chicken bones. */
export function spot_back() {
  const px = 296;
  let s = wallPatch(54, 356) + windowWall(110, FL - 214, 120, 90, { night: true });
  s += cushion(158, FL, 156) + catCurl({ look: "biscuit", x: 150, y: FL - 36, s: 0.42, id: "bk" });
  const p = plate(px, FL, 52);
  // the bones, lying on the plate: a picked rib cage, two drumstick bones (a knob at each end) and a wishbone
  const knobBone = (x1, y1, x2, y2) => path(`M${x1} ${y1}L${x2} ${y2}`, "none", C.ink, 8) + path(`M${x1} ${y1}L${x2} ${y2}`, "none", C.paper2, 4) +
    circ(x1, y1, 4.4, C.paper2, C.ink, 2) + circ(x2, y2, 4.4, C.paper2, C.ink, 2);
  s += path(`M${px - 30} ${p.top}Q${px - 28} ${p.top - 30} ${px - 4} ${p.top - 32}Q${px + 18} ${p.top - 28} ${px + 18} ${p.top}`, C.paper2, C.ink, 2.4) +
    path(`M${px - 22} ${p.top}q2 -16 8 -24 M${px - 12} ${p.top}q0 -18 6 -28 M${px - 2} ${p.top}q0 -18 4 -28 M${px + 8} ${p.top}q0 -14 4 -22`, "none", C.ink, 1.8); // the rib cage
  s += knobBone(px + 22, p.top - 4, px + 44, p.top - 6) + knobBone(px - 46, p.top - 4, px - 30, p.top - 12);
  s += path(`M${px + 26} ${p.top - 10}l6 -12 l6 12`, "none", C.ink, 4.6) + path(`M${px + 26} ${p.top - 10}l6 -12 l6 12`, "none", C.paper2, 2); // the wishbone
  s += p.svg;
  return spot("spot-back", "Home again: Big Biscuit asleep on a cushion under the window, beside a plate of picked-clean chicken bones", s, { k: 1.0, cx: 205 });
}

/** Pip asleep, curled up on a pink cushion in front of a warm radiator. */
export function spot_curl() {
  let s = wallPatch(70, 330, 200);
  s += `<rect x="112" y="${FL - 150}" width="176" height="92" rx="8" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` + path(Array.from({ length: 9 }, (_, i) => `M${130 + i * 18} ${FL - 140}V${FL - 68}`).join(""), "none", C.edge, 3) +
    `<rect x="124" y="${FL - 58}" width="10" height="44" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/><rect x="266" y="${FL - 58}" width="10" height="44" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>` + // a radiator on its two feet
    path(`M160 ${FL - 170}q-6 -10 0 -20 M200 ${FL - 172}q-6 -10 0 -20 M240 ${FL - 170}q-6 -10 0 -20`, "none", C.accent, 2.2, ` opacity="0.8"`); // warmth rising
  s += cushion(200, FL, 170) + catCurl({ look: "pip", x: 192, y: FL - 38, s: 0.44, id: "sc" });
  return spot("spot-curl", "Pip curled up asleep on a pink cushion in front of a warm radiator", s, { k: 1.3 });
}

/** If it fits, he sits: Big Biscuit squeezed into a shoebox far too small for him, the lid on the floor beside it. */
export function spot_box() {
  const bx = 176, bw = 48, bh = 28;
  let s = shadowAt(bx + bw / 2, FL, bw * 0.7);
  s += path(`M${bx + 2} ${FL - bh}L${bx + 8} ${FL - bh - 8}H${bx + bw - 8}L${bx + bw - 2} ${FL - bh}Z`, C.wood, C.ink, 2.4); // the inside of the box
  s += catSit({ look: "biscuit", x: bx + bw / 2, y: FL - 6, s: 0.34, id: "sbx" });
  s += `<rect x="${bx}" y="${FL - bh}" width="${bw}" height="${bh}" fill="${C.eyeBlue}" stroke="${C.ink}" stroke-width="3"/>` + path(`M${bx + 8} ${FL - 16}h20 M${bx + 8} ${FL - 9}h14`, "none", C.light, 2.4); // the shoebox, in front of his overflowing middle
  s += path(`M${bx - 14} ${FL - 22}q-6 -4 -2 -10 M${bx + bw + 20} ${FL - 22}q6 -4 2 -10`, "none", C.ink, 2.2); // squeeze lines
  // the lid, lying flat on the floor beside the box
  s += shadowAt(282, FL, 26) + `<rect x="256" y="${FL - 7}" width="52" height="7" rx="2" fill="${C.eyeBlue}" stroke="${C.ink}" stroke-width="2.4"/>`;
  return spot("spot-box", "If it fits, he sits: Big Biscuit squeezed into a shoebox far too small for him, the lid lying on the floor beside it", s, { k: 1.5, cx: 210 });
}

/** Two-Bin Tilly sitting on the lid of one of two wheelie bins by a tagged alley wall. */
export function spot_bin() {
  let s = bricks(40, FL - 230, 330, 230, { seed: 15 }) + `<rect x="32" y="${FL - 242}" width="346" height="14" fill="${C.edge}" stroke="${C.ink}" stroke-width="3"/>`;
  s += throwUp("MEOW", 290, FL - 168, 30, C.eyeBlue, C.light, -6) + tagMark("arrow", 110, FL - 186, 0.6, C.accentB, 0.85);
  s += wheelieBin(90, FL, C.leafDeep, 112) + wheelieBin(226, FL, C.dark, 112) + tagMark("paws", 120, FL - 60, 0.4, C.accentB, 0.8);
  s += catSit({ look: "tilly", x: 124, y: FL - 124, s: 0.28, id: "sbn" });
  return spot("spot-bin", "Two-Bin Tilly sitting on the lid of one of two wheelie bins by a tagged alley wall", s, { k: 1.0, cx: 205 });
}

/** Knocked off: a mug on its side on the floor in a puddle of tea; Velvet sits on the side table above, looking innocent. */
export function spot_mug() {
  let s = wallPatch(40, 360, 230);
  // a small round side table on one central leg and a foot, a lamp and a photo frame on it
  s += shadowAt(150, FL, 46) + ell(150, FL - 4, 40, 6, C.woodDeep, C.ink, 2.6) + `<rect x="144" y="${FL - 110}" width="12" height="106" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2.4"/>` +
    `<rect x="90" y="${FL - 120}" width="120" height="12" rx="4" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.6"/>`;
  s += `<rect x="186" y="${FL - 148}" width="20" height="28" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/><rect x="190" y="${FL - 144}" width="12" height="16" fill="${C.sky}"/>` + path(`M196 ${FL - 120}l-6 6`, "none", C.ink, 0); // a photo in its frame, standing on the table
  s += catSit({ look: "velvet", x: 136, y: FL - 120, s: CAT, id: "smv", headTilt: 14 });
  s += ell(292, FL + 4, 54, 7, C.brown, C.ink, 2, ` opacity="0.85"`); // the puddle of tea, flat on the floor
  // the mug on its side: body, open mouth toward us at the right, handle on top
  s += `<rect x="254" y="${FL - 32}" width="50" height="32" rx="5" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` + ell(304, FL - 16, 6, 16, C.brown, C.ink, 2.6);
  s += path(`M268 ${FL - 32}q8 -16 20 0`, "none", C.ink, 7) + path(`M268 ${FL - 32}q8 -16 20 0`, "none", C.light, 3);
  s += circ(328, FL + 2, 3, C.brown) + circ(336, FL - 1, 2, C.brown); // drops, lying on the floor
  return spot("spot-mug", "A mug lying on its side in a puddle of tea on the floor; Velvet sits on the side table above, looking innocent", s, { k: 1.0, cx: 200 });
}

/** Pip pouncing on a ball of wool that has rolled out of the knitting basket, its loose strand lying across the floor. */
export function spot_wool() {
  const bx = 236, br = 26;
  let s = shadowAt(310, FL, 30) + path(`M284 ${FL}L280 ${FL - 36}H340L336 ${FL}Z`, C.wood, C.ink, 3) + path(`M282 ${FL - 24}H338 M281 ${FL - 12}H339`, "none", C.woodDeep, 2); // the knitting basket
  s += circ(300, FL - 42, 13, C.leaf, C.ink, 2.6) + path(`M296 ${FL - 48}L318 ${FL - 86} M304 ${FL - 46}L332 ${FL - 80}`, "none", C.ink, 4) + circ(318, FL - 88, 3.4, C.accent, C.ink, 1.4) + circ(333, FL - 82, 3.4, C.accent, C.ink, 1.4); // another ball, two needles stuck in it
  s += shadowAt(bx, FL, br) + circ(bx, FL - br, br, C.eyeBlue, C.ink, 3);
  s += path(`M${bx - 20} ${FL - 46}q22 10 44 -2 M${bx - 26} ${FL - 30}q26 12 52 0 M${bx - 20} ${FL - 14}q20 8 40 0 M${bx - 8} ${FL - 54}q-8 26 2 52`, "none", C.soft, 2.4);
  // the loose end comes out from under the ball and lies flat along the floor to Pip's paws
  s += path(`M${bx - 6} ${FL - 1}Q${bx - 40} ${FL + 1} ${bx - 70} ${FL - 1}T${bx - 120} ${FL - 1}`, "none", C.eyeBlue, 3) + path(`M${bx - 6} ${FL - 2}q-4 -6 -14 -4`, "none", C.eyeBlue, 3);
  s += catSide({ look: "pip", x: 110, y: FL, s: 0.34, crouch: 0.8, head: -0.4, tailUp: 1, step: 0.2, id: "sw" });
  return spot("spot-wool", "Pip crouching to pounce on a ball of blue wool that has rolled out of the knitting basket, its loose end lying across the floor", s, { k: 1.2, cx: 205 });
}

/** Purrfect: two dice both showing six on a rug, the shaker cup on its side, and Mags looking very pleased. */
export function spot_purrfect() {
  let s = ell(206, FL + 14, 150, 16, C.leafDeep, C.ink, 2.6) + ell(206, FL + 14, 124, 12, "none", C.accentB, 2);
  s += die(124, FL + 4, 56, 6) + die(200, FL + 8, 56, 6);
  s += shadowAt(92, FL + 12, 20) + path(`M64 ${FL + 10}L70 ${FL - 8}L108 ${FL - 14}L112 ${FL + 10}Z`, C.brick, C.ink, 2.6) + ell(110, FL - 2, 4, 12, C.brickDeep, C.ink, 2); // the shaker cup, lying on its side, its mouth toward the dice
  s += catSit({ look: "mags", x: 316, y: FL + 6, s: 0.32, id: "spm", headTilt: -10 });
  for (const [x, y, r] of [[106, FL - 86, 12], [256, FL - 94, 9], [178, FL - 112, 7]]) s += path(`M${x} ${y - r}Q${x + r * 0.26} ${y - r * 0.26} ${x + r} ${y}Q${x + r * 0.26} ${y + r * 0.26} ${x} ${y + r}Q${x - r * 0.26} ${y + r * 0.26} ${x - r} ${y}Q${x - r * 0.26} ${y - r * 0.26} ${x} ${y - r}Z`, C.accentB, C.ink, 1.8);
  return spot("spot-purrfect", "Two dice both showing six, a Purrfect, on a rug beside the shaker cup, with Mags looking very pleased", s, { k: 1.2, cx: 210 });
}

/** Shh: Noodle the sausage dog asleep in his basket in the Okafors' kitchen while Mags tiptoes past, Tayo's ball by the basket. */
export function spot_noodle() {
  const bk = dogBasket(150, FL, 190);
  let s = bk.back + dogLie({ dog: "noodle", x: 132, y: bk.bed, s: 0.5 }) + bk.front;
  s += ball(260, FL, 12, C.accent);
  s += catSide({ look: "mags", x: 296, y: FL, s: 0.28, crouch: 0.3, step: 0.9, head: -0.2, tailUp: 0.5, flip: true, id: "snm" }); // tiptoeing, one careful paw at a time
  s += path(`M${126} ${FL - 64}q6 -6 12 0 M${140} ${FL - 78}q6 -6 12 0`, "none", C.ink, 1.8, ` opacity="0.6"`); // sleepy breaths
  return spot("spot-noodle", "Noodle the sausage dog asleep in his wicker basket while Mags tiptoes past, Tayo's ball on the floor", s, { k: 1.08, cx: 205 });
}

/** Pip riding the robot vacuum across the floor, straight for a lost sock. */
export function spot_vacuum() {
  let s = wallPatch(40, 360, 200);
  s += vacuum(190, FL, 1.1) + catSit({ look: "pip", x: 190, y: FL - 18, s: 0.3, id: "sv" });
  s += path(`M110 ${FL - 10}h-34 M116 ${FL - 22}h-26`, "none", C.ink, 3); // it's moving
  s += shadowAt(318, FL, 22) + path(`M300 ${FL}V${FL - 8}Q300 ${FL - 22} 312 ${FL - 22}H330V${FL - 6}Q332 ${FL} 340 ${FL}Z`, C.eyeBlue, C.ink, 2.4) + path(`M302 ${FL - 10}h26`, "none", C.light, 2.4); // a sock lying on the floor ahead
  return spot("spot-vacuum", "Pip riding the robot vacuum across the floor, heading straight for a lost sock", s, { k: 1.25 });
}

/** Muddy paw prints walking across the floorboards from a knocked-over plant pot, seen from above. */
export function spot_paws() {
  setPrefix("spot-paws");
  let s = `<clipPath id="spot-paws-c"><rect x="30" y="40" width="340" height="220" rx="18"/></clipPath><g clip-path="url(#spot-paws-c)">`;
  s += `<rect x="30" y="40" width="340" height="220" fill="${C.floor}"/>`;
  let d = ""; for (let y = 72; y < 260; y += 32) d += `M30 ${y}H370`; for (const [x, y] of [[90, 40], [210, 72], [140, 104], [300, 136], [80, 168], [250, 200], [170, 232]]) d += `M${x} ${y}V${y + 32}`;
  s += path(d, "none", C.floorDeep, 2);
  // the plant pot on its side at the bottom left, its soil spilled out across the boards
  s += path(`M40 222Q70 196 112 214Q122 236 96 246Q60 252 40 240Z`, C.brownDeep, C.ink, 2.4, ` opacity="0.9"`);
  s += `<g transform="rotate(-24 62 232)"><path d="M30 214H82L76 252H36Z" fill="${C.brick}" stroke="${C.ink}" stroke-width="2.6"/><path d="M28 214H84" stroke="${C.ink}" stroke-width="3"/></g>`;
  s += path(`M86 210q10 -16 4 -30 M92 212q18 -6 26 -22`, "none", C.leafDeep, 3) + ell(92, 176, 7, 13, C.leaf, C.ink, 2) + ell(122, 188, 7, 13, C.leaf, C.ink, 2, ` transform="rotate(50 122 188)"`);
  // the prints: one cat walking, left and right paws one after another along a line (each 1 pad, 4 toes)
  const print = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})" fill="${C.brownDeep}" opacity="0.85">` + `<ellipse cx="0" cy="6" rx="10" ry="8"/>` +
    [[-11, -7], [-4, -12], [4, -12], [11, -7]].map(([px, py]) => `<ellipse cx="${px}" cy="${py}" rx="4" ry="5"/>`).join("") + `</g>`;
  [[140, 200], [168, 172], [194, 186], [222, 154], [248, 168], [276, 136], [302, 150], [330, 118]].forEach(([x, y]) => { s += print(x, y, 62); });
  s += `</g><rect x="30" y="40" width="340" height="220" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  return svg("0 0 400 300", "Muddy paw prints walking across the floorboards from a knocked-over plant pot, seen from above", s);
}

/** A fish skeleton licked clean on a plate, seen from above on the kitchen floor tiles, the fish-market paper and its string beside it. */
export function spot_fish() {
  setPrefix("spot-fish");
  let s = `<clipPath id="spot-fish-c"><rect x="40" y="30" width="320" height="240" rx="18"/></clipPath><g clip-path="url(#spot-fish-c)">`;
  for (let j = 0; j < 6; j++) for (let i = 0; i < 8; i++) s += `<rect x="${40 + i * 40}" y="${30 + j * 40}" width="40" height="40" fill="${(i + j) % 2 ? C.light : C.edge}"/>`;
  // the crumpled paper the salmon came in, with its string, lying flat on the tiles at the top right
  s += path(`M262 44L344 52L352 112L300 126L270 98Z`, C.light, C.ink, 2.4) + path(`M276 60L300 90L340 72 M290 108L316 82`, "none", C.edge, 2) + path(`M250 120Q270 142 300 132T346 150`, "none", C.woodDeep, 2.4);
  s += `</g><rect x="40" y="30" width="320" height="240" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  s += circ(196, 160, 100, C.ink, C.ink, 0, ` opacity="0.18"`) + circ(190, 154, 100, C.light, C.ink, 3) + circ(190, 154, 78, "none", C.edge, 2.4);
  // the skeleton, nearly the plate's width: head, spine, ribs, tail fin — all lying flat on the plate
  s += path(`M104 154Q118 132 142 154Q118 176 104 154Z`, C.paper2, C.ink, 2.6) + circ(120, 151, 3.4, C.ink);
  s += path(`M142 154H246`, "none", C.ink, 3.4);
  let r = ""; for (let x = 154; x <= 238; x += 12) r += `M${x} 154l6 -22 M${x} 154l6 22`;
  s += path(r, "none", C.ink, 2.2);
  s += path(`M246 154L280 128L270 154L280 180Z`, C.paper2, C.ink, 2.6);
  return svg("0 0 400 300", "A fish skeleton licked clean on a plate, seen from above on a tiled kitchen floor, with the fish-market paper and its string lying beside it", s);
}

/** Pudding, Mr Pell's old spaniel, lying by his empty bowl, tail thumping, as Big Biscuit makes friends. */
export function spot_pudding() {
  let s = "";
  s += shadowAt(118, FL, 24) + path(`M96 ${FL}L100 ${FL - 16}H136L140 ${FL}Z`, C.brick, C.ink, 2.6) + ell(118, FL - 16, 18, 3.6, C.brickDeep, C.ink, 1.8); // his empty bowl
  s += dogLie({ dog: "pudding", x: 176, y: FL, s: 0.46, awake: true });
  s += catSit({ look: "biscuit", x: 316, y: FL, s: 0.27, id: "spb", headTilt: -16 });
  s += path(`M282 ${FL - 100}c-4 -8 6 -12 8 -4c2 -8 12 -4 8 4l-8 8z`, C.light, C.ink, 1.6); // a little heart: the two are friends now
  return spot("spot-pudding", "Pudding the old spaniel lying by his empty bowl with his tail thumping, as Big Biscuit makes friends with him", s, { k: 1.15, cx: 205 });
}

/** Covering Captain's cage: a tea towel thrown over the dome, Captain peering out crossly, Velvet strolling off looking innocent. */
export function spot_parrot() {
  let s = parrotStand({ x: 120, floorY: FL, s: 0.9, cover: true });
  s += catSide({ look: "velvet", x: 296, y: FL, s: 0.3, step: 0.5, tailUp: 1, head: 0.4, id: "spv" });
  return spot("spot-parrot", "Captain the parrot's cage with a tea towel thrown over it to quiet him, while Velvet strolls off looking innocent", s, { k: 1.05, cx: 196 });
}

/** Pom-Pom, the Wendells' house cat, beside her fancy food bowl on its mat, under a framed picture of herself. */
export function spot_pompom() {
  let s = wallPatch(60, 350, 220);
  s += `<rect x="200" y="${FL - 196}" width="70" height="80" fill="${C.accent}" stroke="${C.ink}" stroke-width="3"/><rect x="208" y="${FL - 188}" width="54" height="64" fill="${C.paper2}" stroke="${C.ink}" stroke-width="2"/>` +
    circ(235, FL - 196 - 10, 2.4, C.ink) + path(`M235 ${FL - 206}L203 ${FL - 196} M235 ${FL - 206}L267 ${FL - 196}`, "none", C.ink, 1.6) + // the frame on its wire, hanging from a nail
    ell(235, FL - 136, 18, 12, C.silver) + circ(235, FL - 156, 11, C.silver) + path(`M227 ${FL - 163}l-3 -8 l7 4Z M243 ${FL - 163}l3 -8 l-7 4Z`, C.silver, C.silver, 1); // a portrait of Pom-Pom
  s += `<rect x="226" y="${FL - 4}" width="92" height="4" rx="2" fill="${C.accentDeep}"/>`; // her mat
  s += shadowAt(272, FL - 4, 30) + path(`M246 ${FL - 4}L252 ${FL - 24}H292L298 ${FL - 4}Z`, C.light, C.ink, 3) + path(`M250 ${FL - 14}H294`, "none", C.accent, 2.4) + ell(272, FL - 24, 22, 4, C.brown, C.ink, 2); // the bowl with a gold band, kibble showing
  s += catSit({ look: "pompom", x: 160, y: FL, s: 0.3, id: "spp", headTilt: 8 });
  return spot("spot-pompom", "Pom-Pom the large fluffy grey house cat sitting beside her fancy food bowl on its mat, under a framed picture of herself", s, { k: 1.0, cx: 210 });
}

/** The broom on its wall clip, a dustpan leaning on the wall, and Tilly slinking low past them. */
export function spot_broom() {
  let s = wallPatch(60, 350);
  s += broom(130, FL, 210);
  s += path(`M176 ${FL}L184 ${FL - 34}H222L216 ${FL}Z`, C.eyeBlue, C.ink, 2.6) + `<rect x="196" y="${FL - 62}" width="8" height="30" rx="3" fill="${C.eyeBlue}" stroke="${C.ink}" stroke-width="2.2" transform="rotate(10 200 ${FL - 34})"/>`; // a dustpan stood on its edge against the wall
  s += catSide({ look: "tilly", x: 272, y: FL, s: 0.3, crouch: 0.9, head: -0.4, tailLow: true, step: 0.4, id: "sbr" });
  return spot("spot-broom", "Tilly slinks low along the skirting board past a broom hanging on its wall clip and a dustpan", s, { k: 1.0, cx: 205 });
}

/** Chapter 12 tailpiece: a front door with a cat flap in a patch of brick wall, a milk bottle on the step, and Velvet sizing it up. */
export function spot_door() {
  let s = bricks(60, FL - 240, 290, 240, { seed: 12 });
  s += door(150, FL - 12, 110, 214, { catFlap: true });
  s += `<rect x="134" y="${FL - 12}" width="142" height="12" fill="${C.light}" stroke="${C.ink}" stroke-width="2.6"/>`; // the doorstep, on the pavement
  s += `<rect x="164" y="${FL - 16}" width="82" height="4" rx="2" fill="${C.leafDeep}"/>`; // a doormat on the step
  const bx = 250, by = FL - 12;
  s += shadowAt(bx, by, 12) + path(`M${bx - 11} ${by}V${by - 34}Q${bx - 11} ${by - 44} ${bx - 6} ${by - 50}V${by - 58}H${bx + 6}V${by - 50}Q${bx + 11} ${by - 44} ${bx + 11} ${by - 34}V${by}Z`, C.light, C.ink, 2.6);
  s += path(`M${bx - 11} ${by - 30}V${by}H${bx + 11}V${by - 30}Z`, C.paper, C.ink, 0); // the milk inside
  s += `<rect x="${bx - 7}" y="${by - 62}" width="14" height="6" rx="2" fill="${C.accent}" stroke="${C.ink}" stroke-width="2"/>`;
  s += catSit({ look: "velvet", x: 104, y: FL, s: CAT, id: "sdr", headTilt: -8 });
  return spot("spot-door", "Velvet sits on the pavement sizing up a front door with a cat flap, a milk bottle on the step", s, { k: 1.0, cx: 205 });
}

/** Tagging over the rivals: on an alley wall a rival crew's scruffy fish-skeleton scrawl, the gang's 9-head tag sprayed big over it; Mags admires her work, paint on her paw, the can at her feet. */
export function spot_rivals() {
  let s = bricks(30, FL - 230, 340, 230, { seed: 19 }) + `<rect x="22" y="${FL - 242}" width="356" height="14" fill="${C.edge}" stroke="${C.ink}" stroke-width="3"/>`;
  s += rivalTag(190, FL - 140, 1.25, C.leaf, 0.9);
  s += gangTag(196, FL - 138, 1.05, C.accentB, 0.95, -6); // sprayed right over it
  s += spray(`M232 ${FL - 96}v26`, C.accentB, 3) + circ(232, FL - 66, 3, C.accentB); // a fresh drip
  // the spray can, lying on its side on the pavement, a dot of paint by its nozzle
  s += shadowAt(312, FL, 24) + `<rect x="288" y="${FL - 18}" width="44" height="18" rx="6" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2.6"/>` +
    `<rect x="332" y="${FL - 14}" width="8" height="10" rx="2" fill="${C.light}" stroke="${C.ink}" stroke-width="2"/>` + path(`M296 ${FL - 18}V${FL}`, "none", C.ink, 1.6, ` opacity="0.4"`) + ell(350, FL + 2, 7, 2.4, C.accentB);
  s += catSit({ look: "mags", x: 100, y: FL, s: 0.3, id: "srv", headTilt: -6 });
  s += ell(100 - 8, FL - 3, 7, 3, C.accentB) + ell(100 + 8, FL - 3, 7, 3, C.accentB); // paint on her front paws
  return spot("spot-rivals", "Tagging over the rivals: on an alley wall a rival crew's scruffy fish-skeleton scrawl has the gang's 9-head tag sprayed big over it, and Mags admires her work, paint on her paws, the spray can at her feet", s, { k: 1.0, cx: 205 });
}
