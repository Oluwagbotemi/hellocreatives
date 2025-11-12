'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface BlogParam {
    id: string
    slug: string
    author: string
    authorRole: string
    authorImage: string
    title: string
    body: string
    date: string
    readingTime: string
    summary: string
    blogBrief: string
}
const BlogCard = ({ author, authorRole, readingTime, date, authorImage, slug, title, blogBrief, summary }: BlogParam) => {
    const router = useRouter();
    return (
        <div className='relative bg-[#FBFBFB] border-[2px] border-[#FBFBFB] rounded-[22px] min-h-[319px] lg:h-[319px] w-full max-w-[584px] flex flex-col justify-between overflow-hidden [box-shadow:0px_4px_10px_0px_rgba(132,132,132,0.07)]'>
            <div className='p-4 flex-1 flex flex-col '>
                <div className='flex justify-between items-center pb-[20px] border-b border-[#E1E7EC]'>
                    <div className='flex items-center gap-[10px]'>
                        <div className='relative size-[32px] overflow-hidden rounded-[12px]'>
                            <Image
                                src={authorImage}
                                alt='author avatar'
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div>
                            <p className='text-[14px] font-semibold'>{author}</p>
                            <p className='mt-[4px] text-[14px] text-[#6D7786]'>{authorRole}</p>
                        </div>
                    </div>
                    <button
                        className='font-display bg-[#FAFAFA] hover:bg-white border border-[#E8E8E8] rounded-full px-[16px] md:px-[20px] py-[8px] md:py-[12px] font-semibold cursor-pointer flex items-center gap-1'
                        onClick={() => router.push(`/${slug}`)}
                    >
                        Read
                        <Image
                            src={'/icons/arrow-up-right.svg'}
                            alt='arroe right up'
                            height={18}
                            width={18}
                        />
                    </button>
                </div>
                <div className='py-[20px] border-b border-[#E1E7EC]'>
                    <p className='md:text-[24px] text-[18px] font-semibold leading-[100%]'>{title}</p>
                </div>
                <div className='mt-auto flex items-center lg:gap-5 gap-4 text-[#6D7786] text-[12px] md:text-base'>
                    <div className='flex items-center gap-1'>
                        <Image
                            src={'/icons/gray-calendar.svg'}
                            alt='calendar icon'
                            height={18}
                            width={18}
                        />
                        <span>{date}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image
                            src={'/icons/gray-calendar.svg'}
                            alt='calendar icon'
                            height={18}
                            width={18}
                        />
                        <span>{readingTime}</span>
                    </div>
                </div>
            </div>
            <div
                className='relative w-full bg-cover bg-center h-[77px] flex items-center justify-center'
                style={{ backgroundImage: "url('/images/card-image.svg')" }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <p className='text-center text-white font-display font-semibold text-[24px]'>{summary}</p>
            </div>
        </div>
    )
}

export default BlogCard
