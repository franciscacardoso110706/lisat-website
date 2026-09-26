import Image from 'next/image'
import { Container } from '@/components/ui/Section'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { mission, specs } from '@/data/mission'
import { formatDate } from '@/lib/utils'

/**
 * Mission hero: the spacecraft on one side, what it is and where it stands on
 * the other. Annotations around the render come from the published specs, so
 * nothing here is invented.
 */

const annotations = [
  { label: 'Form factor', value: '1U CubeSat' },
  { label: 'Envelope', value: '10 × 10 × 10 cm' },
  { label: 'Payload', value: 'AIS receiver' },
]

export function MissionHero() {
  const ribbon = specs.filter((s) => !s.provisional).slice(0, 5)

  return (
    <section className="tone-void relative overflow-hidden rounded-b-feature pt-[var(--nav-height)]">
      <div
        className="grid-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <OrbitBackdrop
        className="-right-52 -top-32 hidden h-[820px] w-[820px] lg:block"
        opacity={0.45}
      />

      <Container wide className="relative pb-14 pt-16 md:pb-20 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Statement */}
          <div className="lg:col-span-6">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Mission
            </p>

            <h1 className="mt-6 text-[clamp(3.25rem,10vw,7rem)] leading-[0.88] tracking-tightest">
              {mission.name}
            </h1>

            <p className="mt-4 text-[clamp(1.375rem,3vw,2.25rem)] leading-tight tracking-snug text-accent">
              {mission.headline}
            </p>

            <div className="prose-lisat mt-8 max-w-xl">
              <p>{mission.summary}</p>
            </div>

            {/* Status */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-signal pl-4">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-signal"
                aria-hidden="true"
              />
              <span className="eyebrow text-signal">Current status</span>
              <span className="text-[0.9375rem] text-fg">{mission.status}</span>
              <time
                dateTime={mission.statusDate}
                className="font-mono text-xs text-fg-faint"
              >
                {formatDate(mission.statusDate)}
              </time>
            </div>
          </div>

          {/* Spacecraft */}
          <div className="lg:col-span-6">
            <figure className="relative">
              <div className="relative aspect-square overflow-hidden rounded-panel bg-void">
                <Image
                  src="/images/mission/render-cubesat.jpg"
                  alt="Render of the LISAT-01 1U CubeSat in low Earth orbit"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Technical annotations */}
              <figcaption className="mt-5 grid grid-cols-3 border-t border-rule">
                {annotations.map((a, i) => (
                  <div
                    key={a.label}
                    className={
                      'pt-3 ' + (i > 0 ? 'border-l border-rule pl-4' : '')
                    }
                  >
                    <span className="eyebrow block text-fg-faint">{a.label}</span>
                    <span className="mt-1.5 block font-mono text-xs text-fg md:text-[0.8125rem]">
                      {a.value}
                    </span>
                  </div>
                ))}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Spec ribbon */}
        <dl className="mt-16 grid grid-cols-2 border-t border-rule sm:grid-cols-3 lg:grid-cols-5">
          {ribbon.map((spec, i) => (
            <div
              key={spec.label}
              className={
                'py-6 ' + (i > 0 ? 'lg:border-l lg:border-rule lg:pl-6' : '')
              }
            >
              <dt className="eyebrow text-fg-faint">{spec.label}</dt>
              <dd className="mt-2 text-[0.9375rem] text-fg md:text-base">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
