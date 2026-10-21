// Chapter vignettes (900×300). The book's scale (ART-CHECKLIST §12, kit.mjs SCALE): in interiors the
// floor is at y = 262, a kitchen counter is 150 tall, a table 120, and a gang cat is drawn at
// s = SCALE.cat (Pip and Pom-Pom scale themselves by their looks). Doors are SCALE.door tall, so the top
// of every door runs out of the top of the frame, like the humans, who show only from the hips down.
// The gang are thugs played for laughs (the author, 2026-10-21): tough looks that don't quite work,
// swagger, slapstick. Graffiti goes on outdoor walls and fences only.
import { C, svg } from "./lib.mjs";
import { setPrefix, strokes, path, circ, ell } from "../lib.mjs";
import { catSide, catSit, catCurl, LOOKS, glint } from "../cats.mjs";
import { room, windowWall, door, counter, table, bin, chicken, legs, plant, shadowAt, SCALE,
  nightSky, moon, bricks, litWindow, streetLamp, wheelieBin, humanBack, BLEED,
  die, glass, broom, cushion, heightChart, fence, box, toyMouse, sofa, lamp, rug, shelf, wallClock, armchair, windowWall as win,
  gangTag, tagMark, throwUp } from "../kit.mjs";
import { dogSide, parrotStand, vacuum } from "../residents.mjs";

const FLOOR = 262, CAT = SCALE.cat;

/** A ring of keys hanging from a nail or a lock at (x, y): the split ring, two keys hanging straight down, a glint. */
export function keyRing(x, y, s = 1) {
  const k = v => v * s;
  let g = circ(x, y + k(7), k(6), "none", C.ink, 3.4) + circ(x, y + k(7), k(6), "none", C.accent, 1.8);
  for (const [dx, col] of [[-3, C.accentB], [4, C.grey]]) g += path(`M${x + k(dx)} ${y + k(12)}v${k(16)}h${k(3)}v${k(-3)}h${k(-3)}`, "none", C.ink, 4.2) + path(`M${x + k(dx)} ${y + k(12)}v${k(16)}h${k(3)}v${k(-3)}h${k(-3)}`, "none", col, 2.2) + circ(x + k(dx), y + k(12), k(3.6), col, C.ink, 1.6);
  return g + glint(x + k(10), y + k(4), k(5));
}

/** Chapter 1: the street at night. The gang watches from the garden wall as Mr Pell carries his shopping in. */
export function ch_welcome() {
  setPrefix("v-wel");
  const G = 276;
  let b = nightSky(900, 300, 9, BLEED) + moon(318, 52, 20);
  // the house front on the right under its slate roof; the front door has opened inward into the lit hall
  b += `<path d="M458 44L486 8H1090V44Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + path(`M476 22H1090 M466 34H1090`, "none", C.deep, 2);
  b += bricks(470, 40, 430 + BLEED, G - 40, { seed: 4 });
  b += `<rect x="632" y="${G - 178}" width="104" height="178" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>`; // the door frame
  b += `<rect x="640" y="${G - 170}" width="88" height="170" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2.6"/>`; // the lit hall beyond
  b += path(`M640 ${G - 170}L662 ${G - 162}V${G - 6}L640 ${G}Z`, C.wood, C.ink, 2.6); // the door, swung open into the hall on its left hinges (its edge toward us)
  b += keyRing(659, G - 92, 0.9); // his keys, still hanging in the lock
  b += `<rect x="626" y="${G - 4}" width="116" height="8" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`; // step
  b += litWindow(500, 96, 100, 84) + litWindow(780, 96, 90, 84);
  b += humanBack({ x: 690, groundY: G - 2, s: 0.62, coat: C.dark, trousers: C.brownDeep, hair: C.greyDeep });
  // pavement
  b += `<rect x="${-BLEED}" y="${G}" width="${900 + 2 * BLEED}" height="${300 - G}" fill="${C.soft}"/><path d="M${-BLEED} ${G}H${900 + BLEED}" stroke="${C.ink}" stroke-width="3"/>`;
  // the low garden wall on the left with the gang on top; their sign sprayed on its face
  b += bricks(20, G - 70, 360, 300 - G + 76, { coping: true, seed: 7 }); // nearer to us than the house: its foot is below the bottom edge
  b += gangTag(318, G - 34, 0.36, C.accentB, 0.85, -4) + tagMark("crown", 70, G - 34, 0.6, C.eyeBlue, 0.8, 6);
  const top = G - 82;
  b += catSit({ look: "velvet", x: 66, y: top, s: 0.27, id: "wv" });
  b += catSit({ look: "tilly", x: 130, y: top, s: 0.27, id: "wt", headTilt: 8 });
  b += catSide({ look: "mags", x: 212, y: top, s: 0.24, step: 0.6, tailUp: 1, head: 0.3, id: "wm" });
  b += catSit({ look: "biscuit", x: 296, y: top, s: 0.27, id: "wb" });
  b += catSit({ look: "pip", x: 352, y: top, s: 0.27, id: "wp", headTilt: -10 });
  b += streetLamp(398, G, 250);
  b += wheelieBin(426, G, C.leafDeep, 124) + tagMark("paws", 460, G - 66, 0.5, C.accentB, 0.8, -8);
  return svg("0 0 900 300", "Night on the street: the gang watches from a garden wall as a man carries his shopping into a lit house, his keys still in the door", b, { bleed: true });
}

