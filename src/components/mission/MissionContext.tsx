import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/ui/Figure'
import { impact, objectives } from '@/data/mission'

/**
 * What LISAT-01 does about it.
 *
 * The section that used to open with the four points of `challenge` — the
 * opening statement above now carries that argument, and repeating it here in
 * a bulleted list was the page explaining the same idea twice.
 *
 * What is left is the answer: the impact in one line, then the four
 * objectives, titles first. The descriptions stay because they are the only
 * place the mission is stated precisely.
 */
export function MissionContext() {
  return (
    <Section tone="paper" spacing="none" className="py-16 md:py-24">
      <Container wide>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="What we are doing about it"
              index="01"
              title={impact.title}
            />

            <p className="mt-8 text-lead text-fg-muted">{impact.body}</p>

            <Reveal className="mt-10">
              <Figure
                src="/images/updates/altice-03.jpg"
                alt="A satellite ground station antenna against a clear sky"
                ratio="landscape"
                annotation="FIG. 02 / GROUND SEGMENT"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="eyebrow text-fg-faint">Mission objectives</h3>
            <ol className="mt-6">
              {objectives.map((objective, i) => (
                <Reveal as="li" key={objective.id} delay={i * 0.06}>
                  <div className="border-t border-rule py-5">
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
                    <p className="mt-2 pl-[3.5rem] text-sm leading-relaxed text-fg-muted">
                      {objective.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  )
}
