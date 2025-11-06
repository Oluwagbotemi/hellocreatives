'use client'
import Wrapper from '@/components/wrapper'
import { toggleDomain } from '@/lib/helpers/getSubdomain'
import Image from 'next/image'
import React from 'react'
import HeroSection from './components/hero-section'
import Footer from '@/components/footer'

const BlogList = () => {
    return (
        <div className='w-full'>
            <Wrapper className="pt-[84px] lg:pt-[42px] pb-[72px]">
                <div className='rounded-full w-full max-w-[201px] h-[33px] flex items-center justify-between px-[12px] border-gray-200  border-[1px]'>
                    <Image
                        src={'/icons/globe.svg'}
                        alt='globe icon'
                        height={16}
                        width={16}
                    />
                    <span
                        className='font-semibold font-display cursor-pointer'
                        onClick={() => toggleDomain('blog')}
                    >
                        Visit HelloCreative.io
                    </span>
                </div>
                <HeroSection />
            </Wrapper>
            {/* <Footer /> */}
        </div>
    )
}

export default BlogList
