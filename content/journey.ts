import type { JourneyChapter } from "./types";

/**
 * The 21-year story.
 *
 * Only facts that are actually known are written here — the founding year,
 * the edition numbers, and 2026 as the current chapter. `note` is left empty
 * for the years the committee has not yet written about; the timeline renders
 * those as year + label + photograph, which reads as intentional restraint
 * rather than missing copy. Add a `note` and an `image` and the entry simply
 * becomes richer. Add more years by adding more objects.
 */
export const journey: JourneyChapter[] = [
  {
    year: 2006,
    label: "The first year",
    note: "A handful of neighbours, one idol, and a decision to do it again next year.",
  },
  { year: 2021, label: "The sixteenth year" },
  { year: 2022, label: "The seventeenth year" },
  { year: 2023, label: "The eighteenth year" },
  { year: 2024, label: "The nineteenth year" },
  { year: 2025, label: "The twentieth year" },
  {
    year: 2026,
    label: "The twenty-first year",
    note: "The current chapter. Being written now.",
    current: true,
  },
];

export const journeyIntro = {
  heading: ["21 years of", "celebration"],
  body: "From a gathering of neighbours to a cherished community tradition.",
} as const;
