import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";

import { Amount } from "@/components/ui/Amount";
import { Reveal, RevealGroup, RevealItem, RevealLines } from "@/components/ui/Reveal";
import {
  donationsIntro,
  donorTier,
  membership,
  sponsorships,
  upi,
} from "@/content";

/**
 * DONATIONS
 *
 * Money sections have to look trustworthy above all else, so this one is
 * quiet: no urgency, no progress bars, no "only 3 days left". Just what a
 * contribution costs, what it pays for, and who is accounting for it.
 *
 * The payment panel only renders what actually exists. No UPI ID in the
 * environment means no half-finished payment box — the panel falls back to
 * "ask a committee member", which is true and useful.
 */

/** Server component, so it can simply look and see whether the QR is there. */
function qrExists() {
  try {
    return existsSync(path.join(process.cwd(), "public", "donate", "upi-qr.png"));
  } catch {
    return false;
  }
}

export function Donations() {
  const hasQr = qrExists();
  const hasUpi = Boolean(upi.id);

  return (
    <section
      id="donations"
      className="relative bg-cream py-(--spacing-section-lg)"
      aria-labelledby="donations-heading"
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          {/* --- words --- */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">{donationsIntro.eyebrow}</p>
            </Reveal>

            <RevealLines
              as="h2"
              id="donations-heading"
              lines={donationsIntro.heading}
              delay={0.05}
              className="mt-7 font-display text-3xl leading-[0.94] font-light text-maroon"
              lineClassName={[undefined, "text-crimson italic"]}
            />

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[46ch] text-lg leading-[1.7] text-char-600">
                {donationsIntro.body}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-maroon/15 pt-8">
                <Amount
                  value={membership.amount}
                  className="nums font-display text-3xl leading-none text-maroon"
                />
                <span className="font-sans text-[0.6875rem] tracking-[0.2em] text-gold-600 uppercase">
                  {membership.unit}
                </span>
                <span className="w-full text-base text-char-600">
                  {membership.title}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-8 max-w-[46ch] text-sm leading-[1.65] text-char-600/85">
                {donationsIntro.assurance}
              </p>
            </Reveal>
          </div>

          {/* --- payment panel --- */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <div className="on-dark grain relative overflow-hidden bg-maroon-900 p-8 sm:p-10">
              {/* Double inset rule — the device printed festival brochures
                  have used for a century, and steadier than corner curls. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-gold/25"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[0.9375rem] border border-gold/12"
              />

              <div className="relative">
                <p className="eyebrow">Contribute by UPI</p>

                {hasQr ? (
                  <div className="mt-8 inline-block bg-cream-300 p-3">
                    <Image
                      src={upi.qr.src}
                      alt={upi.qr.alt}
                      width={upi.qr.width}
                      height={upi.qr.height}
                      sizes="220px"
                      className="size-[13.75rem] object-contain"
                    />
                  </div>
                ) : (
                  <div className="mt-8 grid aspect-square w-[13.75rem] place-items-center border border-dashed border-cream/25">
                    <p className="px-6 text-center font-sans text-[0.625rem] leading-relaxed tracking-[0.16em] text-cream/75 uppercase">
                      QR code
                      <br />
                      to be added
                    </p>
                  </div>
                )}

                <dl className="mt-8 border-t border-cream/15 pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <dt className="font-sans text-[0.625rem] tracking-[0.2em] text-gold-300/85 uppercase">
                      Payable to
                    </dt>
                    <dd className="font-display text-lg text-cream-300">
                      {upi.payee}
                    </dd>
                  </div>

                  {hasUpi && (
                    <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <dt className="font-sans text-[0.625rem] tracking-[0.2em] text-gold-300/85 uppercase">
                        UPI ID
                      </dt>
                      <dd className="nums font-display text-lg break-all text-cream-300">
                        {upi.id}
                      </dd>
                    </div>
                  )}
                </dl>

                {!hasUpi && (
                  <p className="mt-5 text-sm leading-[1.6] text-cream/75">
                    Payment details are being confirmed for this year. Any
                    committee member can take your contribution in the
                    meantime.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* --- what it pays for --- */}
        <div className="mt-20 lg:mt-24">
          <Reveal>
            <p className="eyebrow">Where contributions go</p>
          </Reveal>

          <RevealGroup
            as="ul"
            step={0.06}
            className="mt-9 grid border-t border-maroon/15 sm:grid-cols-2 sm:gap-x-14 lg:grid-cols-3 lg:gap-x-16"
          >
            {sponsorships.map((tier) => (
              <RevealItem
                as="li"
                key={tier.title}
                className="border-b border-maroon/15 py-6"
              >
                <h3 className="font-display text-xl leading-tight text-maroon">
                  {tier.title}
                </h3>
                {tier.detail && (
                  <p className="mt-2 text-base leading-[1.6] text-char-600">
                    {tier.detail}
                  </p>
                )}
              </RevealItem>
            ))}

            <RevealItem
              as="li"
              className="border-b border-maroon/15 py-6"
            >
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-xl leading-tight text-crimson">
                  {donorTier.title}
                </h3>
                <span className="nums font-sans text-[0.6875rem] tracking-[0.18em] text-gold-600">
                  {donorTier.amount}
                </span>
              </div>
              <p className="mt-2 text-base leading-[1.6] text-char-600">
                {donorTier.detail}
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
