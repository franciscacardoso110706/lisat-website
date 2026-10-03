import { defineField, defineType } from 'sanity'

/**
 * A person on the LISAT team.
 *
 * PUBLIC INFORMATION ONLY. Everything in this document is published on
 * lisat.space. There is deliberately no field for a personal email address, a
 * phone number, a student number, an address or any internal note — if one is
 * ever added here, it ends up on the public internet.
 *
 * Two fields exist beyond the original specification because the team page
 * already uses them and the page's design is not changing:
 *
 *   `rank`   decides which of the page's four sections a person appears in
 *            (Board / Department leaders / Everyone / Advisors). Without it
 *            the page cannot be grouped the way it is today.
 *   `degree`, `year`, `faculty`
 *            render the small line under a person's role on their card. All
 *            three are optional; leave them blank and the line is not drawn.
 */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'studies', title: 'Studies' },
    { name: 'links', title: 'Links' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photograph',
      type: 'image',
      group: 'basics',
      description:
        'A portrait. It is shown taller than it is wide, so a photo with the face near the top works best. Drag the crop handles under "Edit" if the automatic crop is wrong.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description',
          type: 'string',
          description:
            'Describes the photo for people using a screen reader. Leave blank to use the person’s name.',
        }),
      ],
      // A warning rather than an error. Most of the team has no photograph on
      // file, and the card has a designed monogram for exactly that case — we
      // do not put a stock face on a real person. This nudges an editor to add
      // one without blocking them from publishing somebody who has not sent a
      // photo yet.
      validation: (rule) =>
        rule.required().warning('This person will show a monogram until a photograph is added.'),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'basics',
      description:
        'Their job title on the team, for example "Department Leader" or "Team Member".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'reference',
      group: 'basics',
      to: [{ type: 'department' }],
      description:
        'Which department they belong to. To move someone, change this and publish.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rank',
      title: 'Position on the team page',
      type: 'string',
      group: 'basics',
      description:
        'Which part of the team page they appear in. Most people are "Member".',
      options: {
        list: [
          { title: 'Board', value: 'board' },
          { title: 'Department leader', value: 'lead' },
          { title: 'Member', value: 'member' },
          { title: 'Advisor', value: 'advisor' },
        ],
        layout: 'radio',
      },
      initialValue: 'member',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      group: 'studies',
      description:
        'The course code as written at Técnico, for example "LEAer". Optional.',
    }),
    defineField({
      name: 'year',
      title: 'Year of study',
      type: 'number',
      group: 'studies',
      description: 'Optional.',
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'faculty',
      title: 'Faculty',
      type: 'string',
      group: 'studies',
      description: 'For example "IST", "FCUL" or "ISEG". Optional.',
    }),

    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'links',
      description:
        'The full address of their public LinkedIn profile. Optional. Leave it blank and no LinkedIn icon is shown.',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).custom((value) => {
          if (!value) return true
          return value.includes('linkedin.com')
            ? true
            : 'This does not look like a LinkedIn address.'
        }),
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      group: 'links',
      description:
        'A public sentence or two about them. Optional. Not shown on the team page yet; it is stored for a future design.',
    }),

    defineField({
      name: 'websiteId',
      title: 'Replaces (migration only)',
      type: 'string',
      group: 'basics',
      description:
        'Leave this blank for anyone new. It is only used while the team is being moved out of the code: set it to the person’s id in src/data/team.ts and this record takes their place on the website instead of appearing twice.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'basics',
      description:
        'Controls the order within their group. Lower numbers come first. Leave them all the same to sort by name.',
      initialValue: 100,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'basics',
      description:
        'Turn this off when someone leaves LISAT. They disappear from the website, but their record is kept.',
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
    {
      title: 'Department',
      name: 'byDepartment',
      by: [
        { field: 'department.name', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: {
      title: 'name',
      role: 'role',
      department: 'department.name',
      rank: 'rank',
      active: 'active',
      media: 'photo',
    },
    prepare({ title, role, department, rank, active, media }) {
      // Photograph, name, then role and department on one line — so the list
      // reads like a team roster rather than a table of documents.
      const parts = [
        department || null,
        role || null,
        rank === 'board' ? 'Board' : rank === 'advisor' ? 'Advisor' : null,
        active === false ? 'Not active' : null,
      ].filter(Boolean)

      return {
        title: title || 'Unnamed member',
        subtitle: parts.join('  ·  '),
        media,
      }
    },
  },
})
