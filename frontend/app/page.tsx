"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

// Dynamic import to avoid SSR issues with Three.js
const DNAHelix = dynamic(() => import("./components/DNAHelix"), {
  ssr: false,
  loading: () => (
    <div className="dna-canvas-wrapper flex items-center justify-center">
      <div className="dna-loader">
        <span></span><span></span><span></span>
      </div>
    </div>
  ),
})

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="landing-page">
      {/* ── Background Layers ── */}
      <div className="landing-bg">
        <div className="landing-grid" />
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="url(#logo-grad)" />
              <path d="M8 12l3 3 5-6" stroke="#0B1220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#00D4FF" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="landing-logo-text">Rabbit AI</span>
        </div>
        <div className="landing-nav-links">
          <span className="landing-nav-badge">Healthcare AI</span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <div className="landing-hero">
        {/* Left content */}
        <div className={`landing-hero-content ${mounted ? "animate-in" : ""}`}>
          <div className="landing-tag">
            <span className="landing-tag-dot" />
            AI-Powered Diagnostics
          </div>

          <h1 className="landing-title">
            <span className="landing-title-line">Healthcare</span>
            <span className="landing-title-line gradient-text-hero">Intelligence</span>
            <span className="landing-title-line">Reimagined</span>
          </h1>

          <p className="landing-subtitle">
            Experience the future of medical AI — powered by advanced RAG pipeline,
            real-time diagnostics, and LLaMA 3.3 intelligence.
          </p>

          <div className="landing-stats">
            <div className="landing-stat">
              <span className="landing-stat-value">99.2%</span>
              <span className="landing-stat-label">Accuracy</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-value">&lt;2s</span>
              <span className="landing-stat-label">Response</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-value">24/7</span>
              <span className="landing-stat-label">Available</span>
            </div>
          </div>

          <div className="landing-actions">
            <Link href="/chat" className="landing-cta">
              <span>Launch Command Center</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <button className="landing-secondary-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="6.5,5 12,8 6.5,11" fill="currentColor" />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right: 3D DNA */}
        <div className={`landing-hero-visual ${mounted ? "animate-in" : ""}`}>
          <div className="dna-glow-ring" />
          <DNAHelix />
          <div className="dna-label">
            <span className="dna-label-dot" />
            Interactive 3D Model — Drag to Rotate
          </div>
        </div>
      </div>

      {/* ── Bottom feature cards ── */}
      <div className={`landing-features ${mounted ? "animate-in" : ""}`}>
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#00D4FF" strokeWidth="1.5" />
            </svg>
          </div>
          <h3>RAG Pipeline</h3>
          <p>Advanced retrieval-augmented generation with FAISS vector search</p>
        </div>
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Groq Powered</h3>
          <p>Lightning-fast inference with LLaMA 3.3 70B model</p>
        </div>
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Emergency Detection</h3>
          <p>Real-time emergency keyword detection with instant alerts</p>
        </div>
      </div>
    </main>
  )
}