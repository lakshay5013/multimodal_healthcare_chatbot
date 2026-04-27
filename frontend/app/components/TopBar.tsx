"use client"

interface TopBarProps {
    sidebarCollapsed: boolean
    onToggleSidebar: () => void
}

export default function TopBar({ sidebarCollapsed, onToggleSidebar }: TopBarProps) {
    return (
        <header className="fixed top-0 w-full bg-[#0F1729] border-b border-[rgba(255,255,255,0.06)] z-50 h-14">
            <div className="h-full px-4 flex items-center justify-between">

                {/* Left: Toggle + Brand */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-md hover:bg-[rgba(0,212,255,0.06)] transition-colors text-[#94A3B8] hover:text-white"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#00D4FF] to-[#06B6D4] flex items-center justify-center text-sm font-bold text-white">
                            🐰
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-bold gradient-text-primary tracking-tight leading-none">RABBIT AI</h1>
                            <p className="text-[9px] text-[#64748B] tracking-widest uppercase">Healthcare Intelligence</p>
                        </div>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-md mx-4 hidden md:block">
                    <div className="relative">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"
                            className="absolute left-3 top-1/2 -translate-y-1/2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search health queries..."
                            className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-md text-[13px] text-white placeholder-[#4B5563] input-glow transition-all"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#4B5563] bg-[#1a2332] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">⌘K</kbd>
                    </div>
                </div>

                {/* Right: Status */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-md hover:bg-[rgba(0,212,255,0.06)] transition-colors text-[#94A3B8] hover:text-white">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                    </button>

                    {/* Status */}
                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)]">
                        <div className="relative">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ring-pulse" />
                        </div>
                        <span className="text-[10px] text-emerald-300 font-semibold tracking-wide">ONLINE</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
