import { defineField, defineType } from 'sanity'

export const PLATFORM_OPTIONS = [
    { title: 'Google Meet', value: 'googleMeet' },
    { title: 'Microsoft Teams', value: 'microsoftTeams' },
]

type EventDocument = {
    locationType?: 'virtual' | 'inPerson'
    startsAt?: string
}

export const eventType = defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    groups: [
        { name: 'details', title: 'Details', default: true },
        { name: 'location', title: 'Location' },
        { name: 'after', title: 'After the event' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'details',
            validation: (rule) => rule.required().max(80),
        }),
        defineField({
            name: 'slug',
            title: 'Link name',
            description: 'Used in the share link. Click "Generate" to create it from the title.',
            type: 'slug',
            group: 'details',
            options: { source: 'title', maxLength: 80 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'eventType',
            title: 'Type',
            description: 'Shown as the small label on the card.',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'Event', value: 'event' },
                    { title: 'Workshop', value: 'workshop' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'event',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Short description',
            type: 'text',
            rows: 3,
            group: 'details',
            validation: (rule) => rule.required().max(220),
        }),
        defineField({
            name: 'host',
            title: 'Host / speaker',
            type: 'string',
            group: 'details',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'graphic',
            title: 'Card graphic',
            description:
                'Transparent PNG or WebP, wide shape (about 2.2 : 1, e.g. 966 × 438). Keep the important part away from the edges.',
            type: 'image',
            group: 'details',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'startsAt',
            title: 'Starts at',
            description: 'Enter it in your own time zone; the website shows it in Lagos time (WAT).',
            type: 'datetime',
            group: 'details',
            options: { timeStep: 15 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'endsAt',
            title: 'Ends at (optional)',
            description:
                'The event moves to "Past Sessions" after this time. If empty, 2 hours after the start.',
            type: 'datetime',
            group: 'details',
            options: { timeStep: 15 },
            validation: (rule) =>
                rule.custom((value, context) => {
                    const startsAt = (context.document as EventDocument | undefined)?.startsAt
                    if (value && startsAt && new Date(value) <= new Date(startsAt)) {
                        return 'The end time must be after the start time'
                    }
                    return true
                }),
        }),
        defineField({
            name: 'bringAlong',
            title: 'Come along with',
            description: 'e.g. "Your notepad and biro"',
            type: 'string',
            group: 'details',
        }),
        defineField({
            name: 'locationType',
            title: 'Where is it?',
            type: 'string',
            group: 'location',
            options: {
                list: [
                    { title: 'Virtual', value: 'virtual' },
                    { title: 'In person', value: 'inPerson' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'virtual',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'platform',
            title: 'Call platform',
            description: 'The right logo is added to the card automatically.',
            type: 'string',
            group: 'location',
            options: { list: PLATFORM_OPTIONS, layout: 'radio' },
            hidden: ({ document }) => (document as EventDocument | undefined)?.locationType !== 'virtual',
            validation: (rule) =>
                rule.custom((value, context) => {
                    const doc = context.document as EventDocument | undefined
                    if (doc?.locationType === 'virtual' && !value) return 'Choose the call platform'
                    return true
                }),
        }),
        defineField({
            name: 'callLink',
            title: 'Call link',
            description:
                'Private. Only shown to people after they register, and sent in their confirmation email.',
            type: 'url',
            group: 'location',
            hidden: ({ document }) => (document as EventDocument | undefined)?.locationType !== 'virtual',
            validation: (rule) =>
                rule.uri({ scheme: ['https'] }).custom((value, context) => {
                    const doc = context.document as EventDocument | undefined
                    if (doc?.locationType === 'virtual' && !value) return 'Add the call link'
                    return true
                }),
        }),
        defineField({
            name: 'address',
            title: 'Address',
            description: 'e.g. "Ikeja, Lagos". "Get Directions" opens this in Google Maps.',
            type: 'string',
            group: 'location',
            hidden: ({ document }) => (document as EventDocument | undefined)?.locationType !== 'inPerson',
            validation: (rule) =>
                rule.custom((value, context) => {
                    const doc = context.document as EventDocument | undefined
                    if (doc?.locationType === 'inPerson' && !value) return 'Add the address'
                    return true
                }),
        }),
        defineField({
            name: 'mapsLink',
            title: 'Google Maps link (optional)',
            description: 'Only needed if searching the address doesn\'t find the right place.',
            type: 'url',
            group: 'location',
            hidden: ({ document }) => (document as EventDocument | undefined)?.locationType !== 'inPerson',
        }),
        defineField({
            name: 'recordingUrl',
            title: 'Recording link',
            description:
                'Add after the event. Past events show "Watch Recording" when this is set, otherwise "No recording available".',
            type: 'url',
            group: 'after',
        }),
    ],
    orderings: [
        {
            title: 'Date, newest first',
            name: 'startsAtDesc',
            by: [{ field: 'startsAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: { title: 'title', startsAt: 'startsAt', media: 'graphic' },
        prepare({ title, startsAt, media }) {
            return {
                title,
                subtitle: startsAt
                    ? new Date(startsAt).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Africa/Lagos',
                    })
                    : 'No date yet',
                media,
            }
        },
    },
})
