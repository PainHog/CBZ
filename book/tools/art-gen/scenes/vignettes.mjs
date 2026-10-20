// Chapter vignettes (900×300). Scale across the book (ART-CHECKLIST §12):
// in interiors the floor is at y = 262, a kitchen counter is 150 tall and a
// cat is drawn at s = 0.3 (a kitten 0.26); a human shows only from the knees
// or hips down, cropped by the top edge.
import { C, svg } from "./lib.mjs";
import { setPrefix } from "../lib.mjs";
import { catSide, catSit } from "../cats.mjs";
import { room, windowWall, door, counter, table, fridge, bin, chicken, legs, plant } from "../kit.mjs";
import { strokes, path } from "../lib.mjs";

const FLOOR = 262;

/** Number 12: Mr Pell's kitchen. Tilly creeps along the counter toward the chicken; Biscuit by the bin; Mags under the table; Mr Pell's legs in the doorway. */
export function ch_number_12() {
  setPrefix("v-n12");
  let b = room(900, 300, FLOOR, { seed: 12 });
  b += door(40, FLOOR, 120, 238, { ajar: 0.55 });
  b += legs({ x: 92, floorY: FLOOR + 6, top: -4, trousers: C.brownDeep, shoe: C.ink, w: 34 });
  b += windowWall(560, 14, 130, 74, { open: true });
  b += shelf(196, 104, 150, 3) + wallClock(420, 66);
  const c = counter(470, FLOOR, 300, 150);
  b += c.svg;
  b += chicken(660, c.top, 0.62);
  b += catSide({ look: "tilly", x: 530, y: c.top, s: 0.3, step: 0.3, tailUp: 0.4, head: -0.3, id: "n12t" });
  const f = fridge(785, FLOOR, 105, 236);
  b += f.svg;
  const t = table(200, FLOOR, 170, 112);
  b += t.svg;
  b += catSit({ look: "mags", x: 285, y: FLOOR, s: 0.3, id: "n12m" });
  b += bin(400, FLOOR);
  b += catSide({ look: "biscuit", x: 365, y: FLOOR, s: 0.3, flip: true, step: -0.2, tailUp: 1, id: "n12b" });
  return svg("0 0 900 300", "Mr Pell's kitchen: Tilly creeps along the counter towards the chicken while Big Biscuit waits by the bin and Mags hides under the table", b);
}

/** Chapter 1: the street at night. The gang watches from the garden wall as Mr Pell carries his shopping in. */
import { nightSky, moon, bricks, litWindow, streetLamp, wheelieBin, humanBack } from "../kit.mjs";
export function ch_welcome() {
  setPrefix("v-wel");
  const G = 276;
  let b = nightSky(900, 300, 9) + moon(318, 52, 20);
  // the house front on the right under its slate roof, the open door lit from inside
  b += `<path d="M458 44L486 8H912V44Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="3"/>` + path(`M476 22H912 M466 34H912`, "none", C.deep, 2);
  b += bricks(470, 40, 430, G - 40, { seed: 4 });
  b += `<rect x="640" y="${G - 170}" width="88" height="170" fill="${C.accentB}" stroke="${C.ink}" stroke-width="3"/>`;
  b += `<path d="M640 ${G - 170}L612 ${G - 160}V${G + 2}L640 ${G}Z" fill="${C.wood}" stroke="${C.ink}" stroke-width="3"/>`; // door swung open, hinged on the left
  b += `<rect x="626" y="${G - 4}" width="116" height="8" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.4"/>`; // step
  b += litWindow(500, 96, 100, 84) + litWindow(780, 96, 90, 84);
  b += humanBack({ x: 684, groundY: G - 2, s: 0.62, coat: C.dark, trousers: C.brownDeep, hair: C.greyDeep });
  // pavement
  b += `<rect x="0" y="${G}" width="900" height="${300 - G}" fill="${C.soft}"/><path d="M0 ${G}H900" stroke="${C.ink}" stroke-width="3"/>`;
  // the low garden wall on the left with the gang on top
  b += bricks(20, G - 70, 360, 70, { coping: true, seed: 7 });
  const top = G - 82;
  b += catSit({ look: "velvet", x: 70, y: top, s: 0.32, id: "wv" });
  b += catSit({ look: "tilly", x: 140, y: top, s: 0.32, id: "wt", headTilt: 8 });
  b += catSide({ look: "mags", x: 215, y: top, s: 0.27, step: 0, tailUp: 0.3, id: "wm" });
  b += catSit({ look: "biscuit", x: 300, y: top, s: 0.33, id: "wb" });
  b += catSit({ look: "pip", x: 352, y: top, s: 0.27, id: "wp", headTilt: -10 });
  b += streetLamp(430, G, 250);
  b += wheelieBin(392, G);
  return svg("0 0 900 300", "Night on the street: the gang watches from a garden wall as a man carries his shopping into a lit house", b);
}

