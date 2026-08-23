import { LotusRule } from "@/components/ui/Ornament";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { contact, festival } from "@/content";

/**
 * CONTACT
 *
 * Deliberately the quietest section on the page. Where, who, and how to
 * reach them — nothing else.
 */
export function Contact() {
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
        <RevealLines
          as="h2"
          id="contact-heading"
          lines={contact.heading}
          className="max-w-[16ch] font-display text-3xl leading-[0.94] font-light text-maroon"
          lineClassName={[undefined, "text-crimson italic"]}
        />

        <div className="mt-16 grid gap-12 border-t border-char/12 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          {/* --- where --- */}
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Where</p>
            <address className="mt-6 font-display text-lg leading-[1.5] text-maroon not-italic">
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
            <p className="eyebrow">Who to ask</p>
            <ul className="mt-6">
              {contact.people.map((person) => (
                <li
                  key={person.name}
                  className="border-b border-char/10 py-4 first:pt-0 last:border-b-0"
                >
                  <p className="font-display text-xl leading-tight text-maroon">
                    {person.name}
                  </p>
                  <p className="mt-1 font-sans text-[0.625rem] tracking-[0.2em] text-gold-600 uppercase">
                    {person.role}
                  </p>
                  {person.phone && (
                    <a
                      href={`tel:+91${person.phone}`}
                      className="nums link-underline tap mt-2 text-base text-char-600"
                    >
                      +91 {person.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[38ch] text-sm leading-[1.6] text-char-600/85">
              {contact.note}
            </p>
          </Reveal>

          {/* --- when --- */}
          <Reveal delay={0.12} className="sm:col-span-2 lg:col-span-3 lg:col-start-10">
            <p className="eyebrow">When</p>
            <p className="mt-6 font-display text-2xl leading-[1.1] text-maroon">
              {festival.edition} year
              <span className="block text-crimson italic">{festival.year}</span>
            </p>
            <LotusRule className="mt-8 w-28 text-gold" />
            <p className="mt-6 font-sans text-[0.625rem] tracking-[0.3em] text-gold-600 uppercase">
              {festival.welcome}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
