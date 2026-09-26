'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { clsx } from '@/lib/utils'
import type { Partner, PartnerTier, PartnerTierMeta } from '@/lib/types'

/**
 * The partner ecosystem, as a slow-moving stream.
 *
 * Two rows travel in opposite directions at slightly different speeds. Resting
 * on one brings the whole thing to a stop with inertia, lifts that partner out
 * of the stream and opens a small panel beside it.
 *
 * ## Why this is driven by rAF rather than a CSS animation
 *
 * `animation-duration` cannot be transitioned, so a CSS marquee can only snap
 * between moving and paused. The brief for this page is that it decelerates.
 * A single `translate3d` per row per frame is cheap, the loop parks itself
 * when the section scrolls out of view, and it never runs at all under
 * reduced motion.
 *
 * ## Why it does not move on touch
 *
 * A deliberate choice, not a workaround. A logo drifting at ~26px/second is a
 * poorer tap target than a still one, and a permanent animation costs battery
 * on a phone for an effect that reads as decoration there. Coarse pointers get
 * the same still, horizontally scrollable list as reduced motion — every
 * partner reachable, nothing moving under the finger.
 *
 * ## Honesty about duplication
 *
 * Each row renders its partners twice so the loop can seam invisibly. The
 * second copy is `aria-hidden` and not focusable, so assistive technology and
 * the keyboard see each organisation exactly once.
 *
 * ## Logo normalisation
 *
 * Three of the files carry a baked-in white background rather than
 * transparency. `mix-blend-mode: multiply` drops that white against the light
 * page; it is safe for the rest because no logo here is predominantly light —
 * checked, not assumed.
 */

/** Tier badge styling. Differentiated, but no metallic gradients. */
const tierStyle: Record<PartnerTier, string> = {
  main: 'bg-accent-solid text-accent-fg border-transparent',
  gold: 'border-accent/45 text-accent',
  silver: 'border-fg/25 text-fg-muted',
  bronze: 'border-fg/20 text-fg-muted',
  technical: 'border-accent/25 text-accent/80',
  institutional: 'border-fg/20 text-fg-muted',
  supporter: 'border-fg/15 text-fg-faint',
}

type Active = { partner: Partner; x: number; row: number } | null

