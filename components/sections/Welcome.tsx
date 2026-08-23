import { Figure } from "@/components/ui/Figure";
import { LotusRule } from "@/components/ui/Ornament";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { festival, welcome } from "@/content";

/**
 * WELCOME
 *
 * The first breath after the hero: warm white, a lot of air, and one large
 * statement. The grid is deliberately off-centre — the statement runs wide
 * across the left, the reading text sits in a narrow column to the right,
 * and the figure hangs below the statement rather than beside it.
 */
export function Welcome() {
  return (
    <section
      id="welcome"
      className="relative bg-paper py-(--spacing-section-lg)"
      aria-labelledby="welcome-heading"
    >
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Welcome</p>
        </Reveal>

        <RevealLines
          as="h2"
          id="welcome-heading"
          lines={welcome.statement}
          delay={0.05}
          className="mt-7 max-w-[22ch] font-display text-3xl leading-[0.94] font-light text-maroon sm:mt-9"
          lineClassName={[undefined, undefined, "text-crimson italic"]}
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-16">
          {/* Figure sits low and left, breaking the symmetry. */}
          <Reveal className="lg:col-span-5 lg:col-start-1 lg:mt-12">
            <Figure
              ratio="4 / 5"
              plateLabel={`Ganeshothsava · ${festival.foundedYear}–${festival.year}`}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            {welcome.body.map((para, i) => (
              <Reveal key={para} delay={i * 0.08} className={i > 0 ? "mt-7" : undefined}>
                <p className="max-w-[46ch] text-lg leading-[1.7] text-char-600">
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.16}>
              <div className="mt-12 flex items-center gap-6">
                <LotusRule className="w-24 shrink-0 text-gold" />
                <p className="font-display text-xl leading-tight text-maroon italic">
                  {welcome.closing}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