// Random cats for "make your own" (not the gang): a tortoiseshell, a black-and-white, a cream.
const RANDOM = {
  tort: { name: "a tortoiseshell", coat: C.brownDeep, deep: C.black, stripe: null, belly: C.brown, eye: C.eyeAmber, tabby: false,
    patches: { left: { face: C.ginger, flank: C.ginger }, right: { flank: C.ginger }, tailTip: null }, body: "lean", ears: "tall", tail: "plain" },
  bw: { name: "a black-and-white", coat: C.black, deep: "#1a1820", stripe: null, belly: C.white, eye: C.eyeGreen, tabby: false, muzzle: C.white,
    body: "chonky", ears: "round", tail: "plain", rim: C.soft },
  cream: { name: "a cream", coat: C.cream, deep: C.creamDeep, stripe: C.creamDeep, belly: C.light, eye: C.eyeBlue, tabby: true, body: "lean", ears: "small", tail: "fluffy", grin: true },
};

/** Chapter 2: a line-up of cats against a height chart — make your own. */
export function ch_your_cat() {
  setPrefix("v-cat");
  let b = room(900, 300, FLOOR, { seed: 21 }) + `<g transform="translate(${-BLEED} 0)">${heightChart(900 + 2 * BLEED, FLOOR - 14, 20)}</g>`;
  b += `<rect x="${-BLEED}" y="30" width="${900 + 2 * BLEED}" height="12" fill="${C.dark}"/>`;
  const cats = [[{ ...RANDOM.tort, cool: true }, 150, 0.34], [RANDOM.bw, 330, 0.34], [RANDOM.cream, 510, 0.34], [{ ...LOOKS.mags }, 690, 0.34]];
  cats.forEach(([L, x, s], i) => {
    b += catSit({ look: L, x, y: FLOOR, s, id: `yc${i}`, headTilt: [6, 0, -8, 4][i] });
    // a numbered wooden block standing on the floor just in front of the cat
    b += shadowAt(x, FLOOR + 26, 30) + `<rect x="${x - 24}" y="${FLOOR + 2}" width="48" height="24" rx="3" fill="${C.wood}" stroke="${C.ink}" stroke-width="2.4"/>` +
      `<text x="${x}" y="${FLOOR + 20}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-weight="800" font-size="17" fill="${C.light}">${i + 1}</text>`;
  });
  return svg("0 0 900 300", "Four cats in a police line-up against a height chart, each behind a numbered wooden block, each pulling its best tough face", b, { bleed: true });
}

