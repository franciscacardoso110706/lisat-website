import 'server-only'

import { fetchSanityPartners, type PartnerPatch } from '@/sanity/partners'
import { hasSanity } from '@/sanity/env'
import { partners as codePartners, sortPartners } from '@/data/partners'
import type { Partner } from '@/lib/types'

/**
 * Where the Partners page gets its partners.
 *
 * The same seam as `team-source.ts`, with one difference: partners are
 * merged *field by field*. A Sanity document whose key matches a partner in
 * `src/data/partners.ts` only overrides what it sets, so changing how
 * prominent a partner is — or its description, or its photograph — is a
 * matter of publishing a document with that one field filled in.
 *
 *   'code'    Ignore Sanity. The rollback.
 *   'merge'   The code's partners, patched and extended by Sanity. Current.
 *   'sanity'  Sanity only. Switch to this once every partner has been
 *             published in the Studio with a logo.
 *
 * With no `NEXT_PUBLIC_SANITY_PROJECT_ID`, or when Sanity does not answer,
 * every mode falls back to the code. The page never renders empty because a
 * network call failed.
 */
type PartnerSource = 'code' | 'merge' | 'sanity'

const PARTNER_SOURCE: PartnerSource = 'merge'

/** A document that adds a partner, rather than patching one, needs these. */
function complete<T extends Partial<Partner> & { id: string }>(
  p: T,
): p is T & Partner {
  return Boolean(p.name && p.tier && p.logo)
}

function applyPatch(base: Partner | undefined, patch: PartnerPatch) {
  const merged: Partial<Partner> & { id: string } = { ...base, id: patch.id }
  // Only fields the editor actually set replace the code's values.
  for (const key of [
    'name',
    'tier',
    'priority',
    'order',
    'url',
    'contribution',
    'story',
    'logo',
    'featuredImage',
  ] as const) {
    if (patch[key] !== undefined) {
      ;(merged as Record<string, unknown>)[key] = patch[key]
    }
  }
  return merged
}

export async function getPartners(): Promise<Partner[]> {
  const local = sortPartners(codePartners)
  if (!hasSanity || PARTNER_SOURCE === 'code') return local

  const patches = await fetchSanityPartners()
  if (!patches?.length) {
    if (patches === null) {
      console.warn('[partners] Sanity did not answer; using src/data/partners.ts')
    }
    return local
  }

  if (PARTNER_SOURCE === 'sanity') {
    return sortPartners(
      patches
        .filter((p) => p.active)
        .map((p) => ({ ...applyPatch(undefined, p), source: 'sanity' as const }))
        .filter(complete),
    )
  }

  // --- merge -------------------------------------------------------------
  const byId = new Map(patches.map((p) => [p.id, p]))
  const merged: Partner[] = []

  for (const base of codePartners) {
    const patch = byId.get(base.id)
    if (!patch) {
      merged.push(base)
      continue
    }
    if (!patch.active) continue
    const next = applyPatch(base, patch)
    if (complete(next)) merged.push({ ...next, source: 'sanity' })
  }

  const known = new Set(codePartners.map((p) => p.id))
  for (const patch of patches) {
    if (known.has(patch.id) || !patch.active) continue
    const next = applyPatch(undefined, patch)
    if (complete(next)) merged.push({ ...next, source: 'sanity' })
  }

  return sortPartners(merged)
}
