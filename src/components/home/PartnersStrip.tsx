import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { PartnerLogo } from '@/components/partners/PartnerLogo'
import { featuredPartners, partners } from '@/data/partners'

export function PartnersStrip() {
  return (
    <Section tone="mist" join="soft" spacing="default" id="partners">
      <Container wide>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionIndex index="06" label="Support" />
            <h2 className="mt-9 text-display-md">
              Nobody builds a satellite alone.
            </h2>
            <p className="mt-6 max-w-prose text-lead text-fg-muted">
              {partners.length} companies, laboratories and institutions
              contribute components, software, facilities and expert review to
              the mission.
            </p>
          </div>
          <TextLink href="/partners" className="shrink-0 md:pb-3">
            All partners
          </TextLink>
        </div>

        <Reveal>
          <ul className="mt-14 grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-6">
            {featuredPartners.map((partner) => (
              <li key={partner.id}>
                <PartnerLogo partner={partner} size="sm" />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}
