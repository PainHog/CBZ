/**
 * NINE LIVES GANG — the Foundry system's pictures, made from the book's art (nothing drawn anew)
 * ---------------------------------------------------------------------------------------------
 * What goes in assets/ (tools/build-assets.mjs renders it; tools/pack-content.mjs points the packs at it):
 *  - the ready-to-play scenes: each house's tabletop plan (book/tools/art-gen/scenes/maps.mjs
 *    canvasMap: the book map's rooms, doors, stairs, markers and stars on whole grid squares, with
 *    room to wait outside each entrance and the getaway row under the house);
 *  - the ready-made gang: the book's own portraits (book/art/portrait-*.svg), as the actor's picture
 *    and, with the paper corners left off, a round token;
 *  - every resident the book draws (residents.mjs, cats.mjs): the same drawing function, sitting or
 *    standing on a floor in a lamplit cameo like the gang's portraits. The book draws no faces for
 *    the humans (a cat sees their legs), so they keep Foundry's own figure icon;
 *  - the animal control warden (residents.mjs warden(), as on the warden's reference sheet), as the
 *    getaway tile;
 *  - the gang's small tag (book/art/tag-small.svg) for the system's windows.
 * Nothing here touches Foundry; it imports the book's drawing code only to compose SVG strings.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { C, cameo, setPrefix } from "../book/tools/art-gen/lib.mjs";
import { svg } from "../book/tools/art-gen/scenes/lib.mjs";
import { catSit } from "../book/tools/art-gen/cats.mjs";
import { dogSide, parrotStand, vacuum, warden } from "../book/tools/art-gen/residents.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ART = join(ROOT, "book", "art");

/** Where the system serves its pictures from (system.json id "cat-burglars"). */
export const ASSET_URL = "systems/cat-burglars/assets";
/** The ready-to-play scenes: pixels per map unit (one square, 72 units, is 144 px; a token, half a square, is 72 px). */
export const SCENE_SCALE = 2;

/** The ready-made gang (tools/pack-content.mjs GANG keys) → the book's portrait. */
export const GANG_ART = Object.freeze({
  "two-bin-tilly": "portrait-tilly", "big-biscuit": "portrait-biscuit", velvet: "portrait-velvet",
  "marmalade-mags": "portrait-mags", pip: "portrait-pip"
});

/**
 * Residents the book draws, by their key in the house catalog → the picture's name and how it is drawn
 * (the same figure and proportions the book uses: ref-residents, spot-parrot, spot-vacuum, spot-pompom).
 * Both robot vacuums are the book's one vacuum.
 */
const RESIDENTS = {
  pudding: { file: "pudding", title: "Pudding, Mr Pell’s old spaniel", draw: () => dogSide({ dog: "pudding", x: 186, y: 322, s: 0.86 }) },
  noodle: { file: "noodle", title: "Noodle, the Okafors’ sausage dog", draw: () => dogSide({ dog: "noodle", x: 192, y: 326, s: 0.6 }) },
  brutus: { file: "brutus", title: "Brutus, Chef Marchetti’s enormous mastiff", draw: () => dogSide({ dog: "brutus", x: 172, y: 326, s: 0.62 }) },
  pompom: { file: "pom-pom", title: "Pom-Pom, Grandpa Wendell’s large fluffy house cat", draw: () => catSit({ look: "pompom", x: 196, y: 330, s: 0.84, id: "fvpp" }) },
  captain: { file: "captain", title: "Captain the parrot in his cage on its stand", draw: () => parrotStand({ x: 140, floorY: 330, s: 1.0 }) },
  roomba: { file: "robot-vacuum", title: "The robot vacuum", draw: () => vacuum(200, 336, 2.4) }
};
export const RESIDENT_ART = Object.freeze(Object.fromEntries(Object.entries(RESIDENTS).map(([k, v]) => [k, v.file])));

/** The asset paths the packs and scenes use (served by Foundry under systems/cat-burglars/). */
export const assetPaths = {
  gang: key => GANG_ART[key] ? `${ASSET_URL}/gang/${key}.webp` : null,
  gangToken: key => GANG_ART[key] ? `${ASSET_URL}/gang/${key}-token.webp` : null,
  resident: key => RESIDENT_ART[key] ? `${ASSET_URL}/residents/${RESIDENT_ART[key]}.webp` : null,
  residentToken: key => RESIDENT_ART[key] ? `${ASSET_URL}/residents/${RESIDENT_ART[key]}-token.webp` : null,
  scene: houseKey => `${ASSET_URL}/scenes/${houseKey}.webp`,
  sceneThumb: houseKey => `${ASSET_URL}/scenes/${houseKey}-thumb.webp`,
  warden: () => `${ASSET_URL}/getaway/warden.webp`,
  tag: () => `${ASSET_URL}/ui/tag-small.webp`
};

/** A book SVG as it is (book/art/<name>.svg). */
export const bookArt = name => readFileSync(join(ART, `${name}.svg`), "utf8");

/**
 * A resident in a lamplit cameo (400×400): a wall, the lamp's glow and the floorboards (the floor begins
 * at y 300), the resident standing or sitting on the floor in front of the wall, with its own contact shadow.
 */
export function residentCameo(key) {
  const r = RESIDENTS[key];
  if (!r) throw new Error(`no drawing for the resident "${key}"`);
  setPrefix(`fv-${r.file}`);
  const f = cameo(200, 200, 178);
  let b = f.bg + `<g clip-path="${f.clip}">`;
  b += `<rect x="0" y="0" width="400" height="300" fill="${C.wall}"/>`;
  b += `<circle cx="200" cy="170" r="170" fill="${C.accentB}" opacity="0.35"/>`;
  b += `<rect x="0" y="300" width="400" height="100" fill="${C.floor}"/><path d="M0 300 H400" stroke="${C.ink}" stroke-width="2.6"/>`;
  b += `<path d="M20 332 H150 M200 350 H330 M60 372 H220" stroke="${C.floorDeep}" stroke-width="2"/>`;
  b += r.draw();
  b += `</g>` + f.ring;
  return svg("0 0 400 400", r.title, b);
}
export const residentKeys = () => Object.keys(RESIDENTS);

/**
 * The warden for the getaway row's tile: the book's figure (as on his reference sheet), running toward the
 * hideout, his boot and shadow at the foot of the square, so he stands on the top edge of the space below him.
 */
export function wardenTile() {
  setPrefix("fv-warden");
  return svg("-110 -420 440 440", "The animal control warden with his catch net", warden({ x: 0, groundY: 0, s: 1, swing: 30 }));
}
