import type { ReactNode } from 'react'
import { clsx } from '@/lib/utils'

/**
 * Surface tones, in order.
 *
 *   paper  #FCFCFA  warm white — the default page
 *   cloud  #F6F8FC  the everyday alternate
 *   ice    #EAF1FB  a light section that should feel cooler
 *   mist   #DDE9F8  the deepest light surface, for one band at a time
 *   space  #101D33  ─┐
 *   hull   #142033   ├ dark, and deliberately rare
 *   void   #0C1728  ─┘
 *
 * Light is the environment; dark is an event. Consecutive light sections
 * should step through the ladder rather than repeat, but only ever by one
 * rung — two neighbouring sections that differ by more read as stripes.
 */
export type Tone = 'paper' | 'cloud' | 'ice' | 'mist' | 'space' | 'hull' | 'void'

const toneClass: Record<Tone, string> = {
  paper: 'tone-paper',
  cloud: 'tone-cloud',
  ice: 'tone-ice',
  mist: 'tone-mist',
  space: 'tone-space',
  hull: 'tone-hull',
  void: 'tone-void',
}

export function Container({
  children,
  className,
  wide,
}: {
  children: ReactNode
  className?: string
  /** Use the full 1280px measure instead of the narrower default. */
  wide?: boolean
}) {
  return (
    <div
      className={clsx(
        'mx-auto w-full gutter',
        wide ? 'max-w-content' : 'max-w-[1120px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Section({
  children,
  tone = 'paper',
  className,
  id,
  as: Tag = 'section',
  /** Vertical rhythm. `tight` for supporting bands, `loose` for feature blocks. */
  spacing = 'default',
  clip = true,
  join,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  id?: string
  as?: 'section' | 'div' | 'article'
  spacing?: 'tight' | 'default' | 'loose' | 'none'
  /**
   * Clips content to the section box. On by default so the decorative orbit
   * SVGs, which are positioned outside it, never widen the page.
   *
   * Set `false` for sections containing `position: sticky` children — an
   * ancestor with `overflow: hidden` silently stops sticky from working.
   */
  clip?: boolean
  /**
   * How this section meets the one above it.
   *
   * Two light surfaces one rung apart differ by about 4% in luminance. That
   * is small, but across the full width of a page the eye still finds the
   * line and reads it as a stripe — which is the specific failure this
   * palette is meant to avoid. Curving the edge removes the line without
   * removing the change of surface.
   *
   *   'soft'  a wide, shallow ellipse — for one light surface meeting
   *           another. Subtle enough that it reads as air, not as a shape.
   *   'curve' a pronounced corner radius — for a light surface meeting a
   *           dark one, where the step is the point and the shape should be
   *           visible.
   *
   * A gradient fade would be the other way to do this, but the section clips
   * its own box, so anything drawn above the top edge is cut off. The curve
   * works because it *is* the box.
   */
  join?: 'soft' | 'curve'
}) {
  const pad = {
    none: '',
    tight: 'py-14 md:py-20',
    default: 'py-20 md:py-28',
    loose: 'py-24 md:py-36',
  }[spacing]

  return (
    <Tag
      id={id}
      className={clsx(
        'relative',
        clip && 'overflow-hidden',
        join === 'soft' && 'soft-edge-top -mt-6 md:-mt-10',
        join === 'curve' && 'rounded-t-feature -mt-8 md:-mt-12',
        toneClass[tone],
        pad,
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({
  children,
  className,
  /** Shows a small index like "02" before the label. */
  index,
}: {
  children: ReactNode
  className?: string
  index?: string
}) {
  return (
    <p className={clsx('eyebrow flex items-center gap-3 text-accent', className)}>
      {index ? (
        <span className="tabular opacity-60" aria-hidden="true">
          {index}
        </span>
      ) : null}
      <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
      {children}
    </p>
  )
}

/**
 * Standard section header: eyebrow, large title, optional supporting line.
 * Keeps type scale and spacing identical everywhere.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  align = 'left',
  className,
  level = 2,
}: {
  eyebrow?: string
  index?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
  level?: 2 | 3
}) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <div
      className={clsx(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
      <Heading className={clsx('text-balance text-display-sm', eyebrow ? 'mt-7' : '')}>
        {title}
      </Heading>
      {lead ? (
        <p className="mt-6 max-w-prose text-lead text-fg-muted">{lead}</p>
      ) : null}
    </div>
  )
}
