'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Hides the site's own header, footer and skip link on /studio.
 *
 * Sanity Studio is a full application with its own navigation; wrapping it in
 * the LISAT header and footer would be confusing and would break its layout.
 * The alternative — moving every existing route into a route group so the
 * Studio can have a second root layout — would touch every page on the site
 * to solve a problem this handles in four lines.
 *
 * Server components can be passed through here as `children`, so the footer
 * stays a server component.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null
  return <>{children}</>
}
