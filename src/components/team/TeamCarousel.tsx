'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { TeamPortrait } from '@/components/team/TeamPortrait'
import { clsx } from '@/lib/utils'
import type { TeamMember } from '@/lib/types'

/**
 * Everyone, along one line.
 *
 * The carousel is the page. It runs off the right edge of the screen on
 * purpose — a card cut by the viewport says "there are more people" more
 * plainly than any label would, and it keeps saying it at every position
 * except the last.
 *
 * Embla does the drag, the momentum and the snapping. Hand-written pointer
 * physics is the kind of code that works on the machine it was written on, and
 * this has to work on a trackpad, a touchscreen and a mouse.
 *
 * No autoplay. These are people, not logos; moving them past the reader on a
 * timer makes the page something to watch instead of something to look
 * through.
 */
export function TeamCarousel({
  members,
  size = 'md',
  /** How many cards an arrow press travels. */
  step = 2,
  label,
}: {
  members: TeamMember[]
  size?: 'sm' | 'md'
  step?: number
  label: string
}) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: step,
    // Embla's own easing. Slow enough to follow a face across the screen.
    duration: 26,
  })

  /*
   * Until this is true the track scrolls natively instead.
   *
   * Without it, a page with no JavaScript gets a strip clipped to four people
   * and no way to reach the other twenty-nine — the carousel silently becomes
   * a crop. Native overflow is a worse carousel and a perfectly good list.
   */
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (embla) setReady(true)
  }, [embla])

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!embla) return
    const sync = () => {
      setCanPrev(embla.canScrollPrev())
      setCanNext(embla.canScrollNext())
    }
    const down = () => setDragging(true)
    const up = () => setDragging(false)

    sync()
    embla.on('select', sync).on('reInit', sync)
    embla.on('pointerDown', down).on('pointerUp', up)
    return () => {
      embla.off('select', sync).off('reInit', sync)
      embla.off('pointerDown', down).off('pointerUp', up)
    }
  }, [embla])

  /*
   * Trackpad. Embla listens for pointers, not for wheels, so a two-finger
   * sideways swipe would otherwise do nothing on the one input that most
   * obviously means "move this sideways".
   *
   * Accumulated and thresholded rather than mapped frame by frame: forwarding
   * raw deltas into a snapping carousel fights the snap on every notch. A
   * gesture moves a step, which is what the gesture means. Vertical wheel is
   * left alone entirely — the page still has to scroll.
   */
  const wheelAcc = useRef(0)
  const wheelLock = useRef(0)

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!embla) return
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()

      const now = Date.now()
      if (now < wheelLock.current) return

      wheelAcc.current += e.deltaX
      if (Math.abs(wheelAcc.current) < 45) return

      if (wheelAcc.current > 0) embla.scrollNext()
      else embla.scrollPrev()
      wheelAcc.current = 0
      wheelLock.current = now + 260
    },
    [embla],
  )

  return (
    <div className="tc" data-ready={ready ? 'true' : undefined}>
      <div
        className={clsx('tc-viewport', dragging && 'is-dragging')}
        ref={emblaRef}
        onWheel={onWheel}
        role="region"
        aria-label={label}
      >
        <ul className="tc-track">
          {members.map((m, i) => (
            <li key={m.id} className={clsx('tc-slide', size === 'sm' && 'tc-slide--sm')}>
              <TeamPortrait member={m} size={size} eager={i < 5} />
            </li>
          ))}
        </ul>
      </div>

      <div className="tc-nav">
        <button
          type="button"
          onClick={() => embla?.scrollPrev()}
          disabled={!canPrev}
          className="tc-arrow"
          aria-label="Previous members"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => embla?.scrollNext()}
          disabled={!canNext}
          className="tc-arrow"
          aria-label="Next members"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
