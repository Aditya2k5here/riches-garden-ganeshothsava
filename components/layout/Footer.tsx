import Image from "next/image";

import { brand, contact, festival, kannada, nav } from "@/content";

/**
 * FOOTER
 *
 * The full committee lockup gets its proper size here — this is the one
 * place on the page with room for it. It is the reversed (cream) tint of the
 * same artwork so it sits on maroon without a white plate behind it.
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
            "radial-gradient(80% 60% at 50% 0%, rgba(168,23,53,0.4) 0%, rgba(168,23,53,0) 65%)",
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
              sizes="(max-width: 1024px) 220px, 260px"
              className="h-auto w-[13.75rem] lg:w-[16.25rem]"
            />

            <p lang="kn" className="font-kannada mt-8 text-base text-gold-300">
              {kannada.committee}
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
          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-300 uppercase">
              Explore
            </p>
            <ul className="mt-6 columns-2 gap-8 lg:columns-1">
              {nav.map((item) => (
                <li key={item.href} className="mb-2.5">
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
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-300 uppercase">
              {festival.edition}
            </p>
            <p className="figure-display mt-4 text-xl leading-[1.3] text-cream-300">
              {festival.dates}
            </p>
            <p className="mt-6 max-w-[24ch] font-display text-lg leading-[1.4] text-cream/75 italic">
              {festival.tagline}
            </p>
            <p lang="kn" className="font-kannada mt-6 text-[0.9375rem] text-gold-300">
              {kannada.allWelcome}
            </p>
          </div>
        </div>

        {/* --- small print --- */}
        <div className="mt-16 flex flex-col gap-4 border-t border-cream/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.6875rem] tracking-[0.14em] text-cream/75">
            © {year} {festival.organisation}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
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
