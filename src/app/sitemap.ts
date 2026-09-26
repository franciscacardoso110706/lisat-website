import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { departments } from '@/data/departments'
import { updates } from '@/data/updates'

type Entry = MetadataRoute.Sitemap[number]

const pages: { path: string; changeFrequency: Entry['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/mission/lisat-01', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/departments', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/updates', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/partners', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/join-us', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const url = (path: string) => new URL(path, site.url).toString()

  return [
    ...pages.map(
      (page): Entry => ({
        url: url(page.path),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      }),
    ),
    ...departments.map(
      (d): Entry => ({
        url: url(`/departments/${d.slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }),
    ),
    ...updates.map(
      (u): Entry => ({
        url: url(`/updates/${u.slug}`),
        lastModified: new Date(`${u.date}T12:00:00Z`),
        changeFrequency: 'yearly',
        priority: 0.5,
      }),
    ),
  ]
}
