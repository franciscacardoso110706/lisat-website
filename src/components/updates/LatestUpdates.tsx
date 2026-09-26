import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { categoryLabel } from '@/data/updates'
import { formatDate } from '@/lib/utils'
import type { Update } from '@/lib/types'

/**
 * The first page of the journal: four stories, image first.
 *
 * No containers — the photograph is the object and the page shows through
 * around everything else. Whitespace does the work a card border would
 * otherwise do, which is what keeps this reading as a magazine spread rather
 * than a dashboard.
 *
 * No excerpts either: the point is that a reader can scan all four in a
 * glance and open the one they want.
 */
export function LatestUpdates({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null

  return (
    <Section tone="paper" spacing="none" id="latest" className="py-16 md:py-20">
      <Container wide>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-display-md">
            Our latest
            <br />
            updates.
          </h2>
          <p className="max-w-xs text-[0.9375rem] leading-relaxed text-fg-muted md:pb-2 md:text-right">
            Follow the latest milestones, events and stories from LISAT.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-14 md:gap-x-8 xl:grid-cols-4">
          {updates.map((update, i) => (
            <Reveal as="li" key={update.slug} delay={Math.min(i, 3) * 0.07}>
              <Link href={`/updates/${update.slug}`} className="group block">
                {/* Tall editorial frame. The photograph is the clickable
                    object; everything below it is just the caption. */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-mist">
                  <Image
                    src={update.cover.src}
                    alt={update.cover.alt}
                    fill
                    loading={i < 2 ? undefined : 'lazy'}
                    priority={i < 2}
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
                    style={
                      update.cover.position
                        ? { objectPosition: update.cover.position }
                        : undefined
                    }
                  />
                  {/* A breath of blue as the cursor lands, not a tint. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_100%,rgb(var(--glow)/0.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>

                <h3 className="mt-6 text-[1.0625rem] font-medium leading-snug tracking-snug text-fg transition-colors duration-300 group-hover:text-accent md:text-lg">
                  {update.title}
                </h3>

                <p className="eyebrow mt-3 flex flex-wrap items-center gap-2 text-fg-faint">
                  <time dateTime={update.date}>{formatDate(update.date)}</time>
                  <span aria-hidden="true" className="opacity-50">
                    ·
                  </span>
                  <span className="text-accent">
                    {categoryLabel(update.category)}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-accent opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
