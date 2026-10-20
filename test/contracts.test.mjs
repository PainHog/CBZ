/**
 * Contracts (module/contracts.mjs): every setting key, card kind, GM op and
 * hook is actually used by the system, every op is registered exactly once,
 * every setting is registered and labelled, and every card kind with buttons
 * has exactly one button renderer (AUTOMATION.md §10; the Heisty WP-D check).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SETTINGS, CARD, OPS, HOOKS } from "../module/contracts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = dir => readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".mjs") ? [p] : []; });
const files = walk(join(ROOT, "module")).filter(f => !f.endsWith("contracts.mjs"));
const code = files.map(f => readFileSync(f, "utf8")).join("\n");
const lang = JSON.parse(readFileSync(join(ROOT, "lang/en.json"), "utf8"));

test("every contract constant is used outside contracts.mjs", () => {
  for (const [group, obj, name] of [["SETTINGS", SETTINGS], ["CARD", CARD], ["OPS", OPS], ["HOOKS", HOOKS]].map(([g, o]) => [g, o, g])) {
    for (const key of Object.keys(obj)) assert.match(code, new RegExp(`\\b${name}\\.${key}\\b`), `${group}.${key} is never used`);
  }
});

test("every GM op is registered exactly once, and only through the registry", () => {
  for (const key of Object.keys(OPS)) {
    const n = (code.match(new RegExp(`gm\\.register\\(\\s*OPS\\.${key}\\b`, "g")) ?? []).length;
    assert.equal(n, 1, `OPS.${key} registered ${n} times`);
  }
});

test("every card kind that has buttons has exactly one renderer", () => {
  for (const key of Object.keys(CARD)) {
    const n = (code.match(new RegExp(`registerButtons\\(\\s*CARD\\.${key}\\b`, "g")) ?? []).length;
    assert.ok(n <= 1, `CARD.${key} has ${n} button renderers`);
  }
  for (const key of ["roll", "temptation", "temptPrompt", "outcome"]) assert.match(code, new RegExp(`registerButtons\\(\\s*CARD\\.${key}\\b`), `CARD.${key} needs buttons`);
});

test("every setting is registered, and every configurable one has a name and hint in lang/en.json", async () => {
  const { SETTING_DEFS } = await import("../module/settings.mjs").catch(() => ({}));
  // settings.mjs touches no Foundry globals at import time, so it imports under Node
  assert.ok(SETTING_DEFS, "settings.mjs imports under plain Node");
  for (const key of Object.values(SETTINGS)) assert.ok(SETTING_DEFS[key], `${key} has no definition`);
  for (const [key, def] of Object.entries(SETTING_DEFS)) {
    if (!def.config) continue;
    assert.ok(lang[def.name], `${key}: missing ${def.name}`);
    assert.ok(lang[def.hint], `${key}: missing ${def.hint}`);
    for (const label of Object.values(def.choices ?? {})) assert.ok(lang[label], `${key}: missing ${label}`);
  }
});

test("hook names are namespaced and unique", () => {
  const names = Object.values(HOOKS);
  assert.equal(new Set(names).size, names.length);
  for (const n of names) assert.match(n, /^catBurglars\./);
  assert.equal(new Set(Object.values(OPS)).size, Object.values(OPS).length);
  assert.equal(new Set(Object.values(CARD)).size, Object.values(CARD).length);
});
