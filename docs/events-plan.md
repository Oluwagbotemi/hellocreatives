# Events page plan

Figma file: https://www.figma.com/design/dAo84w7P6v7bQz9RnEQ9qg/Untitled (Page 2)

## Decisions
- **Content tool:** Sanity. The team creates and edits events there, without touching code.
- **Address:** `events.hellocreatives.io`
- **Homepage:** the "Podcast" tile becomes "Events", and its "Coming Soon" tag is removed.
- **Tabs:** Upcoming / Past Sessions, sorted automatically by each event's date.
- **No per-event details page.**
- **Past events** move to the Past Sessions tab automatically. Their cards show "Watch Recording" when a recording link exists, and "No recording available" when it doesn't.
- **Share image** includes the web link and a QR code. On phones, the link is also sent as text with the image.
- **Call link and platform** are set when the event is created. The platform (Google Meet / Microsoft Teams) shows its logo automatically. The call link is never in the public page; it's only shown and emailed after registration.
- **Registrations** are stored in Sanity, linked to their event.
- **Share link / QR code** lands on the events page with that event's registration form open.
- **Email service:** Resend.

**Status:** built. See `docs/events-setup.md` for the account setup steps.

## Designs
- Upcoming list, desktop: `93:3905`
- Past Sessions list, desktop: `94:5213`
- Mobile: `93:4359`
- Registration form modal: `93:4228`
- Booking successful modal: desktop `93:4848`, mobile `93:4673`
- Share image: `93:5137` (590×541)

## Event fields in Sanity
- Type: Workshop / Event
- Title, description, host name
- Card graphic: a different image per event, uploaded in Sanity. Samples are in Figma (`96:5729`–`96:5732`: green, purple, orange, blue). Upload guide: transparent PNG/WebP, about 2.2:1 ratio (e.g. 966×438).
- Date and time
- Location type:
  - **Virtual:** platform (Google Meet / Microsoft Teams) and call link (private)
  - **In person:** address, with "Get Directions" built from it as a Google Maps link
- "Come along with" text
- Recording link (optional, used for past events)

## Share feature
- Clicking "Share Event" or "Share with Others" creates the image from the event's details.
- Phones open the system share menu; computers download the image.
- Plan: build the image on the server with Next.js `ImageResponse`, then share it with the browser's Web Share API, falling back to a download.

## Open questions
- Past Sessions on mobile: assumed to stack like the Upcoming cards
- Setup the owner must do: create the Sanity project and the Resend account, verify the domain for email, and add the `events.` subdomain in Vercel