/** Chapter 3: the gang strutting along the top of a garden fence at night, in single file. */
export function ch_gang() {
  setPrefix("v-gang");
  const G = 290;
  let b = nightSky(900, 300, 31, BLEED) + moon(120, 60, 22);
  b += fence(-BLEED, G, 900 + 2 * BLEED, 120);
  // tags sprayed on the fence boards
  b += gangTag(250, G - 62, 0.42, C.accentB, 0.85, -6) + throwUp("NLG", 560, G - 66, 40, C.eyeBlue, C.light, -5) + tagMark("fish", 820, G - 56, 0.7, C.light, 0.75, 8) + tagMark("crown", 40, G - 70, 0.6, C.eyeBlue, 0.8);
  const rail = G - 130;
  b += catSide({ look: "tilly", x: 770, y: rail, s: 0.3, step: 0.4, tailUp: 0.6, head: 0.3, id: "g1" });
  b += catSide({ look: "biscuit", x: 615, y: rail, s: 0.3, step: -0.3, tailUp: 0.9, head: 0.4, id: "g2" });
  b += catSide({ look: "velvet", x: 460, y: rail, s: 0.3, step: 0.3, tailUp: 0.7, id: "g3" });
  b += catSide({ look: "mags", x: 312, y: rail, s: 0.3, step: -0.2, tailUp: 0.9, head: 0.3, id: "g4" });
  b += catSide({ look: "pip", x: 182, y: rail, s: 0.3, step: 0.6, tailUp: 1, head: 0.5, id: "g5" });
  return svg("0 0 900 300", "The gang struts in single file along the top of a tagged garden fence under the moon, chins up", b, { bleed: true });
}

/** Chapter 4: dice on the rug; Tilly sizes up the six, Pip pounces. */
export function ch_rolling() {
  setPrefix("v-roll");
  let b = room(900, 300, FLOOR, { seed: 4, wall: C.paper2 }) + rug(450, FLOOR, 360, C.leafDeep);
  b += die(240, FLOOR + 14, 66, 3) + die(342, FLOOR + 20, 66, 6) + die(444, FLOOR + 12, 66, 4);
  b += catSit({ look: "tilly", x: 640, y: FLOOR + 18, s: 0.32, id: "r1", headTilt: -12 });
  b += catSide({ look: "pip", x: 150, y: FLOOR + 16, s: 0.32, crouch: 0.8, head: -0.4, tailUp: 0.9, step: 0.1, id: "r2" });
  return svg("0 0 900 300", "Three dice on a rug showing 3, 6 and 4; Tilly studies the six with a tough squint while Pip crouches to pounce on them", b, { bleed: true });
}

/** Chapter 5: the Mood — a broom on one side, a pink cushion on the other, Velvet between looking innocent. */
export function ch_mood() {
  setPrefix("v-mood");
  let b = room(900, 300, FLOOR, { seed: 5 });
  b += broom(180, FLOOR, 210);
  b += cushion(720, FLOOR, 110);
  b += catSit({ look: "velvet", x: 450, y: FLOOR, s: 0.34, id: "m1" });
  b += `<text x="180" y="40" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="30" fill="${C.alarm}">BROOM</text>`;
  b += `<text x="720" y="40" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="30" fill="${C.cuddle}">CUDDLE</text>`;
  return svg("0 0 900 300", "Velvet sits looking innocent between a broom (the Broom meter) and a pink cushion (the Cuddle meter)", b, { bleed: true });
}

/** Chapter 6: a round — a hallway; Mags slinks along the skirting board as someone walks in through a door. */
export function ch_round() {
  setPrefix("v-round");
  let b = room(900, 300, FLOOR, { seed: 6 });
  b += door(560, FLOOR, SCALE.doorW, SCALE.door, { ajar: 0.6 });
  b += legs({ x: 640, floorY: FLOOR + 6, top: -4, trousers: C.leafDeep, shoe: C.woodDeep, w: 34, walking: 0.3 });
  b += wallClock(330, 70, 34);
  b += shelf(110, 120, 150, 3);
  b += catSide({ look: "mags", x: 360, y: FLOOR, s: CAT, crouch: 0.9, head: -0.5, tailLow: true, step: 0.4, id: "rd1" });
  b += plant(830, FLOOR, 0.9);
  return svg("0 0 900 300", "A hallway: as someone walks in through a door, Mags creeps low along the skirting board under a wall clock", b, { bleed: true });
}

