// Reference sheets for the premade gang (ART-CHECKLIST §10): one sheet per cat,
// side view + front sitting view, with its name. Every later piece is checked
// against these.  node book/tools/art-gen/scenes/build.mjs ref-tilly …
import { C, svg } from "./lib.mjs";
import { catSide, catSit, LOOKS } from "../cats.mjs";

function sheet(key) {
  const L = LOOKS[key];
  let b = `<rect width="900" height="420" fill="${C.paper}"/>`;
  b += `<path d="M40 372 H860" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  b += catSide({ look: key, x: 330, y: 372, s: 1.1, step: 0.5, id: `${key}s` });
  b += catSit({ look: key, x: 720, y: 372, s: 1.0, id: `${key}f` });
  b += `<text x="40" y="44" font-family="Fraunces, serif" font-weight="700" font-size="30" fill="${C.ink}">${L.name}</text>`;
  return svg("0 0 900 420", `Reference sheet: ${L.name}`, b);
}
export const ref_tilly = () => sheet("tilly");
export const ref_biscuit = () => sheet("biscuit");
export const ref_velvet = () => sheet("velvet");
export const ref_mags = () => sheet("mags");
export const ref_pip = () => sheet("pip");
