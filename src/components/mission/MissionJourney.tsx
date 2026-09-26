'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { phases } from '@/data/mission'
import { clsx } from '@/lib/utils'

/**
 * The mission, travelled rather than listed.
 *
 * On a wide screen the section pins and vertical scrolling drives a horizontal
 * journey: a blue signal runs along a curved path while each milestone lights
 * as it reaches the middle of the viewport. The path is SVG so it can actually
 * curve, and the signal is a stroke dash offset tied to scroll progress.
 *
 * ## Why GSAP here
 *
 * ScrollTrigger's `containerAnimation` is the reason. It lets each milestone
 * own a trigger expressed against the *horizontal* tween rather than against
 * page scroll, so "this milestone is near the centre" stays correct without
 * recomputing positions by hand. Nothing in Framer Motion does that cleanly.
 * GSAP is imported inside the effect, so it is fetched only when this section
 * actually mounts and never lands in the shared bundle.
 *
 * ## What renders without it
 *
 * The markup below is a readable vertical timeline on its own: every date,
 * title, description and photograph is in the DOM, and the horizontal layout
 * is applied by a class the effect adds. If the script never runs, if the
 * reader prefers reduced motion, or if the screen is small, they get that
 * vertical timeline — which is the right shape for those cases anyway, not a
 * degraded one.
 */

/** Horizontal room each milestone gets while travelling. */
const SLOT = 620
const LEAD_IN = 340
const LEAD_OUT = 560

/**
 * Vertical wander of the path, as a fraction of the track height. Biased just
 * below centre: the milestones sitting *above* the line carry photography and
 * so need more room than the ones below it.
 */
const RISE = [0.52, 0.46, 0.57, 0.47, 0.56, 0.48, 0.53]

function buildPath(count: number, width: number, height: number) {
  const xs = Array.from({ length: count }, (_, i) => LEAD_IN + i * SLOT)
  const ys = xs.map((_, i) => height * (RISE[i % RISE.length] ?? 0.5))

  // Start off-canvas on the left, curve in, thread the nodes, then lift away.
  let d = `M -120 ${height * 0.62} C ${LEAD_IN * 0.35} ${height * 0.6}, ${LEAD_IN * 0.6} ${ys[0]}, ${xs[0]} ${ys[0]}`
  for (let i = 1; i < count; i += 1) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  const lastX = xs[count - 1]
  const lastY = ys[count - 1]
  d += ` C ${lastX + LEAD_OUT * 0.4} ${lastY}, ${width - 120} ${height * 0.3}, ${width + 160} ${height * 0.18}`
  return { d, xs, ys }
}

