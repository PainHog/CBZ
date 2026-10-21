// House chapter vignettes (900×300), one per ready-to-play house (Part Four).
// Same scale rules as vignettes.mjs (kit.mjs SCALE): the floor at y = 262, a counter 150 tall, a
// table 120, a gang cat at s = SCALE.cat, doors SCALE.door tall (their tops run out of the frame),
// humans shown only from the hips down, cropped by the top edge. Each scene matches its house's text
// (book/src/houses/*.html) and data (sim/houses.mjs): the prize where it starts, the residents as named.
import { C, svg } from "./lib.mjs";
import { setPrefix, path, circ, ell } from "../lib.mjs";
import { catSide, catSit, glint } from "../cats.mjs";
import { dogSide, dogLie, parrotStand, vacuum } from "../residents.mjs";
import { room, door, counter, table, legs, windowWall, coatHooks, parcel, dogBasket, ball, paperBag, chair, balloon, bunting, cake, presents, salmon, cooker, panRail,
  chicken, fridge, bin, tiles, tap, kettle, shelf, SCALE } from "../kit.mjs";
import { keyRing } from "./vignettes.mjs";

const FLOOR = 262, CAT = SCALE.cat;

/** A doorway into the next room: the frame, the room beyond (its wall and floor). Its top runs out of the frame like every door. */
function doorway(x, w = 170, h = SCALE.door, { wall = C.wallDeep } = {}) {
  let s = `<rect x="${x - 8}" y="${FLOOR - h - 8}" width="${w + 16}" height="${h + 8}" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${FLOOR - h}" width="${w}" height="${h}" fill="${wall}" stroke="${C.ink}" stroke-width="2.6"/>`;
  s += `<rect x="${x}" y="${FLOOR - 10}" width="${w}" height="10" fill="${C.light}"/>` + path(`M${x} ${FLOOR - 10}H${x + w}`, "none", C.ink, 2); // the next room's skirting
  return s;
}
/** A key hook by the door: a little board screwed to the wall with one hook and a ring of keys on it. */
const keyHook = (x, y) => `<rect x="${x - 16}" y="${y - 6}" width="32" height="12" rx="3" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.2"/>` + circ(x - 10, y, 1.6, C.ink) + circ(x + 10, y, 1.6, C.ink) +
  path(`M${x} ${y + 4}v6q0 4 4 3`, "none", C.ink, 2.6) + keyRing(x + 2, y + 8, 0.9);

/** Number 12: Mr Pell's kitchen. Tilly creeps along the counter toward the chicken in its foil; Biscuit by the bin; Mags under the table; Mr Pell's legs in the doorway. */
export function ch_number_12() {
  setPrefix("v-n12");
  let b = room(900, 300, FLOOR, { seed: 12 });
  b += door(30, FLOOR, SCALE.doorW, SCALE.door, { ajar: 0.55 });
  b += legs({ x: 96, floorY: FLOOR + 6, top: -4, trousers: C.brownDeep, shoe: C.ink, w: 34 });
  b += keyHook(212, 70);
  b += shelf(250, 66, 140, 3);
  const c = counter(470, FLOOR, 300, SCALE.counter);
  b += tiles(470, c.top, 300, 44) + windowWall(560, -24, 130, 74, { open: true });
  b += c.svg + tap(590, c.top) + kettle(506, c.top);
  b += chicken(734, c.top, 0.6, { foil: true });
  b += catSide({ look: "tilly", x: 652, y: c.top, s: CAT, crouch: 0.5, step: 0.3, tailUp: 0.4, head: -0.3, id: "n12t" });
  const f = fridge(785, FLOOR, 110, 300);
  b += f.svg;
  const t = table(200, FLOOR, 170, SCALE.table);
  b += t.svg;
  b += catSit({ look: "mags", x: 285, y: FLOOR, s: CAT, id: "n12m" });
  b += bin(400, FLOOR);
  b += catSide({ look: "biscuit", x: 372, y: FLOOR, s: CAT, flip: true, step: -0.2, tailUp: 1, head: 0.3, id: "n12b" });
  return svg("0 0 900 300", "Mr Pell's kitchen: Tilly creeps along the counter, past the kettle and the sink, towards the chicken in its foil while Big Biscuit waits by the bin and Mags hides under the table; Mr Pell's keys hang by the door", b, { bleed: true });
}

