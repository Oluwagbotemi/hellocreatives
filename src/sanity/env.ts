// Sanity connection settings. These come from environment variables
// (see `.env.example` and `docs/events-setup.md`).

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2025-01-01'

// When no project is connected yet, the events page shows sample events
// so the design can be previewed before Sanity is set up.
export const isSanityConfigured = Boolean(projectId)
