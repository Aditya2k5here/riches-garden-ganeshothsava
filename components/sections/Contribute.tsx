import Image from "next/image";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { contribute, kannada, nav, upi } from "@/content";

/**
 * CONTRIBUTE
 *
 * One QR, one line, one ID. The membership amount, the tier list and the
 * breakdown of what the money buys are all gone at the committee's request —
 * a page that itemises its own budget reads like a fundraising appeal, and
 * this is a neighbourhood putting in for its own festival.
 */
export function Contribute() {
  const label = nav[3]!;

  return (
    <section
      id="contribute"
      className="on-dark grain relative isolate overflow-hidden bg-maroon-900 py-(--spacing-section-lg)"
      aria-labelledby="contribute-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 80% 10%, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0) 60%), radial-gradient(90% 70% at 10% 100%, rgba(168,23,53,0.5) 0%, rgba(168,23,53,0) 62%)",
        }}
      />

      <div className="shell">
        <Reveal>
          <SectionLabel index={label.index} label={label.label} tone="dark" />
        </Reveal>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <div className="lg:col-span-6">
            <Reveal delay={0.05}>
              <h2
                id="contribute-heading"
                className="font-display text-3xl leading-[0.96] font-light text-cream-300"
              >
                {contribute.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.09}>
              <p lang="kn" className="font-kannada-display mt-4 text-2xl text-gold">
                {kannada.contribute}
              </p>
            </Reveal>

            <Reveal delay={0.13}>
              <p className="mt-7 max-w-[30ch] font-display text-xl leading-[1.35] text-cream/85 italic">
                {contribute.line}
              </p>
              <p className="mt-2 max-w-[32ch] text-base leading-[1.6] text-cream/75">
                {contribute.sub}
              </p>
            </Reveal>
          </div>

          {/* --- the code --- */}
          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <div className="inline-flex flex-col items-center">
              <div className="bg-cream-300 p-4">
                <Image
                  src={upi.qr.src}
                  alt={upi.qr.alt}
                  width={upi.qr.width}
                  height={upi.qr.height}
                  // Served exactly as authored, not re-encoded. Every other
                  // image on the site goes through AVIF conversion, which is
                  // right for photographs and wrong for a payment code — a
                  // lossy pass softens the module edges and can cost a scan.
                  unoptimized
                  sizes="(max-width: 640px) 66vw, 260px"
                  // Large enough to scan comfortably from a second phone.
                  className="size-[15rem] object-contain sm:size-[16.25rem]"
                />
              </div>

              <p className="mt-5 text-center font-sans text-[0.6875rem] tracking-[0.18em] text-cream/75 uppercase">
                {contribute.scan}
              </p>
              <p
                lang="kn"
                className="font-kannada mt-1.5 text-center text-[0.8125rem] text-cream/75"
              >
                {kannada.scan}
              </p>
              <p className="nums mt-3 text-center font-sans text-[0.9375rem] tracking-[0.02em] break-all text-gold">
                {upi.id}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
