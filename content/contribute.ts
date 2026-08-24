/**
 * CONTRIBUTE
 *
 * One QR and one line. The 2025 brochure listed membership amounts and a
 * breakdown of what money is spent on; the committee asked for none of that
 * here — a contribution page that argues its case reads like a fundraiser,
 * and this is a neighbourhood putting in for its own festival.
 */
export const contribute = {
  heading: "Contribute",
  line: "A celebration that belongs to all of us.",
  sub: "Made possible by our community, together.",
  scan: "Scan with any UPI app",
} as const;

/**
 * Payment details. The QR at /public/donate/upi-qr.png is the committee's
 * own Google Pay code; the ID below is printed on it and is shown as text so
 * it can be copied on a device that cannot scan its own screen.
 */
export const upi = {
  id: process.env.NEXT_PUBLIC_UPI_ID ?? "adityasrinivashere2k5@okicici",
  payee: process.env.NEXT_PUBLIC_UPI_PAYEE ?? "Aditya Srinivas",
  qr: {
    src: "/donate/upi-qr.png",
    alt: "UPI QR code for contributions to the Riches Garden Ganeshothsava Committee",
    width: 760,
    height: 760,
  },
} as const;
