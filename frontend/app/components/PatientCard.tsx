"use client"

import { useState } from "react"

interface PatientCardProps {
    name: string
    age: number
    condition: string
    status: "stable" | "warning" | "critical"
    vitals?: {
        heartRate: number
        bloodPressure: string
        temperature: number
        oxygenSat: number
    }
}

export default function PatientCard({ name, age, condition, status, vitals }: PatientCardProps) {
    const [expanded, setExpanded] = useState(false)

    const statusConfig = {
        stable: { label: "Stable", class: "badge-success", dotClass: "status-online" },
        warning: { label: "Warning", class: "badge-warning", dotClass: "status-warning" },
        critical: { label: "Critical", class: "badge-danger", dotClass: "status-critical" },
    }

    const sc = statusConfig[status]

    return (
        <div
            className="card cursor-pointer group"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`${sc.dotClass} status-dot flex-shrink-0`} />
                        <div>
                            <p className="text-[13px] font-semibold text-white">{name}</p>
                            <p className="text-[11px] text-[#64748B]">{age}y • {condition}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`badge ${sc.class}`}>{sc.label}</span>
                        <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            className={`text-[#64748B] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded Vitals */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: expanded ? "200px" : "0", opacity: expanded ? 1 : 0 }}
            >
                {vitals && (
                    <div className="px-3 pb-3 pt-1 border-t border-[rgba(255,255,255,0.04)]">
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <VitalItem label="Heart Rate" value={`${vitals.heartRate}`} unit="bpm" color="#EF4444" />
                            <VitalItem label="Blood Pressure" value={vitals.bloodPressure} unit="mmHg" color="#00D4FF" />
                            <VitalItem label="Temperature" value={`${vitals.temperature}`} unit="°F" color="#F59E0B" />
                            <VitalItem label="SpO₂" value={`${vitals.oxygenSat}`} unit="%" color="#10B981" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function VitalItem({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
    return (
        <div className="bg-[#0B1220] rounded-md p-2">
            <p className="text-[9px] text-[#64748B] uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-bold" style={{ color }}>
                {value} <span className="text-[10px] font-normal text-[#64748B]">{unit}</span>
            </p>
        </div>
    )
}
