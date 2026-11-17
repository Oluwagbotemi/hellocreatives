import Image from 'next/image'
import { cn } from '@/lib/utils'
import { formatEventDate } from '@/lib/events/format'
import { DIRECTIONS_COLOR, PLATFORMS } from '@/lib/events/platforms'
import type { PublicEvent } from '@/lib/events/types'

/** Grey top block: tag, title, description, host and the event graphic. */
export const EventSummary = ({ event }: { event: PublicEvent }) => (
    <div className='relative flex flex-col gap-[48px] overflow-clip rounded-[20px] bg-[#FAFAFA] p-[20px]'>
        {event.graphicUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={event.graphicUrl}
                alt=''
                aria-hidden
                className='pointer-events-none absolute right-[-17px] top-[-2px] h-[78px] w-[172px] object-cover blur-[2px]'
            />
        )}
        <span className='relative flex h-[33px] w-fit items-center rounded-[108px] border border-[#E1E7EC] bg-white px-[12px] font-display text-[16px] font-semibold text-black'>
            {event.eventType === 'workshop' ? 'Workshop' : 'Event'}
        </span>
        <div className='flex flex-col gap-[24px]'>
            <div className='flex flex-col gap-[12px]'>
                <h3 className='font-sans text-[20px] font-semibold text-black md:text-[24px]'>{event.title}</h3>
                <p className='text-[16px] font-medium text-[#6D7786]'>{event.description}</p>
            </div>
            <div className='flex items-center gap-[6px]'>
                <Image src='/icons/events/user.svg' alt='' width={18} height={18} />
                <span className='text-[16px] font-medium text-[#9C9C9C]'>{event.host}</span>
            </div>
        </div>
    </div>
)

/** Platform logo + name (e.g. Google Meet), or the "Join Call" link after booking. */
export const PlatformBadge = ({
    platform,
    href,
    linkText,
    className,
}: {
    platform: NonNullable<PublicEvent['platform']>
    href?: string | null
    linkText?: string
    className?: string
}) => {
    const config = PLATFORMS[platform]
    const content = (
        <>
            <Image src={config.icon} alt='' width={config.iconWidth} height={config.iconHeight} />
            <span className='font-display font-semibold' style={{ color: config.color }}>
                {linkText ?? config.label}
            </span>
        </>
    )
    return href ? (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn('flex shrink-0 items-center gap-[8px] hover:underline', className)}
        >
            {content}
        </a>
    ) : (
        <span className={cn('flex shrink-0 items-center gap-[8px]', className)}>{content}</span>
    )
}

export const DirectionsLink = ({ href, className }: { href: string; className?: string }) => (
    <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={cn('flex shrink-0 items-center gap-[6px] font-display font-semibold hover:underline', className)}
        style={{ color: DIRECTIONS_COLOR }}
    >
        Get Directions
        <Image src='/icons/events/directions.svg' alt='' width={18} height={18} />
    </a>
)

const DetailLabel = ({ icon, children }: { icon?: string; children: React.ReactNode }) => (
    <div className='flex items-center gap-[6px] text-[16px] font-medium text-[#9C9C9C]'>
        {icon && <Image src={icon} alt='' width={18} height={18} />}
        {children}
    </div>
)

const Divider = () => <hr className='w-full border-0 border-t border-[#E1E7EC]' />

/** Date, location and "come along with" rows on the upcoming-event card. */
export const EventDetails = ({ event }: { event: PublicEvent }) => (
    <div className='flex flex-col gap-[16px] p-[12px] text-[16px] font-medium'>
        <div className='flex flex-col gap-[12px]'>
            <DetailLabel icon='/icons/events/calendar.svg'>Date &amp; Time</DetailLabel>
            <p className='text-[#6D7786]'>{formatEventDate(event.startsAt)}</p>
        </div>
        <Divider />
        <div className='flex flex-col gap-[12px]'>
            <DetailLabel icon='/icons/events/location.svg'>Location</DetailLabel>
            <div className='flex items-center gap-[10px]'>
                <p className='flex-1 text-[#6D7786]'>
                    {event.locationType === 'virtual' ? 'Virtual' : event.address}
                </p>
                {event.platform && <PlatformBadge platform={event.platform} />}
                {event.directionsUrl && <DirectionsLink href={event.directionsUrl} />}
            </div>
        </div>
        {event.bringAlong && (
            <>
                <Divider />
                <div className='flex flex-col gap-[12px]'>
                    <DetailLabel>Come along with</DetailLabel>
                    <p className='text-[#6D7786]'>{event.bringAlong}</p>
                </div>
            </>
        )}
    </div>
)

/** The outer card frame shared by upcoming and past cards. */
export const CardShell = ({
    id,
    children,
    shellRef,
}: {
    id?: string
    children: React.ReactNode
    shellRef?: React.Ref<HTMLElement>
}) => (
    <article
        id={id}
        ref={shellRef}
        className='w-full scroll-mt-6 overflow-clip rounded-[24px] bg-[#FBFBFB] p-[4px]'
    >
        <div className='flex h-full flex-col gap-[20px] rounded-[22px] bg-white p-[12px] md:p-[16px]'>{children}</div>
    </article>
)

export const ShareIcon = () => (
    <Image src='/icons/events/share.svg' alt='' width={18} height={18} className='-scale-x-100' />
)
