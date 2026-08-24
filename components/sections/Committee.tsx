import { CommitteeGrid } from "@/components/sections/CommitteeGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { committee, nav } from "@/content";

/**
 * COMMITTEE
 *
 * Photograph, name, role — the same size and the same weight for all
 * twenty-one, whether or not they hold a portfolio. Nobody's name is set
 * larger than anybody else's.
 *
 * Two rows show and the rest expand: this sits last on the page because the
 * festival is the subject and the people running it are the credits.
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

        <Reveal delay={0.06} className="mt-12 block lg:mt-16">
          <CommitteeGrid members={committee} />
        </Reveal>
      </div>
    </section>
  );
}
