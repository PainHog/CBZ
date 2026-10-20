// House chapter vignettes (900×300), one per ready-to-play house (Part Four).
// Same scale rules as vignettes.mjs: the floor at y = 262, a counter 150 tall,
// a cat at s = 0.3 (Pip 0.26), humans shown only from the hips down, cropped by
// the top edge. Each scene matches its house's text (book/src/houses/*.html)
// and data (sim/houses.mjs): the prize where it starts, the residents as named.
import { C, svg } from "./lib.mjs";
import { setPrefix, path, circ } from "../lib.mjs";
import { catSide, catSit } from "../cats.mjs";
import { dogSide, dogLie, parrotStand, vacuum } from "../residents.mjs";
import { room, door, counter, table, legs, windowWall, coatHooks, parcel, dogBed, ball, paperBag, chair, balloon, bunting, cake, presents, salmon, cooker, panRail } from "../kit.mjs";

const FLOOR = 262;

/** A doorway into the next room: the frame, the room beyond (its wall and floor), and the door swung right back against the wall. */
function doorway(x, w = 170, h = 236, { wall = C.wallDeep } = {}) {
  let s = `<rect x="${x - 8}" y="${FLOOR - h - 8}" width="${w + 16}" height="${h + 8}" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${FLOOR - h}" width="${w}" height="${h}" fill="${wall}" stroke="${C.ink}" stroke-width="2.6"/>`;
  s += `<rect x="${x}" y="${FLOOR - 10}" width="${w}" height="10" fill="${C.light}"/>` + path(`M${x} ${FLOOR - 10}H${x + w}`, "none", C.ink, 2); // the next room's skirting
  return s;
}

/** The Okafors' hall: Biscuit and Mags shove the huge sealed box while Tilly rides on top; Noodle sleeps in his basket in the kitchen. */
export function ch_okafor_box() {
  setPrefix("v-oka");
  let b = room(900, 300, FLOOR, { seed: 31 });
  b += door(24, FLOOR, 120, 238); // the front door, shut
  b += coatHooks(176, 34, 150, [C.leafDeep, C.eyeBlue, null]);
  b += ball(160, FLOOR + 4, 12, C.accent); // Tayo's ball
  // the kitchen through the doorway, Noodle asleep in his basket
  b += doorway(690, 180);
  const bd = dogBed(780, FLOOR, 168);
  b += bd.svg + dogLie({ dog: "noodle", x: 768, y: bd.bed, s: 0.44 });
  const p = parcel(300, FLOOR, 260, 170);
  b += p.svg;
  b += catSide({ look: "biscuit", x: 247, y: FLOOR, s: 0.32, step: -0.7, head: -0.5, tailUp: 0.4, id: "ob" });
  b += catSide({ look: "mags", x: 612, y: FLOOR, s: 0.3, flip: true, step: -0.7, head: -0.5, tailUp: 0.6, id: "om" });
  b += catSit({ look: "tilly", x: 430, y: p.top, s: 0.3, id: "ot", headTilt: 6 });
  return svg("0 0 900 300", "The Okafors' hall: Big Biscuit and Mags shove a huge sealed delivery box from both ends with Tilly riding on top, while Noodle the sausage dog sleeps in his basket in the kitchen", b);
}

/** Grandpa Wendell's hall: Pip stalks the pet-shop bag with the catnip mouse in it; Velvet waits; Grandpa walks off to the kitchen; Pom-Pom glares from the window sill. */
export function ch_wendell_mouse() {
  setPrefix("v-wen");
  let b = room(900, 300, FLOOR, { seed: 41 });
  b += door(24, FLOOR, 120, 238); // the front door, shut
  b += coatHooks(176, 34, 100, [C.brownDeep, null]);
  // the kitchen door, open, and Grandpa going through it
  b += door(520, FLOOR, 140, 238, { ajar: 0.62 });
  b += legs({ x: 574, floorY: FLOOR + 6, top: -4, trousers: C.greyDeep, shoe: C.brownDeep, w: 32, walking: 0.3 });
  // the front window with Pom-Pom on the sill, a radiator under it
  b += windowWall(706, 30, 120, 112, { night: true });
  const sill = 30 + 112 + 8;
  b += `<rect x="704" y="${FLOOR - 100}" width="124" height="70" rx="6" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` +
    path(Array.from({ length: 7 }, (_, i) => `M${720 + i * 15} ${FLOOR - 92}V${FLOOR - 38}`).join(""), "none", C.edge, 3) +
    `<rect x="712" y="${FLOOR - 30}" width="10" height="30" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/><rect x="810" y="${FLOOR - 30}" width="10" height="30" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>`; // radiator on its two feet
  b += catSit({ look: "pompom", x: 766, y: sill, s: 0.3, id: "wp", headTilt: -8 });
  b += vacuum(866, FLOOR, 0.66);
  // the bag on the hall floor and the gang
  b += paperBag(330, FLOOR, 70, 92);
  b += catSide({ look: "pip", x: 268, y: FLOOR, s: 0.26, crouch: 1, head: -0.3, tailUp: 0.9, step: 0.2, id: "wpi" });
  b += catSit({ look: "velvet", x: 452, y: FLOOR, s: 0.3, id: "wv", headTilt: -10 });
  return svg("0 0 900 300", "Grandpa Wendell's hall: Pip stalks the pet-shop bag with a red catnip mouse peeking out, Velvet waits, Grandpa walks off to the kitchen and Pom-Pom glares down from the window sill", b);
}

