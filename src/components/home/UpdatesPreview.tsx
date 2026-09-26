import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { SectionIndex } from '@/components/ui/Technical'
import { categoryLabel, latestUpdates } from '@/data/updates'
import { formatDate } from '@/lib/utils'
import type { Update } from '@/lib/types'

/**
 * Latest updates, set as a front page rather than a row of cards: one lead
 * story carrying the photograph, and the next two as a ruled list beside it.
 *
 * The full index at /updates keeps the uniform grid, which is the right shape
 * for browsing. Here the point is hierarchy — one thing matters most.
 */

function Meta({ update }: { update: Update }) {
  return (
    <p className="eyebrow flex flex-wrap items-center gap-2 text-fg-faint">
      <span className="text-accent">{categoryLabel(update.category)}</span>
      <span aria-hidden="true" className="opacity-40">
        /
      </span>
      <time dateTime={update.date}>{formatDate(update.date)}</time>
    </p>
  )
}

export function UpdatesPreview() {
  const [lead, ...rest] = latestUpdates(3)
  if (!lead) return null

  return (
    <Section tone="cloud" join="soft" spacing="loose" id="updates">
      <Container wide>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionIndex index="05" label="Latest from LISAT" />
            <h2 className="mt-9 text-display-md">
              What we&rsquo;re building, right now.
            </h2>
          </div>
          <TextLink href="/updates" className="shrink-0 md:pb-3">
            View all updates
          </TextLink>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Lead story */}
          <Reveal className="lg:col-span-7">
            <Link href={`/updates/${lead.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-mist">
                <Image
                  src={lead.cover.src}
                  alt={lead.cover.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-7">
                <Meta update={lead} />
                <h3 className="mt-4 text-display-sm transition-colors group-hover:text-accent">
                  {lead.title}
                </h3>
                <p className="mt-4 max-w-xl text-lead text-fg-muted">
                  {lead.excerpt}
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Secondary entries */}
          <ul className="lg:col-span-4 lg:col-start-9">
            {rest.map((update, i) => (
              <Reveal as="li" key={update.slug} delay={0.08 + i * 0.08}>
                <Link
                  href={`/updates/${update.slug}`}
                  className="group flex flex-col gap-3 border-t border-rule py-7 transition-colors first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-7"
                >
                  <Meta update={update} />
                  <h3 className="text-title transition-colors group-hover:text-accent">
                    {update.title}
                  </h3>
                  <span className="eyebrow inline-flex items-center gap-2 text-fg-faint transition-colors group-hover:text-accent">
                    Read
                    <ArrowRight
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
