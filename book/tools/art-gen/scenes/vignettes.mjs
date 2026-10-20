// Chapter vignettes (900×300). Scale across the book (ART-CHECKLIST §12):
// in interiors the floor is at y = 262, a kitchen counter is 150 tall and a
// cat is drawn at s = 0.3 (a kitten 0.26); a human shows only from the knees
// or hips down, cropped by the top edge.
import { C, svg } from "./lib.mjs";
import { setPrefix } from "../lib.mjs";
import { catSide, catSit } from "../cats.mjs";
import { room, windowWall, door, counter, table, fridge, bin, chicken, legs, shelf, wallClock } from "../kit.mjs";

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
  let b = nightSky(900, 300, 9) + moon(820, 46, 20);
  // the house front on the right, the open door lit from inside
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
