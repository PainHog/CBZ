#!/usr/bin/env node
/**
 * Writes the five house chapters (book/src/chapters/4x-house-*.html) from the
 * house data the simulator plays (sim/houses.mjs) plus each house's
 * hand-written text (book/src/houses/<key>.html, with {{SHEET}}, {{RESIDENTS}},
 * {{CLOCK}}, {{ROOMS}} markers). Text, map and numbers come from one source
 * (LESSONS: check the scenario text against its map).
 *   node book/tools/house-pages.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { HOUSES } from "../../sim/houses.mjs";
import { optText } from "./art-gen/scenes/maps.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const INSTINCT = { curious: "Curious", knocker: "Knocker", boxSitter: "Box Sitter", hunter: "Hunter", lapCat: "Lap Cat", foodie: "Foodie", climber: "Climber", scrapper: "Scrapper" };
const KIND = { grownup: "Grown-up", kid: "Kid", grandparent: "Grandparent", teen: "Teen" };
const SIZE = { tight: "Tight", normal: "Normal", big: "Big" };
const PSIZE = { small: "Small", medium: "Medium", large: "Large" };
const esc = s => String(s).replace(/&/g, "&amp;");

function roomName(h, k) { return h.rooms[k]?.name ?? k; }
function routineText(h, r) {
  // group equal results: "1–3 stays; 4 kitchen; 5–6 living room"
  const out = []; let i = 0;
  while (i < 6) {
    let j = i; while (j + 1 < 6 && r[j + 1] === r[i]) j++;
    const face = i === j ? `${i + 1}` : `${i + 1}–${j + 1}`;
    const what = r[i] === "stay" ? "stays put" : r[i] === "sniff" ? "sniffs one room toward the nearest cat" : roomName(h, r[i]);
    out.push(`<strong>${face}</strong> ${what}`);
    i = j + 1;
  }
  return out.join("; ");
}
const ordinal = n => `round ${n}`;

function sheet(h, label) {
  const z = h.prize;
  const portions = z.kind === "delicious" ? `portions: ${z.perCat} per cat${z.plus ? ` + ${z.plus}` : ""}` : "";
  let s = `<aside class="box list house-sheet"><h4>At a glance</h4>
  <p class="statline"><strong>Difficulty</strong> ${label} <span class="sep">·</span> <strong>Patience</strong> ${h.patience} <span class="sep">·</span> <strong>The prize</strong> ${esc(z.name)} (${PSIZE[z.size]}${portions ? `, ${portions}` : ""}${z.haulDiff ? `; hauling it is ${z.haulDiff >= 2 ? "Hard" : "Tricky"}` : ""}) <span class="sep">·</span> <strong>Gone</strong> at the start of round ${z.goneAt} <span class="sep">·</span> <strong>Den</strong> ${roomName(h, h.den)}</p>
  <p class="statline"><strong>Who lives here</strong> ${h.humans.map(x => esc(x.name)).concat(h.pets.map(x => esc(x.name))).join(", ")}</p>
  <p class="statline"><strong>Three cats</strong> Patience ${h.patience + 1}, gone at the start of round ${z.goneAt + 2}, 3 Cattitude each <span class="sep">·</span> <strong>Five cats</strong> Patience ${Math.max(2, h.patience - 1)}, gone at the start of round ${z.goneAt - 1}</p>
</aside>`;
  return s;
}

/** What a step on the way to the prize is, from its options (the house data names none). */
function stepName(st) {
  if (st.some(o => o.includes("climb"))) return "climb up to it (a Climber’s Knack)";
  if (st[0][0] === "streetwise" && st.some(o => o[0] === "sneaky")) return "get it out of the bag (a Curious cat’s Knack)";
  if (st[0][0] === "streetwise") return "get the wrapping off (a Curious cat’s Knack)";
  return "get at it";
}

