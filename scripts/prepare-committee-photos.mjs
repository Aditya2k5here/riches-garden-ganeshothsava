/**
 * Squares and sizes the committee portraits pulled out of the brochure.
 *
 *   python scripts/extract-committee-photos.py
 *   node scripts/prepare-committee-photos.mjs
 *
 * The originals are passport photographs printed small: the largest is
 * 160px on its long edge, the smallest 68px. Nothing here can invent detail
 * that was never in the PDF, so the job is to lose as little as possible —
 * crop square on the face, upscale once with a good kernel, and sharpen just
 * enough to undo the softening that upscaling causes.
 *
 * 512px square is deliberately modest. The grid shows them at about 170 CSS
 * px, so 512 covers a 3x phone; going larger would only be stretching an
 * already-small original further.
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = ".cache/committee-raw";
const OUT = "public/images/committee";
const SIZE = 512;

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

  const out = path.join(OUT, `${name}.jpg`);
  const info = await sharp(input)
    .resize(SIZE, SIZE, {
      fit: "cover",
      // Faces, not centres: several of these are cropped off-centre in the
      // brochure and a plain centre crop clips foreheads and chins.
      position: sharp.strategy.attention,
      kernel: "lanczos3",
    })
    // Modest unsharp mask. Upscaling a 100px original softens it; this puts
    // back an edge without the halo that heavier sharpening leaves.
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.2 })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);

  console.log(
    `${name.padEnd(20)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB`,
  );
}

console.log(
  `\n${files.length} portraits. Smallest original edge: ${smallest}px — ` +
    `these are brochure-print scans, so they stay soft at large sizes.`,
);
