import type { ContributionTier } from "./types";

/**
 * DONATIONS
 *
 * Payment details are read from the environment so no account identifier is
 * committed to the repository. Set these in Vercel (or .env.local):
 *   NEXT_PUBLIC_UPI_ID       e.g. name@bank
 *   NEXT_PUBLIC_UPI_PAYEE    display name shown by the UPI app
 * Drop the committee's payment QR at /public/donate/upi-qr.png.
 */
export const upi = {
  id: process.env.NEXT_PUBLIC_UPI_ID ?? "",
  payee: process.env.NEXT_PUBLIC_UPI_PAYEE ?? "Riches Garden Ganeshothsava Committee",
  qr: {
    src: "/donate/upi-qr.png",
    alt: "UPI payment QR code for the Riches Garden Ganeshothsava Committee",
    width: 640,
    height: 640,
  },
} as const;

export const membership = {
  title: "Members & house owners",
  amount: "₹2,000",
  unit: "per member",
} as const;

/** What contributions actually pay for. Taken from the committee's brochure. */
export const sponsorships: ContributionTier[] = [
  { title: "Ganesha Idol", detail: "The idol, its pandal and decoration." },
  { title: "Lighting & Sound", detail: "Illumination and the stage sound system." },
  { title: "Food Ration", detail: "Provisions for the community meals." },
  { title: "DJ Music — Procession", detail: "Music for the visarjan procession." },
  { title: "Morning Prasadam", detail: "Prasadam served to the neighbourhood." },
];

export const donorTier = {
  title: "Contributing Donors",
  amount: "₹10,000",
  detail: "Recognised in the festival brochure and at the pandal.",
} as const;

export const donationsIntro = {
  eyebrow: "Contribute",
  heading: ["Be part of", "the celebration"],
  body: "Every year the festival is paid for entirely by the people who attend it. Contributions of any size are welcome — and every rupee is accounted for by the committee.",
  assurance:
    "Accounts are maintained by the committee and shared with contributors at the close of the festival.",
} as const;
