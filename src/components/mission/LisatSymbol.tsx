/**
 * The LISAT logo, as it actually is, built so it can be drawn on by scroll.
 *
 * Every coordinate here comes from the official vector at
 * `public/images/brand/lisat-logo.svg`. That matters for the wordmark in
 * particular: the letters are not centred in the circle, they run across it —
 * "LI" sits outside to the left and "SAT" sits inside — and that offset is the
 * mark. Setting the name in the site's display face and putting a circle
 * behind it produces something that is not this logo.
 *
 * The two rings are filled donut paths in the official file. They are redrawn
 * here as stroked circles on the same centrelines, with the same widths
 * (outer 94.44 / inner 87.93 → r 91.19, width 6.51; and 20.18 / 14.87 → r
 * 17.53, width 5.31), which renders identically and can be animated with
 * `stroke-dashoffset`. The letters keep the official fills and transforms
 * untouched.
 */

const ORBIT = { cx: 225.36, cy: 194.62, r: 91.19, stroke: 6.51 }
const SATELLITE = { cx: 275.12, cy: 118.17, r: 17.53, stroke: 5.31 }

/** The wordmark, straight from the official file. In drawing order. */
const LETTERS: { id: string; transform: string; d: string }[] = [
  {
    id: 'L',
    transform: 'translate(55.874225 215.185827)',
    d: 'M 30.515625 0 L 3.96875 0 L 3.96875 -42.734375 L 14.65625 -42.734375 L 14.65625 -9.765625 L 30.515625 -9.765625 Z M 30.515625 0 ',
  },
  {
    id: 'I',
    transform: 'translate(104.868095 215.185827)',
    d: 'M 14.953125 0 L 4.265625 0 L 4.265625 -42.734375 L 14.953125 -42.734375 Z M 14.953125 0 ',
  },
  {
    id: 'S',
    transform: 'translate(152.845092 215.185827)',
    d: 'M 18.1875 0.796875 C 13.0625 0.796875 8.941406 -0.523438 5.828125 -3.171875 C 2.710938 -5.816406 1.113281 -9.644531 1.03125 -14.65625 L 11.59375 -14.65625 C 11.71875 -10.050781 13.894531 -7.75 18.125 -7.75 C 19.957031 -7.75 21.34375 -8.113281 22.28125 -8.84375 C 23.21875 -9.582031 23.6875 -10.582031 23.6875 -11.84375 C 23.6875 -12.820312 23.347656 -13.644531 22.671875 -14.3125 C 22.003906 -14.988281 21.171875 -15.539062 20.171875 -15.96875 C 19.179688 -16.394531 17.726562 -16.929688 15.8125 -17.578125 C 12.957031 -18.515625 10.632812 -19.429688 8.84375 -20.328125 C 7.0625 -21.222656 5.507812 -22.566406 4.1875 -24.359375 C 2.863281 -26.148438 2.203125 -28.46875 2.203125 -31.3125 C 2.203125 -33.675781 2.863281 -35.78125 4.1875 -37.625 C 5.507812 -39.476562 7.359375 -40.925781 9.734375 -41.96875 C 12.117188 -43.007812 14.835938 -43.53125 17.890625 -43.53125 C 20.648438 -43.53125 23.238281 -43.007812 25.65625 -41.96875 C 28.082031 -40.925781 30.054688 -39.316406 31.578125 -37.140625 C 33.109375 -34.960938 33.894531 -32.25 33.9375 -29 L 23.5625 -29 C 23.519531 -30.832031 23.03125 -32.285156 22.09375 -33.359375 C 21.15625 -34.441406 19.753906 -34.984375 17.890625 -34.984375 C 16.378906 -34.984375 15.195312 -34.625 14.34375 -33.90625 C 13.488281 -33.195312 13.0625 -32.253906 13.0625 -31.078125 C 13.0625 -29.691406 13.679688 -28.628906 14.921875 -27.890625 C 16.160156 -27.160156 18.125 -26.367188 20.8125 -25.515625 C 23.664062 -24.578125 26.003906 -23.648438 27.828125 -22.734375 C 29.660156 -21.816406 31.238281 -20.453125 32.5625 -18.640625 C 33.882812 -16.835938 34.546875 -14.488281 34.546875 -11.59375 C 34.546875 -9.320312 33.90625 -7.25 32.625 -5.375 C 31.34375 -3.5 29.46875 -2 27 -0.875 C 24.539062 0.238281 21.601562 0.796875 18.1875 0.796875 Z M 18.1875 0.796875 ',
  },
  {
    id: 'A',
    transform: 'translate(247.631327 173.925281)',
    d: 'M -21.1875 14.34375 L -30.703125 42.734375 L -41.9375 42.734375 L -26.0625 0 L -16.109375 0 L -0.1875 42.734375 L -11.65625 42.734375 Z M -21.1875 14.34375 ',
  },
  {
    id: 'T',
    transform: 'translate(263.324505 215.185827)',
    d: 'M 21.734375 0 L 11.046875 0 L 11.046875 -32.96875 L 0.609375 -32.96875 L 0.609375 -42.734375 L 32.171875 -42.734375 L 32.171875 -32.96875 L 21.734375 -32.96875 Z M 21.734375 0 ',
  },
]

export function LisatSymbol({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 375 375"
      fill="none"
      className={className}
      // The rings are stroked from their centreline, so the stroke would be
      // clipped at the extremes of the box without this.
      style={{ overflow: 'visible' }}
    >
      {/*
        `pathLength={1}` normalises the dash maths: the CSS that draws these
        works in fractions of the path and never needs the real circumference.
      */}
      <circle
        data-symbol="orbit"
        cx={ORBIT.cx}
        cy={ORBIT.cy}
        r={ORBIT.r}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={ORBIT.stroke}
        strokeLinecap="round"
        // Drawing starts at the top rather than at three o'clock, so the line
        // grows away towards the satellite it will meet.
        transform={`rotate(-90 ${ORBIT.cx} ${ORBIT.cy})`}
      />

      <circle
        data-symbol="satellite"
        cx={SATELLITE.cx}
        cy={SATELLITE.cy}
        r={SATELLITE.r}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={SATELLITE.stroke}
        strokeLinecap="round"
      />

      {/* The wordmark, in its real position across the circle. */}
      <g data-symbol="word" fill="currentColor">
        {/*
          The official transform goes on a wrapping group, never on the path.
          A CSS `transform` replaces an SVG `transform` attribute outright, so
          animating the path directly threw every letter out of position —
          which is exactly what the wordmark's placement across the circle
          cannot survive.
        */}
        {LETTERS.map((letter, i) => (
          <g key={letter.id} transform={letter.transform}>
            <path data-letter={i} d={letter.d} />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** How many letters the wordmark has, for staggering their arrival. */
export const LETTER_COUNT = LETTERS.length
