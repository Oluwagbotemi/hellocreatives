# Events page plan

Figma (desktop list page): https://www.figma.com/design/dAo84w7P6v7bQz9RnEQ9qg/Untitled?node-id=91-3419

## Decisions
- **Content:** Option B. The team adds and edits events in a content tool, without touching code. The tool is still to be chosen.
- **Address:** `events.hellocreatives.io`
- **Homepage:** the "Podcast" tile becomes "Events", and its "Coming Soon" tag is removed.
- **Tabs:** All / Upcoming / Past Sessions, sorted automatically by each event's date.

## Designs (Figma Page 2)
- [x] Events list, desktop (`93:3905`). Tabs are now Upcoming / Past Sessions only; "See Details" is replaced by "Share Event".
- [x] Mobile layout (`93:4359`)
- [x] Registration form modal (`93:4228`): full name, email (required), job role
- [x] Booking successful modal, desktop (`93:4848`) and mobile (`93:4673`), with "Share with Others" and "Join Call"
- [x] Share image (`93:5137`, 590×541)
- [ ] "See Details" page (still needed?)

## Share feature
- Clicking "Share Event" or "Share with Others" creates an image from the event's details.
- Phones open the system share menu (WhatsApp, Instagram and so on).
- Computers download the image.
- Plan: build the image on the server with Next.js `ImageResponse`, then share it with the browser's Web Share API, falling back to a download.

## Event fields (from the card design)
- Title, description, host, image or logo
- Date and time
- Location type: virtual (with a platform such as Google Meet) or in person (with an address and a "Get Directions" link)
- "Come along with" text
- Registration (depends on the form design)

## Open questions
- Which content tool to use (see the options discussed in chat)
- Where registration form submissions should be stored
- Events tile icon: reuse the podcast icon, or a new events icon?
