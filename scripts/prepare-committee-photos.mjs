/**
 * Squares and sizes the committee portraits pulled out of the brochure.
 *
 *   python scripts/extract-committee-photos.py
 *   node scripts/prepare-committee-photos.mjs
 *
 * The originals are passport photographs printed small: the largest is
 * 160px on its long edge, the smallest 68px. Nothing here can invent detail
 * that was never in the PDF, so the job is to lose as little as possible.
 *
 * They are kept at 4:5, which is what they very nearly are already — most
 * sit between 0.80 and 0.83 — so almost nothing is thrown away. Squaring
 * them was the mistake: it meant cutting a fifth of the height out of a
 * head-and-shoulders portrait, and a saliency crop takes that off the top,
 * which clipped the top of every head and left the faces filling the frame
 * with no air around them.
 *
 * Crop position is fixed rather than automatic, because automatic is what
 * made the faces sit at different heights:
 *   taller than 4:5  -> crop from the bottom, keeping the head and its
 *                       headroom and trimming chest
 *   wider than 4:5   -> crop the sides evenly; these are centred already
 *
 * 480x600 is deliberately modest. The grid shows them at about 170 CSS px
 * wide, so this covers a 3x phone; larger would only stretch a small
 * original further.
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = ".cache/committee-raw";
const OUT = "public/images/committee";
const WIDTH = 480;
const HEIGHT = 600;
const TARGET = WIDTH / HEIGHT;

if (!existsSync(SRC)) {
  console.error(`No extracts in ${SRC} — run the Python extractor first.`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).sort();
let smallest = Infinity;

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  smallest = Math.min(smallest, meta.width, meta.height);

  const aspect = meta.width / meta.height;
  // Taller than the frame means the trim comes out of the height, and it
  // should come off the bottom so the head survives.
  const position = aspect < TARGET ? "top" : "centre";

  const out = path.join(OUT, `${name}.jpg`);
  const info = await sharp(input)
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position,
      kernel: "lanczos3",
    })
    // Modest unsharp mask. Upscaling a 100px original softens it; this puts
    // back an edge without the halo that heavier sharpening leaves.
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.2 })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);

  console.log(
    `${name.padEnd(20)} ${meta.width}x${meta.height}  aspect ${aspect.toFixed(2)}  ` +
      `crop ${position.padEnd(6)} -> ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB`,
  );
}

console.log(
  `\n${files.length} portraits. Smallest original edge: ${smallest}px — ` +
    `these are brochure-print scans, so they stay soft at large sizes.`,
);
