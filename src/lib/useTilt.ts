'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Cursor-driven tilt for a card, in the manner of a machined object catching
 * the light rather than a game card flipping.
 *
 * The rotation ceiling is deliberately small (6° by default). Past roughly 8°
 * the text inside starts to look distorted and the effect reads as a gimmick.
 *
 * Returns values for a `motion` element plus a normalised cursor position,
 * which the caller can use for a faint directional highlight:
 *
 * ```tsx
 * const tilt = useTilt()
 * <motion.div {...tilt.handlers} style={{ rotateX: tilt.rotateX, ... }} />
 * ```
 *
 * Disabled entirely on coarse pointers and under `prefers-reduced-motion`; in
 * both cases every value stays at rest and the handlers do nothing, so the
 * card is simply static. Nothing is listened to globally — the handlers are
 * React props on the element itself, so there is no cleanup to leak.
 */
export function useTilt({
  /** Maximum rotation in degrees, on each axis. */
  max = 6,
  /** How far the inner layer lifts, in px, for a parallax layer. */
  lift = 10,
} = {}) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(fine.matches && !still.matches)
    update()
    fine.addEventListener('change', update)
    still.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      still.removeEventListener('change', update)
    }
  }, [])

  // -0.5 → 0.5 across the card, 0 at the centre.
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const spring = { stiffness: 180, damping: 22, mass: 0.6 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const layerX = useTransform(sx, [-0.5, 0.5], [-lift, lift])
  const layerY = useTransform(sy, [-0.5, 0.5], [-lift, lift])
  // Percentages for a radial highlight that follows the cursor.
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%'])

  const rect = useRef<DOMRect | null>(null)
  const [tracking, setTracking] = useState(false)

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return
      // Measured once, then held: the pointer stream below stays read-only and
      // never forces a synchronous layout.
      const r = e.currentTarget.getBoundingClientRect()
      rect.current = r
      // Orient from the entry point straight away. Attaching the window
      // listener costs a render, and without this the card sits flat until the
      // pointer moves again — a dead frame at the start of every hover.
      px.set((e.clientX - r.left) / r.width - 0.5)
      py.set((e.clientY - r.top) / r.height - 0.5)
      setTracking(true)
    },
    [enabled, px, py],
  )

  /**
   * While hovered, the pointer is followed on `window` and the card's own
   * bounds decide when to stop — not `pointerleave` on the element.
   *
   * That matters because the element is being rotated in 3D: near its edges
   * the rendered surface pulls away from under the cursor, the browser fires a
   * spurious `pointerleave` while the pointer is still well inside the card's
   * box, and the tilt snaps back mid-gesture. Comparing against the measured
   * rect makes the interaction independent of the transform it is driving.
   */
  useEffect(() => {
    if (!tracking) return

    const stop = () => {
      px.set(0)
      py.set(0)
      rect.current = null
      setTracking(false)
    }

    const onMove = (e: PointerEvent) => {
      const r = rect.current
      if (!r) return stop()
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      if (!inside) return stop()
      px.set((e.clientX - r.left) / r.width - 0.5)
      py.set((e.clientY - r.top) / r.height - 0.5)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    // The cached rect is viewport-relative, so scrolling invalidates it.
    window.addEventListener('scroll', stop, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', stop)
    }
  }, [tracking, px, py])

  return {
    enabled,
    rotateX,
    rotateY,
    layerX,
    layerY,
    glareX,
    glareY,
    /** Spread onto the element that should sense the cursor. */
    handlers: { onPointerEnter },
  }
}
