import type { Metadata } from 'next'
import { Container, Section } from '@/components/ui/Section'
import { RevealLines } from '@/components/ui/RevealLines'
import { SectionIndex } from '@/components/ui/Technical'
import { CtaBand } from '@/components/ui/CtaBand'
import { DepartmentGrid } from '@/components/departments/DepartmentGrid'
import { departments } from '@/data/departments'
import { mission } from '@/data/mission'

export const metadata: Metadata = {
  title: 'Departments',
  description:
    'LISAT is organised into departments covering the payload, the platform, the ground segment and the running of the project. Each one owns part of LISAT-01.',
  alternates: { canonical: '/departments' },
}

/**
 * Departments.
 *
 * A short light introduction, then straight into a dark environment holding
 * the cards — the one openly interactive moment on the site. The contrast
 * between the two is the point: the page reads as the editorial LISAT site
 * until it hands over to the hardware.
 */
export default function DepartmentsPage() {
  return (
    <>
      {/* Introduction — kept to a heading and one sentence. */}
      <Section tone="paper" spacing="none" className="pt-[var(--nav-height)]">
        <Container wide className="py-20 md:py-28">
          <SectionIndex index="01" label="Departments" />
          <RevealLines
            as="h1"
            className="mt-9 max-w-[16ch] text-display-lg"
            lines={['The teams', 'behind the mission.']}
          />
          <p className="mt-8 max-w-2xl text-lead text-fg-muted">
            {departments.length} engineering and operational teams, each owning
            a subsystem or a function of {mission.name}, and each answerable to
            everyone else&rsquo;s requirements.
          </p>
        </Container>
      </Section>

      <DepartmentGrid departments={departments} />

      <CtaBand
        eyebrow="Join us"
        title="Find the department that fits you."
        body="Most people arrive without space experience. What matters is that you want to own something real."
        primary={{ label: 'See how to join', href: '/join-us' }}
        secondary={{ label: 'Meet the team', href: '/team' }}
      />
    </>
  )
}
