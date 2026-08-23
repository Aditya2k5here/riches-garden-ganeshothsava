/**
 * Prepares the supplied committee logo for the web.
 *
 *   node scripts/prepare-logo.mjs
 *
 * 1. Knocks the flat white field out so the mark can sit on cream, on paper
 *    and on maroon without a white plate behind it. The artwork itself is
 *    untouched — pixels only become transparent where all three channels are
 *    already near-white, with a narrow feathered band so antialiased edges
 *    stay smooth.
 * 2. Emits a reversed (cream) tint of the same shapes for dark surfaces.
 *    This is a single-colour version of the existing mark, not a redesign;
 *    delete it and `brand.logoReversed` if the committee prefers the
 *    full-colour lockup everywhere.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "References/Committee logo.png";
const OUT_DIR = "public/brand";
const DELIVERY_WIDTH = 900;

/** Fully transparent at or above this in every channel. */
const CLEAR = 250;
/** Fully opaque at or below this. Between the two, alpha ramps. */
const KEEP = 226;

const CREAM = [0xf1, 0xe6, 0xd0];

await mkdir(OUT_DIR, { recursive: true });

// --- 1. white -> alpha ------------------------------------------------------

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  // Only background if every channel is near-white.
  const v = Math.min(r, g, b);
  if (v <= KEEP) continue;

  const alpha = v >= CLEAR ? 0 : Math.round(((CLEAR - v) / (CLEAR - KEEP)) * 255);

  if (alpha === 0) {
    data[i + 3] = 0;
    continue;
  }

  // Un-premultiply against white so feathered edges keep no white halo.
  const lift = 255 - alpha;
  const un = (c) =>
    Math.max(0, Math.min(255, Math.round(((c - lift) * 255) / alpha)));
  data[i] = un(r);
  data[i + 1] = un(g);
  data[i + 2] = un(b);
  data[i + 3] = alpha;
}

// --- 2. trim + resize once, then reuse the same pixels for both variants ----

const colour = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .trim({ threshold: 1 })
  .resize({ width: DELIVERY_WIDTH, withoutEnlargement: true })
  .raw()
  .toBuffer({ resolveWithObject: true });

const raw = { width: colour.info.width, height: colour.info.height, channels: 4 };

const written = await sharp(colour.data, { raw })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT_DIR}/riches-garden-logo.png`);

console.log(
  `logo          ${written.width}x${written.height}  ${Math.round(written.size / 1024)}kb`,
);

// --- 3. reversed: same alpha, flat cream ------------------------------------

const reversed = Buffer.from(colour.data);
for (let i = 0; i < reversed.length; i += 4) {
  reversed[i] = CREAM[0];
  reversed[i + 1] = CREAM[1];
  reversed[i + 2] = CREAM[2];
}

const rev = await sharp(reversed, { raw })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT_DIR}/riches-garden-logo-reversed.png`);

console.log(
  `logo-reversed ${rev.width}x${rev.height}  ${Math.round(rev.size / 1024)}kb`,
);

// --- 4. emblem only ---------------------------------------------------------
/**
 * The circular tree-and-home device on its own, for places where the full
 * lockup would render its wordmark at an illegible size — the navigation bar
 * and the favicon. This is a crop of the supplied artwork, not a new mark;
 * the full lockup is still what appears in the hero and the footer.
 */
const EMBLEM = { left: 157, top: 0, width: 561, height: 536 };

for (const [name, pixels] of [
  ["riches-garden-emblem.png", colour.data],
  ["riches-garden-emblem-reversed.png", reversed],
]) {
  const out = await sharp(pixels, { raw })
    .extract(EMBLEM)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT_DIR}/${name}`);
  console.log(
    `${name.padEnd(34)}${out.width}x${out.height}  ${Math.round(out.size / 1024)}kb`,
  );
}
