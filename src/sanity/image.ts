import imageUrlBuilder from '@sanity/image-url'
import type { Image as SanityImage } from 'sanity'
import { dataset, projectId } from './env'

const builder = imageUrlBuilder({ projectId, dataset })

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
