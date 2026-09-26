import type { ReactNode } from 'react'
import { clsx } from '@/lib/utils'

/**
 * The site's engineering-document vocabulary: small monospace annotations that
 * sit beside editorial typography and photography.
 *
 * These are deliberately plain — a label, a rule, a value. They carry real
 * information (a status, a location, a section index), never decoration for
 * its own sake, and they inherit the surrounding tone so they stay legible on
 * both light and dark surfaces.
 */

/**
 * A key/value annotation, rendered as `LABEL / VALUE`.
 * Used for things like `ORIGIN / LISBON, PT`.
 */
export function TechLabel({
  label,
  value,
  className,
}: {
  label: string
  value?: ReactNode
  className?: string
}) {
  return (
    <p className={clsx('eyebrow flex items-center gap-2 text-fg-faint', className)}>
      <span>{label}</span>
      {value ? (
        <>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          <span className="text-fg-muted">{value}</span>
        </>
      ) : null}
    </p>
  )
}

/**
 * A live-ish status line. The dot uses the reserved signal colour, which
 * appears nowhere else on the site, so "in development" reads as a state
 * rather than as another accent.
 */
export function StatusTag({
  label = 'Mission status',
  value,
  className,
}: {
  label?: string
  value: string
  className?: string
}) {
  return (
    <p className={clsx('eyebrow flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
      />
      <span className="text-fg-faint">{label}</span>
      <span aria-hidden="true" className="text-fg-faint opacity-40">
        /
      </span>
      <span className="text-fg">{value}</span>
    </p>
  )
}

/**
 * Geographic coordinates, set in tabular figures so the digits align.
 * Decorative in the sense that it is not navigation, but the numbers are real.
 */
export function Coordinates({
  lat,
  lon,
  className,
}: {
  lat: string
  lon: string
  className?: string
}) {
  return (
    <p
      className={clsx('eyebrow tabular flex items-center gap-3 text-fg-faint', className)}
    >
      <span>{lat}</span>
      <span aria-hidden="true" className="h-px w-4 bg-current opacity-40" />
      <span>{lon}</span>
    </p>
  )
}

/**
 * A numbered section marker — `01 / MISSION`. Pairs with `Eyebrow`, which
 * carries the same index in the light-weight case.
 */
export function SectionIndex({
  index,
  label,
  className,
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <p className={clsx('eyebrow flex items-center gap-2 text-accent', className)}>
      <span className="tabular">{index}</span>
      <span aria-hidden="true" className="opacity-40">
        /
      </span>
      <span>{label}</span>
    </p>
  )
}

/**
 * A caption for photography, in the manner of a plate annotation:
 * `FIG. 03 — Critical Design Review, Lisbon, 2025`.
 */
export function Plate({
  figure,
  children,
  className,
}: {
  figure?: string
  children: ReactNode
  className?: string
}) {
  return (
    <figcaption
      className={clsx('eyebrow mt-3 flex flex-wrap items-center gap-2 text-fg-faint', className)}
    >
      {figure ? (
        <>
          <span className="tabular text-accent">{figure}</span>
          <span aria-hidden="true" className="opacity-40">
            —
          </span>
        </>
      ) : null}
      <span>{children}</span>
    </figcaption>
  )
}
