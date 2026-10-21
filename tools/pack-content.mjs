/**
 * NINE LIVES GANG — compendium content, generated (not hand-edited).
 * --------------------------------------------------------------------
 * Writes packs/_source/{houses,gang,residents}/*.json from:
 *  - the house catalog (module/logic/house-catalog.mjs, a copy of sim/houses.mjs),
 *  - each house's hand-written text in the rulebook (book/src/houses/<key>.html:
 *    "Read this aloud", the description, "How it plays"), with the catalog's
 *    numbers filled in where the book's generator puts its tables,
 *  - the ready-made gang of Chapter 3 (book/src/chapters/13-ch03-ready-made-gang.html).
 * The book is the source of truth: change the book (or sim/houses.mjs and the
 * catalog copy), then run `npm run build:packs`, which regenerates these
 * sources and compiles them. test/packs.test.mjs fails if the committed
 * sources differ from what this file generates, and checks the gang against
 * Chapter 3's statlines.
 *
 *   node tools/pack-content.mjs           # write the sources
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { HOUSES, humanTraits, optionsText } from "../module/logic/house-catalog.mjs";
import { CATB } from "../module/config.mjs";
import { gangScaling } from "../module/logic/prize.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "packs", "_source");
const FLAG = "cat-burglars";
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const LABEL = { easy: "Easy", standard: "Standard", hard: "Hard" };
const INSTINCT = k => CATB.instincts[k]?.label ?? k;
const routineObject = list => Object.fromEntries([1, 2, 3, 4, 5, 6].map(i => [`r${i}`, list?.[i - 1] ?? "stay"]));
const roomName = (h, k) => h.rooms[k]?.name ?? k;

/** Chapter 3, "The Ready-Made Gang" (statlines checked against the book by test/packs.test.mjs). */
export const GANG = [
  { key: "two-bin-tilly", name: "Two-Bin Tilly", approaches: { streetwise: 3, sneaky: 2, sweet: 1, savage: 1 }, instincts: ["curious", "climber"], body: "lean",
    coat: "Grey tabby", mark: "A red collar with a brass tag", eyes: "Green", quirk: "Never forgets a face",
    quote: "Every lid on this street has a trick. I know all of them.", role: "the Brains" },
  { key: "big-biscuit", name: "Big Biscuit", approaches: { savage: 3, streetwise: 2, sweet: 1, sneaky: 1 }, instincts: ["scrapper", "foodie"], body: "chonky",
    coat: "Big brown tabby with a cream muzzle", mark: "A notch in his left ear", eyes: "Amber", quirk: "Sleeps on the launderette roof",
    quote: "Excuse me. I'm coming through. Thank you.", role: "the Muscle" },
  { key: "velvet", name: "Velvet", approaches: { sweet: 3, sneaky: 2, savage: 1, streetwise: 1 }, instincts: ["lapCat", "knocker"], body: "lean",
    coat: "Sleek black", mark: "A white star on her chest and one white sock", eyes: "Amber", quirk: "Was somebody's pet, once",
    quote: "Hello. Yes. It's me. I know.", role: "the Charmer" },
  { key: "marmalade-mags", name: "Marmalade Mags", approaches: { sneaky: 3, savage: 2, streetwise: 1, sweet: 1 }, instincts: ["boxSitter", "hunter"], body: "lean",
    coat: "Ginger tabby", mark: "A kink at the very tip of her tail", eyes: "Green", quirk: "Hates the rain",
    quote: "…", role: "the Shadow" },
  { key: "pip", name: "Pip", approaches: { sweet: 3, savage: 2, sneaky: 1, streetwise: 1 }, instincts: ["hunter", "curious"], body: "lean",
    coat: "Fluffy white calico, a ginger patch over her left eye, a black right ear, black spots and tail tip", mark: "", eyes: "Big and blue", quirk: "Talks to pigeons",
    quote: "Is that a string? Is that a STRING?", role: "the gang's kitten" }
];

/* ---------------------------------------------------------- the houses -- */

