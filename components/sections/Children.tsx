import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealGroup, RevealItem, RevealLines } from "@/components/ui/Reveal";
import {
  childrensEvents,
  festival,
  registrationFormUrl,
  registrationIdFormat,
} from "@/content";

/**
 * CHILDREN'S EVENTS
 *
 * The section the festival is really about, so the page changes colour for
 * it: everything before is warm white, this is deep maroon. The shift does
 * more work than any amount of decoration could.
 *
 * Registration is a Google Form — deliberately. A community committee should
 * not have to maintain a database, and the form already feeds the sheet they
 * order the programme from.
 */
export function Children() {
  const open = Boolean(registrationFormUrl);

  const shareText = `${festival.name} ${festival.year} — children's cultural programme registration: ${registrationFormUrl}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <section
      id="children"
      className="on-dark grain relative isolate overflow-hidden bg-maroon-900 py-(--spacing-section-lg)"
      aria-labelledby="children-heading"
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
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          {/* --- statement --- */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{childrensEvents.eyebrow}</p>
            </Reveal>

            <RevealLines
              as="h2"
              id="children-heading"
              lines={childrensEvents.statement}
              delay={0.05}
              className="mt-7 font-display text-4xl leading-[0.92] font-light text-cream-300"
              lineClassName={[undefined, "text-gold italic"]}
            />

            <div className="mt-9 max-w-[46ch]">
              {childrensEvents.body.map((para, i) => (
                <Reveal
                  key={para}
                  delay={0.1 + i * 0.06}
                  className={i > 0 ? "mt-6" : undefined}
                >
                  <p className="text-lg leading-[1.7] text-cream/80">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* --- figure --- */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <Figure
              ratio="4 / 5"
              tone="maroon"
              plateLabel="Children's cultural programme"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>

        {/* --- categories --- */}
        <RevealGroup
          as="ul"
          className="mt-20 grid gap-x-12 border-t border-cream/15 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
          step={0.06}
        >
          {childrensEvents.categories.map((category, i) => (
            <RevealItem
              as="li"
              key={category}
              className="flex items-baseline gap-5 border-b border-cream/15 py-6"
            >
              <span className="nums font-sans text-[0.625rem] tracking-[0.2em] text-gold-300/85">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl leading-none text-cream-300">
                {category}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* --- rules + registration --- */}
        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          <Reveal className="lg:col-span-5">
            <dl>
              {childrensEvents.rules.map((rule) => (
                <div
                  key={rule.term}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cream/12 py-4 first:border-t"
                >
                  <dt className="font-sans text-[0.6875rem] tracking-[0.2em] text-gold-300/85 uppercase">
                    {rule.term}
                  </dt>
                  <dd className="font-display text-lg text-cream-300">
                    {rule.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm leading-[1.65] text-cream/75">
              {childrensEvents.duplicateNotice}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col items-start gap-6">
              {open ? (
                <>
                  <a
                    href={registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                  >
                    Register now
                    <span aria-hidden="true">&rarr;</span>
                  </a>

                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline tap font-sans text-[0.75rem] tracking-[0.14em] text-cream/75 uppercase"
                  >
                    Share the form on WhatsApp
                  </a>
                </>
              ) : (
                <div className="border-l-2 border-gold/60 pl-5">
                  <p className="font-display text-xl text-cream-300">
                    Registration opens soon.
                  </p>
                  <p className="mt-2 max-w-[42ch] text-sm leading-[1.65] text-cream/75">
                    The registration form for {festival.year} is being prepared.
                    Check back shortly, or speak to any committee member.
                  </p>
                </div>
              )}

              <p className="max-w-[46ch] text-base leading-[1.7] text-cream/75">
                {childrensEvents.afterNotice}
              </p>

              <div className="mt-2 w-full border-t border-cream/12 pt-6">
                <p className="font-sans text-[0.625rem] tracking-[0.24em] text-gold-300/85 uppercase">
                  Registration numbers
                </p>
                <p className="nums mt-3 font-display text-lg text-cream/85">
                  {registrationIdFormat.individual.example}
                  <span className="text-cream/75"> · individual</span>
                </p>
                <p className="nums mt-1 font-display text-lg text-cream/85">
                  {registrationIdFormat.group.example}
                  <span className="text-cream/75"> · one number per group</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
