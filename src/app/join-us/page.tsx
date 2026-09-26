import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/ui/Figure'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { Faq } from '@/components/join/Faq'
import {
  faqs,
  gates,
  recruitment,
  statusCopy,
  steps,
  whatYouLearn,
} from '@/data/recruitment'
import { getDepartment } from '@/data/departments'
import { contact, site } from '@/data/site'
import { mission } from '@/data/mission'

const copy = statusCopy[recruitment.status]

export const metadata: Metadata = {
  title: 'Join Us',
  description: `Join LISAT and work on ${mission.name}, a student-built 1U CubeSat at ${site.institution}. ${copy.title}.`,
  alternates: { canonical: '/join-us' },
}

/** The single source of truth for where the main CTA points. */
const primaryCta =
  recruitment.status === 'open' && recruitment.applicationUrl
    ? { href: recruitment.applicationUrl, external: true }
    : { href: recruitment.interestMailto, external: true }

export default function JoinUsPage() {
  const isOpen = recruitment.status === 'open'

  return (
    <>
      {/* Hero */}
      <section className="relative isolate tone-ice overflow-hidden rounded-b-feature pt-[var(--nav-height)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/updates/bootcamp-03.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ice via-ice/[0.92] to-ice/70"
        />
        <OrbitBackdrop
          className="-right-40 -top-40 -z-10 hidden h-[720px] w-[720px] lg:block"
          opacity={0.35}
        />

        <Container wide className="relative py-20 md:py-28">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Recruitment
          </p>

          <h1 className="mt-6 max-w-[15ch] text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[0.95] tracking-tightest">
            Build something that goes to space.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
            {mission.name} is designed, built and tested by undergraduates. If you
            join, you get a subsystem, a deadline and people depending on you —
            which is a far better way to learn engineering than any coursework.
          </p>

          {/* Status panel */}
          <div className="mt-12 max-w-2xl border border-rule bg-surface-raised/85 p-6 backdrop-blur-sm md:p-8">
            <div className="flex items-center gap-2.5">
              <span
                className={
                  'h-2 w-2 rounded-full ' +
                  (isOpen ? 'animate-pulse bg-signal' : 'bg-fg-faint')
                }
                aria-hidden="true"
              />
              <span className="eyebrow text-fg-muted">{copy.badge}</span>
            </div>

            <h2 className="mt-4 text-xl font-medium tracking-snug md:text-2xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
              {copy.body}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-rule pt-6 sm:grid-cols-3">
              <div>
                <dt className="eyebrow text-fg-faint">Window</dt>
                <dd className="mt-1.5 text-sm text-fg">{recruitment.window}</dd>
              </div>
              <div>
                <dt className="eyebrow text-fg-faint">Mode</dt>
                <dd className="mt-1.5 text-sm text-fg">{recruitment.mode}</dd>
              </div>
              <div>
                <dt className="eyebrow text-fg-faint">Timeline</dt>
                <dd className="mt-1.5 text-sm text-fg">
                  {recruitment.averageTimeline}
                </dd>
              </div>
            </dl>

            <ButtonAnchor href={primaryCta.href} arrow className="mt-8">
              {copy.cta}
            </ButtonAnchor>
          </div>
        </Container>
      </section>

      {/* Why join */}
      <Section tone="ice" join="soft" spacing="loose">
        <Container wide>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why join"
                index="01"
                title="You will own something real."
              />
              <div className="prose-lisat mt-8">
                <p>
                  LISAT is not a study group. There is a jury, a schedule, a
                  competition and partners who expect results. Every department
                  has deliverables, and every member has a piece of them.
                </p>
                <p>
                  Our last recruitment cycle brought in {recruitment.lastIntake}{' '}
                  new members from several universities. Most had never touched a
                  spacecraft. Within a semester they were writing requirements,
                  running tests and defending decisions in reviews.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <ul className="grid gap-px bg-rule sm:grid-cols-2">
                {whatYouLearn.map((item, i) => (
                  <Reveal as="li" key={item.title} delay={i * 0.06}>
                    <div className="h-full bg-surface p-6">
                      <h3 className="text-base font-medium md:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Departments you can join */}
      <Section tone="cloud" join="soft" spacing="loose" id="departments">
        <div
          className="grid-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <Container wide className="relative">
          <SectionHeading
            eyebrow="Where you would fit"
            index="02"
            title="Pick up to three departments"
            lead="Each department takes people at different levels. If you are unsure, say so in your application — we often suggest a better fit than the one people pick."
          />

          <ul className="mt-14 grid gap-px bg-rule md:grid-cols-2">
            {gates.map((gate, i) => {
              const dept = getDepartment(gate.department)
              if (!dept) return null

              return (
                <Reveal as="li" key={gate.code} delay={Math.min(i, 6) * 0.04}>
                  <div className="flex h-full flex-col bg-surface p-6 md:p-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <Link
                        href={`/departments/${dept.slug}`}
                        className="group inline-flex items-baseline gap-2 text-lg font-medium tracking-snug text-fg transition-colors hover:text-accent md:text-xl"
                      >
                        {dept.name}
                        <ArrowRight
                          className="h-4 w-4 self-center opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Link>
                      <span className="font-mono text-xs text-accent">
                        {dept.abbr}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-fg-muted">{dept.tagline}</p>

                    <div className="mt-5 flex-1">
                      <h3 className="eyebrow text-fg-faint">First tasks</h3>
                      <ul className="mt-3 space-y-1.5">
                        {gate.tasks.map((task) => (
                          <li key={task} className="text-sm text-fg-muted">
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
                      {gate.skills.map((skill) => (
                        <li
                          key={skill}
                          className="border border-rule px-2.5 py-1 font-mono text-[0.6875rem] text-fg-muted"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </Container>
      </Section>

      {/* Who can apply + process */}
      <Section tone="ice" join="soft" spacing="loose">
        <Container wide>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Who can apply"
                index="03"
                title="Curiosity over credentials"
              />
              <div className="prose-lisat mt-8">
                <p>
                  Most of the team studies at {site.institution}, but we also have
                  members from FCUL and ISEG. Any degree that touches engineering,
                  science, design, communication or management has a place here.
                </p>
                <p>
                  You do not need previous space experience, a high GPA or a
                  portfolio. You need to show up, ask questions, and finish what
                  you start.
                </p>
              </div>

              <Figure
                src="/images/updates/onboarding-01.jpg"
                alt="New LISAT members during onboarding"
                ratio="landscape"
                annotation="ONBOARDING"
                className="mt-10"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                eyebrow="Recruitment process"
                index="04"
                title="From application to first task"
                lead={`Usually ${recruitment.averageTimeline} from start to finish.`}
              />

              <ol className="mt-10">
                {steps.map((step, i) => (
                  <Reveal as="li" key={step.title} delay={i * 0.06}>
                    <div className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-rule py-6">
                      <span
                        className="tabular font-mono text-sm text-accent"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base font-medium md:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-fg-muted md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="cloud" join="soft" spacing="loose" id="faq">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            index="05"
            title="Questions we get asked"
          />
          <div className="mt-12">
            <Faq items={faqs} />
          </div>

          <div className="mt-14 border border-rule p-6 md:p-8">
            <h3 className="text-lg font-medium md:text-xl">
              Still not sure if it is for you?
            </h3>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-fg-muted md:text-base">
              Email us. Tell us what you are studying and what you would like to
              work on, and someone from the relevant department will answer.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonAnchor href={primaryCta.href} arrow>
                {copy.cta}
              </ButtonAnchor>
              <ButtonLink href="/departments" variant="secondary">
                Read about the departments
              </ButtonLink>
            </div>
            <p className="mt-5 font-mono text-xs text-fg-faint">
              {contact.email}
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
