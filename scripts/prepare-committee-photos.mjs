/**
 * Trims and sizes the committee portraits pulled out of the invitation.
 *
 *   python scripts/extract-committee-photos.py
 *   node scripts/prepare-committee-photos.mjs
 *
 * The 2026 invitation carries proper studio headshots at 594x693 — a real
 * change from the 2025 brochure, whose portraits were 68 to 160px scans that
 * had to be blown up nearly twice over to fill the grid. Nothing here needs
 * to invent detail any more; the job is to take away the print furniture and
 * hand the site the photograph.
 *
 * TWO THINGS THE SOURCE DOES
 * --------------------------
 * 1. The maroon picture frame is part of the image, not drawn over it — a
 *    13px band on all four edges. The website frames nothing, so left in it
 *    would read as a dark line boxing every face. It is measured rather than
 *    assumed, so a re-export at another size still trims correctly, and one
 *    portrait (Phani Kumar, placed unframed at 1055x1008) correctly trims
 *    nothing.
 *
 * 2. They are kept at 4:5. The trimmed originals are 568x667 — near enough
 *    already that the crop only shaves the sides. Squaring them, which is
 *    what this script used to do, meant cutting a fifth of the height out of
 *    a head-and-shoulders portrait, and it came off the top.
 *
 * Crop position is fixed rather than automatic, because automatic is what
 * made the faces sit at different heights:
 *   taller than 4:5  -> trim from the bottom, keeping the head and its
 *                       headroom and losing chest
 *   wider than 4:5   -> trim the sides evenly; these are centred already
 *
 * 512x640 is chosen so nothing is ever enlarged: the widest 4:5 region
 * available inside a trimmed original is 534x667, so every output is a
 * slight reduction. The grid shows them at about 205 CSS px on a desktop,
 * so this still covers a 2x screen with room to spare.
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = ".cache/committee-raw";
const OUT = "public/images/committee";
const WIDTH = 512;
const HEIGHT = 640;
const TARGET = WIDTH / HEIGHT;

/** The frame's maroon, loosely bounded so JPEG ringing still counts. */
const isFrame = (r, g, b) => r > 85 && r < 165 && g < 60 && b < 70;

/** How much of an edge must be frame-coloured before it is called a frame. */
const COVERAGE = 0.9;

if (!existsSync(SRC)) {
  console.error(`No extracts in ${SRC} — run the Python extractor first.`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

/** Measures the frame inwards from each edge. */
async function measureFrame(file) {
  const { data, info } = await sharp(file)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const at = (x, y) => {
    const i = (y * width + x) * channels;
    return isFrame(data[i], data[i + 1], data[i + 2]);
  };

  const row = (y) => {
    let n = 0;
    for (let x = 0; x < width; x++) if (at(x, y)) n++;
    return n / width;
  };
  const col = (x) => {
    let n = 0;
    for (let y = 0; y < height; y++) if (at(x, y)) n++;
    return n / height;
  };

  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  while (top < height / 4 && row(top) > COVERAGE) top++;
  while (bottom < height / 4 && row(height - 1 - bottom) > COVERAGE) bottom++;
  while (left < width / 4 && col(left) > COVERAGE) left++;
  while (right < width / 4 && col(width - 1 - right) > COVERAGE) right++;

  return { width, height, top, bottom, left, right };
}

const files = (await readdir(SRC)).sort();
let smallest = Infinity;

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(SRC, file);
  const frame = await measureFrame(input);

  const inner = {
    left: frame.left,
    top: frame.top,
    width: frame.width - frame.left - frame.right,
    height: frame.height - frame.top - frame.bottom,
  };
  smallest = Math.min(smallest, inner.width, inner.height);

  const aspect = inner.width / inner.height;
  // Taller than the frame means the trim comes out of the height, and it
  // should come off the bottom so the head survives.
  const position = aspect < TARGET ? "top" : "centre";

  const out = path.join(OUT, `${name}.jpg`);
  const info = await sharp(input)
    .extract(inner)
    .resize(WIDTH, HEIGHT, { fit: "cover", position, kernel: "lanczos3" })
    // Light: these are being reduced, not enlarged, so this is only putting
    // back the edge that resampling costs.
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.9 })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);

  const trimmed = frame.top || frame.bottom || frame.left || frame.right;
  console.log(
    `${name.padEnd(20)} ${frame.width}x${frame.height}  ` +
      `${trimmed ? `frame ${frame.top}px -> ` : "unframed  "}` +
      `${inner.width}x${inner.height}  aspect ${aspect.toFixed(2)}  ` +
      `crop ${position.padEnd(6)} -> ${info.width}x${info.height}  ` +
      `${Math.round(info.size / 1024)} kB`,
  );
}

console.log(
  `\n${files.length} portraits. Smallest trimmed edge: ${smallest}px — ` +
    `every output is a reduction, so none of them is being enlarged.`,
);
