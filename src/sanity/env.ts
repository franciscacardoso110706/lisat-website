/**
 * Sanity connection settings.
 *
 * The project ID and dataset are public values — they appear in every request
 * the browser makes to the content lake and are not secrets. They are
 * `NEXT_PUBLIC_` for that reason. Anything that *is* a secret (an API token)
 * must never be given a `NEXT_PUBLIC_` name, because that prefix is what tells
 * Next.js to inline the value into the JavaScript sent to the browser.
 *
 * Nothing here throws when the variables are missing. The site has to keep
 * building and running before Sanity is configured, and before any content has
 * been migrated — see `hasSanity` below and `src/lib/team-source.ts`.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

/**
 * Pinned API version. Sanity serves the newest API released on or before this
 * date, so pinning it means a future Sanity release cannot change the shape of
 * a response under a site nobody is actively maintaining.
 *
 * Move it forward deliberately, and re-test the team page when you do.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'

/**
 * Whether Sanity is configured at all.
 *
 * Every read is guarded by this. With no project ID the site falls back to the
 * data files in `src/data` and behaves exactly as it did before the CMS
 * existed — which is what makes this integration safe to deploy before the
 * content has been migrated.
 */
export const hasSanity = projectId.length > 0
