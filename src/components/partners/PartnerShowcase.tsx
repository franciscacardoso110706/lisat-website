import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { partnerTiers, tierBadge } from '@/data/partners'
import { clsx } from '@/lib/utils'
import type { Partner } from '@/lib/types'

/**
 * The two upper levels of the partner hierarchy.
 *
 * Nothing here knows who MEO or Oeiras are. Which partners land in which
 * component is decided by `partnerPriority` — the tier, unless the data (or
 * Sanity) says otherwise — so the layout follows the content.
 *
 * FOCUS is pure CSS: pointing at one partner lets the others recede
 * (`:has()` in `globals.css`). Browsers without `:has()` simply keep every
 * partner at full strength.
 */

/** The partner's own line where we have one; otherwise what the tier means. */
function partnerLine(partner: Partner) {
  return (
    partner.contribution ??
    partnerTiers.find((t) => t.id === partner.tier)?.description
  )
}

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/* -------------------------------------------------------------- featured */

/**
 * Large editorial placements. Deliberately not a pair of equal cards: the
 * first takes the wider column, and a partner with a photograph is laid out
 * around it while one without becomes a composition of its mark alone.
 */
export function FeaturedPartners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null
  const single = partners.length === 1

  return (
    <ul className="pf-grid">
      {partners.map((partner, i) => {
        // Wide, narrow, narrow, wide … so any count still interlocks.
        const wide = single || i % 4 === 0 || i % 4 === 3
        return (
          <Reveal
            as="li"
            key={partner.id}
            delay={i * 0.08}
            className={clsx('pf-slot', single ? 'pf-slot--full' : wide ? 'pf-slot--wide' : 'pf-slot--narrow')}
          >
            <FeaturedCard partner={partner} />
          </Reveal>
        )
      })}
    </ul>
  )
}

function FeaturedCard({ partner }: { partner: Partner }) {
  const photo = partner.featuredImage

  return (
    <article className={clsx('pf-card', photo ? 'pf-card--photo' : 'pf-card--mark')}>
      {!photo ? (
        <OrbitBackdrop
          className="-bottom-64 -right-64 -z-10 h-[640px] w-[640px]"
          opacity={0.45}
        />
      ) : null}

      <div className="pf-top">
        <p className="eyebrow pf-badge">{tierBadge[partner.tier]}</p>
      </div>

      <div className="pf-logo">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={520}
          height={240}
          className="pf-logo-img"
        />
      </div>

      {photo ? (
        <div className="pf-photo">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="pf-foot">
        <h3 className="sr-only">{partner.name}</h3>
        <p className="pf-line">{partnerLine(partner)}</p>
        {partner.url ? (
          <a
            href={partner.url}
            target="_blank"
            rel="noreferrer noopener"
            className="pf-visit group"
            aria-label={`${partner.name} website (opens in a new tab)`}
          >
            {host(partner.url)}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </div>
    </article>
  )
}

/* ----------------------------------------------------------------- major */

/**
 * The second level: a staggered row of medium tiles, each with its
 * contribution written out. More than a logo, less than a feature.
 */
export function MajorPartners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null

  return (
    <ul className="pm-grid">
      {partners.map((partner, i) => {
        const body = (
          <>
            <span className="pm-logo">
              <Image
                src={partner.logo}
                alt=""
                width={320}
                height={140}
                className="pm-logo-img"
              />
            </span>
            <span className="pm-name">{partner.name}</span>
            <span className="eyebrow pm-tier">{tierBadge[partner.tier]}</span>
            <span className="pm-line">{partnerLine(partner)}</span>
            {partner.url ? (
              <ArrowUpRight className="pm-arrow h-4 w-4" aria-hidden="true" />
            ) : null}
          </>
        )

        return (
          <Reveal as="li" key={partner.id} delay={Math.min(i, 6) * 0.05} className="pm-slot">
            {partner.url ? (
              <a
                href={partner.url}
                target="_blank"
                rel="noreferrer noopener"
                className="pm-tile"
              >
                {body}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <div className="pm-tile">{body}</div>
            )}
          </Reveal>
        )
      })}
    </ul>
  )
}
