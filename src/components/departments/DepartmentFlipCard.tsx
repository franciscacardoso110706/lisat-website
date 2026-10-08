'use client'

import { useCallback, useId, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { DepartmentGlyph } from './DepartmentGlyph'
import { useTilt } from '@/lib/useTilt'
import { clsx } from '@/lib/utils'
import type { Department } from '@/lib/types'

/**
 * A department, as a physical object lit by blue light.
 *
 * This is the strongest expression of the site's visual language and the only
 * place allowed to be this openly dimensional. The card is a deep-navy slab
 * with a large radius, sitting in front of a diffuse blue glow that reads as
 * the object illuminating the space around it.
 *
 * **Hover explores, click reveals.** Moving over the card lifts it, brightens
 * the ambient light and lets it turn towards the cursor — but never flips it,
 * so crossing the grid stays calm. The flip is a deliberate click.
 *
 * ## The light, in five layers
 *
 * 1. `ambient`   — a large blurred radial *behind* the card, outside its box.
 * 2. `interior`  — a fixed gradient inside the surface.
 * 3. `cursor`    — a radial that tracks the pointer across the face.
 * 4. `rim`       — a thin edge whose bright side follows the card's tilt.
 * 5. `specular`  — a small highlight near the top edge.
 *
 * A single box-shadow cannot do this: shadows hug the border and read as UI
 * chrome, while layers of blurred light read as illumination.
 *
 * ## Thickness
 *
 * The two faces are pushed apart on Z with a darker core between them, so
 * mid-rotation the card shows an edge and reads as a solid object rather than
 * a sheet of paper.
 *
 * Accessibility: the front is a button that turns the card, the back holds a
 * real link plus a control to turn it back, and whichever face is turned away
 * is `inert`, so focus never lands on something the reader cannot see.
 *
 * Under `prefers-reduced-motion` the rotation becomes a short cross-fade and
 * no tilt is applied.
 */

const LIFT = { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 } as const

export function DepartmentFlipCard({
  dept,
  index,
  count,
}: {
  dept: Department
  index: number
  /** How many people are in it, counted on the server from the Team source. */
  count: number
}) {
  const reduced = useReducedMotion()
  const tilt = useTilt({ max: 7, lift: 10 })
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const backId = useId()

  const flip = useCallback(() => setFlipped((v) => !v), [])

  // The rim brightens on the side the card is turning towards, so the lighting
  // appears to answer the object's orientation.
  const rimAngle = useTransform(
    [tilt.rotateY, tilt.rotateX],
    ([y, x]: number[]) => `${135 + y * 4 - x * 2}deg`,
  )

  const active = hovered || flipped

  const faceBase =
    'absolute inset-0 flex flex-col overflow-hidden rounded-panel border p-8 text-left [backface-visibility:hidden] [-webkit-backface-visibility:hidden] md:p-9'

  return (
    <li
      className="relative [perspective:1600px]"
      onPointerEnter={(e) => {
        tilt.handlers.onPointerEnter(e)
        if (tilt.enabled) setHovered(true)
      }}
      onPointerLeave={() => {
        if (tilt.enabled) setHovered(false)
      }}
    >
      {/* Layer 1 — ambient light thrown behind the card into the section. */}
      <motion.span
        aria-hidden="true"
        className="ambient -inset-8 bg-[radial-gradient(closest-side,rgb(var(--glow)/0.62),transparent)]"
        animate={{ opacity: active ? 1 : 0.14, scale: active ? 1.1 : 0.94 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="relative h-[30rem] md:h-[33rem]"
        animate={{ y: active && !reduced ? -8 : 0 }}
        transition={LIFT}
        style={
          reduced
            ? undefined
            : {
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                transformStyle: 'preserve-3d',
              }
        }
      >
        <motion.div
          className="relative h-full [transform-style:preserve-3d]"
          animate={reduced ? undefined : { rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.28, 1] }}
        >
          {/* The core between the two faces — seen edge-on while turning. */}
          <span
            aria-hidden="true"
            className="absolute inset-[3px] rounded-panel bg-surface-sunken ring-1 ring-brand/20"
          />

          {/* ── Front ─────────────────────────────────────────────── */}
          <motion.button
            type="button"
            onClick={flip}
            aria-expanded={flipped}
            aria-controls={backId}
            {...(flipped ? { inert: true } : {})}
            className={clsx(
              faceBase,
              'justify-between border-chalk/10 bg-surface-raised',
              flipped && 'pointer-events-none',
            )}
            style={reduced ? undefined : { transform: 'translateZ(10px)' }}
            animate={reduced ? { opacity: flipped ? 0 : 1 } : undefined}
            transition={{ duration: 0.28 }}
          >
            <Illumination tilt={tilt} active={active} rimAngle={rimAngle} />

            <DepartmentGlyph
              slug={dept.slug}
              className={clsx(
                'pointer-events-none absolute -right-10 top-6 h-72 w-72 text-accent transition-opacity duration-700',
                active ? 'opacity-[0.26]' : 'opacity-[0.13]',
              )}
            />

            <motion.span
              className="relative flex w-full items-start justify-between"
              style={reduced ? undefined : { x: tilt.layerX, y: tilt.layerY, z: 28 }}
            >
              <span className="eyebrow tabular text-accent/80">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow tabular text-chalk-faint">
                {count} {count === 1 ? 'member' : 'members'}
              </span>
            </motion.span>

            <motion.span
              className="relative block"
              style={reduced ? undefined : { x: tilt.layerX, y: tilt.layerY, z: 46 }}
            >
              <span className="block text-[clamp(2.75rem,4.6vw,4rem)] font-semibold leading-[0.94] tracking-tightest text-chalk">
                {dept.abbr}
              </span>
              <span className="eyebrow mt-5 block text-chalk-faint">
                LISAT / Department
              </span>

              <span
                className={clsx(
                  'eyebrow mt-8 inline-flex items-center gap-2 rounded-control border px-4 py-2.5 transition-colors duration-500',
                  active
                    ? 'border-accent/50 text-accent'
                    : 'border-chalk/15 text-chalk-faint',
                )}
              >
                Reveal
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </motion.span>
          </motion.button>

          {/* ── Back ──────────────────────────────────────────────── */}
          <motion.div
            id={backId}
            {...(flipped ? {} : { inert: true })}
            className={clsx(
              faceBase,
              'border-accent/25 bg-surface-raised',
              !reduced && '[transform:rotateY(180deg)_translateZ(10px)]',
            )}
            animate={reduced ? { opacity: flipped ? 1 : 0 } : undefined}
            transition={{ duration: 0.28 }}
          >
            <Illumination tilt={tilt} active={active} rimAngle={rimAngle} strong />

            <div className="relative flex-1">
              <p className="eyebrow tabular text-accent/80">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 text-2xl font-medium leading-snug tracking-snug text-chalk">
                {dept.name}
              </h3>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-chalk-muted">
                {dept.roleOnLisat01}
              </p>
            </div>

            <div className="relative mt-auto pt-6">
              <ul className="flex flex-wrap gap-2.5">
                {dept.disciplines.slice(0, 3).map((d) => (
                  <li
                    key={d}
                    className="eyebrow rounded-control border border-chalk/15 px-3.5 py-2 text-chalk-faint"
                  >
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href={`/departments/${dept.slug}`}
                  className="group inline-flex items-center gap-2 rounded-control bg-accent-solid px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore department
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <button
                  type="button"
                  onClick={flip}
                  className="eyebrow inline-flex items-center gap-2 text-chalk-faint transition-colors hover:text-chalk"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </li>
  )
}

/**
 * Layers 2–5, drawn inside a face: a fixed interior gradient, a
 * cursor-tracking radial, an orientation-aware rim and a small specular.
 */
function Illumination({
  tilt,
  active,
  rimAngle,
  strong = false,
}: {
  tilt: ReturnType<typeof useTilt>
  active: boolean
  rimAngle: MotionValue<string>
  strong?: boolean
}) {
  const rim = useTransform(
    rimAngle,
    (a) =>
      `linear-gradient(${a}, rgb(var(--glow) / 0.55), rgb(var(--glow) / 0.05) 45%, transparent 70%)`,
  )

  return (
    <>
      {/* 2 — interior */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-panel bg-[radial-gradient(120%_80%_at_50%_120%,rgb(var(--glow)/0.16),transparent_70%)]"
      />
      {/* 3 — cursor */}
      {tilt.enabled ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-panel transition-opacity duration-500"
          style={{
            background: `radial-gradient(460px circle at var(--gx) var(--gy), rgb(var(--accent-soft) / ${
              strong ? 0.22 : 0.18
            }), transparent 66%)`,
            ['--gx' as string]: tilt.glareX,
            ['--gy' as string]: tilt.glareY,
            opacity: active ? 1 : 0.12,
          }}
        />
      ) : null}
      {/* 4 — rim */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-panel p-px transition-opacity duration-500"
        style={{
          background: rim,
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: active ? 1 : 0.3,
        }}
      />
      {/* 5 — specular */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-panel bg-[radial-gradient(ellipse_at_top,rgb(180_215_255/0.10),transparent_70%)]"
      />
    </>
  )
}
