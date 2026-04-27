"use client"

import { useRef, useState, type ReactNode, type MouseEvent, type ButtonHTMLAttributes } from "react"

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    strength?: number
}

export default function MagneticButton({ children, strength = 0.3, className = "", ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null)
    const [transform, setTransform] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength
        setTransform({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
        setTransform({ x: 0, y: 0 })
    }

    return (
        <button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
                transition: transform.x === 0 && transform.y === 0
                    ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                    : "transform 0.1s ease-out",
            }}
            {...props}
        >
            {children}
        </button>
    )
}
