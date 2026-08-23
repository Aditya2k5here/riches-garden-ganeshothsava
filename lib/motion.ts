import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language.
 *
 * One easing curve and a small set of variants, used everywhere. Sections
 * import these rather than inventing their own timings — that consistency is
 * most of what separates "animated" from "art directed".
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

export const transition: Transition = {
  duration: 0.9,
  ease: EASE_OUT_EXPO,
};

/** Content lifts a short distance and settles. Never bounces. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...transition, duration: 1.1 } },
};

/** Parent that walks its children in. */
export function stagger(step = 0.09, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

/**
 * Viewport config: fire once, a little before the element reaches the bottom
 * of the screen.
 *
 * `amount: "some"` rather than a fraction. A fraction is a share of the
 * *element*, so a tall container — the 21-name committee roster is well over
 * two screens on a phone — may never have a quarter of itself on screen at
 * the point the visitor arrives, and simply never animates in.
 */
export const inView = {
  once: true,
  amount: "some",
  margin: "0px 0px -12% 0px",
} as const;
