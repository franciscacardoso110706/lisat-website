import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Reveal } from '@/components/ui/Reveal'
import { RevealLines } from '@/components/ui/RevealLines'
import { ButtonLink } from '@/components/ui/Button'
import { latestUpdates } from '@/data/updates'
import { getPartners } from '@/lib/partner-source'
import { partnerPriority } from '@/data/partners'
import { mission } from '@/data/mission'
import { formatDate } from '@/lib/utils'

/** The partner strip reads from Sanity, as the Partners page does. */
export const revalidate = 60

/**
 * The four headline figures, as published in `specs` in src/data/mission.ts:
 * 1U CubeSat, 10 × 10 × 10 cm, an AIS receiver, three ground stations in
 * Portugal. Nothing here that the mission page does not already state.
 */
const figures = [
  { value: '1U', label: 'CubeSat' },
  { value: '10 × 10 × 10 cm', label: 'Form factor' },
  { value: 'AIS', label: 'Payload' },
  { value: '3', label: 'Ground stations' },
]

/** The three ways further into the site, each with a real photograph. */
const routes = [
  {
    href: '/mission/lisat-01',
    title: 'Mission',
    line: 'The satellite, the data, the bigger picture.',
    image: '/images/mission/render-cubesat.jpg',
    alt: 'A render of LISAT-01 in orbit',
  },
  {
    href: '/team',
    title: 'Team',
    line: `Meet the people building ${mission.name}.`,
    image: '/images/mission/team-work-01.jpg',
    alt: 'LISAT members working around a long table',
  },
  {
    href: '/departments',
    title: 'Departments',
    line: 'Where the mission gets built.',
    image: '/images/updates/cdr-05.jpg',
    alt: 'Team members at their laptops during the Critical Design Review',
  },
]

/**
 * Homepage.
 *
 *   photographic hero
 *   → 01 the mission: one statement, the spacecraft, four figures
 *   → 02 the ways further in: mission, team, departments
 *   → 03 the latest updates
 *   → 04 the partners, as a strip of their marks
 *   → 05 joining LISAT
 *
 * Every fact comes from src/data; every photograph is LISAT's own.
 */
