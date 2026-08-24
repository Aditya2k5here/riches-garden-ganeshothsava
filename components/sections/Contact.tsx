import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { contact, festival, kannada, nav } from "@/content";

/**
 * CONTACT
 *
 * Where, who, when. The address is left in English in both language modes —
 * it is what a maps app and a courier will match against, and transliterating
 * a street name helps nobody find the pandal.
 */
export function Contact() {
  const label = nav[4]!;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contact.address.mapsQuery,
  )}`;

  return (
    <section
      id="contact"
      className="relative bg-paper py-(--spacing-section-lg)"
      aria-labelledby="contact-heading"
    >
      <div className="shell">
        <Reveal>
          <SectionLabel index={label.index} label={label.label} />
        </Reveal>

        <div className="mt-12 lg:mt-16">
          <RevealLines
            as="h2"
            id="contact-heading"
            lines={contact.heading}
            className="max-w-[15ch] font-display text-3xl leading-[0.96] font-light text-maroon"
            lineClassName={[undefined, "text-crimson italic"]}
          />
          <Reveal delay={0.14}>
            <p lang="kn" className="font-kannada-display mt-6 text-2xl text-gold-600">
              {kannada.comeCelebrate}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          {/* --- where --- */}
          <Reveal className="lg:col-span-4">
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-600 uppercase">
              Where
            </p>
            <address className="mt-5 font-display text-lg leading-[1.5] text-maroon not-italic">
              {contact.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline tap mt-5 font-sans text-[0.6875rem] tracking-[0.18em] text-gold-600 uppercase"
            >
              Open in maps
            </a>
          </Reveal>

          {/* --- who --- */}
          <Reveal delay={0.06} className="lg:col-span-4">
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-600 uppercase">
              Who to ask
            </p>
            <ul className="mt-5 flex flex-col gap-5">
              {contact.people.map((person) => (
                <li key={person.name}>
                  <p className="font-display text-xl leading-tight text-maroon">
                    {person.name}
                  </p>
                  <p className="mt-1 font-sans text-[0.625rem] tracking-[0.18em] text-gold-600 uppercase">
                    {person.role}
                  </p>
                  {person.phone && (
                    <a
                      href={`tel:+91${person.phone}`}
                      className="nums link-underline tap mt-1.5 text-base text-char-600"
                    >
                      +91 {person.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* --- when --- */}
          <Reveal
            delay={0.12}
            className="sm:col-span-2 lg:col-span-3 lg:col-start-10"
          >
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-gold-600 uppercase">
              {festival.edition}
            </p>
            <p className="figure-display mt-4 text-xl leading-[1.3] text-maroon">
              {festival.dates}
            </p>
            <p className="mt-8 font-sans text-[0.625rem] tracking-[0.28em] text-gold-600 uppercase">
              {festival.welcome}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
