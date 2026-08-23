"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { brand, festival, nav } from "@/content";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * NAVIGATION
 *
 * Two states, one bar:
 *   over the hero  — no background, cream marks, reversed emblem
 *   docked         — paper background, hairline underneath, maroon marks
 *
 * The switch is driven by an IntersectionObserver on a sentinel placed at the
 * bottom of the hero rather than by a scroll listener, so nothing runs on the
 * main thread while the visitor scrolls.
 */
export function Nav() {
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDocked(!entry?.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lock the page behind the mobile overlay, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The open mobile overlay is maroon, so the bar reverts to its cream
  // treatment over it even when the page is scrolled and the bar is docked.
  const light = docked && !open;

  return (
    <>
      {/* Sits just under the hero; when it scrolls away the bar docks. */}
      <div
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute top-[85svh] left-0 h-px w-full"
      />

      <a
        href="#welcome"
        className="sr-only rounded-xs focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:bg-maroon focus:px-5 focus:py-3 focus:text-xs focus:tracking-[0.14em] focus:text-cream-300 focus:uppercase"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-colors duration-700",
          docked && !open
            ? "border-b border-char/10 bg-paper/95 backdrop-blur-[6px]"
            : "border-b border-transparent",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="shell flex h-(--nav-h) items-center justify-between gap-6">
          {/* --- mark --- */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group relative flex items-center gap-3.5"
            aria-label={`${festival.organisation} — home`}
          >
            <span className="relative block size-10 shrink-0 lg:size-11">
              <Image
                src={brand.emblem.src}
                alt=""
                fill
                sizes="44px"
                priority
                className={cn(
                  "object-contain transition-opacity duration-700",
                  light ? "opacity-100" : "opacity-0",
                )}
              />
              <Image
                src={brand.emblemReversed.src}
                alt=""
                fill
                sizes="44px"
                priority
                className={cn(
                  "object-contain transition-opacity duration-700",
                  light ? "opacity-0" : "opacity-100",
                )}
              />
            </span>

            <span
              className={cn(
                "hidden leading-[1.15] transition-colors duration-700 sm:block",
                light ? "text-maroon" : "text-cream",
              )}
            >
              <span className="block font-display text-[1.0625rem] tracking-[0.02em] lg:text-[1.1875rem]">
                Riches Garden
              </span>
              <span
                className={cn(
                  "block font-sans text-[0.5625rem] font-medium tracking-[0.28em] uppercase transition-colors duration-700 lg:text-[0.625rem]",
                  light ? "text-gold-600" : "text-gold-300",
                )}
              >
                Ganeshothsava
              </span>
            </span>
          </Link>

          {/* --- desktop links --- */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex xl:gap-9"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "link-underline font-sans text-[0.8125rem] tracking-[0.02em] transition-colors duration-700",
                  light
                    ? "text-char-600 hover:text-maroon"
                    : "text-cream/85 hover:text-cream",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* --- mobile toggle --- */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex size-12 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full transition-all duration-500",
                  light ? "bg-maroon" : "bg-cream",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)" }}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full transition-all duration-500",
                  light ? "bg-maroon" : "bg-cream",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)" }}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="on-dark grain fixed inset-0 z-80 bg-maroon-900 lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <div className="flex h-full flex-col justify-between overflow-y-auto pt-(--nav-h) pb-10">
            <nav aria-label="Primary" className="shell pt-8">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.16 + i * 0.055,
                      duration: 0.7,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="border-b border-cream/12"
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline gap-4 py-4.5"
                    >
                      <span className="nums w-6 shrink-0 font-sans text-[0.625rem] tracking-[0.2em] text-gold-300/85">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[2rem] leading-none text-cream-300">
                        {item.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="shell pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <p className="font-sans text-[0.6875rem] tracking-[0.26em] text-gold-300 uppercase">
                {festival.edition} Year · {festival.year}
              </p>
              <p className="mt-3 max-w-xs font-display text-lg text-cream/80 italic">
                {festival.tagline}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
