import type { Metadata } from 'next'
import Image from 'next/image'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Reveal } from '@/components/ui/Reveal'
import { Counter } from '@/components/ui/Counter'
import { ButtonLink } from '@/components/ui/Button'
import { PartnerDeck } from '@/components/partners/PartnerDeck'
import { PartnerNetwork } from '@/components/partners/PartnerNetwork'
import { partnerPriority } from '@/data/partners'
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
 *   the key partners: a headline, then a deck of overlapping logo cards
 *   with the lead partner in front
 *   → proof of scale, one row of large numbers
 *   → the whole network, every partner on one open field of logos
 *   → one compact call to partner
 *
 * Everything is data. `partnerPriority` decides who is in the deck (in order
 * of importance, so the first starts in front) and the numbers are counted
 * from the same list. Nothing on this page names a partner.
 */
export default async function PartnersPage() {
  const partners = await getPartners()

  // The deck: everyone above the logo stream, already in order of importance.
  const key = partners.filter((p) => partnerPriority(p) !== 'standard')

  // Proof of scale, counted rather than typed. A figure that comes out as
  // zero is left out instead of shown.
  const stats = [
    { value: partners.length, label: 'Partner organisations' },
    { value: key.length, label: 'Key partners' },
    { value: partners.filter((p) => p.tier === 'technical').length, label: 'Technical partners' },
    { value: partners.filter((p) => p.tier === 'institutional').length, label: 'Institutional partners' },
  ].filter((s) => s.value > 0)

  return (
    <>
      {/* ── Hero: the team, blurred, with the statement in front ────── */}
      <section className="pt-hero tone-void">
        <div className="blur-hero-photo" aria-hidden="true">
          <Image
            src="/images/updates/smallsat-06.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
        </div>
        <div className="blur-hero-veil" aria-hidden="true" />

        <Container wide className="relative">
          <div className="pt-head">
            <div>
              <SectionIndex index="05" label="Partners" className="enter-fade" />
              <h1 className="ed-title mt-5">
                <span className="enter-fade block" style={{ animationDelay: '80ms' }}>
                  The partners
                </span>
                <span className="ed-title-blue enter-fade block" style={{ animationDelay: '160ms' }}>
                  behind the mission.
                </span>
              </h1>
            </div>
            <p className="pt-intro enter-fade" style={{ animationDelay: '260ms' }}>
              {mission.name} is made possible by a network of organisations
              that share our vision and support our journey from concept to
              space.
            </p>
          </div>
        </Container>
      </section>

      {/* ── The key partners ─────────────────────────────────────────── */}
      <Section tone="paper" join="curve" spacing="none" className="pb-10 pt-8 md:pb-14 md:pt-12">
        {key.length ? (
          // Full-bleed, so the outer cards can run off the page.
          <div className="mt-10 md:mt-14">
            <PartnerDeck partners={key} allHref="#network" />
          </div>
        ) : null}

        {/* ── Proof of scale ───────────────────────────────────────── */}
        <Container wide>
          <ul className="pt-stats">
            {stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 0.06} className="pt-stat">
                <span className="pt-stat-num tabular">
                  <Counter value={s.value} />
                </span>
                <span className="pt-stat-label">{s.label}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── The network ──────────────────────────────────────────────── */}
      <Section
        tone="paper"
        spacing="none"
        id="network"
        className="scroll-mt-[var(--nav-height)] pb-24 pt-10 md:pb-32 md:pt-14"
      >
        <Container wide>
          <div className="pt-head">
            <div>
              <SectionIndex index="02" label="Our network" />
              <h2 className="ed-title mt-5">
                <span className="block">One mission.</span>
                <span className="ed-title-blue block">Many contributors.</span>
              </h2>
            </div>
            <p className="pt-intro">
              LISAT brings together a diverse network of academic institutions,
              companies and organisations that support our mission in
              different ways.
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <PartnerNetwork partners={partners} />
          </div>
        </Container>
      </Section>

      {/* ── Partner with us ──────────────────────────────────────────── */}
      <Section tone="paper" spacing="none" id="partner-with-us" className="pb-24 md:pb-32">
        <Container wide>
          <div className="pt-cta">
            <div>
              <p className="pt-cta-title">Build with us.</p>
              <p className="pt-cta-line">
                Support the next generation of space talent in Portugal.
              </p>
            </div>
            <ButtonLink href={contact.partnershipsMailto} arrow className="pt-cta-button">
              Partner with LISAT
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
