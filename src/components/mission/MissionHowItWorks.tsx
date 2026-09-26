'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { signalPath } from '@/data/mission'
import { clsx } from '@/lib/utils'

/**
 * How the mission works, as one interface that opens, closes and transforms.
 *
 * Two rails sit either side of a central panel. Scrolling closes the panel
 * behind them, the content is swapped while it is hidden, and it opens again
 * on the next step — vessel, then orbit, then ground. The swap happening
 * behind a closed shutter is the whole point: nothing ever crossfades, so it
 * reads as one object changing rather than three slides passing.
 *
 * The scroll handler writes a single number to a CSS custom property and
 * toggles two attributes. Everything else — the clip path, the rail offsets,
 * the image scale, the radius — is derived from that number in CSS, so no
 * frame reads or writes layout. See `.hiw` in `globals.css`.
 *
 * React state is deliberately not involved: re-rendering three panels sixty
 * times a second to move a shutter would be absurd.
 *
 * Without JavaScript, on a small screen, or under `prefers-reduced-motion`,
 * `data-mode` is never set and the CSS leaves the three steps stacked down
 * the page, each fully readable. The story does not depend on the animation.
 */

/**
 * The shape of the scroll.
 *
 * Holds are where the reader reads; shutters are the transitions. Deliberately
 * short — the mission timeline further down the page is the long scroll
 * narrative, and two of those in a row would be exhausting.
 */
const SEGMENTS: ({ len: number } & (
  | { kind: 'hold'; index: number }
  | { kind: 'shut'; from: number; to: number }
))[] = [
  { kind: 'hold', index: 0, len: 0.9 },
  { kind: 'shut', from: 0, to: 1, len: 1 },
  { kind: 'hold', index: 1, len: 1.1 },
  { kind: 'shut', from: 1, to: 2, len: 1 },
  { kind: 'hold', index: 2, len: 1 },
]

const TOTAL = SEGMENTS.reduce((n, s) => n + s.len, 0)

/**
 * Scroll distance the pinned sequence consumes, in viewport heights.
 *
 * Raise this to make the shutter less sensitive, not lower. At 2.4 a short
 * flick of the wheel crossed a whole transition; the reader should feel they
 * are driving the mechanism rather than triggering it.
 */
const SCROLL_HEIGHTS = 3.6

const TONE_CLASS = ['tone-ice', 'tone-void', 'tone-cloud'] as const