export function MissionJourney() {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const signal = useRef<SVGPathElement>(null)

  const count = phases.length
  const trackWidth = LEAD_IN + (count - 1) * SLOT + LEAD_OUT
  const trackHeight = 620
  const { d, xs, ys } = buildPath(count, trackWidth, trackHeight)

  useEffect(() => {
    const viewportEl = viewport.current
    const trackEl = track.current
    const rootEl = root.current
    if (!viewportEl || !trackEl || !rootEl) return

    const small = window.matchMedia('(max-width: 1023px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (small.matches || still.matches) return

    let dispose = () => {}
    let cancelled = false

    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        rootEl.dataset.journey = 'horizontal'

        const travel = () => trackEl.scrollWidth - window.innerWidth

        /**
         * How much vertical scroll the horizontal move costs.
         *
         * At 1 the track moves a pixel sideways for every pixel scrolled,
         * which is far too quick to read: the milestones fly past. Stretching
         * the distance slows the whole sequence down without changing what it
         * does. The signal trigger below must use the same figure or the line
         * drifts out of step with the track.
         *
         * Measured rather than guessed: at 1.6 one notch of a wheel moved the
         * track 62px against a 620px milestone slot, so ten notches crossed a
         * milestone. At 2.1 it takes thirteen.
         */
        const PACE = 2.1
        const distance = () => travel() * PACE

        // The horizontal move. Linear, because every milestone trigger below
        // is expressed against it and `containerAnimation` requires it.
        const horizontal = gsap.to(trackEl, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: viewportEl,
            pin: true,
            scrub: 0.5,
            start: 'center center',
            end: () => '+=' + distance(),
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        // The signal running along the path, drawn by scroll.
        const path = signal.current
        if (path) {
          const len = path.getTotalLength()
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: viewportEl,
              scrub: 0.5,
              start: 'center center',
              end: () => '+=' + distance(),
              invalidateOnRefresh: true,
            },
          })
        }

        // Each milestone reacts to reaching the middle of the viewport.
        const items = gsap.utils.toArray<HTMLElement>('[data-milestone]', trackEl)
        items.forEach((item) => {
          const node = item.querySelector('[data-node]')
          const pulse = item.querySelector('[data-pulse]')
          const content = item.querySelector('[data-content]')
          const media = item.querySelector('[data-media] img')
          const frame = item.querySelector('[data-media]')

          gsap.set(content, { opacity: 0.32, y: 18 })
          gsap.set(node, { scale: 0.55 })
          // The frame fades; only the picture inside drifts. Scaling the frame
          // would crop the photograph, which is the whole thing to avoid.
          if (frame) gsap.set(frame, { opacity: 0.32, y: 18 })
          if (media) gsap.set(media, { scale: 1.06 })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              containerAnimation: horizontal,
              start: 'left 82%',
              end: 'right 18%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          tl.to(node, { scale: 1, duration: 0.35, ease: 'power2.out' }, 0)
            .to(content, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.08)
          if (frame) tl.to(frame, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.08)
          // Settles to exactly 1 — the final state is the uncropped picture.
          if (media) tl.to(media, { scale: 1, duration: 0.9, ease: 'none' }, 0)
          // Past centre it steps back, but stays legible.
          tl.to(content, { opacity: 0.6, duration: 0.35, ease: 'none' }, 0.8)
            .to(node, { scale: 0.8, duration: 0.35, ease: 'none' }, 0.8)
          if (frame) tl.to(frame, { opacity: 0.6, duration: 0.35, ease: 'none' }, 0.8)

          // A single pulse as the signal arrives, not a loop.
          ScrollTrigger.create({
            trigger: item,
            containerAnimation: horizontal,
            start: 'left 55%',
            onEnter: () =>
              gsap.fromTo(
                pulse,
                { scale: 0.6, opacity: 0.7 },
                { scale: 2.4, opacity: 0, duration: 0.9, ease: 'power2.out' },
              ),
          })
        })

        // Late-loading photography changes the measurements.
        const imgs = Array.from(trackEl.querySelectorAll('img'))
        let pending = imgs.filter((i) => !i.complete).length
        if (pending) {
          imgs.forEach((i) => {
            if (i.complete) return
            const done = () => {
              pending -= 1
              if (pending <= 0) ScrollTrigger.refresh()
            }
            i.addEventListener('load', done, { once: true })
            i.addEventListener('error', done, { once: true })
          })
        }
      }, rootEl)

      dispose = () => {
        ctx.revert()
        delete rootEl.dataset.journey
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return (
    <Section tone="void" spacing="none" id="journey" clip={false} className="py-0">
      <Container wide className="pb-14 pt-24 md:pb-20 md:pt-32">
        <div className="max-w-2xl">
          <SectionIndex index="03" label="Journey" />
          <h2 className="mt-9 text-display-md">From an idea to orbit.</h2>
        </div>
      </Container>

      {/*
        `data-journey="horizontal"` is set by the effect once GSAP has taken
        over. Until then — and on small screens, and under reduced motion —
        the CSS below keeps this a readable vertical timeline.
      */}
      <div ref={root} className="journey">
        <div ref={viewport} className="journey-viewport">
          <div
            ref={track}
            className="journey-track"
            style={
              {
                '--track-w': `${trackWidth}px`,
                '--track-h': `${trackHeight}px`,
              } as React.CSSProperties
            }
          >
            {/* The path. Inactive beneath, signal drawn on top. */}
            <svg
              className="journey-path"
              width={trackWidth}
              height={trackHeight}
              viewBox={`0 0 ${trackWidth} ${trackHeight}`}
              fill="none"
              aria-hidden="true"
            >
              <path
                d={d}
                stroke="rgb(var(--glow) / 0.16)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                ref={signal}
                d={d}
                stroke="rgb(var(--brand))"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 10px rgb(var(--glow) / 0.55))' }}
              />
            </svg>

            <ol className="journey-list">
              {phases.map((phase, i) => {
                /*
                 * A milestone with a photograph puts the picture on one side
                 * of the path and its words on the other — the composition
                 * the brief sketches, and the reason the photograph can be
                 * large: each side only has to carry one thing.
                 *
                 * Milestones without a photograph keep a single block and
                 * alternate sides, which stops the run of them reading as a
                 * column of identical cards.
                 */
                const hasMedia = Boolean(phase.image)
                const textAbove = !hasMedia && i % 2 === 1
                return (
                  <li
                    key={phase.id}
                    data-milestone
                    className="journey-item"
                    // Coordinates travel as custom properties so the vertical
                    // layout can ignore them. Inline `left`/`top` would beat
                    // the stylesheet and drag the page sideways.
                    style={
                      {
                        '--x': `${xs[i]}px`,
                        '--y': `${ys[i]}px`,
                      } as React.CSSProperties
                    }
                  >
                    {hasMedia ? (
                      <div className="journey-slot journey-slot--media">
                        <div
                          data-media
                          className="relative w-full overflow-hidden rounded-card bg-surface-raised"
                          // Matched to the photograph's own ratio, so `cover`
                          // has nothing to crop and no face is cut off.
                          style={{ aspectRatio: String(phase.imageRatio ?? 1.5) }}
                        >
                          <Image
                            src={phase.image as string}
                            alt={phase.imageAlt ?? ''}
                            fill
                            loading="lazy"
                            sizes="(min-width: 1024px) 18rem, 20rem"
                            className="object-cover will-change-transform"
                            style={
                              phase.imagePosition
                                ? { objectPosition: phase.imagePosition }
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    <div
                      className={clsx(
                        'journey-slot',
                        hasMedia
                          ? 'journey-slot--text'
                          : textAbove
                            ? 'journey-slot--above'
                            : 'journey-slot--below',
                      )}
                    >
                      <div data-content className="journey-content">
                        <p className="eyebrow tabular inline-flex rounded-control border border-accent/30 px-3.5 py-2 text-accent">
                          {phase.period}
                        </p>
                        <h3 className="mt-4 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-tightest text-chalk">
                          {phase.name}
                        </h3>
                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-chalk-muted">
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    {/* The node on the path. */}
                    <span className="journey-node" aria-hidden="true">
                      <span data-pulse className="journey-pulse" />
                      <span
                        data-node
                        className={clsx(
                          'journey-dot',
                          phase.status === 'planned' && 'journey-dot--planned',
                        )}
                      />
                    </span>
                  </li>
                )
              })}
            </ol>

            {/* The path carries on past the last confirmed milestone. */}
            <p className="journey-tail">
              <span className="text-chalk">The mission</span>
              <br />
              <span className="inline-flex items-center gap-2 text-accent">
                continues
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
