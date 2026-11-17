'use client'

import Image from 'next/image'
import { useState } from 'react'
import Modal from '@/components/modal'
import type { BookingResult, PublicEvent } from '@/lib/events/types'

interface RegisterModalProps {
    event: PublicEvent | null
    onClose: () => void
    onBooked: (result: BookingResult) => void
}

const inputClass =
    'w-full rounded-[72px] border border-[#CED6DE] bg-white py-[12px] pl-[24px] pr-[12px] text-[14px] font-medium text-[#222] placeholder:text-[#6D7786] focus:border-[#222] focus:outline-none'

const labelClass = 'font-display text-[16px] font-medium text-[#6D7786]'

const RegisterModal = ({ event, onClose, onBooked }: RegisterModalProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!event) return
        const form = new FormData(e.currentTarget)

        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/events/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: event.slug,
                    name: form.get('name'),
                    email: form.get('email'),
                    jobRole: form.get('jobRole'),
                    website: form.get('website'),
                }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
            onBooked(data as BookingResult)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            open={Boolean(event)}
            onClose={loading ? () => { } : onClose}
            className='flex flex-col gap-[12px] rounded-[12px] bg-[#F5F8FA] px-[8px] py-[12px]'
        >
            <div className='flex items-center gap-[8px] py-[8px] pl-[12px]'>
                <span className='flex shrink-0 items-center rounded-[8px] bg-[#8B7FFD] p-[8px]'>
                    <Image src='/icons/events/tags.svg' alt='' width={20} height={20} />
                </span>
                <div className='flex flex-col gap-[2px]'>
                    <h2 className='font-display text-[16px] font-semibold text-[#222]'>Register for our Event</h2>
                    <p className='text-[14px] text-[#6D7786]'>
                        Declare your interest in our event by filling the form below
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-[12px]'>
                <div className='flex flex-col gap-[23px] rounded-[12px] bg-white p-[12px]'>
                    <label className='flex flex-col gap-[8px]'>
                        <span className={labelClass}>Full Name</span>
                        <input name='name' type='text' autoComplete='name' placeholder='John doe' maxLength={120} className={inputClass} />
                    </label>
                    <label className='flex flex-col gap-[8px]'>
                        <span className={labelClass}>
                            Email Address <span className='text-[#B42318]'>*</span>
                        </span>
                        <input
                            name='email'
                            type='email'
                            required
                            autoComplete='email'
                            placeholder='user@email.com'
                            maxLength={200}
                            className={inputClass}
                        />
                    </label>
                    <label className='flex flex-col gap-[8px]'>
                        <span className={labelClass}>Job Role</span>
                        <input name='jobRole' type='text' autoComplete='organization-title' placeholder='designer' maxLength={120} className={inputClass} />
                    </label>
                    {/* Hidden from people; bots that fill it in are rejected. */}
                    <input name='website' type='text' tabIndex={-1} autoComplete='off' aria-hidden className='hidden' />
                    {error && (
                        <p role='alert' className='text-[14px] text-[#B42318]'>
                            {error}
                        </p>
                    )}
                </div>

                <div className='flex gap-[12px] font-display text-[16px] font-semibold'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={loading}
                        className='flex h-[44px] flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-[#E1E7EC] bg-white text-[#4A4A4A] disabled:opacity-50'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        disabled={loading}
                        className='flex h-[44px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#222] text-white disabled:opacity-60'
                    >
                        {loading ? 'Submitting…' : 'Submit'}
                        {!loading && <Image src='/icons/events/tick-double.svg' alt='' width={18} height={12} />}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default RegisterModal
