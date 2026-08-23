import type { ChildrenPerformance } from "./types";

/**
 * CHILDREN'S EVENTS
 *
 * Registration runs entirely on Google Forms — there is no registration
 * backend in this site by design. Set NEXT_PUBLIC_REGISTRATION_FORM_URL in the
 * deployment environment and the buttons go live; until then they render as
 * a disabled "opening soon" state rather than a dead link.
 */
export const registrationFormUrl =
  process.env.NEXT_PUBLIC_REGISTRATION_FORM_URL ?? "";

export const childrensEvents = {
  eyebrow: "Children's Events",
  statement: ["The stage", "is theirs."],
  body: [
    "The children's programme is the heart of Ganeshothsava at Riches Garden. Every year the stage is handed over to them — and every year they take it completely.",
    "Registration is open to every child in the neighbourhood, individually or as a group.",
  ],
  categories: [
    "Singing",
    "Dance",
    "Bharatanatyam",
    "Drama",
    "Group Performances",
    "Other Cultural Events",
  ],
  rules: [
    { term: "Entry", detail: "Individual and group performances" },
    { term: "Preferred duration", detail: "5 minutes" },
    { term: "Maximum duration", detail: "7 minutes" },
    {
      term: "Registration closes",
      detail: "Two days before the event",
    },
  ],
  afterNotice:
    "The final performance order and approximate timings will be published after registrations close.",
  duplicateNotice:
    "One registration per child. Duplicate entries for the same child are accepted only with the committee's explicit permission.",
} as const;

/**
 * REGISTRATION NUMBERS
 * Individual entries are numbered RG26-nnn, groups GR26-nnn — one number per
 * group, not per participant. Numbers are assigned by the committee in the
 * sheet, never generated here.
 */
export const registrationIdFormat = {
  individual: { prefix: "RG26", example: "RG26-024" },
  group: { prefix: "GR26", example: "GR26-007" },
} as const;

/**
 * FINAL CHILDREN'S SCHEDULE — /programme/children
 *
 * Deliberately empty. The order is decided by people, in a spreadsheet, after
 * registrations close. Paste the confirmed list in here and the page publishes
 * itself; until then it shows an honest "not yet published" state.
 *
 * Every timing is presented as approximate. Do not label these exact times.
 */
export const childrensSchedule: ChildrenPerformance[] = [];

export const childrensScheduleMeta = {
  /** Set once the committee signs off on the running order. */
  publishedOn: null as string | null,
  note: "Timings are approximate and will shift on the day. Please have your child ready at least three performances ahead.",
} as const;
