import type { ImageRef, NavLink } from "./types";

/**
 * Festival identity. Rolling the site to 2027 is: bump `year`, bump
 * `edition`, and nothing else in this file changes.
 */
export const festival = {
  name: "Riches Garden Ganeshothsava",
  organisation: "Riches Garden Ganeshothsava Committee",
  organisationKannada: "ರಿಚ್ಚಸ್ ಗಾರ್ಡನ್ ಗಣೇಶೋತ್ಸವ ಸಮಿತಿ",
  year: 2026,
  /** 2006 was the first year, so 2026 is the twenty-first. */
  foundedYear: 2006,
  edition: "21st",
  editionOrdinal: 21,
  tagline: "A celebration of faith, culture & community.",
  welcome: "All are welcome.",
} as const;

export const nav: NavLink[] = [
  { label: "About", href: "#welcome" },
  { label: "Journey", href: "#journey" },
  { label: "Programme", href: "#programme" },
  { label: "Children's Events", href: "#children" },
  { label: "Committee", href: "#committee" },
  { label: "Donations", href: "#donations" },
  { label: "Contact", href: "#contact" },
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
   * `node scripts/prepare-logo.mjs` if the source logo is ever replaced.
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
 * Optional Ganesha artwork for the hero. Leave as null and the hero renders
 * its drawn mandala instead — which is deliberate, not a fallback: it avoids
 * putting a stock or AI-generated deity image on a real community's website.
 *
 * To use real artwork, drop a file in /public/images/ and set:
 *   export const heroArtwork: ImageRef | null = {
 *     src: "/images/ganesha-2026.png", alt: "", width: 1400, height: 1800,
 *   };
 * A transparent PNG works best against the maroon field.
 */
export const heroArtwork: ImageRef | null = null;
