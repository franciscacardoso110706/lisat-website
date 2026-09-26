import { Container, Section } from '@/components/ui/Section'
import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { SectionIndex } from '@/components/ui/Technical'
import { site, stats } from '@/data/site'

/**
 * What LISAT is, in as few words as the claim allows, with the figures that
 * make it concrete. Typography and rules rather than cards.
 *
 * This is the section that rides up over the pinned hero, so it carries an
 * opaque surface and sits above it in the stack.
 */
export function Intro() {
  return (
    <Section tone="paper" spacing="loose" id="about" className="z-10">
      <Container wide>
        <SectionIndex index="01" label="What is LISAT" />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-display-md lg:col-span-8">
            A student-led space engineering team at{' '}
            <span className="text-brand">{site.institution}</span>, building a
            satellite that watches Portugal&rsquo;s ocean.
          </h2>

          <div className="lg:col-span-3 lg:col-start-10">
            <div className="prose-lisat">
              <p>
                Founded in {site.founded}, LISAT exists so students can learn
                engineering by doing the real thing — with real deadlines, real
                reviews and real consequences.
              </p>
            </div>
            <TextLink href="/mission/lisat-01" className="mt-6">
              Read the mission
            </TextLink>
          </div>
        </div>

        {/* Figures */}
        <dl className="mt-20 grid grid-cols-2 border-t border-rule md:mt-28 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div
                className={
                  'py-8 md:py-12 ' +
                  (i > 0 ? 'md:border-l md:border-rule md:pl-8' : '')
                }
              >
                <dd className="tabular text-display-sm font-semibold">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-3 text-[0.9375rem] text-fg-muted">
                  {stat.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
