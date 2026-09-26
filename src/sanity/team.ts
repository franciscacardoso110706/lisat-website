import 'server-only'

import { groq } from 'next-sanity'
import type { Image as SanityImage } from 'sanity'
import { sanityFetch } from './client'
import { memberPhotoUrl } from './image'
import type { DepartmentRef, MemberRank, TeamMember } from '@/lib/types'

/**
 * Reading the team out of Sanity, and translating it into the shapes the
 * existing components already take.
 *
 * The translation is the whole point of this file. `MemberCard`,
 * `TeamDirectory` and the team page are untouched: they keep receiving
 * `TeamMember` objects and have no idea whether a person came from
 * `src/data/team.ts` or from the content lake.
 */

/**
 * Only published, active members. Drafts and former members never leave here.
 *
 * The id falls back from "websiteId" to the document id. That is how a CMS
 * record claims the place of someone still defined in src/data/team.ts: with
 * no websiteId every member is new, and the merge in team-source.ts could only
 * ever add people, never replace them.
 */
const TEAM_QUERY = groq`
  *[_type == "teamMember" && active == true && defined(department->slug.current)]
  | order(order asc, name asc) {
    "id": coalesce(websiteId, _id),
    name,
    role,
    rank,
    degree,
    year,
    faculty,
    linkedin,
    bio,
    order,
    photo,
    "photoAlt": photo.alt,
    "departmentSlug": department->slug.current,
    "departmentName": department->name,
    "departmentAbbr": department->abbr,
    "departmentActive": department->active
  }
`

const DEPARTMENTS_QUERY = groq`
  *[_type == "department" && active == true && defined(slug.current)]
  | order(order asc, name asc) {
    "slug": slug.current,
    name,
    abbr,
    shortDescription
  }
`

interface RawMember {
  id: string
  name: string
  role: string
  rank?: string
  degree?: string
  year?: number
  faculty?: string
  linkedin?: string
  bio?: string
  order?: number
  photo?: SanityImage
  photoAlt?: string
  departmentSlug: string
  departmentName?: string
  departmentAbbr?: string
  departmentActive?: boolean
}

interface RawDepartment {
  slug: string
  name: string
  abbr?: string
  shortDescription?: string
}

const RANKS: MemberRank[] = ['board', 'lead', 'member', 'advisor']

function toRank(value: string | undefined): MemberRank {
  return RANKS.includes(value as MemberRank) ? (value as MemberRank) : 'member'
}

/**
 * The width the card requests. Cards are at most a quarter of a 1280px measure
 * and are served at 2× for retina screens, so 720px is comfortably enough
 * without shipping an 8-megapixel phone photo to a phone.
 */
const PHOTO_WIDTH = 720

function toMember(raw: RawMember): TeamMember {
  const photo = raw.photo ? memberPhotoUrl(raw.photo, PHOTO_WIDTH) : null

  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    rank: toRank(raw.rank),
    department: raw.departmentSlug,
    // Every optional field is dropped rather than passed through as an empty
    // string, because the card decides whether to render a line by asking
    // whether the value exists.
    degree: raw.degree || undefined,
    year: typeof raw.year === 'number' ? raw.year : undefined,
    faculty: raw.faculty || undefined,
    linkedin: raw.linkedin || undefined,
    photo: photo ?? undefined,
    photoAlt: raw.photoAlt || undefined,
    departmentLabel: raw.departmentAbbr || raw.departmentName || undefined,
    bio: raw.bio || undefined,
    source: 'sanity',
  }
}

/**
 * Active, published members, already in display order — or `null` if Sanity
 * could not be read, so the caller knows to use the local data instead.
 */
export async function fetchSanityTeam(): Promise<TeamMember[] | null> {
  const raw = await sanityFetch<RawMember[]>(TEAM_QUERY, {}, {
    tags: ['teamMember', 'department'],
  })
  if (!raw) return null
  // A member whose department has been deactivated would otherwise appear
  // under a filter that is no longer offered.
  return raw.filter((m) => m.departmentActive !== false).map(toMember)
}

/** Active departments, or `null` if Sanity could not be read. */
export async function fetchSanityDepartments(): Promise<DepartmentRef[] | null> {
  const raw = await sanityFetch<RawDepartment[]>(DEPARTMENTS_QUERY, {}, {
    tags: ['department'],
  })
  if (!raw) return null
  return raw.map((d) => ({
    slug: d.slug,
    name: d.name,
    // The card and the filter button both show the short form; falling back to
    // the full name is better than showing a raw slug.
    abbr: d.abbr || d.name,
    description: d.shortDescription || undefined,
  }))
}
