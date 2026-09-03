import type { CommitteeMember } from "./types";

/**
 * COMMITTEE
 *
 * Twenty-two members, taken from the 2026 invitation
 * (`References/Ganesha 2026 Final.pdf`, page 3).
 *
 * The order is the invitation's own — left to right, top to bottom, exactly
 * as the committee laid its grid out. It is not alphabetical and it is not
 * ranked by portfolio; it is what they printed, so it is what is shown.
 *
 * Portraits come from that same page, lifted out by
 * `scripts/extract-committee-photos.py`, which pairs each face to its caption
 * by position on the page rather than by any list written here. The file name
 * is derived from the member's name, so adding a portrait is a matter of
 * dropping the right file in — there is no second list to keep in step. A
 * member with no file still renders an ornamental plate, so the grid never
 * breaks.
 *
 * Roles are the invitation's "Key Volunteers" list, and only that list. The
 * contributions column names people too, but those are sponsorships — who
 * paid for the lighting is not a committee portfolio, and several of the
 * names there (Devaraj, Kumareshan, Shiva) are not committee members at all.
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
    width: 512,
    height: 640,
  };
}

const members: Omit<CommitteeMember, "image">[] = [
  { name: "Mune Gowda" },
  { name: "Malathesh", role: "Convenor" },
  { name: "Murthy", role: "Food" },
  { name: "Suresh Kumar", role: "Fun Games" },
  { name: "Prem Kumar", role: "Accounts" },
  { name: "Subbu Krishna" },
  { name: "Srinivas V", role: "Cultural Activities · Accounts" },
  { name: "Saravana Shekar" },
  { name: "Andrews", role: "Fun Games" },
  { name: "Dr. Phani Kumar" },
  { name: "Rajesh", role: "Food · Fun Games" },
  { name: "Balagangadhar" },
  { name: "Murthy T" },
  { name: "Srinivas E.P" },
  { name: "Thyagaraju Naidu" },
  { name: "Krishna Moorthy" },
  { name: "Mounesh" },
  { name: "Shivappa Meti" },
  { name: "Venkatesh B" },
  { name: "Srinivas Rao V" },
  { name: "Vinay" },
  { name: "Uma Maheshwar" },
];

export const committee: CommitteeMember[] = members.map((member) => ({
  ...member,
  image: portrait(member.name),
}));
