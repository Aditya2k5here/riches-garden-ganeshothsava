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
 * The committee's live Google Form.
 *
 * Kept in the repository rather than in an environment variable: it is a
 * public link, printed on posters and shared in WhatsApp, so there is
 * nothing to hide and one less piece of deployment configuration that can
 * be forgotten. The environment variable still overrides it, which is what
 * a dry run or a second form for another year would use.
 *
 * The QR code on the page is generated from this same constant at build
 * time, so the button and the code can never point at different places.
 */
const COMMITTEE_FORM_URL = "https://forms.gle/wLsTHehvaoZLgyJ3A";

export const registrationFormUrl =
  process.env.NEXT_PUBLIC_REGISTRATION_FORM_URL || COMMITTEE_FORM_URL;


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
