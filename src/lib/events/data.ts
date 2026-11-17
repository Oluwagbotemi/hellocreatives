// Server-only: reads events from Sanity. Never import this from a client component,
// because it uses the private Sanity token and can read call links.

import { createClient, groq } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env'
import { SAMPLE_EVENTS } from './sample-data'
import { buildDirectionsUrl } from './format'
import type { PrivateEvent, PublicEvent } from './types'

const token = process.env.SANITY_API_TOKEN

export const sanityClient = isSanityConfigured
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token, perspective: 'published' })
    : null

const imageBuilder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null

type RawEvent = Omit<PrivateEvent, 'graphicUrl' | 'directionsUrl'> & {
    graphic: { asset?: { _ref: string } } | null
    mapsLink: string | null
}

const PUBLIC_FIELDS = groq`
    "id": _id,
    "slug": slug.current,
    title,
    eventType,
    description,
    host,
    graphic,
    startsAt,
    endsAt,
    locationType,
    platform,
    address,
    mapsLink,
    bringAlong,
    recordingUrl
`

const toEvent = (raw: RawEvent): PrivateEvent => ({
    ...raw,
    eventType: raw.eventType || 'event',
    endsAt: raw.endsAt || null,
    platform: raw.locationType === 'virtual' ? raw.platform || null : null,
    address: raw.locationType === 'inPerson' ? raw.address || null : null,
    bringAlong: raw.bringAlong || null,
    recordingUrl: raw.recordingUrl || null,
    callLink: raw.callLink || null,
    // PNG so the share-image generator can use it as well.
    graphicUrl:
        raw.graphic?.asset && imageBuilder
            ? imageBuilder.image(raw.graphic).width(966).format('png').url()
            : null,
    directionsUrl:
        raw.locationType === 'inPerson'
            ? raw.mapsLink || (raw.address ? buildDirectionsUrl(raw.address) : null)
            : null,
})

const toPublic = ({ callLink: _callLink, ...event }: PrivateEvent): PublicEvent => event

const FETCH_OPTIONS = { next: { revalidate: 60, tags: ['event'] } }

/** All events with a date and link name, without call links. */
export const getPublicEvents = async (): Promise<PublicEvent[]> => {
    if (!sanityClient) return SAMPLE_EVENTS.map(toPublic)

    const raw = await sanityClient.fetch<RawEvent[]>(
        groq`*[_type == "event" && defined(slug.current) && defined(startsAt)] | order(startsAt asc) { ${PUBLIC_FIELDS} }`,
        {},
        FETCH_OPTIONS
    )
    return raw.map((e) => toPublic(toEvent({ ...e, callLink: null })))
}

/** One event including its private call link. Server only. */
export const getPrivateEvent = async (slug: string): Promise<PrivateEvent | null> => {
    if (!sanityClient) return SAMPLE_EVENTS.find((e) => e.slug === slug) ?? null

    const raw = await sanityClient.fetch<RawEvent | null>(
        groq`*[_type == "event" && slug.current == $slug][0] { ${PUBLIC_FIELDS}, callLink }`,
        { slug },
        { cache: 'no-store' }
    )
    return raw ? toEvent(raw) : null
}

export const getPublicEvent = async (slug: string): Promise<PublicEvent | null> => {
    const event = await getPrivateEvent(slug)
    return event ? toPublic(event) : null
}
