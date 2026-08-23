import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealGroup, RevealItem, RevealLines } from "@/components/ui/Reveal";
import { committee, committeeIntro, volunteers } from "@/content";

/**
 * COMMITTEE
 *
 * Two layouts, chosen automatically:
 *
 *   • If any member has a portrait, the section becomes a portrait grid.
 *   • If none do — which is the case today — it becomes a typographic roster.
 *
 * The roster is not a placeholder. Twenty-one identical avatar plates would
 * look like missing data; a well-set list of names reads like the credits
 * page of a printed programme, which is exactly what this is. Add portraits
 * to content/committee.ts and the grid takes over with no other change.
 */
export function Committee() {
  const hasPortraits = committee.some((member) => member.image);

  return (
    <section
      id="committee"
      className="relative bg-paper py-(--spacing-section-lg)"
      aria-labelledby="committee-heading"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{committeeIntro.eyebrow}</p>
            </Reveal>

            <RevealLines
              as="h2"
              id="committee-heading"
              lines={committeeIntro.heading}
              delay={0.05}
              className="mt-7 font-display text-3xl leading-[0.94] font-light text-maroon"
              lineClassName={[undefined, "text-crimson italic"]}
            />
          </div>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-[1.7] text-char-600">
              {committeeIntro.body}
            </p>
          </Reveal>
        </div>

        {hasPortraits ? <PortraitGrid /> : <Roster />}

        <Reveal>
          <div className="mt-20 border-t border-char/10 pt-10">
            <p className="eyebrow">Key volunteers</p>
            <p className="mt-6 max-w-[70ch] font-display text-xl leading-[1.55] text-char-600">
              {volunteers.join(" · ")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Roster() {
  return (
    <RevealGroup
      as="ul"
      step={0.035}
      className="mt-16 grid border-t border-char/12 sm:grid-cols-2 sm:gap-x-14 lg:mt-20 lg:grid-cols-3 lg:gap-x-16"
    >
      {committee.map((member, i) => (
        <RevealItem
          as="li"
          key={member.name}
          className="flex items-baseline gap-5 border-b border-char/12 py-5"
        >
          <span className="nums shrink-0 font-sans text-[0.625rem] tracking-[0.2em] text-gold-600">
            {String(i + 1).padStart(2, "0")}
          </span>

          <span className="min-w-0">
            <span className="block font-display text-xl leading-tight text-maroon">
              {member.name}
            </span>
            {member.role && (
              <span className="mt-1 block font-sans text-[0.625rem] tracking-[0.2em] text-gold-600 uppercase">
                {member.role}
              </span>
            )}
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function PortraitGrid() {
  return (
    <RevealGroup
      as="ul"
      step={0.04}
      className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:mt-20 lg:grid-cols-5 lg:gap-x-8"
    >
      {committee.map((member) => (
        <RevealItem as="li" key={member.name}>
          <Figure
            image={member.image}
            ratio="4 / 5"
            parallax={0}
            plateLabel={member.name}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          />
          <p className="mt-4 font-display text-lg leading-tight text-maroon">
            {member.name}
          </p>
          {member.role && (
            <p className="mt-1 font-sans text-[0.625rem] tracking-[0.2em] text-gold-600 uppercase">
              {member.role}
            </p>
          )}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
