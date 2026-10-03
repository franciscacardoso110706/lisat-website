import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Linkedin } from 'lucide-react'
import { footerNav, site, socials } from '@/data/site'

/**
 * The close of every page.
 *
 * Quiet on purpose, after pages that are not: the mark and the name on the
 * left, three short columns of links on the right, one long hairline, and the
 * two social accounts centred above the copyright. No descriptions, no
 * address block, no decoration; Contact carries all of that.
 *
 * The social accounts are icons only. Their names are for screen readers.
 */

const socialIcons: Record<string, typeof Instagram> = {
  Instagram,
  LinkedIn: Linkedin,
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ft tone-void">
      <div className="mx-auto max-w-content gutter">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Identity */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex flex-col items-start gap-4">
              <Image
                src="/images/brand/lisat-logo.png"
                alt={site.name}
                width={350}
                height={339}
                className="h-11 w-auto"
              />
              <span className="nav-label text-fg-muted">{site.tagline}</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:col-span-6 md:col-start-7">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow text-accent">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link href={item.href} className="ft-link">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="ft-rule" aria-hidden="true" />

        <div className="flex flex-col items-center gap-6">
          <ul className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = socialIcons[s.label]
              if (!Icon) return null
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ft-social"
                    aria-label={`${site.name} on ${s.label} (opens in a new tab)`}
                  >
                    <Icon className="h-[1.0625rem] w-[1.0625rem]" strokeWidth={1.6} aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>

          <p className="text-center font-mono text-[0.6875rem] tracking-[0.04em] text-fg-faint">
            © {year} {site.name}. All rights reserved.
            {/*
              The way in for the team, kept deliberately quiet: this is a
              public site and a prominent "Log in" would read as something a
              visitor is meant to do. It is not hidden for security; Sanity
              asks who you are and shows nothing to an account outside the
              project.
            */}
            <span className="mx-2 opacity-50" aria-hidden="true">
              ·
            </span>
            <Link href="/studio" className="transition-colors hover:text-fg">
              Team login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
