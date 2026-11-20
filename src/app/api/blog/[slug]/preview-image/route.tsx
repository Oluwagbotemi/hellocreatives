import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bloglist } from '@/constant/blog'

export const runtime = 'nodejs'

// Link-preview image (1200 × 630) for blog posts whose own preview image is an SVG,
// which social apps can't display. Brand green, logo, post label and title.

const readAsset = (...path: string[]) => readFile(join(process.cwd(), ...path))
const svgDataUri = async (file: string) =>
    `data:image/svg+xml;base64,${(await readAsset('public', file)).toString('base64')}`

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = bloglist.find((p) => p.slug === slug)
    if (!post) return new Response('Post not found', { status: 404 })

    const [goodlyMedium, goodlySemibold, interMedium, logo, pattern] = await Promise.all([
        readAsset('src/assets/fonts/Goodly-Medium.ttf'),
        readAsset('src/assets/fonts/Goodly-Semibold.ttf'),
        readAsset('src/assets/fonts/inter-latin-500-normal.woff'),
        svgDataUri('images/white-logo.svg'),
        svgDataUri('images/footer-image.svg'),
    ])

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    padding: '72px 80px',
                    backgroundColor: '#093420',
                    position: 'relative',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={pattern}
                    width={1440}
                    height={255}
                    style={{ position: 'absolute', left: -120, bottom: 0 }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} width={296} height={32} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ fontFamily: 'Goodly', fontWeight: 600, fontSize: 34, color: '#00C159' }}>
                        {post.summary}
                    </div>
                    <div
                        style={{
                            fontFamily: 'Goodly',
                            fontWeight: 500,
                            fontSize: post.title.length > 50 ? 56 : 68,
                            lineHeight: 1.1,
                            color: '#FFFFFF',
                            maxWidth: 1000,
                        }}
                    >
                        {post.title}
                    </div>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 26, color: '#E1E7EC' }}>
                    {`${post.author} · ${post.date} · ${post.readingTime}`}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: 'Goodly', data: goodlyMedium, weight: 500, style: 'normal' },
                { name: 'Goodly', data: goodlySemibold, weight: 600, style: 'normal' },
                { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
            ],
            headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
        }
    )
}
