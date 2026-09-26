'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { darkHeroRoutes, headerCta, mainNav, site } from '@/data/site'
import { clsx } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'
import { ScrollProgress } from './ScrollProgress'

/**
 * Primary navigation — labels only, no container.
 *
 * Contrast is the hard part once the pill is gone: the header floats over
 * photography, over paper, and over the dark sections in the middle of a page.
 * Rather than carry its own surface, it *reads* the section currently beneath
 * it and adopts that palette. Everything inside then resolves through the tone
 * variables, so a single class on the header re-colours the logo, the labels,
 * the indicator and the call to action together.
 *
 * The current page is marked by blue type and a small dot beneath it. The dot
 * is one shared element (`layoutId`), so navigating slides it across rather
 * than blinking it out and back.
 */

/**
 * Tracks whether what is *painted* under the header band is dark.
 *
 * An IntersectionObserver is the obvious tool and the wrong one: it reports
 * geometry, not stacking. The homepage hero is sticky, so it keeps
 * intersecting the band long after the light section has been painted over
 * it — the bar went dark on a white background.
 *
 * `elementsFromPoint` returns the hit-test stack in paint order instead, so
 * taking the topmost element that is not part of the header and reading its
 * tone gives what the reader actually sees. It runs at most once per frame
 * while scrolling, and a hit test is cheap.
 */
function useDarkUnderHeader(initial: boolean, route: string) {
  const [dark, setDark] = useState(initial)

  useEffect(() => {
    let frame = 0

    const probe = () => {
      frame = 0
      const y = 40
      const header = document.querySelector('header')
      const points = [window.innerWidth / 2, window.innerWidth * 0.2]

      for (const x of points) {
        const stack = document.elementsFromPoint(x, y)
        const top = stack.find((el) => !header?.contains(el))
        if (!top) continue
        const toned = top.closest('.tone-void, .tone-space, .tone-hull, .tone-paper, .tone-cloud, .tone-ice, .tone-mist')
        if (!toned) continue
        setDark(
          toned.classList.contains('tone-void') ||
            toned.classList.contains('tone-space') ||
            toned.classList.contains('tone-hull'),
        )
        return
      }
      setDark(false)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
    // Re-probes on navigation, where the sections under the bar change.
  }, [route])

  return dark
}

export function Navbar() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  // The open state records which route it was opened on, so a navigation
  // closes the menu without needing an effect to reset it.
  const [menu, setMenu] = useState({ open: false, route: pathname })
  const menuOpen = menu.open && menu.route === pathname

  const onDark = useDarkUnderHeader(
    (darkHeroRoutes as readonly string[]).includes(pathname),
    pathname,
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // The mobile sheet is light, so the bar above it must be too.
  const dark = onDark && !menuOpen

  return (
    <>
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-out',
          dark && 'tone-void',
          scrolled || menuOpen
            // Opaque enough to be a bar. At 60% the blur smeared whatever was
            // beneath it, which reads as a dirty rectangle rather than glass
            // whenever the section under the bar contains dark photography.
            ? 'border-b border-rule bg-surface/[0.88] backdrop-blur-lg'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        {/* A soft wash, only while the bar is transparent over photography.
            Not a rectangle — it has no edge of its own. */}
        {dark && !scrolled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[11rem] bg-gradient-to-b from-void/60 via-void/25 to-transparent"
          />
        ) : null}

        {scrolled ? <ScrollProgress /> : null}

        <nav
          aria-label="Main"
          className={clsx(
            'mx-auto flex max-w-content items-center justify-between gutter transition-[height] duration-500 ease-out',
            scrolled ? 'h-[var(--nav-height)]' : 'h-[5.5rem] md:h-[6.75rem]',
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${site.name} — home`}
          >
            {/* The brand mark is a single blue, which only reaches about 4.3:1
                on dark photography. A monochrome light version is used there —
                standard practice for a dark surface, and the brand blue is
                kept everywhere else. Swap in the team's official reversed
                logo when they have one. */}
            <Image
              src={
                dark
                  ? '/images/brand/lisat-logo-light.png'
                  : '/images/brand/lisat-logo.png'
              }
              alt=""
              width={350}
              height={339}
              priority
              className="h-8 w-auto transition-transform duration-500 group-hover:scale-105 md:h-9"
            />
            <span className="sr-only">{site.name}</span>
            <span
              className="nav-label hidden text-fg-muted transition-colors duration-300 group-hover:text-fg lg:block"
              aria-hidden="true"
            >
              {site.tagline}
            </span>
          </Link>

          <LayoutGroup id="nav">
            <ul className="hidden items-center gap-9 xl:gap-12 lg:flex">
              {mainNav.map((item) => {
                const current = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className={clsx(
                        'nav-label group relative block py-2 transition-colors duration-200',
                        current
                          ? 'text-accent'
                          : 'text-fg/85 hover:text-accent',
                      )}
                    >
                      {item.label}

                      {/* Active marker. One shared dot, so it travels. */}
                      {current ? (
                        <motion.span
                          layoutId="nav-dot"
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-control bg-accent"
                          style={{
                            boxShadow: '0 0 8px 1px rgb(var(--accent) / 0.55)',
                          }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 420, damping: 34 }
                          }
                        />
                      ) : (
                        // A hint of the same mark on hover, so the affordance
                        // matches the active language without a background.
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 scale-50 rounded-control bg-accent opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-60"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </LayoutGroup>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={headerCta.href}
              className="nav-label group hidden items-center gap-2.5 py-2 text-fg transition-colors duration-200 hover:text-accent lg:inline-flex"
            >
              {headerCta.label}
              <ArrowRight
                className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMenu({ open: !menuOpen, route: pathname })}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-control border border-rule-strong text-fg transition-colors duration-300 hover:border-accent hover:text-accent lg:hidden"
            >
              <span className="sr-only">
                {menuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenu({ open: false, route: pathname })}
        isActive={isActive}
      />
    </>
  )
}
