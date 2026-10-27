/**
 * Compendium packs: the committed sources are exactly what tools/pack-content.mjs
 * generates (so the packs follow the house catalog and the book), the
 * ready-made gang matches Chapter 3's statlines, every resident matches its
 * house, every document's system data passes the data models, and every
 * house journal finds its catalog house by its flag.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { packSources, GANG } from "../tools/pack-content.mjs";
import { PACKS, readSource, makeId } from "../tools/pack-config.mjs";
import { RESIDENT_ART } from "../tools/asset-art.mjs";
import { HOUSES, findHouse } from "../module/logic/house-catalog.mjs";
import { CATB } from "../module/config.mjs";
import { installFoundry } from "../tools/fake-foundry.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));

test("the committed pack sources are what the generator makes (run `npm run build:packs` after changing the book or the houses)", () => {
  const want = packSources();
  for (const def of PACKS) {
    const got = readSource(def.file);
    const exp = [...want[def.file]].sort((a, b) => a.key.localeCompare(b.key));
    assert.deepEqual(got.map(d => d.key), exp.map(d => `${d.key}`).sort(), `${def.file}: the same documents`);
    for (const d of exp) assert.deepEqual(got.find(x => x.key === d.key), d, `${def.file}/${d.key} is out of date`);
  }
  assert.deepEqual(manifest.packs.map(p => p.name), PACKS.map(p => p.out));
});

test("the ready-made gang matches Chapter 3", () => {
  const html = readFileSync(join(ROOT, "book/src/chapters/13-ch03-ready-made-gang.html"), "utf8").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const label = k => CATB.approaches[k].label;
  for (const c of GANG) {
    const order = Object.entries(c.approaches).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${label(k)} ${v}`).join(" · ");
    assert.ok(html.includes(order), `${c.name}: "${order}"`);
    const inst = `Instincts ${c.instincts.map(i => CATB.instincts[i].label).join(", ")} · Body ${CATB.bodies[c.body].label}`;
    assert.ok(html.includes(inst), `${c.name}: "${inst}"`);
    assert.ok(html.includes(c.name), c.name);
    assert.deepEqual(Object.values(c.approaches).sort().join(), "1,1,2,3", `${c.name} has the starting spread`);
    assert.ok(html.replace(/[’‘]/g, "'").includes(`“${c.quote}”`), `${c.name}'s quote is Chapter 3's: "${c.quote}"`);
  }
  assert.deepEqual(GANG.map(c => c.name), ["Two-Bin Tilly", "Big Biscuit", "Velvet", "Marmalade Mags", "Pip"]);
});

test("every resident of every house is in the Residents pack, with its house's numbers", () => {
  const res = packSources().residents;
  for (const h of HOUSES) {
    for (const x of [...h.humans, ...h.pets]) {
      const d = res.find(r => r.flags["cat-burglars"].house === h.key && r.flags["cat-burglars"].resident === x.key);
      assert.ok(d, `${h.key}/${x.key}`);
      assert.equal(d.system.start, x.start);
      if (x.routine) assert.deepEqual(Object.values(d.system.routine), x.routine);
      if (x.attention !== undefined) assert.equal(d.system.attention, x.attention);
      if (x.rating !== undefined) assert.equal(d.system.rating, x.rating);
    }
  }
  assert.equal(res.length, HOUSES.reduce((n, h) => n + h.humans.length + h.pets.length, 0));
  assert.equal(new Set(res.map(r => r.name)).size, res.length, "names are unique");
});

test("every house journal carries its catalog key and the book's text", () => {
  for (const j of packSources().houses) {
    assert.equal(findHouse(j), findHouse(j.flags["cat-burglars"].house));
    assert.ok(findHouse(j), j.name);
    assert.match(j.pages[0].text.content, /Read this aloud/);
    assert.match(j.pages[0].text.content, /The Prize Clock/);
    assert.doesNotMatch(j.pages[0].text.content, /\{\{[A-Z]+\}\}/, "no template markers left");
  }
});

test("every actor's system data passes the data models", async () => {
  installFoundry({ users: [{ id: "gmUser0000000000", name: "GM", isGM: true }] });
  const { ACTOR_MODELS } = await import("../module/data/actor-data.mjs");
  Object.assign(globalThis.CONFIG.Actor.dataModels, ACTOR_MODELS);
  for (const d of [...packSources().gang, ...packSources().residents]) {
    assert.ok(d.type in manifest.documentTypes.Actor, `${d.name}: type ${d.type}`);
    const a = new globalThis.Actor({ name: d.name, type: d.type, system: d.system });
    for (const [k, v] of Object.entries(d.system)) assert.deepEqual(a.system[k], v, `${d.name}: system.${k} survives cleaning`);
  }
});

/** A WebP's size from its header (lossy "VP8 ", lossless "VP8L", extended "VP8X"). */
function webpSize(file) {
  const b = readFileSync(file);
  assert.equal(b.toString("ascii", 0, 4) + b.toString("ascii", 8, 12), "RIFFWEBP", `${file} is a WebP`);
  const kind = b.toString("ascii", 12, 16);
  if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === "VP8L") { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}
