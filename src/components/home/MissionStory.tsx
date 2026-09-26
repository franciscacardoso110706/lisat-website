'use client'

import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { Container, Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { SectionIndex, StatusTag } from '@/components/ui/Technical'
import { crossfadeWindow, useRange, useSectionScroll } from '@/lib/motion'
import { mission, pillars, specs } from '@/data/mission'

/**
 * The mission, told in three chapters.
 *
 * On large screens the imagery is pinned while the text advances beside it,
 * and the three renders cross-fade against scroll position — payload,
 * spacecraft, ground segment. The sequence is driven entirely by scroll, so it
 * stops when the reader stops and reverses when they scroll back.
 *
 * The pinned frame is the seam where the interactive 3D CubeSat will live; see
 * `SpacecraftStage`. Until a flight-representative model exists, it holds
 * still renders, and the layout around it does not change when one arrives.
 *
 * Below `lg` the pinning is dropped and each chapter carries its own image,
 * which keeps mobile scrolling cheap.
 */

const headlineSpecs = specs.filter((s) => !s.provisional).slice(0, 4)

function MediaLayer({
  progress,
  pillar,
  index,
  reduced,
}: {
  progress: MotionValue<number>
  pillar: (typeof pillars)[number]
  index: number
  reduced: boolean
}) {
  const win = crossfadeWindow(index, pillars.length)
  // Reduced motion: hold the first layer and hide the rest, no cross-fade.
  const output = reduced ? win.output.map(() => (index === 0 ? 1 : 0)) : win.output
  const opacity = useTransform(progress, win.input, output)

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Image
        src={pillar.image}
        alt={pillar.imageAlt}
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <span className="eyebrow absolute bottom-4 left-4 rounded-control bg-void/70 px-3.5 py-2 text-chalk backdrop-blur-md">
        {pillar.annotation}
      </span>
    </motion.div>
  )
}

export function MissionStory() {
  const { ref, progress, reduced } = useSectionScroll<HTMLDivElement>([
    'start start',
    'end end',
  ])

  const frameScale = useRange(progress, [1, 1.06])
  const railScale = useTransform(progress, [0, 1], [0, 1])

  return (
    <Section tone="ice" join="soft" spacing="none" id="lisat-01" className="py-0" clip={false}>
      {/* Opening statement — deliberately still. */}
      <Container wide className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="max-w-3xl">
          <SectionIndex index="02" label="The mission" />

          <h2 className="mt-9 text-display-lg">{mission.name}</h2>

          <p className="mt-5 text-title text-accent">{mission.headline}</p>

          <div className="prose-lisat mt-8 max-w-2xl">
            <p>{mission.summary}</p>
          </div>

          <StatusTag value={mission.status} className="mt-10" />
        </div>
      </Container>

      {/* Three chapters — pinned imagery on large screens. */}
      <div ref={ref}>
        <Container wide>
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Text column */}
            <div className="lg:col-span-5">
              {pillars.map((pillar, i) => (
                <article
                  key={pillar.id}
                  // Each chapter is exactly as tall as the pinned frame, so the
                  // two columns stay in step as the sequence advances.
                  className="flex min-h-[70svh] flex-col justify-center border-t border-rule py-14 lg:min-h-[calc(100svh-var(--nav-height))] lg:border-t-0 lg:py-0"
                >
                  <SectionIndex
                    index={String(i + 1).padStart(2, '0')}
                    label={pillar.chapter}
                  />

                  <h3 className="mt-6 text-display-sm">{pillar.title}</h3>

                  {/* Per-chapter image — replaces the pinned layer below lg. */}
                  <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-card bg-surface-sunken lg:hidden">
                    <Image
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      fill
                      loading="lazy"
                      sizes="100vw"
                      className="object-cover"
                    />
                    <span className="eyebrow absolute bottom-3 left-3 rounded-control bg-void/70 px-3 py-1.5 text-chalk backdrop-blur-md">
                      {pillar.annotation}
                    </span>
                  </div>

                  <p className="mt-6 text-lead text-fg-muted">{pillar.body}</p>
                </article>
              ))}
            </div>

            {/* Pinned media — the future home of the interactive CubeSat. */}
            <div className="hidden lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:block">
              <div className="sticky top-[var(--nav-height)] flex h-[calc(100svh-var(--nav-height))] items-center">
                <div className="w-full">
                  <motion.div
                    className="relative aspect-square w-full overflow-hidden rounded-panel bg-surface-sunken"
                    style={{ scale: frameScale }}
                  >
                    {pillars.map((pillar, i) => (
                      <MediaLayer
                        key={pillar.id}
                        progress={progress}
                        pillar={pillar}
                        index={i}
                        reduced={reduced}
                      />
                    ))}
                  </motion.div>

                  {/* Progress rail */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-px flex-1 bg-rule">
                      <motion.div
                        className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
                        style={{ scaleX: railScale }}
                      />
                    </div>
                    <span className="eyebrow tabular text-fg-faint">
                      {String(pillars.length).padStart(2, '0')} chapters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Close — specs and the route onward. */}
      <Container wide className="pb-24 pt-16 md:pb-32 md:pt-24">
        <dl className="grid grid-cols-2 border-t border-rule md:grid-cols-4">
          {headlineSpecs.map((spec, i) => (
            <div
              key={spec.label}
              className={
                'py-6 md:py-8 ' + (i > 0 ? 'md:border-l md:border-rule md:pl-6' : '')
              }
            >
              <dt className="eyebrow text-fg-faint">{spec.label}</dt>
              <dd className="mt-3 text-[0.9375rem] text-fg md:text-base">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <ButtonLink href="/mission/lisat-01" arrow className="mt-12">
          Explore {mission.name}
        </ButtonLink>
      </Container>
    </Section>
  )
}
