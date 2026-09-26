import type { DepartmentSlug } from '@/lib/types'

/**
 * An abstract technical mark for each department.
 *
 * These are drawings, not icons: thin strokes in the current colour, each one
 * alluding to what the department actually works on — an orbit and body axes
 * for ADCS, a data bus for C&DH, radiating arcs for Communications, and so on.
 * They stay faint and sit behind the department's name, which remains the
 * dominant element on the card.
 *
 * Everything is stroked with `currentColor` at low opacity so a card only has
 * to set a text colour for the mark to follow it.
 */

/**
 * Keyed by slug. Partial on purpose: `board` is a roster grouping rather than
 * a department, so it has no mark of its own and falls back to the default.
 */
const glyphs: Partial<Record<DepartmentSlug, React.ReactNode>> = {
  // Orbit around a body, with attitude axes.
  adcs: (
    <>
      <ellipse cx="60" cy="60" rx="46" ry="22" transform="rotate(-24 60 60)" />
      <circle cx="60" cy="60" r="11" />
      <path d="M60 41V27M60 93V79M39 60H25M95 60H81" />
    </>
  ),
  // A processor die with a bus fanning out of it.
  cdh: (
    <>
      <rect x="44" y="44" width="32" height="32" />
      <path d="M44 52H24M44 60H30M44 68H24M76 52h20M76 60h14M76 68h20" />
      <path d="M52 44V26M60 44V32M68 44V26M52 76v18M60 76v12M68 76v18" />
    </>
  ),
  // Radiating signal arcs from a ground point.
  communications: (
    <>
      <path d="M60 86V60" />
      <circle cx="60" cy="90" r="4" />
      <path d="M38 60a22 22 0 0 1 44 0" />
      <path d="M26 60a34 34 0 0 1 68 0" />
      <path d="M14 60a46 46 0 0 1 92 0" />
    </>
  ),
  // Stacked boards, slightly exploded.
  hardware: (
    <>
      <path d="M22 76l38-16 38 16-38 16-38-16Z" />
      <path d="M22 58l38-16 38 16-38 16-38-16Z" />
      <path d="M22 40l38-16 38 16-38 16-38-16Z" />
    </>
  ),
  // Solar array feeding a cell.
  'power-systems': (
    <>
      <rect x="16" y="42" width="34" height="36" />
      <path d="M16 54h34M16 66h34M33 42v36" />
      <path d="M50 60h16" />
      <rect x="66" y="48" width="28" height="24" />
      <path d="M94 56v8" />
      <path d="M74 54v12M82 54v12" />
    </>
  ),
  // A frame under load, with isotherms across it.
  'structures-thermal': (
    <>
      <rect x="28" y="28" width="64" height="64" />
      <path d="M28 28l64 64M92 28l-64 64" />
      <path d="M20 44c14 6 26-6 40 0s26 6 40 0" opacity="0.55" />
      <path d="M20 76c14 6 26-6 40 0s26 6 40 0" opacity="0.55" />
    </>
  ),
  // A team as a connected network.
  'hr-logistics': (
    <>
      <circle cx="60" cy="34" r="7" />
      <circle cx="30" cy="80" r="7" />
      <circle cx="90" cy="80" r="7" />
      <circle cx="60" cy="62" r="7" />
      <path d="M60 41v14M55 67l-20 8M65 67l20 8M37 80h46" />
    </>
  ),
  // Broadcast reaching outward.
  'marketing-sponsors': (
    <>
      <circle cx="42" cy="60" r="9" />
      <path d="M51 60h18" />
      <path d="M72 46a20 20 0 0 1 0 28" />
      <path d="M82 38a34 34 0 0 1 0 44" />
      <path d="M33 51l-12-9M33 69l-12 9" />
    </>
  ),
  // A trajectory sketched through waypoints.
  'research-development': (
    <>
      <path d="M18 88C34 88 40 34 60 34s26 54 42 54" strokeDasharray="6 7" />
      <circle cx="60" cy="34" r="4" />
      <circle cx="18" cy="88" r="4" />
      <circle cx="102" cy="88" r="4" />
      <path d="M60 34V16" opacity="0.5" />
    </>
  ),
}

/** Concentric rules, used when a slug has no mark of its own. */
const fallback = (
  <>
    <circle cx="60" cy="60" r="30" />
    <circle cx="60" cy="60" r="16" />
    <path d="M60 14v16M60 90v16M14 60h16M90 60h16" />
  </>
)

export function DepartmentGlyph({
  slug,
  className,
}: {
  slug: DepartmentSlug
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {glyphs[slug] ?? fallback}
    </svg>
  )
}