export function PartnerMarquee({
  partners,
  tiers,
}: {
  partners: Partner[]
  tiers: PartnerTierMeta[]
}) {
  const reduced = useReducedMotion()
  const [coarse, setCoarse] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const trackA = useRef<HTMLDivElement>(null)
  const trackB = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Active>(null)
  /**
   * Set while a finger is down. Between `touchstart` and `touchend` the logo
   * keeps travelling, and the browser then resolves the click against whatever
   * has moved under the point — so the tap misses. Freezing the stream the
   * moment the finger lands keeps the target still long enough to hit.
   */
  const [held, setHeld] = useState(false)

  const tierLabel = useMemo(
    () => new Map(tiers.map((t) => [t.id, t.label])),
    [tiers],
  )
  const tierNote = useMemo(
    () => new Map(tiers.map((t) => [t.id, t.description])),
    [tiers],
  )

  // Split once, in order, so each organisation appears in exactly one row.
  const [rowA, rowB] = useMemo(() => {
    const half = Math.ceil(partners.length / 2)
    return [partners.slice(0, half), partners.slice(half)]
  }, [partners])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const sync = () => setCoarse(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Still whenever motion would get in the way of using it.
  const still = Boolean(reduced) || coarse

  const paused = active !== null || held
  // Read inside the animation loop without restarting it.
  const pausedRef = useRef(false)
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    if (still) return
    const a = trackA.current
    const b = trackB.current
    const host = stage.current
    if (!a || !b || !host) return

    let raf = 0
    let last = performance.now()
    let visible = true
    // Current and target multipliers, eased so stopping and starting glide.
    let speed = 1
    const offsets = [0, 0]
    const rates = [26, 20] // px per second
    const dirs = [-1, 1]

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const target = pausedRef.current ? 0 : 1
      speed += (target - speed) * (1 - Math.pow(0.001, dt))

      ;[a, b].forEach((el, i) => {
        // Half the track is one full copy of the list.
        const span = el.scrollWidth / 2
        if (span > 0) {
          offsets[i] += dirs[i] * rates[i] * speed * dt
          if (offsets[i] <= -span) offsets[i] += span
          if (offsets[i] >= 0) offsets[i] -= span
          el.style.transform = `translate3d(${offsets[i]}px,0,0)`
        }
      })

      raf = visible ? requestAnimationFrame(frame) : 0
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(host)

    raf = requestAnimationFrame(frame)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [still])

  const open = useCallback(
    (partner: Partner, el: HTMLElement, row: number) => {
      const host = stage.current
      if (!host) return
      const h = host.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      setActive({ partner, x: r.left - h.left + r.width / 2, row })
    },
    [],
  )

  const close = useCallback(() => {
    setActive(null)
    setHeld(false)
  }, [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close])

  const renderRow = (
    items: Partner[],
    rowIndex: number,
    track: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div className="relative overflow-hidden py-8 md:py-10">
      <div
        ref={track}
        className={clsx(
          'flex items-center',
          still ? 'w-full' : 'w-max will-change-transform',
        )}
      >
        {(still ? [items] : [items, items]).map((copy, copyIndex) => (
          <ul
            key={copyIndex}
            className={clsx(
              'flex items-center',
              still && 'w-full flex-nowrap overflow-x-auto scroll-smooth',
            )}
            // The second copy exists only to seam the loop.
            aria-hidden={copyIndex === 1 ? 'true' : undefined}
          >
            {copy.map((partner) => {
              const isActive = active?.partner.id === partner.id
              const dimmed = active !== null && !isActive
              return (
                <li key={`${copyIndex}-${partner.id}`} className="shrink-0">
                  <button
                    type="button"
                    tabIndex={copyIndex === 1 ? -1 : undefined}
                    aria-label={`${partner.name} — ${tierLabel.get(partner.tier) ?? partner.tier}`}
                    aria-expanded={isActive}
                    // Touch fires `pointerenter` on tap, which would open the
                    // partner and let the click that follows close it again.
                    // Hovering is a mouse gesture only.
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'mouse') return
                      open(partner, e.currentTarget, rowIndex)
                    }}
                    // Keyboard focus opens the partner; focus that merely
                    // follows a tap or a click must not, or the click behind
                    // it sees an already-open panel and closes it again.
                    onFocus={(e) => {
                      if (!e.currentTarget.matches(':focus-visible')) return
                      open(partner, e.currentTarget, rowIndex)
                    }}
                    onPointerDown={(e) => {
                      if (e.pointerType === 'mouse') return
                      setHeld(true)
                    }}
                    onPointerCancel={() => setHeld(false)}
                    // Stops here: the same click bubbling to the stage below
                    // is read as a background tap and would close the panel
                    // in the same gesture that opened it.
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isActive) close()
                      else {
                        setHeld(false)
                        open(partner, e.currentTarget, rowIndex)
                      }
                    }}
                    className={clsx(
                      'relative flex h-24 w-[13rem] items-center justify-center px-6 outline-offset-4 transition-[opacity,transform,filter] duration-500 ease-out md:h-28 md:w-[15rem]',
                      isActive
                        ? 'z-10 -translate-y-1 scale-105 opacity-100 grayscale-0'
                        : dimmed
                          ? 'opacity-40 grayscale'
                          : 'opacity-70 grayscale hover:opacity-100',
                    )}
                  >
                    {/* Ambient light, only behind the active partner. */}
                    <span
                      aria-hidden="true"
                      className={clsx(
                        'pointer-events-none absolute inset-0 -z-10 rounded-control bg-[radial-gradient(closest-side,rgb(var(--glow)/0.22),transparent)] blur-2xl transition-opacity duration-500',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <Image
                      src={partner.logo}
                      alt=""
                      width={260}
                      height={120}
                      loading="lazy"
                      className="max-h-14 w-auto max-w-full object-contain mix-blend-multiply md:max-h-16"
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )

  return (
    <div
      ref={stage}
      className="relative"
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        close()
      }}
      onClick={(e) => {
        // Tapping the background closes the open partner on touch devices.
        if (e.target === e.currentTarget) close()
      }}
    >
      {/* Soft edges, so the stream has no visible beginning or end. */}
      {!still ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-surface to-transparent md:w-40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-surface to-transparent md:w-40"
          />
        </>
      ) : null}

      {renderRow(rowA, 0, trackA)}
      {renderRow(rowB, 1, trackB)}

      {/* The expanded partner. Anchored under the row it came from. */}
      <AnimatePresence>
        {active ? (
          <motion.div
            key={active.partner.id}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 w-[19rem] -translate-x-1/2"
            style={{
              left: `clamp(10rem, ${active.x}px, calc(100% - 10rem))`,
              top: active.row === 0 ? '10.5rem' : undefined,
              bottom: active.row === 1 ? '10.5rem' : undefined,
            }}
          >
            <div className="relative overflow-hidden rounded-card border border-rule bg-surface p-6 shadow-lift-lg">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgb(var(--glow)/0.10),transparent_70%)]"
              />
              <div className="relative">
                <p className="text-lg font-medium leading-snug tracking-snug text-fg">
                  {active.partner.name}
                </p>

                <p
                  className={clsx(
                    'eyebrow mt-3 inline-flex rounded-control border px-3 py-1.5',
                    tierStyle[active.partner.tier],
                  )}
                >
                  {tierLabel.get(active.partner.tier) ?? active.partner.tier}
                </p>

                {/* The partner's own line where we have one; otherwise what
                    this tier means. Never an invented description. */}
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                  {active.partner.contribution ??
                    tierNote.get(active.partner.tier)}
                </p>

                {active.partner.url ? (
                  <a
                    href={active.partner.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="eyebrow group mt-5 inline-flex items-center gap-2 text-accent transition-colors hover:text-accent-hover"
                  >
                    Learn more
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
