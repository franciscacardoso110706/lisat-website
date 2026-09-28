import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Section } from '@/components/ui/Section'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { RevealLines } from '@/components/ui/RevealLines'
import { Reveal } from '@/components/ui/Reveal'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import {
  ExperienceMoments,
  HeroPhoto,
  type Moment,
} from '@/components/join/JoinMotion'
import { recruitment, statusCopy } from '@/data/recruitment'
import { departmentRoute, departments } from '@/data/departments'
import { contact, site } from '@/data/site'
import { mission } from '@/data/mission'
import { clsx } from '@/lib/utils'

const copy = statusCopy[recruitment.status]
const isOpen = recruitment.status === 'open'

export const metadata: Metadata = {
  title: 'Join Us',
  description: `Join LISAT and work on ${mission.name}, a student-built 1U CubeSat at ${site.institution}. ${copy.title}.`,
  alternates: { canonical: '/join-us' },
}

/**
 * Where the main call to action points. An application form only when a
 * cycle is actually open and has one; otherwise the interest email — never a
 * dead or invented link.
 */
const primaryCta =
  isOpen && recruitment.applicationUrl
    ? recruitment.applicationUrl
    : recruitment.interestMailto

/**
 * Four moments from the last two years, each a real event with its own story
 * on the Updates page. The words are the tone; the captions are the facts.
 */
const moments: Moment[] = [
  {
    word: 'Build.',
    image: '/images/mission/team-work-01.jpg',
    alt: 'LISAT members working on the satellite around a long table',
    caption: `Working sessions on ${mission.name}, subsystem by subsystem.`,
  },
  {
    word: 'Defend.',
    image: '/images/updates/cdr-03.jpg',
    alt: 'The team at their laptops following the jury’s questions',
    caption: 'The Critical Design Review, in front of a jury.',
    href: '/updates/critical-design-review',
  },
  {
    word: 'Represent.',
    image: '/images/updates/smallsat-03.jpg',
    alt: 'A LISAT member in a Lisbon’s New Satellite shirt at SmallSat Europe',
    caption: 'SmallSat Europe 2026, at RAI Amsterdam.',
    href: '/updates/smallsat-europe-2026',
    position: '50% 35%',
  },
  {
    word: 'Learn.',
    image: '/images/updates/thales-02.jpg',
    alt: 'A LISAT member at an operations console during the Thales Portugal visit',
    caption: 'Inside industry, with partners such as Thales Portugal.',
    href: '/updates/thales-portugal-visit',
  },
]

/**
 * Fragments of the departments' own photography — not cards, not
 * descriptions. The Departments page does the explaining.
 *
 * `shape` is the full class name on purpose: Tailwind drops component classes
 * it cannot find written out in the source, so a name assembled from parts
 * would lose its CSS.
 */
const fragments = [
  { src: '/images/mission/lisat-01-internal.jpg', shape: 'jd-frag--wide', position: '50% 50%' },
  { src: '/images/departments/cdh.jpg', shape: 'jd-frag--round', position: '50% 22%' },
  { src: '/images/updates/cdr-04.jpg', shape: 'jd-frag--tall', position: '50% 40%' },
  { src: '/images/mission/team-work-03.jpg', shape: 'jd-frag--wide', position: '50% 50%' },
  { src: '/images/departments/stc.jpg', shape: 'jd-frag--round', position: '50% 24%' },
  { src: '/images/updates/bootcamp-05.jpg', shape: 'jd-frag--tall', position: '40% 50%' },
  { src: '/images/updates/easter-01.jpg', shape: 'jd-frag--wide', position: '50% 40%' },
] as const

