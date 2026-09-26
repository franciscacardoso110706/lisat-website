'use client'

import { useState } from 'react'
import { Check, Link2, Linkedin, Instagram } from 'lucide-react'
import { socials } from '@/data/site'
import { clsx } from '@/lib/utils'

/**
 * Three ways to pass an article on.
 *
 * Only what actually works. LinkedIn takes a URL and opens a composer, so it
 * shares this article. Instagram has no such thing — a link there can only go
 * to the profile, so that is what it is labelled as, rather than a share
 * button that quietly does something else.
 */
export function ArticleShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const instagram = socials.find((s) => s.label === 'Instagram')?.href
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused outright; the address bar still works.
      setCopied(false)
    }
  }

  return (
    <div className="ar-share">
      <button
        type="button"
        onClick={() => void copy()}
        className={clsx('ar-share-btn', copied && 'is-done')}
        aria-label={copied ? 'Link copied' : `Copy link to ${title}`}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="ar-share-label">{copied ? 'Copied' : 'Copy link'}</span>
      </button>

      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="ar-share-btn ar-share-btn--icon"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
      </a>

      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="ar-share-btn ar-share-btn--icon"
          aria-label="LISAT on Instagram"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}
