'use client'

import { useRef, type RefObject } from 'react'
import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * The site's motion vocabulary.
 *
 * Two rules hold everywhere:
 *
 * 1. **Scroll drives motion.** Values are derived from scroll position, not
 *    from timers, so movement stops when the reader stops and reverses when
 *    they scroll back. Nothing "flies in" once and stays put.
 *
 * 2. **The resting state is the truthful state.** Every range starts at its
 *    neutral value, which means the server-rendered page — and the page with
 *    JavaScript disabled or broken — is already laid out correctly. Motion is
 *    layered on top; it is never a precondition for reading the content.
 *
 * Under `prefers-reduced-motion` every range collapses to a constant, so the
 * same components render completely still without branching their markup.
 *
 * We use Framer Motion rather than GSAP + ScrollTrigger: it already ships with
 * the app, its `MotionValue`s update styles outside React's render cycle (so
 * scrolling causes no re-renders), and it costs a fraction of the bundle.
 */

/** Long, decelerating ease. Matches the CSS reveal timing in `globals.css`. */
export const easeOut = [0.16, 1, 0.3, 1] as const

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/**
 * Tracks how far an element has travelled through the viewport, as 0 → 1.
 *
 * The default offset runs from the section entering the bottom of the viewport
 * to it leaving the top, which puts progress ≈ 0.5 while the section is being
 * read — the right centre point for parallax.
 *
 * For pinned sequences pass `['start start', 'end end']` instead, so progress
 * begins when the section reaches the top of the viewport.
 */
export function useSectionScroll<T extends HTMLElement = HTMLDivElement>(
  offset: Offset = ['start end', 'end start'],
) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset,
  })

  return { ref, progress: scrollYProgress, reduced: Boolean(reduced) }
}

/**
 * Maps scroll progress onto an output range, holding still when the reader has
 * asked for reduced motion.
 *
 * ```tsx
 * const { ref, progress } = useSectionScroll()
 * const y = useRange(progress, [60, -60])
 * <motion.div ref={ref} style={{ y }} />
 * ```
 */
export function useRange(
  progress: MotionValue<number>,
  output: readonly [number, number],
  input: readonly [number, number] = [0, 1],
): MotionValue<number> {
  const reduced = useReducedMotion()
  return useTransform(
    progress,
    input as [number, number],
    reduced ? [output[0], output[0]] : [output[0], output[1]],
  )
}

/**
 * Cross-fades a stack of layers against scroll progress — used by the mission
 * sequence, where one pinned frame shows three images in turn.
 *
 * Returns the opacity keyframes for the layer at `index` of `count`, with
 * `overlap` controlling how much of each step is spent blending. Layer 0 is
 * fully opaque at progress 0, so the un-hydrated render shows the first image.
 */
export function crossfadeWindow(index: number, count: number, overlap = 0.16) {
  const start = index / count
  const end = (index + 1) / count
  const half = overlap / 2

  if (index === 0) {
    return { input: [0, end - half, end + half], output: [1, 1, 0] }
  }
  if (index === count - 1) {
    return { input: [start - half, start + half, 1], output: [0, 1, 1] }
  }
  return {
    input: [start - half, start + half, end - half, end + half],
    output: [0, 1, 1, 0],
  }
}
