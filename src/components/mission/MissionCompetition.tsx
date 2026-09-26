import { Container, Eyebrow, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/ui/Figure'
import { mission } from '@/data/mission'

/** CubeSat Portugal — the national programme LISAT-01 is competing in. */
export function MissionCompetition() {
  const { competition } = mission

  return (
    <Section tone="void" join="curve" spacing="none" className="py-20 md:py-28">
      <Container wide>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow index="04">Programme</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tightest">
              {competition.name}
            </h2>

            <dl className="mt-10 grid grid-cols-2 gap-6">
              <div className="border-t border-rule pt-3">
                <dt className="eyebrow text-fg-faint">Organiser</dt>
                <dd className="mt-1.5 text-sm text-fg">{competition.organiser}</dd>
              </div>
              <div className="border-t border-rule pt-3">
                <dt className="eyebrow text-fg-faint">Teams competing</dt>
                <dd className="tabular mt-1.5 text-sm text-fg">
                  {competition.teams}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="prose-lisat">
              <p>{competition.description}</p>
            </div>

            <Reveal>
              <Figure
                src="/images/updates/bootcamp-01.jpg"
                alt="LISAT at the CubeSat Portugal bootcamp"
                ratio="wide"
                annotation="FIG. 03 — CUBESAT PORTUGAL BOOTCAMP"
                className="mt-10"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
