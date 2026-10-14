import 'server-only'

import { groq } from 'next-sanity'
import type { Image as SanityImage } from 'sanity'
import { sanityFetch } from './client'
import { landscapePhotoUrl } from './image'
import { cmsSlugsFor } from '@/data/departments'

/**
 * The media a department page takes from the Studio: its cover photograph
 * and its video. Everything else on the page still comes from
 * src/data/departments.ts.
 */
const MEDIA_QUERY = groq`
  *[_type == "department" && slug.current in $slugs][0] {
    heroImage,
    "heroAlt": heroImage.alt,
    "videoFile": video.asset->url,
    "videoType": video.asset->mimeType,
    videoUrl
  }
`

interface RawMedia {
  heroImage?: SanityImage
  heroAlt?: string
  videoFile?: string
  videoType?: string
  videoUrl?: string
}

export type DepartmentVideo =
  | { kind: 'file'; src: string; type?: string }
  | { kind: 'embed'; src: string; title: string }
  | { kind: 'link'; href: string }

export interface DepartmentMedia {
  hero?: { src: string; alt: string }
  video?: DepartmentVideo
}

/**
 * A YouTube or Vimeo address as an embeddable player address, or null if
 * it is neither. YouTube is embedded from the privacy-enhanced domain.
 */
function toEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host.endsWith('youtube.com')) {
      const id =
        u.searchParams.get('v') ??
        u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.match(/(\d+)/)?.[1]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    // Not a URL at all; the Studio validates this, but be safe.
  }
  return null
}

/** The page's Studio media, or an empty object when there is none. */
export async function fetchDepartmentMedia(
  slug: string,
  name: string,
): Promise<DepartmentMedia> {
  const raw = await sanityFetch<RawMedia | null>(
    MEDIA_QUERY,
    { slugs: cmsSlugsFor(slug) },
    { tags: ['department'] },
  )
  if (!raw) return {}

  const heroSrc = raw.heroImage ? landscapePhotoUrl(raw.heroImage, 2000) : null

  let video: DepartmentVideo | undefined
  if (raw.videoFile) {
    video = { kind: 'file', src: raw.videoFile, type: raw.videoType }
  } else if (raw.videoUrl) {
    const embed = toEmbed(raw.videoUrl)
    video = embed
      ? { kind: 'embed', src: embed, title: `${name}: department video` }
      : { kind: 'link', href: raw.videoUrl }
  }

  return {
    hero: heroSrc ? { src: heroSrc, alt: raw.heroAlt || name } : undefined,
    video,
  }
}
