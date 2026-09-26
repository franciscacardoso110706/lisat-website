import { defineField, defineType } from 'sanity'

/**
 * A LISAT department.
 *
 * Departments exist here mainly so a team member can point at one: changing
 * somebody's department becomes picking from a list rather than typing a
 * string that has to match something elsewhere.
 *
 * The descriptions on each field are what an editor reads in the Studio, so
 * they are written for someone who has never seen the code.
 */
export const department = defineType({
  name: 'department',
  title: 'Department',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'The full name, as it should read on the website — for example "Attitude Determination & Control System".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'abbr',
      title: 'Short name',
      type: 'string',
      description:
        'The short form shown on team cards and filter buttons — for example "ADCS". Leave it empty to use the full name.',
    }),
    defineField({
      name: 'slug',
      title: 'Website address',
      type: 'slug',
      description:
        'The last part of the department’s web address. Press Generate to create it from the name. Changing it later will break any existing links to this department.',
      options: { source: 'name', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description:
        'One or two sentences describing what this department does. Optional.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Controls the order departments appear in. Lower numbers come first.',
      initialValue: 100,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description:
        'Turn this off to hide the department from the website without deleting it.',
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
    select: { title: 'name', abbr: 'abbr', order: 'order', active: 'active' },
    prepare({ title, abbr, order, active }) {
      // The subtitle carries the two things an editor is usually checking:
      // where it sits in the order, and whether it is live.
      const parts = [
        typeof order === 'number' ? `#${order}` : null,
        abbr || null,
        active === false ? 'Hidden' : null,
      ].filter(Boolean)

      return {
        title: title || 'Untitled department',
        subtitle: parts.join('  ·  '),
      }
    },
  },
})
