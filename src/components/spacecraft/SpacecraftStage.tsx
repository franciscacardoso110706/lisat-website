'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSectionScroll, useRange } from '@/lib/motion'

/**
 * The stage LISAT-01 occupies on the site.
 *
 * This is the seam for the interactive 3D CubeSat. Today it renders whatever
 * `fallback` is passed — currently a still render — inside a square, pinned,
 * scroll-aware frame. When a flight-representative model exists, a React Three
 * Fiber scene is mounted here instead and *nothing around it has to change*:
 * the layout, the pinning, the annotations and the scroll progress are already
 * in place.
 *
 * ## Introducing the 3D model later
 *
 * 1. Add `three`, `@react-three/fiber` and `@react-three/drei`.
 * 2. Create `SpacecraftModel.tsx` — a client component taking a
 *    `progress: MotionValue<number>` and driving camera and part transforms
 *    from it (rotate → approach → separate → label → reassemble).
 * 3. Load it here behind `next/dynamic` with `ssr: false` so the three.js
 *    bundle never reaches devices that will not render it:
 *
 *    ```tsx
 *    const SpacecraftModel = dynamic(() => import('./SpacecraftModel'), {
 *      ssr: false,
 *      loading: () => fallback,
 *    })
 *    ```
 *
 * 4. Gate it on `canRender3D` below, which already excludes reduced-motion
 *    readers and coarse pointers. Those readers keep the still render, which
 *    is the accessible and cheap path — not a degraded one.
 *
 * The `progress` value is exposed precisely so the eventual scene can be
 * scrubbed by scroll rather than animated on a timer.
 */

export type SpacecraftAnnotation = {
  /** Subsystem or feature label, e.g. `POWER`. */
  label: string
  /** Where it sits on the frame, as percentages. */
  x: number
  y: number
}

export function SpacecraftStage({
  fallback,
  annotations = [],
  className,
  children,
}: {
  /** Shown until (and unless) a 3D scene is mounted. */
  fallback: ReactNode
  /** Subsystem callouts drawn over the frame. */
  annotations?: SpacecraftAnnotation[]
  className?: string
  /** Optional overlay content, e.g. a progress rail. */
  children?: ReactNode
}) {
  const { ref, progress, reduced } = useSectionScroll(['start end', 'end start'])
  const scale = useRange(progress, [1, 1.05])

  // Kept as state rather than a constant so the future dynamic import can flip
  // it once the scene has actually mounted.
  const [has3D] = useState(false)

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative aspect-square w-full overflow-hidden rounded-panel bg-void"
        style={{ scale }}
      >
        {has3D ? null : fallback}

        {annotations.map((a) => (
          <span
            key={a.label}
            className="eyebrow pointer-events-none absolute hidden rounded-control bg-void/70 px-3 py-1.5 text-chalk backdrop-blur-md lg:block"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            {a.label}
          </span>
        ))}

        {children}
      </motion.div>

      {/* Exposed for the future scene; also documents intent in the DOM. */}
      <span
        hidden
        data-spacecraft-stage
        data-reduced={reduced ? 'true' : 'false'}
      />
    </div>
  )
}
