import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Gallery } from '@/components/ui/Gallery'
import { CtaBand } from '@/components/ui/CtaBand'
import { UpdateCard } from '@/components/updates/UpdateCard'
import {
  categoryLabel,
  getUpdate,
  relatedUpdates,
  updates,
} from '@/data/updates'
import { site } from '@/data/site'
import { formatDate, readingTime } from '@/lib/utils'

export function generateStaticParams() {
  return updates.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const update = getUpdate(slug)
  if (!update) return {}

  return {
    title: update.title,
    description: update.excerpt,
    alternates: { canonical: `/updates/${update.slug}` },
    openGraph: {
      type: 'article',
      title: update.title,
      description: update.excerpt,
      url: `/updates/${update.slug}`,
      publishedTime: update.date,
      images: [{ url: update.cover.src, alt: update.cover.alt }],
    },
  }
}

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const update = getUpdate(slug)
  if (!update) notFound()

  const minutes = update.readingMinutes ?? readingTime(update.body)
  const related = relatedUpdates(update.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: update.title,
    description: update.excerpt,
    datePublished: update.date,
    image: [new URL(update.cover.src, site.url).toString()],
    author: { '@type': 'Organization', name: site.fullName },
    publisher: { '@type': 'Organization', name: site.fullName },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Header */}
        <header className="tone-void pt-[var(--nav-height)]">
          <Container className="py-14 md:py-20">
            <Link
              href="/updates"
              className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All updates
            </Link>

            <p className="eyebrow mt-10 flex flex-wrap items-center gap-2.5 text-fg-faint">
              <span className="text-accent">{categoryLabel(update.category)}</span>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <time dateTime={update.date}>{formatDate(update.date)}</time>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <span>{minutes} min read</span>
            </p>

            <h1 className="mt-5 text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.02] tracking-tightest">
              {update.title}
            </h1>

            {update.lead ? (
              <p className="mt-7 max-w-prose text-lg leading-relaxed text-fg-muted md:text-xl">
                {update.lead}
              </p>
            ) : null}
          </Container>
        </header>

        {/* Cover */}
        <div className="tone-void">
          <Container>
            <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-surface">
              <Image
                src={update.cover.src}
                alt={update.cover.alt}
                fill
                priority
                sizes="(min-width: 1120px) 1120px, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        </div>

        {/* Body */}
        <Section tone="paper" spacing="default">
          <Container>
            <div className="prose-lisat mx-auto max-w-prose">
              {update.body.map((paragraph, i) => {
                // Lines the team wrote as pull quotes or attributions.
                const isQuote = paragraph.startsWith('“')
                const isAttribution = paragraph.startsWith('—')

                if (isQuote) {
                  return (
                    <blockquote
                      key={i}
                      className="my-10 border-l-2 border-accent pl-6"
                    >
                      <p className="!text-xl !leading-relaxed !text-fg md:!text-2xl">
                        {paragraph}
                      </p>
                    </blockquote>
                  )
                }

                if (isAttribution) {
                  return (
                    <p
                      key={i}
                      className="!mt-3 font-mono !text-sm !text-fg-faint"
                    >
                      {paragraph}
                    </p>
                  )
                }

                return <p key={i}>{paragraph}</p>
              })}
            </div>
          </Container>
        </Section>

        {/* Gallery */}
        {update.gallery && update.gallery.length > 0 ? (
          <Section tone="paper" spacing="none" className="pb-20 md:pb-28">
            <Container wide>
              <h2 className="eyebrow text-fg-faint">Gallery</h2>
              <Gallery images={update.gallery} className="mt-6" />
            </Container>
          </Section>
        ) : null}
      </article>

      {/* Related */}
      {related.length > 0 ? (
        <Section tone="cloud" join="soft" spacing="loose">
          <Container wide>
            <h2 className="eyebrow text-fg-faint">More updates</h2>
            <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <UpdateCard update={item} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        eyebrow="LISAT"
        title="We are building Lisbon's next satellite."
        body="Follow the mission, join the team, or back the project as a partner."
        primary={{ label: 'About LISAT-01', href: '/mission/lisat-01' }}
        secondary={{ label: 'Join us', href: '/join-us' }}
      />
    </>
  )
}