/** Number 5's dining room at the party: the cake on the table, Velvet on a chair with balloons tied to it, Pip under the table, Captain shouting from his cage, Dad's legs. */
export function ch_birthday_cake() {
  setPrefix("v-cake");
  let b = room(900, 300, FLOOR, { seed: 51 });
  b += bunting(292, 24, 660, 24, 16, 10);
  b += parrotStand({ x: 36, floorY: FLOOR, s: 0.8 });
  // Captain's shout: a speech bubble pointing at the cage
  b += path(`M140 40H246Q256 40 256 50V78Q256 88 246 88H150L124 106L136 88Q130 88 130 78V50Q130 40 140 40Z`, C.light, C.ink, 2.6);
  b += `<text x="193" y="74" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="24" fill="${C.ink}">PARTY!</text>`;
  const t = table(250, FLOOR, 250, 120, { cloth: C.light });
  b += t.svg + cake(375, t.top, 1.1);
  b += catSide({ look: "pip", x: 336, y: FLOOR, s: 0.26, crouch: 0.5, head: 0.3, tailUp: 0.8, step: 0.1, id: "cp" });
  const ch = chair(582, FLOOR, { flip: true });
  b += balloon(ch.backTop[0], ch.backTop[1] + 4, 606, 76, C.accent, 18) + balloon(ch.backTop[0], ch.backTop[1] + 4, 642, 92, C.eyeBlue, 17);
  b += ch.svg + catSit({ look: "velvet", x: 540, y: ch.seat, s: 0.3, id: "cv", headTilt: -12 });
  b += legs({ x: 722, floorY: FLOOR + 6, top: -4, trousers: C.dark, shoe: C.ink, w: 32, walking: 0.2 });
  b += presents(812, FLOOR);
  return svg("0 0 900 300", "Party at Number 5: a chocolate birthday cake on the dining table, Velvet on a chair with balloons tied to it, Pip under the table, Captain the parrot squawking 'Party!' and Dad's legs", b);
}

/** Chef Marchetti's kitchen: Brutus barks in the utility doorway, Biscuit faces him down; Mags creeps along the island to the wrapped salmon; the chef cooks at the stove. */
export function ch_marchetti_salmon() {
  setPrefix("v-mar");
  let b = room(900, 300, FLOOR, { seed: 61, wall: C.paper2 });
  b += door(22, FLOOR, 150, 238, { ajar: 0.86 }); // the utility room door, open
  b += panRail(196, 16, 170, 3);
  b += dogSide({ dog: "brutus", x: 146, y: FLOOR, s: 0.52, bark: true });
  b += catSide({ look: "biscuit", x: 352, y: FLOOR, s: 0.32, flip: true, step: 0, head: 0.3, tailUp: 1, id: "mb" });
  const c = counter(420, FLOOR, 220, 150);
  b += c.svg + salmon(563, c.top, 0.75);
  b += catSide({ look: "mags", x: 443, y: c.top, s: 0.28, crouch: 0.6, head: -0.3, tailLow: true, step: 0.3, id: "mm" });
  const k = cooker(762, FLOOR, 128, 150);
  b += k.svg;
  b += legs({ x: 712, floorY: FLOOR + 6, top: -4, trousers: C.light, shoe: C.ink, w: 32, walking: 0.1 }); // the chef, between the island and the stove
  return svg("0 0 900 300", "Chef Marchetti's kitchen: Brutus the mastiff barks from the utility doorway as Big Biscuit stands up to him, Mags creeps along the island to the paper-wrapped salmon, and the chef cooks at the stove", b);
}
