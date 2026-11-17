import { NextResponse } from 'next/server'
import { getPrivateEvent, sanityClient } from '@/lib/events/data'
import { sendBookingEmail } from '@/lib/events/email'
import { isPastEvent } from '@/lib/events/format'
import { getEventShareUrl } from '@/lib/events/urls'
import type { BookingResult } from '@/lib/events/types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const clean = (value: unknown, max: number) =>
    typeof value === 'string' ? value.trim().slice(0, max) : ''

export async function POST(request: Request) {
    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Hidden "website" field: real people leave it empty, spam bots fill it in.
    if (clean(body.website, 200)) {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const slug = clean(body.slug, 120)
    const name = clean(body.name, 120)
    const email = clean(body.email, 200).toLowerCase()
    const jobRole = clean(body.jobRole, 120)

    if (!slug) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const event = await getPrivateEvent(slug)
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    if (isPastEvent(event)) {
        return NextResponse.json({ error: 'This event has already happened.' }, { status: 400 })
    }

    const eventUrl = getEventShareUrl(new URL(request.url).origin, event.slug)

    // Sample mode (Sanity not connected yet): don't store or email anything.
    if (!sanityClient) {
        const result: BookingResult = { eventSlug: event.slug, callLink: event.callLink, emailSent: false }
        return NextResponse.json(result)
    }

    if (!process.env.SANITY_API_TOKEN) {
        console.error('[events] SANITY_API_TOKEN is not set, so registrations cannot be saved.')
        return NextResponse.json({ error: 'Registration is not available right now.' }, { status: 500 })
    }

    try {
        // Registering twice with the same email doesn't create a duplicate or a second email.
        const existingId = await sanityClient.fetch<string | null>(
            `*[_type == "registration" && event._ref == $eventId && email == $email][0]._id`,
            { eventId: event.id, email },
            { cache: 'no-store' }
        )

        let emailSent = true
        if (!existingId) {
            const created = await sanityClient.create({
                _type: 'registration',
                event: { _type: 'reference', _ref: event.id },
                name,
                email,
                jobRole,
                registeredAt: new Date().toISOString(),
                emailSent: false,
            })
            emailSent = await sendBookingEmail({ event, name, email, eventUrl })
            if (emailSent) await sanityClient.patch(created._id).set({ emailSent: true }).commit()
        }

        const result: BookingResult = { eventSlug: event.slug, callLink: event.callLink, emailSent }
        return NextResponse.json(result)
    } catch (error) {
        console.error('[events] Registration failed', error)
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
