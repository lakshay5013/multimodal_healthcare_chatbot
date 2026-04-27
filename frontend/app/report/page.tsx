"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import ReportAnalyzer from "../components/ReportAnalyzer"

export default function ReportPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <main className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">

            {/* ── Background Elements ── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute w-[500px] h-[500px] rounded-full -top-60 -left-60 opacity-[0.03]"
                    style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)" }} />
                <div className="absolute w-[400px] h-[400px] rounded-full -bottom-40 -right-40 opacity-[0.025]"
                    style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `linear-gradient(rgba(167,139,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.3) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }} />
            </div>

            {/* ── TopBar ── */}
            <TopBar
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* ── Sidebar ── */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* ── Main Content: Report Analyzer ── */}
            <style>{`
        .main-content {
          margin-left: ${sidebarCollapsed ? "60px" : "240px"};
        }
        @media (max-width: 1023px) {
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
            <div className="main-content pt-14 transition-all duration-300 relative z-10">
                <div className="h-[calc(100vh-56px)]">
                    <div className="card-surface h-full overflow-hidden">
                        <ReportAnalyzer />
                    </div>
                </div>
            </div>
        </main>
    )
}
