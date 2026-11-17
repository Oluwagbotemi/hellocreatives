'use client'

import Image from 'next/image'
import Modal from '@/components/modal'
import { formatEventDate } from '@/lib/events/format'
import type { BookingResult, PublicEvent } from '@/lib/events/types'
import { useEventShare, type ShareOutcome } from '../use-event-share'
import { DirectionsLink, PlatformBadge, ShareIcon } from './event-card-parts'

interface BookingSuccessModalProps {
    event: PublicEvent
    booking: BookingResult
    onClose: () => void
    onShared: (outcome: ShareOutcome) => void
}

const InfoRow = ({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) => (
    <div className='flex items-center gap-[12px]'>
        <span className='flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#F5F8FA]'>
            <Image src={icon} alt='' width={20} height={20} />
        </span>
        <div className='flex min-w-0 flex-1 flex-col gap-[2px] text-[14px] font-medium'>
            <p className='text-[#9C9C9C]'>{label}</p>
            {children}
        </div>
    </div>
)

const BookingSuccessModal = ({ event, booking, onClose, onShared }: BookingSuccessModalProps) => {
    const { share, prefetch } = useEventShare(event)

    return (
        <Modal
            open
            onClose={onClose}
            className='flex max-w-[712px] flex-col gap-[12px] rounded-[12px] bg-[#F5F8FA] px-[8px] py-[12px]'
        >
            <div className='flex flex-col gap-[24px] rounded-[12px] bg-white p-[12px]'>
                <div className='flex flex-col gap-[24px]'>
                    <div className='flex items-start justify-between gap-[12px]'>
                        <span className='relative flex shrink-0 items-center gap-[10px] overflow-clip rounded-full bg-[#00C159] p-[12px]'>
                            <Image src='/icons/events/falling-star.svg' alt='' width={24} height={24} />
                            <span className='hidden font-display text-[16px] font-semibold text-white sm:inline'>
                                Booking Successful
                            </span>
                            <Image
                                src='/icons/events/success-shape.svg'
                                alt=''
                                width={45}
                                height={45}
                                className='absolute left-[-5px] top-[calc(50%+10.5px)] -translate-y-1/2'
                            />
                            <span className='sr-only sm:hidden'>Booking Successful</span>
                        </span>
                        <button
                            type='button'
                            onPointerEnter={prefetch}
                            onFocus={prefetch}
                            onClick={async () => onShared(await share())}
                            className='flex h-[48px] cursor-pointer items-center justify-center gap-[10px] rounded-[52px] border border-[#E8E8E8] bg-[#FAFAFA] px-[24px] font-display text-[16px] font-semibold text-black transition-colors hover:bg-white sm:px-[48px]'
                        >
                            Share with Others
                            <ShareIcon />
                        </button>
                    </div>
                    <p className='text-[16px] font-semibold text-[#222]'>
                        {booking.emailSent
                            ? 'We’ve locked in your booking. Meeting details will be sent to your email'
                            : 'We’ve locked in your booking. Keep these details handy for the day.'}
                    </p>
                </div>

                <div className='flex flex-col gap-[24px]'>
                    <InfoRow icon='/icons/events/calendar-20.svg' label='Date & Time'>
                        <p className='text-[#6D7786]'>{formatEventDate(event.startsAt)}</p>
                    </InfoRow>
                    <InfoRow icon='/icons/events/location-20.svg' label='Location'>
                        <div className='flex items-center gap-[10px]'>
                            <p className='flex-1 text-[#6D7786]'>
                                {event.locationType === 'virtual' ? 'Virtual' : event.address}
                            </p>
                            {event.platform && (
                                <PlatformBadge
                                    platform={event.platform}
                                    href={booking.callLink}
                                    linkText='Join Call'
                                    className='text-[14px]'
                                />
                            )}
                            {event.directionsUrl && (
                                <DirectionsLink href={event.directionsUrl} className='text-[14px]' />
                            )}
                        </div>
                    </InfoRow>
                </div>

                {event.bringAlong && (
                    <>
                        <hr className='w-full border-0 border-t border-[#E1E7EC]' />
                        <div className='flex flex-col gap-[6px] text-[14px] font-medium'>
                            <p className='text-[#9C9C9C]'>Come along with</p>
                            <p className='text-[#6D7786]'>{event.bringAlong}</p>
                        </div>
                    </>
                )}
            </div>

            <button
                type='button'
                onClick={onClose}
                className='flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[12px] border border-[#E1E7EC] bg-white font-display text-[14px] font-semibold text-[#4A4A4A]'
            >
                Close
            </button>
        </Modal>
    )
}

export default BookingSuccessModal
