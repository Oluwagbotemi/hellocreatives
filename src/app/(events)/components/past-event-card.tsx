import Image from 'next/image'
import type { PublicEvent } from '@/lib/events/types'
import { CardShell, EventSummary } from './event-card-parts'

const PastEventCard = ({ event }: { event: PublicEvent }) => (
    <CardShell id={`event-${event.slug}`}>
        <EventSummary event={event} />
        {event.recordingUrl ? (
            <a
                href={event.recordingUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-auto flex h-[56px] w-full items-center justify-center gap-[10px] rounded-[52px] border border-[#E8E8E8] bg-[#FAFAFA] px-[24px] font-display text-[16px] font-semibold text-black transition-colors hover:bg-white'
            >
                Watch Recording
                <Image src='/icons/events/video.svg' alt='' width={18} height={18} />
            </a>
        ) : (
            <p className='mt-auto flex h-[56px] w-full items-center justify-center gap-[10px] rounded-[52px] bg-[#FCFCFC] px-[24px] font-display text-[16px] font-semibold text-black'>
                <Image src='/icons/events/video-slash.svg' alt='' width={18} height={18} />
                No recording available
            </p>
        )}
    </CardShell>
)

export default PastEventCard
