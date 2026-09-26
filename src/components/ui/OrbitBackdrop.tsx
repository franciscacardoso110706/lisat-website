import { clsx } from '@/lib/utils'

/**
 * Decorative orbital geometry used behind dark sections. Purely presentational:
 * no text, aria-hidden, and it never carries meaning.
 */
export function OrbitBackdrop({
  className,
  opacity = 0.5,
}: {
  className?: string
  opacity?: number
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      fill="none"
      className={clsx('pointer-events-none absolute select-none', className)}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="orbit-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.55" />
          <stop offset="55%" stopColor="rgb(var(--glow))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="rgb(var(--glow))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Earth limb */}
      <circle cx="400" cy="400" r="196" stroke="url(#orbit-fade)" strokeWidth="1" />
      {/* Orbit planes at increasing inclination */}
      <ellipse
        cx="400"
        cy="400"
        rx="300"
        ry="118"
        stroke="url(#orbit-fade)"
        strokeWidth="1"
        transform="rotate(-24 400 400)"
      />
      <ellipse
        cx="400"
        cy="400"
        rx="340"
        ry="180"
        stroke="url(#orbit-fade)"
        strokeWidth="1"
        transform="rotate(18 400 400)"
      />
      <ellipse
        cx="400"
        cy="400"
        rx="252"
        ry="252"
        stroke="url(#orbit-fade)"
        strokeWidth="1"
        strokeDasharray="2 10"
      />
      {/* Spacecraft marker */}
      <circle cx="668" cy="318" r="3.5" fill="rgb(var(--glow))" />
      <line x1="668" y1="318" x2="668" y2="240" stroke="rgb(var(--glow))" strokeOpacity="0.4" />
      <line x1="668" y1="240" x2="724" y2="240" stroke="rgb(var(--glow))" strokeOpacity="0.4" />
    </svg>
  )
}

/**
 * Coordinate crosshair used as a quiet corner detail.
 */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className={clsx('pointer-events-none', className)}
    >
      <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeOpacity="0.5" />
    </svg>
  )
}
