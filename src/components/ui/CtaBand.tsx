import type { ReactNode } from 'react'
import { Container, Section } from '@/components/ui/Section'
import { clsx } from '@/lib/utils'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'

interface Action {
  label: string
  href: string
  /** Use for mailto: and off-site destinations. */
  external?: boolean
}

/**
 * Closing call-to-action band, reused at the foot of most pages.
 */
export function CtaBand({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  tone = 'void',
}: {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  primary: Action
  secondary?: Action
  tone?: 'void' | 'hull' | 'space'
}) {
  const toneClass = {
    void: 'tone-void',
    hull: 'tone-hull',
    space: 'tone-space',
  } as const

  return (
    <Section tone="paper" spacing="default" clip={false}>
      <Container wide>
        {/* A panel that sits on the page rather than a band cutting across
            it — the dark tone is contained by the radius. */}
        <div
          className={clsx(
            'relative isolate overflow-hidden rounded-feature px-8 py-16 md:px-14 md:py-20',
            toneClass[tone],
          )}
        >
          <OrbitBackdrop
            className="-right-40 -top-32 h-[620px] w-[620px]"
            opacity={0.3}
          />
          {/* Blue light gathering in the corner, so the panel reads as lit. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-control bg-[radial-gradient(closest-side,rgb(var(--glow)/0.22),transparent)] blur-2xl"
          />

          <div className="relative max-w-3xl">
          {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
          <h2 className="mt-5 text-display-sm">
            {title}
          </h2>
          {body ? (
            <p className="mt-5 text-lead text-fg-muted">
              {body}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {primary.external ? (
              <ButtonAnchor href={primary.href} arrow>
                {primary.label}
              </ButtonAnchor>
            ) : (
              <ButtonLink href={primary.href} arrow>
                {primary.label}
              </ButtonLink>
            )}

            {secondary ? (
              secondary.external ? (
                <ButtonAnchor href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonAnchor>
              ) : (
                <ButtonLink href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonLink>
              )
            ) : null}
          </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
