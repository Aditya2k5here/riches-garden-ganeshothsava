/**
 * Kannada appears in a handful of specific places — the committee's own name,
 * the opening statement, and a short line in Contribute, Contact and the
 * closing section. It is not a translation layer and there is no toggle:
 * there is one site, and the Kannada sits inside it the way it does on the
 * committee's printed brochure.
 *
 * Kept as its own module so every Kannada string on the site is visible in
 * one place — which is also what `npm run kannada` subsets the fonts against.
 */
export const kannada = {
  committee: "ರಿಚ್ಚಸ್ ಗಾರ್ಡನ್ ಗಣೇಶೋತ್ಸವ ಸಮಿತಿ",

  /** Opens the story, under the English statement. */
  comingTogether: "21 ವರ್ಷಗಳಿಂದ ಒಟ್ಟಿಗೆ",

  /** Contribute. */
  contribute: "ಕಾಣಿಕೆ",
  scan: "ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",

  /** Contact. */
  comeCelebrate: "ಬನ್ನಿ, ಒಟ್ಟಿಗೆ ಸಂಭ್ರಮಿಸೋಣ",

  /** The closing line, on the footer. */
  allWelcome: "ಎಲ್ಲರಿಗೂ ಸ್ವಾಗತ",
} as const;
