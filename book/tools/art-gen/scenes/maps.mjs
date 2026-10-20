// Floor plans for the five ready-to-run houses, drawn from the same data the
// simulator plays (sim/houses.mjs), so a map can never disagree with its house
// (LESSONS: check the scenario text against its map).
//   node book/tools/art-gen/scenes/build.mjs map-number-12 …
import { C, svg, n } from "./lib.mjs";
import { HOUSES } from "../../../../sim/houses.mjs";

const U = 72;          // one grid square
const PAD = 54;        // around each floor
const GAP = 46;        // between floors
const SIZE_WORD = { tight: "Tight", normal: "Normal", big: "Big" };
const APPROACH = { sneaky: "Sneaky", sweet: "Sweet", savage: "Savage", streetwise: "Streetwise" };
const DIFF = ["", "Tricky", "Hard"];

/** "Sneaky or Savage, Tricky" from [[approach, diff, …tags], …] */
export function optText(opts) {
  if (!opts || !opts.length) return "no roll";
  const byDiff = {};
  for (const [a, d] of opts) (byDiff[d] ??= []).push(APPROACH[a]);
  return Object.entries(byDiff).map(([d, as]) => `${as.join(" or ")}${DIFF[d] ? ", " + DIFF[d] : ""}`).join("; or ");
}

function sharedWall(a, b) {
  // a, b: [x, y, w, h] in squares → the shared wall segment, or null
  const [ax, ay, aw, ah] = a, [bx, by, bw, bh] = b;
  if (ax + aw === bx || bx + bw === ax) {
    const x = ax + aw === bx ? bx : ax;
    const y0 = Math.max(ay, by), y1 = Math.min(ay + ah, by + bh);
    if (y1 > y0) return { vertical: true, x, y0, y1 };
  }
  if (ay + ah === by || by + bh === ay) {
    const y = ay + ah === by ? by : ay;
    const x0 = Math.max(ax, bx), x1 = Math.min(ax + aw, bx + bw);
    if (x1 > x0) return { vertical: false, y, x0, x1 };
  }
  return null;
}

