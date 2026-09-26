import type { NextConfig } from 'next'

/**
 * Redirects from the previous Wix site.
 *
 * The old URLs are already indexed and linked from press articles and social
 * posts, so every one of them is mapped onto its replacement. Remove an entry
 * only once you are confident nothing points at it any more.
 */
const legacyRedirects: { source: string; destination: string }[] = [
  // Top level
  { source: '/blank-4', destination: '/' },
  { source: '/projects-1', destination: '/mission/lisat-01' },
  { source: '/the-team', destination: '/team' },
  { source: '/teammembers', destination: '/team#members' },
  { source: '/the-team-advisors', destination: '/team#advisors' },

  // Departments
  { source: '/the-team-adcs', destination: '/departments/adcs' },
  { source: '/the-team-cdh', destination: '/departments/cdh' },
  { source: '/the-team-comms', destination: '/departments/communications' },
  { source: '/the-team-hw', destination: '/departments/hardware' },
  { source: '/the-team-ps', destination: '/departments/power-systems' },
  { source: '/the-team-stc', destination: '/departments/structures-thermal' },
  { source: '/the-team-hr', destination: '/departments/hr-logistics' },
  { source: '/the-team-marketing', destination: '/departments/marketing-sponsors' },

  // Updates
  { source: '/updates-cdr', destination: '/updates/critical-design-review' },
  { source: '/updates-bootcamp', destination: '/updates/cubesat-portugal-bootcamp' },
  { source: '/updates-smallsateurope', destination: '/updates/smallsat-europe-2026' },
  { source: '/updates-openday', destination: '/updates/tecnico-open-day' },
  { source: '/updates-2years', destination: '/updates/two-years-of-lisat' },
  { source: '/updates-recruitment-26', destination: '/updates/recruitment-2026' },
  { source: '/updates-jornadasdomar', destination: '/updates/jornadas-do-mar' },
  { source: '/updates-onbourding', destination: '/updates/recruitment-onboarding' },
  { source: '/updates-websummit', destination: '/updates/web-summit-2025' },
  { source: '/updates-careerfairs2', destination: '/updates/career-fairs-second-edition' },
  { source: '/updates-careerfairs1', destination: '/updates/career-fairs-first-edition' },
  { source: '/updates-events', destination: '/updates/lisat-on-tour' },
  { source: '/updates-easter', destination: '/updates/tecnico-holiday-programme-easter' },
  { source: '/updates-navalacademy', destination: '/updates/cinav-naval-academy-conference' },
  { source: '/updates-recruitment', destination: '/updates/recruitment-update' },
  { source: '/updates-cansat', destination: '/updates/mentoring-cansat-teams' },
  { source: '/updates-altice', destination: '/updates/meo-satellite-operations-center' },
  { source: '/updates-thales', destination: '/updates/thales-portugal-visit' },
  { source: '/updates-cinav', destination: '/updates/cinav-lab-inauguration' },
  // The old site used an accented slug for this one.
  { source: '/updates-t%C3%A9c4defence', destination: '/updates/tec4defence' },
  { source: '/updates-téc4defence', destination: '/updates/tec4defence' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Next does not walk up into the home directory.
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/avif', 'image/webp'],
    /**
     * Photographs uploaded through Sanity Studio are served from Sanity's
     * CDN. `next/image` refuses any remote host that is not listed here, so
     * without this entry every CMS photo would fail to render.
     */
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, permanent: true }))
  },
}

export default nextConfig
