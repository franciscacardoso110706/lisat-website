import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /**
       * The content management interface is not content. It has nothing for a
       * search engine to index, and a login screen in the results is a poor
       * look — but note this is housekeeping, not a security measure. The
       * Studio is protected by Sanity's own authentication; `robots.txt` is a
       * request that well-behaved crawlers honour and nothing else does.
       */
      disallow: ['/studio'],
    },
    sitemap: new URL('/sitemap.xml', site.url).toString(),
  }
}