/** Chapter 7: instincts — a glass at the table's edge, a box with a cat in it, a cat on a high shelf, a toy mouse. */
export function ch_instincts() {
  setPrefix("v-inst");
  let b = room(900, 300, FLOOR, { seed: 7 });
  const t = table(80, FLOOR, 240, SCALE.table);
  b += t.svg + glass(300, t.top, 46);
  b += catSide({ look: "velvet", x: 210, y: t.top, s: CAT, step: 0.1, tailUp: 0.9, head: -0.3, id: "i1" });
  b += box(420, FLOOR, 150, 90);
  b += catSit({ look: "mags", x: 495, y: FLOOR - 36, s: CAT, id: "i2" });
  b += `<rect x="420" y="${FLOOR - 52}" width="150" height="52" fill="${C.creamDeep}" stroke="${C.ink}" stroke-width="3"/>` + path(`M436 ${FLOOR - 22}h40 M436 ${FLOOR - 12}h26`, "none", C.ink, 2); // the box's front wall covers her lower half
  b += shelf(640, 96, 200, 0);
  b += catCurl({ look: "tilly", x: 724, y: 96, s: CAT, id: "i3" });
  b += toyMouse(610, FLOOR + 10, 0.8);
  return svg("0 0 900 300", "Instincts: Velvet eyes a glass on the edge of a table, Mags sits in a cardboard box, Tilly naps on a high shelf, and a toy mouse lies on the floor", b, { bleed: true });
}

/** Chapter 8: the three kinds of prize — the chicken on the counter, the box, the mouse — and cats after each. */
export function ch_prize() {
  setPrefix("v-prize");
  let b = room(900, 300, FLOOR, { seed: 8 });
  const c = counter(40, FLOOR, 250, SCALE.counter);
  b += c.svg + chicken(190, c.top, 0.62);
  b += catSit({ look: "biscuit", x: 330, y: FLOOR, s: CAT, id: "p1", headTilt: 12 });
  b += box(430, FLOOR, 170, 120);
  b += catSide({ look: "tilly", x: 650, y: FLOOR, s: CAT, flip: true, step: 0.2, head: -0.2, tailUp: 0.8, id: "p2" });
  b += toyMouse(866, FLOOR, 0.8);
  b += catSide({ look: "pip", x: 795, y: FLOOR, s: 0.28, crouch: 1, head: -0.5, tailUp: 1, step: 0.1, id: "p3" });
  return svg("0 0 900 300", "Three kinds of prize: Big Biscuit gazes up at a chicken on the counter, Tilly sizes up a big cardboard box, Pip stalks a toy mouse", b, { bleed: true });
}

/** Chapter 9: Shoo! — someone sweeps with a broom (only legs and the broom show) as Biscuit bolts for the open back door with a stolen drumstick. */
export function ch_caught() {
  setPrefix("v-caught");
  let b = room(900, 300, FLOOR, { seed: 9 });
  // the back door wide open onto the night garden (its top runs out of the frame, like the sweeper)
  const dx = 690, dw = 140, top = FLOOR - SCALE.door;
  b += `<rect x="${dx - 8}" y="${top - 8}" width="${dw + 16}" height="${SCALE.door + 8}" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>`;
  b += `<rect x="${dx}" y="${top}" width="${dw}" height="${SCALE.door}" fill="${C.deep}" stroke="${C.ink}" stroke-width="3"/>`;
  b += moon(770, 70, 14) + circ(718, 40, 1.6, C.accentB) + circ(806, 120, 1.4, C.accentB);
  b += `<rect x="${dx}" y="${FLOOR - 40}" width="${dw}" height="40" fill="${C.leafDeep}"/>` + path(`M${dx} ${FLOOR - 40}H${dx + dw}`, "none", C.ink, 2); // the lawn outside
  b += path(`M${dx} ${top}L${dx - 40} ${top + 12}V${FLOOR + 6}L${dx} ${FLOOR}Z`, C.wood, C.ink, 3); // the door swung open on its hinges
  b += legs({ x: 230, floorY: FLOOR + 6, top: -4, trousers: C.dark, shoe: C.ink, w: 36, walking: 0.4 });
  // the broom, held by the sweeper above the frame: its handle runs out of the top edge, bristles sweeping the floor
  b += path(`M300 -10L389 ${FLOOR - 67}`, "none", C.woodDeep, 9);
  b += `<g transform="translate(0 -12) rotate(-22 400 ${FLOOR - 28})">${path(`M382 ${FLOOR - 56}H418L436 ${FLOOR}H364Z`, C.accent, C.ink, 3)}<rect x="380" y="${FLOOR - 62}" width="40" height="10" rx="3" fill="${C.alarm}" stroke="${C.ink}" stroke-width="2.4"/></g>`;
  b += strokes([[452, FLOOR - 44, 492, FLOOR - 44], [446, FLOOR - 24, 500, FLOOR - 24]], C.ink, 3);
  // Biscuit flat out for the door, a drumstick in his jaws; dust kicked up behind him
  b += catSide({ look: "biscuit", x: 590, y: FLOOR, s: CAT, run: true, carry: "leg", id: "c1" });
  b += circ(520, FLOOR - 8, 7, C.paper2, C.ink, 2) + circ(508, FLOOR - 16, 5, C.paper2, C.ink, 2) + circ(530, FLOOR - 20, 4, C.paper2, C.ink, 1.8);
  return svg("0 0 900 300", "Shoo! A broom sweeps across the kitchen floor and Big Biscuit bolts flat out for the open back door with a stolen drumstick in his jaws", b, { bleed: true });
}

