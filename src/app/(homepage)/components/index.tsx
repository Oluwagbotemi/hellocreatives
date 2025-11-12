'use client'

import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import PlatformSelect from './platform-select'

const Homepage = () => {
    const controls = useAnimation()

    const refs = {
        creatives: useRef<HTMLSpanElement | null>(null),
        curious: useRef<HTMLSpanElement | null>(null),
        evolving: useRef<HTMLSpanElement | null>(null),
    }

    useEffect(() => {
        const run = async () => {
            const speed = 1.8

            const getRect = (ref: React.RefObject<HTMLSpanElement | null>) => {
                const el = ref.current
                if (!el) return { left: 0, top: 0, width: 0, height: 0 }
                const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el
                return { left: offsetLeft, top: offsetTop, width: offsetWidth, height: offsetHeight }
            }

            const animateWord = async (
                ref: React.RefObject<HTMLSpanElement | null>,
                isCreative: boolean
            ) => {
                const rect = getRect(ref)

                // Appear behind the word (green)
                await controls.start({
                    ...rect,
                    backgroundColor: '#00C159',
                    opacity: 1,
                    width: rect.width,
                    height: rect.height,
                    transition: { duration: 0 },
                })

                // Fill (blue only for "creative")
                await controls.start({
                    backgroundColor: isCreative ? '#009CFE' : '#00C159',
                    width: rect.width,
                    transition: { duration: speed, },
                })

                // Shrink away (green)
                await controls.start({
                    backgroundColor: '#00C159',
                    width: 0,
                    opacity: 0.6,
                    originX: 0,
                    transition: { type: 'spring', stiffness: 1000, damping: 100 },
                })
            }

            // Sequential animation (no loop)
            await animateWord(refs.creatives, true)
            await animateWord(refs.curious, false)
            await animateWord(refs.evolving, false)

            // Final state — keep green badge behind “creative”
            const rect = getRect(refs.creatives)
            await controls.start({
                ...rect,
                backgroundColor: '#00C159',
                opacity: 1,
                width: rect.width,
                height: rect.height,
                transition: { duration: speed, ease: 'linear' }
            })
        }

        run()
    }, [controls])

    return (
        <div className="flex flex-col items-center overflow-hidden min-h-[100vh]">
            <span className="mt-[52px] bg-[#FAFAFA] rounded-[4px] flex items-center justify-between px-[18px] py-[12px]">
                <Image src="/images/logo.svg" alt="hellocreatives logo" height={21} width={197} />
            </span>

            <div className="relative mt-[92px] lg:mt-[147px] text-center max-w-[760px] w-full px-2">
                <h1 className="relative font-display font-medium text-[36px] md:text-[56px] leading-[110%] tracking-tight break-words">
                    <span className="inline">
                        for the{' '}
                        <span ref={refs.creatives} className="relative z-10 px-1">
                            creative
                        </span>
                        , the{' '}
                        <span ref={refs.curious} className="relative z-10 px-1">
                            curious
                        </span>
                    </span>
                    <br className="hidden md:block" />
                    <span className="inline">
                        &amp;{' '}
                        <span
                            ref={refs.evolving}
                            className="relative z-10 px-1 whitespace-nowrap"
                        >
                            consistently evolving
                        </span>
                    </span>

                    {/* Animated badge */}
                    <motion.span
                        animate={controls}
                        className="absolute rounded-[12px] z-0 origin-right"
                        style={{
                            width: 0,
                            height: 0,
                            top: 0,
                            left: 0,
                        }}
                    />
                </h1>

                <p className="mt-[12px] text-[20px] leading-[120%] max-w-[650px] mx-auto">
                    we’re here to help creatives grow through stories, resources and real conversations.
                </p>
            </div>
            <PlatformSelect />
        </div>
    )
}

export default Homepage