import { die, glass, broom, cushion, heightChart, fence, box, toyMouse, sofa, lamp, rug, shelf, wallClock, windowWall as win } from "../kit.mjs";
import { catCurl, LOOKS } from "../cats.mjs";
import { dogSide, parrotStand, vacuum } from "../residents.mjs";

// Random cats for "make your own" (not the gang): a tortoiseshell, a black-and-white, a cream.
const RANDOM = {
  tort: { name: "a tortoiseshell", coat: C.brownDeep, deep: C.black, stripe: null, belly: C.brown, eye: C.eyeAmber, tabby: false,
    patches: { left: { face: C.ginger, flank: C.ginger }, right: { flank: C.ginger }, tailTip: null }, body: "lean", ears: "tall", tail: "plain" },
  bw: { name: "a black-and-white", coat: C.black, deep: "#1a1820", stripe: null, belly: C.white, eye: C.eyeGreen, tabby: false, muzzle: C.white,
    body: "chonky", ears: "round", tail: "plain", rim: C.soft },
  cream: { name: "a cream", coat: C.cream, deep: C.creamDeep, stripe: C.creamDeep, belly: C.light, eye: C.eyeBlue, tabby: true, body: "lean", ears: "small", tail: "fluffy" },
};

/** Chapter 2: a line-up of cats against a height chart — make your own. */
export function ch_your_cat() {
  setPrefix("v-cat");
  let b = room(900, 300, FLOOR, { seed: 21 }) + heightChart(900, FLOOR - 14, 20);
  b += `<rect x="18" y="30" width="864" height="12" fill="${C.dark}"/>`;
  const cats = [[RANDOM.tort, 150, 0.36], [RANDOM.bw, 330, 0.38], [RANDOM.cream, 510, 0.34], [{ ...LOOKS.mags }, 690, 0.36]];
  cats.forEach(([L, x, s], i) => {
    b += `<rect x="${x - 26}" y="${FLOOR - 4}" width="52" height="22" rx="4" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>` +
      `<text x="${x}" y="${FLOOR + 13}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="${C.ink}">${i + 1}</text>`;
    b += catSit({ look: L, x, y: FLOOR - 4, s, id: `yc${i}`, headTilt: [6, 0, -8, 4][i] });
  });
  return svg("0 0 900 300", "Four cats in a line-up against a height chart, each standing on a numbered card", b);
}

/** Chapter 3: the gang walking along the top of a garden fence at night, in single file. */
export function ch_gang() {
  setPrefix("v-gang");
  const G = 290;
  let b = nightSky(900, 300, 31) + moon(120, 60, 22);
  b += fence(0, G, 900, 120);
  const rail = G - 130;
  b += catSide({ look: "tilly", x: 760, y: rail, s: 0.3, step: 0.4, tailUp: 0.6, id: "g1" });
  b += catSide({ look: "biscuit", x: 610, y: rail, s: 0.32, step: -0.3, tailUp: 0.9, id: "g2" });
  b += catSide({ look: "velvet", x: 460, y: rail, s: 0.3, step: 0.3, tailUp: 0.7, id: "g3" });
  b += catSide({ look: "mags", x: 315, y: rail, s: 0.3, step: -0.2, tailUp: 0.5, id: "g4" });
  b += catSide({ look: "pip", x: 185, y: rail, s: 0.26, step: 0.5, tailUp: 1, id: "g5" });
  return svg("0 0 900 300", "The gang walks in single file along the top of a garden fence under the moon", b);
}

