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
 * The switch is driven by an IntersectionObserver on a sentinel at the foot
 * of the hero rather than a scroll listener, so nothing runs on the main
 * thread while the visitor scrolls. A second observer tracks which section is
 * on screen and marks the matching link — subtly, with a small gold dot
 * rather than a colour change, so the bar never starts shouting.
 */
export function Nav() {
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
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

  // Current section. The band is deliberately narrow — a section counts as
  // current only while it crosses the upper third of the viewport.
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((s) => io.observe(s));
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

  // The open overlay is maroon, so the bar keeps its cream treatment over it
  // even when the page is scrolled and the bar would otherwise be docked.
  const light = docked && !open;

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute top-[85svh] left-0 h-px w-full"
      />

      <a
        href="#journey"
        className="sr-only rounded-xs focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:bg-maroon focus:px-5 focus:py-3 focus:text-xs focus:tracking-[0.14em] focus:text-cream-300 focus:uppercase"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-colors duration-700",
          light
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
            className="relative flex items-center gap-3.5"
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
          <div className="hidden items-center lg:flex">
            <nav aria-label="Primary" className="flex items-center gap-6 xl:gap-7">
              {nav.map((item) => {
                const current = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={current ? "true" : undefined}
                    className={cn(
                      "relative font-sans text-[0.8125rem] tracking-[0.02em] transition-colors duration-500",
                      light
                        ? current
                          ? "text-maroon"
                          : "text-char-600 hover:text-maroon"
                        : current
                          ? "text-cream"
                          : "text-cream/85 hover:text-cream",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-2 left-1/2 block size-1 -translate-x-1/2 rounded-full bg-gold transition-opacity duration-500",
                        current ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* --- mobile --- */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="-mr-2 flex size-12 items-center justify-center"
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
            <nav aria-label="Primary" className="shell pt-6">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.14 + i * 0.045,
                      duration: 0.65,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline gap-4 py-3.5"
                    >
                      <span className="nums w-6 shrink-0 font-sans text-[0.625rem] tracking-[0.2em] text-gold-300/80">
                        {item.index}
                      </span>
                      <span className="font-display text-[1.875rem] leading-none text-cream-300">
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
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              <p className="figure-display text-lg text-gold-300">
                {festival.dates}
              </p>
              <p className="mt-2 font-display text-lg text-cream/80 italic">
                {festival.tagline}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
