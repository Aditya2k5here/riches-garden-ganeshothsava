import type { JourneyChapter } from "./types";

/**
 * THE JOURNEY
 *
 * Year and photograph. Nothing else — no captions, no invented history.
 *
 * Only the years the committee has photographs for appear here. 2022 is
 * absent because no photograph was supplied for it, not because nothing
 * happened; add the file and a line below and it slots in.
 *
 * Photographs are generated at one consistent 4:3 crop by
 * `npm run images`, so every year gets identical treatment.
 */
const photo = (year: number) => ({
  src: `/images/journey/${year}.jpg`,
  alt: `Riches Garden Ganeshothsava, ${year}`,
  width: 1400,
  height: 1050,
});

export const journey: JourneyChapter[] = [
  { year: 2018, image: photo(2018) },
  { year: 2019, image: photo(2019) },
  { year: 2020, image: photo(2020) },
  { year: 2021, image: photo(2021) },
  { year: 2023, image: photo(2023) },
  { year: 2024, image: photo(2024) },
  { year: 2025, image: photo(2025) },
  { year: 2026, current: true },
];

/**
 * The opening of the story. About and Journey are one section now, so this
 * line is the only introduction the years get.
 */
export const journeyStatement = {
  lines: ["21 years", "of coming together."],
} as const;
