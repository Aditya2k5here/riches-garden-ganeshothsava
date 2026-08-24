import type { ChildrenPerformance } from "./types";

/**
 * STAGE EVENTS
 *
 * Registration runs on Google Forms by design — a residents' committee
 * should not have to operate a backend to collect thirty names, and the form
 * already feeds the sheet the running order is decided in.
 *
 * Set NEXT_PUBLIC_REGISTRATION_FORM_URL and the buttons go live; until then
 * they render as "opening soon" rather than a dead link.
 */
/**
 * Stands in until the committee creates the form. It is a real, obviously
 * fake URL rather than an empty string so the section renders in its
 * finished state — button, QR and all — instead of showing a hole where the
 * most important call to action goes. `registrationIsPlaceholder` drives a
 * small notice that disappears the moment the real link is set.
 */
const PLACEHOLDER_FORM_URL = "https://forms.gle/REPLACE-WITH-REAL-FORM";

export const registrationFormUrl =
  process.env.NEXT_PUBLIC_REGISTRATION_FORM_URL || PLACEHOLDER_FORM_URL;

export const registrationIsPlaceholder =
  registrationFormUrl === PLACEHOLDER_FORM_URL;

export const stageEvents = {
  categories: [
    "Singing",
    "Dance",
    "Bharatanatyam",
    "Drama",
    "Group Performances",
    "Other Cultural Events",
  ],

  rules: [
    {
      term: "Preferred duration",
      detail: "2–5 minutes",
    },
    {
      term: "Maximum duration",
      detail: "7 minutes",
    },
    {
      term: "Entry",
      detail: "Individual or group",
    },
  ],

  registrationOpen: "Registration open",
  register: "Register",
  scan: "Or scan",
} as const;

/**
 * FINAL RUNNING ORDER — /programme/children
 *
 * Deliberately empty. The order is decided by people, in a spreadsheet,
 * after registrations close. Paste the confirmed list here and the page
 * publishes itself.
 */
export const childrensSchedule: ChildrenPerformance[] = [];

export const childrensScheduleMeta = {
  publishedOn: null as string | null,
  note: "Timings are approximate and will shift on the day. Please have your child ready at least three performances ahead.",
} as const;
