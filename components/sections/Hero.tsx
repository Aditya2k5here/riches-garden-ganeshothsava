"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { CSSProperties } from "react";

import { GaneshaGlyph, Mandala } from "@/components/ui/Ornament";
import { festival, heroArtwork } from "@/content";

/**
 * HERO
 *
 * A deep maroon field, a devotional mandala, and the festival's name set as
 * large as the viewport will carry. If the committee supplies Ganesha artwork
 * it takes the place of the drawn mandala (see `heroArtwork` in content) —
 * until then the ornament is doing the work, and doing it without stock
 * imagery.
 *
 * The entrance is CSS (`.hero-line` / `.hero-soft` / `.hero-fade`, timed off
 * `--loader-hold`), not JavaScript. That is what lets the largest text on the
 * page paint straight from the server HTML instead of waiting for hydration —
 * on a throttled phone that was the difference between a 6.4s LCP and a good
 * one — and it means the opening still plays with scripting disabled.
 *
 * JavaScript is reserved for the one thing that genuinely needs the scroll
 * position: the type drifts up faster than the ornament, which turns very
 * slowly. Nothing moves far.
 */

/** Stagger index for the CSS entrance. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  const section = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const typeFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const artSpin = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={section}
      id="hero"
      className="on-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-maroon-900"
    >
      {/* Warmth from below, so the flat maroon reads as lit rather than printed. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 108%, #a81735 0%, rgba(168,23,53,0) 58%), radial-gradient(85% 60% at 82% 12%, rgba(200,155,60,0.22) 0%, rgba(200,155,60,0) 62%)",
        }}
      />

      {/* --- ornament / artwork --- */}
      <motion.div
        aria-hidden="true"
        className="hero-fade pointer-events-none absolute top-[7svh] left-1/2 -z-10 flex w-[92%] -translate-x-1/2 items-center justify-center sm:inset-y-0 sm:top-0 sm:right-[-16%] sm:left-auto sm:w-[80%] sm:translate-x-0 lg:right-[-5%] lg:w-[56%]"
        style={{ y: artY, scale: artScale, ...step(2) }}
      >
        {heroArtwork ? (
          <Image
            src={heroArtwork.src}
            alt=""
            width={heroArtwork.width}
            height={heroArtwork.height}
            priority
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 56vw"
            className="h-auto w-full object-contain"
          />
        ) : (
          <motion.div
            className="relative aspect-square w-full max-w-[min(86vw,38svh)] sm:max-w-none"
            style={{ rotate: artSpin }}
          >
            <Mandala className="absolute inset-0 h-full w-full text-gold/32 sm:text-gold/45" />
            <GaneshaGlyph className="absolute inset-[31%] h-auto w-[38%] text-gold/55 sm:text-gold/70" />
          </motion.div>
        )}
      </motion.div>

      {/* --- type --- */}
      <motion.div
        className="shell relative flex flex-1 flex-col justify-end pt-(--nav-h) pb-14 sm:pb-20"
        style={{ y: typeY, opacity: typeFade }}
      >
        <p className="hero-soft font-kannada text-sm text-gold-300/85 sm:text-base">
          {festival.organisationKannada}
        </p>

        <h1 className="mt-5 sm:mt-7">
          <span className="sr-only">
            {festival.name} — {festival.edition} year, {festival.year}
          </span>

          <span aria-hidden="true" className="block">
            <span className="block overflow-hidden pb-[0.06em]">
              <span
                className="hero-line block font-display text-4xl leading-[0.9] font-light tracking-[-0.02em] text-cream-300"
                style={step(1)}
              >
                Riches Garden
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span
                className="hero-line block font-display text-4xl leading-[0.9] font-normal tracking-[-0.02em] text-gold italic"
                style={step(2)}
              >
                Ganeshothsava
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-7 sm:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-md">
            <p className="hero-soft eyebrow !text-gold-300" style={step(5)}>
              {festival.edition} Year · {festival.year}
            </p>
            <p
              className="hero-soft mt-4 font-display text-xl leading-[1.25] text-cream/90 italic"
              style={step(6)}
            >
              {festival.tagline}
            </p>
          </div>

          <div
            className="hero-soft flex flex-col gap-3 sm:flex-row sm:items-center"
            style={step(7)}
          >
            <a href="#programme" className="btn">
              Explore the festival
            </a>
            <a href="#children" className="btn btn-ghost">
              Children&rsquo;s events
            </a>
          </div>
        </div>

        {/* Closing line of the hero: welcome on the left, scroll cue right. */}
        <div
          className="hero-fade mt-11 hidden items-center justify-between gap-8 border-t border-cream/12 pt-5 sm:flex"
          style={step(9)}
        >
          <p className="font-sans text-[0.625rem] tracking-[0.3em] text-cream/75 uppercase">
            {festival.welcome}
          </p>

          <span aria-hidden="true" className="flex items-center gap-3.5">
            <span className="font-sans text-[0.5625rem] tracking-[0.32em] text-cream/75 uppercase">
              Scroll
            </span>
            <span className="relative block h-px w-16 overflow-hidden bg-cream/15">
              <motion.span
                className="absolute inset-y-0 left-0 block w-1/3 bg-gold"
                animate={{ x: ["-100%", "300%"] }}
                transition={{
                  duration: 2.4,
                  ease: [0.76, 0, 0.24, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            </span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}
