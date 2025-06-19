'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface CRTWindowProps {
    title: string
    children: ReactNode
}

export default function CRTWindow({ title, children }: CRTWindowProps) {
    const router = useRouter()
    return (
        <>
            
            <div className="crt-window">
                <div className="crt-scan"></div>
                <div className="crt-titlebar" onClick={() => router.push('/')}>
                    <span className="crt-title">{title}</span>
                </div>
                <div className="crt-content text-glow">
                    {children}
                </div>
            </div>
        </>
    )
}
