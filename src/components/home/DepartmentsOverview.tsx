import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { departments } from '@/data/departments'
import { mission } from '@/data/mission'
import { membersOf } from '@/data/team'
import { clsx } from '@/lib/utils'
import type { Department } from '@/lib/types'

/**
 * Departments presented as a system breakdown: one spacecraft at the top,
 * four segments beneath it, and the teams that own each one.
 *
 * The connector rules are drawn with thin absolutely-positioned lines rather
 * than an SVG, so the diagram reflows cleanly at every breakpoint.
 */

const segments: {
  id: Department['segment']
  label: string
  note: string
}[] = [
  { id: 'payload', label: 'Payload', note: 'What the mission flies to do' },
  { id: 'platform', label: 'Platform', note: 'Powers, points and protects it' },
  { id: 'ground', label: 'Ground segment', note: 'Brings the data down' },
  { id: 'organisation', label: 'Organisation', note: 'Makes the work possible' },
]

function SegmentColumn({
  segment,
  index,
  total,
}: {
  segment: (typeof segments)[number]
  index: number
  total: number
}) {
  const items = departments.filter((d) => d.segment === segment.id)
  if (items.length === 0) return null

  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <Reveal as="li" delay={index * 0.07} className="relative">
      {/* Horizontal bus, trimmed at the outer ends so it reads as a diagram. */}
      <span
        aria-hidden="true"
        className={clsx(
          'absolute top-0 hidden h-px bg-rule lg:block',
          // The grid has a 2rem gutter; reach half of it so the bus is unbroken.
          isFirst
            ? 'left-1/2 -right-4'
            : isLast
              ? '-left-4 right-1/2'
              : '-left-4 -right-4',
        )}
      />
      {/* Drop line into the column */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 hidden h-8 w-px bg-rule lg:block"
      />

      <div className="border-t border-rule pt-6 lg:border-t-0 lg:pt-14">
        <h3 className="text-base font-medium md:text-lg">{segment.label}</h3>
        <p className="mt-1 font-mono text-xs text-fg-faint">{segment.note}</p>

        <ul className="mt-5">
          {items.map((dept) => {
            const count = membersOf(dept.slug).length
            return (
              <li key={dept.slug}>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="group flex items-baseline gap-3 border-t border-rule py-3.5 transition-colors hover:text-accent"
                >
                  <span className="font-mono text-xs text-accent">{dept.abbr}</span>
                  <span className="flex-1 text-[0.9375rem] leading-snug">
                    {dept.name}
                  </span>
                  <span className="tabular font-mono text-[0.6875rem] text-fg-faint">
                    {count}
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 self-center text-fg-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </Reveal>
  )
}

export function DepartmentsOverview() {
  return (
    <Section tone="ice" join="soft" spacing="loose" id="departments">
      <Container wide>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <SectionIndex index="04" label="Systems & teams" />
            <h2 className="mt-9 text-display-md">
              Eight departments, one spacecraft.
            </h2>
            <p className="mt-6 max-w-prose text-lead text-fg-muted">
              {mission.name} is one machine made of many. Each department owns a
              subsystem or a function, writes its own requirements, and has to
              make them meet everyone else&rsquo;s.
            </p>
          </div>
          <TextLink href="/departments" className="shrink-0 md:pb-3">
            All departments
          </TextLink>
        </div>

        {/* Root node */}
        <div className="mt-16 flex flex-col items-center md:mt-20">
          <div className="border border-rule-strong bg-surface px-6 py-4 text-center">
            <p className="eyebrow text-accent">Mission</p>
            <p className="mt-2 text-title">
              {mission.name}
            </p>
            <p className="mt-1 font-mono text-xs text-fg-faint">
              1U CubeSat · 10 × 10 × 10 cm
            </p>
          </div>
          {/* Trunk */}
          <span
            aria-hidden="true"
            className="hidden h-10 w-px bg-rule lg:block"
          />
        </div>

        <ul className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment, i) => (
            <SegmentColumn
              key={segment.id}
              segment={segment}
              index={i}
              total={segments.length}
            />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