/** Chapter 4: dice on the floor and a cat looking at the highest one. */
export function ch_rolling() {
  setPrefix("v-roll");
  let b = room(900, 300, FLOOR, { seed: 4, wall: C.paper2 }) + rug(450, FLOOR, 360, C.leafDeep);
  b += die(250, FLOOR + 14, 70, 3) + die(350, FLOOR + 20, 70, 6) + die(450, FLOOR + 12, 70, 4);
  b += catSit({ look: "tilly", x: 640, y: FLOOR + 18, s: 0.42, id: "r1", headTilt: -12 });
  b += catSide({ look: "pip", x: 150, y: FLOOR + 16, s: 0.3, crouch: 0.8, head: -0.4, tailLow: false, tailUp: 0.9, step: 0.1, id: "r2" });
  return svg("0 0 900 300", "Three dice on a rug showing 3, 6 and 4; Tilly studies the six while Pip crouches to pounce on them", b);
}

/** Chapter 5: the Mood — a broom on one side, a pink cushion on the other, a cat between looking innocent. */
export function ch_mood() {
  setPrefix("v-mood");
  let b = room(900, 300, FLOOR, { seed: 5 });
  b += broom(180, FLOOR, 200);
  b += cushion(720, FLOOR, 110);
  b += catSit({ look: "velvet", x: 450, y: FLOOR, s: 0.44, id: "m1" });
  b += `<text x="180" y="40" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="30" fill="${C.alarm}">BROOM</text>`;
  b += `<text x="720" y="40" text-anchor="middle" font-family="Fraunces, serif" font-weight="800" font-size="30" fill="${C.cuddle}">CUDDLE</text>`;
  return svg("0 0 900 300", "Velvet sits looking innocent between a broom (the Broom meter) and a pink cushion (the Cuddle meter)", b);
}

/** Chapter 6: a round — a hallway with a clock; Mags slips past a doorway as a pair of legs walks in. */
export function ch_round() {
  setPrefix("v-round");
  let b = room(900, 300, FLOOR, { seed: 6 });
  b += door(600, FLOOR, 130, 238, { ajar: 0.6 });
  b += legs({ x: 660, floorY: FLOOR + 6, top: -4, trousers: C.leafDeep, shoe: C.woodDeep, w: 34, walking: 0.3 });
  b += wallClock(330, 70, 34);
  b += shelf(120, 120, 150, 3);
  b += catSide({ look: "mags", x: 360, y: FLOOR, s: 0.32, crouch: 0.9, head: -0.5, tailLow: true, step: 0.4, id: "rd1" });
  b += plant(840, FLOOR, 0.9);
  return svg("0 0 900 300", "A hallway: as someone walks in through a door, Mags creeps low along the skirting board under a wall clock", b);
}

