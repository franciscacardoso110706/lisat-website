import Image from 'next/image'
import { Linkedin, Mail } from 'lucide-react'
import { initials } from '@/data/team'
import { departmentAbbr, departmentName } from '@/data/departments'
import { clsx } from '@/lib/utils'
import type { TeamMember } from '@/lib/types'

/**
 * One person, as a portrait.
 *
 * The photograph is three quarters of the card and the type is a label under
 * it. That ratio is the whole design: this page is carried by faces, and a
 * card that gives equal weight to a name and a picture reads as a directory
 * row rather than a portrait.
 *
 * Used at two sizes — the full team carousel and the smaller leadership row —
 * from the same component, because a second card design for the same people
 * would be a second thing to keep in step.
 *
 * Someone without a photograph gets a monogram. We do not invent a likeness
 * for a real person, and a grey silhouette is worse than their initials.
 */
export function TeamPortrait({
  member,
  /** `sm` is the leadership row, which must not outweigh the full team. */
  size = 'md',
  /** The first few in a carousel are on screen at once; the rest can wait. */
  eager = false,
}: {
  member: TeamMember
  size?: 'sm' | 'md'
  eager?: boolean
}) {
  const board = member.department === 'board'

  // A CMS member carries its own label; a member from the repository is
  // looked up. Board members show their role instead of a department.
  const dept = board
    ? null
    : (member.departmentLabel ?? departmentAbbr(member.department))
  const deptFull = board ? null : departmentName(member.department)

  /** Only the leaders carry a title worth setting apart. */
  const leading = member.rank === 'board' || member.rank === 'lead'

  return (
    <article
      className={clsx(
        'tp group',
        size === 'sm' && 'tp--sm',
      )}
    >
      <div className="tp-frame">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            fill
            priority={eager}
            loading={eager ? undefined : 'lazy'}
            sizes={size === 'sm' ? '260px' : '320px'}
            className="tp-photo object-cover object-top"
          />
        ) : (
          <span aria-hidden="true" className="tp-monogram">
            {initials(member.name)}
          </span>
        )}

        {/*
          Only what exists. An inert icon is a promise the card cannot keep,
          and half the roster has no public address.
        */}
        {member.linkedin || member.email ? (
          <div className="tp-links">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="tp-link"
                aria-label={`${member.name} on LinkedIn`}
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="tp-link"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="tp-info">
        <h3 className="tp-name">{member.name}</h3>
        <p className="tp-meta">
          {dept ? <span title={deptFull ?? undefined}>{dept}</span> : null}
          {dept && leading ? (
            <span aria-hidden="true" className="tp-dot">
              ·
            </span>
          ) : null}
          {leading ? <span className="tp-role">{member.role}</span> : null}
          {!dept && !leading ? member.role : null}
        </p>
      </div>
    </article>
  )
}
