/**
 * One-off import of the team from `src/data` into Sanity.
 *
 * Run it with:
 *
 *   node --env-file=.env.local scripts/import-team.ts            (dry run)
 *   node --env-file=.env.local scripts/import-team.ts --write    (for real)
 *
 * It is safe to run more than once. Every document is matched before it is
 * written — departments by slug, people by the `websiteId` they are given here
 * and then by name — so a second run updates what it made the first time
 * rather than creating a second copy of everybody.
 *
 * The token comes from `SANITY_IMPORT_TOKEN` in `.env.local`. It is needed
 * only by this script; the website itself reads Sanity anonymously and cannot
 * write anything. Revoke the token in sanity.io/manage once the import is
 * done — it has no other job.
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { team } from '../src/data/team.ts'
import { departments } from '../src/data/departments.ts'

const WRITE = process.argv.includes('--write')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_IMPORT_TOKEN

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
if (!token) throw new Error('SANITY_IMPORT_TOKEN is not set')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-11-01',
  useCdn: false,
})

/** Departments referenced by at least one person, including the board. */
const usedSlugs = new Set(team.map((m) => m.department))

/**
 * The departments were created by hand in the Studio before this script
 * existed, with fuller slugs than the short ones used in the code. This maps
 * one to the other so the import reuses those documents instead of creating a
 * second, near-identical set.
 *
 * Anything not listed here is matched on the code slug directly, and created
 * if it is missing.
 */
const SLUG_ALIASES: Record<string, string> = {
  adcs: 'attitude-determination-and-control-systems',
  cdh: 'command-and-data-handling',
  communications: 'communication-systems',
  'structures-thermal': 'structures-and-thermal-control',
  'hr-logistics': 'human-resources-and-logistics',
  'marketing-sponsors': 'marketing-and-sponsors',
}

const log = (...args: unknown[]) => console.log(...args)

async function run() {
  log(`\nproject ${projectId} / ${dataset}`)
  log(WRITE ? 'MODE: writing\n' : 'MODE: dry run — nothing will be written\n')

  // ---------------------------------------------------------------- departments
  const existingDepts: { _id: string; slug: string }[] = await client.fetch(
    `*[_type == "department"]{_id, "slug": slug.current}`,
  )
  const deptIdBySlug = new Map(existingDepts.map((d) => [d.slug, d._id]))

  log('DEPARTMENTS')
  let deptCreated = 0
  let deptUpdated = 0

  for (const [i, slug] of [...usedSlugs].entries()) {
    const known = departments.find((d) => d.slug === slug)

    // `board` is not a department in src/data/departments.ts — it is the value
    // the three board members carry so their card shows no department label.
    // It still needs a document here for the reference to point at.
    const doc = {
      _type: 'department' as const,
      name: known?.name ?? 'Board',
      abbr: known?.abbr ?? 'Board',
      slug: { _type: 'slug' as const, current: slug },
      shortDescription: known?.tagline ?? undefined,
      order: (i + 1) * 10,
      active: true,
    }

    const existing =
      deptIdBySlug.get(slug) ?? deptIdBySlug.get(SLUG_ALIASES[slug] ?? '')

    if (existing) {
      // Left exactly as the editor made it. The names and abbreviations in the
      // Studio were chosen deliberately; this script has no business
      // overwriting them with the ones that happen to be in the code.
      log(`  reuse   ${slug.padEnd(22)} -> ${SLUG_ALIASES[slug] ?? slug}`)
      deptUpdated++
      deptIdBySlug.set(slug, existing)
    } else {
      const _id = `department-${slug}`
      log(`  create  ${slug.padEnd(22)} ${doc.name}`)
      deptCreated++
      if (WRITE) {
        await client.createOrReplace({ _id, ...doc })
        deptIdBySlug.set(slug, _id)
      } else {
        deptIdBySlug.set(slug, _id)
      }
    }
  }
  log(`  -> ${deptCreated} to create, ${deptUpdated} to update\n`)

  // -------------------------------------------------------------------- people
  const existingMembers: { _id: string; name: string; websiteId?: string }[] =
    await client.fetch(`*[_type == "teamMember"]{_id, name, websiteId}`)

  const byWebsiteId = new Map(
    existingMembers.filter((m) => m.websiteId).map((m) => [m.websiteId!, m._id]),
  )
  const byName = new Map(existingMembers.map((m) => [m.name.trim(), m._id]))

  log('TEAM MEMBERS')
  let created = 0
  let updated = 0
  let photosUploaded = 0

  for (const [i, member] of team.entries()) {
    const deptId = deptIdBySlug.get(member.department)
    if (!deptId) {
      log(`  SKIP    ${member.name} — no department for "${member.department}"`)
      continue
    }

    // Upload the photograph if this person has one on disk and we are writing.
    let photo: Record<string, unknown> | undefined
    if (member.photo) {
      const file = join(process.cwd(), 'public', member.photo.replace(/^\//, ''))
      if (existsSync(file)) {
        if (WRITE) {
          const asset = await client.assets.upload('image', readFileSync(file), {
            filename: member.photo.split('/').pop(),
          })
          photo = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: member.name,
          }
        }
        photosUploaded++
      } else {
        log(`  (no file at ${file})`)
      }
    }

    const doc: Record<string, unknown> = {
      _type: 'teamMember',
      name: member.name,
      role: member.role,
      rank: member.rank,
      department: { _type: 'reference', _ref: deptId },
      degree: member.degree,
      year: member.year,
      faculty: member.faculty,
      linkedin: member.linkedin,
      // The id this record replaces in src/data/team.ts. Without it the merge
      // in team-source.ts would show the person twice.
      websiteId: member.id,
      order: (i + 1) * 10,
      active: true,
    }
    if (photo) doc.photo = photo

    // Drop undefined keys so a patch does not try to write them.
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]

    const existing = byWebsiteId.get(member.id) ?? byName.get(member.name.trim())

    if (existing) {
      log(
        `  update  ${member.name.padEnd(26)} ${member.rank.padEnd(8)} ${member.department}`,
      )
      updated++
      if (WRITE) await client.patch(existing).set(doc).commit()
    } else {
      log(
        `  create  ${member.name.padEnd(26)} ${member.rank.padEnd(8)} ${member.department}`,
      )
      created++
      if (WRITE)
        await client.createOrReplace({
          _id: `member-${member.id}`,
          ...doc,
        } as { _id: string; _type: string })
    }
  }

  log(
    `\n  -> ${created} to create, ${updated} to update, ${photosUploaded} photograph(s)\n`,
  )

  if (!WRITE) {
    log('Nothing was written. Re-run with --write to apply.\n')
  } else {
    const total = await client.fetch(`count(*[_type == "teamMember"])`)
    log(`Done. ${total} team members now in Sanity.\n`)
  }
}

run().catch((error) => {
  console.error('\nImport failed:', error?.message ?? error)
  process.exit(1)
})
