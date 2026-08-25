"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { nav, programme } from "@/content";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO, inView } from "@/lib/motion";

/**
 * PROGRAMME
 *
 * Kept in English only, at the committee's request — this is the schedule
 * exactly as it is printed on the card, and translating a running order that
 * people cross-check against a piece of paper only invites mismatches.
 *
 * An editorial running order rather than a table: time in the margin, event
 * in display type, hairlines between. Days are a real tab widget — arrow
 * keys move between them, and only the selected panel is in the
 * accessibility tree.
 */
export function Programme() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const label = nav[1]!;

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
      className="relative bg-paper pt-8 pb-(--spacing-section-lg) sm:pt-(--spacing-section-lg)"
      aria-labelledby="programme-heading"
    >
      <div className="shell">
        <Reveal>
          <SectionLabel index={label.index} label={label.label} />
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="programme-heading"
            className="mt-6 font-display text-3xl leading-[0.96] font-light text-maroon sm:mt-9"
          >
            Three days
            <span className="block text-crimson italic">of celebration.</span>
          </h2>
        </Reveal>

        {/* --- day selector --- */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Festival days"
            onKeyDown={onKeyDown}
            className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-char/12 sm:mt-14 sm:gap-x-12 lg:mt-20"
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
                className="group relative -mb-px cursor-pointer pb-4 text-left"
              >
                <span
                  className={cn(
                    "block font-display text-xl leading-none transition-colors duration-500",
                    i === active
                      ? "text-maroon"
                      : "text-char/50 group-hover:text-maroon/70",
                  )}
                >
                  {d.label}
                </span>
                <span
                  className={cn(
                    "figure-display mt-2 block text-base leading-none transition-colors duration-500",
                    i === active ? "text-gold-600" : "text-char/60",
                  )}
                >
                  {d.date.replace(" 2026", "")}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-4">
                <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-600 uppercase">
                  {day.weekday}
                </p>
                <p className="figure-display mt-3 text-2xl leading-[1.05] text-maroon">
                  {day.date}
                </p>
              </div>

              <ol className="lg:col-span-8">
                {day.events.map((event, i) => (
                  <motion.li
                    key={event.name}
                    data-reveal=""
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inView}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="border-t border-char/10 last:border-b"
                  >
                    {/* The time is the thing people are scanning for, so it
                        is set at the same size as the event and in the
                        display face — not shrunk into a small-caps margin
                        note the way schedules usually treat it. */}
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-9 sm:py-7">
                      <p className="figure-display w-full shrink-0 text-xl leading-none text-crimson sm:w-32">
                        {event.time}
                      </p>
                      <h3 className="min-w-0 font-display text-xl leading-[1.25] text-maroon">
                        {event.name}
                      </h3>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
