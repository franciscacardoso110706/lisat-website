import 'server-only'

import { groq } from 'next-sanity'
import type { Image as SanityImage } from 'sanity'
import { sanityFetch } from './client'
import { landscapePhotoUrl, partnerLogoUrl } from './image'
import type { PartnerPriority, PartnerTier } from '@/lib/types'

/**
 * Reading partners out of Sanity.
 *
 * Unlike the team, a partner document is usually a *patch* on a partner that
 * already exists in `src/data/partners.ts` — so every field comes back
 * optional, and the merge in `src/lib/partner-source.ts` decides what wins.
 * Inactive documents are fetched too: turning one off is how an editor hides
 * a partner that is defined in the code.
 */
const PARTNERS_QUERY = groq`
  *[_type == "partner" && defined(key.current)] {
    "id": key.current,
    name,
    tier,
    priority,
    order,
    website,
    description,
    logo,
    featuredImage,
    "featuredImageAlt": featuredImage.alt,
    active
  }
`

interface RawPartner {
  id: string
  name?: string
  tier?: string
  priority?: string
  order?: number
  website?: string
  description?: string
  logo?: SanityImage
  featuredImage?: SanityImage
  featuredImageAlt?: string
  active?: boolean
}

/** What a CMS document contributes. Absent fields are left to the code. */
export interface PartnerPatch {
  id: string
  active: boolean
  name?: string
  tier?: PartnerTier
  priority?: PartnerPriority
  order?: number
  url?: string
  contribution?: string
  logo?: string
  featuredImage?: { src: string; alt: string }
}

const TIERS: PartnerTier[] = [
  'main',
  'gold',
  'silver',
  'bronze',
  'technical',
  'institutional',
  'supporter',
]
const PRIORITIES: PartnerPriority[] = ['featured', 'major', 'standard']

function toPatch(raw: RawPartner): PartnerPatch {
  const logo = raw.logo ? partnerLogoUrl(raw.logo) : null
  const photo = raw.featuredImage ? landscapePhotoUrl(raw.featuredImage, 1600) : null

  return {
    id: raw.id,
    active: raw.active !== false,
    name: raw.name || undefined,
    tier: TIERS.includes(raw.tier as PartnerTier)
      ? (raw.tier as PartnerTier)
      : undefined,
    // "auto" and anything unrecognised mean: follow the tier.
    priority: PRIORITIES.includes(raw.priority as PartnerPriority)
      ? (raw.priority as PartnerPriority)
      : undefined,
    order: typeof raw.order === 'number' ? raw.order : undefined,
    url: raw.website || undefined,
    contribution: raw.description || undefined,
    logo: logo ?? undefined,
    featuredImage: photo
      ? { src: photo, alt: raw.featuredImageAlt || raw.name || '' }
      : undefined,
  }
}

/** Every partner document, or `null` if Sanity could not be read. */
export async function fetchSanityPartners(): Promise<PartnerPatch[] | null> {
  const raw = await sanityFetch<RawPartner[]>(PARTNERS_QUERY, {}, {
    tags: ['partner'],
  })
  if (!raw) return null
  return raw.map(toPatch)
}
