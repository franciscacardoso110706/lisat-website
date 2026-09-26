import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { contact, footerNav, site, socials } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="tone-void relative border-t border-rule">
      <div
        className="grid-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-content gutter py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Identity */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/brand/lisat-logo.png"
                alt={site.name}
                width={350}
                height={339}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
              {site.tagline}. A student-led team at {site.institution} building{' '}
              LISAT-01, a 1U CubeSat that collects maritime AIS signals from orbit.
            </p>

            <address className="mt-8 space-y-3 not-italic">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {contact.email}
              </a>
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-start gap-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {contact.address}
                  <br />
                  <span className="text-fg-faint">{contact.addressNote}</span>
                </span>
              </a>
            </address>
          </div>

          {/* Navigation */}
          <div className="grid gap-10 sm:grid-cols-3 md:col-span-6 md:col-start-7">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow text-fg-faint">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="mt-14 border-t border-rule pt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {s.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-col gap-3 font-mono text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              {site.institution} · {site.city}, {site.country}
            </p>
            {/*
              The way in for the team, kept deliberately quiet: this is a
              public site and a prominent "Log in" would read as something a
              visitor is meant to do.

              It is not hidden for security. Anyone may follow it; Sanity asks
              who they are and shows nothing to an account that is not a member
              of the project. Obscurity is not the control here.
            */}
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              Team login
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
