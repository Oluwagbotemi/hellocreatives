'use client'

import type { PublicEvent } from '@/lib/events/types'
import { useEventShare, type ShareOutcome } from '../use-event-share'
import { CardShell, EventDetails, EventSummary, ShareIcon } from './event-card-parts'

interface EventCardProps {
    event: PublicEvent
    onRegister: (event: PublicEvent) => void
    onShared: (outcome: ShareOutcome) => void
}

const EventCard = ({ event, onRegister, onShared }: EventCardProps) => {
    const { share, prefetch, elementRef } = useEventShare(event)

    return (
        <CardShell id={`event-${event.slug}`} shellRef={elementRef}>
            <EventSummary event={event} />
            <EventDetails event={event} />
            <div className='mt-auto flex flex-col gap-[12px] md:flex-row'>
                <button
                    type='button'
                    onClick={() => onRegister(event)}
                    className='flex h-[56px] shrink-0 cursor-pointer items-center justify-center gap-[10px] rounded-[52px] bg-black md:flex-1 px-[20px] font-display text-[16px] font-semibold text-white transition-opacity hover:opacity-85'
                >
                    Click To Register
                </button>
                <button
                    type='button'
                    onPointerEnter={prefetch}
                    onFocus={prefetch}
                    onClick={async () => onShared(await share())}
                    className='flex h-[56px] cursor-pointer items-center justify-center gap-[10px] rounded-[52px] border border-[#E8E8E8] bg-[#FAFAFA] px-[48px] font-display text-[16px] font-semibold text-black transition-colors hover:bg-white'
                >
                    Share Event
                    <ShareIcon />
                </button>
            </div>
        </CardShell>
    )
}

export default EventCard
