"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { inView, rise, stagger } from "@/lib/motion";

/**
 * Scroll reveals.
 *
 * Every wrapper carries `data-reveal`, which the no-JavaScript stylesheet in
 * the root layout uses to force the hidden starting state back to visible.
 * Motion components render their `initial` styles during SSR, so without that
 * escape hatch the page would arrive blank for anyone without JS.
 *
 * The motion components are declared once at module scope rather than built
 * from an `as` string at render time — creating a component during render
 * would remount the subtree on every pass.
 */

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  figure: motion.figure,
} as const;

type TagName = keyof typeof TAGS;

/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variants = rise,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. Staggering a parent is usually better than delaying children. */
  delay?: number;
  as?: TagName;
  variants?: Variants;
}) {
  const Tag = TAGS[as];

  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Parent for a run of `<RevealItem>`s. */
export function RevealGroup({
  children,
  className,
  step = 0.09,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  as?: TagName;
}) {
  const Tag = TAGS[as];

  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={stagger(step, delay)}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  variants = rise,
}: {
  children: ReactNode;
  className?: string;
  as?: TagName;
  variants?: Variants;
}) {
  const Tag = TAGS[as];

  return (
    <Tag data-reveal="" className={className} variants={variants}>
      {children}
    </Tag>
  );
}

/**
 * Reveals a heading line by line, each line clipped so the type slides up out
 * of its own mask. The full string stays in one node for screen readers, and
 * the animated copy is hidden from them.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  id,
}: {
  lines: readonly string[];
  className?: string;
  /**
   * One class for every line, or an array to style them individually.
   * An array rather than a callback, so server components can pass it.
   */
  lineClassName?: string | ReadonlyArray<string | undefined>;
  as?: ElementType;
  delay?: number;
  id?: string;
}) {
  const lineClass = (i: number) =>
    Array.isArray(lineClassName)
      ? lineClassName[i]
      : (lineClassName as string | undefined);

  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{lines.join(" ")}</span>

      <motion.span
        data-reveal=""
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        variants={stagger(0.08, delay)}
      >
        {lines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={cn("block", lineClass(i))}
              variants={{
                hidden: { y: "108%" },
                visible: {
                  y: "0%",
                  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
