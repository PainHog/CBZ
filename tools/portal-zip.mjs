/**
 * Build the portal copy of the Foundry system: downloads/Cat_Burglars_Foundry_v<version>.zip.
 * Run by hand only (npm run build:portal-zip), never from check, CI or a hook:
 * every changed zip is a new file Richard has to check before sharing it.
 *
 *   - Newest vX.Y.Z release tag if there is one, else a test build of HEAD
 *     (refused while the shipped paths have uncommitted changes).
 *   - Files come from a temporary git worktree of that commit, never from the
 *     working folder, so untracked and ignored files can't get in.
 *   - system.json is cleaned of repo links; the repo's own copy is untouched.
 *   - The zip is reproducible: fixed mtimes, modes, byte-sorted list, TZ=UTC, zip -X.
 */
import { execFileSync } from "node:child_process";
import {
  chmodSync, copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  rmSync, statSync, utimesSync, writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const SYSTEM_ID = "cat-burglars";
const SHIPPED = ["system.json", "LICENSE", "module", "styles", "templates", "lang", "assets", "packs"];
const SITE = "https://domoorestudio.com/";
const MAX_BYTES = 25 * 1024 * 1024;

function git(args, opts = {}) {
  return (execFileSync("git", args, { cwd: ROOT, encoding: "utf8", ...opts }) ?? "").trim();
}
class BuildError extends Error {}
function fail(msg) {
  throw new BuildError(msg);
}
process.on("uncaughtException", (err) => {
  console.error(`portal-zip: ${err instanceof BuildError ? err.message : err.stack}`);
  process.exit(1);
});

// ---- 1. Pick what to build ----
function newestRelease() {
  const out = git(["ls-remote", "--tags", "origin"]);
  const tags = new Map(); // tag -> commit (peeled ^{} entries win for annotated tags)
  for (const line of out.split("\n").filter(Boolean)) {
    const [sha, ref] = line.split("\t");
    const m = /^refs\/tags\/(v(\d+)\.(\d+)\.(\d+))(\^\{\})?$/.exec(ref);
    if (!m) continue;
    if (m[5] || !tags.has(m[1])) tags.set(m[1], { sha, parts: [+m[2], +m[3], +m[4]] });
  }
  const sorted = [...tags.entries()].sort(([, a], [, b]) =>
    a.parts[0] - b.parts[0] || a.parts[1] - b.parts[1] || a.parts[2] - b.parts[2]);
  if (!sorted.length) return null;
  const [tag, { sha }] = sorted.at(-1);
  return { tag, sha };
}

const release = newestRelease();
let commit;
if (release) {
  try {
    git(["cat-file", "-e", `${release.sha}^{commit}`], { stdio: "ignore" });
  } catch {
    git(["fetch", "--depth", "1", "origin", "tag", release.tag]);
  }
  commit = release.sha;
} else {
  const dirty = git(["status", "--porcelain", "--", ...SHIPPED]);
  if (dirty) fail(`uncommitted changes in shipped files; commit them first:\n${dirty}`);
  commit = git(["rev-parse", "HEAD"]);
}

// File dates: a release uses its own commit's date; a test build the newest
// commit that touched the shipped paths (which a shallow clone can get wrong).
let dateISO;
if (release) {
  dateISO = git(["log", "-1", "--format=%cI", commit]);
} else {
  const [hash, iso] = git(["log", "-1", "--format=%H %cI", commit, "--", ...SHIPPED]).split(" ");
  const shallowFile = resolve(ROOT, git(["rev-parse", "--git-path", "shallow"]));
  if (existsSync(shallowFile) && readFileSync(shallowFile, "utf8").split("\n").includes(hash)) {
    fail(`this clone is shallow and its history ends at ${hash.slice(0, 7)}; fetch more history first (git fetch --unshallow)`);
  }
  dateISO = iso;
}
const fileDate = new Date(dateISO);

const tmp = mkdtempSync(join(tmpdir(), "cb-portal-zip-"));
const tree = join(tmp, "tree");
const stage = join(tmp, "stage");
const top = join(stage, SYSTEM_ID);

try {
  git(["worktree", "add", "--detach", tree, commit], { stdio: "ignore" });

  // ---- 2. Copy only what Foundry needs ----
  const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: tree, encoding: "utf8" })
    .split("\0").filter(Boolean);
  const ships = (p) => {
    if (!SHIPPED.some((s) => p === s || p.startsWith(`${s}/`))) return false;
    if (p.startsWith("packs/_source/")) return false;
    if (/^packs\/[^/]+\/(LOCK|LOG|LOG\.old)$/.test(p)) return false;
    if (p.split("/").at(-1) === ".gitkeep") return false;
    return true;
  };
  const files = tracked.filter(ships);
  for (const p of files) {
    mkdirSync(dirname(join(top, p)), { recursive: true });
    cpSync(join(tree, p), join(top, p));
  }

  // ---- 3. Clean the staged system.json ----
  const sys = JSON.parse(readFileSync(join(top, "system.json"), "utf8"));
  const version = release ? release.tag.slice(1) : `${sys.version}-test`;
  sys.version = version;
  sys.url = SITE;
  for (const a of sys.authors ?? []) a.url = SITE;
  delete sys.manifest;
  delete sys.download;
  delete sys.bugs;
  writeFileSync(join(top, "system.json"), JSON.stringify(sys, null, 2) + "\n");
  try {
    git(["diff", "--quiet", "--", "system.json"]);
  } catch {
    fail("the repo's own system.json changed; it must never be touched");
  }

  // ---- 4. README, with credits from the rulebook's credits page ----
  const creditsHtml = readFileSync(join(tree, "book/src/chapters/01-credits.html"), "utf8");
  const plain = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const credits = [...creditsHtml.matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)]
    .map(([, dt, dd]) => `- ${plain(dt)}: ${plain(dd)}`);
  const copyright = /<p>(©[\s\S]*?)<\/p>/.exec(creditsHtml);
  if (!credits.length) fail("couldn't read the credits from the rulebook's credits page");
  writeFileSync(join(top, "README.md"), [
    `# ${sys.title} for Foundry VTT, version ${version}`,
    "",
    ...(release ? [] : ["This is a test build, not a release.", ""]),
    "## Install by hand",
    "",
    "1. Unzip this file into Foundry's `Data/systems` folder, so you get `Data/systems/cat-burglars/system.json`.",
    "2. Restart Foundry.",
    "3. Pick Cat Burglars when creating a world.",
    "",
    "## Credits",
    "",
    ...credits,
    ...(copyright ? ["", plain(copyright[1])] : []),
    ""
  ].join("\n"));

  // ---- 5. Zip it the same way on any machine ----
  const staged = [];
  (function walk(dir, rel) {
    chmodSync(dir, 0o755);
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(abs).isDirectory()) walk(abs, r);
      else { chmodSync(abs, 0o644); staged.push(r); }
    }
  })(stage, "");
  const walkDirs = (dir) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      if (statSync(abs).isDirectory()) { walkDirs(abs); utimesSync(abs, fileDate, fileDate); }
    }
  };
  for (const r of staged) utimesSync(join(stage, r), fileDate, fileDate);
  walkDirs(stage);
  staged.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const name = `Cat_Burglars_Foundry_v${version}.zip`;
  const tmpZip = join(tmp, name);
  execFileSync("zip", ["-X", "-q", "-@", tmpZip], {
    cwd: stage, input: staged.join("\n") + "\n", env: { ...process.env, TZ: "UTC" }
  });

  // ---- 7. Check the result ----
  const buf = readFileSync(tmpZip);
  if (buf.length > MAX_BYTES) fail(`${name} is ${buf.length} bytes, over 25 MiB`);
  if (!buf.subarray(0, 4).equals(Buffer.from("PK\x03\x04", "latin1"))) fail(`${name} doesn't start with the ZIP signature`);
  const eocd = buf.lastIndexOf(Buffer.from("PK\x05\x06", "latin1"));
  if (eocd < 0 || buf.readUInt16LE(eocd + 20) !== 0) fail(`${name} has a zip comment`);
  const listing = execFileSync("unzip", ["-l", tmpZip], { encoding: "utf8" });
  if (!listing.includes(`${SYSTEM_ID}/system.json`)) fail(`${name} has no ${SYSTEM_ID}/system.json`);

  // Text to screen: every staged text file outside packs/, plus the pack sources.
  const toScan = staged.filter((r) => !r.startsWith(`${SYSTEM_ID}/packs/`))
    .map((r) => ({ label: r, abs: join(stage, r), packs: false }))
    .concat(tracked.filter((p) => p.startsWith("packs/_source/"))
      .map((p) => ({ label: `(source) ${p}`, abs: join(tree, p), packs: true })));
  const banned = [
    /github|painhog|prodlog|spideyheist|dontgetforked/i,
    /(?<![a-z0-9])cbz(?![a-z0-9])/i,
    /[0-9a-f]{40}/i
  ];
  const problems = [];
  const warnings = [];
  for (const { label, abs, packs } of toScan) {
    const bytes = readFileSync(abs);
    if (bytes.includes(0)) continue; // binary
    const text = bytes.toString("utf8");
    for (const re of banned) {
      const m = re.exec(text);
      if (m) problems.push(`${label}: "${m[0]}"`);
    }
    if (!packs) {
      for (const [w] of text.matchAll(/(?<![A-Za-z0-9_])[0-9a-f]{7,39}(?![A-Za-z0-9_])/gi)) {
        if (/[a-f]/i.test(w) && /\d/.test(w)) warnings.push(`${label}: ${w}`);
      }
    }
  }
  if (problems.length) fail(`text that mustn't ship:\n  ${problems.join("\n  ")}`);
  for (const w of warnings) console.warn(`portal-zip: warning, hex-like word (look at it before committing): ${w}`);

  // ---- 6. Write downloads/, keeping only the current zip ----
  const outDir = join(ROOT, "downloads");
  mkdirSync(outDir, { recursive: true });
  for (const old of readdirSync(outDir)) {
    if (old.endsWith(".zip") && old !== name) rmSync(join(outDir, old));
  }
  copyFileSync(tmpZip, join(outDir, name));
  console.log(`portal-zip: wrote downloads/${name} (${buf.length} bytes, ${staged.length} files, ` +
    `version ${version}, ${release ? `release ${release.tag}` : "test build of HEAD"}, files dated ${dateISO})`);
} finally {
  try { git(["worktree", "remove", "--force", tree], { stdio: "ignore" }); } catch { /* best effort */ }
  rmSync(tmp, { recursive: true, force: true });
}
