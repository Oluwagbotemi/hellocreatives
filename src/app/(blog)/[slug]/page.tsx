import Wrapper from '@/components/wrapper'

import Breadcrumb from './components/breadcrumb'
import BigBlogPostCard from './components/big-blog-post-card'
import { bloglist } from '@/constant/blog';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return bloglist.map((blog) => ({
        slug: blog.slug,
    }))
}
const SingleBlogPage = async (
    {
        params,
    }: {
        params: Promise<{ slug: string }>;
    }
) => {
    const blogSlug = (await params).slug
    const blogObject = bloglist.find(blogItem => blogItem.slug === blogSlug)
    if (!blogObject) notFound()

    return (
        <div className='bg-[#F7F8FA] min-h-[calc(100vh-558px)] lg:min-h-[calc(100vh-458px)]'>
            <Wrapper className='py-[84px] lg:py-[42px]'>
                <Breadcrumb />
                {blogObject ? <BigBlogPostCard {...blogObject} /> : <div className=' text-center font-bold text-[32px]'>Blog post not found</div>}
            </Wrapper>
        </div>
    )
}

export default SingleBlogPage
