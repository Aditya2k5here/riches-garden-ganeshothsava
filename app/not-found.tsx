import Link from "next/link";

import { LotusRule } from "@/components/ui/Ornament";
import { festival } from "@/content";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-paper">
      <div className="shell-narrow text-center">
        <p className="eyebrow justify-center before:hidden">
          {festival.organisation}
        </p>
        <h1 className="mt-7 font-display text-3xl leading-[0.98] font-light text-maroon">
          This page isn&rsquo;t here.
        </h1>
        <p className="mt-5 text-lg text-char-600">
          It may have moved, or the link may be from a previous year.
        </p>
        <div className="mt-9 flex justify-center">
          <LotusRule className="w-32 text-gold" />
        </div>
        <Link href="/" className="btn btn-ghost mt-9">
          Back to the festival
        </Link>
      </div>
    </main>
  );
}
