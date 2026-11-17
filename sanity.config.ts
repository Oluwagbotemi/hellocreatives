'use client'

// Sanity Studio: the dashboard where the team creates events.
// It lives at /studio on the website (e.g. https://hellocreatives.io/studio).

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
    basePath: '/studio',
    title: 'Hello Creatives',
    projectId: projectId || 'not-configured',
    dataset,
    schema: {
        types: schemaTypes,
        // Registrations are created by the website, not by hand.
        templates: (templates) => templates.filter((t) => t.schemaType !== 'registration'),
    },
    document: {
        newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'registration'),
    },
    plugins: [structureTool({ structure })],
    apiVersion,
})
