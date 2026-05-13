"use client"

import { useState, useRef, type DragEvent } from "react"

interface ParameterResult {
    parameter: string
    value: number
    normal_range: string
    unit: string
    status: "Low" | "High" | "Normal"
}

interface ReportResult {
    extracted_values: ParameterResult[]
    abnormal_parameters: ParameterResult[]
    summary: string
    error?: string
}

const STATUS_COLORS = {
    Low: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#60A5FA", label: "↓ Low" },
    High: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#F87171", label: "↑ High" },
    Normal: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34D399", label: "✓ Normal" },
}

export default function ReportAnalyzer() {
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8001"
    const [isDragging, setIsDragging] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [scanProgress, setScanProgress] = useState(0)
    const [result, setResult] = useState<ReportResult | null>(null)
    const [error, setError] = useState("")
    const [fileName, setFileName] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        if (!file.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a PDF file.")
            return
        }

        setError("")
        setResult(null)
        setFileName(file.name)
        setIsAnalyzing(true)
        setScanProgress(0)

        // Animate scan progress
        const progressInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + Math.random() * 15
            })
        }, 300)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch(`${backendBaseUrl}/analyze-report`, {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to analyze report")

            const data: ReportResult = await res.json()

            clearInterval(progressInterval)
            setScanProgress(100)

            setTimeout(() => {
                setIsAnalyzing(false)
                setResult(data)
            }, 500)
        } catch {
            clearInterval(progressInterval)
            setIsAnalyzing(false)
            setError("Failed to connect to backend. Make sure the server is running on port 8001.")
        }
    }

    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const onDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => setIsDragging(false)

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const resetAnalyzer = () => {
        setResult(null)
        setError("")
        setFileName("")
        setScanProgress(0)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse" />
                    <h2 className="text-sm font-bold text-white">Health Report Analyzer</h2>
                    <span className="badge badge-info">PDF</span>
                </div>
                {result && (
                    <button
                        onClick={resetAnalyzer}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.04)] transition-colors text-[11px] text-[#64748B] hover:text-white"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Analysis
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
                {/* Upload Zone */}
                {!result && !isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto animate-fade-up">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            className={`report-dropzone ${isDragging ? "report-dropzone-active" : ""}`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={onFileSelect}
                                className="hidden"
                            />
                            <div className="report-dropzone-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M12 18v-6" />
                                    <path d="m9 15 3-3 3 3" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-white mt-4 mb-1">Upload Blood Test Report</h3>
                            <p className="text-[12px] text-[#64748B] mb-4">Drag & drop your PDF report here, or click to browse</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#4B5563] bg-[#1a2332] px-2 py-1 rounded border border-[rgba(255,255,255,0.06)]">PDF format</span>
                                <span className="text-[10px] text-[#4B5563] bg-[#1a2332] px-2 py-1 rounded border border-[rgba(255,255,255,0.06)]">Blood test reports</span>
                            </div>
                        </div>

                        <div className="mt-6 p-3 rounded-lg bg-[rgba(167,139,250,0.05)] border border-[rgba(167,139,250,0.1)] max-w-md">
                            <p className="text-[10px] text-purple-300/80 leading-relaxed text-center">
                                🔬 Supported parameters: Hemoglobin, WBC, RBC, Blood Sugar, Cholesterol, Platelets, Creatinine, TSH, HbA1c, and more.
                            </p>
                        </div>
                    </div>
                )}

                {/* Scanning Animation */}
                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto animate-fade-up">
                        <div className="report-scan-container">
                            <div className="report-scan-doc">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="8" y1="13" x2="16" y2="13" />
                                    <line x1="8" y1="17" x2="13" y2="17" />
                                </svg>
                            </div>
                            <div className="report-scan-line" />
                        </div>

                        <p className="text-sm font-semibold text-white mt-6 mb-2">Analyzing Report...</p>
                        <p className="text-[11px] text-[#64748B] mb-4">{fileName}</p>

                        {/* Progress bar */}
                        <div className="w-64 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] transition-all duration-300"
                                style={{ width: `${scanProgress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-[#4B5563] mt-2">{Math.round(scanProgress)}% complete</p>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.06)]">
                                <p className="text-[20px] font-bold text-[#00D4FF]">{result.extracted_values.length}</p>
                                <p className="text-[10px] text-[#64748B] mt-0.5">Parameters Found</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.06)]">
                                <p className="text-[20px] font-bold text-[#10B981]">
                                    {result.extracted_values.filter(p => p.status === "Normal").length}
                                </p>
                                <p className="text-[10px] text-[#64748B] mt-0.5">Normal</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.06)]">
                                <p className="text-[20px] font-bold text-[#EF4444]">{result.abnormal_parameters.length}</p>
                                <p className="text-[10px] text-[#64748B] mt-0.5">Abnormal</p>
                            </div>
                        </div>

                        {/* Parameter Table */}
                        {result.extracted_values.length > 0 && (
                            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden">
                                <div className="px-4 py-2.5 bg-[#111827] border-b border-[rgba(255,255,255,0.06)]">
                                    <h3 className="text-[12px] font-bold text-white">Test Results</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[rgba(255,255,255,0.06)]">
                                                <th className="px-4 py-2 text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Parameter</th>
                                                <th className="px-4 py-2 text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Value</th>
                                                <th className="px-4 py-2 text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Normal Range</th>
                                                <th className="px-4 py-2 text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.extracted_values.map((param, i) => {
                                                const statusStyle = STATUS_COLORS[param.status]
                                                return (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors animate-fade-up"
                                                        style={{ animationDelay: `${i * 0.05}s` }}
                                                    >
                                                        <td className="px-4 py-2.5 text-[12px] font-medium text-white">{param.parameter}</td>
                                                        <td className="px-4 py-2.5 text-[12px] text-[#94A3B8] font-mono">{param.value} {param.unit}</td>
                                                        <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{param.normal_range}</td>
                                                        <td className="px-4 py-2.5">
                                                            <span
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                                                                style={{
                                                                    background: statusStyle.bg,
                                                                    border: `1px solid ${statusStyle.border}`,
                                                                    color: statusStyle.text,
                                                                }}
                                                            >
                                                                {statusStyle.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* AI Explanation */}
                        {result.summary && (
                            <div className="rounded-lg border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.03)] p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🐰</span>
                                    <h3 className="text-[12px] font-bold text-[#00D4FF]">AI Analysis</h3>
                                    <span className="badge badge-info">Groq</span>
                                </div>
                                <p className="text-[13px] leading-relaxed text-[#94A3B8] whitespace-pre-wrap">{result.summary}</p>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.1)]">
                            <p className="text-[10px] text-amber-400/80 leading-relaxed text-center">
                                ⚕️ This analysis is for informational purposes only. Always consult your doctor for proper interpretation of medical reports.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mx-auto max-w-md p-3 rounded-md bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] text-[12px] text-red-300 animate-fade-up text-center mt-4">
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    )
}
