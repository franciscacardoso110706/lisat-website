import Image from 'next/image'
import Link from 'next/link'
import { categoryLabel } from '@/data/updates'
import { formatDate, clsx } from '@/lib/utils'
import type { Update } from '@/lib/types'

/**
 * Update entry — image first, then a mono meta line and the headline.
 * Deliberately chrome-free: no border, no card, no shadow.
 */
export function UpdateCard({
  update,
  priority = false,
  /** `feature` gives the lead item on the index page more presence. */
  variant = 'default',
  showExcerpt = true,
}: {
  update: Update
  priority?: boolean
  variant?: 'default' | 'feature'
  showExcerpt?: boolean
}) {
  const isFeature = variant === 'feature'

  return (
    <article className="group h-full">
      <Link href={`/updates/${update.slug}`} className="flex h-full flex-col">
        <div
          className={clsx(
            'relative overflow-hidden rounded-media bg-mist',
            isFeature ? 'aspect-[16/9]' : 'aspect-[3/2]',
          )}
        >
          <Image
            src={update.cover.src}
            alt={update.cover.alt}
            fill
            priority={priority}
            sizes={
              isFeature
                ? '(min-width: 1024px) 66vw, 100vw'
                : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            }
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="eyebrow flex items-center gap-2.5 text-fg-faint">
            <span className="text-accent">{categoryLabel(update.category)}</span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <time dateTime={update.date}>{formatDate(update.date)}</time>
          </p>

          <h3
            className={clsx(
              'news-title mt-3 leading-snug tracking-snug transition-colors group-hover:text-accent',
              isFeature
                ? 'text-2xl md:text-[2rem]'
                : 'text-xl md:text-[1.375rem]',
            )}
          >
            {update.title}
          </h3>

          {showExcerpt ? (
            <p
              className={clsx(
                'mt-3 leading-relaxed text-fg-muted',
                isFeature
                  ? 'text-[1.0625rem] md:text-lg'
                  : 'line-clamp-3 text-[0.9375rem]',
              )}
            >
              {update.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
