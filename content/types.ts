/**
 * Shapes for every piece of festival content.
 *
 * `pending: true` marks content the committee has not supplied yet. Sections
 * read that flag and degrade to a composed, finished-looking state rather
 * than rendering an empty hole — and nothing anywhere is invented to fill it.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type JourneyChapter = {
  year: number;
  /** Short factual label, e.g. "The first year". Never speculative. */
  label: string;
  /** Optional narrative. Left empty until the committee writes it. */
  note?: string;
  image?: ImageRef;
  /** Marks 2026 — rendered as the current chapter, not a memory. */
  current?: boolean;
};

export type ImageRef = {
  src: string;
  alt: string;
  /** Intrinsic dimensions, so layout never shifts while loading. */
  width: number;
  height: number;
};

export type ProgrammeEvent = {
  /** Null renders as "To be announced". We do not guess times. */
  time: string | null;
  name: string;
  description?: string;
  venue?: string;
};

export type ProgrammeDay = {
  id: string;
  /** e.g. "Day One" */
  label: string;
  /** Null until the 2026 dates are fixed. */
  date: string | null;
  /** One-line character of the day. */
  summary: string;
  events: ProgrammeEvent[];
  pending?: boolean;
};

export type CommitteeMember = {
  name: string;
  /** Portfolio held, where one is recorded. */
  role?: string;
  image?: ImageRef;
};

export type ContributionTier = {
  title: string;
  detail?: string;
};

export type ChildrenPerformance = {
  /** Sequence number decided by the committee, never computed. */
  sequence: string;
  name: string;
  category: string;
  /** Always presented as approximate. */
  approxTime: string;
  group?: boolean;
};
