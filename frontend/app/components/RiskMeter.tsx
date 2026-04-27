"use client"

import { useEffect, useState } from "react"

interface RiskMeterProps {
    riskLevel: "High" | "Medium" | "Low"
    suggestedAction: string
}

const RISK_CONFIG = {
    High: { color: "#EF4444", glowColor: "rgba(239,68,68,0.4)", label: "HIGH RISK", angle: 160 },
    Medium: { color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)", label: "MEDIUM RISK", angle: 90 },
    Low: { color: "#10B981", glowColor: "rgba(16,185,129,0.4)", label: "LOW RISK", angle: 20 },
}

export default function RiskMeter({ riskLevel, suggestedAction }: RiskMeterProps) {
    const [animatedAngle, setAnimatedAngle] = useState(0)
    const config = RISK_CONFIG[riskLevel]

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedAngle(config.angle), 100)
        return () => clearTimeout(timer)
    }, [config.angle])

    // SVG arc calculation
    const radius = 40
    const cx = 50
    const cy = 55
    const startAngle = -180
    const endAngle = startAngle + (animatedAngle / 180) * 180

    const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
        const rad = (angle * Math.PI) / 180
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    }

    const start = polarToCartesian(cx, cy, radius, -180)
    const end = polarToCartesian(cx, cy, radius, -180 + animatedAngle)
    const largeArc = animatedAngle > 180 ? 1 : 0

    const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
    const bgArcEnd = polarToCartesian(cx, cy, radius, 0)
    const bgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${bgArcEnd.x} ${bgArcEnd.y}`

    return (
        <div className="risk-meter-container animate-fade-up">
            <div className="risk-meter-gauge">
                <svg viewBox="0 0 100 62" className="risk-meter-svg">
                    <defs>
                        <filter id={`risk-glow-${riskLevel}`}>
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background arc */}
                    <path
                        d={bgPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    {/* Active arc */}
                    <path
                        d={arcPath}
                        fill="none"
                        stroke={config.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        filter={`url(#risk-glow-${riskLevel})`}
                        style={{ transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}
                    />

                    {/* Needle dot */}
                    <circle
                        cx={end.x}
                        cy={end.y}
                        r="4"
                        fill={config.color}
                        style={{
                            transition: "all 1s cubic-bezier(0.4,0,0.2,1)",
                            filter: `drop-shadow(0 0 6px ${config.glowColor})`,
                        }}
                    />
                </svg>

                {/* Risk label */}
                <div className="risk-meter-label" style={{ color: config.color }}>
                    <span className="risk-meter-dot" style={{ background: config.color, boxShadow: `0 0 8px ${config.glowColor}` }} />
                    {config.label}
                </div>
            </div>

            {/* Suggested action */}
            <div
                className="risk-meter-action"
                style={{ borderColor: `${config.color}20`, background: `${config.color}08` }}
            >
                <p className="risk-meter-action-text">{suggestedAction}</p>
            </div>
        </div>
    )
}
