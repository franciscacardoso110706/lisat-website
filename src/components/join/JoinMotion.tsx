'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRange, useSectionScroll } from '@/lib/motion'
import { clsx } from '@/lib/utils'

/**
 * The scroll-driven parts of the Join Us page.
 *
 * Both follow the site's motion rules (`src/lib/motion.ts`): every range
 * starts at its resting value, so the server render is already the finished
 * layout, and under reduced motion every range collapses to a constant.
 * Framer's scroll values write styles outside React, so none of this
 * re-renders while the page moves.
 */

/* ------------------------------------------------------------------ hero */

/**
 * The hero photograph. It settles as the reader scrolls away from it — a
 * slow push-in rather than a parallax, so the frame edge never moves.
 */
export function HeroPhoto({
  src,
  alt,
  position = 'center',
}: {
  src: string
  alt: string
  position?: string
}) {
  const { ref, progress } = useSectionScroll<HTMLDivElement>([
    'start end',
    'end start',
  ])
  const scale = useRange(progress, [1.08, 1])
  const y = useRange(progress, [-24, 24])

  return (
    <div ref={ref} className="jn-hero-photo">
      <motion.div className="absolute -inset-y-8 inset-x-0" style={{ scale, y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------ experience */

export interface Moment {
  word: string
  image: string
  alt: string
  /** Real event the photograph is from. */
  caption: string
  /** Its story on the Updates page, where there is one. */
  href?: string
  position?: string
}

/**
 * One photograph per moment and one word for it.
 *
 * The word drifts sideways against the scroll while the photograph drifts
 * vertically inside its frame — two slow movements in different directions,
 * which is what makes the section flow rather than slide.
 */
export function ExperienceMoments({ moments }: { moments: Moment[] }) {
  return (
    <ol className="jx-list">
      {moments.map((moment, i) => (
        <MomentRow key={moment.word} moment={moment} index={i} />
      ))}
    </ol>
  )
}

function MomentRow({ moment, index }: { moment: Moment; index: number }) {
  const { ref, progress } = useSectionScroll<HTMLLIElement>()
  const flip = index % 2 === 1
  const wordX = useRange(progress, flip ? [-24, 24] : [24, -24])
  const photoY = useRange(progress, [-36, 36])

  return (
    <li ref={ref} className={clsx('jx-moment', flip && 'jx-moment--flip')}>
      <motion.p className="jx-word" style={{ x: wordX }} aria-hidden="true">
        {moment.word}
      </motion.p>

      <div className="jx-frame">
        <motion.div className="absolute -inset-y-10 inset-x-0" style={{ y: photoY }}>
          <Image
            src={moment.image}
            alt={moment.alt}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
            style={{ objectPosition: moment.position ?? 'center' }}
          />
        </motion.div>
      </div>

      <div className="jx-meta">
        <span className="eyebrow tabular text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* The word is decorative above; this is the version that is read. */}
        <h3 className="sr-only">{moment.word}</h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          {moment.caption}
        </p>
        {moment.href ? (
          <Link
            href={moment.href}
            className="group mt-4 inline-flex items-center gap-2 font-display text-sm font-medium text-accent transition-colors hover:text-fg"
          >
            The story
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </li>
  )
}
