"use client"

import PatientCard from "./PatientCard"

interface LiveDataFeedProps {
    visible: boolean
    onClose: () => void
}

const recentAlerts = [
    { id: 1, type: "critical" as const, message: "Patient J. Doe — Heart rate spike to 145 bpm", time: "2 min ago" },
    { id: 2, type: "warning" as const, message: "Lab results pending for M. Smith", time: "8 min ago" },
    { id: 3, type: "info" as const, message: "System update completed successfully", time: "15 min ago" },
    { id: 4, type: "warning" as const, message: "Patient R. Wilson — Oxygen saturation drop", time: "22 min ago" },
    { id: 5, type: "info" as const, message: "New healthcare advisory published", time: "1 hr ago" },
]

const patients = [
    {
        name: "James Anderson",
        age: 54,
        condition: "Cardiac Monitoring",
        status: "critical" as const,
        vitals: { heartRate: 142, bloodPressure: "160/95", temperature: 99.8, oxygenSat: 93 },
    },
    {
        name: "Maria Chen",
        age: 38,
        condition: "Post-Op Recovery",
        status: "stable" as const,
        vitals: { heartRate: 72, bloodPressure: "118/76", temperature: 98.4, oxygenSat: 98 },
    },
    {
        name: "Robert Williams",
        age: 67,
        condition: "Respiratory Watch",
        status: "warning" as const,
        vitals: { heartRate: 88, bloodPressure: "140/88", temperature: 100.2, oxygenSat: 95 },
    },
    {
        name: "Sarah Kim",
        age: 29,
        condition: "General Checkup",
        status: "stable" as const,
        vitals: { heartRate: 68, bloodPressure: "115/72", temperature: 98.1, oxygenSat: 99 },
    },
]

const chartBars = [35, 55, 42, 68, 85, 72, 60, 78, 90, 65, 48, 82]

export default function LiveDataFeed({ visible, onClose }: LiveDataFeedProps) {
    const alertTypeConfig = {
        critical: { color: "#EF4444", icon: "⚠", pulse: true },
        warning: { color: "#F59E0B", icon: "⚡", pulse: false },
        info: { color: "#00D4FF", icon: "ℹ", pulse: false },
    }

    return (
        <>
            {/* Mobile overlay */}
            {visible && (
                <div className="fixed inset-0 bg-black/50 z-30 xl:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed top-14 right-0 h-[calc(100vh-56px)] w-[320px] bg-[#0F1729] border-l border-[rgba(255,255,255,0.06)] z-40 transition-transform duration-300 overflow-y-auto ${visible ? "translate-x-0" : "translate-x-full xl:translate-x-0"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#0F1729] z-10 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Feed</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="xl:hidden p-1 rounded hover:bg-[rgba(255,255,255,0.05)] text-[#64748B] hover:text-white transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 space-y-5">

                    {/* ── Mini Activity Chart ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest text-[#4B5563] font-semibold">Query Activity</p>
                            <span className="text-[10px] text-[#64748B]">Last 12 hrs</span>
                        </div>
                        <div className="card-flat p-3">
                            <div className="flex items-end justify-between gap-1" style={{ height: "60px" }}>
                                {chartBars.map((val, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-sm bg-gradient-to-t from-[#00D4FF] to-[#06B6D4] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                        style={{
                                            height: `${val}%`,
                                            animation: `barGrow 0.6s ease-out ${i * 0.05}s forwards`,
                                            maxWidth: "14px",
                                        }}
                                        title={`${val}% activity`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Recent Alerts ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest text-[#4B5563] font-semibold">Recent Alerts</p>
                            <span className="badge badge-danger">{recentAlerts.filter(a => a.type === "critical").length} Critical</span>
                        </div>
                        <div className="space-y-2">
                            {recentAlerts.map((alert) => {
                                const config = alertTypeConfig[alert.type]
                                return (
                                    <div
                                        key={alert.id}
                                        className={`card-flat p-2.5 flex items-start gap-2.5 ${config.pulse ? "pulse-alert" : ""}`}
                                    >
                                        <span className="text-sm mt-0.5" style={{ filter: `drop-shadow(0 0 4px ${config.color})` }}>
                                            {config.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] text-[#E2E8F0] leading-snug">{alert.message}</p>
                                            <p className="text-[9px] mt-1" style={{ color: config.color }}>{alert.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Patient Monitor ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest text-[#4B5563] font-semibold">Patient Monitor</p>
                            <span className="text-[10px] text-[#64748B]">{patients.length} Active</span>
                        </div>
                        <div className="space-y-2">
                            {patients.map((p, i) => (
                                <PatientCard key={i} {...p} />
                            ))}
                        </div>
                    </div>

                </div>
            </aside>
        </>
    )
}
