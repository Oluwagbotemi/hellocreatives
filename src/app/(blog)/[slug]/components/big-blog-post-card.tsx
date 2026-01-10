import Image from 'next/image'
import React from 'react'

import DOMPurify from "isomorphic-dompurify"


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
const BigBlogPostCard = (
    { author, authorRole, authorImage, title, body, summary }: BlogParam
) => {
    return (
        <div className='mt-[48px] bg-white relative border border-[#E1E7EC] rounded-[24px]  w-full flex flex-col justify-between overflow-hidden'>
            <div
                className='relative w-full bg-cover bg-center md:h-[151px] h-[100px] flex items-center justify-center'
                style={{ backgroundImage: "url('/images/blog-post-image.svg')" }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <p className='text-center text-white font-display font-semibold text-[24px]'>{summary}</p>
            </div>
            <div className='rounded-t-[24px] bg-white -translate-y-5 p-[28px] md:p-[48px] '>
                <div className='pb-[32px] border-b border-[#E1E7EC]'>
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
                    <h1 className='text-[24px] md:text-[36px] font-semibold mt-[32px]'>
                        {title}
                    </h1>
                </div>
                <div className='pt-[32px] font-medium lg:text-[20px] leading-[35px] tracking-[2%] '>
                    <div
                     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} 
                     className='blog-content'
                     />
                </div>
            </div>
        </div>
    )
}

export default BigBlogPostCard