/** Chapter 7: instincts — a glass at the table's edge, a box with a cat in it, a cat on a high shelf. */
export function ch_instincts() {
  setPrefix("v-inst");
  let b = room(900, 300, FLOOR, { seed: 7 });
  const t = table(80, FLOOR, 240, 120);
  b += t.svg + glass(300, t.top, 46);
  b += catSide({ look: "velvet", x: 220, y: t.top, s: 0.26, step: 0.1, tailUp: 0.9, head: -0.3, id: "i1" });
  b += box(420, FLOOR, 150, 90);
  b += `<g>${catSit({ look: "mags", x: 495, y: FLOOR - 40, s: 0.3, id: "i2" })}</g>`;
  b += `<rect x="420" y="${FLOOR - 52}" width="150" height="52" fill="${C.creamDeep}" stroke="${C.ink}" stroke-width="3"/>`; // the box's front wall covers her lower half
  b += shelf(640, 96, 200, 0);
  b += catCurl({ look: "tilly", x: 730, y: 96, s: 0.32, id: "i3" });
  b += toyMouse(600, FLOOR + 14, 1.1);
  return svg("0 0 900 300", "Instincts: Velvet eyes a glass on the edge of a table, Mags sits in a cardboard box, Tilly naps on a high shelf", b);
}

/** Chapter 8: the three kinds of prize — the chicken on the counter, the box, the mouse — and cats after each. */
export function ch_prize() {
  setPrefix("v-prize");
  let b = room(900, 300, FLOOR, { seed: 8 });
  const c = counter(40, FLOOR, 250, 150);
  b += c.svg + chicken(190, c.top, 0.62);
  b += catSit({ look: "biscuit", x: 330, y: FLOOR, s: 0.36, id: "p1", headTilt: 10 });
  b += box(430, FLOOR, 170, 120);
  b += catSide({ look: "tilly", x: 640, y: FLOOR, s: 0.3, flip: true, step: 0.2, head: -0.2, tailUp: 0.8, id: "p2" });
  b += toyMouse(862, FLOOR, 1.3);
  b += catSide({ look: "pip", x: 790, y: FLOOR, s: 0.24, crouch: 1, head: -0.5, tailUp: 1, step: 0.1, id: "p3" });
  return svg("0 0 900 300", "Three kinds of prize: Biscuit gazes up at a chicken on the counter, Tilly sizes up a big cardboard box, Pip stalks a toy mouse", b);
}

/** Chapter 9: Shoo! — someone sweeps with a broom (only legs and the broom show) as Biscuit bolts for the open back door. */
export function ch_caught() {
  setPrefix("v-caught");
  let b = room(900, 300, FLOOR, { seed: 9 });
  // the back door wide open onto the night garden
  b += `<rect x="690" y="${FLOOR - 230}" width="130" height="230" fill="${C.deep}" stroke="${C.ink}" stroke-width="3"/>`;
  b += moon(760, 70, 14);
  b += path(`M690 ${FLOOR - 230}L650 ${FLOOR - 220}V${FLOOR + 6}L690 ${FLOOR}Z`, C.wood, C.ink, 3); // the door swung open on its hinges
  b += `<rect x="682" y="${FLOOR - 238}" width="146" height="10" fill="${C.light}" stroke="${C.ink}" stroke-width="2.6"/>`;
  b += legs({ x: 230, floorY: FLOOR + 6, top: -4, trousers: C.dark, shoe: C.ink, w: 36, walking: 0.4 });
  // the broom, held by the sweeper above the frame: its handle runs out of the top edge, bristles sweeping the floor
  b += path(`M300 -10L389 ${FLOOR - 67}`, "none", C.woodDeep, 9);
  b += `<g transform="translate(0 -12) rotate(-22 400 ${FLOOR - 28})">${path(`M382 ${FLOOR - 56}H418L436 ${FLOOR}H364Z`, C.accent, C.ink, 3)}<rect x="380" y="${FLOOR - 62}" width="40" height="10" rx="3" fill="${C.alarm}" stroke="${C.ink}" stroke-width="2.4"/></g>`;
  b += strokes([[450, FLOOR - 40, 490, FLOOR - 40], [446, FLOOR - 20, 500, FLOOR - 20]], C.ink, 3);
  b += catSide({ look: "biscuit", x: 580, y: FLOOR, s: 0.32, step: 1, tailUp: 0.2, head: 0.2, id: "c1" });
  return svg("0 0 900 300", "Shoo! A broom sweeps across the kitchen floor and Big Biscuit bolts for the open back door", b);
}

