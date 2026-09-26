import Image from 'next/image'
import { clsx } from '@/lib/utils'
import type { Partner } from '@/lib/types'

/**
 * Partner logos come from many sources — some with transparency, some with a
 * white matte baked in. They are always placed on a pure white tile so every
 * logo reads the same way, whatever the surrounding section.
 */
export function PartnerLogo({
  partner,
  className,
  size = 'md',
}: {
  partner: Partner
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const box = {
    sm: 'h-20 p-4',
    md: 'h-28 p-5',
    lg: 'h-36 p-7',
  }[size]

  const content = (
    <span
      className={clsx(
        'flex w-full items-center justify-center rounded-media bg-paper transition-colors duration-200',
        box,
      )}
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={260}
        height={120}
        className="max-h-full w-auto max-w-[80%] object-contain"
      />
    </span>
  )

  if (!partner.url) {
    return <div className={clsx('block', className)}>{content}</div>
  }

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'block outline-offset-4 transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
      aria-label={`${partner.name} (opens in a new tab)`}
    >
      {content}
    </a>
  )
}
