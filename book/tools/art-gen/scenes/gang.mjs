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

// Square portraits for the ready-made gang entries (Chapter 3): the cat sitting in a lamplit cameo.
import { cameo, setPrefix } from "../lib.mjs";
function portrait(key) {
  setPrefix(`pt-${key}`);
  const f = cameo(200, 200, 178);
  const kit = key === "pip" ? 0.85 : 1;
  let b = f.bg + `<g clip-path="${f.clip}">`;
  // a brick alley wall behind, a warm lamp glow, the pavement
  b += `<rect x="0" y="0" width="400" height="330" fill="${C.wallDeep}"/>`;
  let bricks = "";
  for (let r = 0; r < 12; r++) for (let c = -1; c < 8; c++) {
    const bx = c * 60 + (r % 2) * 30, by = r * 28;
    bricks += `<rect x="${bx + 2}" y="${by + 2}" width="56" height="24" rx="3" fill="${(r * 7 + c * 3) % 5 === 0 ? C.brickDeep : C.brick}" opacity="0.55"/>`;
  }
  b += bricks;
  b += `<circle cx="200" cy="150" r="170" fill="${C.accentB}" opacity="0.35"/>`;
  b += `<rect x="0" y="330" width="400" height="80" fill="${C.edge}"/><path d="M0 330 H400" stroke="${C.ink}" stroke-width="2.6"/>`;
  b += `<path d="M30 352 H120 M170 366 H260 M300 350 H380" stroke="${C.ink}" stroke-width="1.4" opacity="0.3"/>`;
  b += catSit({ look: key, x: 200, y: 350, s: 1.1 * kit, id: `p${key}` });
  b += `</g>` + f.ring;
  return svg("0 0 400 400", `${LOOKS[key].name}, sitting`, b);
}
export const portrait_tilly = () => portrait("tilly");
export const portrait_biscuit = () => portrait("biscuit");
export const portrait_velvet = () => portrait("velvet");
export const portrait_mags = () => portrait("mags");
export const portrait_pip = () => portrait("pip");
