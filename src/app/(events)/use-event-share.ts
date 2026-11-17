'use client'

import { useCallback, useEffect, useRef } from 'react'
import { getEventShareUrl } from '@/lib/events/urls'
import type { PublicEvent } from '@/lib/events/types'

// Each event's share image is fetched once and reused.
const imageCache = new Map<string, Promise<Blob>>()

const fetchShareImage = (slug: string) => {
    let promise = imageCache.get(slug)
    if (!promise) {
        promise = fetch(`/api/events/${encodeURIComponent(slug)}/share-image`).then((res) => {
            if (!res.ok) throw new Error('Could not create the share image')
            return res.blob()
        })
        promise.catch(() => imageCache.delete(slug))
        imageCache.set(slug, promise)
    }
    return promise
}

const isTouchDevice = () =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed'

/**
 * Share an event as an image.
 * Phones/tablets: opens the system share menu (WhatsApp, Instagram, …).
 * Computers, or browsers without sharing: downloads the image.
 */
export const useEventShare = (event: Pick<PublicEvent, 'slug' | 'title'>) => {
    const elementRef = useRef<HTMLElement | null>(null)

    const prefetch = useCallback(() => {
        fetchShareImage(event.slug).catch(() => { })
    }, [event.slug])

    // Phones only open the share menu straight after a tap, so on touch devices
    // the image is prepared as soon as the card scrolls into view.
    useEffect(() => {
        const element = elementRef.current
        if (!element || !isTouchDevice() || !('IntersectionObserver' in window)) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    prefetch()
                    observer.disconnect()
                }
            },
            { rootMargin: '200px' }
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [prefetch])

    const share = useCallback(async (): Promise<ShareOutcome> => {
        const filename = `${event.slug}.png`
        let blob: Blob
        try {
            blob = await fetchShareImage(event.slug)
        } catch {
            return 'failed'
        }

        const file = new File([blob], filename, { type: 'image/png' })
        const url = getEventShareUrl(window.location.origin, event.slug)

        if (isTouchDevice() && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: event.title,
                    text: `${event.title} — register here: ${url}`,
                })
                return 'shared'
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
                // e.g. the browser blocked sharing: fall back to downloading.
            }
        }

        downloadBlob(blob, filename)
        return 'downloaded'
    }, [event.slug, event.title])

    return { share, prefetch, elementRef }
}
