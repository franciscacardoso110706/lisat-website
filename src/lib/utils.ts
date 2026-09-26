/** Tiny class-name joiner. Keeps component markup readable without a dependency. */
export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** "24 December 2025" — the format used across the site. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "Dec 2025" — the compact form used on cards and timelines. */
export function formatDateShort(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Rough reading time, used when an article does not declare one. */
export function readingTime(paragraphs: string[]): number {
  const words = paragraphs.join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}
