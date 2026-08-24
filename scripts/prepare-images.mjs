/**
 * Prepares the committee's photographs for the web.
 *
 *   node scripts/prepare-images.mjs
 *
 * Journey photographs arrive at three different aspect ratios (16:9, 2:1,
 * 4:3). The timeline needs one consistent treatment for every year, so all of
 * them are cropped to 4:3 — the ratio closest to most of the originals, so
 * the least is thrown away. Cropping is attention-weighted, which keeps the
 * idol in frame rather than centring on empty pandal.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const JOURNEY_OUT = "public/images/journey";
const WIDTH = 1400;
const RATIO = 4 / 3;

/**
 * Source file per year. Add a line when a new year's photograph arrives.
 *
 * `focusX` overrides the automatic crop, as a fraction across the original.
 * Attention-based cropping picks the highest-contrast region, which is
 * usually the idol — but in 2020 the brightest thing in frame is a lens
 * flare, so the algorithm centred on that and pushed the Ganesha off to one
 * side. Anywhere the automatic result is wrong, name the centre by hand.
 */
const JOURNEY = {
  2018: { src: "References/2018.jpeg" },
  2019: { src: "References/2019.jpeg" },
  2020: { src: "References/2020.jpeg", focusX: 0.46 },
  2021: { src: "References/2021.jpeg" },
  2023: { src: "References/2023.jpeg" },
  2024: { src: "References/2024.jpeg" },
  2025: { src: "References/2025 img journey.jpeg" },
};

await mkdir(JOURNEY_OUT, { recursive: true });

const HEIGHT = Math.round(WIDTH / RATIO);

for (const [year, entry] of Object.entries(JOURNEY)) {
  const out = `${JOURNEY_OUT}/${year}.jpg`;
  let pipeline = sharp(entry.src).rotate();

  if (entry.focusX !== undefined) {
    // Cut the 4:3 window by hand around the named centre, then scale it.
    const meta = await pipeline.metadata();
    const cropWidth = Math.min(meta.width, Math.round(meta.height * RATIO));
    const cropHeight = Math.round(cropWidth / RATIO);
    const left = Math.max(
      0,
      Math.min(
        meta.width - cropWidth,
        Math.round(meta.width * entry.focusX - cropWidth / 2),
      ),
    );
    const top = Math.max(0, Math.round((meta.height - cropHeight) / 2));
    pipeline = pipeline.extract({ left, top, width: cropWidth, height: cropHeight });
  }

  const info = await pipeline
    .resize({
      width: WIDTH,
      height: HEIGHT,
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);

  console.log(
    `${out.padEnd(34)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB`,
  );
}
