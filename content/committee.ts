import type { CommitteeMember } from "./types";

/**
 * COMMITTEE
 *
 * Names and portfolios come from the committee's own printed brochure.
 * Twenty-one members, in the twenty-first year.
 *
 * Photographs: drop square images into /public/images/committee/ and add an
 * `image` to the member. Members without one render a square ornamental
 * plate, so the grid stays even whether one portrait exists or all of them
 * do. The order below is the order printed in the brochure.
 */
export const committee: CommitteeMember[] = [
  { name: "Mune Gowda" },
  { name: "Malathesh", role: "Convenor" },
  { name: "Murthy", role: "Food · Flower Decoration" },
  { name: "Suresh Kumar", role: "Sports & Games" },
  { name: "Prem Kumar", role: "Accounts · Flower Decoration" },
  { name: "Subbu Krishna" },
  { name: "Srinivas V", role: "Cultural Activities" },
  { name: "Saravana Shekar" },
  { name: "Andrews", role: "Sports & Games" },
  { name: "Srinivas E.P" },
  { name: "Rajesh", role: "Food · Sports" },
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
