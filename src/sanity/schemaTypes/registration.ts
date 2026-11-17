import { defineField, defineType } from 'sanity'

// Created automatically by the website when someone registers.
// Read-only in the Studio.
export const registrationType = defineType({
    name: 'registration',
    title: 'Registration',
    type: 'document',
    readOnly: true,
    fields: [
        defineField({ name: 'event', title: 'Event', type: 'reference', to: [{ type: 'event' }] }),
        defineField({ name: 'name', title: 'Full name', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'jobRole', title: 'Job role', type: 'string' }),
        defineField({ name: 'registeredAt', title: 'Registered at', type: 'datetime' }),
        defineField({
            name: 'emailSent',
            title: 'Confirmation email sent',
            type: 'boolean',
        }),
    ],
    orderings: [
        {
            title: 'Newest first',
            name: 'registeredAtDesc',
            by: [{ field: 'registeredAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: { name: 'name', email: 'email', eventTitle: 'event.title' },
        prepare({ name, email, eventTitle }) {
            return {
                title: name || email,
                subtitle: [email, eventTitle].filter(Boolean).join(' · '),
            }
        },
    },
})
