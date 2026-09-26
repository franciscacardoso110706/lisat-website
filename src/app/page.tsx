import { Hero } from '@/components/home/Hero'
import { Intro } from '@/components/home/Intro'
import { MissionStory } from '@/components/home/MissionStory'
import { People } from '@/components/home/People'
import { DepartmentsOverview } from '@/components/home/DepartmentsOverview'
import { UpdatesPreview } from '@/components/home/UpdatesPreview'
import { PartnersStrip } from '@/components/home/PartnersStrip'
import { JoinCta } from '@/components/home/JoinCta'

/**
 * Homepage narrative:
 * LISAT is building LISAT-01 → the mission → the people → the systems and
 * teams behind it → what is happening now → who supports it → how to join.
 *
 * Pacing is deliberate. Three moments carry scroll-driven motion — the hero
 * handoff, the three-chapter mission sequence and the team photography — and
 * everything between them is still, so the reader is allowed to just read.
 */
export default function HomePage() {
  return (
    <>
      {/* The hero is pinned on large screens and the intro rides up over it,
          which is why the two share a wrapper: the pin releases at its end. */}
      <div className="relative">
        <Hero />
        <Intro />
      </div>

      <MissionStory />
      <People />
      <DepartmentsOverview />
      <UpdatesPreview />
      <PartnersStrip />
      <JoinCta />
    </>
  )
}
