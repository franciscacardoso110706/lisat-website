import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Section'
import { Open } from '@/components/team/Open'

/**
 * The way in.
 *
 * A small square object at the end of the wall rather than a full-width
 * announcement — the page has just shown thirty-odd faces, and the closing
 * note should read as one more object in that composition, not as a banner
 * shouting over it.
 *
 * The photograph beside it keeps the left half from being dead space and
 * keeps the page's last impression photographic rather than typographic.
 *
 * OPEN again, at the scale the object deserves: the square arrives slightly
 * compressed and settles. Same grammar as the hero photograph, quieter
 * sentence.
 */
export function TeamCta({
  href,
  photo,
}: {
  href: string
  photo: { src: string; alt: string }
}) {
  return (
    <Section tone="cloud" join="soft" spacing="none" className="py-16 md:py-24">
      <Container wide>
        <div className="grid items-end gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] rounded-bl-[4rem] md:aspect-[3/2] md:rounded-[2rem] md:rounded-bl-[6rem]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 lg:col-start-9">
            <Open radius="2rem" className="overflow-hidden rounded-[2rem]">
              <div className="tone-void flex aspect-square flex-col justify-between bg-brand p-7 md:p-9">
                <p className="text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold leading-[1.05] tracking-tightest text-cloud">
                  We&rsquo;re
                  <br />
                  missing you.
                </p>

                <a
                  href={href}
                  className="group inline-flex items-center gap-2.5 self-start rounded-control bg-cloud px-6 py-3 font-display text-[0.9375rem] font-medium text-navy transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  Join LISAT
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Open>
          </div>
        </div>
      </Container>
    </Section>
  )
}