export default function JoinUsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" className="pb-16 pt-[calc(var(--nav-height)+3rem)] md:pb-24 md:pt-[calc(var(--nav-height)+4.5rem)]">
        <Container wide>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Join {site.name}
            </p>
            <StatusPill />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <RevealLines
              as="h1"
              className="jn-title lg:col-span-8"
              lines={[
                'Build something',
                'that actually',
                { text: 'goes to space.', className: 'text-brand' },
              ]}
            />

            <div className="lg:col-span-4 lg:pb-3">
              <p className="max-w-sm text-lead text-fg-muted">
                Engineering, operations, design, partnerships — {mission.name}{' '}
                is designed, built and tested by students.
              </p>
              <ButtonLink href="#apply" arrow className="mt-7">
                Join the team
              </ButtonLink>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <HeroPhoto
              src="/images/updates/altice-05.jpg"
              alt="A LISAT member facing a ground-station antenna at MEO’s Satellite Operations Center"
              position="62% 58%"
            />
          </div>
        </Container>
      </Section>

      {/* ── The experience ───────────────────────────────────────────── */}
      <Section tone="cloud" join="soft" spacing="none" className="py-20 md:py-32">
        <Container wide>
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">The experience</p>
            <h2 className="mt-6 text-display-sm">
              A real mission, with everything that comes with it.
            </h2>
          </div>

          <div className="mt-14 md:mt-20">
            <ExperienceMoments moments={moments} />
          </div>
        </Container>
      </Section>

      {/* ── One mission, different ways to build it ──────────────────── */}
      <Section tone="ice" join="soft" spacing="none" className="py-20 md:py-32">
        <Container wide>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <RevealLines
              className="text-display-md lg:col-span-7"
              lines={['One mission.', 'Different ways', 'to build it.']}
            />
            <div className="lg:col-span-4 lg:col-start-9 lg:pb-2">
              <p className="text-lead text-fg-muted">
                From spacecraft engineering to the work that makes the mission
                possible.
              </p>
              <ButtonLink href="/departments" arrow className="mt-7">
                Explore our departments
              </ButtonLink>
            </div>
          </div>
        </Container>

        {/* Full-bleed and drifting: fragments, not a catalogue. */}
        <div className="jd-flow mt-14 md:mt-20" aria-hidden="true">
          <div className="flow-track jd-track">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="jd-set">
                {fragments.map((f) => (
                  <div key={f.src} className={`jd-frag ${f.shape}`}>
                    <Image
                      src={f.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 360px, 240px"
                      className="object-cover"
                      style={{ objectPosition: f.position }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Container wide>
          <ul className="mt-10 flex flex-wrap gap-x-2 gap-y-2 md:mt-12">
            {departments
              .filter((d) => d.slug !== 'board')
              .map((d) => {
                const href = departmentRoute(d.slug)
                const label = (
                  <>
                    <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-accent">
                      {d.abbr}
                    </span>
                    <span>{d.name}</span>
                  </>
                )
                return (
                  <li key={d.slug}>
                    {href ? (
                      <Link href={href} className="jd-chip">
                        {label}
                      </Link>
                    ) : (
                      <span className="jd-chip">{label}</span>
                    )}
                  </li>
                )
              })}
          </ul>
        </Container>
      </Section>

      {/* ── Who we're looking for ────────────────────────────────────── */}
      <Section tone="cloud" join="soft" spacing="none" className="py-20 md:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-accent">Who we&rsquo;re looking for</p>
            <RevealLines
              className="mt-7 text-display-md"
              lines={['Curious.', 'Committed.', { text: 'Ready to learn.', className: 'text-brand' }]}
            />
            <p className="mx-auto mt-8 max-w-xl text-lead text-fg-muted">
              No space experience needed. Most of the team is at{' '}
              {site.institution}, with members from FCUL and ISEG too.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Apply ────────────────────────────────────────────────────── */}
      <Section tone="void" join="curve" spacing="none" id="apply" className="scroll-mt-[var(--nav-height)] py-20 md:py-32">
        <OrbitBackdrop
          className="-right-56 -top-48 h-[820px] w-[820px]"
          opacity={0.35}
        />
        <Container wide className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-7">
              <StatusPill dark />

              <RevealLines
                className="jn-title jn-title--close mt-8"
                lines={[
                  'Your next project',
                  { text: 'could be in orbit.', className: 'text-accent' },
                ]}
              />

              <p className="mt-7 max-w-xl text-lead text-fg-muted">
                {copy.body}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonAnchor
                  href={primaryCta}
                  arrow
                  {...(isOpen && recruitment.applicationUrl
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  {copy.cta}
                </ButtonAnchor>
                <ButtonLink href="/contact#join" variant="secondary">
                  Ask us anything
                </ButtonLink>
              </div>

              <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-rule pt-6 sm:grid-cols-3">
                {recruitment.status !== 'interest' ? (
                  <div>
                    <dt className="eyebrow text-fg-faint">
                      {isOpen ? 'Window' : 'Last cycle'}
                    </dt>
                    <dd className="mt-1.5 text-sm text-fg">{recruitment.window}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="eyebrow text-fg-faint">Process</dt>
                  <dd className="mt-1.5 text-sm text-fg">
                    {recruitment.averageTimeline}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-fg-faint">Mode</dt>
                  <dd className="mt-1.5 text-sm text-fg">{recruitment.mode}</dd>
                </div>
              </dl>
            </div>

            <Reveal className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-panel sm:aspect-[4/3] lg:aspect-[4/5]">
                <Image
                  src="/images/updates/bootcamp-01.jpg"
                  alt="The LISAT team together at the CubeSat Portugal bootcamp"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[50%_45%]"
                />
              </div>
              <p className="eyebrow mt-4 text-fg-faint">
                {site.name} · CubeSat Portugal bootcamp
              </p>
            </Reveal>
          </div>

          <p className="mt-14 font-mono text-xs text-fg-faint">
            Questions?{' '}
            <a
              href={`mailto:${contact.email}`}
              className="text-accent transition-colors hover:text-fg"
            >
              {contact.email}
            </a>
          </p>
        </Container>
      </Section>
    </>
  )
}

/** The recruitment state, as data says it is. */
function StatusPill({ dark = false }: { dark?: boolean }) {
  return (
    <p
      className={clsx(
        'inline-flex items-center gap-2.5 rounded-control border px-4 py-2',
        dark ? 'border-rule-strong' : 'border-rule-strong bg-surface-raised',
      )}
    >
      <span
        className={clsx(
          'h-2 w-2 rounded-full',
          isOpen ? 'animate-pulse bg-signal' : 'bg-fg-faint',
        )}
        aria-hidden="true"
      />
      <span className="eyebrow text-fg-muted">{copy.badge}</span>
    </p>
  )
}