/** Chapter 10: who lives there — a living room with Pudding the dog, a parrot in its cage, the robot vacuum and Pom-Pom on the sofa. */
export function ch_residents() {
  setPrefix("v-res");
  let b = room(900, 300, FLOOR, { seed: 10 });
  b += win(70, 40, 120, 90, { night: true });
  const sf = sofa(250, FLOOR, 280);
  b += sf.svg + catSit({ look: "pompom", x: 360, y: sf.seat, s: 0.3, id: "r1" });
  b += dogSide({ dog: "pudding", x: 660, y: FLOOR, s: 0.42, flip: true });
  b += vacuum(110, FLOOR, 0.9);
  b += parrotStand({ x: 790, floorY: FLOOR, s: 0.8 });
  return svg("0 0 900 300", "Who lives there: a fluffy grey house cat on the sofa, a spaniel, a robot vacuum and a parrot in a cage on a stand", b);
}

/** Chapter 13: the Block — the gang on a roof ridge by a chimney, looking out over the street's roofs under the moon. */
export function ch_the_block() {
  setPrefix("v-block");
  let b = nightSky(900, 300, 13) + moon(780, 60, 26);
  // far roofs with lit windows
  for (const [x, w, h] of [[0, 220, 120], [200, 180, 150], [370, 240, 110], [600, 160, 140], [740, 180, 120]]) {
    b += `<path d="M${x} 300V${300 - h}L${x + w / 2} ${300 - h - 50}L${x + w} ${300 - h}V300Z" fill="${C.dark}" stroke="${C.ink}" stroke-width="2.6"/>`;
    b += `<rect x="${x + w / 2 - 12}" y="${300 - h - 34}" width="24" height="22" fill="${C.accentB}" stroke="${C.ink}" stroke-width="2"/>`; // attic window, above our ridge
  }
  // our roof in front: slates, a ridge, a chimney standing on it
  b += `<path d="M-10 300L80 200H820L910 300Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="3"/>`;
  let d = ""; for (let y = 220; y < 300; y += 20) d += `M${80 - (y - 200) * 0.9} ${y}H${820 + (y - 200) * 0.9}`;
  b += path(d, "none", C.dark, 1.6);
  b += `<rect x="600" y="140" width="60" height="62" fill="${C.brick}" stroke="${C.ink}" stroke-width="3"/><rect x="592" y="132" width="76" height="12" fill="${C.edge}" stroke="${C.ink}" stroke-width="2.6"/>`;
  const ridge = 200;
  b += catSit({ look: "velvet", x: 180, y: ridge, s: 0.26, id: "b1" });
  b += catSit({ look: "tilly", x: 250, y: ridge, s: 0.26, id: "b2" });
  b += catSit({ look: "biscuit", x: 330, y: ridge, s: 0.27, id: "b3" });
  b += catCurl({ look: "pip", x: 420, y: ridge, s: 0.22, id: "b4" });
  b += catSide({ look: "mags", x: 520, y: ridge, s: 0.24, step: 0.2, tailUp: 0.7, id: "b5" });
  return svg("0 0 900 300", "The Block: the gang sits along a roof ridge by a chimney, looking out over the street's roofs and lit windows under the moon", b);
}

import { armchair } from "../kit.mjs";

