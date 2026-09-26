import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { clsx } from '@/lib/utils'
import type { UpdateImage } from '@/lib/types'

/**
 * Image grid used by the mission page and update articles. The first image
 * spans two columns so the grid does not read as a uniform block of thumbnails.
 */
export function Gallery({
  images,
  className,
  emphasiseFirst = true,
}: {
  images: UpdateImage[]
  className?: string
  emphasiseFirst?: boolean
}) {
  if (images.length === 0) return null

  return (
    <ul className={clsx('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {images.map((image, i) => {
        const wide = emphasiseFirst && i === 0 && images.length > 2

        return (
          <Reveal
            as="li"
            key={image.src}
            delay={Math.min(i, 5) * 0.05}
            className={clsx(wide && 'sm:col-span-2 lg:col-span-2')}
          >
            <div
              className={clsx(
                'relative overflow-hidden rounded-media bg-surface',
                wide ? 'aspect-[16/9]' : 'aspect-[4/3]',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes={
                  wide
                    ? '(min-width: 1024px) 66vw, 100vw'
                    : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                }
                className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.03]"
              />
            </div>
          </Reveal>
        )
      })}
    </ul>
  )
}
