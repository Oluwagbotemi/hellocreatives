import type { StructureResolver } from 'sanity/structure'

// Sidebar of the Studio: Events, Registrations grouped by event, and all registrations.
export const structure: StructureResolver = (S) =>
    S.list()
        .title('Hello Creatives')
        .items([
            S.documentTypeListItem('event').title('Events'),
            S.listItem()
                .title('Registrations by event')
                .child(
                    S.documentTypeList('event')
                        .title('Pick an event')
                        .defaultOrdering([{ field: 'startsAt', direction: 'desc' }])
                        .child((eventId) =>
                            S.documentList()
                                .title('Registrations')
                                .schemaType('registration')
                                .filter('_type == "registration" && event._ref == $eventId')
                                .params({ eventId })
                                .defaultOrdering([{ field: 'registeredAt', direction: 'desc' }])
                        )
                ),
            S.documentTypeListItem('registration').title('All registrations'),
        ])
