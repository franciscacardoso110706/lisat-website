import Studio from './Studio'
import { hasSanity } from '@/sanity/env'

/**
 * Sanity Studio, embedded at /studio.
 *
 * The optional catch-all segment is required: the Studio is a single-page
 * application that routes itself, so every path beneath /studio has to reach
 * this one page.
 *
 * `force-static` prerenders the shell; the Studio then loads, authenticates
 * against Sanity and fetches content in the browser. Nothing about the
 * content is baked into this page.
 *
 * The Studio itself is imported through `./Studio`, a client component — see
 * the note there for why the config must not reach the server graph.
 */
export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  // Without a project ID the Studio would boot and fail with an error aimed at
  // developers. This is aimed at whoever is actually setting the site up.
  if (!hasSanity) return <StudioNotConfigured />

  return <Studio />
}

function StudioNotConfigured() {
  return (
    <div className="tone-paper flex min-h-screen items-center justify-center px-6 py-20">
      <div className="max-w-xl">
        <p className="eyebrow text-accent">Sanity Studio</p>
        <h1 className="mt-6 text-display-sm">Not configured yet.</h1>
        <p className="mt-6 text-lead text-fg-muted">
          The Studio needs to know which Sanity project to open. Create a file
          called <code className="font-mono text-fg">.env.local</code> in the
          root of the website, copy the contents of{' '}
          <code className="font-mono text-fg">.env.local.example</code> into it,
          and fill in the project ID from{' '}
          <a
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent underline-offset-4 hover:underline"
          >
            sanity.io/manage
          </a>
          . Then restart the development server.
        </p>
        <p className="mt-6 text-sm text-fg-faint">
          Until then the website reads its team from the files in{' '}
          <code className="font-mono">src/data</code>, exactly as before.
        </p>
      </div>
    </div>
  )
}
