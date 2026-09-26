import type { Metadata } from 'next'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { CtaBand } from '@/components/ui/CtaBand'
import { PartnerLogo } from '@/components/partners/PartnerLogo'
import { MissionSpacecraft } from '@/components/mission/MissionSpacecraft'
import { MissionIntro } from '@/components/mission/MissionIntro'
import { MissionJourney } from '@/components/mission/MissionJourney'
import { MissionCompetition } from '@/components/mission/MissionCompetition'
import { mission } from '@/data/mission'
import { partners } from '@/data/partners'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  title: `${mission.name} — ${mission.headline}`,
  description: mission.summary,
  alternates: { canonical: '/mission/lisat-01' },
  openGraph: {
    title: `${mission.name} — ${mission.headline}`,
    description: mission.summary,
    url: '/mission/lisat-01',
  },
}

/** Partners with a stated role in the mission, shown near the foot of the page. */
const missionPartnerIds = [
  'meo',
  'thales',
  'marinha-portuguesa',
  'instituto-telecomunicacoes',
  'nanosatlab',
  'instituto-superior-tecnico',
]

const missionPartners = missionPartnerIds
  .map((id) => partners.find((p) => p.id === id))
  .filter((p): p is (typeof partners)[number] => Boolean(p))

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: mission.name,
  description: mission.summary,
  about: 'Maritime domain awareness using a 1U CubeSat with an AIS payload',
}

export default function MissionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        The opening IS the page. There is no hero in front of it: clicking
        "Mission" puts the reader inside the story — the problem, then
        LISAT-01, then how it works — as one pinned sequence.

        The old hero and the static mission explanation that used to sit here
        said the same things again afterwards, so they are gone.
      */}
      <MissionIntro />

      {/* How it works, then how it is being built. */}
      <MissionJourney />
      <MissionSpacecraft />
      <MissionCompetition />

      {/* Partners on the mission */}
      <Section tone="cloud" spacing="default">
        <Container wide>
          <SectionHeading
            eyebrow="Support"
            index="04"
            title="Partners on this mission"
            lead="Organisations contributing expertise, facilities and hardware to LISAT-01."
          />
          <ul className="mt-12 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-6">
            {missionPartners.map((partner) => (
              <li key={partner.id}>
                <PartnerLogo partner={partner} size="sm" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Get involved"
        title="Help us put student-built technology into orbit."
        body={`${mission.name} is built by students and funded by partners who believe an academic team can fly a real mission. There is room for more of both.`}
        primary={{
          label: 'Partner with LISAT',
          href: contact.partnershipsMailto,
          external: true,
        }}
        secondary={{ label: 'Join the team', href: '/join-us' }}
      />
    </>
  )
}
