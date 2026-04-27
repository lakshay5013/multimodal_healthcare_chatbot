"use client"

interface SkeletonProps {
    variant?: "line" | "circle" | "card" | "chat-bubble"
    width?: string
    height?: string
    className?: string
}

export default function SkeletonLoader({ variant = "line", width, height, className = "" }: SkeletonProps) {
    const baseClass = "skeleton"

    switch (variant) {
        case "circle":
            return (
                <div
                    className={`${baseClass} rounded-full ${className}`}
                    style={{ width: width || "40px", height: height || "40px" }}
                />
            )
        case "card":
            return (
                <div className={`${baseClass} p-4 ${className}`} style={{ width: width || "100%", height: height || "120px" }}>
                    <div className="skeleton h-4 w-3/4 mb-3 rounded" />
                    <div className="skeleton h-3 w-1/2 mb-2 rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                </div>
            )
        case "chat-bubble":
            return (
                <div className={`flex items-end gap-2.5 ${className}`}>
                    <div className={`${baseClass} rounded-full`} style={{ width: "32px", height: "32px" }} />
                    <div className="space-y-2" style={{ width: width || "260px" }}>
                        <div className={`${baseClass} h-4 rounded`} style={{ width: "80%" }} />
                        <div className={`${baseClass} h-4 rounded`} style={{ width: "60%" }} />
                        <div className={`${baseClass} h-3 rounded`} style={{ width: "40%" }} />
                    </div>
                </div>
            )
        default:
            return (
                <div
                    className={`${baseClass} ${className}`}
                    style={{ width: width || "100%", height: height || "14px" }}
                />
            )
    }
}
