import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowDown, ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Reveal } from '@/components/ui/Reveal'
import { RevealLines } from '@/components/ui/RevealLines'
import { Counter } from '@/components/ui/Counter'
import { ButtonLink } from '@/components/ui/Button'
import { DepartmentVideo } from '@/components/departments/DepartmentVideo'
import { departments, getDepartment } from '@/data/departments'
import { membersOfDepartment } from '@/lib/team-source'
import { fetchDepartmentMedia } from '@/sanity/departments'
import { mission, subsystems } from '@/data/mission'
import type { Department, TeamMember } from '@/lib/types'

/**
 * People, the cover photograph and the video come from Sanity, so published
 * edits appear within a minute without a redeploy.
 */
export const revalidate = 60

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dept = getDepartment(slug)
  if (!dept) return {}

  return {
    title: dept.name,
    description: dept.summary,
    alternates: { canonical: `/departments/${dept.slug}` },
    openGraph: {
      title: `${dept.name} · ${mission.name}`,
      description: dept.summary,
      url: `/departments/${dept.slug}`,
    },
  }
}

/** The cover when the Studio has none: the team at work, no text on it. */
const defaultCover = {
  src: '/images/updates/cdr-03.jpg',
  alt: 'LISAT members at their laptops during the Critical Design Review',
}

/**
 * The engineering image for each part of the system: the LISAT-01 render for
 * the spacecraft and its payload, the ground-segment render for the link to
 * the ground, the team at work for the departments that run the organisation.
 * Every one is a LISAT asset, described as it is elsewhere on the site.
 */
const segmentImage: Record<Department['segment'], { src: string; alt: string; caption: string; light: boolean }> = {
  platform: {
    src: '/images/mission/lisat-01-internal.jpg',
    alt: `A render of ${mission.name} and its internal subsystems`,
    caption: `${mission.name} · render`,
    light: true,
  },
  payload: {
    src: '/images/mission/lisat-01-internal.jpg',
    alt: `A render of ${mission.name} and its internal subsystems`,
    caption: `${mission.name} · render`,
    light: true,
  },
  ground: {
    src: '/images/mission/render-radar.jpg',
    alt: 'Radar sweep showing tracked vessels',
    caption: 'Ground segment · render',
    light: false,
  },
  organisation: {
    src: '/images/updates/onboarding-01.jpg',
    alt: 'New LISAT members at an onboarding session',
    caption: 'LISAT · onboarding',
    light: false,
  },
}

const segmentLabel: Record<Department['segment'], string> = {
  platform: 'Spacecraft platform',
  payload: 'Payload',
  ground: 'Ground segment',
  organisation: 'Organisation',
}

/**
 * A department, as one page:
 *
 *   cover      a full-width photograph and the name, set large
 *   about      the summary and the areas it covers, with four counts
 *   video      the department's own video, from the Studio
 *   team       everyone in it, photographs from the Studio
 *   system     its part of LISAT-01: a render, the verified role, and its
 *              responsibilities as a bento
 *   join       the way in, and the next department
 *
 * Every figure is counted from the data and every line about the spacecraft
 * comes from src/data; nothing here is a specification of its own.
 */
