'use client';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const Breadcrumb = () => {
    const router = useRouter()
    return (
        <div className='flex items-center gap-2'>
            <button
                className='size-[20px] bg-white border border-[#E1E7EC] rounded-[8px] flex items-center justify-center cursor-pointer'
                onClick={() => router.push('/')}
            >
                <Image
                    src={'/icons/arrow-sm-left.svg'}
                    alt='arrow left'
                    height={12}
                    width={12}
                />
            </button>
            <span className='text-[#8895A7] font-semibold text-[14px]'>
                Blog/Newsletter
            </span>
            <Image
                src={'/icons/arrow-right-round.svg'}
                alt='arrow right'
                height={12}
                width={12}
            />
            <span className='text-[#4A4A4A] font-semibold text-[14px]'>
                Single Post
            </span>
        </div>
    )
}

export default Breadcrumb
