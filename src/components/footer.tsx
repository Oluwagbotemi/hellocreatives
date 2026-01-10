'use client'
import React, { useEffect, useState } from 'react'
import Wrapper from './wrapper'
import Image from 'next/image'
import emailjs from '@emailjs/browser'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [showFooter, setShowFooter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubscribe = async () => {
    if (!email) return

    setLoading(true)
    setToast(null)

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_SUBSCRIBE_TEMPLATE_ID!,
        { email },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setToast({ type: 'success', message: 'Subscribed successfully 🎉' })
      setEmail('')
    } catch (error) {
      setToast({ type: 'error', message: 'Subscription failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const host = window.location.hostname
    setShowFooter(host.startsWith('blog.'))
  }, [])

  if (!showFooter) return null
  return (
    <div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
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
              Hellocreative
            </p>
            <p className='font-medium mt-4'>
              Sharing value through articles, interviews and podcasts.
            </p>
          </div>

          <div className='relative max-w-[722px] w-full h-[63px] lg:mt-auto'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='w-full h-full rounded-full pl-6 pr-[140px] bg-white placeholder:text-[#6D7786]'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubscribe}
              disabled={!email || loading}
              className='absolute top-1/2 -translate-y-1/2 right-1 bg-black text-white rounded-full px-[41px] py-[12px] disabled:opacity-50'
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
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
              © {new Date().getFullYear()} HelloCreative. All rights reserved.
            </p>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}

export default Footer

