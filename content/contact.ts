/**
 * CONTACT
 *
 * Phone numbers are published from the committee's own brochure. If a member
 * would rather not have their number on the open web, remove it here — the
 * layout handles a missing number without breaking.
 */
export const contact = {
  heading: ["Come celebrate", "with us."],

  address: {
    lines: [
      "Riches Garden Main Road",
      "Riches Garden, Ramamurthy Nagar",
      "Bengaluru, Karnataka",
    ],
    /** A search query rather than a hard-coded place ID, so it never rots. */
    mapsQuery: "Riches Garden Main Road, Ramamurthy Nagar, Bengaluru",
  },

  people: [
    {
      name: "Malathesh",
      role: "Convenor",
      phone: null as string | null,
    },
    {
      name: "Srinivas V",
      role: "Cultural Activities",
      phone: "7259816679",
    },
  ],
} as const;
