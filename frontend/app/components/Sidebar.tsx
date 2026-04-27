"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

const techStack = [
    { label: "LLaMA 3.3 70B", sub: "via Groq API", color: "#00D4FF" },
    { label: "FAISS Vector DB", sub: "Semantic search", color: "#10B981" },
    { label: "RAG Pipeline", sub: "Context retrieval", color: "#A78BFA" },
]

const capabilities = [
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.88-4.5 2.23C10.832 3.88 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
            </svg>
        ),
        label: "Vital Signs",
        desc: "Health monitoring",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                <path d="M12 5v13" />
            </svg>
        ),
        label: "AI Analysis",
        desc: "Smart insights",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        label: "Safe & Secure",
        desc: "HIPAA aware",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        label: "Groq Speed",
        desc: "Lightning fast",
    },
]

const navItems = [
    {
        href: "/chat",
        label: "AI Chat",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        href: "/report",
        label: "Report Analyzer",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
    },
    {
        href: "/stats",
        label: "System Stats",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
        ),
    },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-[#0F1729] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-all duration-300 z-40 ${collapsed ? "w-[60px]" : "w-[240px]"
                }`}
        >
            {/* Navigation Links */}
            {!collapsed && (
                <div className="px-3 pt-4 pb-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#4B5563] mb-2 px-1 font-semibold">Navigation</p>
                    <div className="space-y-1">
                        {navItems.map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className={`nav-item ${pathname === item.href ? "active" : ""}`}
                            >
                                <span className={pathname === item.href ? "text-[#00D4FF]" : ""}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {collapsed && (
                <div className="px-2 pt-4 space-y-2 flex flex-col items-center">
                    {navItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className={`w-9 h-9 rounded-md ${pathname === item.href ? "bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.2)]" : "bg-[#111827] border-[rgba(255,255,255,0.04)]"} border hover:border-[rgba(0,212,255,0.2)] transition-all flex items-center justify-center ${pathname === item.href ? "text-[#00D4FF]" : "text-[#64748B]"}`}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>
            )}

            {/* Divider */}
            <div className="mx-3 my-2"><hr className="divider" /></div>

            {/* Capabilities */}
            {!collapsed && (
                <div className="px-3 pb-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#4B5563] mb-2 px-1 font-semibold">Capabilities</p>
                    <div className="grid grid-cols-2 gap-2">
                        {capabilities.map((c, i) => (
                            <div
                                key={i}
                                className="p-2.5 rounded-md bg-[#111827] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(0,212,255,0.2)] transition-all flex flex-col items-center text-center gap-1 cursor-default"
                            >
                                <div className="text-[#00D4FF]">{c.icon}</div>
                                <p className="text-[10px] font-semibold text-[#E2E8F0]">{c.label}</p>
                                <p className="text-[8px] text-[#4B5563]">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collapsed: just icons */}
            {collapsed && (
                <div className="px-2 pt-2 space-y-3 flex flex-col items-center">
                    {capabilities.map((c, i) => (
                        <div
                            key={i}
                            className="w-9 h-9 rounded-md bg-[#111827] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(0,212,255,0.2)] transition-all flex items-center justify-center text-[#00D4FF] cursor-default"
                            title={c.label}
                        >
                            {c.icon}
                        </div>
                    ))}
                </div>
            )}

            {/* Tech Stack */}
            {!collapsed && (
                <div className="px-3 pt-4 flex-1">
                    <p className="text-[9px] uppercase tracking-widest text-[#4B5563] mb-2 px-1 font-semibold">Tech Stack</p>
                    <div className="space-y-1.5">
                        {techStack.map((t, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-2 rounded-md bg-[#111827] border border-[rgba(255,255,255,0.04)]">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                                <div>
                                    <p className="text-[11px] font-medium text-[#E2E8F0]">{t.label}</p>
                                    <p className="text-[9px] text-[#4B5563]">{t.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            {!collapsed && (
                <div className="px-3 pb-3">
                    <div className="p-2.5 rounded-md bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.1)]">
                        <p className="text-[9px] text-amber-400/80 leading-relaxed">
                            ⚕️ For medical emergencies, contact emergency services. This AI provides general health info only.
                        </p>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="border-t border-[rgba(255,255,255,0.06)] p-2">
                <button
                    onClick={onToggle}
                    className="w-full p-2 rounded-md hover:bg-[rgba(0,212,255,0.06)] transition-colors text-[#64748B] hover:text-[#00D4FF] flex items-center justify-center"
                >
                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>
        </aside>
    )
}
