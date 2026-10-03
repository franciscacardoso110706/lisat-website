import { Container } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center tone-void overflow-hidden pt-[var(--nav-height)]">
      <OrbitBackdrop
        className="-right-40 -top-20 hidden h-[640px] w-[640px] lg:block"
        opacity={0.35}
      />
      <Container wide className="relative py-20">
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest">
          Signal lost.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
          This page is not in orbit. It may have moved when we rebuilt the site.
          Try the mission, the team, or the latest updates.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/mission/lisat-01" variant="secondary">
            About LISAT-01
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
