'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { specs, subsystems } from '@/data/mission'
import { getDepartment } from '@/data/departments'
import { clsx } from '@/lib/utils'

/**
 * The spacecraft, and what it is made of.
 *
 * One chapter where there used to be two columns of documentation — a
 * specifications table beside a list of subsystems, each with its own heading
 * and its own paragraph. The facts were worth keeping; the presentation read
 * like an appendix on a page that is otherwise almost entirely visual.
 *
 * So: the figures are the typography, the render is the subject, and only one
 * subsystem explains itself at a time. That last part is what removes most of
 * the text — nine descriptions were on screen at once, and now the reader
 * asks for the one they want.
 */

/**
 * The figures worth setting large. Provisional values are deliberately left
 * out: "TBC" in 48pt is not a specification, it is an apology.
 */
const HEADLINE_SPECS = specs.filter((s) => !s.provisional).slice(0, 6)

const pendingCount = specs.filter((s) => s.provisional).length

export function MissionSpacecraft() {
  const [active, setActive] = useState(0)
  const current = subsystems[active]
  const dept = current ? getDepartment(current.department) : undefined

  return (
    <Section
      tone="cloud"
      join="soft"
      spacing="none"
      id="specifications"
      className="py-20 md:py-28"
    >
      {/* A whisper of the engineering grid, not graph paper. */}
      <div
        className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{ backgroundSize: '96px 96px' }}
      />

      <Container wide className="relative">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">02 / The spacecraft</p>
          <h2 className="mt-6 text-display-sm">
            Small satellite.
            <br />
            Real mission.
          </h2>
        </div>

        {/* ── The spacecraft, with its figures around it ───────────── */}
        <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-3 lg:grid-cols-1">
            {HEADLINE_SPECS.slice(0, 3).map((spec) => (
              <Spec key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </dl>

          <Reveal className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-void md:rounded-[3rem]">
              <Image
                src="/images/mission/render-cubesat.jpg"
                alt="Render of LISAT-01 in low Earth orbit"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-3 lg:grid-cols-1 lg:text-right">
            {HEADLINE_SPECS.slice(3).map((spec) => (
              <Spec key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </dl>
        </div>

        {pendingCount > 0 ? (
          <p className="mt-10 font-mono text-xs text-fg-faint">
            * {pendingCount} further values pending design freeze.
          </p>
        ) : null}

        {/* ── What it is made of ──────────────────────────────────── */}
        <div className="mt-20 md:mt-28">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">03 / Architecture</p>
            <h3 className="mt-6 text-display-sm">
              Built by
              <br />
              systems.
            </h3>
          </div>

          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-10">
            {/*
              Every subsystem is named; one at a time explains itself. FOCUS,
              the same grammar the team page uses for people.
            */}
            <ul
              className="lg:col-span-7"
              onMouseLeave={() => setActive(0)}
            >
              {subsystems.map((sub, i) => {
                const d = getDepartment(sub.department)
                if (!d) return null
                const on = i === active
                return (
                  <li key={sub.department}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className={clsx(
                        'group grid w-full grid-cols-[4rem_1fr] items-baseline gap-x-5 border-t border-rule py-4 text-left transition-[opacity,color] duration-300 md:py-5',
                        on ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                      )}
                    >
                      <span
                        className={clsx(
                          'font-mono text-xs transition-colors duration-300',
                          on ? 'text-accent' : 'text-fg-faint',
                        )}
                      >
                        {d.abbr}
                      </span>
                      <span
                        className={clsx(
                          'text-[1.0625rem] font-medium tracking-snug transition-colors duration-300 md:text-xl',
                          on ? 'text-accent' : 'text-fg',
                        )}
                      >
                        {d.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* One description, for whichever is being looked at. */}
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-5">
              {current && dept ? (
                <div key={current.department} className="enter-fade">
                  <p className="text-lead text-fg-muted">{current.summary}</p>
                  <Link
                    href={`/departments/${dept.slug}`}
                    className="eyebrow mt-6 inline-flex items-center gap-2 text-accent transition-colors hover:text-fg"
                  >
                    Department
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/** A figure, set large, with its name small above it. */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-fg-faint">{label}</dt>
      <dd className="mt-2.5 text-[clamp(1.25rem,2.2vw,1.875rem)] font-semibold leading-[1.1] tracking-tightest text-fg">
        {value}
      </dd>
    </div>
  )
}