function sheet(h) {
  const z = h.prize;
  const portions = z.kind === "delicious" ? `, portions: ${z.perCat} per cat${z.plus ? ` + ${z.plus}` : ""}` : "";
  return `<p><strong>House</strong> ${LABEL[h.label]} · <strong>Patience</strong> ${h.patience} · <strong>The prize</strong> ${esc(z.name)} (${z.size[0].toUpperCase() + z.size.slice(1)}${portions}) · <strong>Gone</strong> at the start of round ${z.goneAt} · <strong>Den</strong> ${esc(roomName(h, h.den))}</p>
<p><strong>Who lives here</strong> ${[...h.humans, ...h.pets].map(x => esc(x.name)).join(", ")}</p>
<p><em>${gangText(h)} The Robbery Tracker does this for you.</em></p>`;
}

/** Ch 11 "Gang size" (v0.9): this house's own three- and five-cat numbers, or the general rule. */
function gangText(h) {
  const z = h.prize;
  const s3 = gangScaling(3, h), s5 = gangScaling(5, h);
  const three = `Patience ${h.patience + s3.patience}, gone at the start of round ${z.goneAt + s3.clock}, Lights Out at the end of round ${z.goneAt + s3.clock + CATB.rules.lightsOut}, ${CATB.rules.cattitudeStart + s3.cattitude} Cattitude each`;
  const five = `Patience ${Math.max(CATB.rules.minPatience, h.patience + s5.patience)}${s5.clock ? `, gone at the start of round ${z.goneAt + s5.clock}, Lights Out at the end of round ${z.goneAt + s5.clock + CATB.rules.lightsOut}` : ""}`;
  return `For four cats. With three: ${three}. With five: ${five}.`;
}