/** Chapter 10: who lives there — a living room with a house cat on the sofa, Pudding the dog, a parrot in its cage and the robot vacuum. */
export function ch_residents() {
  setPrefix("v-res");
  let b = room(900, 300, FLOOR, { seed: 10 });
  b += win(70, 40, 120, 90, { night: true });
  const sf = sofa(250, FLOOR, 280);
  b += sf.svg + catSit({ look: "housecat", x: 360, y: sf.seat, s: CAT, id: "r1" });
  b += dogSide({ dog: "pudding", x: 660, y: FLOOR, s: 0.42, flip: true });
  b += vacuum(110, FLOOR, 0.9);
  b += parrotStand({ x: 780, floorY: FLOOR, s: 0.8 });
  return svg("0 0 900 300", "Who lives there: a cream-and-white house cat on the sofa, a spaniel, a robot vacuum and a parrot in a cage hanging from a stand", b, { bleed: true });
}

/** Chapter 13: the Block — the gang on a roof ridge by a chimney, looking out over the street's roofs under the moon. */
export function ch_the_block() {
  setPrefix("v-block");
  let b = nightSky(900, 300, 13, BLEED) + moon(780, 60, 26);
  // far roofs with lit windows
  for (const [x, w, h] of [[-180, 200, 130], [0, 220, 120], [200, 180, 150], [370, 240, 110], [600, 160, 140], [740, 180, 120], [900, 190, 135]]) {
    b += `<path d="M${x} 300V${300 - h}L${x + w / 2} ${300 - h - 50}L${x + w} ${300 - h}V300Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="2.6"/>`;
    b += `<rect x="${x + w / 2 - 12}" y="${300 - h - 34}" width="24" height="22" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/>`; // attic window, above our ridge
  }
  // our roof in front: slates, a ridge, a chimney standing on it with the gang's sign sprayed on its bricks
  b += `<path d="M-10 300L80 200H820L910 300Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="3"/>`;
  let d = ""; for (let y = 220; y < 300; y += 20) d += `M${80 - (y - 200) * 0.9} ${y}H${820 + (y - 200) * 0.9}`;
  b += path(d, "none", C.dark, 1.6);
  b += `<rect x="600" y="140" width="60" height="62" fill="${C.brick}" stroke="${C.ink}" stroke-width="3"/><rect x="592" y="132" width="76" height="12" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.6"/>`;
  b += gangTag(630, 172, 0.2, C.accentB, 0.85);
  const ridge = 200;
  b += catSit({ look: "velvet", x: 180, y: ridge, s: CAT, id: "b1" });
  b += catSit({ look: "tilly", x: 250, y: ridge, s: CAT, id: "b2", headTilt: 6 });
  b += catSit({ look: "biscuit", x: 330, y: ridge, s: CAT, id: "b3" });
  b += catCurl({ look: "pip", x: 420, y: ridge, s: CAT, id: "b4" });
  b += catSide({ look: "mags", x: 524, y: ridge, s: 0.24, step: 0.4, tailUp: 0.9, head: 0.3, id: "b5" });
  return svg("0 0 900 300", "The Block: the gang sits along a roof ridge by a tagged chimney, looking out over the street's roofs and lit windows under the moon", b, { bleed: true });
}