/** Chapter 11: the Storyteller's view — one wall cut through, two rooms at once: next door, someone checks the clock; in the kitchen, the gang goes for the chicken. */
export function ch_storyteller() {
  setPrefix("v-story");
  let b = room(900, 300, FLOOR, { seed: 11 });
  // left: the front room
  b += lamp(46, FLOOR, 236);
  const ac = armchair(86, FLOOR, 150, { col: C.dark });
  b += ac.svg;
  b += wallClock(232, 46, 24);
  b += legs({ x: 332, floorY: FLOOR + 6, top: -4, trousers: C.brownDeep, shoe: C.woodDeep, w: 32, walking: 0 });
  // the wall between, cut through (a section, hatched like a plan)
  const W0 = 420, W1 = 466;
  b += `<rect x="${W0}" y="-4" width="${W1 - W0}" height="308" fill="${C.brick}" stroke="${C.ink}" stroke-width="3"/>`;
  let d = ""; for (let y = -40; y < 320; y += 16) d += `M${W0} ${y + 46}L${W1} ${y}`;
  b += `<clipPath id="v-story-cut"><rect x="${W0}" y="-4" width="${W1 - W0}" height="308"/></clipPath><path clip-path="url(#v-story-cut)" d="${d}" stroke="${C.brickDeep}" stroke-width="3"/>`;
  // right: the kitchen
  const c = counter(560, FLOOR, 250, 150);
  b += c.svg + chicken(752, c.top, 0.62);
  b += catSide({ look: "tilly", x: 628, y: c.top, s: 0.3, crouch: 0.5, head: -0.2, tailUp: 0.5, step: 0.3, id: "st" });
  b += catSit({ look: "biscuit", x: 512, y: FLOOR, s: 0.32, id: "sb", headTilt: 12 });
  b += bin(832, FLOOR);
  return svg("0 0 900 300", "The Storyteller's view, through a wall cut away: in the front room someone stands checking the clock; in the kitchen next door Tilly creeps along the counter to the chicken while Big Biscuit keeps watch", b);
}

/** Chapter 12: making a house — seen from above: a pencil floor plan on the table, a pencil, three dice, a mug, and a ginger paw batting a die. */
export function ch_making_a_house() {
  setPrefix("v-make");
  const ink = C.inkSoft;
  let b = `<rect x="0" y="0" width="900" height="300" fill="${C.wood}"/>`;
  let d = ""; for (let y = 58; y < 300; y += 60) d += `M0 ${y}H900`;
  b += path(d, "none", C.woodDeep, 2.4);
  b += path(`M60 20q40 10 90 0 M620 140q50 12 110 0 M300 262q60 10 120 -2 M780 222q30 8 70 0`, "none", C.woodDeep, 1.6, ` opacity="0.6"`); // grain
  // the sheet of paper, lying flat, with its shadow
  b += `<g transform="rotate(-3 360 150)">`;
  b += `<rect x="156" y="28" width="420" height="256" fill="${C.ink}" opacity="0.18"/><rect x="150" y="22" width="420" height="256" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/>`;
  // the plan, in pencil: outer walls with gaps for the ways in, inner walls with door gaps
  const plan = [
    "M190 50H300 M332 50H520V96 M520 116V214H286 M254 214H190V50", // outer walls: window gap (top), cat-flap gap (right), front-door gap (bottom)
    "M340 50V110 M340 140V214",                                  // front room | hall and kitchen
    "M340 132H408 M436 132H520",                                 // hall | kitchen
    "M440 132V160 M440 186V214",                                 // hall | loo
  ].join(" ");
  b += path(plan, "none", ink, 4);
  b += path(`M300 46V54 M332 46V54 M300 50H332`, "none", ink, 1.6); // the window, drawn as a thin line
  b += path(`M270 240V222 M262 230L270 220L278 230`, "none", ink, 2.4) + path(`M546 106H528 M536 98L526 106L536 114`, "none", ink, 2.4); // arrows: ways in
  b += path(`M520 106Q470 108 470 90Q470 76 486 76`, "none", ink, 2, ` stroke-dasharray="5 6"`); // the gang's route
  b += path(`M478 62L498 82M498 62L478 82`, "none", C.ink, 4); // the X
  const label = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-style="italic" font-weight="700" font-size="14" fill="${ink}">${t}</text>`;
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
  return svg("0 0 900 300", "Making a house, seen from above: a pencil floor plan on a sheet of paper with a pencil lying on it, three dice and a mug of tea on the table, and a ginger paw batting one of the dice", b);
}