/** The Okafors' hall: Biscuit and Mags shove the huge sealed box while Tilly rides on top; Noodle sleeps in his basket in the kitchen. */
export function ch_okafor_box() {
  setPrefix("v-oka");
  let b = room(900, 300, FLOOR, { seed: 31 });
  b += door(24, FLOOR, SCALE.doorW, SCALE.door); // the front door, shut
  b += coatHooks(196, 34, 150, [C.leafDeep, C.eyeBlue, null]);
  b += ball(180, FLOOR + 4, 12, C.accent); // Tayo's ball
  // the kitchen through the doorway, Noodle asleep in his basket
  b += doorway(690, 180);
  const bk = dogBasket(780, FLOOR, 160);
  b += bk.back + dogLie({ dog: "noodle", x: 762, y: bk.bed, s: 0.4 }) + bk.front;
  const p = parcel(300, FLOOR, 260, 170);
  b += p.svg;
  b += catSide({ look: "biscuit", x: 247, y: FLOOR, s: CAT, step: -0.7, head: -0.5, tailUp: 0.4, id: "ob" });
  b += catSide({ look: "mags", x: 614, y: FLOOR, s: CAT, flip: true, step: -0.7, head: -0.5, tailUp: 0.6, id: "om" });
  b += catSit({ look: "tilly", x: 430, y: p.top, s: CAT, id: "ot", headTilt: 6 });
  return svg("0 0 900 300", "The Okafors' hall: Big Biscuit and Mags shove a huge sealed delivery box from both ends with Tilly riding on top, while Noodle the sausage dog sleeps in his basket in the kitchen", b, { bleed: true });
}

/** Grandpa Wendell's hall: Pip stalks the pet-shop bag with the catnip mouse in it; Velvet waits; Grandpa walks off to the kitchen; Pom-Pom glares from the window sill. */
export function ch_wendell_mouse() {
  setPrefix("v-wen");
  let b = room(900, 300, FLOOR, { seed: 41 });
  b += door(24, FLOOR, SCALE.doorW, SCALE.door); // the front door, shut
  b += coatHooks(196, 34, 100, [C.brownDeep, null]);
  // the kitchen door, open, and Grandpa going through it
  b += door(520, FLOOR, SCALE.doorW, SCALE.door, { ajar: 0.62 });
  b += legs({ x: 578, floorY: FLOOR + 6, top: -4, trousers: C.greyDeep, shoe: C.brownDeep, w: 32, walking: 0.3 });
  // the front window with Pom-Pom on the sill, a radiator under it
  b += windowWall(716, 22, 120, 112, { night: true });
  const sill = 22 + 112 + 8;
  b += `<rect x="714" y="${FLOOR - 100}" width="124" height="70" rx="6" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` +
    path(Array.from({ length: 7 }, (_, i) => `M${730 + i * 15} ${FLOOR - 92}V${FLOOR - 38}`).join(""), "none", C.edge, 3) +
    `<rect x="722" y="${FLOOR - 30}" width="10" height="30" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/><rect x="820" y="${FLOOR - 30}" width="10" height="30" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>`; // radiator on its two feet
  b += catSit({ look: "pompom", x: 776, y: sill, s: CAT, id: "wp", headTilt: -8 });
  b += vacuum(872, FLOOR, 0.66);
  // the bag on the hall floor and the gang
  b += paperBag(330, FLOOR, 70, 92);
  b += catSide({ look: "pip", x: 262, y: FLOOR, s: 0.3, crouch: 1, head: -0.3, tailUp: 0.9, step: 0.2, id: "wpi" });
  b += catSit({ look: "velvet", x: 452, y: FLOOR, s: CAT, id: "wv", headTilt: -10 });
  return svg("0 0 900 300", "Grandpa Wendell's hall: Pip stalks the pet-shop bag with a red catnip mouse peeking out, Velvet waits, Grandpa walks off to the kitchen and Pom-Pom glares down from the window sill", b, { bleed: true });
}

