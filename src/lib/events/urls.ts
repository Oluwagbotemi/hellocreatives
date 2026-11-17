/**
 * The public address of the events page.
 * Production: https://events.hellocreatives.io
 * Previews / local without the subdomain: <origin>/events
 */
export const getEventsBaseUrl = (origin: string) => {
    const configured = process.env.NEXT_PUBLIC_EVENTS_URL
    if (configured) return configured.replace(/\/$/, '')

    const url = new URL(origin)
    return url.hostname.startsWith('events.') ? url.origin : `${url.origin}/events`
}

/** Link that opens the events page with this event's registration form open. */
export const getEventShareUrl = (origin: string, slug: string) =>
    `${getEventsBaseUrl(origin)}/?event=${encodeURIComponent(slug)}`

/** Same link without "https://", for printing on the share image. */
export const prettyUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/\?/, '?')
