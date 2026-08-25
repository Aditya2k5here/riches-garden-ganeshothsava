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
/**
 * How far into the third row the collapsed grid reaches. The whole of this
 * band is what dissolves, so it wants to be deep enough to read as
 * "photographs continuing" rather than as a trimmed edge.
 */
const PEEK = 118;

/** Opaque until the last row, then dissolved away over the peeking band. */
const FADE = `linear-gradient(to bottom, #000 0, #000 calc(100% - ${PEEK}px), transparent 100%)`;

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

    // Stop a little way into the third row rather than cleanly at the end of
    // the second. That sliver of the next row, fading out, is what tells you
    // there is more — a grid that ends on a tidy boundary just looks like the
    // whole list, and the button alone is easy to miss.
    setCollapsedHeight(rowTops[2]! + PEEK);
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
          maskImage: hidden ? FADE : undefined,
          WebkitMaskImage: hidden ? FADE : undefined,
        }}
      >
        <ul
          ref={grid}
          className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-11"
        >
          {members.map((member, i) => (
            <li
              key={member.name}
              // Anything past the first two rows is out of the tab order
              // while closed — it is visible, but only as a hint.
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
