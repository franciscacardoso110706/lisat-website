import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { ButtonLink } from '@/components/ui/Button'
import { TeamCarousel } from '@/components/team/TeamCarousel'
import { TeamPortrait } from '@/components/team/TeamPortrait'
import { getTeam } from '@/lib/team-source'
import { departmentRoute } from '@/data/departments'
import { site } from '@/data/site'
import { mission } from '@/data/mission'
import type { DepartmentRef } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Team',
  description: `The students at ${site.institution} designing, building and testing ${mission.name}.`,
  alternates: { canonical: '/team' },
}

/**
 * The people building LISAT.
 *
 * One idea: a centred introduction, then every member along a single
 * horizontal line. The carousel is the identity of the page and everything
 * after it is short — an About, the leadership, the departments, a way in.
 *
 * Nothing is positioned person by person and no name appears in this file.
 * Every count in the copy is derived from the roster, so next year's team
 * needs no redesign and no edit here.
 *
 * The photographs come back from Sanity already cropped to 4:5 at 720px, so
 * the file that arrives is the size the card draws.
 */

export const revalidate = 60

export default async function TeamPage() {
  const { members, departments } = await getTeam()

  /*
   * Advisors sit outside the roster of students building the spacecraft —
   * the same rule the site has always used, and what makes "students" in the
   * sentence below true.
   */
  const people = members.filter((m) => m.rank !== 'advisor')

  /*
   * The board, as LISAT itself defines it — a department in the structure,
   * not a rank we invented. Department leaders lead their own departments and
   * are not on it; putting them under this heading would describe an
   * organisation that does not exist.
   */
  const board = people.filter(
    (m) => m.department === 'board' || m.rank === 'board',
  )

  /** Counted, never typed. */
  const departmentsRepresented = new Set(
    people.filter((m) => m.department !== 'board').map((m) => m.department),
  ).size

  const listed = departments.filter((d) => d.slug !== 'board')

  return (
    <>
      {/* ── Hero and the start of the carousel, on one screen ────────── */}
      {/*
        `pb` is not decoration: the next section joins with a negative margin
        and was sitting on the bottom of the carousel, cutting every card off
        below the name.
      */}
      <Section
        tone="paper"
        spacing="none"
        className="pt-[7rem] pb-16 md:pb-24 md:pt-[8.5rem]"
      >
        <Container wide>
          <div className="mx-auto max-w-3xl text-center">
            <SectionIndex index="04" label="Team" className="justify-center" />

            <h1 className="tm-title mt-7">
              Meet the team
              <br />
              behind the mission.
            </h1>

            <p className="tm-lead mt-6">
              {people.length} students across {departmentsRepresented}{' '}
              departments, working together to build {mission.name}.
            </p>

            <div className="mt-8 flex justify-center">
              <ButtonLink href="/join-us" size="sm" arrow>
                Join {site.name}
              </ButtonLink>
            </div>
          </div>
        </Container>

        {/*
          The carousel starts inside the first screen on purpose. The top of a
          row of faces at the bottom edge is the invitation downward; a hero
          that ends in white space is just a hero.
        */}
        <div className="mt-14 md:mt-16">
          <TeamCarousel members={people} label={`Every ${site.name} member`} />
        </div>
      </Section>

      {/* ── About ───────────────────────────────────────────────────── */}
      <Section tone="cloud" join="soft" spacing="none" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-accent">About {site.name}</p>
            <p className="tm-about mt-7">
              {site.name} is a student-led team at {site.institution}, building{' '}
              {mission.name} — a 1U CubeSat that collects maritime AIS signals
              from orbit. Engineers, designers and managers across{' '}
              {departmentsRepresented} departments, designing and building a
              real spacecraft while they study.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── The people leading the team ─────────────────────────────── */}
      {board.length > 0 ? (
        <Section tone="paper" join="soft" spacing="none" className="py-20 md:py-28">
          <Container wide>
            <div className="text-center">
              <p className="eyebrow text-accent">The people leading the team</p>
              <h2 className="tm-heading mt-6">Our board.</h2>
            </div>

            {/*
              A centred row, and deliberately smaller than the carousel above.
              The board is a handful of people; giving them the full width
              would make them look like the team.
            */}
            <ul className="board-row mt-12 md:mt-16">
              {board.map((m) => (
                <li key={m.id} className="board-slot">
                  <TeamPortrait member={m} size="sm" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* ── Departments ─────────────────────────────────────────────── */}
      <Section tone="cloud" join="soft" spacing="none" className="py-20 md:py-28">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow text-accent">How we&rsquo;re organised</p>
              <h2 className="tm-heading mt-6">
                Discover our
                <br />
                departments.
              </h2>
              <p className="mt-6 max-w-sm text-lead text-fg-muted">
                Every part of {mission.name} belongs to a team of students who
                own it end to end.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="dept-rows">
                {listed.map((d) => (
                  <DepartmentRow key={d.slug} department={d} />
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── The way in ──────────────────────────────────────────────── */}
      <Section tone="paper" join="soft" spacing="none" className="py-16 md:py-24">
        <Container wide>
          <div>
            <Link href="/join-us" className="join-card group">
              <p className="join-title">
                We&rsquo;re
                <br />
                missing you.
              </p>
              <span className="join-action">
                Join {site.name}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}

/**
 * One department, as a row.
 *
 * A row rather than a card: nine permanent cards is a wall of boxes, and the
 * surface only needs to exist under the one being pointed at. Departments
 * without a page of their own render as plain rows rather than dead links.
 */
function DepartmentRow({ department }: { department: DepartmentRef }) {
  const href = departmentRoute(department.slug)

  const body = (
    <>
      <span className="dept-abbr">{department.abbr}</span>
      <span className="dept-main">
        <span className="dept-name">{department.name}</span>
        {department.description ? (
          <span className="dept-desc">{department.description}</span>
        ) : null}
      </span>
      {href ? (
        <ArrowUpRight className="dept-arrow h-4 w-4" aria-hidden="true" />
      ) : null}
    </>
  )

  return (
    <li>
      {href ? (
        <Link href={href} className="dept-row group">
          {body}
        </Link>
      ) : (
        <div className="dept-row">{body}</div>
      )}
    </li>
  )
}
