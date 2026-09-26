'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * A hairline along the bottom edge of the navbar showing how far through the
 * page the reader is.
 *
 * One pixel tall and drawn in the accent, so it reads as an instrument
 * rather than as chrome. It is driven by document scroll and scaled on the
 * compositor, so it costs nothing per frame.
 *
 * Hidden under `prefers-reduced-motion` — a bar that tracks scroll is motion
 * whether or not it eases, and it carries no information the page needs.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
      style={{ scaleX: width }}
    />
  )
}
