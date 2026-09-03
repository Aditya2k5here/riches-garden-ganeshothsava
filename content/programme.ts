import type { ProgrammeDay } from "./types";

/**
 * PROGRAMME
 *
 * Taken verbatim from the committee's 2026 invitation
 * (`References/Ganesha 2026 Final.pdf`, page 2), which supersedes the 2025
 * card this page was first built from. Nothing here is invented: if an event
 * or a time is not on the invitation, it is not on this page.
 *
 * What the final invitation settled, against the 2025 card:
 *   • The evening performance is 6:00 pm. The 2025 card disagreed with
 *     itself — 6:30 in the English column, 6:00 in the Kannada — and this
 *     page used to carry 6:30. The 2026 invitation prints 6:00 in both.
 *   • Saturday's pooja is 9:30 am, not 9:00.
 *   • Saturday morning is "Fun Games", not "Sports Activity".
 *   • Sunday's noon Maha Annadanam is not on the 2026 invitation. In its
 *     place, at 10:00 am, is the Lalitha School of Music recital — which is
 *     also what fills the "devotional songs by ----" blank left unfilled in
 *     the earlier draft.
 *   • The procession is "with Music", no longer "with DJ Music".
 *
 * Two liberties, both long-standing and deliberate:
 *   • The invitation calls the evening slot "Stage Performance by Kids"; it
 *     is listed here as "Stage Events" to match what the rest of the site
 *     calls it.
 *   • The recital credit is printed as "by Lalitha School of Music, Riches
 *     Garden Bangalore". The school's own address is dropped — inside an
 *     event name, on a Riches Garden site, it reads as a stutter.
 */
export const programme: ProgrammeDay[] = [
  {
    id: "day-one",
    label: "Day One",
    date: "18 September 2026",
    weekday: "Friday",
    events: [
      { time: "10:00 am", name: "Ganesha Idol Installation, Pooja and Prasadam Distribution" },
      { time: "6:00 pm", name: "Stage Events" },
      { time: "8:30 pm", name: "Prasadam Distribution" },
    ],
  },
  {
    id: "day-two",
    label: "Day Two",
    date: "19 September 2026",
    weekday: "Saturday",
    events: [
      { time: "9:30 am", name: "Pooja and Prasadam Distribution" },
      { time: "10:00 am", name: "Fun Games for Children and Ladies" },
      { time: "6:00 pm", name: "Stage Events" },
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
      {
        time: "10:00 am",
        name: "Veena Recital and Carnatic Classical Music by Lalitha School of Music",
      },
      { time: "5:00 pm", name: "Procession with Music and Visarjana" },
    ],
  },
];
