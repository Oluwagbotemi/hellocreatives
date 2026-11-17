import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getPublicEvent, getPublicEvents } from '@/lib/events/data'
import { formatEventDate, splitEvents } from '@/lib/events/format'
import EventsView from './components/events-view'

const DESCRIPTION =
    'A space for honest conversations, practical insights, and shared experiences from creatives like you.'

/** Link previews: a shared event link (?event=…) shows that event's share image. */
export const getEventsMetadata = async (eventSlug?: string): Promise<Metadata> => {
    const event = eventSlug ? await getPublicEvent(eventSlug) : null
    if (!event) {
        return { title: 'Events | Hello Creatives', description: DESCRIPTION }
    }

    const host = (await headers()).get('host')
    const protocol = host?.startsWith('localhost') ? 'http' : 'https'
    const imageUrl = `${protocol}://${host}/api/events/${encodeURIComponent(event.slug)}/share-image`
    const title = `${event.title} | Hello Creatives Events`
    const description = `${formatEventDate(event.startsAt)}. ${event.description}`

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', images: [{ url: imageUrl, alt: event.title }] },
        twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
    }
}

const EventsPage = async ({ eventSlug }: { eventSlug?: string }) => {
    const { upcoming, past } = splitEvents(await getPublicEvents())
    return <EventsView upcoming={upcoming} past={past} initialEventSlug={eventSlug} />
}

export default EventsPage