export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dept = getDepartment(slug)
  if (!dept) notFound()

  const [members, media] = await Promise.all([
    membersOfDepartment(dept.slug),
    fetchDepartmentMedia(dept.slug, dept.name),
  ])
  const leads = members.filter((m) => m.rank === 'lead')
  const cover = media.hero ?? defaultCover
  const system = segmentImage[dept.segment]
  const inFlight = subsystems.find((s) => s.department === dept.slug)?.summary

  const deptIndex = departments.findIndex((d) => d.slug === dept.slug)
  const next = departments[(deptIndex + 1) % departments.length]

  // Counted from the data, never typed. A zero is left out.
  const counts = [
    { value: members.length, label: members.length === 1 ? 'Member' : 'Members' },
    { value: leads.length, label: leads.length === 1 ? 'Leader' : 'Leaders' },
    { value: dept.responsibilities.length, label: 'Responsibilities' },
    { value: dept.disciplines.length, label: 'Engineering areas' },
  ].filter((c) => c.value > 0)

  // The bento always fills its rows: the last tile takes whatever the row
  // still has free. Two columns on tablets (the role on a row of its own),
  // four on wide screens (the role 2 × 2, the first responsibility 2 wide).
  const tasks = dept.responsibilities.length
  const spanSm = tasks % 2 === 1 ? 2 : 1
  const usedLg = 4 + 2 + Math.max(tasks - 1, 0)
  const spanLg = (tasks > 1 ? 1 : 2) + ((4 - (usedLg % 4)) % 4)

  // Chapter numbers follow from which chapters are on the page.
  let chapter = 0
  const n = () => String(++chapter).padStart(2, '0')

  return (
    <>
      {/* ── Cover: full width, the name set large ────────────────────── */}
      <section className="dp-hero tone-void">
        <div className="dp-hero-photo" aria-hidden="true">
          <Image src={cover.src} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="dp-hero-veil" aria-hidden="true" />

        <Container wide className="relative">
          <Link href="/departments" className="dp-back enter-fade">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All departments
          </Link>

          <div className="dp-hero-text">
            <p className="dp-hero-id enter-fade" style={{ animationDelay: '60ms' }}>
              <span className="tabular">{String(deptIndex + 1).padStart(2, '0')}</span>
              <span aria-hidden="true">/</span>
              {dept.abbr}
            </p>
            <h1 className="dp-title">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="enter-up block" style={{ animationDelay: '120ms' }}>
                  {dept.name}
                </span>
              </span>
            </h1>
            <p className="dp-tagline enter-fade" style={{ animationDelay: '320ms' }}>
              {dept.summary}
            </p>
            <div className="dp-actions enter-fade" style={{ animationDelay: '440ms' }}>
              <a href="#video" className="dp-btn dp-btn--primary">
                <span className="dp-btn-icon" aria-hidden="true">
                  <Play className="h-3.5 w-3.5" />
                </span>
                Watch the video
              </a>
              {members.length ? (
                <a href="#team" className="dp-btn dp-btn--ghost">
                  Meet the team
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <Section tone="paper" join="curve" spacing="none" className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container wide>
          <div className="dp-about">
            <div>
              <SectionIndex index={n()} label={`About ${dept.abbr}`} />
              <RevealLines
                as="h2"
                className="ed-title dp-h2 mt-5"
                lines={[dept.tagline.charAt(0).toUpperCase() + dept.tagline.slice(1) + '.']}
              />
              {dept.disciplines.length ? (
                <ul className="dp-tags" aria-label="Engineering areas">
                  {dept.disciplines.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <ul className="dp-counts">
              {counts.map((c, i) => (
                <Reveal as="li" key={c.label} delay={i * 0.06} className="dp-count">
                  <span className="dp-count-num tabular">
                    <Counter value={c.value} />
                  </span>
                  <span className="dp-count-label">{c.label}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Video ────────────────────────────────────────────────────── */}
      <Section
        tone="cloud"
        join="soft"
        spacing="none"
        id="video"
        className="scroll-mt-[var(--nav-height)] py-16 md:py-24"
      >
        <Container wide>
          <div className="dp-video-grid">
            <div className="dp-video-text">
              <SectionIndex index={n()} label="Video" />
              <RevealLines
                as="h2"
                className="ed-title dp-h2 mt-5"
                lines={['Inside', { text: `${dept.abbr}.`, className: 'ed-title-blue' }]}
              />
              <Reveal delay={0.1}>
                <p className="dp-lede">
                  A look inside {dept.name}: the people, the work, and their
                  part of {mission.name}.
                </p>
              </Reveal>
            </div>
            <Reveal className="dp-video-frame" delay={0.12}>
              <DepartmentVideo video={media.video} poster={cover} name={dept.name} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      {members.length ? (
        <Section
          tone="paper"
          join="soft"
          spacing="none"
          id="team"
          className="scroll-mt-[var(--nav-height)] py-16 md:py-24"
        >
          <Container wide>
            <div className="dp-head">
              <div>
                <SectionIndex index={n()} label="Team" />
                <RevealLines
                  as="h2"
                  className="ed-title dp-h2 mt-5"
                  lines={['The people', { text: `behind ${dept.abbr}.`, className: 'ed-title-blue' }]}
                />
              </div>
              <p className="dp-head-note">
                {members.length} {members.length === 1 ? 'person' : 'people'} building{' '}
                {dept.name}.
              </p>
            </div>

            <ul className="dp-people">
              {members.map((m, i) => (
                <Reveal as="li" key={m.id} delay={Math.min(i, 7) * 0.05}>
                  <Person member={m} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* ── Its part of the system ───────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pb-16 md:pb-24">
        <Container wide>
          <div className="dp-sys">
            {/* The showcase: render on one side, the department on the other. */}
            <div className="dp-sys-hero">
              <Reveal className={system.light ? 'dp-sys-media dp-sys-media--light' : 'dp-sys-media'}>
                <Image
                  src={system.src}
                  alt={system.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={system.light ? 'dp-sys-img dp-sys-img--contain' : 'dp-sys-img'}
                />
                <span className="dp-sys-caption">{system.caption}</span>
              </Reveal>

              <div className="dp-sys-text">
                <SectionIndex index={n()} label={`${segmentLabel[dept.segment]} / ${dept.abbr}`} />
                <RevealLines
                  as="h2"
                  className="ed-title dp-h2 mt-5"
                  lines={['Our part of', { text: 'the mission.', className: 'ed-title-blue' }]}
                />
                <div className="dp-sys-copy">
                  {dept.description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* What it is responsible for, as a bento with the verified role
                as its anchor. */}
            <div className="dp-bento">
              <Reveal className="dp-role tone-hull">
                <p className="eyebrow text-accent">On {mission.name}</p>
                <p className="dp-role-text">{dept.roleOnLisat01}</p>
                {inFlight && inFlight !== dept.roleOnLisat01 ? (
                  <p className="dp-role-sub">
                    <span className="eyebrow text-fg-faint">In the flight system</span>
                    {inFlight}
                  </p>
                ) : null}
              </Reveal>

              {dept.responsibilities.map((r, i) => (
                <Reveal
                  key={r}
                  delay={Math.min(i, 5) * 0.05}
                  className={i === 0 ? 'dp-task dp-task--lead' : 'dp-task'}
                  style={
                    i === tasks - 1
                      ? ({ '--span-sm': spanSm, '--span-lg': spanLg } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span className="dp-task-num tabular">R.{String(i + 1).padStart(2, '0')}</span>
                  <span className="dp-task-text">{r}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Join, and the next department ────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pb-24 md:pb-32">
        <Container wide>
          <div className="dp-join">
            <div>
              <p className="eyebrow text-accent">Join {dept.abbr}</p>
              <RevealLines
                as="h2"
                className="ed-title dp-h2 mt-5"
                lines={['Want to work', { text: `on ${dept.abbr}?`, className: 'ed-title-blue' }]}
              />
            </div>
            <ButtonLink href="/join-us" arrow>
              How to join
            </ButtonLink>
          </div>

          <Link href={`/departments/${next.slug}`} className="dp-next group">
            <span>
              <span className="eyebrow text-fg-faint">Next department</span>
              <span className="dp-next-name">{next.name}</span>
            </span>
            <span className="dp-next-go" aria-hidden="true">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </Container>
      </Section>
    </>
  )
}

/**
 * One person. The photograph zooms a little on hover and their studies
 * (degree, year, faculty) rise over it; on touch screens, where there is no
 * hover, the same line sits under the role instead.
 */
function Person({ member }: { member: TeamMember }) {
  const studies = [
    member.degree,
    member.year ? `Year ${member.year}` : null,
    member.faculty,
  ]
    .filter(Boolean)
    .join(' · ')

  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  const card = (
    <>
      <span className="dp-person-photo">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
            className="dp-person-img"
          />
        ) : (
          <span className="dp-person-mono" aria-hidden="true">
            {initials}
          </span>
        )}
        {studies ? (
          <span className="dp-person-reveal" aria-hidden="true">
            {studies}
          </span>
        ) : null}
      </span>
      <span className="dp-person-name">{member.name}</span>
      <span className="dp-person-role">{member.role}</span>
      {studies ? <span className="dp-person-studies">{studies}</span> : null}
    </>
  )

  return member.linkedin ? (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noreferrer noopener"
      className="dp-person"
      aria-label={`${member.name}, ${member.role}. LinkedIn (opens in a new tab)`}
    >
      {card}
    </a>
  ) : (
    <div className="dp-person">{card}</div>
  )
}
