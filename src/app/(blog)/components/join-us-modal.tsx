'use client'

import Modal from '@/components/modal'
import Image from 'next/image'
import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { cn } from '@/lib/utils'
import { EMAIL_ERROR, countWords, isValidEmail } from '@/lib/forms'

interface JoinUsModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const MAX_WORDS = 1000

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const inputClass = (invalid: boolean) =>
    cn(
        'w-full mt-2 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black',
        invalid ? 'border-red-500' : 'border-gray-300'
    )

const FieldError = ({ id, message }: { id: string; message?: string }) =>
    message ? (
        <p id={id} role='alert' className='mt-1 pl-4 text-sm text-red-600'>
            {message}
        </p>
    ) : null

const JoinUsModal = ({ open, setOpen }: JoinUsModalProps) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState<Errors>({})
    const [loading, setLoading] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)
    const [sentTo, setSentTo] = useState<string | null>(null)

    const wordCount = countWords(message)
    const overLimit = wordCount > MAX_WORDS

    const close = () => {
        if (loading) return
        setOpen(false)
        // After a successful send, start fresh next time the form opens.
        if (sentTo) {
            setSentTo(null)
            setErrors({})
        }
    }

    const validate = (): Errors => {
        const next: Errors = {}
        if (!name.trim()) next.name = 'Please enter your name.'
        if (!isValidEmail(email)) next.email = EMAIL_ERROR
        if (!message.trim()) next.message = 'Please tell us what you’d like to write about.'
        else if (overLimit) next.message = `Please keep your pitch to ${MAX_WORDS.toLocaleString()} words or fewer.`
        return next
    }

    const clearError = (field: Field) => {
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const found = validate()
        setErrors(found)
        if (Object.values(found).some(Boolean)) return

        setLoading(true)
        setSendError(null)
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_PITCH_TEMPLATE_ID!,
                { name: name.trim(), email: email.trim(), message: message.trim() },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            )
            setSentTo(email.trim())
            setName('')
            setEmail('')
            setMessage('')
        } catch {
            setSendError('Something went wrong sending your pitch. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={open} onClose={close} className="bg-[#F5F8FA] p-2">
            <div className="flex gap-1 items-center p-[12px]">
                <Image src="/icons/write-icon.svg" alt="" height={36} width={36} />
                <div className="flex flex-col text-[14px]">
                    <p className="font-semibold font-display text-black">Write for us</p>
                    <p>Share a pitch into what you want to write and we’d get back to you.</p>
                </div>
            </div>

            {sentTo ? (
                <>
                    <div role='status' className="mt-[12px] flex flex-col items-center gap-2 bg-white rounded-[12px] px-[12px] py-[40px] text-center">
                        <p className="font-display font-semibold text-[20px] text-black">Pitch received 🎉</p>
                        <p>
                            Thank you for sharing your idea. We’ll read it and get back to you at{' '}
                            <span className="font-semibold text-black">{sentTo}</span>.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="mt-[12px] font-display font-semibold rounded-[12px] bg-black text-white w-full h-[44px] cursor-pointer"
                        onClick={close}
                    >
                        Close
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mt-[12px] flex flex-col gap-[23px] bg-white rounded-[12px] p-[12px]">
                        <label className="block">
                            <span className="text-base font-medium font-display">
                                Full name <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="text"
                                name="name"
                                autoComplete="name"
                                maxLength={120}
                                className={inputClass(Boolean(errors.name))}
                                placeholder="Enter your full name"
                                value={name}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? 'pitch-name-error' : undefined}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    clearError('name')
                                }}
                            />
                            <FieldError id="pitch-name-error" message={errors.name} />
                        </label>

                        <label className="block">
                            <span className="text-base font-medium font-display">
                                Email Address <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                maxLength={200}
                                className={inputClass(Boolean(errors.email))}
                                placeholder="user@email.com"
                                value={email}
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? 'pitch-email-error' : undefined}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    clearError('email')
                                }}
                            />
                            <FieldError id="pitch-email-error" message={errors.email} />
                        </label>

                        <label className="block">
                            <span className="text-base font-medium font-display">
                                Article Pitch (max of 1,000 words) <span className="text-red-500">*</span>
                            </span>
                            <textarea
                                name="message"
                                className={cn(
                                    'md:h-[170px] h-[120px] w-full mt-2 px-4 py-3 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-black',
                                    errors.message || overLimit ? 'border-red-500' : 'border-gray-300'
                                )}
                                placeholder="Enter your pitch"
                                value={message}
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby="pitch-word-count"
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    clearError('message')
                                }}
                            />
                            <div className="mt-1 flex justify-between gap-4 pl-4 text-sm">
                                <span className="text-red-600" role={errors.message ? 'alert' : undefined}>
                                    {errors.message}
                                </span>
                                <span
                                    id="pitch-word-count"
                                    className={cn('shrink-0', overLimit ? 'text-red-600 font-semibold' : 'text-[#6D7786]')}
                                >
                                    {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
                                </span>
                            </div>
                        </label>

                        {sendError && (
                            <p role="alert" className="text-sm text-red-600">
                                {sendError}
                            </p>
                        )}
                    </div>

                    <div className="mt-[12px] flex flex-col md:flex-row gap-[12px] justify-between font-display">
                        <button
                            type="button"
                            className="font-semibold rounded-[12px] bg-white border border-[#E1E7EC] w-full h-[44px] cursor-pointer disabled:opacity-50"
                            onClick={close}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="font-semibold flex justify-center items-center gap-1 bg-black rounded-[12px] w-full h-[44px] text-white cursor-pointer disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                            {!loading && <Image src="/icons/tick-double.svg" alt="" height={20} width={20} />}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    )
}

export default JoinUsModal
