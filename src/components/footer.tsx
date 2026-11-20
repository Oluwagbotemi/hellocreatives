'use client'
import React, { useEffect, useState } from 'react'
import Wrapper from './wrapper'
import Image from 'next/image'
import emailjs from '@emailjs/browser'
import { EMAIL_ERROR, isValidEmail } from '@/lib/forms'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError(EMAIL_ERROR)
      return
    }

    setError(null)
    setLoading(true)
    setToast(null)

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_SUBSCRIBE_TEMPLATE_ID!,
        { email: email.trim() },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setToast({ type: 'success', message: 'Subscribed successfully 🎉' })
      setEmail('')
    } catch {
      setToast({ type: 'error', message: 'Subscription failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {toast && (
        <div
          role='status'
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg text-white shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
        >
          {toast.message}
        </div>
      )}

      <div
        className='relative w-full bg-cover bg-center'
        style={{ backgroundImage: "url('/images/footer-image.svg')" }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <Wrapper className='py-[72px] flex flex-col lg:flex-row gap-4 justify-between'>
          <div className='text-white'>
            <p className='font-display text-[32px] font-medium'>Discover more from</p>
            <p className='text-[#00C159] text-[32px] font-medium font-display'>
              Hellocreatives
            </p>
            <p className='font-medium mt-4'>
              Sharing value through articles, interviews and podcasts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} noValidate className='max-w-[722px] w-full lg:mt-auto'>
            <div className='relative w-full h-[63px]'>
              <input
                type='email'
                name='email'
                autoComplete='email'
                aria-label='Email address'
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'subscribe-error' : undefined}
                placeholder='Enter your email address'
                className='w-full h-full rounded-full pl-6 pr-[140px] md:pr-[175px] bg-white placeholder:text-[#6D7786]'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
              />
              <button
                type='submit'
                disabled={loading}
                className='absolute top-1/2 -translate-y-1/2 right-[6px] bg-black text-white rounded-full w-[120px] md:w-[155px] py-[12px] font-display font-semibold cursor-pointer disabled:cursor-not-allowed'
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {error && (
              <p id='subscribe-error' role='alert' className='mt-2 pl-6 text-sm font-medium text-[#FFB4AB]'>
                {error}
              </p>
            )}
          </form>
        </Wrapper>
      </div>

      <div className='bg-[#222222] py-[32px]'>
        <Wrapper className='flex flex-col items-center'>
          <Image
            src='/images/white-logo.svg'
            alt='HelloCreative Logo'
            width={197}
            height={21}
          />
          <div className='mt-[32px] border-t border-[#4A4A4A] pt-[32px] text-center w-full'>
            <p className='font-medium text-[#E1E7EC]'>
              © {new Date().getFullYear()} HelloCreatives. All rights reserved.
            </p>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}

export default Footer

