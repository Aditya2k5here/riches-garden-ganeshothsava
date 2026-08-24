"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Figure } from "@/components/ui/Figure";
import type { CommitteeMember } from "@/content";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Twenty-one people is a lot of grid to scroll past on a phone, and the
 * committee is the credits rather than the headline. Two rows show; the rest
 * open on request.
 *
 * The collapsed height is measured from where the third row actually starts
 * rather than being a fixed pixel value or an nth-child rule per breakpoint —
 * the grid is 2 columns on a phone, 3 on a tablet and 5 on a desktop, and
 * measuring means "two rows" stays true at every one of them, and after the
 * fonts load.
 */
export function CommitteeGrid({ members }: { members: CommitteeMember[] }) {
  const grid = useRef<HTMLUListElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const measure = useCallback(() => {
    const el = grid.current;
    if (!el) return;

    const items = [...el.children] as HTMLElement[];
    if (!items.length) return;

    // Walk the items until the top offset changes twice: that is row three.
    const rowTops: number[] = [];
    for (const item of items) {
      const top = item.offsetTop;
      if (!rowTops.includes(top)) rowTops.push(top);
      if (rowTops.length === 3) break;
    }

    // Fewer than three rows — everything already fits, no toggle needed.
    if (rowTops.length < 3) {
      setCollapsedHeight(null);
      return;
    }

    const gap = parseFloat(getComputedStyle(el).rowGap || "0");
    setCollapsedHeight(rowTops[2]! - gap);
  }, []);

  useEffect(() => {
    // Measured on the next frame rather than synchronously: the grid has to
    // have been laid out before its row offsets mean anything.
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (grid.current) ro.observe(grid.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const collapsible = collapsedHeight !== null;
  const hidden = collapsible && !open;

  return (
    <div>
      <motion.div
        className="relative"
        animate={{
          height: hidden ? collapsedHeight : "auto",
        }}
        initial={false}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        style={{ overflow: hidden ? "hidden" : "visible" }}
      >
        <ul
          ref={grid}
          className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-11"
        >
          {members.map((member, i) => (
            <li
              key={member.name}
              // Anything below the fold is out of the tab order while closed.
              inert={hidden && i >= 4 ? true : undefined}
            >
              <Figure
                image={member.image}
                ratio="1 / 1"
                parallax={0}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 17vw"
              />
              <p className="mt-3.5 font-display text-lg leading-tight text-maroon">
                {member.name}
              </p>
              {member.role && (
                <p className="mt-1 font-sans text-[0.625rem] leading-[1.4] tracking-[0.16em] text-gold-600 uppercase">
                  {member.role}
                </p>
              )}
            </li>
          ))}
        </ul>

      </motion.div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="tap mt-10 cursor-pointer font-sans text-[0.6875rem] tracking-[0.2em] text-gold-600 uppercase transition-colors duration-500 hover:text-maroon"
        >
          {open ? "Show fewer" : `All ${members.length} members`}
          <motion.span
            aria-hidden="true"
            className="ml-3 inline-block"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            ↓
          </motion.span>
        </button>
      )}
    </div>
  );
}
