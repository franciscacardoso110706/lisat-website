'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { challenge, impact, mission, pillars } from '@/data/mission'

/**
 * The mission, opened by asking.
 *
 * Closed, this is a statement and an offer: the headline, one line under it
 * and a button. Clicking does not navigate, does not raise a modal and does
 * not cut — the section itself opens, and the three chapters of the mission
 * arrive inside it.
 *
 * ── Why a click ───────────────────────────────────────────────────────────
 *
 * This used to be three more pinned screens on the end of the opening
 * sequence. By the time a reader reached them they had already spent six
 * screens of scroll being told the problem, and the mechanics arrived whether
 * they wanted them or not. A reader who has just watched that much should be
 * asked. So nothing here is driven by scroll: no ScrollTrigger, no wheel
 * listener, no pin. Scrolling past without opening is a legitimate reading of
 * the page.
 *
 * ── Why there is no shared-element transition ─────────────────────────────
 *
 * There was one, when the closed state showed the three images compressed
 * into a strip: GSAP Flip grew those same nodes into these panels, and the
 * point of it was that the small thing and the large thing were the same
 * thing. With the strip gone there is nothing visible to grow from, so the
 * chapters simply arrive — staggered, from below — while the statement
 * recedes and the section opens around them.
 */

/**
 * The three chapters.
 *
 * Every line is existing published copy: the challenge is condensed from
 * `challenge.points`, the mission from `mission.summary`, the impact is
 * `impact.body` verbatim. The images are the ones already used for these same
 * three ideas in `pillars`, so the ocean, the spacecraft and the ground
 * picture keep meaning what they already mean elsewhere on the site.
 */
const STORIES = [
  {
    id: 'challenge',
    index: '01',
    title: ['The', 'challenge'],
    body: challenge.points[1],
    image: pillars[0].image,
    imageAlt: pillars[0].imageAlt,
  },
  {
    id: 'mission',
    index: '02',
    title: ['Our', 'mission'],
    body: 'LISAT-01 is a student-built 1U CubeSat that receives AIS signals from orbit, holds them on board and forwards them to ground stations in Portugal.',
    image: pillars[1].image,
    imageAlt: pillars[1].imageAlt,
  },
  {
    id: 'impact',
    index: '03',
    title: ['The', 'impact'],
    body: impact.body,
    image: pillars[2].image,
    imageAlt: pillars[2].imageAlt,
  },
]

/** Long enough to read as one movement, short enough not to be waited on. */
const DURATION = 0.9

export function MissionOverview() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const busy = useRef(false)

  /*
   * `data-ready` is what says JavaScript is running. Until it is there the CSS
   * shows the opened layout with no button and no close — because a closed
   * state that cannot be opened is just three hidden chapters.
   */
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.dataset.ready = 'true'
    el.dataset.open = 'false'
    return () => {
      delete el.dataset.ready
      delete el.dataset.open
    }
  }, [])

  const toggle = useCallback(async () => {
    const rootEl = root.current
    const stageEl = stage.current
    if (!rootEl || !stageEl || busy.current) return

    const next = !open
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (still) {
      rootEl.dataset.open = String(next)
      setOpen(next)
      return
    }

    busy.current = true
    const { gsap } = await import('gsap')

    const items = rootEl.querySelectorAll<HTMLElement>('.mv-item')
    const head = rootEl.querySelector<HTMLElement>('.mv-head')
    const title = rootEl.querySelector<HTMLElement>('.mv-title')

    /** The head, the statement and the section's own height, in both directions. */
    const reshape = () => {
      const heightBefore = stageEl.offsetHeight
      const headBefore = head?.getBoundingClientRect().top ?? 0

      rootEl.dataset.open = String(next)
      setOpen(next)

      const heightAfter = stageEl.offsetHeight
      const headAfter = head?.getBoundingClientRect().top ?? 0

      /*
       * The head does its own flip by hand. Losing the lead and the button
       * shortens it by well over a hundred pixels, and without this it makes
       * that whole journey in a single frame.
       */
      if (head && headBefore !== headAfter) {
        gsap.fromTo(
          head,
          { y: headBefore - headAfter },
          {
            y: 0,
            duration: DURATION,
            ease: 'power3.inOut',
            clearProps: 'transform',
          },
        )
      }

      /*
       * The statement recedes rather than shrinks: a `font-size` change would
       * reflow the head mid-movement, and scale costs nothing.
       */
      if (title) {
        gsap.to(title, {
          scale: next ? 0.8 : 1,
          duration: DURATION,
          ease: 'power3.inOut',
        })
      }

      // Everything below the section has to travel too, or it jumps the whole
      // difference in one frame.
      gsap.fromTo(
        stageEl,
        { height: heightBefore },
        {
          height: heightAfter,
          duration: DURATION,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(stageEl, { clearProps: 'height' })
            busy.current = false
          },
        },
      )
    }

    if (next) {
      reshape()
      /*
       * Set in the same frame the grid appears in, so there is never a paint
       * with the chapters at full strength before the movement starts.
       */
      gsap.set(items, { opacity: 0, y: 36, scale: 0.94 })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.14,
        clearProps: 'opacity,transform',
      })
    } else {
      /*
       * Out first, then collapse. Closing the layout underneath them would
       * take the chapters off the page in a single frame while the section
       * was still shrinking around where they had been.
       */
      gsap.to(items, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.32,
        ease: 'power2.in',
        stagger: 0.04,
        onComplete: () => {
          reshape()
          gsap.set(items, { clearProps: 'opacity,transform' })
        },
      })
    }
  }, [open])

  /** Escape closes it, as anything that opens over the page should. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, toggle])

  return (
    <Section tone="paper" join="soft" spacing="none" id="mission-overview">
      <div ref={root} className="mv">
        <div ref={stage} className="mv-stage">
          <Container wide>
            {/* ── The statement ──────────────────────────────────── */}
            <div className="mv-head">
              <p className="eyebrow text-accent">
                {mission.name}
                <span aria-hidden="true" className="mx-2 opacity-40">
                  ·
                </span>
                {mission.subtitle}
              </p>

              <h2 className="mv-title mt-6">
                Enhancing <span className="text-brand">maritime awareness</span>
                <br />
                from space.
              </h2>

              <p className="mv-lead mt-6">{challenge.points[0]}</p>

              <div className="mv-action mt-9">
                <Button onClick={() => void toggle()} arrow aria-expanded={open}>
                  Learn more about {mission.name}
                </Button>
              </div>
            </div>

            {/* ── The three chapters ─────────────────────────────── */}
            <div className="mv-grid">
              {STORIES.map((s) => (
                <figure key={s.id} className="mv-item">
                  <div className="mv-media" data-flip={s.id}>
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 32vw, 90vw"
                      className="object-cover"
                    />
                  </div>

                  <figcaption className="mv-body" data-story-body>
                    <p className="eyebrow tabular text-accent">{s.index}</p>
                    <h3 className="mv-story-title mt-4">
                      {s.title[0]}
                      <br />
                      {s.title[1]}.
                    </h3>
                    <p className="mv-story-copy mt-4">{s.body}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/*
              Bottom-right rather than floating over the corner of the
              viewport: this is a section that has opened, not a window that
              has appeared on top of one.
            */}
            <div className="mv-close">
              <Button onClick={() => void toggle()} variant="secondary" size="sm">
                Close
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  )
}
