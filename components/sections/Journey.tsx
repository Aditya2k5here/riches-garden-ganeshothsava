"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import {
  journey,
  journeyStatement,
  kannada,
  type JourneyChapter,
} from "@/content";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO, inView } from "@/lib/motion";

/**
 * THE STORY — the statement and the years, as one section.
 *
 * About and Journey used to be two sections with a label and a colour change
 * between them, which made the milestone read as a claim and the photographs
 * as evidence filed separately. They are the same thought: the statement is
 * the first panel of the track on desktop, so scrolling out of the sentence
 * scrolls straight into the years without a seam.
 *
 * Content model is year + photograph. No captions, no invented history, and
 * no year styled more loudly than its neighbours — every panel is the same
 * width with the same 4:3 crop on the same baseline. The single deliberate
 * exception is the current year, which has no photograph yet.
 */
export function Journey() {
  return (
    <section
      id="journey"
      className="relative bg-paper"
      aria-labelledby="journey-heading"
    >
      <MobileTimeline />
      <DesktopTimeline />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Statement({ headingId }: { headingId?: string }) {
  return (
    <div>
      <RevealLines
        as="h2"
        id={headingId}
        lines={journeyStatement.lines}
        className="font-display text-4xl leading-[0.92] font-light text-maroon"
        lineClassName={[undefined, "text-crimson italic"]}
      />

      <Reveal delay={0.14}>
        <p
          lang="kn"
          className="font-kannada-display mt-7 text-2xl text-gold-600"
        >
          {kannada.comingTogether}
        </p>
      </Reveal>
    </div>
  );
}

/** One year. Identical for every entry — that consistency is the point. */
function Chapter({ chapter }: { chapter: JourneyChapter }) {
  const { year, image, current } = chapter;

  return (
    <motion.article
      data-reveal=""
      className="flex w-[clamp(17rem,26vw,23rem)] shrink-0 flex-col"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
    >
      <Figure
        image={image}
        ratio="4 / 3"
        parallax={0}
        plateLabel={current ? "2026" : undefined}
        sizes="(max-width: 1024px) 100vw, 26vw"
        tone={current ? "maroon" : "cream"}
      />
      <YearLine year={year} current={current} />
    </motion.article>
  );
}

function YearLine({ year, current }: { year: number; current?: boolean }) {
  return (
    <p className="mt-4 flex items-baseline justify-between gap-4">
      <span
        className={cn(
          "figure-display text-2xl leading-none",
          current ? "text-crimson" : "text-maroon",
        )}
      >
        {year}
      </span>
      {current && (
        <span className="font-sans text-[0.5625rem] tracking-[0.2em] text-crimson uppercase">
          This year
        </span>
      )}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop — horizontal                                                      */
/* -------------------------------------------------------------------------- */

function DesktopTimeline() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const measure = () => {
      const last = el.lastElementChild as HTMLElement | null;
      if (!last) return;

      // Not `scrollWidth`: a flex container leaves its own padding-right out
      // of that measurement, so the track stopped one gutter short and the
      // final year ended flush against the screen edge with its label clipped
      // into the corner. Measured from the last panel instead, plus the same
      // gutter the first panel gets, so the timeline closes symmetrically.
      const gutter = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const contentEnd = last.offsetLeft + last.offsetWidth + gutter;

      setDistance(Math.max(0, contentEnd - window.innerWidth));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const years = journey.map((c) => c.year);

  return (
    <div
      ref={wrap}
      className="hidden lg:block"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex items-end gap-12 px-(--spacing-gutter) will-change-transform xl:gap-16"
        >
          {/* The statement is the first panel, so the sentence and the years
              are one continuous movement rather than two sections. */}
          <div className="w-[min(44vw,28rem)] shrink-0 pb-14">
            <Statement headingId="journey-heading" />
          </div>

          {journey.map((chapter) => (
            <Chapter key={chapter.year} chapter={chapter} />
          ))}
        </motion.div>

        {/* Progress, pinned to the foot of the sticky viewport. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-(--spacing-gutter) bottom-9 flex items-center gap-5"
        >
          <span className="nums font-sans text-[0.625rem] tracking-[0.24em] text-maroon/80">
            {years[0]}
          </span>
          <span className="relative h-px flex-1 bg-maroon/15">
            <motion.span
              className="absolute inset-y-0 left-0 block bg-gold"
              style={{ width: progress }}
            />
          </span>
          <span className="nums font-sans text-[0.625rem] tracking-[0.24em] text-maroon/80">
            {years[years.length - 1]}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile — vertical                                                         */
/* -------------------------------------------------------------------------- */

function MobileTimeline() {
  const years = journey.map((c) => c.year);

  return (
    <div className="py-(--spacing-section) lg:hidden">
      <div className="shell">
        <Statement />
      </div>

      {/*
        A swipe strip, not a stack. Eight 4:3 photographs down a phone screen
        came to nearly four screens of scrolling with nothing to do but keep
        going — the years stopped feeling like a sequence and started feeling
        like a queue. Sideways puts the whole run in one screen, makes each
        year a deliberate flick, and matches what the desktop timeline does.

        Scroll-snap does the work; there is no JavaScript here and no
        carousel library. The strip bleeds into the gutters so the next year
        is always half-visible, which is what invites the swipe.
      */}
      <ol
        // A scroll container holding nothing focusable is unreachable by
        // keyboard — the strip is only swipeable by touch otherwise. Making
        // it a focus stop hands it the browser's own arrow-key scrolling.
        tabIndex={0}
        aria-label="Festival photographs by year — scroll sideways"
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-p-(--spacing-gutter) px-(--spacing-gutter) pt-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {journey.map((chapter) => (
          <li
            key={chapter.year}
            className="w-[74vw] max-w-[19rem] shrink-0 snap-start"
          >
            <Figure
              image={chapter.image}
              ratio="4 / 3"
              parallax={0}
              plateLabel={chapter.current ? "2026" : undefined}
              sizes="74vw"
              tone={chapter.current ? "maroon" : "cream"}
            />
            <YearLine year={chapter.year} current={chapter.current} />
          </li>
        ))}
      </ol>

      <div className="shell mt-8">
        <p
          aria-hidden="true"
          className="flex items-center gap-4 text-maroon/80"
        >
          <span className="figure-display text-[0.8125rem] leading-none">
            {years[0]}
          </span>
          <span className="h-px flex-1 bg-maroon/15" />
          <span className="figure-display text-[0.8125rem] leading-none">
            {years[years.length - 1]}
          </span>
        </p>
      </div>
    </div>
  );
}

