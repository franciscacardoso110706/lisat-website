'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Tag = 'div' | 'li' | 'article' | 'section'

/**
 * Scroll reveal.
 *
 * Content renders visible and only opts *into* the animation once JavaScript
 * runs, so a failed or blocked script never hides the page. Elements that are
 * already on screen when the page loads are left alone — only things below the
 * fold animate in.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  /** Seconds. Use small increments (0.04–0.1) to stagger a row. */
  delay?: number
  className?: string
  as?: Tag
}) {
  const node = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = node.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    // Already in view on load — show it as-is rather than animating on arrival.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.dataset.reveal = 'hidden'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.reveal = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -80px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const setNode = (el: HTMLElement | null) => {
    node.current = el
  }

  const style = {
    '--reveal-delay': `${Math.round(delay * 1000)}ms`,
  } as CSSProperties

  if (as === 'li') {
    return (
      <li ref={setNode} className={className} style={style}>
        {children}
      </li>
    )
  }

  if (as === 'article') {
    return (
      <article ref={setNode} className={className} style={style}>
        {children}
      </article>
    )
  }

  if (as === 'section') {
    return (
      <section ref={setNode} className={className} style={style}>
        {children}
      </section>
    )
  }

  return (
    <div ref={setNode} className={className} style={style}>
      {children}
    </div>
  )
}
