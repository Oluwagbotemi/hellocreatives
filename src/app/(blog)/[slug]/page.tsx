import type { Metadata } from 'next';
import Wrapper from '@/components/wrapper'
import Footer from '@/components/footer'

import Breadcrumb from './components/breadcrumb'
import BigBlogPostCard from './components/big-blog-post-card'
import { bloglist } from '@/constant/blog';
import { notFound } from 'next/navigation';
import { getPostPreviewImage, toIsoDate } from '@/lib/blog';

type SingleBlogPageProps = {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: SingleBlogPageProps
): Promise<Metadata> {
    const blogSlug = (await params).slug
    const blogObject = bloglist.find(blogItem => blogItem.slug === blogSlug)

    if (!blogObject) {
        return {
            title: 'Blog post not found | Hello Creatives',
        }
    }

    const title = `${blogObject.title} | Hello Creatives`
    const description = blogObject.blogBrief || blogObject.summary
    const postPath = `/${blogObject.slug}`
    const previewImage = getPostPreviewImage(blogObject)

    return {
        title,
        description,
        alternates: {
            canonical: postPath,
        },
        openGraph: {
            title,
            description,
            url: postPath,
            type: 'article',
            publishedTime: toIsoDate(blogObject.date),
            authors: [blogObject.author],
            images: [
                {
                    url: previewImage,
                    width: 1200,
                    height: 630,
                    alt: blogObject.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [previewImage],
        },
    }
}

export async function generateStaticParams() {
    return bloglist.map((blog) => ({
        slug: blog.slug,
    }))
}
const SingleBlogPage = async (
    {
        params,
    }: SingleBlogPageProps
) => {
    const blogSlug = (await params).slug
    const blogObject = bloglist.find(blogItem => blogItem.slug === blogSlug)
    if (!blogObject) notFound()

    return (
        <>
            <div className='bg-[#F7F8FA] min-h-[calc(100vh-558px)] lg:min-h-[calc(100vh-458px)]'>
                <Wrapper className='py-[84px] lg:py-[42px]'>
                    <Breadcrumb />
                    {blogObject ? <BigBlogPostCard {...blogObject} /> : <div className=' text-center font-bold text-[32px]'>Blog post not found</div>}
                </Wrapper>
            </div>
            <Footer />
        </>
    )
}

export default SingleBlogPage
