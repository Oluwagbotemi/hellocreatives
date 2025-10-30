import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
    return (
        <div className='mt-[48px] flex justify-between'>
            <div className='w-full max-w-[477px]'>
                <Image
                    src={'/icons/active-newsletter-icon.svg'}
                    alt='newsletter icon'
                    height={42}
                    width={49}
                />
                <h1 className='mt-[24px] text-[32px] font-medium font-display'>
                    Blog/Newsletter
                </h1>
                <p className='mt-[12px] font-medium text-[#6D7786]'>
                    A space for honest conversations, practical insights,
                    and shared experiences from creatives like you — all
                    centered around growth, clarity, and purpose.
                </p>
                <button className='mt-[24px] font-display rounded-full w-[155px] h-[43px] bg-black text-white font-semibold'>
                    Write for us
                </button>
            </div>
            <Image
                className='hidden lg:block'
                src={'/images/infinity.svg'}
                alt='infinity illustration'
                width={502}
                height={216}
            />
        </div>
    )
}

export default HeroSection
