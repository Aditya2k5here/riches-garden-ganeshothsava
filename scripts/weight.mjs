/**
 * Compressed weight of the built client assets — what visitors actually pay
 * for over the wire, rather than the decoded sizes a devtools panel shows.
 *
 *   npm run build && node scripts/weight.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { brotliCompressSync } from "node:zlib";

const rows = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (p.endsWith(".js") || p.endsWith(".css")) {
      const buf = readFileSync(p);
      rows.push({
        name: p.split(/[\/]/).slice(-2).join("/"),
        raw: buf.length,
        br: brotliCompressSync(buf).length,
      });
    }
  }
};
walk(".next/static");

rows.sort((a, b) => b.br - a.br);
const kb = (n) => `${Math.round(n / 1024)} kB`;

for (const r of rows.slice(0, 12)) {
  console.log(`${kb(r.br).padStart(8)} br  ${kb(r.raw).padStart(8)} raw   ${r.name}`);
}
const raw = rows.reduce((n, r) => n + r.raw, 0);
const br = rows.reduce((n, r) => n + r.br, 0);
console.log("-".repeat(58));
console.log(`${kb(br).padStart(8)} br  ${kb(raw).padStart(8)} raw   ${rows.length} files total`);
