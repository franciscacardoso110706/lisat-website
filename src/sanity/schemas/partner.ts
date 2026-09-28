import { defineField, defineType } from 'sanity'
import { partners as codePartners, partnerTiers } from '../../data/partners'

/**
 * An organisation supporting LISAT.
 *
 * The partners already on the website live in `src/data/partners.ts`. A
 * document here with the same key *overrides* that partner field by field:
 * anything left blank keeps the value from the code. So to make an existing
 * partner more or less prominent, create a document with its key, set
 * "Size on the Partners page", and publish — no logo upload needed.
 *
 * A document with a new key adds a partner; that one needs a name, a tier and
 * a logo, or it is not shown.
 *
 * PUBLIC INFORMATION ONLY. Everything here is published on lisat.space.
 */
const existingKeys = codePartners.map((p) => p.id).join(', ')

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'page', title: 'On the page' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      group: 'basics',
      options: { source: 'name', maxLength: 64 },
      description: `Identifies the partner on the website. To change a partner that is already there, use its existing key: ${existingKeys}.`,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Official tier',
      type: 'string',
      group: 'basics',
      description:
        'The partnership level as LISAT states it publicly. Leave blank on an existing partner to keep its current tier.',
      options: {
        list: partnerTiers.map((t) => ({ title: t.label, value: t.id })),
      },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'basics',
      description:
        'A PNG with a transparent or white background works best. Leave blank on an existing partner to keep the current logo.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'basics',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'description',
      title: 'What the partnership provides',
      type: 'text',
      rows: 2,
      group: 'basics',
      description:
        'One sentence, and only what is confirmed — for example "Access to Ansys for structural and thermal analysis."',
      validation: (rule) => rule.max(180),
    }),

    defineField({
      name: 'priority',
      title: 'Size on the Partners page',
      type: 'string',
      group: 'page',
      description:
        'How much room the partner gets. This is a layout choice, not a label — visitors never see the word. "Unchanged" keeps the size the partner has on the website today; for a new partner it follows the official tier (main partner → large; gold and silver → medium; everyone else → the moving logo stream).',
      options: {
        list: [
          { title: 'Unchanged', value: 'auto' },
          { title: 'Large — a feature of its own', value: 'featured' },
          { title: 'Medium — a tile with its description', value: 'major' },
          { title: 'Small — in the logo stream', value: 'standard' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'page',
      description:
        'Lower numbers come first among partners of the same size and tier. Leave blank to keep the current order.',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Photograph',
      type: 'image',
      group: 'page',
      description:
        'A real photograph of the partnership — a visit, an event, the team on site. Only shown when the partner is drawn large. Optional.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description',
          type: 'string',
          description: 'Describes the photo for people using a screen reader.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'active',
      title: 'Show on the website',
      type: 'boolean',
      group: 'page',
      description:
        'Turn this off to hide the partner — including one that is defined in the code.',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: {
      title: 'name',
      tier: 'tier',
      priority: 'priority',
      active: 'active',
      media: 'logo',
    },
    prepare({ title, tier, priority, active, media }) {
      const tierLabel = partnerTiers.find((t) => t.id === tier)?.label
      const size =
        priority === 'featured'
          ? 'Large'
          : priority === 'major'
            ? 'Medium'
            : priority === 'standard'
              ? 'Small'
              : null
      const parts = [
        tierLabel ?? null,
        size,
        active === false ? 'Hidden' : null,
      ].filter(Boolean)

      return {
        title: title || 'Unnamed partner',
        subtitle: parts.join('  ·  '),
        media,
      }
    },
  },
})
