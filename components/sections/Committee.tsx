import { Figure } from "@/components/ui/Figure";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { committee, nav } from "@/content";

/**
 * COMMITTEE
 *
 * Photograph, name, role — the same size and the same weight for all
 * twenty-one, whether or not they hold a portfolio. Nobody's name is set
 * larger than anybody else's.
 *
 * Squares are used deliberately: the brochure's portraits are passport-style
 * and a square crop suits them, and a uniform grid of squares tolerates
 * photographs arriving one at a time without the layout shifting. Until a
 * portrait exists, each cell renders the ornamental plate at the same 1:1.
 */
export function Committee() {
  const label = nav[5]!;

  return (
    <section
      id="committee"
      className="relative bg-paper py-(--spacing-section-lg)"
      aria-labelledby="committee-heading"
    >
      <div className="shell">
        <Reveal>
          <SectionLabel
            as="h2"
            id="committee-heading"
            index={label.index}
            label={label.label}
          />
        </Reveal>

        <RevealGroup
          as="ul"
          step={0.03}
          className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:mt-16 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-11"
        >
          {committee.map((member) => (
            <RevealItem as="li" key={member.name}>
              <Figure
                image={member.image}
                ratio="1 / 1"
                parallax={0}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 17vw"
              />
              <p className="mt-3.5 font-display text-lg leading-tight text-maroon">
                {member.name}
              </p>
              {member.role && (
                <p className="mt-1 font-sans text-[0.625rem] leading-[1.4] tracking-[0.16em] text-gold-600 uppercase">
                  {member.role}
                </p>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
