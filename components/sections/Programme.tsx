"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

import { LotusRule } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { programme, programmeIntro, type ProgrammeEvent } from "@/content";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * PROGRAMME
 *
 * An editorial running order rather than a table: time in the margin, event
 * set in display type, description underneath, hairlines between. It reads
 * like a printed programme, which is what people actually expect a festival
 * schedule to look like.
 *
 * Days are a real tab widget — arrow keys move between them, and only the
 * selected panel is in the accessibility tree.
 */
export function Programme() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const day = programme[active];
  if (!day) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = programme.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section
      id="programme"
      className="relative bg-paper py-(--spacing-section-lg)"
      aria-labelledby="programme-heading"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{programmeIntro.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="programme-heading"
                className="mt-7 font-display text-3xl leading-[0.94] font-light text-maroon"
              >
                {programmeIntro.heading}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="font-display text-xl leading-[1.3] text-char-600 italic">
              {programmeIntro.body}
            </p>
          </Reveal>
        </div>

        {/* --- day selector --- */}
        <Reveal delay={0.12}>
          <div
            role="tablist"
            aria-label="Festival days"
            onKeyDown={onKeyDown}
            className="mt-16 flex items-end gap-9 border-b border-char/12 sm:gap-14 lg:mt-20"
          >
            {programme.map((d, i) => (
              <button
                key={d.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${d.id}`}
                aria-selected={i === active}
                aria-controls={`panel-${d.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className="group relative -mb-px cursor-pointer pb-5 text-left"
              >
                <span
                  className={cn(
                    "block font-display text-2xl leading-none transition-colors duration-500",
                    i === active
                      ? "text-maroon"
                      : "text-char/60 group-hover:text-maroon/70",
                  )}
                >
                  {d.label}
                </span>
                <span
                  className={cn(
                    "mt-2.5 block font-sans text-[0.625rem] tracking-[0.22em] uppercase transition-colors duration-500",
                    i === active ? "text-gold-600" : "text-char/60",
                  )}
                >
                  {d.date ?? "Date to be announced"}
                </span>

                {i === active && (
                  <motion.span
                    layoutId="programme-tab"
                    className="absolute inset-x-0 -bottom-px block h-0.5 bg-crimson"
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* --- panel --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={day.id}
            role="tabpanel"
            id={`panel-${day.id}`}
            aria-labelledby={`tab-${day.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-4">
                <p className="font-display text-xl leading-[1.3] text-maroon">
                  {day.summary}
                </p>

                {day.pending && (
                  <div className="mt-8 border-l-2 border-gold/60 pl-5">
                    <p className="text-sm leading-[1.65] text-char-600">
                      {programmeIntro.pendingNotice}
                    </p>
                  </div>
                )}
              </div>

              <ol className="lg:col-span-8">
                {day.events.map((event, i) => (
                  <EventRow key={event.name} event={event} index={i} />
                ))}
              </ol>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 flex justify-center">
          <LotusRule className="w-40 text-gold/70" />
        </div>
      </div>
    </section>
  );
}

function EventRow({ event, index }: { event: ProgrammeEvent; index: number }) {
  return (
    <motion.li
      data-reveal=""
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: EASE_OUT_EXPO }}
      className="group border-t border-char/10 last:border-b"
    >
      <div className="flex flex-col gap-1.5 py-7 transition-colors duration-500 sm:flex-row sm:gap-8 sm:py-8">
        {/* An unconfirmed time is a rule, not eight repetitions of the same
            sentence — the panel already says the programme is being fixed. */}
        <p
          className={cn(
            "nums w-full shrink-0 font-sans text-[0.75rem] tracking-[0.16em] uppercase sm:w-36",
            event.time ? "text-crimson" : "text-char/60",
          )}
        >
          {event.time ?? (
            <>
              <span aria-hidden="true">&mdash;</span>
              <span className="sr-only">Time to be announced</span>
            </>
          )}
        </p>

        <div className="min-w-0">
          <h3 className="font-display text-xl leading-[1.15] text-maroon">
            {event.name}
          </h3>

          {event.description && (
            <p className="mt-2 max-w-[52ch] text-base leading-[1.6] text-char-600">
              {event.description}
            </p>
          )}

          {event.venue && (
            <p className="mt-3 font-sans text-[0.6875rem] tracking-[0.18em] text-char/60 uppercase">
              {event.venue}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
}
