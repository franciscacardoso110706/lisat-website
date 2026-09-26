'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DepartmentFlipCard } from './DepartmentFlipCard'
import { Container, Section } from '@/components/ui/Section'
import { Coordinates } from '@/components/ui/Technical'
import { site } from '@/data/site'
import type { Department } from '@/lib/types'

/**
 * The dark environment the department cards live in.
 *
 * Atmosphere here is deliberately thin: a faint engineering grid, a pair of
 * coordinates, and one soft blue wash that follows the cursor across the
 * section. No stars, no particles — the cards are the subject, and anything
 * competing with them would be noise.
 *
 * The cursor wash is written straight to CSS custom properties on the section
 * through a ref, so moving the pointer never re-renders the nine cards below
 * it. It is skipped entirely on coarse pointers, where there is no cursor to
 * follow.
 */
export function DepartmentGrid({ departments }: { departments: Department[] }) {
  const section = useRef<HTMLDivElement>(null)
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = section.current
      if (!el || !fine) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--wash-x', `${e.clientX - r.left}px`)
      el.style.setProperty('--wash-y', `${e.clientY - r.top}px`)
      el.style.setProperty('--wash-on', '1')
    },
    [fine],
  )

  const onPointerLeave = useCallback(() => {
    section.current?.style.setProperty('--wash-on', '0')
  }, [])

  return (
    <Section
      tone="void"
      spacing="loose"
      id="departments"
      className="soft-edge-top -mt-10 md:-mt-16"
    >
      <div
        ref={section}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative"
        style={{ ['--wash-on' as string]: '0' }}
      >
        {/* Faint engineering grid across the whole environment. */}
        <span
          aria-hidden="true"
          className="grid-overlay pointer-events-none absolute inset-0 opacity-30"
          style={{ backgroundSize: '72px 72px' }}
        />
        {/* One soft blue wash trailing the cursor. */}
        {fine ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:hidden"
            style={{
              background:
                'radial-gradient(620px circle at var(--wash-x, 50%) var(--wash-y, 30%), rgb(var(--glow) / 0.10), transparent 70%)',
              opacity: 'var(--wash-on)',
            }}
          />
        ) : null}

        <Container wide className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-2">
            <p className="eyebrow text-accent">
              {String(departments.length).padStart(2, '0')} departments
            </p>
            <Coordinates
              lat={site.coordinates.lat}
              lon={site.coordinates.lon}
              className="hidden sm:flex"
            />
          </div>

          {/* A plain grid: nine cards, three by three, every row lined up and
              the gutters equal on both axes. The cards carry a fixed height,
              so nothing here depends on their content to stay square. */}
          <ul className="mt-10 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12 xl:grid-cols-3 xl:gap-10">
            {departments.map((dept, i) => (
              <DepartmentFlipCard key={dept.slug} dept={dept} index={i} />
            ))}
          </ul>

          <p className="eyebrow mt-10 text-fg-faint md:mt-14">
            <span className="hidden md:inline">
              Click a card to reveal what the department does
            </span>
            <span className="md:hidden">Tap a card to reveal it</span>
          </p>
        </Container>
      </div>
    </Section>
  )
}
