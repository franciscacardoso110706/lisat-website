'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

/**
 * The client boundary for Sanity Studio.
 *
 * This exists so that `sanity.config.ts` — and through it the whole `sanity`
 * package — is never pulled into the React Server Components graph. It has to
 * be that way round: Sanity depends on `swr`, whose `react-server` build has
 * no default export, so a server module importing the config fails the build
 * with an error that points at `swr` rather than at the cause.
 *
 * The Studio is a browser application in any case. Nothing about it belongs on
 * the server.
 */
export default function Studio() {
  return <NextStudio config={config} />
}