/** Number 5's dining room at the party: the cake on the table, Velvet on a chair with balloons tied to it, Pip under the table, Captain shouting from his cage, Dad's legs. */
export function ch_birthday_cake() {
  setPrefix("v-cake");
  let b = room(900, 300, FLOOR, { seed: 51 });
  b += bunting(292, 24, 660, 24, 16, 10);
  b += parrotStand({ x: 36, floorY: FLOOR, s: 0.8 });
  // Captain's shout: a speech bubble pointing at the cage
  b += path(`M146 40H252Q262 40 262 50V78Q262 88 252 88H156L130 106L142 88Q136 88 136 78V50Q136 40 146 40Z`, C.light, C.ink, 2.6);
  b += `<text x="199" y="74" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="24" fill="${C.ink}">PARTY!</text>`;
  const t = table(250, FLOOR, 250, SCALE.table, { cloth: C.light });
  b += t.svg + cake(375, t.top, 1.1);
  b += catSide({ look: "pip", x: 336, y: FLOOR, s: 0.3, crouch: 0.5, head: 0.3, tailUp: 0.8, step: 0.1, id: "cp" });
  const ch = chair(582, FLOOR, { flip: true });
  b += balloon(ch.backTop[0], ch.backTop[1] + 4, 606, 76, C.accent, 18) + balloon(ch.backTop[0], ch.backTop[1] + 4, 642, 92, C.eyeBlue, 17);
  b += ch.svg + catSit({ look: "velvet", x: 540, y: ch.seat, s: CAT, id: "cv", headTilt: -12 });
  b += legs({ x: 722, floorY: FLOOR + 6, top: -4, trousers: C.dark, shoe: C.ink, w: 32, walking: 0.2 });
  b += presents(812, FLOOR);
  return svg("0 0 900 300", "Party at Number 5: a chocolate birthday cake on the dining table, Velvet on a chair with balloons tied to it, Pip under the table, Captain the parrot squawking 'Party!' and Dad's legs", b, { bleed: true });
}

/** Chef Marchetti's kitchen: Brutus barks in the utility doorway, Biscuit faces him down; Mags creeps along the island to the wrapped salmon; the chef cooks at the stove. */
export function ch_marchetti_salmon() {
  setPrefix("v-mar");
  let b = room(900, 300, FLOOR, { seed: 61, wall: C.paper2 });
  b += door(14, FLOOR, 170, SCALE.door, { ajar: 0.86 }); // the utility room door, open
  b += panRail(228, 16, 170, 3);
  b += dogSide({ dog: "brutus", x: 150, y: FLOOR, s: 0.66, bark: true });
  const c = counter(470, FLOOR, 200, SCALE.counter);
  b += c.svg + salmon(608, c.top, 0.7);
  b += catSide({ look: "biscuit", x: 418, y: FLOOR, s: CAT, flip: true, step: 0, head: 0.3, tailUp: 1, id: "mb" });
  b += catSide({ look: "mags", x: 498, y: c.top, s: CAT, crouch: 0.6, head: -0.3, tailLow: true, step: 0.3, id: "mm" });
  const k = cooker(764, FLOOR, 128, SCALE.counter);
  b += k.svg;
  b += legs({ x: 716, floorY: FLOOR + 6, top: -4, trousers: C.light, shoe: C.ink, w: 30, walking: 0.1 }); // the chef, between the island and the stove
  return svg("0 0 900 300", "Chef Marchetti's kitchen: Brutus, an enormous mastiff, barks from the utility doorway as Big Biscuit squares up to him, Mags creeps along the island to the paper-wrapped salmon, and the chef cooks at the stove", b, { bleed: true });
}
