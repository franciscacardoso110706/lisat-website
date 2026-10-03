import type { Metadata } from 'next'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { OrbitBackdrop } from '@/components/ui/OrbitBackdrop'
import { Reveal } from '@/components/ui/Reveal'
import { contact, pressMentions, site, socials } from '@/data/site'
import { board } from '@/data/team'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with LISAT about partnerships, press and recruitment. ${contact.email}, ${site.institution}, ${site.city}.`,
  alternates: { canonical: '/contact' },
}

/** The routes we want people to use, rather than a single catch-all address. */
const routes = [
  {
    id: 'partnerships',
    title: 'Partnerships & sponsorship',
    body: 'Companies, laboratories and institutions interested in supporting the mission.',
    action: 'Propose a partnership',
    href: contact.partnershipsMailto,
  },
  {
    id: 'press',
    title: 'Press & media',
    body: 'Interviews, imagery, and information about the team or LISAT-01.',
    action: 'Contact for press',
    href: contact.pressMailto,
  },
  {
    id: 'join',
    title: 'Joining the team',
    body: 'Students who want to work on the satellite, in any department.',
    action: 'Ask about joining',
    href: contact.joinMailto,
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative tone-cloud overflow-hidden rounded-b-feature pt-[var(--nav-height)]">
        <OrbitBackdrop
          className="-right-40 -top-32 hidden h-[640px] w-[640px] lg:block"
          opacity={0.4}
        />
        <Container wide className="relative py-20 md:py-28">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Contact
          </p>
          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.98] tracking-tightest">
            Talk to the team.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
            Everything reaches the same inbox, and a member of the relevant
            department answers. Pick whichever route fits; it just helps us route
            it faster.
          </p>

          {/* Primary details */}
          <address className="mt-14 grid gap-px border border-rule bg-rule not-italic sm:grid-cols-3">
            <a
              href={`mailto:${contact.email}`}
              className="group bg-surface-raised p-6 transition-colors hover:bg-surface"
            >
              <Mail className="h-5 w-5 text-accent" aria-hidden="true" strokeWidth={1.5} />
              <p className="eyebrow mt-4 text-fg-faint">Email</p>
              <p className="mt-1.5 text-sm text-fg transition-colors group-hover:text-accent md:text-base">
                {contact.email}
              </p>
            </a>

            <a
              href={contact.phoneHref}
              className="group bg-surface-raised p-6 transition-colors hover:bg-surface"
            >
              <Phone className="h-5 w-5 text-accent" aria-hidden="true" strokeWidth={1.5} />
              <p className="eyebrow mt-4 text-fg-faint">Phone</p>
              <p className="mt-1.5 text-sm text-fg transition-colors group-hover:text-accent md:text-base">
                {contact.phone}
              </p>
            </a>

            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group bg-surface-raised p-6 transition-colors hover:bg-surface"
            >
              <MapPin className="h-5 w-5 text-accent" aria-hidden="true" strokeWidth={1.5} />
              <p className="eyebrow mt-4 text-fg-faint">Where we are</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg transition-colors group-hover:text-accent">
                {contact.address}
                <span className="mt-0.5 block text-fg-faint">
                  {contact.addressNote}
                </span>
              </p>
            </a>
          </address>
        </Container>
      </section>

      {/* Routes */}
      <Section tone="paper" spacing="loose">
        <Container wide>
          <SectionHeading
            eyebrow="How can we help"
            index="01"
            title="Pick a route"
          />

          <ul className="mt-12 grid gap-px bg-rule md:grid-cols-3">
            {routes.map((route, i) => (
              <Reveal as="li" key={route.id} delay={i * 0.07}>
                <div id={route.id} className="flex h-full flex-col bg-surface p-6 md:p-7">
                  <h3 className="text-lg font-medium tracking-snug md:text-xl">
                    {route.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                    {route.body}
                  </p>
                  <a
                    href={route.href}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-fg"
                  >
                    {route.action}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Board + social */}
      <Section tone="cloud" join="soft" spacing="loose">
        <div
          className="grid-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <Container wide className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Leadership"
                index="02"
                title="The board"
                lead="For anything that needs a direct answer from the people running the project."
              />

              <ul className="mt-10 border-t border-rule">
                {board.map((member) => (
                  <li
                    key={member.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4"
                  >
                    <span>
                      <span className="block text-base text-fg">
                        {member.name}
                      </span>
                      <span className="block text-sm text-fg-muted">
                        {member.role}
                      </span>
                    </span>
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="font-mono text-xs text-accent transition-colors hover:text-fg"
                      >
                        {member.email}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <SectionHeading
                eyebrow="Elsewhere"
                index="03"
                title="Follow the mission"
                lead="We post progress, lab work and events as they happen."
              />

              <ul className="mt-10 border-t border-rule">
                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between border-b border-rule py-4 text-base text-fg transition-colors hover:text-accent"
                    >
                      {social.label}
                      <ArrowUpRight
                        className="h-4 w-4 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Moved here from the homepage close, which is now a single
                  call to join. */}
              <h3 className="eyebrow mt-14 text-fg-faint">In the press</h3>
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
        </Container>
      </Section>
    </>
  )
}
