import type { CommitteeMember } from "./types";

/**
 * COMMITTEE
 *
 * Names and portfolios are taken from the committee's own 2025 brochure.
 * Twenty-one members, in the twenty-first year.
 *
 * TO ADD PORTRAITS: drop files into /public/images/committee/ and add an
 * `image` object to the member. Members without a portrait render as a
 * typographic plate — the grid stays even either way.
 */
export const committee: CommitteeMember[] = [
  { name: "Malathesh", role: "Convenor" },
  { name: "Srinivas V", role: "Cultural Activities" },
  { name: "Prem Kumar", role: "Accounts & Flower Decoration" },
  { name: "Murthy", role: "Food & Flower Decoration" },
  { name: "Rajesh", role: "Food & Sports" },
  { name: "Suresh Kumar", role: "Sports & Fun Games" },
  { name: "Andrews", role: "Sports & Fun Games" },
  { name: "Mune Gowda" },
  { name: "Subbu Krishna" },
  { name: "Saravana Shekar" },
  { name: "Srinivas E.P" },
  { name: "Balagangadhar" },
  { name: "Murthy T" },
  { name: "Uma Maheshwar" },
  { name: "Krishna Moorthy" },
  { name: "Mounesh" },
  { name: "Shivappa Meti" },
  { name: "Venkatesh B" },
  { name: "Srinivas Rao V" },
  { name: "Vinay" },
  { name: "Reji Subramanian" },
];

export const committeeIntro = {
  eyebrow: "The Committee",
  heading: ["The people behind", "the celebration"],
  body: "Twenty-one residents of Riches Garden, in the twenty-first year of the festival.",
} as const;

/** Named in the brochure as key volunteers alongside the committee. */
export const volunteers: string[] = [
  "Prem",
  "Suresh",
  "Saravana",
  "Mune Gowda",
  "Murthy",
  "Venkatesh B",
  "Shivappa Meti",
  "Kumareshan",
  "Balaji",
  "Vinay",
  "Balagangadhar",
  "Srinivas V",
  "Krishna Murthy Chettiar",
  "Srinivas Rao V",
  "Srinivas E.P",
  "Subbu Krishna",
  "Mounesh",
  "Reji Subrahmanyan",
];
