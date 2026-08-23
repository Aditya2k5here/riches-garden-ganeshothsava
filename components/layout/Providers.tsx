"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes every motion component honour the OS setting
 * automatically: transforms and layout animation stop, opacity still fades so
 * nothing appears or vanishes abruptly. The CSS media query in globals.css
 * covers plain CSS transitions; this covers the JavaScript-driven ones.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
