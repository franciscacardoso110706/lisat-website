'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { contact, mobileNav, socials } from '@/data/site'
import { clsx } from '@/lib/utils'

/**
 * Full-screen navigation for small screens. Locks background scroll while open
 * and closes on Escape.
 */
export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean
  onClose: () => void
  isActive: (href: string) => boolean
}) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const items = mobileNav

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-surface pt-[var(--nav-height)] lg:hidden"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="grid-overlay pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          <nav
            aria-label="Mobile"
            className="relative flex-1 overflow-y-auto gutter pb-10 pt-8"
          >
            <ul className="space-y-1">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduced ? undefined : { opacity: 0, y: 12 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 + i * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={clsx(
                      'flex items-baseline justify-between border-b border-rule py-4 font-display text-2xl font-medium tracking-snug transition-colors',
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-fg hover:text-accent',
                    )}
                  >
                    {item.label}
                    <span
                      className="tabular font-mono text-[0.625rem] opacity-40"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 space-y-6">
              <div>
                <p className="eyebrow text-fg-faint">Contact</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 inline-block text-base text-fg hover:text-accent"
                >
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="eyebrow text-fg-faint">Follow</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
                      >
                        {s.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