function houseMap(h) {
  const floors = h.map.floors;
  const floorOf = {};
  floors.forEach((f, i) => { for (const k of Object.keys(f.rooms)) floorOf[k] = i; });
  // floor panels side by side
  let ox = 0;
  const panels = floors.map(f => {
    const w = Math.max(...Object.values(f.rooms).map(r => r[0] + r[2]));
    const hh = Math.max(...Object.values(f.rooms).map(r => r[1] + r[3]));
    const p = { f, x: ox + PAD, y: PAD + 52, w: w * U, h: hh * U };
    ox += w * U + PAD + GAP;
    return p;
  });
  const planW = ox - GAP + PAD;
  const side = planW <= 700;              // a one-floor house: the legend goes beside the plan
  const W = side ? planW + 440 : Math.max(planW, 960);
  const wrap = (t, max) => {
    const out = []; let cur = [];
    for (const w of t.split(" ")) {
      const len = cur.join(" ").length + (out.length ? 3 : 0);
      if (cur.length && len + 1 + w.length > max) { out.push((out.length ? "   " : "") + cur.join(" ")); cur = []; }
      cur.push(w);
    }
    if (cur.length) out.push((out.length ? "   " : "") + cur.join(" "));
    return out;
  };
  const LX = side ? planW + 10 : PAD;
  const maxChars = Math.floor((W - LX - PAD) / 8.4);
  const legendLines = h.entrances.reduce((a, e) => a + 2, 0) + 4;
  const H = Math.max(...panels.map(p => p.h)) + PAD * 2 + 52 + 30 + legendLines * 26;
  const R = (k) => { const fi = floorOf[k]; const p = panels[fi]; const r = p.f.rooms[k]; return { p, x: p.x + r[0] * U, y: p.y + r[1] * U, w: r[2] * U, h: r[3] * U, r }; };

  let b = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  // floors: grid, rooms, labels
  for (const p of panels) {
    b += `<text x="${p.x}" y="${p.y - 48}" font-family="sans-serif" font-weight="700" font-size="20" letter-spacing="2" fill="${C.accentDeep}">${p.f.name.toUpperCase()}</text>`;
    for (const [k, r] of Object.entries(p.f.rooms)) {
      const x = p.x + r[0] * U, y = p.y + r[1] * U, w = r[2] * U, hh = r[3] * U;
      b += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${k === h.den ? C.paper2 : C.light}"/>`;
      let grid = "";
      for (let gx = 1; gx < r[2]; gx++) grid += `M${x + gx * U} ${y}V${y + hh}`;
      for (let gy = 1; gy < r[3]; gy++) grid += `M${x} ${y + gy * U}H${x + w}`;
      if (grid) b += `<path d="${grid}" stroke="${C.edge}" stroke-width="1.2"/>`;
    }
  }
  // walls (each room outlined; shared walls drawn twice, same place)
  for (const p of panels) for (const r of Object.values(p.f.rooms))
    b += `<rect x="${p.x + r[0] * U}" y="${p.y + r[1] * U}" width="${r[2] * U}" height="${r[3] * U}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="square"/>`;
  // ways: door gaps on shared walls; stairs between floors
  const stairs = [];
  for (const [a, bb, size, opts] of h.ways) {
    if (floorOf[a] !== floorOf[bb]) { stairs.push([a, bb]); continue; }
    const ra = R(a), rb = R(bb);
    const sw = sharedWall(ra.r, rb.r);
    if (!sw) throw new Error(`${h.key}: ${a} and ${bb} share no wall`);
    const gap = size === "big" ? 0.8 : 0.6;
    const p = ra.p;
    if (sw.vertical) {
      const x = p.x + sw.x * U, ym = p.y + ((sw.y0 + sw.y1) / 2) * U;
      b += `<path d="M${x} ${ym - gap * U / 2}V${ym + gap * U / 2}" stroke="${C.light}" stroke-width="9"/>`;
      if (opts) b += `<path d="M${x} ${ym - gap * U / 2}l${gap * U * 0.9} 0" stroke="${C.ink}" stroke-width="3"/>` +
        `<path d="M${x + gap * U * 0.9} ${ym - gap * U / 2}A${gap * U * 0.9} ${gap * U * 0.9} 0 0 1 ${x} ${ym + gap * U * 0.4}" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
    } else {
      const y = p.y + sw.y * U, xm = p.x + ((sw.x0 + sw.x1) / 2) * U;
      b += `<path d="M${xm - gap * U / 2} ${y}H${xm + gap * U / 2}" stroke="${C.light}" stroke-width="9"/>`;
      if (opts) b += `<path d="M${xm - gap * U / 2} ${y}l0 ${-gap * U * 0.9}" stroke="${C.ink}" stroke-width="3"/>` +
        `<path d="M${xm - gap * U / 2} ${y - gap * U * 0.9}A${gap * U * 0.9} ${gap * U * 0.9} 0 0 1 ${xm + gap * U * 0.4} ${y}" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
    }
  }
  // stairs icons in both rooms, with the label inside the room
  const stairIcon = (x, y, l1, l2) => {
    let s = `<rect x="${x - 24}" y="${y - 18}" width="48" height="36" fill="${C.paper2}" stroke="${C.ink}" stroke-width="2"/>`;
    for (let i = 1; i < 5; i++) s += `<path d="M${x - 24 + i * 9.6} ${y - 18}V${y + 18}" stroke="${C.ink}" stroke-width="1.5"/>`;
    s += `<text x="${x}" y="${y + 34}" text-anchor="middle" font-family="sans-serif" font-size="13" fill="${C.ink}">${l1}</text>`;
    return s + `<text x="${x}" y="${y + 50}" text-anchor="middle" font-family="sans-serif" font-size="13" fill="${C.ink}">${l2}</text>`;
  };
  for (const [a, bb] of stairs) {
    const way = h.ways.find(w => (w[0] === a && w[1] === bb) || (w[0] === bb && w[1] === a));
    for (const [k, other] of [[a, bb], [bb, a]]) {
      const r = R(k);
      const otherName = panels[floorOf[other]].f.name.toLowerCase();
      const thisName = panels[floorOf[k]].f.name.toLowerCase();
      const up = otherName === "upstairs" || (thisName === "cellar");
      b += stairIcon(r.x + r.w - 46, r.y + 30, `stairs ${up ? "up" : "down"}`, `to ${h.rooms[other].name}${way[3] ? " (door)" : ""}`);
    }
  }
  // room names, den
  for (const [k, room] of Object.entries(h.rooms)) {
    const r = R(k);
    b += `<text x="${r.x + r.w / 2}" y="${r.y + r.h * 0.6 + 6}" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="${r.w < 2.1 * U ? 17 : 21}" fill="${C.ink}">${room.name}</text>`;
    if (k === h.den) b += `<text x="${r.x + r.w / 2}" y="${r.y + r.h * 0.6 + 30}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" letter-spacing="2" fill="${C.cuddle}">THE DEN</text>`;
  }
  // prize: where it's put down, and later moves
  h.prize.script.forEach((sc, i) => {
    const r = R(sc.room);
    const px = r.x + 30 + i * 4, py = r.y + r.h - 30 - i * 30;
    b += `<path d="M${px} ${py - 13} l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1 Z" fill="${C.accent}" stroke="${C.ink}" stroke-width="2"/>`;
    b += `<text x="${px + 18}" y="${py + 5}" font-family="sans-serif" font-size="14" font-weight="700" fill="${C.ink}">prize, round ${sc.round}</text>`;
  });
  // entrances: numbered markers outside the wall
  const marks = [];
  h.entrances.forEach((e, i) => {
    const r = R(e.room);
    const side = h.map.entrances[e.key];
    let mx, my, wx0, wy0, wx1, wy1;
    const off = 26;
    if (side === "top") { mx = r.x + r.w * 0.36; my = r.y - off; wx0 = mx - 16; wx1 = mx + 16; wy0 = wy1 = r.y; }
    if (side === "bottom") { mx = r.x + r.w * 0.5; my = r.y + r.h + off; wx0 = mx - 22; wx1 = mx + 22; wy0 = wy1 = r.y + r.h; }
    if (side === "left") { mx = r.x - off; my = r.y + r.h * 0.5; wy0 = my - 16; wy1 = my + 16; wx0 = wx1 = r.x; }
    if (side === "right") { mx = r.x + r.w + off; my = r.y + r.h * 0.5; wy0 = my - 22; wy1 = my + 22; wx0 = wx1 = r.x + r.w; }
    if (side === "roof") { mx = r.x + r.w * 0.5; my = r.y + r.h - 34; }
    if (side === "roof") b += `<rect x="${mx - 22}" y="${my - 22}" width="44" height="44" fill="none" stroke="${C.accentDeep}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
    else b += `<path d="M${wx0} ${wy0}L${wx1} ${wy1}" stroke="${C.accent}" stroke-width="9"/>`;
    b += `<circle cx="${mx}" cy="${my}" r="15" fill="${C.accent}" stroke="${C.ink}" stroke-width="2.4"/>`;
    b += `<text x="${mx}" y="${my + 6}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="17" fill="${C.ink}">${i + 1}</text>`;
    const when = e.rounds ? ` (round${e.rounds.length > 1 ? "s" : ""} ${e.rounds.join("–")} only${e.one ? ", one cat" : ""})` : "";
    const extras = [e.climb ? "a climb" : null, e.noisy ? "makes noise" : null, e.jam ? "stays open once jammed" : null].filter(Boolean).join(", ");
    marks.push(`${i + 1}. ${e.name} — ${SIZE_WORD[e.size]}; ${optText(e.opts)}${extras ? "; " + extras : ""}${when}`);
  });
  // legend
  let ly = side ? panels[0].y + 6 : Math.max(...panels.map(p => p.y + p.h)) + 56;
  b += `<text x="${LX}" y="${ly}" font-family="sans-serif" font-weight="800" font-size="16" letter-spacing="2" fill="${C.accentDeep}">WAYS IN</text>`;
  for (const m of marks) for (const ln of wrap(m, maxChars)) { ly += 24; b += `<text x="${LX}" y="${ly}" font-family="sans-serif" font-size="16" fill="${C.ink}" xml:space="preserve">${ln.replace(/&/g, "&amp;")}</text>`; }
  ly += 10;
  for (const ln of wrap(`Doors drawn with a swing are closed (${optText([["streetwise", 1], ["savage", 2]])} to open, unless the house says otherwise). One square is about two cat lengths.`, Math.floor(maxChars * 1.12))) {
 ly += 20; b += `<text x="${LX}" y="${ly}" font-family="sans-serif" font-size="14" fill="${C.inkSoft}">${ln.trim()}</text>`;
  }
  const HH = side ? Math.max(panels[0].y + panels[0].h + PAD, ly + 24) : Math.max(H, ly + 24);
  return svg(`0 0 ${W} ${HH}`, `Floor plan: ${h.name}`, b).replace(`<rect width="${W}" height="${H}"`, `<rect width="${W}" height="${HH}"`);
}

export const map_number_12 = () => houseMap(HOUSES.find(h => h.key === "number-12"));
export const map_okafor_box = () => houseMap(HOUSES.find(h => h.key === "okafor-box"));
export const map_wendell_mouse = () => houseMap(HOUSES.find(h => h.key === "wendell-mouse"));
export const map_birthday_cake = () => houseMap(HOUSES.find(h => h.key === "birthday-cake"));
export const map_marchetti_salmon = () => houseMap(HOUSES.find(h => h.key === "marchetti-salmon"));
