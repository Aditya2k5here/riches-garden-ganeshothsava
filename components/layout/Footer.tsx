import Image from "next/image";
import Link from "next/link";

import { LotusRule } from "@/components/ui/Ornament";
import { brand, contact, festival, nav } from "@/content";

/**
 * FOOTER
 *
 * The full committee lockup gets its proper size here — this is the one place
 * on the page with room for it. It is the reversed (cream) tint of the same
 * artwork so it sits on maroon without a white plate behind it.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark grain relative isolate overflow-hidden bg-maroon-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(168,23,53,0.45) 0%, rgba(168,23,53,0) 65%)",
        }}
      />

      <div className="shell py-(--spacing-section)">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          {/* --- mark --- */}
          <div className="lg:col-span-5">
            <Image
              src={brand.logoReversed.src}
              alt={brand.logoReversed.alt}
              width={brand.logoReversed.width}
              height={brand.logoReversed.height}
              sizes="(max-width: 1024px) 240px, 280px"
              className="h-auto w-[15rem] lg:w-[17.5rem]"
            />

            <p className="font-kannada mt-8 text-base text-gold-300/85">
              {festival.organisationKannada}
            </p>

            <address className="mt-5 text-base leading-[1.7] text-cream/75 not-italic">
              {contact.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          {/* --- links --- */}
          <nav
            aria-label="Footer"
            className="lg:col-span-3 lg:col-start-7"
          >
            <p className="eyebrow">Explore</p>
            <ul className="mt-6 columns-2 gap-8 lg:columns-1">
              {nav.map((item) => (
                <li key={item.href} className="mb-3">
                  <a
                    href={item.href}
                    className="link-underline tap text-base text-cream/80"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- this year --- */}
          <div className="lg:col-span-3 lg:col-start-10">
            <p className="eyebrow">This year</p>
            <p className="mt-6 font-display text-2xl leading-[1.05] text-cream-300">
              {festival.edition} year
              <span className="block text-gold italic">{festival.year}</span>
            </p>
            <LotusRule className="mt-7 w-28 text-gold/70" />
            <p className="mt-6 max-w-[26ch] font-display text-lg leading-[1.4] text-cream/75 italic">
              {festival.tagline}
            </p>
          </div>
        </div>

        {/* --- small print --- */}
        <div className="mt-16 flex flex-col gap-4 border-t border-cream/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.6875rem] tracking-[0.14em] text-cream/75">
            © {year} {festival.organisation}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <Link
              href="/programme/children"
              className="link-underline tap font-sans text-[0.6875rem] tracking-[0.14em] text-cream/75 uppercase"
            >
              Children&rsquo;s programme order
            </Link>
            <a
              href="#hero"
              className="link-underline tap font-sans text-[0.6875rem] tracking-[0.14em] text-cream/75 uppercase"
            >
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
