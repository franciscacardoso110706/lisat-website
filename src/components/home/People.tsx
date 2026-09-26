'use client'

import { motion } from 'framer-motion'
import { Container, Section } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/Button'
import { Plate, SectionIndex } from '@/components/ui/Technical'
import { RevealLines } from '@/components/ui/RevealLines'
import { ImageReveal } from '@/components/ui/ImageReveal'
import { useRange, useSectionScroll } from '@/lib/motion'
import { team } from '@/data/team'
import { departments } from '@/data/departments'
import { site } from '@/data/site'

/**
 * The human half of the identity.
 *
 * Deliberately the loudest typography on the page, set against the technical
 * restraint of the mission sequence above it — that contrast is the point.
 * The group is introduced as a group; individual members live on /team.
 *
 * The photographs travel at different speeds and bleed past the right edge of
 * the measure, so the composition is asymmetric rather than a tidy grid. Every
 * offset is centred on the point where the section sits mid-viewport, so
 * nothing is displaced while it is being read.
 */

/** Degree codes actually present in the roster, so the list is never stale. */
const degrees = [...new Set(team.map((m) => m.degree).filter(Boolean))].sort() as string[]

const memberCount = team.filter((m) => m.rank !== 'advisor').length

export function People() {
  const { ref, progress } = useSectionScroll<HTMLDivElement>()

  const tallY = useRange(progress, [70, -70])
  const topY = useRange(progress, [-40, 50])
  const bottomY = useRange(progress, [110, -110])
  // The statement deliberately does not move. It already arrives with a masked
  // line reveal, and drifting text under the reader's eye while they are
  // reading it is an irritation, not a refinement.

  return (
    <Section tone="cloud" join="soft" spacing="loose" id="people">
      <Container wide>
        <div ref={ref} className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Statement */}
          <div className="lg:col-span-6">
            <SectionIndex index="03" label="The team" />

            <RevealLines
              className="mt-9 text-display-md"
              lines={[
                'Built by students.',
                { text: 'Engineered for space.', className: 'text-accent' },
              ]}
            />

            <div className="prose-lisat mt-8">
              <p>
                {memberCount} students from {site.institution}, FCUL and ISEG —
                aerospace, mechanical, electronics, computer science, physics
                and management. Nobody here has flown a satellite before. That
                is rather the point.
              </p>
            </div>

            <TextLink href="/team" className="mt-8">
              Meet the team
            </TextLink>

            {/* Degrees represented — read straight from the roster. */}
            <div className="mt-14 border-t border-rule pt-6">
              <p className="eyebrow text-fg-faint">Degrees represented</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {degrees.map((degree) => (
                  <li key={degree} className="font-mono text-xs text-fg-muted">
                    {degree}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photography — bleeds past the right edge on large screens. */}
          <div className="lg:col-span-6 lg:mr-[calc(50%-50vw)]">
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-5">
              <motion.figure
                className="col-span-1 lg:col-span-2 lg:pt-16"
                style={{ y: tallY }}
              >
                <ImageReveal
                  src="/images/updates/bootcamp-04.jpg"
                  alt="Two LISAT members working through a problem together"
                  sizes="(min-width: 1024px) 24vw, 50vw"
                  className="aspect-[3/4]"
                />
                <Plate figure="Fig. 01">CubeSat Portugal bootcamp, 2025</Plate>
              </motion.figure>

              <div className="col-span-1 space-y-8 md:space-y-10 lg:col-span-3">
                <motion.figure style={{ y: topY }}>
                  <ImageReveal
                    src="/images/updates/cdr-03.jpg"
                    alt="LISAT members presenting at the Critical Design Review"
                    sizes="(min-width: 1024px) 36vw, 50vw"
                    className="aspect-[4/3]"
                  />
                  <Plate figure="Fig. 02">Critical Design Review, 2025</Plate>
                </motion.figure>

                <motion.figure style={{ y: bottomY }} className="lg:pl-16">
                  <ImageReveal
                    src="/images/updates/bootcamp-02.jpg"
                    alt="A LISAT test bench during the CubeSat Portugal bootcamp"
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="aspect-[4/3]"
                  />
                  <Plate figure="Fig. 03">Test bench, Lisbon</Plate>
                </motion.figure>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet supporting figures */}
        <dl className="mt-24 grid grid-cols-3 border-t border-rule md:mt-32">
          <div className="py-8 md:py-10">
            <dt className="eyebrow text-fg-faint">Members</dt>
            <dd className="tabular mt-3 text-display-sm font-semibold">
              {memberCount}
            </dd>
          </div>
          <div className="py-8 md:border-l md:border-rule md:py-10 md:pl-8">
            <dt className="eyebrow text-fg-faint">Departments</dt>
            <dd className="tabular mt-3 text-display-sm font-semibold">
              {departments.length - 1}
            </dd>
          </div>
          <div className="py-8 md:border-l md:border-rule md:py-10 md:pl-8">
            <dt className="eyebrow text-fg-faint">Founded</dt>
            <dd className="tabular mt-3 text-display-sm font-semibold">
              {site.founded}
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  )
}