function clock(h) {
  const z = h.prize;
  const rows = z.script.map(sc => {
    const who = h.humans.find(x => x.key === sc.by)?.name ?? sc.by;
    const steps = sc.steps.length ? sc.steps.map((st, i) => `step ${i + 1}: ${optionsText(st)}`).join("; then ") : "no roll to get at it";
    return `<tr><td>Start of round ${sc.round}</td><td>${esc(who)} puts it in the ${esc(roomName(h, sc.room).toLowerCase())} and stays there this round. ${steps[0].toUpperCase()}${steps.slice(1)}.</td></tr>`;
  });
  rows.push(`<tr><td>Start of round ${z.goneAt}</td><td>Gone — if the gang isn't holding it.</td></tr>`);
  rows.push(`<tr><td>End of round ${z.goneAt + CATB.rules.lightsOut}</td><td>Lights Out: any cat still inside is adopted.</td></tr>`);
  return `<table><thead><tr><th>When</th><th>The prize</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

function rooms(h) {
  const rows = Object.entries(h.rooms).map(([k, r]) => {
    const doors = h.ways.filter(w => (w[0] === k || w[1] === k) && w[3]).map(w => `door to the ${esc(roomName(h, w[0] === k ? w[1] : w[0]).toLowerCase())} (${optionsText(w[3])})`);
    const ents = h.entrances.filter(e => e.room === k).map(e => `${esc(e.name)}: ${e.size}${e.climb ? ", a climb (Small things only)" : ""}${e.opts.length ? `, ${optionsText(e.opts)}` : ", no roll"}${e.rounds ? `, round ${e.rounds.join(" or ")} only` : ""}${e.noisy ? ", noisy" : ""}`);
    const notes = [k === h.den ? "<strong>the Den</strong>" : null, ...doors, ...ents].filter(Boolean).join("; ");
    return `<tr><td>${esc(r.name)}</td><td>${r.tempt.length ? r.tempt.map(INSTINCT).join(", ") : "—"}</td><td>${notes || "—"}</td></tr>`;
  });
  const ways = h.ways.map(([a, b, size]) => `${esc(roomName(h, a))}–${esc(roomName(h, b))} (${size})`).join(", ");
  return `<table><thead><tr><th>Room</th><th>Tempts</th><th>Notes</th></tr></thead><tbody>${rows.join("")}</tbody></table><p><strong>Ways:</strong> ${ways}.</p>`;
}

function routineText(h, r) {
  const out = [];
  let i = 0;
  while (i < 6) {
    let j = i;
    while (j + 1 < 6 && r[j + 1] === r[i]) j++;
    const face = i === j ? `${i + 1}` : `${i + 1}–${j + 1}`;
    out.push(`<strong>${face}</strong> ${r[i] === "stay" ? "stays put" : r[i] === "sniff" ? "sniffs one room toward the nearest free cat inside" : esc(roomName(h, r[i]))}`);
    i = j + 1;
  }
  return out.join("; ");
}

function residents(h) {
  let s = "";
  for (const x of h.humans) {
    const traits = humanTraits(x).map(t => CATB.humanTraits[t]).filter(Boolean);
    s += `<h4>${esc(x.name)} (${CATB.humanKinds[x.kind] ?? x.kind})</h4><p>Attention ${x.attention} · starts in the ${esc(roomName(h, x.start).toLowerCase())}. Routine (d6): ${routineText(h, x.routine)}.</p>${traits.length ? `<p>${traits.map(esc).join(" ")}</p>` : ""}`;
  }
  for (const p of h.pets) {
    if (p.kind === "dog") s += `<h4>${esc(p.name)} (Dog)</h4><p>Rating ${p.rating} · starts in the ${esc(roomName(h, p.start).toLowerCase())}${p.asleep ? ", asleep" : ""}. Routine (d6): ${routineText(h, p.routine)}. ${p.soft ? "Soft: Sweet can befriend it." : "Not soft: Sweet won't work on it."}</p>`;
    else if (p.kind === "housecat") s += `<h4>${esc(p.name)} (House cat)</h4><p>Rating ${p.rating} · guards the ${esc(roomName(h, p.start).toLowerCase())}. ${p.soft ? "Soft: Sweet can befriend her." : ""}</p>`;
    else if (p.kind === "parrot") s += `<h4>${esc(p.name)} (Parrot)</h4><p>Lives in the ${esc(roomName(h, p.start).toLowerCase())}. Squawks at cats it can see; cover the cage (Streetwise, Tricky).</p>`;
    else if (p.kind === "vacuum") s += `<h4>${esc(p.name)} (Robot vacuum)</h4><p>Starts in the ${esc(roomName(h, p.start).toLowerCase())}; wanders ${p.roam.map(r => esc(roomName(h, r))).join(", ")}. Tempts Hunters; can be ridden.</p>`;
  }
  return s;
}

/** The book's page for a house, with the catalog's tables filled in (as book/tools/house-pages.mjs does). */
function housePage(h) {
  const file = join(ROOT, "book", "src", "houses", `${h.key}.html`);
  let html = existsSync(file) ? readFileSync(file, "utf8") : `<h2>${esc(h.name)}</h2>{{SHEET}}<h3>The Prize Clock</h3>{{CLOCK}}<h3>The rooms</h3>{{ROOMS}}<h3>Who lives here</h3>{{RESIDENTS}}`;
  html = html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "")
    .replace(/<p class="chapter-num">[\s\S]*?<\/p>/, "")
    .replace("{{SHEET}}", sheet(h)).replace("{{CLOCK}}", clock(h)).replace("{{ROOMS}}", rooms(h)).replace("{{RESIDENTS}}", residents(h))
    .replace("{{MAP}}", "").replace(/\{\{[A-Z]+\}\}/g, "")
    .replace(/\n\s*\n+/g, "\n").trim();
  return html;
}

const RUNNING = h => `<h2>Running ${esc(h.name)} in Foundry</h2>
<ol>
<li>Open the <strong>Robbery Tracker</strong> (the cat button on the token controls) and choose <strong>Start a robbery</strong>: pick this house and the gang. Every cat starts outside, with its starting Cattitude.</li>
<li><strong>Begin round</strong> runs the Prize Clock and, if anyone can be tempted, whispers you one-click <strong>Tempt</strong> buttons.</li>
<li>Players move and act from the tracker (or roll from their cat sheets). The roll dialog fills in the Knack, help, Difficulty, the pet and who is watching; the card offers Push and Accept, and you can flip Seen.</li>
<li><strong>End round</strong> rolls the house's turn in the open: pets, noise, routines and Searching, holders, then Finding it.</li>
<li>The robbery ends at Lights Out, or at the end of a round when no free cat is left inside and the prize is got or gone (or when you press <strong>End the robbery</strong> because the gang has gone home), and the outcome is posted.</li>
</ol>
<p>Every automation can be switched off in the system settings. The residents of this house are in the <em>Residents</em> compendium; the tracker works without them.</p>`;

export function houseDocs() {
  return HOUSES.map(h => ({
    key: h.key, name: h.name, flags: { [FLAG]: { house: h.key } },
    pages: [
      { key: "house", name: h.name, type: "text", title: { show: false, level: 1 }, text: { format: 1, content: housePage(h) } },
      { key: "foundry", name: "Running it in Foundry", type: "text", title: { show: true, level: 1 }, text: { format: 1, content: RUNNING(h) } }
    ]
  }));
}

/* ------------------------------------------------------------- actors -- */

export function gangDocs() {
  return GANG.map(c => ({
    key: c.key, name: c.name, type: "cat", img: "icons/svg/cat.svg", actorLink: true,
    system: {
      approaches: { sneaky: c.approaches.sneaky, sweet: c.approaches.sweet, savage: c.approaches.savage, streetwise: c.approaches.streetwise },
      instinct1: c.instincts[0], instinct2: c.instincts[1], body: c.body,
      cattitude: CATB.rules.cattitudeStart, lives: CATB.rules.livesMax, rep: 0,
      coat: c.coat, mark: c.mark, eyes: c.eyes, quirk: c.quirk,
      notes: `“${c.quote}” ${c.name} is ${c.role}. (The Ready-Made Gang, Chapter 3.)`
    },
    flags: { [FLAG]: { gang: c.key } }
  }));
}

const PET_IMG = { dog: "icons/svg/pawprint.svg", housecat: "icons/svg/cat.svg", parrot: "icons/svg/wing.svg", vacuum: "icons/svg/clockwork.svg" };
const SHORT = { "number-12": "Number 12", "okafor-box": "the Okafors'", "wendell-mouse": "Grandpa Wendell's", "birthday-cake": "the birthday party", "marchetti-salmon": "Chef Marchetti's" };

export function residentDocs() {
  const docs = [];
  const names = new Map();
  for (const h of HOUSES) for (const x of [...h.humans, ...h.pets]) names.set(x.name, (names.get(x.name) ?? 0) + 1);
  for (const h of HOUSES) {
    for (const x of h.humans) {
      const t = humanTraits(x);
      docs.push({
        key: `${h.key}-${x.key}`, name: names.get(x.name) > 1 ? `${x.name} (${SHORT[h.key]})` : x.name, type: "human", img: "icons/svg/mystery-man.svg",
        system: { kind: x.kind, attention: x.attention, traits: { kid: t.includes("kid"), dozes: t.includes("dozes"), busy: t.includes("busy"), headphones: t.includes("headphones") },
          routine: routineObject(x.routine), house: h.key, key: x.key, start: x.start, notes: `Lives at ${h.name}.` },
        flags: { [FLAG]: { house: h.key, resident: x.key } }
      });
    }
    for (const p of h.pets) {
      docs.push({
        key: `${h.key}-${p.key}`, name: names.get(p.name) > 1 ? `${p.name} (${SHORT[h.key]})` : p.name, type: "pet", img: PET_IMG[p.kind] ?? "icons/svg/pawprint.svg",
        system: { kind: p.kind, rating: p.rating ?? 0, soft: !!p.soft, asleep: !!p.asleep, routine: routineObject(p.routine), roam: (p.roam ?? []).join(", "),
          house: h.key, key: p.key, start: p.start, notes: `Lives at ${h.name}.` },
        flags: { [FLAG]: { house: h.key, resident: p.key } }
      });
    }
  }
  return docs;
}

/** Every pack's source documents: { packFolder: [doc] }. */
export function packSources() {
  return { houses: houseDocs(), gang: gangDocs(), residents: residentDocs() };
}

/** Write packs/_source/<pack>/<key>.json (old files in those folders are removed). */
export function writeSources() {
  const all = packSources();
  for (const [pack, docs] of Object.entries(all)) {
    const dir = join(SRC, pack);
    if (existsSync(dir)) for (const f of readdirSync(dir)) if (f.endsWith(".json")) rmSync(join(dir, f));
    mkdirSync(dir, { recursive: true });
    for (const d of docs) writeFileSync(join(dir, `${d.key}.json`), JSON.stringify(d, null, 2) + "\n");
  }
  return Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.length]));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const n = writeSources();
  console.log(`Wrote pack sources: ${Object.entries(n).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
}
