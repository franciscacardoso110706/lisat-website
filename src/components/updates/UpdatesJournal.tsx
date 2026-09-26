'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { categoryLabel } from '@/data/updates'
import { formatDate } from '@/lib/utils'
import { clsx } from '@/lib/utils'
import type { Update, UpdateCategory } from '@/lib/types'

/**
 * The mission journal.
 *
 * Tone-agnostic: every colour here resolves through the section's tone, so the
 * same grid reads correctly on the light archive and would still work if a
 * page put it on a dark surface.
 *
 * An asymmetric editorial grid rather than a row of equal cards: the newest
 * post takes a wide split-panel at the top, and the rest run through a
 * repeating rhythm of column spans and image proportions so no two rows read
 * the same. The rhythm is deterministic, so the layout is stable between
 * renders and identical on the server.
 *
 * Filtering narrows the list in place. When a category is selected the feature
 * panel steps aside — promoting one post out of four would be editorialising a
 * filter, not reporting it.
 */

/**
 * Column span and image proportion per position, repeating.
 *
 * Wide tiles get landscape photography, narrow ones get something closer to
 * square, which is what keeps the grid from settling into a uniform beat.
 */
const RHYTHM: { span: string; aspect: string }[] = [
  { span: 'xl:col-span-5', aspect: 'aspect-[16/10]' },
  { span: 'xl:col-span-7', aspect: 'aspect-[2/1]' },
  { span: 'xl:col-span-4', aspect: 'aspect-[4/3]' },
  { span: 'xl:col-span-4', aspect: 'aspect-[4/3]' },
  { span: 'xl:col-span-4', aspect: 'aspect-[4/3]' },
  { span: 'xl:col-span-7', aspect: 'aspect-[2/1]' },
  { span: 'xl:col-span-5', aspect: 'aspect-[16/10]' },
]

const PAGE = 8

function Meta({ update, className }: { update: Update; className?: string }) {
  return (
    <p className={clsx('eyebrow flex flex-wrap items-center gap-2.5', className)}>
      <span className="text-accent">{categoryLabel(update.category)}</span>
      <span aria-hidden="true" className="text-fg-faint opacity-50">
        /
      </span>
      <time dateTime={update.date} className="text-fg-faint">
        {formatDate(update.date)}
      </time>
    </p>
  )
}

/** The circular arrow used on every tile, so the affordance is consistent. */
function ArrowPip({ large = false }: { large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-control border border-accent/40 text-accent transition-[transform,background-color,border-color,color] duration-300 group-hover:border-accent group-hover:bg-accent-solid group-hover:text-accent-fg',
        large ? 'h-12 w-12' : 'h-10 w-10',
      )}
    >
      <ArrowRight
        className={clsx(
          'transition-transform duration-300 group-hover:translate-x-0.5',
          large ? 'h-5 w-5' : 'h-4 w-4',
        )}
      />
    </span>
  )
}

function FeaturePanel({ update }: { update: Update }) {
  return (
    <Reveal className="xl:col-span-12">
      <Link
        href={`/updates/${update.slug}`}
        className="group relative grid overflow-hidden rounded-panel border border-rule bg-surface-raised transition-[transform,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-accent/35 lg:grid-cols-12"
      >
        {/* Light gathering behind the panel, brightening on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-panel bg-[radial-gradient(120%_100%_at_0%_0%,rgb(var(--glow)/0.14),transparent_60%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative lg:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden rounded-panel lg:h-full lg:rounded-none">
            <Image
              src={update.cover.src}
              alt={update.cover.alt}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-6 p-8 md:p-12 lg:col-span-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow rounded-control bg-accent-solid px-3.5 py-2 text-accent-fg">
              Featured
            </span>
            <Meta update={update} />
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.02] tracking-tightest text-fg transition-colors duration-300 group-hover:text-accent">
            {update.title}
          </h2>

          <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
            {update.excerpt}
          </p>

          <span className="eyebrow inline-flex items-center gap-4 text-fg">
            Read more
            <ArrowPip large />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

function Tile({ update, index }: { update: Update; index: number }) {
  const { span, aspect } = RHYTHM[index % RHYTHM.length]
  return (
    <Reveal
      className={clsx('md:col-span-6', span)}
      delay={Math.min(index % 3, 2) * 0.07}
    >
      <Link
        href={`/updates/${update.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-rule bg-surface-raised transition-[transform,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-accent/35"
      >
        <div className={clsx('relative overflow-hidden', aspect)}>
          <Image
            src={update.cover.src}
            alt={update.cover.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
          <Meta update={update} />

          <h3 className="text-title font-medium text-fg transition-colors duration-300 group-hover:text-accent">
            {update.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {update.excerpt}
          </p>

          <span className="mt-auto pt-2">
            <ArrowPip />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

export function UpdatesJournal({
  updates,
  categories,
}: {
  updates: Update[]
  categories: { id: UpdateCategory; label: string }[]
}) {
  const [active, setActive] = useState<UpdateCategory | 'all'>('all')
  const [shown, setShown] = useState(PAGE)

  const filters = useMemo(
    () => [
      { id: 'all' as const, label: 'All', count: updates.length },
      ...categories.map((c) => ({
        id: c.id,
        label: c.label,
        count: updates.filter((u) => u.category === c.id).length,
      })),
    ],
    [updates, categories],
  )

  const visible = useMemo(
    () => (active === 'all' ? updates : updates.filter((u) => u.category === active)),
    [updates, active],
  )

  // Only lead with a feature on the unfiltered list, where "newest" is the
  // whole journal rather than the newest of four.
  const featured = active === 'all' && visible.length > 4
  const feature = featured ? visible[0] : null
  const rest = featured ? visible.slice(1) : visible
  const page = rest.slice(0, shown)
  const more = rest.length - page.length

  const choose = (id: UpdateCategory | 'all') => {
    setActive(id)
    setShown(PAGE)
  }

  return (
    <div>
      {/* Filters */}
      <div
        role="tablist"
        aria-label="Filter updates by category"
        className="flex flex-wrap gap-2.5"
      >
        {filters.map((filter) => {
          const selected = active === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => choose(filter.id)}
              className={clsx(
                'eyebrow inline-flex items-center gap-2 rounded-control border px-4 py-2.5 transition-[background-color,border-color,color,box-shadow] duration-300',
                selected
                  ? 'border-accent bg-accent-solid text-accent-fg'
                  : 'border-rule-strong text-fg-muted hover:border-accent/50 hover:text-fg',
              )}
              style={
                selected
                  ? { boxShadow: '0 6px 22px -8px rgb(var(--glow) / 0.7)' }
                  : undefined
              }
            >
              {filter.label}
              <span className="tabular opacity-60">{filter.count}</span>
            </button>
          )
        })}
      </div>

      {/* Editorial grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-12 md:gap-7">
        {feature ? <FeaturePanel update={feature} /> : null}
        {page.map((update, i) => (
          <Tile key={update.slug} update={update} index={i} />
        ))}
      </div>

      {more > 0 ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="eyebrow group inline-flex items-center gap-3 rounded-control border border-rule-strong px-7 py-4 text-fg transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            Load more updates
            <ArrowDown
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
            <span className="tabular opacity-60">{more}</span>
          </button>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-12 text-fg-muted">Nothing filed under that yet.</p>
      ) : null}
    </div>
  )
}