const assetFile = src => join(ROOT, src.replace(`systems/${manifest.id}/`, ""));

test("every house has a ready-to-play scene: its plan the size of the scene, on a grid of map squares, linked to the house's journal", () => {
  const scenes = packSources().scenes, houses = packSources().houses;
  assert.deepEqual(scenes.map(sc => sc.flags["cat-burglars"].house).sort(), HOUSES.map(h => h.key).sort());
  for (const sc of scenes) {
    const key = sc.flags["cat-burglars"].house, L = sc.flags["cat-burglars"].layout;
    assert.equal(sc.flags["cat-burglars"].readyToPlay, true);
    assert.deepEqual(webpSize(assetFile(sc.background)), [sc.width, sc.height], `${key}: the background is the scene's size (run npm run build:assets)`);
    assert.deepEqual(webpSize(assetFile(sc.thumb)), [300, 200]);
    assert.equal(sc.grid.size, L.grid);
    assert.equal(sc.width % L.grid, 0, "whole squares across");
    assert.equal(sc.height % L.grid, 0, "and down");
    assert.equal(L.token * 2, L.grid, "a token is half a square: one cat length");
    assert.ok(sc.initial.scale > 0.2 && sc.initial.scale < 1);
    const journal = houses.find(j => j.key === key);
    assert.equal(sc.journal, makeId("houses", journal.key), `${key}: the scene's journal is the house's (by its compendium id)`);
    assert.ok(existsSync(assetFile(L.getaway.img)), "the warden's tile");
    const page = journal.pages.find(p => p.key === "foundry").text.content;
    assert.match(page, /Play a ready-made game/, `${key}: the journal says how to start`);
    assert.match(page, /Configure Ownership/);
  }
  assert.equal(manifest.packFolders[0].packs[0], "ready-to-play", "the ready-to-play games come first in the system's compendium folder");
});

test("the gang and the residents the book draws have pictures; the humans keep the core figure", () => {
  for (const d of packSources().gang) {
    assert.match(d.img, /^systems\/cat-burglars\/assets\/gang\/[a-z-]+\.webp$/, d.name);
    assert.match(d.token, /-token\.webp$/, d.name);
    assert.deepEqual(webpSize(assetFile(d.img)), [512, 512]);
    assert.deepEqual(webpSize(assetFile(d.token)), [256, 256]);
  }
  for (const d of packSources().residents) {
    if (d.type === "human") { assert.equal(d.img, "icons/svg/mystery-man.svg", `${d.name}: the book draws no faces for the humans`); continue; }
    const key = d.flags["cat-burglars"].resident;
    assert.ok(RESIDENT_ART[key], `${d.name} has a drawing in the book`);
    assert.equal(d.img, `systems/cat-burglars/assets/residents/${RESIDENT_ART[key]}.webp`);
    assert.ok(existsSync(assetFile(d.token)), `${d.name}'s token`);
  }
});
