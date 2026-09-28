import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section, type Tone } from '@/components/ui/Section'
import { RevealLines } from '@/components/ui/RevealLines'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { mission } from '@/data/mission'
import { site } from '@/data/site'

/**
 * The last beat of the story: the way in.
 *
 * Not a recruitment banner. The page has just shown what LISAT is building;
 * this says the next part is still unbuilt, and who builds it. One statement,
 * one line, one action — and a photograph of the ground station at MEO's
 * Satellite Operations Center, the nearest thing the team has to a picture of
 * where the mission is going.
 *
 * The whole panel is clickable, but through the one real link stretched over
 * it (`nx-link::after`), so there is a single accessible name and no nested
 * interactive elements.
 *
 * Used at the foot of the homepage and of the Team page.
 */
export function NextCta({
  tone = 'ice',
  join,
}: {
  tone?: Tone
  join?: 'soft' | 'curve'
}) {
  return (
    <Section tone={tone} join={join} spacing="none" className="py-16 md:py-24">
      <Container wide>
        <div className="nx group">
          {/* Orbit geometry in white, sweeping up from under the copy. */}
          <OrbitBackdrop
            className="-bottom-[22rem] -left-[16rem] -z-10 h-[760px] w-[760px]"
            opacity={0.5}
          />

          <div className="nx-copy">
            <p className="eyebrow flex items-center gap-3 text-[rgb(var(--lisat-white)/0.78)]">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Join {site.name}
            </p>

            <RevealLines
              as="h2"
              className="nx-title mt-7"
              lines={['Build what', 'comes next.']}
            />

            <p className="nx-lead mt-6">
              Join the team behind {mission.name}.
            </p>

            <Link href="/join-us" className="nx-link mt-9">
              Join {site.name}
              <span className="nx-link-arrow" aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="nx-media" aria-hidden="true">
            <div className="nx-photo">
              <Image
                src="/images/updates/altice-03.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_30%]"
              />
              <span className="eyebrow absolute bottom-4 left-4 rounded-control bg-void/55 px-3.5 py-2 text-[rgb(var(--lisat-white))] backdrop-blur-sm md:bottom-5 md:left-5">
                MEO Satellite Operations Center
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
