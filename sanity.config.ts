import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'

/**
 * Sanity Studio, served from /studio inside this website.
 *
 * On access: this file grants nobody anything. Who may read, edit or publish
 * is decided by the member list of the Sanity project itself, and the Studio
 * asks Sanity who you are before it shows you a single document. Knowing the
 * address does not get you in — an unauthorised visitor gets a login screen
 * and, if their account is not on the project, nothing after it.
 *
 * That also means handover needs no code change: invite the next year's
 * editors in sanity.io/manage, remove the previous ones, done.
 */
export default defineConfig({
  name: 'lisat',
  title: 'LISAT Website',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      // A plain two-item menu. The default would be an alphabetical list of
      // document types, which reads like a database to someone who is here to
      // update a photograph.
      structure: (S) =>
        S.list()
          .title('Website content')
          .items([
            S.listItem()
              .title('Team members')
              .child(
                S.documentTypeList('teamMember')
                  .title('Team members')
                  .defaultOrdering([
                    { field: 'order', direction: 'asc' },
                    { field: 'name', direction: 'asc' },
                  ]),
              ),
            S.listItem()
              .title('Departments')
              .child(
                S.documentTypeList('department')
                  .title('Departments')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),
          ]),
    }),
    // A query console for developers. Harmless to leave in — it can only do
    // what the signed-in account is already allowed to do.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
