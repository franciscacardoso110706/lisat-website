import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image as SanityImage } from 'sanity'
import { dataset, projectId } from './env'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Builds a URL for an uploaded image.
 *
 * Team cards are a 4:5 portrait and the current design crops them to the top
 * of the frame. Asking Sanity for that crop rather than letting the browser do
 * it means the file sent down the wire is the size it will be displayed at,
 * and that an editor who drags the hotspot in the Studio actually changes what
 * the website shows.
 *
 * `fit: 'crop'` with a hotspot never squashes a face: Sanity picks the window,
 * it does not stretch the picture.
 */
export function memberPhotoUrl(
  source: SanityImage,
  width: number,
): string | null {
  if (!source?.asset) return null

  return builder
    .image(source)
    .width(width)
    .height(Math.round((width * 5) / 4))
    .fit('crop')
    // Falls back to the top of the frame when nobody has set a hotspot, which
    // matches `object-top` in the existing card.
    .crop('top')
    .auto('format')
    .quality(82)
    .url()
}

/**
 * A partner logo. Rasterised to PNG at a fixed width, so an SVG upload
 * arrives as something `next/image` will draw, and transparency survives.
 */
export function partnerLogoUrl(source: SanityImage): string | null {
  if (!source?.asset) return null
  return builder.image(source).width(640).format('png').url()
}

/** A landscape photograph, cropped around the editor's hotspot. */
export function landscapePhotoUrl(
  source: SanityImage,
  width: number,
): string | null {
  if (!source?.asset) return null
  return builder
    .image(source)
    .width(width)
    .height(Math.round((width * 2) / 3))
    .fit('crop')
    .auto('format')
    .quality(80)
    .url()
}
