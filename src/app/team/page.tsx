import type { Metadata } from 'next'
import Image from 'next/image'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Open } from '@/components/team/Open'
import { DisciplineFlow } from '@/components/team/DisciplineFlow'
import { TeamWall } from '@/components/team/TeamWall'
import { TeamCta } from '@/components/team/TeamCta'
import { getTeam } from '@/lib/team-source'
import { site } from '@/data/site'
import { mission } from '@/data/mission'

export const metadata: Metadata = {
  title: 'Team',
  description: `The students at ${site.institution} designing, building and testing ${mission.name}.`,
  alternates: { canonical: '/team' },
}

/**
 * The people building LISAT.
 *
 * Photography carries this page and text is scarce: no introduction, no
 * biographies, no department essays. A name, a department, a face. Everything
 * else appears only when somebody is being looked at.
 *
 * The composition is deliberately compact. Type is here to label the
 * photography, not to fill screens — the hero and its photograph together are
 * meant to fit in roughly three quarters of the viewport, so the team is
 * visible almost immediately.
 *
 * Nothing is positioned person by person. The wall comes from a repeating
 * rhythm and every figure is counted from the data, so next year's roster
 * needs no redesign.
 */

/** Real photographs of the team. See the alt text for what each one shows. */
const photos = {
  hero: {
    src: '/images/updates/bootcamp-01.jpg',
    alt: `The ${site.name} team at the CubeSat Portugal bootcamp`,
  },
  working: {
    src: '/images/updates/cdr-03.jpg',
    alt: `${site.name} members working through the Critical Design Review`,
  },
  closing: {
    src: '/images/mission/team-work-01.jpg',
    alt: `${site.name} members at a project meeting`,
  },
}

/** How far down the wall the working photograph interrupts it. */
const BREAK_AFTER = 12

export const revalidate = 60

export default async function TeamPage() {
  const { members, departments } = await getTeam()

  // Advisors sit outside the roster of students building the spacecraft.
  const people = members.filter((m) => m.rank !== 'advisor')

  return (
    <>
      {/* ── Hero. Type on the left, the team on the right, both above the
             fold on a laptop. ─────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pt-[6.5rem] pb-16 md:pt-[8rem] md:pb-20">
        <Container wide>
          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Label at the top of the column, statement at the foot of it.
                Anchored at both ends the column reads as composed; anchored
                at one, the other end is just a hole. */}
            <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:py-1">
              <SectionIndex index="03" label="Team" />
              <h1 className="font-poster text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal uppercase leading-[0.9] tracking-[0.005em]">
                Built by
                <br />
                <span className="text-brand">students.</span>
              </h1>
            </div>

            <div className="lg:col-span-8">
              <Open radius="2.5rem">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] rounded-tl-[4rem] sm:aspect-[16/10] md:rounded-[2.5rem] md:rounded-tl-[7rem]">
                  <Image
                    src={photos.hero.src}
                    alt={photos.hero.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              </Open>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── What this team does. A transition, not a section. ──────── */}
      <Section tone="cloud" join="soft" spacing="none" className="py-8 md:py-10">
        <DisciplineFlow />
        <Container wide>
          <p className="mt-6 text-title font-medium tracking-snug md:mt-8">
            Different skills. <span className="text-fg-muted">One mission.</span>
          </p>
        </Container>
      </Section>

      {/* ── The people ─────────────────────────────────────────────── */}
      <Section
        tone="paper"
        join="soft"
        spacing="none"
        id="members"
        className="py-14 md:py-20"
      >
        <Container wide>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-accent">Our people</p>
              <h2 className="mt-5 text-display-sm">Meet the team.</h2>
            </div>
          </div>

          <div className="mt-8 md:mt-10">
            <TeamWall
              members={people}
              departments={departments}
              breakAfter={BREAK_AFTER}
              breakImage={photos.working}
            />
          </div>
        </Container>
      </Section>

      {/* ── The way in ─────────────────────────────────────────────── */}
      <TeamCta href="/join-us" photo={photos.closing} />
    </>
  )
}
