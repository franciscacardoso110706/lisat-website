import type { Config } from 'tailwindcss'

/**
 * LISAT design tokens.
 *
 * The palette is defined once, as CSS custom properties, in `globals.css`:
 * nine brand primitives (`--lisat-*`) and a layer of semantic tokens
 * (`--fg`, `--surface`, `--accent`, `--brand`, `--glow`, `--rule`) that each
 * `tone-*` class rebinds. This file only gives those tokens Tailwind names.
 *
 * The site is light-first. Warm white, cloud, ice and mist are the everyday
 * surfaces; midnight and navy are reserved for the few moments that are meant
 * to land — the homepage opening, the departments, the updates cover, closing
 * calls to action and the footer.
 *
 * Contrast, worst case (deepest light surface / lightest dark surface):
 *
 *   fg      #142033 on mist  13.30    fg      #F6F8FC on hull  15.38
 *   muted   #445569 on mist   6.21    muted   #A9B8D0 on hull   8.14
 *   faint   #53657D on mist   4.85    faint   #7E8EA8 on hull   4.92
 *   accent  #2764C9 on mist   4.55    accent  #7FA9EB on hull   6.84
 *
 * Every one clears WCAG AA. `brand` (#3A76D9) is deliberately not on that
 * list: at 4.28:1 on warm white it is a large-text and decorative colour, not
 * a body-copy one. Use `text-accent` for anything small.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /**
         * Tone-aware. Resolved by the current section's tone class, so the
         * same class name stays legible on any surface.
         */
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted) / <alpha-value>)',
          faint: 'rgb(var(--fg-faint) / <alpha-value>)',
        },
        accent: {
          /** Accent *text*. For a filled blue surface use `accent-solid`. */
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          /** A filled blue surface; pair it with `text-accent-fg`. */
          solid: 'rgb(var(--accent-solid) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          /** A card lifted off the current surface, or a well sunk into it. */
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          sunken: 'rgb(var(--surface-sunken) / <alpha-value>)',
        },
        /** The LISAT blue itself, at full strength on every tone. */
        brand: {
          DEFAULT: 'rgb(var(--lisat-blue) / <alpha-value>)',
          soft: 'rgb(var(--lisat-blue-soft) / <alpha-value>)',
          deep: 'rgb(var(--lisat-blue-deep) / <alpha-value>)',
        },
        /** Blue light. Lifted a step on dark tones so it reads as emission. */
        glow: 'rgb(var(--glow) / <alpha-value>)',
        /**
         * Hairlines are translucent by design, so they stay full colour values
         * and do NOT accept an opacity modifier. Adjust the alpha in the token.
         */
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
        },

        /**
         * Fixed surfaces, used to set a tone or to paint a scrim that has to
         * match one. Light runs warm white -> cloud -> ice -> mist; dark runs
         * midnight -> space -> navy.
         */
        paper: '#FCFCFA',
        cloud: '#F6F8FC',
        ice: '#EAF1FB',
        mist: '#DDE9F8',
        void: '#0C1728',
        space: '#101D33',
        hull: '#142033',

        /** Named palette entries, for the places that need a literal. */
        navy: {
          DEFAULT: '#142033',
          deep: '#0C1728',
          soft: '#1E2E47',
        },
        midnight: '#0C1728',
        slate: {
          DEFAULT: '#53657D',
          deep: '#445569',
        },
        /** Text on dark surfaces. */
        chalk: {
          DEFAULT: '#F6F8FC',
          muted: '#A9B8D0',
          faint: '#7E8EA8',
        },
        // Reserved for live/telemetry status accents only.
        signal: '#D9922E',
      },
      /**
       * Three faces, three jobs.
       *
       * `display` (Montserrat) is the LISAT brand face: headings, navigation,
       * buttons and labels — anything the reader takes in as a shape.
       * `sans` carries running text, where Montserrat's wide, geometric
       * lowercase gets tiring over a paragraph.
       * `poster` (Anton) is for the handful of statements that are meant to
       * be read as a graphic rather than as a sentence. It is not a heading
       * font; if it appears more than once or twice per page it is wrong.
       */
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        poster: ['var(--font-poster)', 'var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      /**
       * The type scale. Every heading on the site comes from this ladder —
       * components should not invent their own `clamp()`.
       *
       * Display sizes are fluid and get tighter tracking as they grow, which
       * is what keeps large type looking set rather than stretched. `xl` is
       * capped against viewport *height* as well as width so the hero still
       * fits on short laptop windows.
       */
      fontSize: {
        'display-xl': [
          'clamp(2.75rem, min(10.5vw, 13vh), 9rem)',
          { lineHeight: '0.9', letterSpacing: '-0.05em' },
        ],
        'display-lg': [
          'clamp(2.5rem, 7vw, 5.5rem)',
          { lineHeight: '0.94', letterSpacing: '-0.045em' },
        ],
        'display-md': [
          'clamp(2rem, 5vw, 3.75rem)',
          { lineHeight: '1.0', letterSpacing: '-0.038em' },
        ],
        'display-sm': [
          'clamp(1.75rem, 3.6vw, 2.75rem)',
          { lineHeight: '1.06', letterSpacing: '-0.032em' },
        ],
        title: [
          'clamp(1.375rem, 2.2vw, 1.875rem)',
          { lineHeight: '1.18', letterSpacing: '-0.025em' },
        ],
        lead: [
          'clamp(1.0625rem, 1.5vw, 1.3125rem)',
          { lineHeight: '1.55', letterSpacing: '-0.01em' },
        ],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      letterSpacing: {
        tightest: '-0.045em',
        snug: '-0.03em',
      },
      /**
       * Radius scale, named by what it is for rather than by size, so a card
       * and an image frame stay in proportion to each other everywhere.
       *
       * The site reads as soft and dimensional rather than as a grid of boxes,
       * and the only way to keep that coherent across thirty-odd components is
       * to stop anyone picking an arbitrary `rounded-[18px]`.
       */
      borderRadius: {
        control: '999px',
        chip: '0.625rem',
        media: '1.25rem',
        card: '1.75rem',
        panel: '2.25rem',
        feature: '3rem',
      },
      boxShadow: {
        /**
         * Depth, lit from above. Cast in navy rather than black: a black
         * shadow on an off-white page turns grey and reads as dirt, while a
         * navy one stays in the palette and reads as air under the surface.
         */
        lift: '0 1px 2px rgb(20 32 51 / 0.04), 0 8px 24px -8px rgb(20 32 51 / 0.10)',
        'lift-lg':
          '0 2px 4px rgb(20 32 51 / 0.05), 0 18px 48px -16px rgb(20 32 51 / 0.14)',
        /** Illumination rather than depth — for elements that are lit. */
        glow: '0 0 0 1px rgb(var(--brand) / 0.14), 0 12px 40px -12px rgb(var(--glow) / 0.35)',
      },
      maxWidth: {
        content: '1280px',
        prose: '66ch',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