/** Chapter 11: the Storyteller's view — one wall cut through, two rooms at once: next door, someone checks the clock; in the kitchen, the gang goes for the chicken. */
export function ch_storyteller() {
  setPrefix("v-story");
  let b = room(900, 300, FLOOR, { seed: 11 });
  // left: the front room. A standard lamp (its shade above the frame, its glow showing) and a tall wing chair
  b += circ(48, -10, 120, C.accentB, C.ink, 0, ` opacity="0.35"`) + shadowAt(48, FLOOR, 34) + ell(48, FLOOR - 6, 32, 8, C.woodDeep, C.ink, 3) + `<rect x="44" y="-6" width="8" height="${FLOOR}" fill="${C.woodDeep}" stroke="${C.ink}" stroke-width="2.4"/>`;
  const ac = armchair(92, FLOOR, 150, { col: C.dark, h: 236 });
  b += ac.svg;
  b += wallClock(268, 44, 24);
  b += legs({ x: 334, floorY: FLOOR + 6, top: -4, trousers: C.brownDeep, shoe: C.woodDeep, w: 32, walking: 0 });
  // the wall between, cut through (a section, hatched like a plan)
  const W0 = 420, W1 = 466;
  b += `<rect x="${W0}" y="-4" width="${W1 - W0}" height="308" fill="${C.brick}" stroke="${C.ink}" stroke-width="3"/>`;
  let d = ""; for (let y = -40; y < 320; y += 16) d += `M${W0} ${y + 46}L${W1} ${y}`;
  b += `<clipPath id="v-story-cut"><rect x="${W0}" y="-4" width="${W1 - W0}" height="308"/></clipPath><path clip-path="url(#v-story-cut)" d="${d}" stroke="${C.brickDeep}" stroke-width="3"/>`;
  // right: the kitchen
  const c = counter(560, FLOOR, 250, SCALE.counter);
  b += c.svg + chicken(752, c.top, 0.62);
  b += catSide({ look: "tilly", x: 628, y: c.top, s: CAT, crouch: 0.5, head: -0.2, tailUp: 0.5, step: 0.3, id: "st" });
  b += catSit({ look: "biscuit", x: 512, y: FLOOR, s: CAT, id: "sb", headTilt: 12 });
  b += bin(832, FLOOR);
  return svg("0 0 900 300", "The Storyteller's view, through a wall cut away: in the front room someone stands checking the clock by a wing chair; in the kitchen next door Tilly creeps along the counter to the chicken while Big Biscuit keeps watch", b, { bleed: true });
}

