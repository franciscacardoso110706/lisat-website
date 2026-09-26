import type { Metadata } from 'next'
import { Container, Section } from '@/components/ui/Section'
import { CtaBand } from '@/components/ui/CtaBand'
import { UpdatesCover } from '@/components/updates/UpdatesCover'
import { LatestUpdates } from '@/components/updates/LatestUpdates'
import { UpdatesJournal } from '@/components/updates/UpdatesJournal'
import { activeCategories, updates } from '@/data/updates'
import { socials } from '@/data/site'

export const metadata: Metadata = {
  title: 'Updates',
  description:
    'Mission milestones, team news, events and partnerships from LISAT, written by the team as LISAT-01 develops.',
  alternates: { canonical: '/updates' },
}

const instagram = socials.find((s) => s.label === 'Instagram')

const latest = updates.slice(0, 4)
/**
 * The archive picks up where the spread above leaves off, so no post appears
 * twice on the page.
 */
const archive = updates.slice(4)

/**
 * The mission journal.
 *
 * A dark typographic cover, then a hard cut to off-white for the four newest
 * stories — that contrast is the point of the page, and it only lands because
 * everything after it stays light. The filterable archive below carries the
 * rest on the next rung down.
 */
export default function UpdatesPage() {
  return (
    <>
      <UpdatesCover />

      <LatestUpdates updates={latest} />

      <Section tone="cloud" spacing="none" className="pb-28 md:pb-36 pt-20 md:pt-24">
        <Container wide className="relative">
          <UpdatesJournal updates={archive} categories={activeCategories} />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Follow along"
        title="Keep up with the mission."
        body="We post progress as it happens — lab sessions, reviews, and the work behind each milestone."
        primary={
          instagram
            ? { label: 'Follow on Instagram', href: instagram.href, external: true }
            : { label: 'Get in touch', href: '/contact' }
        }
        secondary={{ label: 'About LISAT-01', href: '/mission/lisat-01' }}
        tone="void"
      />
    </>
  )
}
