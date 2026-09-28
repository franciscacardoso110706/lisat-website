'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'
import { Coordinates, StatusTag, TechLabel } from '@/components/ui/Technical'
import { useRange, useSectionScroll } from '@/lib/motion'
import { mission } from '@/data/mission'
import { site } from '@/data/site'

/**
 * The opening.
 *
 * One photograph, one claim, one route onward — and a band of engineering
 * annotations along the bottom edge. Deliberately sparse: the hero's job is to
 * say what LISAT is building, not to explain the mission. That happens two
 * screens later, where there is room to do it properly.
 *
 * On large screens the hero is pinned while the section below rides up over
 * it, so the dark opening hands off to the light page instead of just ending.
 *
 * The headline entrance is a CSS animation rather than a scroll transform, so
 * it is readable even if JavaScript never runs. Every scroll transform starts
 * at its neutral value, which makes the un-hydrated render correct too.
 */

const headline = ['We’re building', 'a satellite.']

export function Hero() {
  const { ref, progress } = useSectionScroll<HTMLElement>([
    'start start',
    'end start',
  ])

  const imageScale = useRange(progress, [1, 1.14])
  const imageY = useRange(progress, [0, 70])
  const contentY = useRange(progress, [0, -70])
  const fade = useRange(progress, [1, 0.12], [0.35, 1])
  const veil = useRange(progress, [0, 0.55])

  return (
    <section
      ref={ref}
      className="tone-void relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-[var(--nav-height)] lg:sticky lg:top-0 lg:h-[100svh]"
    >
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ scale: imageScale, y: imageY }}
      >
        <Image
          src="/images/mission/hero-team.jpg"
          alt="The LISAT team at Instituto Superior Técnico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Legibility scrims.
          Localised rather than a blanket dim: the vertical one only has to
          carry the type in the lower third, and the horizontal one only the
          left column. The top two thirds of the photograph are left almost
          untouched, so the team is visible rather than implied. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/70 to-void/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-void/90 via-void/35 to-transparent"
      />
      {/* Deepens as the hero is scrolled past, easing the handoff to the light. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-void"
        style={{ opacity: veil }}
      />

      <motion.div
        className="relative mx-auto w-full max-w-content gutter pb-[clamp(1.5rem,4vh,4rem)] pt-[clamp(1.5rem,6vh,6rem)]"
        style={{ y: contentY, opacity: fade }}
      >
        <TechLabel
          label={mission.name}
          value={site.tagline}
          className="enter-fade text-accent [&>span]:text-accent"
        />

        {/*
          Each line is a mask for the entrance, and at a 0.9 line-height
          Montserrat's descenders fall below the line box — the mask was
          cutting the tail off the "g". The inner line carries the room for
          them as padding (so the entrance still starts fully hidden, since
          it travels 110% of the padded height) and the mask gives the same
          amount back as negative margin, so the lines sit exactly as tight
          as before.
        */}
        <h1 className="mt-[clamp(1rem,3vh,2rem)] text-display-xl font-semibold">
          {headline.map((line, i) => (
            <span key={line} className="-mb-[0.2em] block overflow-hidden">
              <span
                className="enter-up block pb-[0.2em]"
                style={{ animationDelay: `${140 + i * 110}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="enter-fade mt-[clamp(1.25rem,3.5vh,2.5rem)] flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
          style={{ animationDelay: '460ms' }}
        >
          <ButtonLink href="/mission/lisat-01" arrow>
            Explore {mission.name}
          </ButtonLink>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
            A 1U CubeSat listening for ships across Portugal&rsquo;s Exclusive
            Economic Zone.
          </p>
        </div>
      </motion.div>

      {/* Engineering annotations along the bottom edge. */}
      <motion.div
        className="enter-fade relative border-t border-rule bg-void/45 backdrop-blur-sm"
        style={{ animationDelay: '640ms', opacity: fade }}
      >
        <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-8 gap-y-3 gutter py-[clamp(0.75rem,2vh,1.25rem)]">
          <TechLabel label="Origin" value={`${site.city}, PT`} />
          <Coordinates
            lat={site.coordinates.lat}
            lon={site.coordinates.lon}
            className="hidden sm:flex"
          />
          <StatusTag value={mission.phase} className="ml-auto" />
        </div>
      </motion.div>
    </section>
  )
}
