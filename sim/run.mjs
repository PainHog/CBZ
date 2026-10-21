#!/usr/bin/env node
/**
 * Runs every house N times and prints a summary (later: writes REPORT.md).
 *   node sim/run.mjs [--runs 2000] [--seed 1] [--house key] [--set k=v ...] [--preset strict] [--package P0] [--json]
 */
import { makeRng } from "./rng.mjs";
import { makeParams, PRESETS, PACKAGES } from "./params.mjs";
import { HOUSES } from "./houses.mjs";
import { makeGang } from "./character.mjs";
import { playRobbery } from "./engine.mjs";
import { Recorder } from "./recorder.mjs";

export function parseArgs(argv) {
  const a = { runs: 2000, seed: 1, house: null, set: {}, preset: null, package: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--runs") a.runs = Number(argv[++i]);
    else if (k === "--seed") a.seed = Number(argv[++i]);
    else if (k === "--house") a.house = argv[++i];
    else if (k === "--preset") a.preset = argv[++i];
    else if (k === "--package") a.package = argv[++i];
    else if (k === "--json") a.json = true;
    else if (k === "--set") {
      const [key, v] = argv[++i].split("=");
      a.set[key] = v === "true" ? true : v === "false" ? false : v.startsWith("[") ? JSON.parse(v) : isNaN(Number(v)) ? v : Number(v);
    }
  }
  return a;
}

export function runHouse(house, p, runs, seed) {
  const rec = new Recorder();
  for (let i = 0; i < runs; i++) {
    const gangRng = makeRng(seed, "gang", p.gangSize, i);
    const gang = makeGang(gangRng, p.gangSize, p);
    const rng = makeRng(seed, "dice", house.key, i);
    rec.start();
    playRobbery(house, gang, p, rng, rec);
  }
  return rec.summary();
}

export function runAll({ runs, seed, house, set, preset, package: pkg }) {
  const p = makeParams({ ...(preset ? PRESETS[preset] : {}), ...(pkg ? PACKAGES[pkg] : {}), ...set });
  const houses = HOUSES.filter(h => !house || h.key === house);
  const rows = houses.map(h => ({ house: h, s: runHouse(h, p, runs, seed) }));
  const byLabel = {};
  for (const { house: h, s } of rows) {
    const b = (byLabel[h.label] ??= { n: 0, win: 0, clean: 0, busted: 0, leftBehind: 0, caught: 0 });
    b.n++; b.win += s.win; b.clean += s.clean; b.busted += s.busted; b.leftBehind += s.leftBehind; b.caught += s.caught;
  }
  for (const b of Object.values(byLabel)) for (const k of ["win", "clean", "busted", "leftBehind", "caught"]) b[k] /= b.n;
  return { p, rows, byLabel };
}

const f = x => x.toFixed(1);

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const { rows, byLabel } = runAll(args);
  if (args.json) { console.log(JSON.stringify({ rows: rows.map(r => ({ key: r.house.key, ...r.s })), byLabel }, null, 1)); process.exit(0); }
  console.log(`node sim/run.mjs ${process.argv.slice(2).join(" ")}`);
  console.log("house                          label     win  clean messy bust | caught left | flop scr cln purr | rolls rnds seen% | tempt gave% | spend half% push lives | shoo scoop | cred tags nip%");
  for (const { house: h, s } of rows) {
    console.log(`${h.name.padEnd(30)} ${h.label.padEnd(8)} ${f(s.win).padStart(5)} ${f(s.clean).padStart(5)} ${f(s.messy).padStart(5)} ${f(s.busted).padStart(4)} | ${f(s.caught).padStart(5)} ${f(s.leftBehind).padStart(4)} | ${f(s.flop).padStart(4)} ${f(s.scrape).padStart(3)} ${f(s.cleanRoll).padStart(3)} ${f(s.purrfect).padStart(4)} | ${f(s.rollsPer).padStart(5)} ${f(s.roundsPer).padStart(4)} ${f(s.seenShare).padStart(4)} | ${f(s.temptedPer).padStart(5)} ${f(s.gaveIn).padStart(4)} | ${f(s.spentPerCat).padStart(5)} ${f(s.halfSpenders).padStart(4)} ${f(s.pushPer).padStart(4)} ${f(s.livesPer).padStart(5)} | ${f(s.shooPer).padStart(4)} ${f(s.scoopPer).padStart(5)} | ${f(s.credPer).padStart(4)} ${f(s.tagsPer).padStart(4)} ${f(s.nipShare).padStart(4)}`);
  }
  for (const [k, b] of Object.entries(byLabel)) console.log(`${k.padEnd(9)} win ${f(b.win)}  clean ${f(b.clean)}  busted ${f(b.busted)}  caught ${f(b.caught)}  left ${f(b.leftBehind)}`);
  if (rows.length === 1) {
    const s = rows[0].s;
    console.log("reasons", s.reasons); console.log("events", s.events); console.log("rollsBy", s.rollsBy);
    console.log("pool", s.poolHist); console.log("moodWhy", s.moodWhy); console.log("entrances", s.entrances);
  }
}
