import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/ui/Figure'
import { challenge, impact, objectives } from '@/data/mission'

/** Why the mission exists: the problem, then what LISAT-01 does about it. */
export function MissionContext() {
  return (
    <Section tone="paper" spacing="loose">
      <Container wide>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why LISAT-01 exists"
              index="01"
              title={challenge.title}
            />

            <ul className="mt-10 space-y-px bg-rule">
              {challenge.points.map((point, i) => (
                <Reveal as="li" key={point} delay={i * 0.06}>
                  <div className="flex gap-4 bg-surface py-4 pl-1 pr-2">
                    <span
                      className="tabular mt-1 shrink-0 font-mono text-xs text-accent"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                      {point}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <div className="mt-12 border-l-2 border-accent pl-5">
              <h3 className="eyebrow text-accent">{impact.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-fg md:text-lg">
                {impact.body}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Figure
                src="/images/updates/altice-03.jpg"
                alt="Ground station antennas at the satellite operations centre"
                ratio="landscape"
                annotation="FIG. 02 — GROUND SEGMENT"
                caption="Ground infrastructure visited by the team at the MEO Satellite Operations Center."
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>

            <div className="mt-14">
              <h3 className="eyebrow text-fg-faint">Mission objectives</h3>
              <ol className="mt-6 space-y-8">
                {objectives.map((objective, i) => (
                  <Reveal as="li" key={objective.id} delay={i * 0.06}>
                    <div className="border-t border-rule pt-5">
                      <div className="flex items-baseline gap-4">
                        <span
                          className="tabular font-mono text-xs text-accent"
                          aria-hidden="true"
                        >
                          OBJ-{String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-lg font-medium tracking-snug md:text-xl">
                          {objective.title}
                        </h4>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-fg-muted md:text-base">
                        {objective.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
