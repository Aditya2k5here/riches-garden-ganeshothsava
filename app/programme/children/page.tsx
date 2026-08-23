import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LotusRule } from "@/components/ui/Ornament";
import {
  brand,
  childrensSchedule,
  childrensScheduleMeta,
  contact,
  festival,
} from "@/content";

/**
 * CHILDREN'S CULTURAL PROGRAMME — the shareable running order.
 *
 * A standalone page on purpose: once registrations close and the committee
 * has fixed the order, this is the single link that goes into the WhatsApp
 * group. It has to open fast on a phone, print cleanly, and be readable by a
 * parent standing next to a stage — so it is plain, large, and has no
 * navigation to get lost in.
 *
 * The order is human-decided. Nothing here computes a sequence; it renders
 * exactly the list the committee pastes into content/children.ts. Every
 * timing is labelled approximate, because on the day it always is.
 */

export const metadata: Metadata = {
  title: `Children's Cultural Programme ${festival.year}`,
  description: `The performance order for the children's cultural programme at ${festival.name} ${festival.year}.`,
  robots: { index: false, follow: true },
};

export default function ChildrensProgrammePage() {
  const published = childrensSchedule.length > 0;

  return (
    <main className="min-h-svh bg-paper">
      {/* --- masthead --- */}
      <header className="on-dark grain relative isolate overflow-hidden bg-maroon-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 110%, rgba(168,23,53,0.6) 0%, rgba(168,23,53,0) 62%)",
          }}
        />

        <div className="shell-narrow py-14 text-center sm:py-20">
          <Link
            href="/"
            className="inline-block"
            aria-label={`${festival.organisation} — home`}
          >
            <Image
              src={brand.logoReversed.src}
              alt={brand.logoReversed.alt}
              width={brand.logoReversed.width}
              height={brand.logoReversed.height}
              sizes="180px"
              priority
              className="mx-auto h-auto w-[9.5rem] sm:w-[11rem]"
            />
          </Link>

          <p className="eyebrow mt-14 justify-center before:hidden">
            {festival.edition} Year · {festival.year}
          </p>

          <h1 className="mt-5 font-display text-2xl leading-[1.05] font-light text-cream-300">
            Children&rsquo;s
            <span className="block text-gold italic">Cultural Programme</span>
          </h1>

          <div className="mt-8 flex justify-center">
            <LotusRule className="w-40 text-gold/70" />
          </div>
        </div>
      </header>

      {/* --- running order --- */}
      <div className="shell-narrow py-(--spacing-section)">
        {published ? (
          <>
            <ol>
              {childrensSchedule.map((item) => (
                <li
                  key={item.sequence}
                  className="flex items-baseline gap-5 border-t border-char/12 py-6 last:border-b sm:gap-8 sm:py-7"
                >
                  <span className="nums shrink-0 font-display text-2xl leading-none text-gold-600">
                    {item.sequence}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl leading-tight text-maroon">
                      {item.name}
                      {item.group && (
                        <span className="ml-3 align-middle font-sans text-[0.5625rem] tracking-[0.2em] text-crimson uppercase">
                          Group
                        </span>
                      )}
                    </h2>
                    <p className="mt-1.5 font-sans text-[0.6875rem] tracking-[0.18em] text-char/60 uppercase">
                      {item.category}
                    </p>
                  </div>

                  <p className="nums shrink-0 text-right font-sans text-[0.75rem] tracking-[0.1em] text-char-600">
                    <span className="block text-[0.5625rem] tracking-[0.2em] text-char/60 uppercase">
                      Approx.
                    </span>
                    {item.approxTime}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-10 max-w-[52ch] text-base leading-[1.7] text-char-600">
              {childrensScheduleMeta.note}
            </p>

            {childrensScheduleMeta.publishedOn && (
              <p className="mt-4 font-sans text-[0.625rem] tracking-[0.2em] text-char/60 uppercase">
                Published {childrensScheduleMeta.publishedOn}
              </p>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-[46ch] text-center">
            <h2 className="font-display text-2xl leading-[1.15] text-maroon">
              Not published yet.
            </h2>
            <p className="mt-5 text-lg leading-[1.7] text-char-600">
              Registration closes two days before the event. The committee
              fixes the performance order after that, and the full running
              order with approximate timings appears here.
            </p>
            <Link href="/#children" className="btn btn-ghost mt-10">
              Children&rsquo;s events
            </Link>
          </div>
        )}

        {/* --- foot --- */}
        <div className="mt-20 border-t border-char/12 pt-8 text-center">
          <p className="font-display text-lg text-maroon">
            {festival.organisation}
          </p>
          <p className="mt-2 text-sm text-char-600">
            {contact.address.lines.join(" · ")}
          </p>
          <Link
            href="/"
            className="link-underline tap mt-6 font-sans text-[0.6875rem] tracking-[0.18em] text-gold-600 uppercase"
          >
            Back to the festival
          </Link>
        </div>
      </div>
    </main>
  );
}
