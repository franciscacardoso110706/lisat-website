import type { Metadata } from 'next'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { RevealLines } from '@/components/ui/RevealLines'
import { ButtonLink } from '@/components/ui/Button'
import { PartnerMarquee } from '@/components/partners/PartnerMarquee'
import {
  FeaturedPartners,
  MajorPartners,
} from '@/components/partners/PartnerShowcase'
import { partnerPriority, partnerTiers } from '@/data/partners'
import { getPartners } from '@/lib/partner-source'
import { contact } from '@/data/site'
import { mission } from '@/data/mission'

export async function generateMetadata(): Promise<Metadata> {
  const partners = await getPartners()
  return {
    title: 'Partners',
    description: `${partners.length} companies, laboratories and institutions support LISAT with hardware, software, expertise and funding for ${mission.name}.`,
    alternates: { canonical: '/partners' },
  }
}

/** Published edits in the Studio appear within a minute, as on the Team page. */
export const revalidate = 60

/**
 * Partners.
 *
 * An ecosystem with a centre. The organisations closest to the mission get
 * room of their own, the next ring gets a tile with its contribution written
 * out, and everyone else moves past in the stream — so how much of the page a
 * partner occupies says how much of the mission it carries.
 *
 * Who goes where is data, not layout: `partnerPriority` reads each partner's
 * official tier, unless the partner (in `src/data/partners.ts` or in Sanity
 * Studio) says otherwise.
 */
export default async function PartnersPage() {
  const partners = await getPartners()

  const featured = partners.filter((p) => partnerPriority(p) === 'featured')
  const major = partners.filter((p) => partnerPriority(p) === 'major')
  const standard = partners.filter((p) => partnerPriority(p) === 'standard')

  return (
    <>
      {/* ── Intro and the featured partners, on one surface ──────────── */}
      <Section tone="paper" spacing="none" className="pb-20 pt-[var(--nav-height)] md:pb-28">
        <Container wide>
          <div className="grid items-end gap-10 pb-14 pt-16 md:pb-20 md:pt-24 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionIndex index="05" label="Partners" />
              <RevealLines
                as="h1"
                className="mt-9 text-display-lg"
                lines={[
                  'A mission',
                  { text: 'built together.', className: 'text-brand' },
                ]}
              />
            </div>

            <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
              <p className="text-lead text-fg-muted">
                The companies, institutions and laboratories helping turn{' '}
                {mission.name} into reality.
              </p>
              <p className="eyebrow tabular mt-6 text-fg-faint">
                {partners.length} organisations
              </p>
            </div>
          </div>

          <FeaturedPartners partners={featured} />
        </Container>
      </Section>

      {/* ── Major partners ───────────────────────────────────────────── */}
      {major.length ? (
        <Section tone="cloud" join="soft" spacing="none" className="pb-24 pt-20 md:pb-32 md:pt-28">
          <Container wide>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-display-sm lg:col-span-6">
                Expertise, tools and operational context.
              </h2>
              <p className="text-lead text-fg-muted lg:col-span-5 lg:col-start-8">
                Each one contributes something specific to the work on{' '}
                {mission.name}.
              </p>
            </div>

            <div className="mt-12 md:mt-16">
              <MajorPartners partners={major} />
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ── The wider ecosystem ──────────────────────────────────────── */}
      {/* Warm white, deliberately: the partner logos arrive on white mattes,
          and on any other rung of the light ladder those mattes show as
          rectangles behind the marks. `mix-blend-multiply` would normally
          dissolve them, but the row carries an opacity of its own, which
          isolates the blend and leaves the white standing. */}
      {standard.length ? (
        <Section tone="paper" join="soft" spacing="none" className="pb-24 pt-20 md:pb-32 md:pt-28">
          <Container wide>
            <h2 className="max-w-[22ch] text-display-sm">
              And the wider ecosystem around the mission.
            </h2>
          </Container>

          {/* Full-bleed: the stream should run off both edges of the page. */}
          <div className="mt-10 md:mt-14">
            <PartnerMarquee partners={standard} tiers={partnerTiers} />
          </div>

          <Container wide>
            <p className="eyebrow mt-10 text-fg-faint md:mt-12">
              <span className="hidden md:inline">
                Hover a partner to see the partnership
              </span>
              <span className="md:hidden">Tap a partner to see the partnership</span>
            </p>
          </Container>
        </Section>
      ) : null}

      {/* ── Close ────────────────────────────────────────────────────── */}
      <Section tone="void" join="curve" spacing="loose" id="partner-with-us">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 h-[36rem] w-[36rem] rounded-control bg-[radial-gradient(closest-side,rgb(var(--glow)/0.16),transparent)] blur-3xl"
        />
        <Container wide className="relative">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RevealLines
                as="h2"
                className="text-display-md"
                lines={['Your logo could be', { text: 'part of the mission.', className: 'text-accent' }]}
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-lead text-chalk-muted">
                LISAT is open to new partnerships — components, software,
                facilities, expert review or funding.
              </p>
              <ButtonLink
                href={contact.partnershipsMailto}
                arrow
                className="mt-8"
              >
                Become a partner
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
