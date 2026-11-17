'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toggleDomain } from '@/lib/helpers/getSubdomain'
import type { BookingResult, PublicEvent } from '@/lib/events/types'
import type { ShareOutcome } from '../use-event-share'
import EventCard from './event-card'
import PastEventCard from './past-event-card'
import RegisterModal from './register-modal'
import BookingSuccessModal from './booking-success-modal'

type Tab = 'upcoming' | 'past'

interface EventsViewProps {
    upcoming: PublicEvent[]
    past: PublicEvent[]
    /** From a shared link (?event=…): opens that event's registration form. */
    initialEventSlug?: string
}

const SHARE_MESSAGES: Partial<Record<ShareOutcome, string>> = {
    downloaded: 'Image downloaded. Share it anywhere!',
    failed: 'Couldn’t create the image. Please try again.',
}

const EventsView = ({ upcoming, past, initialEventSlug }: EventsViewProps) => {
    const [tab, setTab] = useState<Tab>(() =>
        initialEventSlug && past.some((e) => e.slug === initialEventSlug) ? 'past' : 'upcoming'
    )
    const [registering, setRegistering] = useState<PublicEvent | null>(() =>
        upcoming.find((e) => e.slug === initialEventSlug) ?? null
    )
    const [booking, setBooking] = useState<{ event: PublicEvent; result: BookingResult } | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    useEffect(() => {
        if (!initialEventSlug) return
        document.getElementById(`event-${initialEventSlug}`)?.scrollIntoView({ block: 'start' })
    }, [initialEventSlug])

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 3000)
        return () => clearTimeout(timer)
    }, [toast])

    const handleShared = useCallback((outcome: ShareOutcome) => {
        const message = SHARE_MESSAGES[outcome]
        if (message) setToast(message)
    }, [])

    const closeRegister = useCallback(() => setRegistering(null), [])
    const closeBooking = useCallback(() => setBooking(null), [])

    const events = tab === 'upcoming' ? upcoming : past

    return (
        <div className='w-full pb-[72px] pt-[84px] lg:pt-[42px]'>
            {/* Header */}
            <div className='flex max-w-[477px] flex-col gap-[48px]'>
                <button
                    type='button'
                    onClick={() => toggleDomain('events')}
                    className='flex h-[33px] w-fit cursor-pointer items-center gap-[8px] rounded-[108px] border border-[#E1E7EC] bg-white px-[12px] font-display text-[16px] font-semibold text-black'
                >
                    <Image src='/icons/globe.svg' alt='' width={16} height={16} />
                    Visit HelloCreative.io
                </button>
                <div className='flex flex-col gap-[24px]'>
                    <Image
                        src='/icons/active-podcast-icon.svg'
                        alt=''
                        width={39}
                        height={70}
                        className='ml-[8px] -rotate-15'
                        priority
                    />
                    <div className='flex flex-col gap-[12px]'>
                        <h1 className='text-[32px] font-medium'>Events</h1>
                        <p className='font-medium text-[#6D7786]'>
                            A space for honest conversations, practical insights, and shared experiences from
                            creatives like you — all centered around growth, clarity, and purpose.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div
                role='tablist'
                aria-label='Events'
                className='mt-[48px] flex w-full gap-[12px] rounded-[54px] bg-[#F5F5F5] p-[8px] md:p-[12px] lg:mt-[107px] lg:w-1/2'
            >
                {(['upcoming', 'past'] as const).map((value) => {
                    const active = tab === value
                    return (
                        <button
                            key={value}
                            type='button'
                            role='tab'
                            aria-selected={active}
                            onClick={() => setTab(value)}
                            className={cn(
                                'flex h-[56px] flex-1 cursor-pointer items-center justify-center gap-[10px] rounded-[52px] px-[12px] font-display text-[16px] font-semibold text-black transition-colors md:px-[48px]',
                                active ? 'bg-white' : 'bg-[#F5F5F5] hover:bg-white/60'
                            )}
                        >
                            <Image
                                src={active ? '/icons/events/diamond-active.svg' : '/icons/events/diamond.svg'}
                                alt=''
                                width={20}
                                height={20}
                            />
                            {value === 'upcoming' ? 'Upcoming' : 'Past Sessions'}
                        </button>
                    )
                })}
            </div>

            {/* Cards */}
            <div role='tabpanel' className='mt-[36px] grid grid-cols-1 gap-x-[20px] gap-y-[24px] lg:grid-cols-2'>
                {events.length === 0 && (
                    <p className='col-span-full rounded-[24px] bg-[#FBFBFB] px-6 py-16 text-center font-medium text-[#6D7786]'>
                        {tab === 'upcoming'
                            ? 'No upcoming events right now. Subscribe below to hear about the next one.'
                            : 'No past sessions yet.'}
                    </p>
                )}
                {events.map((event) =>
                    tab === 'upcoming' ? (
                        <EventCard
                            key={event.id}
                            event={event}
                            onRegister={setRegistering}
                            onShared={handleShared}
                        />
                    ) : (
                        <PastEventCard key={event.id} event={event} />
                    )
                )}
            </div>

            <RegisterModal
                event={registering}
                onClose={closeRegister}
                onBooked={(result) => {
                    if (registering) setBooking({ event: registering, result })
                    setRegistering(null)
                }}
            />
            {booking && (
                <BookingSuccessModal
                    event={booking.event}
                    booking={booking.result}
                    onClose={closeBooking}
                    onShared={handleShared}
                />
            )}

            {toast && (
                <div
                    role='status'
                    className='fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#222] px-5 py-3 text-sm font-medium text-white shadow-lg'
                >
                    {toast}
                </div>
            )}
        </div>
    )
}

export default EventsView
