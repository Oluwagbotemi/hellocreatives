import Wrapper from '@/components/wrapper'
import Footer from '@/components/footer'
import EventsPage, { getEventsMetadata } from '../(events)'

// The events page at /events. In production it's served at events.hellocreatives.io
// (see the homepage route); this path is used on preview links and locally.

type Props = { searchParams: Promise<{ event?: string }> }

export const generateMetadata = async ({ searchParams }: Props) =>
    getEventsMetadata((await searchParams).event)

export default async function EventsRoute({ searchParams }: Props) {
    return (
        <>
            <Wrapper>
                <EventsPage eventSlug={(await searchParams).event} />
            </Wrapper>
            <Footer />
        </>
    )
}
