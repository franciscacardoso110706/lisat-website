'use client'

import { useEffect, useRef } from 'react'
import { Container } from '@/components/ui/Section'
import { challenge, mission } from '@/data/mission'

/**
 * The statement the whole mission answers, and the way out of the dark.
 *
 * Three lines arrive one after another as the reader scrolls, and before the
 * last one has finished the light is already rising behind it — the overlap
 * is the point. The old version of this on the Wix site said its piece and
 * then left the reader scrolling through half a screen of empty navy; here
 * every part of the scroll does something.
 *
 * The rising surface is the OPEN language used elsewhere on the site: a large
 * curved shape growing into the space rather than a hard cut between a dark
 * section and a light one.
 *
 * The scroll handler writes four numbers to CSS custom properties and nothing
 * else. No layout is read or written per frame, and React is not involved.
 *
 * Unpinned by default. `data-mode="pinned"` is added only once GSAP has
 * loaded and decided the screen is big enough and motion is wanted, so no
 * JavaScript, a phone or reduced motion all leave the statement readable.
 */

/** The statement, split where it should break. */
const LINES = ['Vast stretches', 'of ocean', 'go unwatched.']

/**
 * Where each line starts and finishes, as a fraction of the pinned scroll.
 *
 * They overlap deliberately: the second line begins before the first has
 * settled, and the light starts rising while the third is still arriving.
 * Sequential ranges would read as three separate animations.
 */
const LINE_RANGE: [number, number][] = [
  [0.02, 0.2],
  [0.14, 0.34],
  [0.28, 0.48],
]

/**
 * The light surface. Starts well before the third line has settled — that
 * overlap is what makes the two moments read as one.
 */
const OPEN_RANGE: [number, number] = [0.34, 0.94]

/**
 * Scroll distance the pinned opening consumes, in viewport heights.
 *
 * Short on purpose. Every part of it does something — the old version of this
 * left the reader scrolling through half a screen of empty navy — and the
 * horizontal timeline further down is the page's long sequence.
 */
const SCROLL_HEIGHTS = 1.2

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Eased 0→1 across a range. */
function ramp(p: number, [from, to]: [number, number]) {
  const t = clamp01((p - from) / (to - from))
  // A cubic ease-out: fast to arrive, slow to settle.
  return 1 - Math.pow(1 - t, 3)
}

export function MissionOpening() {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const viewportEl = viewport.current
    if (!rootEl || !viewportEl) return

    const small = window.matchMedia('(max-width: 767px)')
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
        rootEl.dataset.mode = 'pinned'

        const set = {
          l0: gsap.quickSetter(rootEl, '--l0') as (v: string) => void,
          l1: gsap.quickSetter(rootEl, '--l1') as (v: string) => void,
          l2: gsap.quickSetter(rootEl, '--l2') as (v: string) => void,
          open: gsap.quickSetter(rootEl, '--open') as (v: string) => void,
        }

        const render = (p: number) => {
          set.l0(String(ramp(p, LINE_RANGE[0])))
          set.l1(String(ramp(p, LINE_RANGE[1])))
          set.l2(String(ramp(p, LINE_RANGE[2])))
          set.open(String(ramp(p, OPEN_RANGE)))
        }

        const driver = { p: 0 }
        gsap.to(driver, {
          p: 1,
          ease: 'none',
          onUpdate: () => render(driver.p),
          scrollTrigger: {
            trigger: viewportEl,
            pin: true,
            scrub: 0.5,
            start: 'top top',
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
    <div ref={root} className="opening tone-void relative">
      <div ref={viewport} className="opening-viewport relative overflow-hidden">
        <Container wide className="relative z-10 flex h-full items-center">
          <div className="max-w-4xl py-20 md:py-28">
            <h2 className="text-[clamp(2.25rem,6.4vw,5.5rem)] font-semibold leading-[0.95] tracking-tightest">
              {LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <span className="opening-line block" data-line={i}>
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            {/*
              One line of context, condensed from `challenge.points`. The
              statement above carries the argument; this says what it costs.
            */}
            <p className="opening-note mt-8 max-w-lg text-lead text-fg-muted md:mt-10">
              {challenge.points[3]}
            </p>
          </div>
        </Container>

        {/*
          The light arriving — and arriving with something in it.
          
          A curved surface rising through the navy rather than one section
          ending and another starting. It carries the answer to the statement
          it is covering: an empty white field would be the same dead scroll
          in a different colour.
        */}
        <div className="opening-surface tone-paper">
          <Container wide className="flex h-full items-center">
            <div className="opening-answer max-w-3xl">
              <p className="eyebrow text-accent">
                {mission.name}
                <span aria-hidden="true" className="mx-2 opacity-40">
                  ·
                </span>
                {mission.subtitle}
              </p>
              <p className="mt-6 text-display-md md:mt-8">
                {mission.headline}.
              </p>
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}
