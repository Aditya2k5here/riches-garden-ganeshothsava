"use client";

import { useEffect } from "react";

/**
 * Holds the page still while the loading overlay is on screen, then releases
 * it. Reads the hold duration from the same CSS variable the animation uses,
 * so the lock can never fall out of step with the visuals.
 */
export function ScrollLock() {
  useEffect(() => {
    const held = getComputedStyle(document.documentElement)
      .getPropertyValue("--loader-hold")
      .trim();

    // "1500ms" or "1.5s"
    const ms = held.endsWith("ms")
      ? parseFloat(held)
      : parseFloat(held) * 1000 || 1500;

    document.body.dataset.loading = "true";
    const release = window.setTimeout(() => {
      delete document.body.dataset.loading;
    }, ms);

    return () => {
      window.clearTimeout(release);
      delete document.body.dataset.loading;
    };
  }, []);

  return null;
}
