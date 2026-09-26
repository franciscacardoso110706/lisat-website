import { disciplines } from '@/data/departments'

/**
 * FLOW — what this team actually does, drifting past.
 *
 * The words are the `disciplines` named across the nine departments, read
 * from the data rather than written here. Nobody has to keep a decorative
 * list in step with the departments, and nothing is claimed that a department
 * page does not already claim.
 *
 * The movement is a CSS animation on one element, not a scroll listener:
 * calm, cheap, and it stops when someone rests the pointer on it so the words
 * can be read. Under `prefers-reduced-motion` it does not run at all.
 *
 * The list is duplicated and the pair shifted by exactly half its width,
 * which is what makes the loop seamless. The copy is hidden from screen
 * readers so the disciplines are announced once.
 */
export function DisciplineFlow() {
  const words = disciplines.map((word) => (
    <li
      key={word}
      className="flex shrink-0 items-center whitespace-nowrap px-5 text-[clamp(1rem,1.6vw,1.375rem)] font-medium tracking-snug text-fg-muted md:px-7"
    >
      {word}
      <span aria-hidden="true" className="ml-5 text-brand md:ml-7">
        ·
      </span>
    </li>
  ))

  return (
    <div className="flow relative overflow-hidden py-2">
      <div className="flow-track">
        <ul className="flex shrink-0 items-center">{words}</ul>
        {/* The second run is what makes the loop seamless. It repeats the
            same words, so it is hidden from screen readers. */}
        <ul aria-hidden="true" className="flex shrink-0 items-center">
          {words}
        </ul>
      </div>

      {/* The words fade out rather than being cut off at the page edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent md:w-32"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent md:w-32"
      />
    </div>
  )
}
