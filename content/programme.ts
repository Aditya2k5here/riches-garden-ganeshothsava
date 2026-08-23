import type { ProgrammeDay } from "./types";

/**
 * PROGRAMME
 *
 * Event names below are the ones actually recorded for the festival. Timings
 * for 2026 are not fixed yet, so every `time` is null and both days carry
 * `pending: true` — the section renders a "being finalised" state instead of
 * showing a confident-looking schedule that nobody has confirmed.
 *
 * TO PUBLISH THE REAL 2026 PROGRAMME:
 *   1. Fill in `date` on each day.
 *   2. Replace each `time: null` with a string, e.g. "6:30 PM".
 *   3. Delete `pending: true`.
 * The layout does not need to change.
 */
export const programme: ProgrammeDay[] = [
  {
    id: "day-one",
    label: "Day One",
    date: null,
    summary: "Installation, invocation and the cultural stage.",
    pending: true,
    events: [
      {
        time: null,
        name: "Ganesha Pratishtapane",
        description:
          "The idol is installed at the pandal and the first pooja is offered.",
        venue: "Riches Garden Main Road",
      },
      {
        time: null,
        name: "Maha Pooja",
        description: "Community prayer, followed by distribution of prasadam.",
      },
      {
        time: null,
        name: "Cultural Programme",
        description:
          "The stage opens. Performances by residents and invited artistes.",
      },
      {
        time: null,
        name: "Children's Cultural Programme",
        description:
          "Singing, dance, Bharatanatyam, drama and group performances by the children of Riches Garden.",
      },
    ],
  },
  {
    id: "day-two",
    label: "Day Two",
    date: null,
    summary: "Prasadam, games and the procession to visarjan.",
    pending: true,
    events: [
      {
        time: null,
        name: "Morning Prasadam",
        description: "Prasadam served to the neighbourhood.",
      },
      {
        time: null,
        name: "Sports & Fun Games",
        description: "Games for every age group, run by the committee.",
      },
      {
        time: null,
        name: "Maha Mangalarathi",
        description: "The closing arathi before the idol is carried out.",
      },
      {
        time: null,
        name: "Procession & Visarjan",
        description:
          "The idol is taken through Riches Garden in procession, and immersed.",
      },
    ],
  },
];

export const programmeIntro = {
  eyebrow: "The Programme",
  heading: "The festival",
  body: "Two days. Many moments. One celebration.",
  pendingNotice:
    "The 2026 programme is being finalised. Timings will be published here as soon as the committee confirms them.",
} as const;
