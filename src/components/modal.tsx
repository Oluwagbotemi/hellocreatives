'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

type ModalProps = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
}

export default function Modal({ open, onClose, children, className }: ModalProps) {
    useEffect(() => {
        if (!open) return

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={
                    cn("w-full max-w-[720px] mx-4 rounded-xl bg-white p-6 text-[#6D7786]", className)
                }
            >
                {children}
            </div>
        </div>
    )
}
