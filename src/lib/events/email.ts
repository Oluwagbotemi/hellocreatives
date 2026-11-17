// Server-only: sends the booking confirmation email through Resend.

import { Resend } from 'resend'
import { formatEventDate, getEventEnd } from './format'
import { PLATFORMS } from './platforms'
import type { PrivateEvent } from './types'

const resendApiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.RESEND_FROM_EMAIL || 'Hello Creatives <events@hellocreatives.io>'

const resend = resendApiKey ? new Resend(resendApiKey) : null

export const isEmailConfigured = Boolean(resend)

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const toIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')

/** Calendar invite (.ics) so people can add the event in one tap. */
const buildCalendarInvite = (event: PrivateEvent, eventUrl: string) => {
    const location =
        event.locationType === 'virtual' ? event.callLink || 'Online' : event.address || ''
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Hello Creatives//Events//EN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.id}@hellocreatives.io`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(new Date(event.startsAt))}`,
        `DTEND:${toIcsDate(getEventEnd(event))}`,
        `SUMMARY:${escapeIcs(event.title)}`,
        `DESCRIPTION:${escapeIcs(`${event.description}\n\n${eventUrl}`)}`,
        `LOCATION:${escapeIcs(location)}`,
        `URL:${eventUrl}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ]
    return lines.join('\r\n')
}

const buildHtml = (event: PrivateEvent, name: string) => {
    const platform = event.platform ? PLATFORMS[event.platform] : null
    const locationRow =
        event.locationType === 'virtual'
            ? `Virtual${platform ? ` (${platform.label})` : ''}${event.callLink
                ? `<br><a href="${escapeHtml(event.callLink)}" style="color:${platform?.color ?? '#093420'};font-weight:600">Join the call</a>`
                : ''}`
            : `${escapeHtml(event.address || '')}${event.directionsUrl
                ? `<br><a href="${escapeHtml(event.directionsUrl)}" style="color:#8B50EA;font-weight:600">Get directions</a>`
                : ''}`

    return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F5F8FA;font-family:Arial,Helvetica,sans-serif;color:#222">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:24px">
    <tr><td>
      <p style="display:inline-block;margin:0 0 16px;padding:8px 16px;border-radius:999px;background:#00C159;color:#fff;font-weight:600">Booking Successful</p>
      <h1 style="margin:0 0 8px;font-size:22px">${escapeHtml(event.title)}</h1>
      <p style="margin:0 0 24px;color:#6D7786">Hi ${escapeHtml(name || 'there')}, you're booked in. Here are the details.</p>
      <p style="margin:0;color:#9C9C9C;font-size:14px">Date &amp; Time</p>
      <p style="margin:4px 0 16px;color:#4A4A4A">${formatEventDate(event.startsAt)} (Lagos time)</p>
      <p style="margin:0;color:#9C9C9C;font-size:14px">Location</p>
      <p style="margin:4px 0 16px;color:#4A4A4A">${locationRow}</p>
      ${event.bringAlong
            ? `<p style="margin:0;color:#9C9C9C;font-size:14px">Come along with</p>
      <p style="margin:4px 0 16px;color:#4A4A4A">${escapeHtml(event.bringAlong)}</p>`
            : ''}
      <p style="margin:24px 0 0;color:#6D7786;font-size:14px">A calendar invite is attached so you can add it to your calendar.</p>
    </td></tr>
  </table>
  <p style="text-align:center;color:#9C9C9C;font-size:12px;margin-top:16px">Hello Creatives</p>
</body></html>`
}

export const sendBookingEmail = async ({
    event,
    name,
    email,
    eventUrl,
}: {
    event: PrivateEvent
    name: string
    email: string
    eventUrl: string
}) => {
    if (!resend) {
        console.warn('[events] RESEND_API_KEY is not set, so no confirmation email was sent.')
        return false
    }

    const { error } = await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `You're booked: ${event.title}`,
        html: buildHtml(event, name),
        attachments: [
            {
                filename: 'event.ics',
                content: Buffer.from(buildCalendarInvite(event, eventUrl)).toString('base64'),
                contentType: 'text/calendar',
            },
        ],
    })

    if (error) {
        console.error('[events] Resend failed to send the confirmation email', error)
        return false
    }
    return true
}
