'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { specs, subsystems } from '@/data/mission'
import { getDepartment } from '@/data/departments'
import { clsx } from '@/lib/utils'

/**
 * INSIDE LISAT-01 — the spacecraft as an engineering drawing.
 *
 * One object, two levels of understanding. The render is the protagonist
 * throughout: it arrives once, the specifications are drawn around it, and
 * then those give way to the subsystems that build it without the spacecraft
 * ever leaving the screen. The chapter reads as one piece because it is one
 * piece.
 *
 * ── What the leader lines are allowed to claim ────────────────────────────
 *
 * We have a 2D render and no map from subsystem to visible board. So no line
 * in this composition points at a component. Every one of them terminates on
 * the spacecraft's outer silhouette, which is a claim we can actually make:
 * this fact belongs to this object. Pointing a line at a particular PCB and
 * calling it the AIS receiver would be inventing engineering information, and
 * it would look identical to the real thing — which is exactly why it must
 * not be done.
 *
 * For the same reason the general facts — mission, ground segment, programme
 * — get no leader at all. They sit in a note block under the drawing, the way
 * a title block does on a real sheet, because they describe the programme
 * rather than the hardware.
 *
 * ── Where the numbers come from ───────────────────────────────────────────
 *
 * The silhouette coordinates below were measured off the render itself, not
 * estimated: between 15% and 85% of its height the frame's edges are dead
 * straight at 26.5% and 79.0% of its width. That is what lets a line land on
 * the structure at any viewport size.
 *
 * ── The language ──────────────────────────────────────────────────────────
 *
 * REVEAL and FOCUS only. The mission opening above already spends thirteen
 * screens on PROGRESS; a second scroll-scrubbed sequence would be the same
 * idea told twice. Here the composition assembles once on arrival, the mode
 * changes on a threshold, and the rest is hover.
 */

/* ── Geometry ─────────────────────────────────────────────────────────────
 *
 * Everything is a percentage of the plate, which is 16:9. The render is also
 * 16:9, so insetting it by a fixed percentage scales it uniformly and every
 * coordinate below stays true at any size.
 */

/**
 * The render's box inside the plate.
 *
 * 72% rather than nearly the whole sheet, and offset so that the *spacecraft*
 * lands in the middle rather than the file it sits in — its frame runs from
 * 26.5% to 79% of the render, so a centred file puts the object right of
 * centre. The 28% given up is what the labels stand in, and what holds them
 * clear of the hardware they are naming.
 */
const IMG = { left: 12, top: 14, size: 72 }

/** Measured off the render: the frame's straight left and right edges. */
const EDGE = { left: 26.5, right: 79.0 }

/** Those edges expressed in plate coordinates. */
const X_L = IMG.left + (EDGE.left / 100) * IMG.size // 27.2
const X_R = IMG.left + (EDGE.right / 100) * IMG.size // 73.1

/** The drawing surface. Uniform scale, so circles stay circles. */
const VB = { w: 1600, h: 900 }
const vx = (pct: number) => (pct / 100) * VB.w
const vy = (pct: number) => (pct / 100) * VB.h

/** Where a label column ends and its leader begins. */
const GUTTER = { left: 20, right: 80 }

/**
 * A leader: a short horizontal run out of the label, then one angle into the
 * silhouette. Two segments, never more — a third makes it decoration.
 */
function leader(side: 'left' | 'right', labelY: number, anchorY: number) {
  if (side === 'left') {
    return `M ${vx(GUTTER.left + 0.6)} ${vy(labelY)} L ${vx(24)} ${vy(labelY)} L ${vx(X_L)} ${vy(anchorY)}`
  }
  return `M ${vx(GUTTER.right - 0.6)} ${vy(labelY)} L ${vx(76)} ${vy(labelY)} L ${vx(X_R)} ${vy(anchorY)}`
}

/** Pull a spec by its label so `mission.ts` stays the single source. */
const spec = (label: string) => specs.find((s) => s.label === label)?.value ?? ''

/**
 * The three facts that belong to the hardware, and may therefore point at it.
 * `labelY` is where the text sits; `anchorY` is where the line meets the frame.
 */
const CALLOUTS = [
  { label: 'Form factor', side: 'left' as const, labelY: 33, anchorY: 38 },
  { label: 'Dimensions', side: 'left' as const, labelY: 69, anchorY: 64 },
  { label: 'Payload', side: 'right' as const, labelY: 35, anchorY: 41 },
]

/** The facts that describe the programme, not the spacecraft. No leaders. */
const NOTES = ['Mission', 'Ground segment', 'Programme']

/**
 * Subsystems, distributed evenly around the frame.
 *
 * Evenly, and deliberately so: an arrangement that looked considered would
 * imply we know where each one lives. We do not. They start below 30% because
 * that is where the antennas stop crossing the margins.
 */
