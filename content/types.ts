/**
 * Shapes for every piece of festival content.
 *
 * Anything the committee has not supplied yet is either absent or explicitly
 * marked. Nothing here is filled with invented stand-in facts.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Two-digit index, used by the section labels and the mobile menu. */
  index: string;
};

export type ImageRef = {
  src: string;
  alt: string;
  /** Intrinsic dimensions, so layout never shifts while loading. */
  width: number;
  height: number;
};

export type JourneyChapter = {
  year: number;
  image?: ImageRef;
  /** Marks the current year — rendered as the open chapter, not a memory. */
  current?: boolean;
};

export type ProgrammeEvent = {
  time: string;
  name: string;
};

export type ProgrammeDay = {
  id: string;
  label: string;
  /** e.g. "18 September 2026" */
  date: string;
  weekday: string;
  events: ProgrammeEvent[];
};

export type CommitteeMember = {
  name: string;
  /** Portfolio held, where one is recorded. */
  role?: string;
  image?: ImageRef;
};

export type ChildrenPerformance = {
  /** Sequence decided by the committee, never computed. */
  sequence: string;
  name: string;
  category: string;
  /** Always presented as approximate. */
  approxTime: string;
  group?: boolean;
};
