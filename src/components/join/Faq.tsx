import { Plus } from 'lucide-react'
import type { FaqItem } from '@/lib/types'

/**
 * FAQ built on native <details>, so it is keyboard accessible, works without
 * JavaScript and is readable by search engines.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-rule">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-fg transition-colors hover:text-accent md:text-lg [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              className="h-4 w-4 shrink-0 text-fg-faint transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-prose pb-6 text-sm leading-relaxed text-fg-muted md:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
