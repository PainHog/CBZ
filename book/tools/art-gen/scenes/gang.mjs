// Reference sheets for the premade gang (ART-CHECKLIST §10): one sheet per cat,
// side view + front sitting view, with its name. Every later piece is checked
// against these.  node book/tools/art-gen/scenes/build.mjs ref-tilly …
import { C, svg } from "./lib.mjs";
import { catSide, catSit, LOOKS } from "../cats.mjs";

// What each sheet spells out under the drawings: every mark and every piece of gear, with its side.
const NOTES = {
  tilly: ["Grey tabby, green eyes, a tough squint that doesn’t quite work. Red collar with a round brass tag.", "Brass stud in her RIGHT ear. Fishbone tattoo on her RIGHT foreleg."],
  biscuit: ["Brown tabby, cream muzzle and belly, amber eyes, chonky. Notch cut in his LEFT ear. Black do-rag knotted at", "the back. A far-too-heavy gold chain. Gang-sign tattoo on his RIGHT shoulder; MUM in a heart on his LEFT shoulder."],
  velvet: ["Black, amber eyes, a white star on her chest and a white LEFT forepaw. Moonlit-blue rim line.", "No gear and no tattoos: she has to pass as somebody’s pet."],
  mags: ["Ginger tabby, cream belly, green eyes, a kink at the tip of her tail.", "A roomy navy kerchief with white dots. Gold hoop in her LEFT ear. A winged sardine tattoo on her RIGHT hip."],
  pip: ["White calico kitten (drawn 0.82×), blue eyes. Ginger LEFT face and flank; black RIGHT ear and flank;", "a black shoulder spot and tail tip. A too-big pale blue kerchief (its point hangs to her paws)", "and a shiny bottle cap on a string, worn as a medal."],
};
const HIS = { biscuit: "his" };

function sheet(key) {
  const L = LOOKS[key], their = HIS[key] ?? "her";
  const txt = (x, y, t, size = 15, anchor = "middle", col = C.ink, weight = 400) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Alegreya Sans, sans-serif" font-size="${size}" font-weight="${weight}" fill="${col}">${t}</text>`;
  let b = `<rect width="1000" height="530" fill="${C.paper}"/>`;
  b += `<path d="M30 380 H970" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  b += catSide({ look: key, x: 210, y: 380, s: 0.8, step: 0.5, id: `${key}s` });
  b += catSide({ look: key, x: 600, y: 380, s: 0.8, step: 0.5, flip: true, id: `${key}l` });
  b += catSit({ look: key, x: 875, y: 380, s: 0.82, id: `${key}f` });
  b += txt(200, 410, `facing right: ${their} RIGHT side`, 15, "middle", C.inkSoft) + txt(610, 410, `facing left: ${their} LEFT side`, 15, "middle", C.inkSoft) + txt(875, 410, `front: ${their} left on our right`, 15, "middle", C.inkSoft);
  b += `<text x="30" y="44" font-family="Fraunces, serif" font-weight="700" font-size="30" fill="${C.ink}">${L.name}</text>`;
  NOTES[key].forEach((t, i) => { b += txt(30, 452 + i * 24, t, 17, "start"); });
  return svg("0 0 1000 530", `Reference sheet: ${L.name}`, b);
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
  b += catSit({ look: key, x: 200, y: 350, s: 1.1, id: `p${key}` });
  b += `</g>` + f.ring;
  return svg("0 0 400 400", `${LOOKS[key].name}, sitting`, b);
}
export const portrait_tilly = () => portrait("tilly");
export const portrait_biscuit = () => portrait("biscuit");
export const portrait_velvet = () => portrait("velvet");
export const portrait_mags = () => portrait("mags");
export const portrait_pip = () => portrait("pip");

// Reference sheets for the recurring residents and the getaway's chasers (ART-CHECKLIST §10).
import { dogSide, dogLie, warden, van, parrotStand } from "../residents.mjs";
export function ref_warden() {
  setPrefix("ref-warden");
  const txt = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-size="15" fill="${C.inkSoft}">${t}</text>`;
  let b = `<rect width="1000" height="460" fill="${C.paper}"/><path d="M30 380 H970" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  b += warden({ x: 150, groundY: 380, s: 1, swing: 30 });
  b += van(720, 380, 1.15);
  b += `<text x="30" y="44" font-family="Fraunces, serif" font-weight="700" font-size="30" fill="${C.ink}">The animal control warden and the van</text>`;
  b += txt(270, 410, "the warden: cap with a paw badge, moustache, green jacket, navy trousers") + txt(720, 410, "the van: white, amber roof light, a paw-print ring logo");
  b += txt(270, 432, "two hands, each closed round the net’s pole (four fingers and a thumb)") + txt(720, 432, "both wheels on the road; the gang may tag its side");
  return svg("0 0 1000 460", "Reference sheet: the animal control warden with his catch net, and the animal control van", b);
}
export function ref_residents() {
  setPrefix("ref-res");
  const txt = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-size="15" fill="${C.inkSoft}">${t}</text>`;
  let b = `<rect width="1000" height="460" fill="${C.paper}"/><path d="M30 380 H970" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  b += dogSide({ dog: "pudding", x: 110, y: 380, s: 0.6 }) + dogSide({ dog: "noodle", x: 360, y: 380, s: 0.6 }) + dogSide({ dog: "brutus", x: 615, y: 380, s: 0.62, bark: true });
  b += catSit({ look: "pompom", x: 830, y: 380, s: 0.5, id: "rpp" }) + catSit({ look: "housecat", x: 958, y: 380, s: 0.42, id: "rhc" });
  b += `<text x="30" y="44" font-family="Fraunces, serif" font-weight="700" font-size="30" fill="${C.ink}">Residents</text>`;
  b += txt(110, 410, "Pudding: old spaniel") + txt(360, 410, "Noodle: sausage dog") + txt(615, 410, "Brutus: enormous mastiff") + txt(830, 410, "Pom-Pom: large, fluffy") + txt(958, 410, "a house cat");
  return svg("0 0 1000 460", "Reference sheet: the residents — Pudding, Noodle, Brutus, Pom-Pom and a house cat", b);
}
