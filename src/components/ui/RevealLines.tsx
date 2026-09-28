'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { clsx } from '@/lib/utils'

/**
 * Masked line reveal for the site's major statements.
 *
 * Each line sits in an overflow-hidden wrapper and rises into place with a
 * short stagger, so the type arrives as a set rather than fading in. Crisp and
 * fast by design — the reader should never be waiting on it.
 *
 * Like `Reveal`, the lines render *visible* and only opt into being hidden
 * once the script has run, so a blocked or failed bundle can never leave a
 * headline invisible. The animation is pure CSS; this component only decides
 * when to flip the attribute.
 */
/** A line of the statement. Pass an object to style that line on its own. */
export type RevealLine = string | { text: string; className?: string }

export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = 'h2',
  /** Milliseconds between lines. */
  stagger = 80,
}: {
  lines: RevealLine[]
  className?: string
  /** Applied to every line. */
  lineClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  stagger?: number
}) {
  const node = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = node.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    // Already on screen at load — leave it alone rather than animating late.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.dataset.lines = 'hidden'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.lines = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={node as React.Ref<HTMLHeadingElement & HTMLParagraphElement>}
      className={className}
      style={{ '--line-stagger': `${stagger}ms` } as CSSProperties}
    >
      {lines.map((line, i) => {
        const text = typeof line === 'string' ? line : line.text
        const own = typeof line === 'string' ? undefined : line.className
        return (
          // The display sizes run a line-height under 1, which puts the
          // descenders of g, y, p below the line box. The inner line is padded
          // to hold them and the mask hands most of it back as negative
          // margin, so nothing is clipped and the rhythm is unchanged.
          <span key={text + i} className="-mb-[0.12em] block overflow-hidden">
            <span
              className={clsx('line-inner block pb-[0.2em]', lineClassName, own)}
              style={{ '--line-index': i } as CSSProperties}
            >
              {text}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