export default async function HomePage() {
  const latest = latestUpdates(3)
  const partners = await getPartners()
  // The key partners, in order of importance: the ones the deck on the
  // Partners page leads with.
  const strip = partners.filter((p) => partnerPriority(p) !== 'standard')

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hm-hero tone-void">
        <div className="hm-hero-photo" aria-hidden="true">
          <Image
            src="/images/mission/hero-team.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_35%]"
          />
        </div>
        <div className="hm-hero-veil" aria-hidden="true" />

        <Container wide className="relative">
          <p className="eyebrow enter-fade text-accent">{mission.name}</p>
          <h1 className="hm-hero-title mt-5">
            <span className="-mb-[0.14em] block overflow-hidden">
              <span className="enter-up block pb-[0.14em]" style={{ animationDelay: '100ms' }}>
                Lisbon&rsquo;s
              </span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden">
              <span
                className="ed-title-blue enter-up block pb-[0.14em]"
                style={{ animationDelay: '200ms' }}
              >
                New Satellite.
              </span>
            </span>
          </h1>
          <p className="hm-hero-line enter-fade" style={{ animationDelay: '340ms' }}>
            A student-built mission to monitor maritime activity from space.
          </p>
          <Link
            href="/mission/lisat-01"
            className="hm-hero-cta enter-fade"
            style={{ animationDelay: '460ms' }}
          >
            Discover the mission
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>

        <p className="hm-hero-tag enter-fade" style={{ animationDelay: '600ms' }}>
          Built by students.
          <br />
          For a safer ocean.
        </p>
      </section>

      {/* ── 01 The mission ───────────────────────────────────────────── */}
      <Section tone="paper" join="curve" spacing="none" className="pb-16 pt-20 md:pb-20 md:pt-28">
        <Container wide>
          <div className="hm-mission">
            <div>
              <SectionIndex index="01" label="The mission" />
              <RevealLines
                as="h2"
                className="ed-title hm-title-md mt-5"
                lines={[
                  'One satellite.',
                  'A whole ocean',
                  { text: 'to listen to.', className: 'ed-title-blue' },
                ]}
              />
              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
                {mission.name} is a student-built CubeSat designed to receive
                and process AIS signals from space.
              </p>
              <Link href="/mission/lisat-01" className="hm-link mt-6">
                Explore the mission
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <Reveal className="hm-craft" delay={0.1}>
              {/* One quiet trajectory behind the spacecraft. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 600 360"
                fill="none"
                className="hm-craft-orbit"
                preserveAspectRatio="none"
              >
                <path
                  d="M -20 330 C 140 120, 420 20, 640 60"
                  stroke="rgb(var(--lisat-blue-soft))"
                  strokeOpacity="0.7"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="96" cy="196" r="4" fill="rgb(var(--lisat-blue))" />
                <circle cx="470" cy="42" r="3" fill="rgb(var(--lisat-blue))" />
              </svg>
              <Image
                src="/images/mission/lisat-01-internal.jpg"
                alt={`A render of ${mission.name}`}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="hm-craft-img"
              />
              <p className="hm-craft-label" aria-hidden="true">
                {mission.name}
                <br />
                CubeSat
                <br />
                <span className="text-fg-faint">10 × 10 × 10 cm</span>
              </p>
            </Reveal>
          </div>

          <ul className="hm-figures">
            {figures.map((f, i) => (
              <Reveal as="li" key={f.label} delay={i * 0.06} className="hm-figure">
                <span className="hm-figure-value">{f.value}</span>
                <span className="hm-figure-label">{f.label}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 02 Explore LISAT ─────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="py-14 md:py-20">
        <Container wide>
          <div className="hm-split">
            <div>
              <SectionIndex index="02" label="Explore LISAT" />
              <RevealLines
                as="h2"
                className="ed-title hm-title-sm mt-5"
                lines={['Go beyond', 'the homepage.']}
              />
              <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-fg-muted">
                Discover the people, the technology and the work behind{' '}
                {mission.name}.
              </p>
            </div>

            <ul className="hm-routes">
              {routes.map((r, i) => (
                <Reveal as="li" key={r.href} delay={i * 0.07}>
                  <Link href={r.href} className="hm-route group">
                    <Image
                      src={r.image}
                      alt={r.alt}
                      fill
                      sizes="(min-width: 1024px) 24vw, 100vw"
                      className="hm-route-img"
                    />
                    <span className="hm-route-shade" aria-hidden="true" />
                    <span className="hm-route-body">
                      <span className="hm-route-num tabular">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="hm-route-title">{r.title}</span>
                      <span className="hm-route-line">{r.line}</span>
                    </span>
                    <span className="hm-go hm-go--light" aria-hidden="true">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── 03 Latest ────────────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="py-14 md:py-20">
        <Container wide>
          <div className="hm-split">
            <div className="flex flex-col">
              <SectionIndex index="03" label="Latest" />
              <RevealLines
                as="h2"
                className="ed-title hm-title-sm mt-5"
                lines={['From LISAT,', 'lately.']}
              />
              <Link href="/updates" className="hm-link mt-6 lg:mt-auto">
                All updates
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="hm-news">
              {latest.map((u, i) => (
                <Reveal as="li" key={u.slug} delay={i * 0.07}>
                  <Link href={`/updates/${u.slug}`} className="hm-news-item group">
                    <span className="hm-news-photo">
                      <Image
                        src={u.cover.src}
                        alt={u.cover.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        style={u.cover.position ? { objectPosition: u.cover.position } : undefined}
                      />
                    </span>
                    <time dateTime={u.date} className="hm-news-date">
                      {formatDate(u.date)}
                    </time>
                    <span className="hm-news-row">
                      <span className="hm-news-title">{u.title}</span>
                      <span className="hm-go" aria-hidden="true">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── 04 Partners ──────────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pb-16 pt-10 md:pb-20 md:pt-14">
        <Container wide>
          <div className="border-t border-rule pt-10 md:pt-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionIndex index="04" label="Partners" />
                <RevealLines
                  as="h2"
                  className="ed-title hm-title-sm mt-5"
                  lines={['Backed by', 'a strong network.']}
                />
                <p className="mt-4 text-[0.9375rem] text-fg-muted">
                  {partners.length} organisations supporting our mission.
                </p>
              </div>
              <Link href="/partners" className="hm-link">
                Meet our partners
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="hm-logos">
              {strip.map((p) => (
                <li key={p.id}>
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={240}
                    height={110}
                    className="hm-logo"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── 05 Join ──────────────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pb-24 md:pb-32">
        <Container wide>
          <div className="hm-join">
            <div className="hm-join-photo">
              <Image
                src="/images/updates/smallsat-04.jpg"
                alt="LISAT members in Lisbon’s New Satellite shirts at SmallSat Europe"
                fill
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="object-cover object-[50%_40%]"
              />
            </div>
            <div className="hm-join-text">
              <SectionIndex index="05" label="Join LISAT" />
              <RevealLines
                as="h2"
                className="ed-title hm-title-sm mt-5"
                lines={['What will', { text: 'you build?', className: 'ed-title-blue' }]}
              />
              <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-fg-muted">
                Be part of the next generation of space talent in Portugal.
              </p>
              <ButtonLink href="/join-us" arrow className="mt-7">
                Join LISAT
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
