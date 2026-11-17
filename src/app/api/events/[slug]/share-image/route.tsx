import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import QRCode from 'qrcode'
import { getPublicEvent } from '@/lib/events/data'
import { formatEventDate } from '@/lib/events/format'
import { DIRECTIONS_COLOR, PLATFORMS } from '@/lib/events/platforms'
import { getEventShareUrl, prettyUrl } from '@/lib/events/urls'

export const runtime = 'nodejs'

// The image follows the "For Sharing" frame in Figma (590px wide),
// drawn at 2x so it stays sharp on phones, with a QR code + link strip added.
const SCALE = 2
const px = (value: number) => value * SCALE
const WIDTH = 590

const root = process.cwd()
const readAsset = (...path: string[]) => readFile(join(root, ...path))

const fontsPromise = Promise.all([
    readAsset('src/assets/fonts/inter-latin-500-normal.woff'),
    readAsset('src/assets/fonts/inter-latin-600-normal.woff'),
    readAsset('src/assets/fonts/Goodly-Semibold.ttf'),
])

const svgDataUri = async (file: string) =>
    `data:image/svg+xml;base64,${(await readAsset('public', file)).toString('base64')}`

const loadImage = async (src: string | null, origin: string) => {
    if (!src) return null
    try {
        if (src.startsWith('/')) {
            return `data:image/png;base64,${(await readAsset('public', src)).toString('base64')}`
        }
        const response = await fetch(new URL(src, origin))
        if (!response.ok) return null
        const type = response.headers.get('content-type') || 'image/png'
        return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString('base64')}`
    } catch {
        return null
    }
}

/** Rough height so the image fits long titles/descriptions without empty space. */
const estimateHeight = (title: string, description: string, hasBringAlong: boolean) => {
    const titleLines = Math.max(1, Math.ceil(title.length / 34))
    const descriptionLines = Math.max(1, Math.ceil(description.length / 60))
    let height = 541 + 128 // Figma frame + QR strip
    height += (titleLines - 1) * 29 + (descriptionLines - 2) * 19
    if (!hasBringAlong) height -= 64
    return height
}

const label = { fontFamily: 'Inter', fontWeight: 500, fontSize: px(16), color: '#9C9C9C' }
const value = { fontFamily: 'Inter', fontWeight: 500, fontSize: px(16), color: '#6D7786' }
const divider = { display: 'flex', width: '100%', height: px(1), backgroundColor: '#E1E7EC' }

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await getPublicEvent(slug)
    if (!event) return new Response('Event not found', { status: 404 })

    const origin = new URL(request.url).origin
    const shareUrl = getEventShareUrl(origin, event.slug)
    const platform = event.platform ? PLATFORMS[event.platform] : null

    const [[interMedium, interSemibold, goodlySemibold], graphic, userIcon, calendarIcon, locationIcon, platformIcon, directionsIcon, qrCode] =
        await Promise.all([
            fontsPromise,
            loadImage(event.graphicUrl, origin),
            svgDataUri('icons/events/user.svg'),
            svgDataUri('icons/events/calendar.svg'),
            svgDataUri('icons/events/location.svg'),
            platform ? svgDataUri(platform.icon.replace(/^\//, '')) : Promise.resolve(null),
            svgDataUri('icons/events/directions.svg'),
            QRCode.toDataURL(shareUrl, { margin: 1, width: px(88), color: { dark: '#222222', light: '#FFFFFF' } }),
        ])

    const height = estimateHeight(event.title, event.description, Boolean(event.bringAlong))

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#FBFBFB',
                    borderRadius: px(24),
                    padding: px(4),
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        gap: px(20),
                        padding: px(16),
                        backgroundColor: '#FFFFFF',
                        borderRadius: px(22),
                    }}
                >
                    {/* Top: tag, title, description, host, graphic */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: px(48),
                            padding: px(20),
                            backgroundColor: '#FAFAFA',
                            borderRadius: px(20),
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {graphic && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={graphic}
                                width={px(172)}
                                height={px(78)}
                                style={{
                                    position: 'absolute',
                                    right: px(-17),
                                    top: px(-2),
                                    objectFit: 'cover',
                                    filter: `blur(${px(2)}px)`,
                                }}
                            />
                        )}
                        <div style={{ display: 'flex' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: px(33),
                                    padding: `0 ${px(12)}px`,
                                    backgroundColor: '#FFFFFF',
                                    border: `${px(1)}px solid #E1E7EC`,
                                    borderRadius: px(108),
                                    fontFamily: 'Goodly',
                                    fontSize: px(16),
                                    color: '#000000',
                                }}
                            >
                                {event.eventType === 'workshop' ? 'Workshop' : 'Event'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: px(24) }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: px(12) }}>
                                <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: px(24), color: '#000000' }}>
                                    {event.title}
                                </div>
                                <div style={{ ...value, lineHeight: 1.2 }}>{event.description}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={userIcon} width={px(18)} height={px(18)} />
                                <div style={label}>{event.host}</div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: px(16), padding: px(12) }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: px(12) }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={calendarIcon} width={px(18)} height={px(18)} />
                                <div style={label}>Date &amp; Time</div>
                            </div>
                            <div style={value}>{formatEventDate(event.startsAt)}</div>
                        </div>
                        <div style={divider} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: px(12) }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={locationIcon} width={px(18)} height={px(18)} />
                                <div style={label}>Location</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: px(10) }}>
                                <div style={value}>
                                    {event.locationType === 'virtual' ? 'Virtual' : event.address}
                                </div>
                                {platform && platformIcon && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: px(8) }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={platformIcon} width={px(platform.iconWidth)} height={px(platform.iconHeight)} />
                                        <div style={{ fontFamily: 'Goodly', fontSize: px(16), color: platform.color }}>
                                            {platform.label}
                                        </div>
                                    </div>
                                )}
                                {event.locationType === 'inPerson' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
                                        <div style={{ fontFamily: 'Goodly', fontSize: px(16), color: DIRECTIONS_COLOR }}>
                                            Get Directions
                                        </div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={directionsIcon} width={px(18)} height={px(18)} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {event.bringAlong && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: px(16) }}>
                                <div style={divider} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: px(12) }}>
                                    <div style={label}>Come along with</div>
                                    <div style={value}>{event.bringAlong}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* QR code + link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: px(16), padding: `${px(16)}px ${px(20)}px` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCode} width={px(88)} height={px(88)} style={{ borderRadius: px(8) }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: px(6) }}>
                        <div style={{ fontFamily: 'Goodly', fontSize: px(18), color: '#222222' }}>
                            Scan or visit to register
                        </div>
                        <div style={{ ...value, fontSize: px(15) }}>{prettyUrl(shareUrl)}</div>
                    </div>
                </div>
            </div>
        ),
        {
            width: px(WIDTH),
            height: px(height),
            fonts: [
                { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
                { name: 'Inter', data: interSemibold, weight: 600, style: 'normal' },
                { name: 'Goodly', data: goodlySemibold, weight: 600, style: 'normal' },
            ],
            headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' },
        }
    )
}
