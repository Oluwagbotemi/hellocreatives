export type EventPlatform = 'googleMeet' | 'microsoftTeams'
export type EventLocationType = 'virtual' | 'inPerson'

/** Event details that are safe to show publicly (no call link). */
export interface PublicEvent {
    id: string
    slug: string
    title: string
    eventType: 'event' | 'workshop'
    description: string
    host: string
    /** Image URL for the card graphic (PNG, so the share image can use it too). */
    graphicUrl: string | null
    startsAt: string
    endsAt: string | null
    locationType: EventLocationType
    platform: EventPlatform | null
    address: string | null
    directionsUrl: string | null
    bringAlong: string | null
    recordingUrl: string | null
}

/** Full event, including the private call link. Server only. */
export interface PrivateEvent extends PublicEvent {
    callLink: string | null
}

/** What the website returns after someone registers. */
export interface BookingResult {
    eventSlug: string
    callLink: string | null
    emailSent: boolean
}
