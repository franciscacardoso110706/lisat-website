import type { Metadata } from 'next'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { RevealLines } from '@/components/ui/RevealLines'
import { ButtonLink } from '@/components/ui/Button'
import { PartnerMarquee } from '@/components/partners/PartnerMarquee'
import { partners, partnerTiers } from '@/data/partners'
import { contact } from '@/data/site'
import { mission } from '@/data/mission'

export const metadata: Metadata = {
  title: 'Partners',
  description: `${partners.length} companies, laboratories and institutions support LISAT with hardware, software, expertise and funding for ${mission.name}.`,
  alternates: { canonical: '/partners' },
}

/**
 * Partners.
 *
 * Light, open, and almost entirely one interaction: the organisations move
 * slowly across the page and open when you rest on them. There is deliberately
 * very little else here — no tier grids, no benefit cards, no second
 * explanation. The ecosystem is the content.
 */
export default function PartnersPage() {
  return (
    <>
      {/* Intro */}
      <Section tone="paper" spacing="none" className="pt-[var(--nav-height)]">
        <Container wide>
          <div className="grid items-end gap-10 py-20 md:py-28 lg:grid-cols-12">
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
                Our partners help turn {mission.name} into reality.
              </p>
              <p className="eyebrow tabular mt-6 text-fg-faint">
                {partners.length} organisations
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* The ecosystem */}
      {/* Warm white, deliberately: the partner logos arrive on white mattes,
          and on any other rung of the light ladder those mattes show as
          rectangles behind the marks. `mix-blend-multiply` would normally
          dissolve them, but the row carries an opacity of its own, which
          isolates the blend and leaves the white standing. */}
      <Section tone="paper" spacing="none" className="pb-24 pt-20 md:pb-32 md:pt-24">
        <Container wide>
          <h2 className="max-w-[20ch] text-display-sm">
            The people and organisations behind the mission.
          </h2>
        </Container>

        {/* Full-bleed: the stream should run off both edges of the page. */}
        <div className="mt-14 md:mt-20">
          <PartnerMarquee partners={partners} tiers={partnerTiers} />
        </div>

        <Container wide>
          <p className="eyebrow mt-12 text-fg-faint md:mt-16">
            <span className="hidden md:inline">
              Hover a partner to see the partnership
            </span>
            <span className="md:hidden">Tap a partner to see the partnership</span>
          </p>
        </Container>
      </Section>

      {/* Close */}
      <Section tone="void" spacing="loose" id="partner-with-us" className="rounded-t-feature">
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
