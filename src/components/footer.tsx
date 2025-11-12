'use client'
import React from 'react'
import Wrapper from './wrapper'
import Image from 'next/image'

const Footer = () => {
  const [email, setEmail] = React.useState('')
  return (
    <div>
      <div
        className='relative w-full bg-cover bg-center'
        style={{ backgroundImage: "url('/images/footer-image.svg')" }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <Wrapper className='py-[72px] flex flex-col lg:flex-row gap-4 justify-between'>
          <div className='text-white'>
            <p className='font-display text-white text-[32px] font-medium'>
              Discover more from
            </p>
            <p className='text-[#00C159] text-[32px] font-medium font-display'>
              Hellocreative
            </p>
            <p className='text-white font-medium mt-4'>
              Sharing value through articles, interviews and podcasts.
            </p>
          </div>
          <div className='relative max-w-[722px] w-full h-[63px] lg:mt-auto'>
            <input
              type='text'
              placeholder='Enter your email address'
              className='w-full h-full rounded-full pl-6 pr-[140px] bg-white placeholder:text-[#6D7786] font-medium'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className='font-display absolute top-1/2 -translate-y-1/2 right-1 bg-black text-white font-medium rounded-full px-[41px] py-[12px]'>
              Subscribe
            </button>
          </div>
        </Wrapper>
      </div>
      <div className='bg-[#222222] py-[32px]'>
        <Wrapper className='flex flex-col items-center justify-center'>
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
