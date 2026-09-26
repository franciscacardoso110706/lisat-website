'use client'

import { useMemo, useState } from 'react'
import { MemberCard } from '@/components/team/MemberCard'
import { clsx } from '@/lib/utils'
import type { DepartmentRef, TeamMember } from '@/lib/types'

/**
 * Filterable member directory. Filtering happens client-side over a list that
 * is already in the HTML, so the full roster is visible without JavaScript and
 * to search engines.
 */
export function TeamDirectory({
  members,
  departments,
}: {
  members: TeamMember[]
  /** Only `slug` and `abbr` are read, so CMS departments fit here too. */
  departments: DepartmentRef[]
}) {
  const [active, setActive] = useState<string>('all')

  // Only offer filters for departments that actually have people.
  const filters = useMemo(() => {
    const available = departments.filter((d) =>
      members.some((m) => m.department === d.slug),
    )
    return [
      { id: 'all', label: 'All', count: members.length },
      ...available.map((d) => ({
        id: d.slug,
        label: d.abbr,
        count: members.filter((m) => m.department === d.slug).length,
      })),
    ]
  }, [members, departments])

  const visible = useMemo(
    () =>
      active === 'all'
        ? members
        : members.filter((m) => m.department === active),
    [members, active],
  )

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter members by department"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const selected = active === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(filter.id)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-control border px-4 py-2 font-display text-sm font-medium transition-colors',
                selected
                  // Navy on the accent blue only reached 3.0:1. The tone's own
                  // pairing for text on an accent surface is what belongs here.
                  ? 'border-accent bg-accent-solid text-accent-fg'
                  : 'border-rule-strong text-fg-muted hover:border-fg-muted hover:text-fg',
              )}
            >
              {filter.label}
              <span
                className={clsx(
                  'tabular font-mono text-xs',
                  selected ? 'text-accent-fg' : 'text-fg-faint',
                )}
              >
                {filter.count}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-6 font-mono text-xs text-fg-faint" aria-live="polite">
        Showing {visible.length} of {members.length} members
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {visible.map((member) => (
          <li key={member.id}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-fg-muted">
          No members listed in this department yet.
        </p>
      ) : null}
    </div>
  )
}
