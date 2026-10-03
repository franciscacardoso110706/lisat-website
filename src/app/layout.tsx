import type { Metadata, Viewport } from 'next'
import {
  Anton,
  IBM_Plex_Mono,
  Inter,
  Montserrat,
} from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { site } from '@/data/site'
import './globals.css'

/**
 * The LISAT brand faces.
 *
 * Montserrat is the identity face and carries everything structural —
 * headings, navigation, buttons, labels. Anton is loaded for the two or three
 * places a statement should read as a graphic; it is opt-in per element via
 * `font-poster`, never a default.
 *
 * The brand's text face is Open Sauce, which is not on Google Fonts and is not
 * licensed in this project. Rather than ship an unofficial copy, running text
 * keeps Inter — a close neighbour in width and x-height, and the face the site
 * was already set in.
 */
const display = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const poster = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poster',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /* The homepage tab reads "LISAT"; every other page shows its own title and
     nothing after it ("Team", not "Team · LISAT"). The tagline lives on in
     the share cards below. */
  title: {
    default: site.name,
    template: '%s',
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'LISAT',
    'CubeSat',
    'nanosatellite',
    'AIS',
    'Instituto Superior Técnico',
    'Portugal',
    'space engineering',
    'student satellite',
    'CubeSat Portugal',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  /* Midnight, matching the dark opening of the homepage — the browser chrome
     should continue the hero rather than cut a light band above it. */
  themeColor: '#0C1728',
  /* The document surface is light, so form controls and scrollbars should be. */
  colorScheme: 'light',
}

/** Organisation schema, so search engines understand who LISAT is. */
const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.fullName,
  alternateName: site.name,
  url: site.url,
  description: site.description,
  foundingDate: String(site.founded),
  parentOrganization: { '@type': 'CollegeOrUniversity', name: site.institution },
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressCountry: 'PT',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${poster.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
        {/* The Studio at /studio is a full application of its own, so the
            site's header, footer and skip link step aside for it. */}
        <SiteChrome>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
        </SiteChrome>
        <main id="main">{children}</main>
        <SiteChrome>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  )
}
