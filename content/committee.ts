import type { CommitteeMember } from "./types";

/**
 * COMMITTEE
 *
 * Names and portfolios come from the committee's own printed brochure.
 * Twenty-one members, in the twenty-first year.
 *
 * Portraits come from the same brochure, lifted out of the PDF by
 * `scripts/extract-committee-photos.py` and sized by
 * `scripts/prepare-committee-photos.mjs`. The file name is derived from the
 * member's name, so adding a portrait is a matter of dropping the right file
 * in — there is no second list to keep in step. A member with no file still
 * renders an ornamental plate, so the grid never breaks.
 *
 * Order: the four members who hold the main portfolios first, then the rest
 * as printed in the brochure.
 */

/** `Srinivas E.P` -> `/images/committee/srinivas-e-p.jpg` */
function portrait(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    src: `/images/committee/${slug}.jpg`,
    // Deliberately empty. The member's name is printed directly under the
    // portrait as real text, so giving the image the name too makes a screen
    // reader announce it twice — "Mune Gowda, image, Mune Gowda". The picture
    // carries nothing the caption does not, which is the definition of
    // decorative.
    alt: "",
    // 4:5, which is what the brochure photographs already are. Cropping them
    // square meant cutting a fifth of the height out of a head-and-shoulders
    // portrait, which took the tops of the heads with it.
    width: 480,
    height: 600,
  };
}

const members: Omit<CommitteeMember, "image">[] = [
  { name: "Malathesh", role: "Convenor" },
  { name: "Srinivas V", role: "Cultural Activities" },
  { name: "Prem Kumar", role: "Accounts · Flower Decoration" },
  { name: "Murthy", role: "Food · Flower Decoration" },
  { name: "Mune Gowda" },
  { name: "Suresh Kumar", role: "Sports & Games" },
  { name: "Subbu Krishna" },
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

export const committee: CommitteeMember[] = members.map((member) => ({
  ...member,
  image: portrait(member.name),
}));
