import type { PublicEvent } from './types'

/** All event times are shown in Lagos time. */
export const EVENT_TIMEZONE = 'Africa/Lagos'

/** Events without an end time move to "Past Sessions" this long after they start. */
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000

const ordinal = (day: number) => {
    if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`
    switch (day % 10) {
        case 1: return `${day}st`
        case 2: return `${day}nd`
        case 3: return `${day}rd`
        default: return `${day}th`
    }
}

/** "Monday, 12th August, 2026 | 12:00PM" */
export const formatEventDate = (iso: string) => {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: EVENT_TIMEZONE,
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
            .formatToParts(new Date(iso))
            .map((p) => [p.type, p.value])
    )
    const period = (parts.dayPeriod || '').toUpperCase()
    return `${parts.weekday}, ${ordinal(Number(parts.day))} ${parts.month}, ${parts.year} | ${parts.hour}:${parts.minute}${period}`
}

export const getEventEnd = (event: Pick<PublicEvent, 'startsAt' | 'endsAt'>) =>
    event.endsAt
        ? new Date(event.endsAt)
        : new Date(new Date(event.startsAt).getTime() + DEFAULT_DURATION_MS)

export const isPastEvent = (event: Pick<PublicEvent, 'startsAt' | 'endsAt'>, now = new Date()) =>
    getEventEnd(event).getTime() < now.getTime()

/** Upcoming: soonest first. Past: most recent first. */
export const splitEvents = <T extends PublicEvent>(events: T[], now = new Date()) => {
    const upcoming = events
        .filter((e) => !isPastEvent(e, now))
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    const past = events
        .filter((e) => isPastEvent(e, now))
        .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
    return { upcoming, past }
}

export const buildDirectionsUrl = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
