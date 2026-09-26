import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

/**
 * Buttons are pills. Hover lifts them a little and deepens the surface rather
 * than swapping a flat colour, which is what makes them feel like objects on
 * the page instead of coloured rectangles.
 */
const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-control font-display font-medium transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 motion-reduce:transform-none'

const variants: Record<Variant, string> = {
  primary: 'bg-accent-solid text-accent-fg shadow-lift hover:bg-accent-hover hover:shadow-lift-lg',
  secondary:
    'border border-current/25 text-current hover:border-current/60 hover:bg-current/[0.06]',
  ghost: 'text-current hover:text-accent',
}

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-[0.9375rem]',
}

function inner(children: ReactNode, arrow: boolean) {
  return (
    <>
      {children}
      {arrow ? (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  )
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  children: ReactNode
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {inner(children, arrow)}
    </Link>
  )
}

interface ExternalButtonProps extends ComponentProps<'a'> {
  variant?: Variant
  size?: Size
  arrow?: boolean
  children: ReactNode
}

/** For mailto: and off-site links, which should not use next/link. */
export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  children,
  ...props
}: ExternalButtonProps) {
  return (
    <a className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {inner(children, arrow)}
    </a>
  )
}

/** Understated text link with a sliding arrow — used to close sections. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'group inline-flex items-center gap-2 font-display text-sm font-medium text-accent transition-colors hover:text-fg',
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )
}
