#!/usr/bin/env node
/**
 * Compares rule packages side by side on the same gangs and dice (common
 * random numbers) and writes sim/BALANCE.md (sim/README.md §4–§5).
 *   node sim/packages.mjs [--runs 2000] [--seed 1] [--packages P1,P4] [--out sim/BALANCE.md]
 */
import { writeFileSync } from "node:fs";
import { makeParams, PACKAGES } from "./params.mjs";
import { HOUSES } from "./houses.mjs";
import { runHouse } from "./run.mjs";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const runs = Number(opt("--runs", 2000));
const seed = Number(opt("--seed", 1));
const pkgs = opt("--packages", Object.keys(PACKAGES).join(",")).split(",");
const out = opt("--out", null);
const SIZES = [3, 4, 5];

const f = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : "—");

export function measure(pkg, runs, seed) {
  const rows = {};
  for (const g of SIZES) {
    const p = makeParams({ ...PACKAGES[pkg], gangSize: g });
    rows[g] = HOUSES.map(h => ({ h, s: runHouse(h, p, runs, seed) }));
  }
  const label = (g, lab, k) => {
    const xs = rows[g].filter(r => r.h.label === lab).map(r => r.s[k]);
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };
  const pooled = (g, k) => rows[g].reduce((a, r) => a + r.s[k], 0) / rows[g].length;
  const m = {};
  for (const g of SIZES) {
    m[g] = {
      easy: label(g, "easy", "win"), standard: label(g, "standard", "win"), hard: label(g, "hard", "win"),
      cleanShareEasy: (100 * label(g, "easy", "clean")) / label(g, "easy", "win"),
      cleanShareHard: (100 * label(g, "hard", "clean")) / label(g, "hard", "win"),
      caughtStd: label(g, "standard", "caught"),
      leftHard: label(g, "hard", "leftBehind"), leftEasy: label(g, "easy", "leftBehind"),
      flop: pooled(g, "flop"), purrfect: pooled(g, "purrfect"), gaveIn: pooled(g, "gaveIn"),
      halfSpenders: pooled(g, "halfSpenders"), rolls: pooled(g, "rollsPer"), rounds: pooled(g, "roundsPer"),
    };
  }
  return { rows, m };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lines = [];
  lines.push("# Nine Lives Gang — balance packages", "");
  lines.push(`\`node sim/packages.mjs --runs ${runs} --seed ${seed} --packages ${pkgs.join(",")}\``, "");
  lines.push("Each package runs every house with gangs of 3, 4 and 5 cats on the same gangs and dice. Win = Clean or Messy Getaway.", "");
  lines.push("## Gang of 4 against the targets", "");
  lines.push("| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |");
  lines.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  lines.push("| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |");
  const all = {};
  for (const k of pkgs) {
    const r = measure(k, runs, seed); all[k] = r;
    const x = r.m[4];
    lines.push(`| ${k} | ${f(x.easy)} | ${f(x.standard)} | ${f(x.hard)} | ${f(x.cleanShareEasy, 0)} / ${f(x.cleanShareHard, 0)} | ${f(x.caughtStd)} | ${f(x.leftEasy)} / ${f(x.leftHard)} | ${f(x.flop)} | ${f(x.purrfect)} | ${f(x.gaveIn)} | ${f(x.halfSpenders)} | ${f(x.rolls)} | ${f(x.rounds)} |`);
  }
  lines.push("", "## Gang size (win % Easy / Standard / Hard)", "");
  lines.push("| package | 3 cats | 4 cats | 5 cats |", "|---|---|---|---|");
  for (const k of pkgs) {
    const m = all[k].m;
    lines.push(`| ${k} | ${SIZES.map(g => `${f(m[g].easy)} / ${f(m[g].standard)} / ${f(m[g].hard)}`).join(" | ")} |`);
  }
  lines.push("", "## Per house, gang of 4 (win · clean · busted · left behind)", "");
  lines.push(`| house | label | ${pkgs.join(" | ")} |`, `|---|---|${pkgs.map(() => "---").join("|")}|`);
  for (const [i, h] of HOUSES.entries()) {
    lines.push(`| ${h.name} | ${h.label} | ${pkgs.map(k => { const s = all[k].rows[4][i].s; return `${f(s.win)} · ${f(s.clean)} · ${f(s.busted)} · ${f(s.leftBehind)}`; }).join(" | ")} |`);
  }
  const text = lines.join("\n") + "\n";
  if (out) writeFileSync(out, text); else process.stdout.write(text);
}
