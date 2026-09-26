'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTilt } from '@/lib/useTilt'
import { mission } from '@/data/mission'
import type { CSSProperties } from 'react'

/**
 * The journal cover.
 *
 * The page's dark moment, and one of only two on the site: everything below it
 * is light, which is what gives this opening its weight.
 *
 * Two enormous words with a fanned stack of real photographs sitting in front
 * of them — the overlap is the composition, not an accident. The words are
 * ordinary text, so the page still reads and indexes normally; the stack is
 * decorative and carries empty alt text.
 *
 * The fan-out on load is a CSS animation rather than a scroll or JS one, so it
 * plays even if the bundle never arrives. Cursor parallax is layered on top of
 * it through a separate element: the animation owns the outer transform, the
 * pointer owns the inner one, and the two never fight over the same property.
 */

/**
 * Four photographs covering different sides of the project. Frames are 4:3 to
 * stay close to the sources, so the stack crops as little as possible.
 */
const stack: {
  src: string
  ratio: number
  w: number
  rotate: number
  x: number
  y: number
  depth: number
}[] = [
  // Frames follow each photograph's own ratio, so nothing important is cropped.
  { src: '/images/updates/careerfairs2-02.jpg', ratio: 0.75, w: 126, rotate: -9, x: -96, y: 16, depth: 24 },
  { src: '/images/mission/render-cubesat.jpg', ratio: 1, w: 132, rotate: -3, x: -32, y: -12, depth: 14 },
  { src: '/images/updates/easter-02.jpg', ratio: 0.75, w: 126, rotate: 4, x: 32, y: 12, depth: 20 },
  { src: '/images/updates/jornadasdomar-04.jpg', ratio: 0.95, w: 134, rotate: 9, x: 96, y: -6, depth: 10 },
]

export function UpdatesCover() {
  const tilt = useTilt({ max: 1, lift: 1 })

  return (
    <section
      {...tilt.handlers}
      className="tone-void relative isolate flex min-h-[64svh] flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
    >
      {/* Ambient light, layered rather than a single flat wash. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-control bg-[radial-gradient(closest-side,rgb(var(--glow)/0.16),transparent)] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-control bg-[radial-gradient(closest-side,rgb(var(--glow)/0.10),transparent)] blur-3xl"
      />

      {/* The cover itself */}
      <div className="relative mx-auto flex w-full max-w-content items-center gutter">
        <div className="relative w-full py-6">
          {/* Words. Pushed to the edges so the stack lands over their inner
              ends; on narrow screens they stack and the photographs sit
              between them instead. */}
          {/* The one place on the site set in Anton. It is a condensed
              poster face, so it takes a larger size, no synthetic weight and
              open rather than tight tracking — all three of which would be
              wrong for the heading face used everywhere else. */}
          <h1 className="flex flex-col items-center gap-0 text-center font-poster text-[clamp(3rem,9.4vw,8.75rem)] font-normal uppercase leading-[0.84] tracking-[0.005em] text-fg lg:flex-row lg:justify-between lg:gap-8 lg:text-left">
            <span className="enter-fade block">Mission</span>
            {/* Room for the stack on large screens. */}
            <span aria-hidden="true" className="hidden lg:block lg:w-[17rem] xl:w-[19rem]" />
            <span
              className="enter-fade block"
              style={{ animationDelay: '120ms' }}
            >
              Updates
            </span>
          </h1>

          {/* The stack, centred over the words. */}
          <ul className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex lg:-translate-x-5">
            {stack.map((photo, i) => (
              <li
                key={photo.src}
                className="pointer-events-auto absolute transition-[z-index] duration-0 hover:z-30"
                style={{ zIndex: 10 + i }}
              >
                {/* Fan-out on load. Owns the resting rotation and offset. */}
                <div
                  className="photo-fan"
                  style={
                    {
                      '--rot': `${photo.rotate}deg`,
                      '--tx': `${photo.x}px`,
                      '--ty': `${photo.y}px`,
                      animationDelay: `${160 + i * 90}ms`,
                    } as CSSProperties
                  }
                >
                  {/* Hover: forward, larger, closer to upright. */}
                  <div className="group transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.06] hover:[transform:rotate(calc(var(--rot)*-0.45))]">
                    {/* Cursor parallax, by depth. */}
                    <motion.div
                      style={{
                        x: tilt.enabled ? tilt.layerX : 0,
                        y: tilt.enabled ? tilt.layerY : 0,
                        scale: 1 + photo.depth / 900,
                      }}
                    >
                      <div
                        className="relative overflow-hidden rounded-card border border-rule-strong shadow-lift-lg"
                        style={{
                          width: photo.w,
                          aspectRatio: String(photo.ratio),
                        }}
                      >
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          priority={i < 2}
                          sizes="180px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Below lg the stack becomes a simple fanned pair — readable at
              small sizes instead of an unreadable shrunk-down stack. */}
          <ul className="mt-10 flex justify-center lg:hidden">
            {stack.slice(0, 3).map((photo, i) => (
              <li
                key={photo.src}
                className="-mx-6 first:ml-0 last:mr-0"
                style={{ zIndex: 10 + i }}
              >
                <div
                  className="photo-fan"
                  style={
                    {
                      '--rot': `${photo.rotate * 0.7}deg`,
                      '--tx': '0px',
                      '--ty': '0px',
                      animationDelay: `${160 + i * 90}ms`,
                    } as CSSProperties
                  }
                >
                  <div
                    className="relative w-[6.5rem] overflow-hidden rounded-card border border-rule-strong shadow-lift-lg sm:w-[8.5rem]"
                    style={{ aspectRatio: String(photo.ratio) }}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foot of the cover. Deliberately sparse. */}
      <div className="relative mx-auto mt-8 flex w-full max-w-content flex-wrap items-end justify-between gap-6 gutter pb-4 md:mt-10 md:pb-6">
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
          Follow the people, milestones and moments behind {mission.name}.
        </p>
        <p className="eyebrow text-fg-faint">
          {mission.name}
          <span aria-hidden="true" className="mx-2 opacity-40">
            /
          </span>
          Mission journal
        </p>
      </div>
    </section>
  )
}
