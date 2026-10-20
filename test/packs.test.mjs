/**
 * Compendium packs: the committed sources are exactly what tools/pack-content.mjs
 * generates (so the packs follow the house catalog and the book), the
 * ready-made gang matches Chapter 3's statlines, every resident matches its
 * house, every document's system data passes the data models, and every
 * house journal finds its catalog house by its flag.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { packSources, GANG } from "../tools/pack-content.mjs";
import { PACKS, readSource } from "../tools/pack-config.mjs";
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
