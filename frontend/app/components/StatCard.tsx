"use client"

import { useEffect, useState, type ReactNode } from "react"

interface StatCardProps {
    icon: ReactNode
    label: string
    value: number
    suffix?: string
    trend?: { direction: "up" | "down"; percent: number }
    delay?: number
}

export default function StatCard({ icon, label, value, suffix = "", trend, delay = 0 }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    useEffect(() => {
        if (!mounted) return

        const duration = 1200
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.round(eased * value))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [mounted, value])

    return (
        <div
            className={`card p-4 transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[#00D4FF]">
                    {icon}
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 text-[11px] font-semibold ${trend.direction === "up" ? "text-emerald-400" : "text-red-400"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ transform: trend.direction === "down" ? "rotate(180deg)" : "none" }}>
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                        {trend.percent}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
                {displayValue.toLocaleString()}{suffix}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">{label}</p>
        </div>
    )
}
