'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { tierBadge } from '@/data/partners'
import { clsx } from '@/lib/utils'
import type { Partner } from '@/lib/types'

/**
 * The key partners, as a deck of overlapping logo cards.
 *
 * The partners arrive sorted by importance. The deck lays them out from the
 * centre outwards, alternating sides, so the most important starts in front
 * with the next two either side and the rest receding towards the edges.
 * The partner at the top of the hierarchy also carries a little extra scale
 * whenever it is in front. Nothing here knows a partner's name; the order is
 * the data's.
 *
 * Each card's scale, lift and opacity follow its distance from the card in
 * front (globals.css), so choosing a card slides it forward rather than
 * swapping content in place. Embla does the moving: drag, swipe, click to
 * centre, arrows; a sideways trackpad gesture steps it, as on the Team page.
 *
 * The arrow on the card in front goes somewhere real: the partner's story
 * on the Updates page, or its own site. A partner with nowhere to go shows
 * no arrow at all.
 */

export function PartnerDeck({
  partners,
  allHref,
}: {
  /** Sorted by importance, most important first. */
  partners: Partner[]
  /** Where "View all partners" points. */
  allHref: string
}) {
  const reduced = useReducedMotion()
  const router = useRouter()

  // Centre-out arrangement: [... 3, 1, 0, 2, 4 ...].
  const { deck, start } = useMemo(() => {
    const left: Partner[] = []
    const right: Partner[] = []
    partners.slice(1).forEach((p, i) => (i % 2 === 0 ? left : right).push(p))
    const ordered = [...left.reverse(), ...(partners[0] ? [partners[0]] : []), ...right]
    return { deck: ordered, start: left.length }
  }, [partners])

  const rank = useMemo(
    () => new Map(partners.map((p, i) => [p.id, i])),
    [partners],
  )

  const [emblaRef, embla] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    startIndex: start,
    duration: reduced ? 12 : 30,
  })

  const [active, setActive] = useState(start)

  useEffect(() => {
    if (!embla) return
    const sync = () => setActive(embla.selectedScrollSnap())
    embla.on('select', sync).on('reInit', sync)
    return () => {
      embla.off('select', sync).off('reInit', sync)
    }
  }, [embla])

  /*
   * Trackpad: a sideways two-finger swipe steps the deck. Accumulated so one
   * gesture is one step, and attached natively because a passive React wheel
   * listener cannot stop the page from scrolling sideways underneath.
   */
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null)
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node)
      setViewport(node)
    },
    [emblaRef],
  )

  useEffect(() => {
    if (!embla || !viewport) return
    let acc = 0
    let lock = 0
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      const now = Date.now()
      if (now < lock) return
      acc += e.deltaX
      if (Math.abs(acc) < 45) return
      if (acc > 0) embla.scrollNext()
      else embla.scrollPrev()
      acc = 0
      lock = now + 320
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', onWheel)
  }, [embla, viewport])

  if (!deck.length) return null

  return (
    <div className="pd" role="region" aria-roledescription="carousel" aria-label="Key partners">
      <div className="pd-viewport" ref={setRefs}>
        <ul className="pd-track">
          {deck.map((p, i) => {
            const d = Math.min(Math.abs(i - active), 3)
            const front = i === active
            const lead = rank.get(p.id) === 0
            // Where the arrow goes: the partner's story, else its site.
            const href = p.story ?? p.url
            const external = !p.story && Boolean(p.url)
            const label = `${p.name}, ${tierBadge[p.tier]}`

            return (
              <li key={p.id} className="pd-slide" data-d={d} style={{ zIndex: 10 - d }}>
                <button
                  type="button"
                  className={clsx('pd-card', lead && 'pd-card--lead')}
                  aria-label={front && href ? `${label}. Explore` : label}
                  aria-current={front ? 'true' : undefined}
                  onClick={() => {
                    if (!front) {
                      embla?.scrollTo(i)
                      return
                    }
                    if (!href) return
                    if (external) {
                      window.open(href, '_blank', 'noopener,noreferrer')
                    } else {
                      router.push(href)
                    }
                  }}
                >
                  {front ? (
                    <span className="pd-num tabular" aria-hidden="true">
                      {String((rank.get(p.id) ?? 0) + 1).padStart(2, '0')}
                    </span>
                  ) : null}
                  <span className="pd-logo-wrap" aria-hidden="true">
                    <Image src={p.logo} alt="" width={420} height={200} className="pd-logo" />
                  </span>
                  {/* The lead partner's level is a filled badge, on every
                      card position, so it stands apart even when it is not
                      the one in front. */}
                  <span className={lead ? 'pd-badge' : 'pd-tier'} aria-hidden="true">
                    {tierBadge[p.tier]}
                  </span>
                  {/* Space is kept when there is nowhere to go, so every card
                      lines up. */}
                  <span className={href ? 'pd-go' : 'pd-go pd-go--none'} aria-hidden="true">
                    {href ? <ArrowRight className="h-4 w-4" /> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="pd-nav">
        <button
          type="button"
          className="pd-arrow"
          onClick={() => embla?.scrollPrev()}
          disabled={active === 0}
          aria-label="Previous partner"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <a href={allHref} className="pd-all">
          View all partners
        </a>
        <button
          type="button"
          className="pd-arrow"
          onClick={() => embla?.scrollNext()}
          disabled={active === deck.length - 1}
          aria-label="Next partner"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
