import { ImageReveal } from '@/components/ui/ImageReveal'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { SectionIndex } from '@/components/ui/Technical'
import { RevealLines } from '@/components/ui/RevealLines'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { recruitment, statusCopy } from '@/data/recruitment'
import { pressMentions } from '@/data/site'

/**
 * Closing call to action. Reads recruitment status from data, so the copy and
 * the button change automatically when a cycle opens or closes.
 */
export function JoinCta() {
  const copy = statusCopy[recruitment.status]

  return (
    <Section tone="void" join="curve" spacing="loose" id="join">
      <OrbitBackdrop
        className="-left-52 -top-40 h-[820px] w-[820px]"
        opacity={0.35}
      />

      <Container wide className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionIndex index="07" label="Join us" />
            <RevealLines
              className="mt-9 text-display-md"
              lines={['Build something', 'that goes to space.']}
            />
            <p className="mt-6 max-w-xl text-lead text-fg-muted">
              You do not need previous space experience. You need curiosity,
              consistency, and the willingness to own a piece of a real
              spacecraft.
            </p>

            <div className="mt-8 inline-flex items-center gap-2.5 rounded-control border border-rule-strong px-5 py-2.5">
              <span
                className={
                  'h-2 w-2 rounded-full ' +
                  (recruitment.status === 'open' ? 'bg-signal' : 'bg-fg-faint')
                }
                aria-hidden="true"
              />
              <span className="eyebrow text-fg-muted">{copy.badge}</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/join-us" arrow>
                {copy.cta}
              </ButtonLink>
              <ButtonLink href="/departments" variant="secondary">
                See the departments
              </ButtonLink>
            </div>
          </div>

          {/* Press */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <ImageReveal
                src="/images/updates/onboarding-01.jpg"
                alt="New LISAT members during onboarding"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/3]"
              />
            </Reveal>

            <div className="mt-10">
              <h3 className="eyebrow text-fg-faint">In the press</h3>
              <ul className="mt-4 space-y-4">
                {pressMentions.map((mention) => (
                  <li key={mention.url}>
                    <a
                      href={mention.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block border-t border-rule pt-4"
                    >
                      <p className="text-sm leading-relaxed text-fg-muted transition-colors group-hover:text-fg">
                        &ldquo;{mention.quote}&rdquo;
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-accent">
                        {mention.outlet}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
