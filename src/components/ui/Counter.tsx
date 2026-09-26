'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The server renders the final figure, so the number is correct without
 * JavaScript and for search engines; the animation is an enhancement on top.
 */
export function Counter({
  value,
  suffix,
  duration = 1200,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    let frame = 0

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setDisplay(0)
        run()
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular">
      {display}
      {suffix ?? ''}
    </span>
  )
}
