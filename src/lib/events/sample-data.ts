import type { PrivateEvent } from './types'

// Shown only while Sanity isn't connected (no NEXT_PUBLIC_SANITY_PROJECT_ID),
// so the page can be previewed. Dates are relative to today so there are
// always upcoming and past examples.

const DAY = 24 * 60 * 60 * 1000

const atNoonLagos = (daysFromNow: number) => {
    const d = new Date(Date.now() + daysFromNow * DAY)
    d.setUTCHours(11, 0, 0, 0) // 12:00 in Lagos (UTC+1)
    return d.toISOString()
}

const base = {
    title: 'Let’s Build A Website with AI',
    description:
        'Learn from the Head of Design at Paystack on how designers work with AI and their transition to Design Engineers.',
    host: 'Jeremiah Folorunso',
    endsAt: null,
    bringAlong: 'Your notepad and biro',
    address: null,
    directionsUrl: null,
    recordingUrl: null,
} as const

export const SAMPLE_EVENTS: PrivateEvent[] = [
    {
        ...base,
        id: 'sample-1',
        slug: 'sample-build-a-website-with-ai',
        eventType: 'workshop',
        graphicUrl: '/images/events/sample-green.png',
        startsAt: atNoonLagos(14),
        locationType: 'virtual',
        platform: 'googleMeet',
        callLink: 'https://meet.google.com/sample-link',
    },
    {
        ...base,
        id: 'sample-2',
        slug: 'sample-in-person-meetup',
        title: 'Creatives Meetup Lagos',
        eventType: 'event',
        graphicUrl: '/images/events/sample-purple.png',
        startsAt: atNoonLagos(21),
        locationType: 'inPerson',
        platform: null,
        address: 'Ikeja, Lagos',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Ikeja%2C%20Lagos',
        callLink: null,
    },
    {
        ...base,
        id: 'sample-3',
        slug: 'sample-design-systems-101',
        title: 'Design Systems 101',
        eventType: 'event',
        graphicUrl: '/images/events/sample-blue.png',
        startsAt: atNoonLagos(30),
        locationType: 'virtual',
        platform: 'microsoftTeams',
        callLink: 'https://teams.microsoft.com/sample-link',
    },
    {
        ...base,
        id: 'sample-4',
        slug: 'sample-past-with-recording',
        eventType: 'workshop',
        graphicUrl: '/images/events/sample-orange.png',
        startsAt: atNoonLagos(-10),
        locationType: 'virtual',
        platform: 'googleMeet',
        callLink: 'https://meet.google.com/sample-link',
        recordingUrl: 'https://www.youtube.com/',
    },
    {
        ...base,
        id: 'sample-5',
        slug: 'sample-past-no-recording',
        eventType: 'workshop',
        graphicUrl: '/images/events/sample-green.png',
        startsAt: atNoonLagos(-30),
        locationType: 'virtual',
        platform: 'microsoftTeams',
        callLink: 'https://teams.microsoft.com/sample-link',
    },
]
