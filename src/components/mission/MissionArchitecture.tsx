import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { specs, subsystems } from '@/data/mission'
import { getDepartment } from '@/data/departments'

/**
 * Specifications table plus the subsystem breakdown, linking each subsystem to
 * the department that owns it.
 */
export function MissionArchitecture() {
  return (
    <Section tone="cloud" join="soft" spacing="none" id="specifications" className="py-16 md:py-24">
      <div
        className="grid-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <Container wide className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Specifications */}
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Specifications"
              index="02"
              title="CubeSat specifications"
              lead="Figures marked TBC have not been published yet — they will be filled in as the design is frozen."
            />

            <dl className="mt-10 border-t border-rule">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
                >
                  <dt className="text-sm text-fg-muted">{spec.label}</dt>
                  <dd className="text-right text-sm text-fg md:text-base">
                    {spec.provisional ? (
                      <span className="font-mono text-xs uppercase tracking-wider text-fg-faint">
                        TBC
                      </span>
                    ) : (
                      spec.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Subsystems */}
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              eyebrow="Architecture"
              index="03"
              title="Subsystems and who owns them"
              lead="Each subsystem is designed, built and tested by the department responsible for it."
            />

            <ul className="mt-10">
              {subsystems.map((sub, i) => {
                const dept = getDepartment(sub.department)
                if (!dept) return null

                return (
                  <Reveal as="li" key={sub.department} delay={i * 0.05}>
                    <Link
                      href={`/departments/${dept.slug}`}
                      className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-5 border-t border-rule py-5 transition-colors hover:bg-fg/[0.03]"
                    >
                      <span
                        className="font-mono text-xs text-accent"
                        aria-hidden="true"
                      >
                        {dept.abbr}
                      </span>
                      <span>
                        <span className="block text-base font-medium text-fg transition-colors group-hover:text-accent">
                          {dept.name}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-fg-muted">
                          {sub.summary}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-fg-faint transition-all group-hover:translate-x-1 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </Link>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
