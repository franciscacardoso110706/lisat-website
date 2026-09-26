import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { CtaBand } from '@/components/ui/CtaBand'
import { UpdateCard } from '@/components/updates/UpdateCard'
import { ArticleGallery } from '@/components/updates/ArticleGallery'
import { ArticleShare } from '@/components/updates/ArticleShare'
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

  /** The cover leads; the gallery follows. One sequence, not two blocks. */
  const photographs = [update.cover, ...(update.gallery ?? [])]
  const url = new URL(`/updates/${update.slug}`, site.url).toString()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="ar">
        <Section tone="paper" spacing="none" className="pt-[calc(var(--nav-height)+2.5rem)]">
          <Container>
            <Link href="/updates" className="ar-back">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to updates
            </Link>

            <h1 className="ar-title mt-8">{update.title}</h1>

            {update.lead ? <p className="ar-lead mt-6">{update.lead}</p> : null}

            {/*
              Ruled above and below: the byline is the seam between the
              headline and the article, and a line either side is what a
              printed page would use to say so.
            */}
            <div className="ar-byline mt-9">
              <p className="ar-meta">
                <span>
                  By <strong>{site.name} Team</strong>
                </span>
                <span aria-hidden="true" className="ar-sep" />
                <time dateTime={update.date}>{formatDate(update.date)}</time>
                <span aria-hidden="true" className="ar-sep" />
                <span>{minutes} min read</span>
                <span aria-hidden="true" className="ar-sep" />
                <span className="text-accent">{categoryLabel(update.category)}</span>
              </p>

              <ArticleShare url={url} title={update.title} />
            </div>
          </Container>
        </Section>

        {/* The photographs */}
        <Section tone="paper" spacing="none" className="pt-10 md:pt-12">
          <Container>
            <ArticleGallery images={photographs} />
          </Container>
        </Section>

        {/* The article */}
        <Section tone="paper" spacing="none" className="py-14 md:py-20">
          <Container>
            <div className="ar-body">
              {update.body.map((paragraph, i) => {
                // Lines the team wrote as pull quotes or attributions.
                if (paragraph.startsWith('“')) {
                  return (
                    <blockquote key={i} className="ar-quote">
                      <p>{paragraph}</p>
                    </blockquote>
                  )
                }

                if (paragraph.startsWith('—')) {
                  return (
                    <p key={i} className="ar-attribution">
                      {paragraph}
                    </p>
                  )
                }

                return <p key={i}>{paragraph}</p>
              })}
            </div>
          </Container>
        </Section>
      </article>

      {/* Related */}
      {related.length > 0 ? (
        <Section tone="cloud" join="soft" spacing="default">
          <Container wide>
            <h2 className="ar-related-title">Related articles</h2>
            <ul className="mt-9 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <UpdateCard update={item} showExcerpt={false} />
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
