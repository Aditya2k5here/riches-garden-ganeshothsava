import type { ImageRef, NavLink } from "./types";

/**
 * Festival identity. Rolling the site forward a year is: bump `year`,
 * `edition` and `dates`. Nothing else in this file changes.
 */
export const festival = {
  name: "Riches Garden Ganeshothsava",
  organisation: "Riches Garden Ganeshothsava Committee",
  year: 2026,
  edition: "21st Year",
  editionOrdinal: 21,

  /** Confirmed by the committee: Friday to Sunday, as in previous years. */
  dates: "18 · 19 · 20 September 2026",
  datesShort: "18–20 Sept 2026",

  tagline: "Faith, culture and community.",
  welcome: "All are welcome",
} as const;

/**
 * Committee is deliberately last and Sponsors is absent: the committee asked
 * for the main experience to be the festival itself, not its organisers, and
 * sponsors will arrive once logos exist.
 */
export const nav: NavLink[] = [
  { index: "01", href: "#journey", label: "Journey" },
  { index: "02", href: "#programme", label: "Programme" },
  { index: "03", href: "#stage", label: "Stage Events" },
  { index: "04", href: "#contribute", label: "Contribute" },
  { index: "05", href: "#contact", label: "Contact" },
  { index: "06", href: "#committee", label: "Committee" },
];

export const brand = {
  /** Full-colour mark. Use on cream and paper. */
  logo: {
    src: "/brand/riches-garden-logo.png",
    alt: "Riches Garden Ganeshothsava Committee",
    width: 900,
    height: 874,
  },
  /**
   * Cream tint of the same artwork, for maroon surfaces. Regenerate both with
   * `npm run logo` if the source logo is ever replaced.
   */
  logoReversed: {
    src: "/brand/riches-garden-logo-reversed.png",
    alt: "Riches Garden Ganeshothsava Committee",
    width: 900,
    height: 874,
  },
  /**
   * The circular device on its own, for the navigation bar and the favicon,
   * where the full lockup's wordmark would be too small to read.
   */
  emblem: {
    src: "/brand/riches-garden-emblem.png",
    alt: "",
    width: 561,
    height: 536,
  },
  emblemReversed: {
    src: "/brand/riches-garden-emblem-reversed.png",
    alt: "",
    width: 561,
    height: 536,
  },
} as const;

/**
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. The fallback only
 * affects metadata URLs during local development.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Optional Ganesha artwork for the hero. Left null on purpose: the drawn
 * mandala is original, and the alternative would be a stock or AI-generated
 * deity image on a real community's website.
 */
export const heroArtwork: ImageRef | null = null;
