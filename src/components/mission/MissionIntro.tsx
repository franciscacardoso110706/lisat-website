'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Container } from '@/components/ui/Section'
import { challenge, mission, signalPath } from '@/data/mission'
import { LisatSymbol } from '@/components/mission/LisatSymbol'
import { clsx } from '@/lib/utils'

/**
 * The mission, as one pinned sequence.
 *
 * This is the page's opening: clicking "Mission" puts the reader inside the
 * story immediately, with no hero in front of it. It runs
 *
 *   the problem, in three statements
 *     → introducing
 *     → LISAT-01, with its orbit drawn
 *     → vessel → orbit → ground
 *
 * as a single choreography. One ScrollTrigger, one pinned viewport, one
 * function mapping scroll progress onto every moving part. There are no
 * per-section triggers and no wheel listeners — the whole thing is a pure
 * function of normalised scroll.
 *
 * ---------------------------------------------------------------------------
 * PACING
 * ---------------------------------------------------------------------------
 *
 * The sequence deliberately costs about eleven screens of scroll. That is not
 * padding: at this length one notch of a mouse wheel moves the story about one
 * per cent, so crossing between two stages takes five or six deliberate
 * gestures rather than a flick. An earlier version mapped roughly a notch to a
 * whole stage and was impossible to read.
 *
 * Every segment below is either a move or a hold. Holds are not dead scroll —
 * the screen carries a finished composition and simply stays still long enough
 * to be read.
 */

/** The problem, in the words already published in `challenge.points`. */
const PHRASES = challenge.points.slice(0, 3)

/**
 * The sequence, in viewport heights.
 *
 * Lengths, not positions, so inserting a beat does not mean recomputing every
 * number after it.
 */
const SEQUENCE: { key: string; len: number }[] = [
  { key: 'p0in', len: 0.5 },
  { key: 'p0hold', len: 0.55 },
  { key: 'p0out', len: 0.4 },
  { key: 'p1in', len: 0.5 },
  { key: 'p1hold', len: 0.55 },
  { key: 'p1out', len: 0.4 },
  { key: 'p2in', len: 0.5 },
  { key: 'p2hold', len: 0.55 },
  { key: 'p2out', len: 0.4 },
  // The turning point between the problem and the answer. It gets the longest
  // hold of any beat, because it is the one sentence the page is built around.
  { key: 'changein', len: 0.6 },
  { key: 'changehold', len: 0.75 },
  { key: 'changeout', len: 0.45 },
  { key: 'intro', len: 0.5 },
  // The mark draws, the satellite lands on it, then the name arrives.
  { key: 'symbol', len: 0.95 },
  { key: 'sat', len: 0.35 },
  // The wordmark, letter by letter across the circle.
  { key: 'word', len: 0.6 },
  { key: 'name', len: 0.45 },
  { key: 'namehold', len: 0.5 },
  { key: 'tostage', len: 0.55 },
  { key: 'vessel', len: 0.9 },
  { key: 'shut1', len: 0.6 },
  { key: 'orbit', len: 0.9 },
  { key: 'shut2', len: 0.6 },
  { key: 'ground', len: 0.9 },
  { key: 'exit', len: 0.5 },
]

const TOTAL_VH = SEQUENCE.reduce((n, s) => n + s.len, 0)

/** Start and end of every segment, as a fraction of the whole. */
const AT: Record<string, [number, number]> = (() => {
  const out: Record<string, [number, number]> = {}
  let at = 0
  for (const s of SEQUENCE) {
    out[s.key] = [at / TOTAL_VH, (at + s.len) / TOTAL_VH]
    at += s.len
  }
  return out
})()

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Linear 0→1 across a segment. */
const span = (p: number, key: string) => {
  const [a, b] = AT[key]
  return clamp01((p - a) / (b - a))
}

