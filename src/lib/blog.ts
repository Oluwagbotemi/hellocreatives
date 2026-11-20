const MONTHS = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
]

/**
 * Turns a post date like "08 July, 2024" into "2024-07-08",
 * the format link previews (Open Graph) expect.
 */
export const toIsoDate = (date: string): string | undefined => {
    const match = date.trim().match(/^(\d{1,2})\s+([a-z]+),?\s+(\d{4})$/i)
    if (!match) return undefined
    const [, day, monthName, year] = match
    const month = MONTHS.indexOf(monthName.toLowerCase()) + 1
    if (!month) return undefined
    return `${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`
}

/**
 * Social apps (WhatsApp, X, LinkedIn…) don't show SVG preview images,
 * so posts with an SVG get a generated preview image instead.
 */
export const getPostPreviewImage = (post: { slug: string; ogImage: string }) =>
    post.ogImage.toLowerCase().endsWith('.svg')
        ? `/api/blog/${encodeURIComponent(post.slug)}/preview-image`
        : post.ogImage