const RING: { side: 'left' | 'right'; labelY: number; anchorY: number }[] = [
  { side: 'left', labelY: 32, anchorY: 36 },
  { side: 'left', labelY: 54, anchorY: 54 },
  { side: 'left', labelY: 76, anchorY: 72 },
  { side: 'right', labelY: 32, anchorY: 36 },
  { side: 'right', labelY: 54, anchorY: 54 },
  { side: 'right', labelY: 76, anchorY: 72 },
]

/** Left column then right column, so the ring reads top-down on each side. */
const ORDER = [0, 1, 2, 3, 4, 5]

export function MissionSpacecraft() {
  const root = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'specs' | 'systems'>('specs')
  const [active, setActive] = useState(0)

  /*
   * Reveal and mode are both thresholds, not scroll positions — no handler
   * runs per frame anywhere in this section.
   *
   * The data attribute is only added once JavaScript is running. Without it
   * the CSS shows the finished composition, so no script means no animation
   * rather than no content.
   */
  useEffect(() => {
    const rootEl = root.current
    const cueEl = cue.current
    if (!rootEl) return

    rootEl.dataset.reveal = 'idle'

    const enter = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          rootEl.dataset.reveal = 'in'
          enter.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    enter.observe(rootEl)

    let swap: IntersectionObserver | undefined
    if (cueEl) {
      swap = new IntersectionObserver(
        ([e]) => setMode(e.isIntersecting ? 'systems' : 'specs'),
        // Fires as the cue passes the middle of the screen.
        { rootMargin: '-50% 0px -50% 0px' },
      )
      swap.observe(cueEl)
    }

    return () => {
      enter.disconnect()
      swap?.disconnect()
      delete rootEl.dataset.reveal
    }
  }, [])

  const current = subsystems[active]
  const currentDept = current ? getDepartment(current.department) : undefined

  return (
    <Section
      tone="cloud"
      join="soft"
      spacing="none"
      id="specifications"
      // `position: sticky` below needs no clipping ancestor.
      clip={false}
      className="py-20 md:py-28"
    >
      <div ref={root} className="sc relative" data-mode={mode}>
        <Container wide>
          <div className="sc-rig">
            <div className="sc-stick">
              {/* ── Heading ─────────────────────────────────────── */}
              <div className="sc-heads">
                <div className="sc-head" data-for="specs">
                  <p className="eyebrow tabular text-accent">01 / The spacecraft</p>
                  <h2 className="sc-title mt-5">
                    Inside
                    <br />
                    LISAT-01.
                  </h2>
                  <p className="sc-lead mt-4 text-sm text-fg-muted">
                    A 1U CubeSat built around an AIS mission.
                  </p>
                </div>

                <div className="sc-head" data-for="systems" aria-hidden={mode !== 'systems'}>
                  <p className="eyebrow tabular text-accent">02 / Architecture</p>
                  <h2 className="sc-title mt-5">
                    Built by
                    <br />
                    systems.
                  </h2>
                  <p className="sc-lead mt-4 text-sm text-fg-muted">
                    Six departments, one spacecraft.
                  </p>
                </div>
              </div>

              {/* ── The drawing ─────────────────────────────────── */}
              <div className="sc-plate">
                {/*
                  The grid belongs to the drawing, not to the section. It also
                  has to live in here for a second reason: `multiply` blends
                  against the backdrop within its own stacking context, and
                  the sticky wrapper opens one — so the render needs something
                  painted beneath it inside the plate or the white field has
                  nothing to disappear into.
                */}
                <div
                  className="sc-grid grid-overlay pointer-events-none absolute inset-0"
                  aria-hidden="true"
                />

                {/*
                  `multiply` is what takes the render out of its white box
                  without touching the file. Keying the white out would have
                  eaten the white connectors along the top of the stack, which
                  are part of the hardware.
                */}
                <div className="sc-craft">
                  <Image
                    src="/images/mission/lisat-01-internal.jpg"
                    alt="Engineering render of the LISAT-01 spacecraft, showing the internal stack of boards inside its 1U frame with the antennas deployed"
                    fill
                    sizes="(min-width: 1024px) 70vw, 92vw"
                    className="object-contain"
                  />
                </div>

                {/* Leaders and anchors. Decorative: every label is real text. */}
                <svg
                  className="sc-lines"
                  viewBox={`0 0 ${VB.w} ${VB.h}`}
                  fill="none"
                  aria-hidden="true"
                >
                  {CALLOUTS.map((c, i) => (
                    <g key={c.label} className="sc-line" data-for="specs" style={{ '--i': i } as React.CSSProperties}>
                      <path
                        d={leader(c.side, c.labelY, c.anchorY)}
                        pathLength={1}
                        stroke="currentColor"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={vx(c.side === 'left' ? X_L : X_R)}
                        cy={vy(c.anchorY)}
                        r={5}
                        fill="currentColor"
                      />
                    </g>
                  ))}

                  {ORDER.map((n, i) => {
                    const r = RING[n]
                    const sub = subsystems[n]
                    if (!sub) return null
                    return (
                      <g
                        key={sub.department}
                        className="sc-line"
                        data-for="systems"
                        data-on={n === active ? 'true' : 'false'}
                        style={{ '--i': i } as React.CSSProperties}
                      >
                        <path
                          d={leader(r.side, r.labelY, r.anchorY)}
                          pathLength={1}
                          stroke="currentColor"
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx={vx(r.side === 'left' ? X_L : X_R)}
                          cy={vy(r.anchorY)}
                          r={5}
                          fill="currentColor"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Specification callouts */}
                {CALLOUTS.map((c, i) => (
                  <div
                    key={c.label}
                    className={clsx('sc-callout', c.side === 'left' ? 'sc-at-left' : 'sc-at-right')}
                    data-for="specs"
                    style={{ '--y': `${c.labelY}%`, '--i': i } as React.CSSProperties}
                  >
                    <p className="eyebrow text-fg-faint">{c.label}</p>
                    <p className="sc-value mt-2">{spec(c.label)}</p>
                  </div>
                ))}

                {/* Subsystem callouts */}
                {ORDER.map((n, i) => {
                  const sub = subsystems[n]
                  const d = sub ? getDepartment(sub.department) : undefined
                  if (!sub || !d) return null
                  const r = RING[n]
                  const on = n === active
                  return (
                    <button
                      key={sub.department}
                      type="button"
                      onMouseEnter={() => setActive(n)}
                      onFocus={() => setActive(n)}
                      onClick={() => setActive(n)}
                      aria-pressed={on}
                      tabIndex={mode === 'systems' ? 0 : -1}
                      className={clsx(
                        'sc-callout sc-sub',
                        r.side === 'left' ? 'sc-at-left' : 'sc-at-right',
                      )}
                      data-for="systems"
                      data-on={on ? 'true' : 'false'}
                      style={{ '--y': `${r.labelY}%`, '--i': i } as React.CSSProperties}
                    >
                      <span className="sc-abbr">{d.abbr}</span>
                      <span className="sc-subname mt-1.5">{d.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* ── The block under the drawing ─────────────────── */}
              <div className="sc-foot">
                <dl className="sc-notes" data-for="specs">
                  {NOTES.map((label) => (
                    <div key={label}>
                      <dt className="eyebrow text-fg-faint">{label}</dt>
                      <dd className="mt-2 text-[0.9375rem] font-medium leading-snug tracking-snug text-fg">
                        {spec(label)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="sc-detail" data-for="systems">
                  {current && currentDept ? (
                    <div key={current.department} className="enter-fade sc-detail-in">
                      <p className="eyebrow text-accent">{currentDept.abbr}</p>
                      <p className="mt-2.5 text-lg font-semibold tracking-snug text-fg">
                        {currentDept.name}
                      </p>
                      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-fg-muted">
                        {current.summary}
                      </p>
                      <Link
                        href={`/departments/${currentDept.slug}`}
                        tabIndex={mode === 'systems' ? 0 : -1}
                        className="eyebrow mt-4 inline-flex items-center gap-2 text-accent transition-colors hover:text-fg"
                      >
                        Department
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Passing the middle of the screen is what changes the mode. */}
            <div ref={cue} className="sc-cue" aria-hidden="true" />
          </div>

          {/* ── Below lg, and without JavaScript: read straight down ── */}
          <div className="sc-stack">
            <dl className="mt-12 divide-y divide-rule border-t border-rule">
              {[...CALLOUTS.map((c) => c.label), ...NOTES].map((label) => (
                <div key={label} className="py-5">
                  <dt className="eyebrow text-fg-faint">{label}</dt>
                  <dd className="mt-2 text-xl font-semibold leading-tight tracking-tightest text-fg">
                    {spec(label)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-16">
              <p className="eyebrow tabular text-accent">02 / Architecture</p>
              <h2 className="sc-title mt-5">
                Built by
                <br />
                systems.
              </h2>

              <ul className="mt-10 border-t border-rule">
                {subsystems.map((sub, i) => {
                  const d = getDepartment(sub.department)
                  if (!d) return null
                  const on = i === active
                  return (
                    <li key={sub.department} className="border-b border-rule">
                      <button
                        type="button"
                        onClick={() => setActive(on ? -1 : i)}
                        aria-expanded={on}
                        className="grid w-full grid-cols-[3.5rem_1fr] items-baseline gap-x-4 py-5 text-left"
                      >
                        <span
                          className={clsx(
                            'font-mono text-xs transition-colors',
                            on ? 'text-accent' : 'text-fg-faint',
                          )}
                        >
                          {d.abbr}
                        </span>
                        <span
                          className={clsx(
                            'text-lg font-medium tracking-snug transition-colors',
                            on ? 'text-accent' : 'text-fg',
                          )}
                        >
                          {d.name}
                        </span>
                      </button>
                      {on ? (
                        <div className="enter-fade -mt-1 pb-5 pl-[4.5rem]">
                          <p className="text-[0.9375rem] leading-relaxed text-fg-muted">
                            {sub.summary}
                          </p>
                          <Link
                            href={`/departments/${d.slug}`}
                            className="eyebrow mt-4 inline-flex items-center gap-2 text-accent"
                          >
                            Department
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  )
}
