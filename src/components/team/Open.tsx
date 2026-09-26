'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { clsx } from '@/lib/utils'

/**
 * OPEN — a surface that grows into view.
 *
 * The shared reveal for the team page's two set pieces: the hero photograph
 * and the closing invitation. It starts as a small rounded shape and expands
 * to its full size, so the content reads as being uncovered rather than faded
 * in.
 *
 * Like every other reveal on this site, the element renders *open* and only
 * opts into being closed once the script has confirmed it can open it again.
 * A blocked bundle or a crawler sees the finished thing, never a sliver.
 */
export function Open({
  children,
  className,
  /** Corner radius of the finished surface. */
  radius = '3rem',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  radius?: string
  delay?: number
}) {
  const node = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = node.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    // Already on screen at load: leave it alone rather than animating late.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return

    el.dataset.open = 'closed'

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        window.setTimeout(() => {
          el.dataset.open = 'shown'
        }, delay)
        io.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={node}
      className={clsx('will-change-[clip-path]', className)}
      style={{ ['--open-radius' as string]: radius } as CSSProperties}
    >
      {children}
    </div>
  )
}
