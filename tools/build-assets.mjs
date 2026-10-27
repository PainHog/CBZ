/**
 * NINE LIVES GANG — render the Foundry system's pictures to assets/ (WebP)
 * ------------------------------------------------------------------------
 *   node tools/build-assets.mjs           (npm run build:assets)   every picture
 *   node tools/build-assets.mjs scenes    only the scenes (or: gang, residents, getaway, ui)
 *
 * Everything comes from the book's art and the house data (tools/asset-art.mjs says what and how):
 *   assets/scenes/<house>.webp, <house>-thumb.webp   the tabletop plan (maps.mjs canvasMap), 2 px per map unit:
 *                                                    one grid square is 144 px
 *   assets/gang/<cat>.webp, <cat>-token.webp         the book's portrait (512 px) and a round token (256 px)
 *   assets/residents/<who>.webp, <who>-token.webp    each resident the book draws, in a cameo
 *   assets/getaway/warden.webp                       the warden's tile for the getaway row
 *   assets/ui/tag-small.webp                         the gang's small tag
 * Rendered with Playwright's Chromium (the same as the book's art previews, book/tools/preview-art.mjs:
 * set CHROME_PATH, or it uses /opt/pw-browsers/chromium when present) with the book's fonts inlined,
 * then encoded to WebP by the same browser, so a rebuild with the same browser writes the same files.
 * Look at every picture after rebuilding (book/tools/preview-art.mjs shows the book's originals).
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { canvasMaps } from "../book/tools/art-gen/scenes/maps.mjs";
import { ROOT, GANG_ART, RESIDENT_ART, SCENE_SCALE, bookArt, residentCameo, residentKeys, wardenTile } from "./asset-art.mjs";

const OUT = join(ROOT, "assets");
const PAPER = "#f7f0e1", DARK = "#2f3a63";

// The book's typefaces, inlined so the map labels render as they print (as book/tools/preview-art.mjs does).
const FONT_DIR = join(ROOT, "node_modules", "@fontsource");
const face = (family, pkg, weight, style = "normal") => {
  const f = join(FONT_DIR, pkg, "files", `${pkg}-latin-${weight}-${style}.woff2`);
  return existsSync(f) ? `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${readFileSync(f).toString("base64")}) format("woff2");font-weight:${weight};font-style:${style};}` : "";
};
const FONTS = `<style>${[400, 700, 900].map(w => face("Fraunces", "fraunces", w)).join("")}${[400, 500, 700, 800].map(w => face("Alegreya Sans", "alegreya-sans", w) + face("Alegreya Sans", "alegreya-sans", w, "italic")).join("")}</style>`;

/** Every picture: { group, out (under assets/), svg, w, h, bg (a colour, or null: transparent), q (WebP quality), color (for currentColor) } */
function jobs() {
  const list = [];
  for (const [key, { svg, geometry: g }] of Object.entries(canvasMaps())) {
    const w = g.width * SCENE_SCALE, h = g.height * SCENE_SCALE;
    list.push({ group: "scenes", out: `scenes/${key}.webp`, svg, w, h, bg: PAPER, q: 0.9 });
    // the thumbnail: the floors (without the getaway row), in a 3:2 frame round them, 300 × 200
    // (anything under the floors — the key and the getaway row — is painted over)
    const pad = g.U, x0 = Math.min(...g.floors.map(f => f.x)) - pad, y0 = Math.min(...g.floors.map(f => f.y)) - pad;
    const y1 = Math.max(...g.floors.map(f => f.y + f.h)) + pad;
    let tw = Math.max(...g.floors.map(f => f.x + f.w)) + pad - x0, th = y1 - y0;
    const fx = tw / th > 1.5 ? 0 : (th * 1.5 - tw) / 2, fy = tw / th > 1.5 ? (tw / 1.5 - th) / 2 : 0;
    tw += 2 * fx; th += 2 * fy;
    const thumb = svg.replace(/viewBox="[^"]*"/, `viewBox="${x0 - fx} ${y0 - fy} ${tw} ${th}"`).replace(/<\/svg>\s*$/, `<rect x="${x0 - fx}" y="${y1}" width="${tw}" height="${th}" fill="${PAPER}"/></svg>\n`);
    list.push({ group: "scenes", out: `scenes/${key}-thumb.webp`, svg: thumb, w: 300, h: 200, bg: PAPER, q: 0.85 });
  }
  for (const [key, art] of Object.entries(GANG_ART)) {
    const svg = bookArt(art);
    list.push({ group: "gang", out: `gang/${key}.webp`, svg, w: 512, h: 512, bg: PAPER, q: 0.9 });
    list.push({ group: "gang", out: `gang/${key}-token.webp`, svg, w: 256, h: 256, bg: null, q: 0.9 });
  }
  for (const key of residentKeys()) {
    const svg = residentCameo(key);
    list.push({ group: "residents", out: `residents/${RESIDENT_ART[key]}.webp`, svg, w: 512, h: 512, bg: PAPER, q: 0.9 });
    list.push({ group: "residents", out: `residents/${RESIDENT_ART[key]}-token.webp`, svg, w: 256, h: 256, bg: null, q: 0.9 });
  }
  list.push({ group: "getaway", out: "getaway/warden.webp", svg: wardenTile(), w: 288, h: 288, bg: null, q: 0.9 });
  list.push({ group: "ui", out: "ui/tag-small.webp", svg: bookArt("tag-small"), w: 280, h: 184, bg: null, q: 0.9, color: DARK });
  return list;
}

async function render(page, job) {
  const { svg, w, h, bg, q, color } = job;
  await page.setViewportSize({ width: Math.max(w, 64), height: Math.max(h, 64) });
  const sized = svg.replace("<svg ", `<svg width="${w}" height="${h}" `);
  await page.setContent(`${FONTS}<body style="margin:0;background:${bg ?? "transparent"}"><div id="a" style="width:${w}px;height:${h}px;line-height:0;color:${color ?? "inherit"}">${sized}</div></body>`);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("#a").screenshot({ type: "png", omitBackground: !bg });
  const b64 = await page.evaluate(async ({ src, q }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${src}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    return c.toDataURL("image/webp", q).split(",")[1];
  }, { src: png.toString("base64"), q });
  return Buffer.from(b64, "base64");
}

async function main() {
  const want = process.argv.slice(2).filter(a => !a.startsWith("-"));
  const list = jobs().filter(j => !want.length || want.includes(j.group));
  const CHROME = process.env.CHROME_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  try {
    for (const job of list) {
      const buf = await render(page, job);
      const file = join(OUT, job.out);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, buf);
      console.log(`  ✓ assets/${job.out.padEnd(34)} ${String(job.w).padStart(4)}×${String(job.h).padEnd(4)} ${(buf.length / 1024).toFixed(0).padStart(5)} KB`);
    }
  } finally {
    await browser.close();
  }
  const total = list.reduce((n, j) => n + statSync(join(OUT, j.out)).size, 0);
  console.log(`Done: ${list.length} pictures, ${(total / 1024 / 1024).toFixed(2)} MB.`);
}

main().catch(err => { console.error(err); process.exit(1); });
