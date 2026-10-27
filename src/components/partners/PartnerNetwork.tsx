'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { partnerPriority, tierBadge } from '@/data/partners'
import { clsx } from '@/lib/utils'
import type { Partner } from '@/lib/types'

/**
 * Every organisation behind LISAT on one open field.
 *
 * Not a grid and not a constellation: a centred flow of marks with generous
 * space around them, sized by priority, and on wide screens nudged up and
 * down a little so the rows do not read as a table. Nothing connects them;
 * the composition is the network.
 *
 * FOCUS: pointing at (or tabbing to, or tapping) a mark brings it to full
 * colour while the rest recede, and its name, its level and its site appear
 * in the caption above the field. Nothing opens over the page.
 *
 * Logos arrive on white mattes and are multiplied into the page. That only
 * works while no ancestor isolates them, so the fading and scaling are on
 * the images themselves, never on the buttons or the list.
 */

/** Written out in full: Tailwind drops class names it cannot see whole. */
const sizeClass = {
  featured: 'nw-item--featured',
  major: 'nw-item--major',
  standard: 'nw-item--standard',
} as const

/** A small, fixed vertical rhythm for the field, in pixels. */
const drift = [0, 14, -10, 6, -14, 10, -4, 12, -8, 4]

export function PartnerNetwork({ partners }: { partners: Partner[] }) {
  const [active, setActive] = useState<string | null>(null)
  const current = partners.find((p) => p.id === active) ?? null

  return (
    <div className="nw" onPointerLeave={() => setActive(null)}>
      {/* The caption: the selected partner, set into the layout itself. */}
      <div className="nw-caption" aria-live="polite">
        {current ? (
          <div key={current.id} className="nw-caption-inner">
            <p className="nw-caption-name">{current.name}</p>
            <p className="nw-caption-line">
              <span className="eyebrow text-fg-faint">{tierBadge[current.tier]}</span>
              {current.url ? (
                <a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="nw-caption-link"
                >
                  {current.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </p>
          </div>
        ) : (
          <p className="nw-caption-hint">
            <span className="hidden md:inline">Point at a partner.</span>
            <span className="md:hidden">Tap a partner.</span>
          </p>
        )}
      </div>

      <ul className="nw-field" data-active={active ? '' : undefined}>
        {partners.map((p, i) => {
          const on = p.id === active
          return (
            <li
              key={p.id}
              className={clsx('nw-item', sizeClass[partnerPriority(p)])}
              style={
                {
                  '--dy': `${drift[i % drift.length]}px`,
                  '--logo-scale': p.logoScale ?? 1,
                } as React.CSSProperties
              }
              data-on={on ? '' : undefined}
            >
              <button
                type="button"
                className="nw-mark"
                aria-pressed={on}
                aria-label={p.name}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setActive(p.id)
                }}
                onFocus={() => setActive(p.id)}
                onClick={() => setActive(on ? null : p.id)}
              >
                <Image
                  src={p.logo}
                  alt=""
                  width={320}
                  height={150}
                  className="nw-logo"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
