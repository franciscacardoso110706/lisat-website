import 'server-only'

import { fetchSanityDepartments, fetchSanityTeam } from '@/sanity/team'
import { hasSanity } from '@/sanity/env'
import { team as codeTeam } from '@/data/team'
import { departments as codeDepartments, routeSlug } from '@/data/departments'
import type { DepartmentRef, TeamMember } from '@/lib/types'

/**
 * Where the team page gets its people.
 *
 * This file is the single seam between the old data files and the CMS, and the
 * only thing that has to change as the migration moves forward.
 *
 * ---------------------------------------------------------------------------
 * THE THREE MODES
 * ---------------------------------------------------------------------------
 *
 *   'code'    Ignore Sanity entirely. The site behaves exactly as it did
 *             before the CMS existed. This is the rollback.
 *
 * In every mode, an unreachable or empty CMS falls back to `src/data/team.ts`.
 * The page does not render empty because a network call failed.
 *
 *   'merge'   Show both. Everyone in `src/data/team.ts` plus everyone
 *             published in Sanity. A person who exists in both — matched on
 *             their id — is shown once, using the Sanity version.
 *             This is the mode to validate in: publishing a test member adds
 *             them to the page without removing the 43 people already there.
 *
 *   'sanity'  Sanity only. This is the current setting: the whole team was
 *             imported on 24 September 2026 and the Studio is now the single
 *             source of truth. `src/data/team.ts` is no longer read by the
 *             website, but stays on disk as the way back if something is ever
 *             wrong with the CMS data.
 *
 * ---------------------------------------------------------------------------
 * HOW TO MOVE BETWEEN THEM
 * ---------------------------------------------------------------------------
 *
 * Change the one constant below. That is the whole procedure, and it is the
 * only code change the migration needs. Nothing else in the site reads it.
 *
 * Note that with no `NEXT_PUBLIC_SANITY_PROJECT_ID` set, every mode behaves
 * like 'code' — there is nothing to read.
 */
type TeamSource = 'code' | 'merge' | 'sanity'

const TEAM_SOURCE: TeamSource = 'sanity'

/** The departments the filter buttons are built from, in the shape they need. */
const codeDepartmentRefs: DepartmentRef[] = codeDepartments.map((d) => ({
  slug: d.slug,
  name: d.name,
  abbr: d.abbr,
  description: d.tagline,
}))

export interface TeamData {
  members: TeamMember[]
  departments: DepartmentRef[]
  /** What actually happened, for the report at the bottom of this file. */
  source: TeamSource
  sanityCount: number
}

export async function getTeam(): Promise<TeamData> {
  const local: TeamData = {
    members: codeTeam,
    departments: codeDepartmentRefs,
    source: 'code',
    sanityCount: 0,
  }

  if (!hasSanity || TEAM_SOURCE === 'code') return local

  const [sanityMembers, sanityDepartments] = await Promise.all([
    fetchSanityTeam(),
    fetchSanityDepartments(),
  ])

  /**
   * Nothing usable came back — the CMS is unreachable, mid-deploy, or simply
   * has not been populated yet. Show the people in the repository rather than
   * an empty page.
   *
   * This is the rule that matters: the team page never renders empty because
   * a network call failed. It did once, and a static build cached the result.
   */
  if (!sanityMembers?.length) {
    if (sanityMembers === null) {
      console.warn('[team] Sanity did not answer; using src/data/team.ts')
    }
    return local
  }

  const departments = sanityDepartments?.length
    ? sanityDepartments
    : codeDepartmentRefs

  if (TEAM_SOURCE === 'sanity') {
    return {
      members: sanityMembers,
      departments,
      source: 'sanity',
      sanityCount: sanityMembers.length,
    }
  }

  // --- merge -------------------------------------------------------------
  // Sanity wins on a collision, so migrating a person is a matter of
  // publishing them: their CMS record replaces the hard-coded one rather than
  // appearing beside it.
  const fromSanity = new Set(sanityMembers.map((m) => m.id))
  const members = [
    ...sanityMembers,
    ...codeTeam.filter((m) => !fromSanity.has(m.id)),
  ]

  const slugs = new Set(departments.map((d) => d.slug))
  const merged = [
    ...departments,
    ...codeDepartmentRefs.filter((d) => !slugs.has(d.slug)),
  ]

  return {
    members,
    departments: merged,
    source: 'merge',
    sanityCount: sanityMembers.length,
  }
}

const rankOrder = { board: 0, lead: 1, member: 2, advisor: 3 } as const

/**
 * Everyone in one department, from the same source as the Team page — so a
 * photograph published in the Studio appears on the department page too.
 *
 * People in Sanity carry the Studio's longer department slugs
 * ("command-and-data-handling"); `routeSlug` maps them to the page's short
 * one ("cdh"). Leaders first, then everyone else in the Studio's order.
 */
export async function membersOfDepartment(slug: string): Promise<TeamMember[]> {
  const { members } = await getTeam()
  return members
    .filter((m) => routeSlug(m.department) === slug)
    .sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank])
}

/** The four groups the team page is built from, in its existing order. */
export function groupTeam(members: TeamMember[]) {
  return {
    board: members.filter((m) => m.rank === 'board'),
    leads: members.filter((m) => m.rank === 'lead'),
    /** The filterable directory: everyone except advisors, as before. */
    directory: members.filter((m) => m.rank !== 'advisor'),
    advisors: members.filter((m) => m.rank === 'advisor'),
  }
}
