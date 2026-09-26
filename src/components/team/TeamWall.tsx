'use client'

import { Fragment, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Linkedin } from 'lucide-react'
import { departmentRoute } from '@/data/departments'
import { initials } from '@/data/team'
import { Open } from '@/components/team/Open'
import { clsx } from '@/lib/utils'
import type { DepartmentRef, TeamMember } from '@/lib/types'

/**
 * The portrait wall.
 *
 * An editorial composition built from a repeating rhythm, never from named
 * people. Nobody is placed in a particular cell: the layout is a function of
 * index, so it survives the team growing, shrinking or being reordered in the
 * CMS without anyone touching this file. That is the whole design constraint
 * — the roster changes every year.
 *
 * FOCUS is the interaction. Resting on somebody makes them the subject and
 * lets the rest of the wall recede; the dimming is one CSS rule using
 * `:has()` rather than thirty listeners. See `.wall` in `globals.css`.
 */

/**
 * The rhythm.
 *
 * Seven entries against three- and four-column grids, so the pattern never
 * settles into vertical stripes. Proportions vary; column spans do not —
 * varying both makes rows fail to fill at arbitrary member counts.
 *
 * The offsets are the editorial part: they stagger the baseline so the wall
 * reads as composed rather than tabulated. They only apply from `md` up,
 * where there is more than one column to stagger against.
 */
const RHYTHM = [
  { ratio: 'aspect-[4/5]', lift: 'md:mt-0' },
  { ratio: 'aspect-square', lift: 'md:mt-10' },
  { ratio: 'aspect-[3/4]', lift: 'md:mt-3' },
  { ratio: 'aspect-square', lift: 'md:mt-12' },
  { ratio: 'aspect-[4/5]', lift: 'md:mt-6' },
  { ratio: 'aspect-[3/4]', lift: 'md:mt-0' },
  { ratio: 'aspect-square', lift: 'md:mt-8' },
]

/** Entering and leaving the wall. Applied to a wrapper, never to `.wall-item`. */
const ENTER = {
  hidden: { opacity: 0, scale: 0.96 },
  shown: { opacity: 1, scale: 1 },
}

