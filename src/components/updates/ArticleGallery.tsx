'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from '@/lib/utils'
import type { UpdateImage } from '@/lib/types'

/**
 * The photographs of one update, in the order they were written down.
 *
 * The cover leads because it is the picture the article was chosen by; the
 * gallery follows. A single-image article gets no arrows and no dots — the
 * controls appear because there is somewhere to go, not because the component
 * has them.
 *
 * Embla again, as on the team page. Same reason: drag, momentum and snapping
 * are the part that is easy to get subtly wrong by hand.
 */
export function ArticleGallery({ images }: { images: UpdateImage[] }) {
  const many = images.length > 1

  const [emblaRef, embla] = useEmblaCarousel({
    loop: many,
    align: 'start',
    duration: 24,
    // Nothing to drag when there is one picture.
    active: many,
  })

  const [index, setIndex] = useState(0)

  /*
   * Until this is true the viewport scrolls natively instead.
   *
   * Without it a page with no JavaScript shows the first photograph and hides
   * the rest behind `overflow: hidden`, under arrows that do nothing. Native
   * overflow with scroll-snap is a worse carousel and a perfectly good strip.
   */
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (embla) setReady(true)
  }, [embla])

  useEffect(() => {
    if (!embla) return
    const sync = () => setIndex(embla.selectedScrollSnap())
    sync()
    embla.on('select', sync).on('reInit', sync)
    return () => {
      embla.off('select', sync).off('reInit', sync)
    }
  }, [embla])

  const go = useCallback(
    (to: number) => embla?.scrollTo(to),
    [embla],
  )

  return (
    <figure className="ag" data-ready={ready ? 'true' : undefined}>
      <div className="ag-viewport" ref={emblaRef}>
        <div className="ag-track">
          {images.map((image, i) => (
            <div className="ag-slide" key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                sizes="(min-width: 1120px) 1024px, 100vw"
                className="object-cover"
                style={image.position ? { objectPosition: image.position } : undefined}
              />
            </div>
          ))}
        </div>

        {many ? (
          <>
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              className="ag-arrow ag-arrow--prev"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              className="ag-arrow ag-arrow--next"
              aria-label="Next photograph"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="ag-dots">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Photograph ${i + 1} of ${images.length}`}
                  aria-current={i === index}
                  className={clsx('ag-dot', i === index && 'is-on')}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/*
        The caption describes whichever photograph is showing. It is the alt
        text, which the team already writes for every image — a second field
        for the same sentence would only ever disagree with itself.
      */}
      <figcaption className="ag-caption">
        {many ? (
          <span className="ag-count tabular">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        ) : null}
        <span>{images[index]?.alt}</span>
      </figcaption>
    </figure>
  )
}
