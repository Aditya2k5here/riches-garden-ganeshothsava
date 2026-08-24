/**
 * Writes a restorable backup of the project into backups/.
 *
 *   npm run backup
 *
 * Two formats, on purpose:
 *   • a git bundle — the entire repository including history, restorable
 *     with `git clone <file>`, which is the real backup;
 *   • a zip of the working tree — openable by anyone with no tools, which is
 *     the backup that still works when nobody remembers what git is.
 *
 * Neither counts as a backup until it is copied off this machine.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "backups";
const stamp = new Date().toISOString().slice(0, 10);
const base = `riches-garden-${stamp}`;

mkdirSync(OUT, { recursive: true });

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] })
    .toString()
    .trim();

// --- 1. git bundle: everything, with history --------------------------------
const bundle = join(OUT, `${base}.bundle`);
run("git", ["bundle", "create", bundle, "--all"]);
run("git", ["bundle", "verify", bundle]);

// --- 2. zip: the working tree, minus everything regenerable -----------------
const zip = join(OUT, `${base}.zip`);

// Compress-Archive chokes on long exclude lists, so drive 7-Zip if it is
// present and fall back to PowerShell's own archiver otherwise.
try {
  run("powershell", [
    "-NoProfile",
    "-Command",
    `$ErrorActionPreference='Stop';` +
      `$items = Get-ChildItem -Path . -Force | Where-Object { $_.Name -notin @('node_modules','.next','.git','.cache','backups') };` +
      `Compress-Archive -Path $items.FullName -DestinationPath '${zip}' -Force`,
  ]);
} catch (error) {
  console.error("zip step failed:", error.message);
  process.exitCode = 1;
}

const kb = (p) => `${(statSync(p).size / 1024 / 1024).toFixed(1)} MB`;

console.log(`${bundle}  ${kb(bundle)}  (git clone this file to restore)`);
console.log(`${zip}  ${kb(zip)}`);
console.log(
  `\nbackups/ holds ${readdirSync(OUT).length} file(s). Copy them somewhere` +
    ` that is not this machine.`,
);
