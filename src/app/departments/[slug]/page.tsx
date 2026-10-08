import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { CtaBand } from '@/components/ui/CtaBand'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { MemberCard } from '@/components/team/MemberCard'
import { departments, getDepartment } from '@/data/departments'
import { membersOfDepartment } from '@/lib/team-source'
import { mission } from '@/data/mission'
import { gates } from '@/data/recruitment'

/**
 * People come from Sanity, as on the Team page, so published edits (a new
 * photograph, someone joining) appear within a minute without a redeploy.
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

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dept = getDepartment(slug)
  if (!dept) notFound()

  const members = await membersOfDepartment(dept.slug)
  const leads = members.filter((m) => m.rank === 'lead')
  const rest = members.filter((m) => m.rank !== 'lead')
  const gate = gates.find((g) => g.department === dept.slug)

  // Neighbouring departments, for the footer navigation.
  const index = departments.findIndex((d) => d.slug === dept.slug)
  const next = departments[(index + 1) % departments.length]

  return (
    <>
      {/* Hero */}
      <section className="relative tone-void overflow-hidden rounded-b-feature pt-[var(--nav-height)]">
        {dept.image ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={dept.image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-25"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-void via-void/90 to-void/70"
            />
          </>
        ) : (
          <OrbitBackdrop
            className="-right-40 -top-40 hidden h-[700px] w-[700px] lg:block"
            opacity={0.4}
          />
        )}

        <Container wide className="relative py-16 md:py-24">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All departments
          </Link>

          <p className="eyebrow mt-10 text-accent">{dept.abbr}</p>
          <h1 className="mt-4 max-w-[20ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest">
            {dept.name}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
            {dept.summary}
          </p>

          {/* Role on the mission */}
          <div className="mt-10 max-w-2xl border-l-2 border-accent pl-5">
            <p className="eyebrow text-accent">On {mission.name}</p>
            <p className="mt-2 text-base leading-relaxed text-fg md:text-lg">
              {dept.roleOnLisat01}
            </p>
          </div>
        </Container>
      </section>

      {/* What we do + responsibilities */}
      <Section tone="paper" spacing="loose">
        <Container wide>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow="What we do" index="01" title="Inside the department" />
              <div className="prose-lisat mt-8">
                {dept.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {dept.disciplines.length > 0 ? (
                <div className="mt-10">
                  <h3 className="eyebrow text-fg-faint">Engineering areas</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {dept.disciplines.map((d) => (
                      <li
                        key={d}
                        className="border border-rule px-3 py-1.5 font-mono text-xs text-fg-muted"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="eyebrow text-fg-faint">Key responsibilities</h2>
              <ol className="mt-6">
                {dept.responsibilities.map((item, i) => (
                  <Reveal as="li" key={item} delay={i * 0.05}>
                    <div className="flex gap-5 border-t border-rule py-4">
                      <span
                        className="tabular shrink-0 font-mono text-xs text-accent"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                        {item}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      {/* People */}
      {members.length > 0 ? (
        <Section tone="cloud" join="soft" spacing="loose">
          <div
            className="grid-overlay pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <Container wide className="relative">
            <SectionHeading
              eyebrow="People"
              index="02"
              title={`${members.length} ${members.length === 1 ? 'person' : 'people'} in ${dept.abbr}`}
            />

            {leads.length > 0 ? (
              <div className="mt-12">
                <h3 className="eyebrow text-fg-faint">
                  {leads.length === 1 ? 'Department leader' : 'Department leaders'}
                </h3>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {leads.map((member) => (
                    <li key={member.id}>
                      <MemberCard member={member} showDepartment={false} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div className="mt-14">
                <h3 className="eyebrow text-fg-faint">Team members</h3>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {rest.map((member, i) => (
                    <Reveal as="li" key={member.id} delay={Math.min(i, 8) * 0.04}>
                      <MemberCard member={member} showDepartment={false} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {/* What you would do here */}
      {gate ? (
        <Section tone="ice" join="soft" spacing="default">
          <Container wide>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHeading
                  eyebrow="Joining this department"
                  index="03"
                  title="What new members work on"
                />
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                <div>
                  <h3 className="eyebrow text-fg-faint">Typical first tasks</h3>
                  <ul className="mt-4 space-y-2.5">
                    {gate.tasks.map((task) => (
                      <li
                        key={task}
                        className="border-t border-rule pt-2.5 text-sm text-fg-muted"
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow text-fg-faint">Useful to have</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {gate.skills.map((skill) => (
                      <li
                        key={skill}
                        className="border border-rule px-3 py-1.5 font-mono text-xs text-fg-muted"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Next department */}
      <Section tone="cloud" join="soft" spacing="tight">
        <Container wide>
          <Link
            href={`/departments/${next.slug}`}
            className="group flex flex-col gap-2 border-t border-rule pt-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <span>
              <span className="eyebrow text-fg-faint">Next department</span>
              <span className="mt-2 block text-2xl font-medium tracking-snug text-fg transition-colors group-hover:text-accent md:text-3xl">
                {next.name}
              </span>
            </span>
            <ArrowRight
              className="h-6 w-6 shrink-0 text-fg-faint transition-all group-hover:translate-x-1 group-hover:text-accent"
              aria-hidden="true"
            />
          </Link>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Join us"
        title={`Want to work on ${dept.abbr}?`}
        body="Applications open once or twice a year. Tell us what you want to build and we will let you know when the next cycle starts."
        primary={{ label: 'How to join', href: '/join-us' }}
        secondary={{ label: `About ${mission.name}`, href: '/mission/lisat-01' }}
        tone="void"
      />
    </>
  )
}