export function TeamWall({
  members,
  departments,
  breakAfter,
  breakImage,
}: {
  members: TeamMember[]
  departments: DepartmentRef[]
  /** Where the working photograph interrupts the portraits. */
  breakAfter: number
  breakImage: { src: string; alt: string }
}) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<string>('all')
  /** Touch has no hover, so a tap nominates the subject instead. */
  const [tapped, setTapped] = useState<string | null>(null)

  // Only offer a filter for a department that somebody is actually in.
  const filters = useMemo(() => {
    const counted = departments
      .map((d) => ({
        ...d,
        count: members.filter((m) => m.department === d.slug).length,
      }))
      .filter((d) => d.count > 0)
    return counted
  }, [members, departments])

  const visible = useMemo(
    () =>
      active === 'all'
        ? members
        : members.filter((m) => m.department === active),
    [members, active],
  )

  const current = filters.find((d) => d.slug === active)
  const route = current ? departmentRoute(current.slug) : null
  const showBreak = active === 'all' && visible.length > breakAfter + 2

  return (
    <div>
      {/* ── Filters. Text, not buttons in boxes — the same grammar as the
             site header. ────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Filter the team by department"
        className="-mx-[var(--gutter)] flex snap-x gap-x-7 gap-y-3 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <Filter
          label="All"
          count={members.length}
          selected={active === 'all'}
          onSelect={() => setActive('all')}
        />
        {filters.map((d) => (
          <Filter
            key={d.slug}
            label={d.abbr}
            count={d.count}
            selected={active === d.slug}
            onSelect={() => setActive(d.slug)}
          />
        ))}
      </div>

      {/* ── Department context. Secondary by design: a line, not a panel. ── */}
      <AnimatePresence mode="wait" initial={false}>
        {current ? (
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-6"
          >
            <h3 className="text-title font-medium tracking-snug">
              {current.name}
            </h3>
            {current.description ? (
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                {current.description}
              </p>
            ) : null}
            {route ? (
              <Link
                href={route}
                className="eyebrow ml-auto inline-flex items-center gap-2 text-accent transition-colors hover:text-fg"
              >
                Explore department
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── The wall ──────────────────────────────────────────────── */}
      <motion.ul
        layout={!reduced}
        className="wall mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4"
        // A tap anywhere that is not a person releases the subject.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('[data-member]')) return
          setTapped(null)
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((member, i) => {
            const rhythm = RHYTHM[i % RHYTHM.length]
            return (
              <Fragment key={member.id}>
              <motion.li
                key={member.id}
                layout={!reduced}
                data-member
                data-focus={tapped === member.id ? 'true' : undefined}
                initial={reduced ? false : 'hidden'}
                animate="shown"
                exit={reduced ? undefined : 'hidden'}
                transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                className={clsx('wall-item relative', rhythm.lift)}
                onClick={() =>
                  setTapped((id) => (id === member.id ? null : member.id))
                }
              >
                {/* The entering and leaving animation lives one level in, so
                    the inline opacity it writes cannot overrule the FOCUS
                    dimming, which is CSS on the element below it. */}
                <motion.div
                  variants={ENTER}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="wall-inner">
                    <Portrait member={member} ratio={rhythm.ratio} index={i} />
                  </div>
                </motion.div>
              </motion.li>

              {/*
                A breath in the middle of the wall: the team actually working,
                rather than another face. Only on the unfiltered view — a
                department of four does not need interrupting, and the break
                would land in a different place every time the filter changed.
              */}
              {showBreak && i === breakAfter - 1 ? (
                <motion.li
                  key="break"
                  layout={!reduced}
                  className="col-span-full my-2 md:my-6"
                >
                  <Open radius="2.5rem">
                    <figure className="relative aspect-[2/1] overflow-hidden rounded-[1.25rem] rounded-br-[3rem] md:aspect-[24/9] md:rounded-[2rem] md:rounded-br-[5rem]">
                      <Image
                        src={breakImage.src}
                        alt={breakImage.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1280px) 80vw, 100vw"
                        className="object-cover"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/80 to-transparent p-6 md:p-10">
                        <p className="text-[clamp(1.125rem,2.2vw,1.75rem)] font-semibold leading-tight tracking-snug text-chalk">
                          Building it together.
                        </p>
                      </figcaption>
                    </figure>
                  </Open>
                </motion.li>
              ) : null}
              </Fragment>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      {/* No empty state. Every filter is built from people who exist, so an
          empty list is not reachable — and if data ever did fail, the page
          falls back to the roster in `src/data` rather than saying so to a
          visitor. See `getTeam`. */}
    </div>
  )
}

function Filter({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string
  count: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={clsx(
        'nav-label group relative shrink-0 whitespace-nowrap py-2 transition-colors duration-200',
        selected ? 'text-accent' : 'text-fg/70 hover:text-accent',
      )}
    >
      {label}
      <span className="tabular ml-1.5 opacity-50">{count}</span>
      {/* The same marker the site header uses for the current page. */}
      <span
        aria-hidden="true"
        className={clsx(
          'absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-control bg-accent transition-[opacity,transform] duration-200',
          selected
            ? 'opacity-100'
            : 'scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-60',
        )}
      />
    </button>
  )
}

/**
 * One person.
 *
 * No container, no border, no card: the photograph is the object and the name
 * sits under it. Role and LinkedIn are in the markup at all times — revealed
 * with opacity, never `display: none` — so a screen reader announces
 * everything while a pointer only sees it on the person being looked at.
 */
function Portrait({
  member,
  ratio,
  index,
}: {
  member: TeamMember
  ratio: string
  index: number
}) {
  const isLead = member.rank === 'lead' || member.rank === 'board'

  return (
    <article className="group">
      <div
        className={clsx(
          'relative overflow-hidden rounded-[1.25rem] bg-ice md:rounded-[1.75rem]',
          ratio,
        )}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            fill
            // The first row is above the fold on most screens; the rest are
            // not, and there can be sixty of them.
            loading={index < 4 ? undefined : 'lazy'}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="wall-photo object-cover object-top"
          />
        ) : (
          /* A designed stand-in. We never put a stock face on a real person. */
          <div className="flex h-full w-full items-end justify-end p-3 md:p-4">
            <span
              aria-hidden="true"
              className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-none tracking-tightest text-brand/45"
            >
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5">
        <h3 className="text-[0.9375rem] font-medium leading-snug tracking-snug md:text-base">
          {member.name}
        </h3>
        <p className="mt-0.5 font-mono text-xs text-fg-faint">
          {member.departmentLabel ?? member.role}
        </p>

        <div className="wall-more mt-2">
          <p
            className={clsx(
              'font-mono text-xs uppercase tracking-[0.14em]',
              isLead ? 'text-accent' : 'text-fg-muted',
            )}
          >
            {member.role}
          </p>
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-fg-faint transition-colors hover:text-accent"
            >
              <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">{member.name} on </span>LinkedIn
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
