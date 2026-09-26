'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { clsx } from '@/lib/utils'

/**
 * Editorial image reveal.
 *
 * A mask wipes up the frame while the photograph itself settles more slowly
 * behind it. The difference in rate is what reads as depth — a straight fade
 * does not. The mask finishes first, so the picture is never withheld.
 *
 * The frame renders fully visible and only opts into being masked once the
 * script runs, which means a blocked bundle shows the photograph rather than
 * an empty box. Both halves of the animation are CSS; this component only
 * decides when to start them.
 */
export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  sizes = '100vw',
  priority = false,
}: {
  src: string
  alt: string
  /** Applied to the frame — give it the aspect ratio and any positioning. */
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
}) {
  const node = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = node.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    // Above the fold at load — show it immediately rather than wiping late.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.dataset.img = 'hidden'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.img = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={node}
      className={clsx(
        'relative overflow-hidden rounded-media bg-mist',
        className,
      )}
    >
      {/* The inner wrapper carries the transform so the mask on the frame and
          the drift on the photograph stay independent. */}
      <div className="img-inner absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={clsx('object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}
