"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Figure } from "@/components/ui/Figure";
import { LotusRule } from "@/components/ui/Ornament";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { festival, journey, journeyIntro, type JourneyChapter } from "@/content";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO, inView } from "@/lib/motion";

/**
 * THE 21-YEAR JOURNEY
 *
 * On desktop the page scrolls vertically while the timeline travels
 * horizontally underneath a sticky viewport. The travel distance is measured
 * from the track rather than guessed, so adding a year to content/journey.ts
 * lengthens the scroll automatically.
 *
 * On phones that gesture is wrong — nobody wants to scroll a page sideways
 * on a train — so the same content becomes a straightforward vertical
 * chronology. This is not the desktop layout squeezed down; it is a second
 * layout for the same data.
 */
export function Journey() {
  return (
    <section
      id="journey"
      className="relative bg-cream"
      aria-labelledby="journey-heading"
    >
      <MobileTimeline />
      <DesktopTimeline />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared intro                                                              */
/* -------------------------------------------------------------------------- */

function Intro({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "w-[min(70vw,38rem)] shrink-0"}>
      <Reveal>
        <p className="eyebrow">The Journey</p>
      </Reveal>

      <RevealLines
        as="h2"
        id={compact ? "journey-heading" : undefined}
        lines={journeyIntro.heading}
        delay={0.05}
        className="mt-7 font-display text-3xl leading-[0.94] font-light text-maroon"
        lineClassName={[undefined, "text-crimson italic"]}
      />

      <Reveal delay={0.12}>
        <p className="mt-8 max-w-[38ch] text-lg leading-[1.7] text-char-600">
          {journeyIntro.body}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-6 max-w-[38ch] text-sm text-char-600/85">
          The festival began in {festival.foundedYear}, which makes{" "}
          {festival.year} the {festival.edition} year.
        </p>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop — horizontal                                                      */
/* -------------------------------------------------------------------------- */

function DesktopTimeline() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Measure how far the track has to travel for its right edge to reach the
  // right edge of the viewport. Re-measure on resize and on font load, since
  // both change the track's width.
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const measure = () =>
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth));

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

  return (
    <div
      ref={wrap}
      className="hidden lg:block"
      // One viewport of sticky, plus however far the track needs to travel.
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex items-center gap-16 px-(--spacing-gutter) will-change-transform xl:gap-20"
        >
          <Intro />

          {journey.map((chapter, i) => (
            <Chapter key={chapter.year} chapter={chapter} index={i} />
          ))}

          <Coda />
        </motion.div>

        {/* Progress rule, pinned to the bottom of the sticky viewport. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-(--spacing-gutter) bottom-10 flex items-center gap-5"
        >
          <span className="nums font-sans text-[0.625rem] tracking-[0.24em] text-maroon/80">
            {festival.foundedYear}
          </span>
          <span className="relative h-px flex-1 bg-maroon/12">
            <motion.span
              className="absolute inset-y-0 left-0 block bg-gold"
              style={{ width: progress }}
            />
          </span>
          <span className="nums font-sans text-[0.625rem] tracking-[0.24em] text-maroon/80">
            {festival.year}
          </span>
        </div>
      </div>
    </div>
  );
}

function Chapter({
  chapter,
  index,
}: {
  chapter: JourneyChapter;
  index: number;
}) {
  const { year, label, note, image, current } = chapter;

  return (
    <motion.article
      data-reveal=""
      className={cn(
        "flex w-[clamp(19rem,25vw,25rem)] shrink-0 flex-col",
        // Alternating vertical offset stops the row reading as a table.
        index % 2 === 0 ? "self-start pt-[8vh]" : "self-end pb-[14vh]",
      )}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
    >
      <ChapterHead year={year} label={label} note={note} current={current} />

      <Figure
        className="mt-7"
        image={image}
        ratio={index % 3 === 1 ? "1 / 1" : "4 / 5"}
        plateLabel={String(year)}
        parallax={0}
        sizes="25vw"
        tone={current ? "maroon" : "cream"}
      />
    </motion.article>
  );
}

function ChapterHead({
  year,
  label,
  note,
  current,
}: Pick<JourneyChapter, "year" | "label" | "note" | "current">) {
  return (
    <>
      <div className="flex items-baseline gap-4">
        <h3
          className={cn(
            "nums font-display text-3xl leading-none font-light tracking-[-0.03em]",
            current ? "text-crimson" : "text-maroon",
          )}
        >
          {year}
        </h3>
        {current && (
          <span className="rounded-xs border border-crimson/35 px-2.5 py-1 font-sans text-[0.5625rem] font-medium tracking-[0.2em] text-crimson uppercase">
            This year
          </span>
        )}
      </div>

      <p className="mt-3 font-sans text-[0.6875rem] tracking-[0.24em] text-gold-600 uppercase">
        {label}
      </p>

      {note && (
        <p className="mt-4 max-w-[30ch] text-base leading-[1.6] text-char-600">
          {note}
        </p>
      )}
    </>
  );
}

/** Closing panel, so the track does not simply stop. */
function Coda() {
  return (
    <div className="flex w-[min(60vw,30rem)] shrink-0 flex-col items-start gap-7 pr-(--spacing-gutter)">
      <LotusRule className="w-32 text-gold" />
      <p className="font-display text-2xl leading-[1.15] text-maroon italic">
        Twenty-one years on, the same street still gathers.
      </p>
      <a href="#programme" className="btn btn-ghost">
        See this year&rsquo;s programme
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile — vertical                                                         */
/* -------------------------------------------------------------------------- */

function MobileTimeline() {
  return (
    <div className="shell py-(--spacing-section) lg:hidden">
      <Intro compact />

      <ol className="mt-14">
        {journey.map((chapter) => (
          <li key={chapter.year} className="relative pb-12 pl-7 last:pb-0">
            {/* Continuous spine with a node per year. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-2.5 left-0 h-full w-px",
                chapter.current ? "bg-transparent" : "bg-maroon/15",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-[0.55rem] -left-[3px] size-[7px] rounded-full",
                chapter.current ? "bg-crimson" : "bg-gold",
              )}
            />

            <Reveal>
              <div>
                <ChapterHead
                  year={chapter.year}
                  label={chapter.label}
                  note={chapter.note}
                  current={chapter.current}
                />
                {(chapter.image || chapter.current) && (
                  <Figure
                    className="mt-6"
                    image={chapter.image}
                    ratio="3 / 2"
                    plateLabel={String(chapter.year)}
                    parallax={0}
                    sizes="100vw"
                    tone={chapter.current ? "maroon" : "cream"}
                  />
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal>
        <div className="mt-4 flex flex-col items-start gap-6">
          <LotusRule className="w-28 text-gold" />
          <p className="font-display text-xl leading-[1.2] text-maroon italic">
            Twenty-one years on, the same street still gathers.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