function clock(h) {
  const z = h.prize;
  const rows = z.script.map(sc => {
    const steps = sc.steps.length ? sc.steps.map((st, i) => `step ${i + 1}: ${stepName(st)} (${optText(st)})`).join("; then ") : "no roll to get at it";
    const who = h.humans.find(x => x.key === sc.by)?.name ?? sc.by;
    return `<tr><td>Start of ${ordinal(sc.round)}</td><td>${esc(who)} puts it in the ${roomName(h, sc.room).toLowerCase()} and stays there this round. ${steps[0].toUpperCase() + steps.slice(1)}.</td></tr>`;
  });
  rows.push(`<tr><td>Start of ${ordinal(z.goneAt)}</td><td>Gone — unless the gang has got it out or a cat is holding it.</td></tr>`);
  rows.push(`<tr><td>End of ${ordinal(z.goneAt + 2)}</td><td>Lights Out: any cat still inside is adopted.</td></tr>`);
  return `<table class="tbl"><thead><tr><th>When</th><th>The prize</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

function residents(h) {
  let s = "";
  for (const x of h.humans) {
    const traits = [];
    if (x.kind === "kid") traits.push("<dt>Kid</dt><dd>Doubles Cuddle steps from any roll they see.</dd>");
    if (x.kind === "grandparent") traits.push("<dt>Dozes</dt><dd>Each round on a 1–2 (extra d6), asleep until the end of the next round.</dd>");
    if (x.kind === "teen") traits.push("<dt>Headphones</dt><dd>Doesn’t answer noise.</dd>");
    if (x.busy) traits.push("<dt>Busy</dt><dd>Cooking: never answers noise.</dd>");
    s += `<article class="statblock" id="${h.key}-${x.key}">
  <h3>${esc(x.name)} <span class="epithet">${KIND[x.kind] ?? x.kind}</span></h3>
  <dl class="stats"><div><dt>Attention</dt><dd>${x.attention}</dd></div><div><dt>Starts in</dt><dd>${roomName(h, x.start)}</dd></div></dl>
  <p class="pools"><strong>Routine (d6):</strong> ${routineText(h, x.routine)}.</p>
  ${traits.length ? `<dl class="traits">${traits.join("")}</dl>` : ""}
</article>`;
  }
  for (const x of h.pets) {
    let stats = "", traits = [];
    if (x.kind === "dog") {
      stats = `<div><dt>Rating</dt><dd>${x.rating}</dd></div><div><dt>Starts in</dt><dd>${roomName(h, x.start)}${x.asleep ? ", asleep" : ""}</dd></div>`;
      traits.push(`<dt>Dog</dt><dd>Barks, charges and smells hidden cats (Chapter 10). ${x.soft ? "<strong>Soft:</strong> Sweet can befriend it." : "Not soft: Sweet won’t work on it."}</dd>`);
      s += `<article class="statblock" id="${h.key}-${x.key}"><h3>${esc(x.name)} <span class="epithet">Dog</span></h3><dl class="stats">${stats}</dl>
  <p class="pools"><strong>Routine (d6):</strong> ${routineText(h, x.routine)}.</p><dl class="traits">${traits.join("")}</dl></article>`;
    } else if (x.kind === "housecat") {
      s += `<article class="statblock" id="${h.key}-${x.key}"><h3>${esc(x.name)} <span class="epithet">House cat</span></h3><dl class="stats"><div><dt>Rating</dt><dd>${x.rating}</dd></div><div><dt>Guards</dt><dd>${roomName(h, x.start)}</dd></div></dl>
  <dl class="traits"><dt>House cat</dt><dd>Guards its room (Chapter 10). ${x.soft ? "<strong>Soft:</strong> Sweet can befriend her." : ""}</dd></dl></article>`;
    } else if (x.kind === "parrot") {
      s += `<article class="statblock" id="${h.key}-${x.key}"><h3>${esc(x.name)} <span class="epithet">Parrot</span></h3><dl class="stats"><div><dt>Lives in</dt><dd>${roomName(h, x.start)}</dd></div></dl>
  <dl class="traits"><dt>Parrot</dt><dd>Squawks at cats it can see; cover the cage (Streetwise, Tricky) to quiet it (Chapter 10).</dd></dl></article>`;
    } else if (x.kind === "vacuum") {
      s += `<article class="statblock" id="${h.key}-${x.key}"><h3>${esc(x.name)} <span class="epithet">Robot vacuum</span></h3><dl class="stats"><div><dt>Starts in</dt><dd>${roomName(h, x.start)}</dd></div><div><dt>Goes</dt><dd>${x.roam.map(r => roomName(h, r)).join(", ")}</dd></div></dl>
  <dl class="traits"><dt>Vacuum</dt><dd>Wanders one room a round; tempts Hunters; can be ridden (Chapter 10).</dd></dl></article>`;
    }
  }
  return s;
}

function rooms(h) {
  const rows = Object.entries(h.rooms).map(([k, r]) => {
    const doors = h.ways.filter(w => (w[0] === k || w[1] === k) && w[3]).map(w => `door to the ${roomName(h, w[0] === k ? w[1] : w[0]).toLowerCase()} (${optText(w[3])})`);
    const tempt = r.tempt.length ? r.tempt.map(i => INSTINCT[i]).join(", ") : "—";
    const notes = [k === h.den ? "<strong>the Den</strong>" : null, ...doors].filter(Boolean).join("; ");
    return `<tr><td>${esc(r.name)}</td><td>${tempt}</td><td>${notes || "—"}</td></tr>`;
  });
  const SIZE = { tight: "Tight", normal: "Normal", big: "Big" };
  const ways = h.ways.map(w => `${roomName(h, w[0])}–${roomName(h, w[1])} ${SIZE[w[2]]}${w[3] ? " (door)" : (w[0] === h.den || w[1] === h.den) ? " (the Den’s door: open, shut while a cat is in)" : ""}`).join(" · ");
  return `<table class="tbl"><thead><tr><th>Room</th><th>Tempts</th><th>Notes</th></tr></thead><tbody>${rows.join("")}</tbody></table>
  <p class="ways"><strong>Ways between rooms:</strong> ${ways}.</p>`;
}

const LABEL = { easy: "Easy", standard: "Standard", hard: "Hard" };
HOUSES.forEach((h, i) => {
  const src = readFileSync(`${ROOT}book/src/houses/${h.key}.html`, "utf8");
  const n = 14 + i;
  const html = src
    .replace("{{NUM}}", String(n))
    .replace("{{ID}}", `ch-${n}`)
    .replace("{{SHEET}}", sheet(h, LABEL[h.label]))
    .replace("{{MAP}}", `<figure class="art map" data-art="map-${h.key}"><figcaption>${esc(h.name)}: the floor plan and the ways in.</figcaption></figure>`)
    .replace("{{CLOCK}}", clock(h))
    .replace("{{ROOMS}}", rooms(h))
    .replace("{{RESIDENTS}}", residents(h));
  const out = `${ROOT}book/src/chapters/${41 + i}-ch${n}-${h.key}.html`;
  writeFileSync(out, `<!-- GENERATED by book/tools/house-pages.mjs from sim/houses.mjs + book/src/houses/${h.key}.html: edit those, not this file. -->\n` + html);
  console.log("wrote", out.replace(ROOT, ""));
});
