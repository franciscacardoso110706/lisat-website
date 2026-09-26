import 'server-only'

import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, hasSanity, projectId } from './env'

/**
 * The website's read-only connection to the content lake.
 *
 * `import 'server-only'` is the guard that matters here: if any client
 * component ever imports this file, the build fails rather than shipping the
 * query layer to the browser. The site only ever reads, and only ever reads
 * published documents, so:
 *
 *   - no token is configured. An unauthenticated client can read a public
 *     dataset and nothing else. It cannot write, and it cannot see drafts.
 *   - `perspective: 'published'` makes that explicit rather than incidental —
 *     work in progress in the Studio stays invisible until someone presses
 *     Publish.
 *   - `useCdn: true` reads through Sanity's cache, which is both faster and
 *     one less thing that can rate-limit the site.
 *
 * If a token ever becomes necessary (for previewing drafts, say), it belongs
 * in a server-only variable such as `SANITY_API_READ_TOKEN` — never one
 * prefixed `NEXT_PUBLIC_`.
 */
export const sanityClient: SanityClient | null = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

/**
 * Runs a query, or returns `null` if Sanity is not configured or the read
 * fails.
 *
 * `null` rather than an empty array, deliberately. The caller has to be able
 * to tell "the CMS said there is nobody" apart from "the CMS did not answer",
 * because those two need opposite responses: the first is the truth, the
 * second must fall back to the data in the repository. Collapsing them into
 * an empty array once emptied the entire team page during a network blip and
 * baked the result into a static build.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T | null> {
  if (!sanityClient) return null

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        // Published edits appear within a minute without a redeploy. Lower
        // this if the team wants changes to land faster; the cost is more
        // requests to Sanity.
        revalidate: options.revalidate ?? 60,
        tags: options.tags,
      },
    })
  } catch (error) {
    console.error('[sanity] read failed; the site will use its local data:', error)
    return null
  }
}