/** Eased 0→1: quick to arrive, slow to settle. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** Rises across `inKey`, holds, falls across `outKey`. */
function beat(p: number, inKey: string, outKey: string) {
  return ease(span(p, inKey)) * (1 - span(p, outKey))
}

const TONES = ['tone-ice', 'tone-void', 'tone-cloud'] as const

export function MissionIntro() {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const viewportEl = viewport.current
    const stageEl = stage.current
    if (!rootEl || !viewportEl || !stageEl) return

    // A pinned eleven-screen sequence is the wrong thing to put a phone
    // through, and reduced motion asks for none of it. Both get the same
    // readable stack the markup already is.
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
        stageEl.querySelectorAll<HTMLElement>('[data-panel]'),
      )
      const labels = Array.from(
        stageEl.querySelectorAll<HTMLElement>('[data-label]'),
      )

      let shown = -1
      const show = (i: number) => {
        if (i === shown) return
        shown = i
        panels.forEach((el) => {
          el.dataset.on = String(Number(el.dataset.panel) === i)
        })
        labels.forEach((el) => {
          el.dataset.on = String(Number(el.dataset.label) === i)
        })
        stageEl.classList.remove(...TONES)
        stageEl.classList.add(TONES[i])
      }

      const ctx = gsap.context(() => {
        rootEl.dataset.mode = 'pinned'
        show(0)

        const vars = [
          'p0',
          'p1',
          'p2',
          'change',
          'intro',
          'symbol',
          'sat',
          'word',
          'name',
          'stage',
          'shut',
        ] as const
        const set = Object.fromEntries(
          vars.map((v) => [v, gsap.quickSetter(rootEl, `--${v}`)]),
        ) as Record<(typeof vars)[number], (v: string) => void>

        const render = (p: number) => {
          set.p0(String(beat(p, 'p0in', 'p0out')))
          set.p1(String(beat(p, 'p1in', 'p1out')))
          set.p2(String(beat(p, 'p2in', 'p2out')))
          set.change(String(beat(p, 'changein', 'changeout')))

          // "Introducing" arrives small right after the huge statement has
          // gone — the drop in scale is the point — and steps back as the mark
          // starts drawing.
          set.intro(
            String(
              clamp01(ease(span(p, 'intro')) * (1 - span(p, 'word') * 1.3)),
            ),
          )

          // The orbit draws, the satellite lands on it, the name arrives. Each
          // overlaps the next rather than waiting for it.
          set.symbol(String(ease(span(p, 'symbol'))))
          set.sat(String(ease(span(p, 'sat'))))
          set.word(String(span(p, 'word')))
          set.name(
            String(ease(span(p, 'name')) * (1 - span(p, 'tostage'))),
          )

          set.stage(String(ease(span(p, 'tostage')) * (1 - span(p, 'exit'))))

          // The shutter. Closed at the midpoint of each transition, open
          // everywhere else, and the content swaps while it is shut.
          const s1 = span(p, 'shut1')
          const s2 = span(p, 'shut2')
          const closing = s1 > 0 && s1 < 1 ? s1 : s2 > 0 && s2 < 1 ? s2 : 0
          set.shut(String(closing ? Math.sin(closing * Math.PI) : 0))

          show(s2 >= 0.5 ? 2 : s1 >= 0.5 ? 1 : 0)
        }

        const driver = { p: 0 }
        gsap.to(driver, {
          p: 1,
          ease: 'none',
          onUpdate: () => render(driver.p),
          scrollTrigger: {
            trigger: viewportEl,
            pin: true,
            // Enough inertia to feel weighted, not enough to feel detached
            // from the hand doing the scrolling.
            scrub: 1.4,
            start: 'top top',
            end: () => '+=' + window.innerHeight * TOTAL_VH,
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
    <div ref={root} className="mi tone-void relative">
      <div ref={viewport} className="mi-viewport relative overflow-hidden">
        {/* ── The problem ───────────────────────────────────────── */}
        <div className="mi-layer mi-phrases">
          <Container wide>
            {PHRASES.map((text, i) => (
              <p
                key={text}
                data-phrase={i}
                className="mi-phrase max-w-4xl text-[clamp(1.75rem,4.4vw,3.75rem)] font-semibold leading-[1.04] tracking-tightest"
              >
                {text}
              </p>
            ))}
          </Container>
        </div>

        {/* ── The turning point ────────────────────────────────── */}
        <div className="mi-layer mi-change">
          <Container wide>
            <p className="mi-change-text font-poster text-[clamp(3rem,13vw,11rem)] font-normal uppercase leading-[0.84] tracking-[0.005em]">
              It&rsquo;s time
              <br />
              <span className="text-brand">to change.</span>
            </p>
          </Container>
        </div>

        {/* ── The answer ────────────────────────────────────────── */}
        <div className="mi-layer mi-reveal">
          <div className="relative flex flex-col items-center">
            <p className="mi-introducing eyebrow text-accent">Introducing</p>

            {/*
              The logo itself, formed. Not the name set large with a circle
              behind it — the real mark, with "LI" outside the orbit and "SAT"
              inside it, which is the whole idea of the thing.
            */}
            <LisatSymbol className="mi-symbol mt-8 h-auto w-[min(80vw,40rem)]" />

            {/* The mission's name, small, under the mark it belongs to. */}
            <p className="mi-name eyebrow mt-8 text-fg-muted">
              {mission.name}
              <span aria-hidden="true" className="mx-2 opacity-40">
                ·
              </span>
              {mission.subtitle}
            </p>
          </div>
        </div>

        {/* ── How it works ──────────────────────────────────────── */}
        <div className="mi-layer mi-stage-layer">
          <Container wide className="h-full">
            <div
              ref={stage}
              className={clsx('hiw-frame h-full', TONES[0])}
              data-stage-frame
            >
              <Rail side="left" />

              <div className="hiw-stage">
                {signalPath.map((s, i) => (
                  <article
                    key={s.id}
                    data-panel={i}
                    data-on={i === 0 ? 'true' : 'false'}
                    className={clsx(
                      'hiw-panel isolate overflow-hidden rounded-[2rem] md:rounded-[3rem]',
                      TONES[i],
                    )}
                  >
                    <div className="hiw-media">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        loading={i === 0 ? undefined : 'lazy'}
                        sizes="(min-width: 1024px) 80vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: s.imagePosition }}
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--surface))_0%,rgb(var(--surface)/0.92)_26%,rgb(var(--surface)/0.45)_46%,transparent_66%)]"
                    />
                    <div className="relative flex h-full max-w-xl flex-col justify-end gap-4 p-7 md:p-12">
                      <p className="eyebrow text-accent">
                        {String(i + 1).padStart(2, '0')} / {s.label}
                      </p>
                      <h3 className="text-display-sm">
                        {s.title[0]}
                        <br />
                        {s.title[1]}
                      </h3>
                      <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted md:text-base">
                        {s.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <Rail side="right" />
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}

function Rail({ side }: { side: 'left' | 'right' }) {
  return (
    <aside
      aria-hidden="true"
      className={clsx(
        'hiw-rail',
        side === 'left' ? 'hiw-rail--left' : 'hiw-rail--right',
      )}
    >
      <span className="eyebrow tabular text-accent">
        {signalPath.map((s, i) => (
          <span
            key={s.id}
            data-label={i}
            data-on={i === 0 ? 'true' : 'false'}
            className="hiw-rail-index"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </span>

      <span className="text-fg-muted">
        {signalPath.map((s, i) => (
          <span
            key={s.id}
            data-label={i}
            data-on={i === 0 ? 'true' : 'false'}
            className="hiw-rail-label font-mono"
          >
            {s.label}
          </span>
        ))}
      </span>

      <span className="eyebrow tabular text-fg-faint">
        {String(signalPath.length).padStart(2, '0')}
      </span>
    </aside>
  )
}
