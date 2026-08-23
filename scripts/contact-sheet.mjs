/**
 * Lays a full-page screenshot out as vertical strips side by side, so the
 * whole scroll can be judged for rhythm in one look.
 *   node scripts/contact-sheet.mjs desktop-full 4
 */
import sharp from "sharp";

const name = process.argv[2] ?? "desktop-full";
const cols = Number(process.argv[3] ?? 4);
const SRC = `scripts/.shots/${name}.png`;
const OUT = `scripts/.shots/${name}-sheet.png`;
const STRIP_W = 300;
const GAP = 14;

const img = sharp(SRC);
const { width, height } = await img.metadata();

const scale = STRIP_W / width;
const scaledH = Math.round(height * scale);
const sliceH = Math.ceil(scaledH / cols);

const scaled = await img.resize({ width: STRIP_W }).png().toBuffer();

const composites = [];
for (let i = 0; i < cols; i++) {
  const top = i * sliceH;
  const h = Math.min(sliceH, scaledH - top);
  if (h <= 0) break;
  const piece = await sharp(scaled)
    .extract({ left: 0, top, width: STRIP_W, height: h })
    .png()
    .toBuffer();
  composites.push({ input: piece, left: i * (STRIP_W + GAP), top: 0 });
}

await sharp({
  create: {
    width: cols * STRIP_W + (cols - 1) * GAP,
    height: sliceH,
    channels: 3,
    background: { r: 40, g: 40, b: 40 },
  },
})
  .composite(composites)
  .png()
  .toFile(OUT);

console.log(OUT, `${cols * STRIP_W + (cols - 1) * GAP}x${sliceH}`);
