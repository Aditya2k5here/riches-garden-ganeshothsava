import type { ProgrammeDay } from "./types";

/**
 * PROGRAMME
 *
 * Taken verbatim from the committee's own printed schedule, with only the
 * dates moved forward. 2025 ran Friday–Sunday, 29–31 August; 2026 runs
 * Friday–Sunday, 18–20 September, so every day maps onto the same weekday
 * and the running order transfers unchanged.
 *
 * Nothing here is invented. If an event or a time is not on the committee's
 * card, it is not on this page.
 *
 * Two notes for the committee:
 *   • On the printed card the English column reads 6:30 pm for the evening
 *     performance while the Kannada column reads 6:00. The English times are
 *     used here — worth confirming before printing 2026.
 *   • The card calls that slot "Stage Performance by Kids"; it is listed
 *     here as "Stage Events" to match what the rest of the site now calls it.
 */
export const programme: ProgrammeDay[] = [
  {
    id: "day-one",
    label: "Day One",
    date: "18 September 2026",
    weekday: "Friday",
    events: [
      { time: "10:00 am", name: "Ganesha Idol Installation, Pooja and Prasadam Distribution" },
      { time: "6:30 pm", name: "Stage Events" },
      { time: "8:30 pm", name: "Prasadam Distribution" },
    ],
  },
  {
    id: "day-two",
    label: "Day Two",
    date: "19 September 2026",
    weekday: "Saturday",
    events: [
      { time: "9:00 am", name: "Pooja and Prasadam Distribution" },
      { time: "10:00 am", name: "Sports Activity for Children and Ladies" },
      { time: "6:30 pm", name: "Stage Events" },
      { time: "8:30 pm", name: "Prasadam Distribution" },
    ],
  },
  {
    id: "day-three",
    label: "Day Three",
    date: "20 September 2026",
    weekday: "Sunday",
    events: [
      { time: "9:00 am", name: "Pooja and Prasadam Distribution" },
      { time: "12:00 pm", name: "Maha Annadanam" },
      { time: "5:00 pm", name: "Procession with DJ Music and Visarjana" },
    ],
  },
];
