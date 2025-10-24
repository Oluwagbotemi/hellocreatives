'use client'

import { toggleDomain } from '@/lib/helpers/getSubdomain'
import { motion } from 'framer-motion'
import { s } from 'framer-motion/client'
import Image from 'next/image'
import React, { useState } from 'react'

const PLATFORMITEMS = [
    {
        platformName: 'Newsletter',
        subdomain: 'blog',
        iconSrc: '/icons/newsletter-icon.svg',
        activeIconSrc: '/icons/active-newsletter-icon.svg',
        activeBorderColor: '#FB4615',
        activeBgColor: '#FFFBFA',
        iconHeight: 69.5,
        iconWidth: 81.5,
    },
    {
        platformName: 'Podcast',
        subdomain: 'podcast',
        iconSrc: '/icons/podcast-icon.svg',
        activeIconSrc: '/icons/active-podcast-icon.svg',
        activeBorderColor: '#1562FB',
        activeBgColor: '#FAFCFF',
        iconHeight: 69.5,
        iconWidth: 39,
        comingSoon: true,
    },
    {
        platformName: 'Merches',
        subdomain: 'merches',
        iconSrc: '/icons/merches-icon.svg',
        activeIconSrc: '/icons/active-merches-icon.svg',
        activeBorderColor: '#9B15FB',
        activeBgColor: '#FDFAFF',
        iconHeight: 69.5,
        iconWidth: 57.1,
        comingSoon: true,
    },
    {
        platformName: 'Sponsorships',
        subdomain: 'sponsorships',
        iconSrc: '/icons/sponsorships-icon.svg',
        activeIconSrc: '/icons/active-sponshorships-icon.svg',
        activeBorderColor: '#FB159F',
        activeBgColor: '#FFFAFD',
        iconHeight: 69.5,
        iconWidth: 80.1,
        comingSoon: true,
    },
]

const PlatformSelect = () => {
    return (
        <div className='mt-[20px] grid grid-cols-2 lg:grid-cols-4 gap-x-[7px] gap-y-[24px] w-full max-w-[760px] justify-center py-5 px-5'>
            {PLATFORMITEMS.map((item, index) => (
                <PlatformSelectTab key={index} position={index + 1} {...item} />
            ))}
        </div>
    )
}

interface PlatformSelectTabProps {
    position: number
    platformName?: string
    subdomain?: string
    iconSrc: string
    activeIconSrc?: string
    activeBorderColor?: string
    activeBgColor?: string
    iconHeight: number
    iconWidth: number
    comingSoon?: boolean
}

const PlatformSelectTab = ({
    position,
    platformName,
    subdomain,
    iconSrc,
    activeIconSrc,
    activeBorderColor,
    activeBgColor,
    comingSoon = false,
    iconHeight,
    iconWidth,
}: PlatformSelectTabProps) => {
    const [isActive, setIsActive] = useState(false)

    const rotation = isActive ? 0 : position % 2 === 0 ? 2 : -2
    const defaultBorder = '#E8E8E8'
    const defaultBg = '#FBFBFB'
    const defaultText = '#8F8F8F'

    const switchDomain = () => {
        if (!comingSoon) {
            toggleDomain(subdomain!.toLowerCase(), true)
        }
    }

    return (
        <motion.div
            className='relative border-[1px] rounded-[12px] p-[12px] w-[167px] h-[197.9px] flex flex-col justify-center items-center cursor-pointer select-none'
            initial={{
                rotate: rotation,
                borderColor: defaultBorder,
                backgroundColor: defaultBg,
            }}
            animate={{
                rotate: rotation,
                borderColor: isActive ? activeBorderColor : defaultBorder,
                backgroundColor: isActive ? activeBgColor : defaultBg,
            }}
            transition={{
                type: 'spring',
                stiffness: 250,
                damping: 15,
            }}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            onClick={switchDomain}
        >
            <motion.div
                key={isActive ? 'active' : 'inactive'}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
                <Image
                    src={isActive && activeIconSrc ? activeIconSrc : iconSrc}
                    alt='platform icon'
                    height={iconHeight}
                    width={iconWidth}
                />
            </motion.div>

            <motion.span
                className='mt-[6px] font-semibold font-display text-[15px]'
                initial={{ color: defaultText }}
                animate={{
                    color: isActive ? activeBorderColor : defaultText,
                }}
                transition={{ duration: 0.25 }}
            >
                {platformName}
            </motion.span>

            {comingSoon && (
                <motion.span
                    className='flex items-center justify-center absolute -top-[10px] left-1/2 -translate-x-1/2 text-[12px] font-medium px-2 py-1 w-[123.29px] h-[23px] rounded-full border-[1px]'
                    initial={{
                        borderColor: defaultBorder,
                        backgroundColor: defaultBg,
                        color: defaultText,
                    }}
                    animate={{
                        borderColor: isActive ? activeBorderColor : defaultBorder,
                        backgroundColor: isActive ? activeBgColor : defaultBg,
                        color: isActive ? activeBorderColor : defaultText,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 18,
                    }}
                >
                    Coming Soon
                </motion.span>
            )}
        </motion.div>
    )
}

export default PlatformSelect
