import Image from 'next/image'
import { Linkedin, Mail } from 'lucide-react'
import { initials } from '@/data/team'
import { departmentAbbr } from '@/data/departments'
import { clsx } from '@/lib/utils'
import type { TeamMember } from '@/lib/types'

/**
 * Person card, used on the Team page, department pages and the board strip.
 *
 * Members without a photograph get a typographic monogram rather than a stock
 * image — we never invent a likeness for a real person.
 *
 * `member.photo` is either a path under /public/images/team or a Sanity CDN
 * URL, depending on where the person is managed. The card does not care: it is
 * handed a finished `TeamMember` either way. See `src/lib/team-source.ts`.
 */
export function MemberCard({
  member,
  /** `feature` is used for the board, where portraits are larger. */
  variant = 'default',
  showDepartment = true,
}: {
  member: TeamMember
  variant?: 'default' | 'feature'
  showDepartment?: boolean
}) {
  const isFeature = variant === 'feature'
  // A CMS member brings its own label; a code member is looked up.
  const dept =
    member.department === 'board'
      ? null
      : (member.departmentLabel ?? departmentAbbr(member.department))

  const meta = [
    member.degree,
    member.year ? `Year ${member.year}` : undefined,
    member.faculty,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-media">
        {member.photo ? (
          <Image
            src={member.photo}
            // CMS photographs carry their own description; local ones do not.
            alt={member.photoAlt ?? member.name}
            fill
            loading="lazy"
            sizes={
              isFeature
                ? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                : '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
            }
            className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* Monogram — a designed stand-in, not a missing image. */
          <div className="flex h-full w-full flex-col justify-between bg-ice p-3 transition-colors duration-300 group-hover:bg-mist">
            <span
              className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-faint"
              aria-hidden="true"
            >
              {dept ?? 'LISAT'}
            </span>
            <span
              className="self-end text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-none tracking-tightest text-brand/35"
              aria-hidden="true"
            >
              {initials(member.name)}
            </span>
          </div>
        )}

        {member.rank === 'lead' || member.rank === 'board' ? (
          <span className="eyebrow absolute left-0 top-0 bg-accent-solid px-2 py-1 text-accent-fg">
            {member.rank === 'board' ? 'Board' : 'Lead'}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3
          className={clsx(
            'font-medium tracking-snug',
            isFeature ? 'text-xl md:text-2xl' : 'text-[1.0625rem]',
          )}
        >
          {member.name}
        </h3>
        <p className="mt-1 text-[0.9375rem] text-accent">{member.role}</p>

        {meta ? (
          <p className="mt-1.5 font-mono text-xs leading-relaxed text-fg-faint">
            {meta}
          </p>
        ) : null}

        {showDepartment && dept ? (
          <p className="mt-1 font-mono text-xs text-fg-faint">{dept}</p>
        ) : null}

        {member.linkedin || member.email ? (
          <div className="mt-3 flex items-center gap-3">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="text-fg-faint transition-colors hover:text-accent"
              >
                <span className="sr-only">{member.name} on LinkedIn</span>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="text-fg-faint transition-colors hover:text-accent"
              >
                <span className="sr-only">Email {member.name}</span>
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
