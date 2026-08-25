import { QrCode } from "@/components/ui/QrCode";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  nav,
  registrationFormUrl,
  registrationIsPlaceholder,
  stageEvents,
} from "@/content";

/**
 * STAGE EVENTS
 *
 * This section used to open with three paragraphs about how the children's
 * programme is the heart of the festival. It is — which is exactly why it
 * does not need saying. A parent scanning this on a phone wants to know what
 * their child can perform, how long they get, and where to sign up. That is
 * now the entire section.
 *
 * The maroon field stays. It is the strongest thing on the page and it does
 * the emotional work the deleted copy was attempting.
 */
export function Stage() {
  const label = nav[2]!;

  return (
    <section
      id="stage"
      className="on-dark grain relative isolate overflow-hidden bg-maroon-900 pt-(--spacing-section-lg) pb-(--spacing-section)"
      aria-labelledby="stage-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(90% 60% at 15% 0%, rgba(168,23,53,0.55) 0%, rgba(168,23,53,0) 62%), radial-gradient(70% 50% at 92% 100%, rgba(200,155,60,0.16) 0%, rgba(200,155,60,0) 60%)",
        }}
      />

      <div className="shell">
        <Reveal>
          <SectionLabel
            as="h2"
            id="stage-heading"
            index={label.index}
            label={label.label}
            tone="dark"
          />
        </Reveal>

        {/* --- what can be performed --- */}

        {/* On a phone the numbered grid stacked into six tall rows, and the
            01–06 column earned none of the height it took. The same six
            categories run as one wrapped line instead. From the small
            breakpoint up the numbered grid is unchanged. */}
        <Reveal delay={0.05} className="mt-8 block sm:hidden">
          <ul className="flex flex-wrap gap-x-2.5 gap-y-2">
            {stageEvents.categories.map((category) => (
              <li
                key={category}
                className="flex items-baseline gap-2.5 font-display text-lg leading-tight text-cream-300"
              >
                <span aria-hidden="true" className="text-gold">
                  &middot;
                </span>
                {category}
              </li>
            ))}
          </ul>
        </Reveal>

        <RevealGroup
          as="ul"
          step={0.05}
          className="mt-12 hidden gap-x-12 sm:grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {stageEvents.categories.map((category, i) => (
            <RevealItem
              as="li"
              key={category}
              className="flex items-baseline gap-5 border-b border-cream/15 py-6 sm:[&:nth-child(-n+2)]:border-t lg:[&:nth-child(3)]:border-t"
            >
              <span className="nums font-sans text-[0.625rem] tracking-[0.2em] text-gold-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl leading-none text-cream-300">
                {category}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* --- rules and registration --- */}
        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          {/* Term above value, not term-left value-right: with no leader
              dots between them a split pair just reads as two lost columns. */}
          <Reveal className="lg:col-span-6">
            <dl className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
              {stageEvents.rules.map((rule) => (
                <div key={rule.term}>
                  <dt className="font-sans text-[0.625rem] leading-[1.4] tracking-[0.18em] text-gold-300 uppercase">
                    {rule.term}
                  </dt>
                  <dd className="figure-display mt-2 text-lg leading-tight text-cream-300">
                    {rule.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal
            id="register"
            delay={0.08}
            className="scroll-mt-24 lg:col-span-5 lg:col-start-8"
          >
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div className="sm:pt-1">
                <p className="font-display text-2xl leading-[1.1] text-gold">
                  {stageEvents.registrationOpen}
                </p>

                <a
                  href={registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-6"
                >
                  {stageEvents.register}
                  <span aria-hidden="true">&rarr;</span>
                </a>

                {registrationIsPlaceholder && (
                  <p className="mt-4 max-w-[26ch] text-[0.8125rem] leading-[1.5] text-cream/75">
                    Placeholder link — set the form URL before publishing.
                  </p>
                )}
              </div>

              <div className="shrink-0">
                {/* Sized for scanning, not for layout: a real Google Forms
                    URL is far longer than the placeholder and produces a
                    denser code, so the modules need the room. */}
                <div className="w-48 bg-cream-300 p-3.5">
                  <QrCode
                    value={registrationFormUrl}
                    label="QR code linking to the stage events registration form"
                    className="text-maroon-900"
                  />
                </div>
                <p className="mt-3 font-sans text-[0.625rem] tracking-[0.16em] text-cream/75 uppercase">
                  Scan to register
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
