import type { Metadata } from 'next'
import { CtaBand } from '@/components/ui/CtaBand'
import { MissionSpacecraft } from '@/components/mission/MissionSpacecraft'
import { MissionIntro } from '@/components/mission/MissionIntro'
import { MissionOverview } from '@/components/mission/MissionOverview'
import { MissionJourney } from '@/components/mission/MissionJourney'
import { MissionCompetition } from '@/components/mission/MissionCompetition'
import { mission } from '@/data/mission'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  // Short in the tab; the headline stays on the share card below.
  title: mission.name,
  description: mission.summary,
  alternates: { canonical: '/mission/lisat-01' },
  openGraph: {
    title: `${mission.name} · ${mission.headline}`,
    description: mission.summary,
    url: '/mission/lisat-01',
  },
}

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

      {/*
        What the mission is — offered, not imposed. The reader chooses to open
        it; scrolling straight past is a legitimate reading of the page.
      */}
      <MissionOverview />

      {/* The spacecraft, then the road to flying it. */}
      <MissionSpacecraft />
      <MissionJourney />
      <MissionCompetition />

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