export function MissionHowItWorks() {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const viewportEl = viewport.current
    const frameEl = frame.current
    if (!rootEl || !viewportEl || !frameEl) return

    // The shutter needs room either side to read as one; below `lg` there is
    // none, and fighting a pinned section on a phone is worse than reading
    // three panels.
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

      const panels = Array.from(
        frameEl.querySelectorAll<HTMLElement>('[data-panel]'),
      )
      const labels = Array.from(
        frameEl.querySelectorAll<HTMLElement>('[data-label]'),
      )
      const dots = Array.from(
        viewportEl.querySelectorAll<HTMLElement>('[data-dot]'),
      )

      let shown = -1

      /** Only touched when the step actually changes, not every frame. */
      const show = (index: number) => {
        if (index === shown) return
        shown = index
        panels.forEach((el) => {
          el.dataset.on = String(Number(el.dataset.panel) === index)
        })
        labels.forEach((el) => {
          el.dataset.on = String(Number(el.dataset.label) === index)
        })
        dots.forEach((el, i) => {
          el.dataset.on = String(i <= index)
        })
        frameEl.classList.remove(...TONE_CLASS)
        frameEl.classList.add(TONE_CLASS[index])
      }

      const setShut = gsap.quickSetter(rootEl, '--shut') as (v: string) => void
      const setSignal = gsap.quickSetter(viewportEl, '--signal') as (
        v: string,
      ) => void

      const render = (p: number) => {
        setSignal(String(p))

        let at = p * TOTAL
        for (const seg of SEGMENTS) {
          if (at > seg.len) {
            at -= seg.len
            continue
          }
          const t = seg.len === 0 ? 0 : at / seg.len
          if (seg.kind === 'hold') {
            setShut('0')
            show(seg.index)
          } else {
            // Closed at the midpoint, open at both ends. `sin` gives an ease
            // in and out for free, so the shutter never snaps.
            setShut(String(Math.sin(t * Math.PI)))
            show(t < 0.5 ? seg.from : seg.to)
          }
          return
        }
        // Past the end (scrub overshoot).
        setShut('0')
        show(SEGMENTS.length ? signalPath.length - 1 : 0)
      }

      const ctx = gsap.context(() => {
        rootEl.dataset.mode = 'pinned'
        show(0)

        const driver = { p: 0 }
        gsap.to(driver, {
          p: 1,
          ease: 'none',
          onUpdate: () => render(driver.p),
          scrollTrigger: {
            trigger: viewportEl,
            pin: true,
            // Enough smoothing that the shutter feels weighty, not enough to
            // lag behind the reader's hand.
            scrub: 0.6,
            start: 'center center',
            end: () => '+=' + window.innerHeight * SCROLL_HEIGHTS,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      }, rootEl)

      dispose = () => {
        ctx.revert()
        delete rootEl.dataset.mode
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return (
    <Section tone="cloud" join="soft" spacing="none" clip={false} className="py-20 md:py-24">
      <Container wide>
        <div className="max-w-2xl">
          <SectionIndex index="04" label="How it works" />
          <h2 className="mt-8 text-display-md">
            From signal
            <br />
            to insight.
          </h2>
        </div>
      </Container>

      <Container wide className="mt-10 md:mt-12">
        <div ref={root} className="hiw">
          <div ref={viewport} className="hiw-viewport">
            <div ref={frame} className={clsx('hiw-frame', TONE_CLASS[0])}>
              <Rail side="left" />

              <div className="hiw-stage">
                {signalPath.map((stage, i) => (
                  <article
                    key={stage.id}
                    data-panel={i}
                    data-on={i === 0 ? 'true' : 'false'}
                    className={clsx(
                      'hiw-panel hiw-step isolate',
                      TONE_CLASS[i],
                      // Stacked (unpinned) panels need a height of their own;
                      // pinned ones fill the stage.
                      'min-h-[22rem] overflow-hidden rounded-[2rem] md:min-h-[26rem] md:rounded-[3rem]',
                    )}
                  >
                    <div className="hiw-media">
                      <Image
                        src={stage.image}
                        alt={stage.imageAlt}
                        fill
                        loading={i === 0 ? undefined : 'lazy'}
                        sizes="(min-width: 1024px) 80vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: stage.imagePosition }}
                      />
                    </div>

                    {/* Localised, and it stops. Opaque only where the words
                        are, gone by two thirds of the way across — the
                        photograph keeps the brightness it was shot at
                        everywhere that matters. Tailwind's three-stop
                        gradient cannot place its stops, hence the literal. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--surface))_0%,rgb(var(--surface)/0.92)_26%,rgb(var(--surface)/0.45)_46%,transparent_66%)]"
                    />

                    <div className="relative flex h-full max-w-xl flex-col justify-end gap-4 p-7 md:p-12">
                      <p className="eyebrow text-accent">
                        {String(i + 1).padStart(2, '0')} / {stage.label}
                      </p>
                      <h3 className="text-display-sm">
                        {stage.title[0]}
                        <br />
                        {stage.title[1]}
                      </h3>
                      <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted md:text-base">
                        {stage.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <Rail side="right" />
            </div>

            {/* The signal, which is also the progress indicator: one blue line
                travelling from the vessel to the ground across the whole
                sequence. Two jobs, one element, no extra furniture. */}
            <div
              aria-hidden="true"
              className="mt-5 flex items-center gap-3 md:mt-6"
            >
              <span className="eyebrow tabular text-fg-faint">01</span>
              <span className="hiw-track">
                {signalPath.map((stage, i) => (
                  <span
                    key={stage.id}
                    data-dot
                    data-on={i === 0 ? 'true' : 'false'}
                    className="hiw-dot"
                    style={{
                      left: `${(i / (signalPath.length - 1)) * 100}%`,
                    }}
                  />
                ))}
              </span>
              <span className="eyebrow tabular text-fg-faint">
                {String(signalPath.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/**
 * A rail. All three labels live in the DOM at once and visibility is an
 * attribute, so changing step costs one write rather than a render.
 */
function Rail({ side }: { side: 'left' | 'right' }) {
  return (
    <aside
      aria-hidden="true"
      className={clsx('hiw-rail', side === 'left' ? 'hiw-rail--left' : 'hiw-rail--right')}
    >
      <span className="eyebrow tabular text-accent">
        {signalPath.map((stage, i) => (
          <span
            key={stage.id}
            data-label={i}
            data-on={i === 0 ? 'true' : 'false'}
            className="hiw-rail-index"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </span>

      <span className="text-fg-muted">
        {signalPath.map((stage, i) => (
          <span
            key={stage.id}
            data-label={i}
            data-on={i === 0 ? 'true' : 'false'}
            className="hiw-rail-label font-mono"
          >
            {stage.label}
          </span>
        ))}
      </span>

      <span className="eyebrow tabular text-fg-faint">
        {String(signalPath.length).padStart(2, '0')}
      </span>
    </aside>
  )
}
