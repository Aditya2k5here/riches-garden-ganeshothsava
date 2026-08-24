import type { ElementType } from "react";

import { cn } from "@/lib/cn";

/**
 * The label that opens a section.
 *
 * Replaces the old eyebrow, which drew a short rule before its text — across
 * six sections that rule became the site's most repeated element. A stacked
 * index numeral announces the section just as clearly, gives the page a
 * spine of numbers to navigate by, and adds no lines at all.
 */
export function SectionLabel({
  index,
  label,
  className,
  tone = "light",
  as: Tag = "p",
  id,
}: {
  /** Two digits, e.g. "03". Sequence is the page order. */
  index: string;
  label: string;
  className?: string;
  tone?: "light" | "dark";
  /** Pass "h2" where the label is genuinely the section's heading. */
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("flex flex-col gap-2", className)}>
      <span
        className={cn(
          "nums text-[0.625rem] leading-none tracking-[0.2em]",
          tone === "dark" ? "text-gold-300" : "text-gold-600",
        )}
      >
        {index}
      </span>
      <span
        className={cn(
          "font-sans text-[0.6875rem] leading-none font-medium tracking-[0.24em] uppercase",
          tone === "dark" ? "text-cream/75" : "text-char-600",
        )}
      >
        {label}
      </span>
    </Tag>
  );
}