/** Chapter 12: making a house — seen from above: a pencil floor plan on the table, a pencil, three dice, a mug, and a ginger paw batting a die. */
export function ch_making_a_house() {
  setPrefix("v-make");
  const ink = C.inkSoft;
  let b = `<rect x="${-BLEED}" y="0" width="${900 + 2 * BLEED}" height="300" fill="${C.wood}"/>`;
  let d = ""; for (let y = 58; y < 300; y += 60) d += `M${-BLEED} ${y}H${900 + BLEED}`;
  b += path(d, "none", C.woodDeep, 2.4);
  b += path(`M60 20q40 10 90 0 M620 140q50 12 110 0 M300 262q60 10 120 -2 M780 222q30 8 70 0`, "none", C.woodDeep, 1.6, ` opacity="0.6"`); // grain
  // the sheet of paper, lying flat, with its shadow
  b += `<g transform="rotate(-3 360 150)">`;
  b += `<rect x="156" y="28" width="420" height="256" fill="${C.ink}" opacity="0.18"/><rect x="150" y="22" width="420" height="256" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>`;
  // the plan, in pencil: outer walls with gaps for the entrances, inner walls with door gaps
  const plan = [
    "M190 50H300 M332 50H520V96 M520 116V214H286 M254 214H190V50", // outer walls: window gap (top), cat-flap gap (right), front-door gap (bottom)
    "M340 50V110 M340 140V214",                                  // front room | hall and kitchen
    "M340 132H408 M436 132H520",                                 // hall | kitchen
    "M440 132V160 M440 186V214",                                 // hall | loo
  ].join(" ");
  b += path(plan, "none", ink, 4);
  b += path(`M300 46V54 M332 46V54 M300 50H332`, "none", ink, 1.6); // the window, drawn as a thin line
  b += path(`M270 240V222 M262 230L270 220L278 230`, "none", ink, 2.4) + path(`M546 106H528 M536 98L526 106L536 114`, "none", ink, 2.4); // arrows: entrances
  b += path(`M520 106Q470 108 470 90Q470 76 486 76`, "none", ink, 2, ` stroke-dasharray="5 6"`); // the gang's route
  b += path(`M478 62L498 82M498 62L478 82`, "none", C.ink, 4); // the X
  const label = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-style="italic" font-weight="700" font-size="15" fill="${ink}">${t}</text>`;
  b += label(265, 136, "FRONT ROOM") + label(430, 108, "KITCHEN") + label(390, 180, "HALL") + label(480, 206, "LOO");
  // the pencil, lying wholly on the paper
  b += `<g transform="rotate(-10 452 250)">`;
  b += `<rect x="360" y="252" width="176" height="12" rx="4" fill="${C.ink}" opacity="0.18"/>`;
  b += `<rect x="370" y="244" width="140" height="12" fill="${C.accent}" stroke="${C.ink}" stroke-width="2.2"/>` + path(`M370 248H510 M370 252H510`, "none", C.accentDeep, 1.2);
  b += `<rect x="360" y="244" width="10" height="12" fill="${C.grey}" stroke="${C.ink}" stroke-width="2"/><rect x="348" y="244" width="12" height="12" rx="3" fill="${C.pink}" stroke="${C.ink}" stroke-width="2"/>`;
  b += path(`M510 244L534 250L510 256Z`, C.cream, C.ink, 2) + path(`M526 248L534 250L526 252Z`, C.ink, C.ink, 1);
  b += `</g></g>`;
  // three dice, lying on the table, top faces up
  const dieTop = (x, y, a, face, sz = 46) => {
    const p = sz * 0.26, at = { tl: [-p, -p], tr: [p, -p], ml: [-p, 0], mr: [p, 0], bl: [-p, p], br: [p, p], c: [0, 0] };
    const pips = { 1: ["c"], 2: ["tl", "br"], 3: ["tl", "c", "br"], 4: ["tl", "tr", "bl", "br"], 5: ["tl", "tr", "c", "bl", "br"], 6: ["tl", "tr", "ml", "mr", "bl", "br"] }[face];
    return `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="${-sz / 2 + 4}" y="${-sz / 2 + 5}" width="${sz}" height="${sz}" rx="8" fill="${C.ink}" opacity="0.22"/>` +
      `<rect x="${-sz / 2}" y="${-sz / 2}" width="${sz}" height="${sz}" rx="8" fill="${C.light}" stroke="${C.ink}" stroke-width="3"/>` +
      pips.map(k => `<circle cx="${at[k][0]}" cy="${at[k][1]}" r="${sz * 0.08}" fill="${C.ink}"/>`).join("") + `</g>`;
  };
  b += dieTop(650, 70, 12, 6) + dieTop(742, 150, -8, 4) + dieTop(636, 202, 25, 2);
  // a mug of tea, from above: the rim, the tea, the handle
  b += `<circle cx="826" cy="64" r="36" fill="${C.ink}" opacity="0.2"/>`;
  b += `<rect x="852" y="50" width="34" height="18" rx="8" fill="${C.eyeBlue}" stroke="${C.ink}" stroke-width="3"/>`;
  b += `<circle cx="822" cy="60" r="34" fill="${C.eyeBlue}" stroke="${C.ink}" stroke-width="3"/><circle cx="822" cy="60" r="25" fill="${C.brown}" stroke="${C.ink}" stroke-width="2"/>`;
  // Mags's ginger paw reaching in from the bottom edge, batting the nearest die
  const leg = `M712 312Q700 268 676 240`;
  b += path(leg, "none", C.ink, 36) + path(leg, "none", C.ginger, 29);
  b += path(`M690 300l18 -8 M684 280l18 -10 M680 262l16 -10`, "none", C.gingerDeep, 4);
  b += `<ellipse cx="670" cy="232" rx="22" ry="18" fill="${C.ginger}" stroke="${C.ink}" stroke-width="3" transform="rotate(-40 670 232)"/>`;
  b += path(`M660 226l-8 -6 M668 220l-5 -8 M676 218l-1 -9`, "none", C.ink, 2.2);
  return svg("0 0 900 300", "Making a house, seen from above: a pencil floor plan on a sheet of paper with a pencil lying on it, three dice and a mug of tea on the table, and a ginger paw batting one of the dice", b, { bleed: true });
}

import { warden } from "../residents.mjs";
import { lootInMouth } from "../cats.mjs";
/**
 * The getaway (a chapter head): the gang dashes along the top of a back-garden fence at night with the
 * loot — Velvet out in front, Mags with a gold watch, Biscuit with a drumstick, Tilly with a slice of
 * cake — while Pip, last, trips over her own kerchief and the animal control warden's net swipes the air
 * just behind her. A piece of cake, dropped, falls toward the lawn. The warden stands in the garden
 * below the fence, cropped by the bottom of the frame.
 */
export function ch_getaway() {
  setPrefix("v-get");
  const G = 300, rail = 168;
  let b = nightSky(900, 300, 88, BLEED) + moon(820, 54, 22);
  b += fence(-BLEED, G + 2, 900 + 2 * BLEED, G - rail - 8); // its top rail level with the cats' paws (y = rail)
  b += gangTag(600, 238, 0.4, C.accentB, 0.85, -5) + tagMark("paws", 760, 250, 0.55, C.light, 0.7, -10) + throwUp("MEOW", 420, 246, 30, C.eyeBlue, C.light, -6);
  // the gang along the top rail, flat out (run: one hind paw on the rail, the rest stretched out)
  b += catSide({ look: "velvet", x: 834, y: rail, s: 0.28, run: true, id: "ge1" });
  b += catSide({ look: "mags", x: 704, y: rail, s: 0.28, run: true, carry: "watch", id: "ge2" });
  b += catSide({ look: "biscuit", x: 572, y: rail, s: 0.28, run: true, carry: "leg", id: "ge3" });
  b += catSide({ look: "tilly", x: 440, y: rail, s: 0.28, run: true, carry: "cake", id: "ge4" });
  // a slice of cake, dropped, falling past the fence toward the lawn
  b += `<g transform="translate(388 198) rotate(-140)">${lootInMouth("cake", 0, 0)}</g>` + path(`M378 172v-12 M392 176v-10`, "none", C.light, 2, ` opacity="0.8"`);
  // Pip, last, tripping over the point of her too-big kerchief: pitched forward, front paws flung out
  b += catSide({ look: "pip", x: 318, y: rail - 6, s: 0.32, leap: true, rot: 24, id: "ge5" });
  b += path(`M340 ${rail - 74}l-6 -10 M354 ${rail - 78}l0 -12 M368 ${rail - 74}l6 -10`, "none", C.accentB, 2.4); // whoops
  // the warden in the garden below, cropped by the bottom edge, his net swiping just behind her
  // (clipped to the band, so he is cropped cleanly at its bottom edge however the page shows the picture)
  b += `<clipPath id="v-get-band"><rect x="${-BLEED}" y="0" width="${900 + 2 * BLEED}" height="300"/></clipPath><g clip-path="url(#v-get-band)">${warden({ x: 40, groundY: 398, s: 0.8, swing: 46 })}</g>`;
  b += path(`M176 ${rail - 44}q-18 18 -14 46 M186 ${rail - 30}q-12 12 -10 30`, "none", C.light, 2.4, ` opacity="0.7"`); // the swipe
  return svg("0 0 900 300", "The getaway: the gang dashes along the top of a tagged back-garden fence with the loot — a gold watch, a drumstick, a slice of cake — while Pip trips over her kerchief at the back and the animal control warden's net swipes just behind her", b, { bleed: true });
}
