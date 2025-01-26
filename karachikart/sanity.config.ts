'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {deskTool} from 'sanity/desk'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'KarachiKART',
  projectId: 'cw0d40u9',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool(),
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Reviews')
              .child(
                S.documentList()
                  .title('Reviews')
                  .filter('_type == "review"')
              ),
            // Add other document types here
            ...S.documentTypeListItems().filter(
              (listItem) => !['review'].includes(listItem.getId() || '')
            ),
          ]),
    }),
  ],
  schema,
  document: {
    // New documents will be created as drafts
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'document') {
        return prev.filter((template) => template.templateId === 'review')
      }
      return prev
    },
    // Enable the "Create new document" button
    actions: (prev, { schemaType }) => {
      if (schemaType === 'review') {
        return prev.filter(({ action }) => 
          ['create', 'update', 'delete', 'publish'].includes(action || '')
        )
      }
      return prev
    }
  }
})
