'use client'

import Modal from '@/components/modal'
import Image from 'next/image'
import React, { useState } from 'react'
import emailjs from '@emailjs/browser'

interface JoinUsModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const JoinUsModal = ({ open, setOpen }: JoinUsModalProps) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)


    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_PITCH_TEMPLATE_ID!,
                { name, email, message },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            )

            setToast({ type: 'success', message: 'Pitch sent successfully 🎉' })
            setName('')
            setEmail('')
            setMessage('')

            setTimeout(() => {
                setToast(null)
                setOpen(false)
            }, 2000)
        } catch (err) {
            setError('Something went wrong. Please try again.')
            setToast({ type: 'error', message: 'Something went wrong. Try again.' })

            setTimeout(() => setToast(null), 3000)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className="bg-[#F5F8FA] p-2">
            <div className="flex gap-1 items-center p-[12px]">
                <Image src="/icons/write-icon.svg" alt="write icon" height={36} width={36} />
                <div className="flex flex-col text-[14px]">
                    <p className="font-semibold font-display text-black">Write for us</p>
                    <p>Share a pitch into what you want to write and we’d get back to you.</p>
                </div>
            </div>

            <div className="mt-[12px] flex flex-col gap-[23px] bg-white rounded-[12px] p-[12px]">
                <div>
                    <span className="text-base font-medium font-display">Full name</span>
                    <input
                        type="text"
                        className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <span className="text-base font-medium font-display">
                        Email Address <span className="text-red-500">*</span>
                    </span>
                    <input
                        type="email"
                        className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black"
                        placeholder="user@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <span className="text-base font-medium font-display">
                        Article Pitch (max of 1,000 words)
                    </span>
                    <textarea
                        className="md:h-[170px] h-[80px] w-full mt-2 px-4 py-3 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-black"
                        placeholder="Enter your pitch"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">Message sent successfully 🎉</p>}
            </div>

            <div className="mt-[12px] flex flex-col md:flex-row gap-[12px] justify-between font-display">
                <button
                    className="font-semibold rounded-[12px] bg-white border border-[#E1E7EC] w-full h-[44px]"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    className="font-semibold flex justify-center items-center gap-1 bg-black rounded-[12px] w-full h-[44px] text-white disabled:opacity-50"
                    disabled={!email || !name || !message || loading}
                    onClick={handleSubmit}
                >
                    {loading ? 'Sending...' : 'Submit'}
                    {!loading && (
                        <Image src="/icons/tick-double.svg" alt="tick icon" height={20} width={20} />
                    )}
                </button>
            </div>
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-white shadow-lg transition
                        ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                >
                    {toast.message}
                </div>
            )}
        </Modal>
    )
}

export default JoinUsModal
