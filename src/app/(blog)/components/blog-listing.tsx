import Image from 'next/image'
import React from 'react'
import BlogCard from './blog-card'
import { bloglist } from '@/constant/blog'

const BlogListing = () => {
    return (
        <div className='bg-[#F7F8FA] border border-[#E1E7EC] rounded-[24px] md:px-[20px] px-[10px] py-[20px] mt-[48px] lg:mt-[72px]'>
            <div className='flex gap-[12px] items-center'>
                <span className='size-[48px] bg-white border border-[#E1E7EC] rounded-[8px] flex items-center justify-center'>
                    <Image
                        src={'/icons/calendar.svg'}
                        alt='calendar icon'
                        height={20}
                        width={20}
                    />
                </span>
                <span className='font-bold text-[20px]'>
                    Articles
                </span>
            </div>
            <div className='mt-[60px] grid grid-cols-1 lg:grid-cols-2 gap-[20px] mx-auto justify-items-center'>
                {[...bloglist].reverse().map((blog) => (
                    <BlogCard key={blog.id} {...blog} />
                ))}
            </div>
        </div>
    )
}

export default BlogListing
