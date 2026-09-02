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
 * the grid is 3 columns on a phone and 6 on a desktop, and measuring means
 * "two rows" stays true at both, and after the fonts load.
 */

/**
 * How far into the third row the collapsed grid reaches, as a share of the row
 * pitch. The whole of this band is what dissolves, so it wants to be deep
 * enough to read as "photographs continuing" rather than as a trimmed edge —
 * but a fixed pixel depth cannot do that at every breakpoint, because a row is
 * roughly twice as tall on a desktop as on a phone. Measured, it stays the
 * same gesture on both.
 */
const PEEK_RATIO = 0.34;

/** Opaque until the last row, then dissolved away over the peeking band. */
const fade = (peek: number) =>
  `linear-gradient(to bottom, #000 0, #000 calc(100% - ${peek}px), transparent 100%)`;

export function CommitteeGrid({ members }: { members: CommitteeMember[] }) {
  const grid = useRef<HTMLUListElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [peek, setPeek] = useState(0);
  const [columns, setColumns] = useState(3);
  const [open, setOpen] = useState(false);

  const measure = useCallback(() => {
    const el = grid.current;
    if (!el) return;

    const items = [...el.children] as HTMLElement[];
    if (!items.length) return;

    // Walk the items until the top offset changes twice: that is row three.
    const rowTops: number[] = [];
    let first = 0;
    for (const item of items) {
      const top = item.offsetTop;
      if (!rowTops.includes(top)) rowTops.push(top);
      if (rowTops.length === 1) first += 1;
      if (rowTops.length === 3) break;
    }
    setColumns(first);

    // Fewer than three rows — everything already fits, no toggle needed.
    if (rowTops.length < 3) {
      setCollapsedHeight(null);
      return;
    }

    // Stop a little way into the third row rather than cleanly at the end of
    // the second. That sliver of the next row, fading out, is what tells you
    // there is more — a grid that ends on a tidy boundary just looks like the
    // whole list, and the button alone is easy to miss.
    const peek = Math.round((rowTops[2]! - rowTops[1]!) * PEEK_RATIO);
    setPeek(peek);
    setCollapsedHeight(rowTops[2]! + peek);
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
  // Everything in the first two rows stays tabbable while closed; the column
  // count is read off the grid rather than assumed, so this follows the
  // breakpoint instead of hard-coding one.
  const visible = columns * 2;

  return (
    <div>
      <motion.div
        className="relative"
        animate={{ height: hidden ? collapsedHeight : "auto" }}
        initial={false}
        transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
        style={{
          overflow: hidden ? "hidden" : "visible",
          // A mask rather than a gradient panel laid over the top. An overlay
          // has to be painted in the section's own background colour to
          // work, and it still ends in a hard line where the clip is; a mask
          // dissolves the photographs themselves to nothing, so the grid
          // reads as continuing past the fold instead of being cut off.
          maskImage: hidden ? fade(peek) : undefined,
          WebkitMaskImage: hidden ? fade(peek) : undefined,
        }}
      >
        <ul
          ref={grid}
          // Three across on a phone rather than two, six on a desktop rather
          // than five. The originals are 68-160px brochure scans; at the old
          // widths they were being blown up nearly twice over, which is what
          // made them look both oversized and soft. These widths sit much
          // closer to the photographs' own scale.
          className="grid grid-cols-3 gap-x-3.5 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-10"
        >
          {members.map((member, i) => (
            <li
              key={member.name}
              // Anything past the first two rows is out of the tab order
              // while closed — it is visible, but only as a hint.
              inert={hidden && i >= visible ? true : undefined}
            >
              <Figure
                image={member.image}
                ratio="4 / 5"
                parallax={0}
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 30vw, 15vw"
              />
              <p className="mt-3 font-display text-base leading-tight text-maroon sm:mt-3.5 sm:text-lg">
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
