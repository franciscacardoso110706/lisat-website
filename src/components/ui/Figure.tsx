import Image from 'next/image'
import { clsx } from '@/lib/utils'

/**
 * Image with drawing-style corner ticks and an optional annotation strip —
 * the site's default way of presenting photography.
 */
export function Figure({
  src,
  alt,
  caption,
  /** Small mono label placed over the image, e.g. "FIG. 02 — CDR". */
  annotation,
  ratio = 'landscape',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className,
}: {
  src: string
  alt: string
  caption?: string
  annotation?: string
  ratio?: 'landscape' | 'portrait' | 'square' | 'wide' | 'fill'
  priority?: boolean
  sizes?: string
  className?: string
}) {
  const ratioClass = {
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
    fill: 'h-full',
  }[ratio]

  return (
    <figure className={clsx('group', className)}>
      <div
        className={clsx(
          'relative overflow-hidden rounded-media bg-surface',
          ratioClass,
          'max-w-full',
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
        {annotation ? (
          <span className="eyebrow absolute bottom-3 left-3 bg-void/80 px-2 py-1 text-chalk backdrop-blur-sm">
            {annotation}
          </span>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-xs leading-relaxed opacity-60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
