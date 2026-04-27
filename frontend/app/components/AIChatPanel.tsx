"use client"

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react"
import MagneticButton from "./MagneticButton"
import VoiceInput from "./VoiceInput"
import RiskMeter from "./RiskMeter"

interface ChatMessage {
    role: "user" | "bot"
    content: string
    timestamp: Date
    riskLevel?: "High" | "Medium" | "Low"
    suggestedAction?: string
}

/* ── Inline Icons ── */
const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
)

const HeartPulseIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.88-4.5 2.23C10.832 3.88 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
)

const quickPrompts = [
    { icon: "🤒", text: "What are the symptoms of flu?", borderColor: "rgba(249,115,22,0.2)" },
    { icon: "💉", text: "How to manage diabetes?", borderColor: "rgba(0,212,255,0.2)" },
    { icon: "❤️", text: "What causes high blood pressure?", borderColor: "rgba(239,68,68,0.2)" },
    { icon: "🩺", text: "When should I see a doctor?", borderColor: "rgba(16,185,129,0.2)" },
    { icon: "🧠", text: "How to manage stress and anxiety?", borderColor: "rgba(167,139,250,0.2)" },
    { icon: "💓", text: "Tips for heart health", borderColor: "rgba(244,63,94,0.2)" },
]

export default function AIChatPanel() {
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [typingText, setTypingText] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [voiceMode, setVoiceMode] = useState(false)
    const [latestRisk, setLatestRisk] = useState<{ level: "High" | "Medium" | "Low"; action: string } | null>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chat, typingText])

    // Text-to-Speech for voice mode
    const speakText = useCallback((text: string) => {
        if (!voiceMode) return
        if (typeof window === "undefined" || !window.speechSynthesis) return

        // Clean response of emojis and source tags for cleaner TTS
        const cleanText = text
            .replace(/\[📚[^\]]*\]/g, "")
            .replace(/\[⚡[^\]]*\]/g, "")
            .replace(/[^\w\s.,!?;:'"()-]/g, "")
            .trim()

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 0.9
        window.speechSynthesis.speak(utterance)
    }, [voiceMode])

    // Typing animation effect
    const animateTyping = useCallback((fullText: string, riskLevel?: "High" | "Medium" | "Low", suggestedAction?: string) => {
        setIsTyping(true)
        setTypingText("")
        let i = 0
        const interval = setInterval(() => {
            if (i < fullText.length) {
                setTypingText(fullText.slice(0, i + 1))
                i++
            } else {
                clearInterval(interval)
                setIsTyping(false)
                setTypingText("")
                const botMessage: ChatMessage = {
                    role: "bot",
                    content: fullText,
                    timestamp: new Date(),
                    riskLevel,
                    suggestedAction,
                }
                setChat(prev => [...prev, botMessage])

                if (riskLevel) {
                    setLatestRisk({ level: riskLevel, action: suggestedAction || "" })
                }

                // TTS after typing completes
                speakText(fullText)
            }
        }, 12)
    }, [speakText])

    const sendMessageWithText = useCallback(async (text: string) => {
        if (!text.trim()) return

        setError("")
        setLoading(true)
        setLatestRisk(null)

        const userMessage: ChatMessage = {
            role: "user",
            content: text,
            timestamp: new Date(),
        }
        setChat(prev => [...prev, userMessage])

        try {
            const res = await fetch(`http://127.0.0.1:8000/chat?query=${encodeURIComponent(text)}`)
            if (!res.ok) throw new Error("Failed to get response")
            const data = await res.json()
            setLoading(false)
            animateTyping(data.response, data.risk_level, data.suggested_action)
        } catch {
            setError("Failed to connect to backend. Make sure the Python server is running on port 8000.")
            const errorMessage: ChatMessage = {
                role: "bot",
                content: "⚠️ Connection failed. Please ensure the backend server is running on port 8000.",
                timestamp: new Date(),
            }
            setChat(prev => [...prev, errorMessage])
            setLoading(false)
        } finally {
            inputRef.current?.focus()
        }
    }, [animateTyping])

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return
        const currentMsg = message
        setMessage("")
        await sendMessageWithText(currentMsg)
    }

    const handleQuickPrompt = (prompt: string) => {
        setMessage(prompt)
        setTimeout(() => {
            const form = document.getElementById("chat-form") as HTMLFormElement
            form?.requestSubmit()
        }, 50)
    }

    const handleVoiceTranscript = useCallback((text: string) => {
        sendMessageWithText(text)
    }, [sendMessageWithText])

    const clearChat = () => {
        setChat([])
        setError("")
        setTypingText("")
        setIsTyping(false)
        setLatestRisk(null)
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel()
        }
    }

    return (
        <div className="flex flex-col h-full">

            {/* ── Chat Header ── */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                    <h2 className="text-sm font-bold text-white">AI Medical Assistant</h2>
                    <span className="badge badge-info">RAG</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Voice/Text Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium ${!voiceMode ? "text-[#00D4FF]" : "text-[#4B5563]"}`}>Text</span>
                        <button
                            onClick={() => {
                                setVoiceMode(!voiceMode)
                                if (typeof window !== "undefined" && window.speechSynthesis) {
                                    window.speechSynthesis.cancel()
                                }
                            }}
                            className="voice-toggle-switch"
                        >
                            <div className={`voice-toggle-thumb ${voiceMode ? "voice-toggle-active" : ""}`} />
                        </button>
                        <span className={`text-[10px] font-medium ${voiceMode ? "text-[#A78BFA]" : "text-[#4B5563]"}`}>Voice</span>
                    </div>

                    {chat.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.04)] transition-colors text-[11px] text-[#64748B] hover:text-white"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Chat
                        </button>
                    )}
                </div>
            </div>

            {/* ── Empty State ── */}
            {chat.length === 0 && !isTyping && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                    <div className="space-y-5 max-w-lg animate-fade-up">
                        <div className="flex justify-center mb-2">
                            <div className="w-16 h-16 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center animate-heartbeat text-[#00D4FF]">
                                <HeartPulseIcon />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black gradient-text-hero leading-tight">
                                Your AI Health<br />Companion
                            </h2>
                            <p className="text-sm text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                                Ask about symptoms, conditions, and wellness tips.
                                Powered by <span className="font-semibold text-[#00D4FF]">Groq</span> for instant responses.
                                {voiceMode && <span className="block mt-1 text-[#A78BFA]">🎙️ Voice mode active — tap the mic to speak</span>}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full">
                            {quickPrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickPrompt(prompt.text)}
                                    className="group p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(0,212,255,0.25)] transition-all text-left animate-card-appear hover-lift"
                                    style={{
                                        animationDelay: `${0.15 + idx * 0.06}s`,
                                        borderColor: undefined,
                                    }}
                                >
                                    <span className="text-lg block mb-1">{prompt.icon}</span>
                                    <span className="text-[12px] text-[#94A3B8] group-hover:text-white transition leading-snug">{prompt.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Chat Messages ── */}
            {(chat.length > 0 || isTyping) && (
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                    {chat.map((msg, index) => (
                        <div key={index}>
                            <div
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
                                style={{ animationDelay: `${index * 0.03}s` }}
                            >
                                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs ${msg.role === "user"
                                        ? "bg-gradient-to-br from-[#0C4A6E] to-[#0369A1]"
                                        : "bg-[#111827] border border-[rgba(0,212,255,0.15)]"
                                        }`}>
                                        {msg.role === "user" ? "👤" : "🐰"}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`${msg.role === "user" ? "msg-user" : "msg-bot"} px-3.5 py-2.5`}>
                                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        <span className="text-[9px] opacity-30 mt-1.5 block">
                                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Meter after bot message */}
                            {msg.role === "bot" && msg.riskLevel && (
                                <div className="flex justify-start mt-2 ml-9">
                                    <RiskMeter
                                        riskLevel={msg.riskLevel}
                                        suggestedAction={msg.suggestedAction || ""}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing animation — character by character */}
                    {isTyping && typingText && (
                        <div className="flex justify-start animate-fade-up">
                            <div className="flex items-end gap-2 max-w-[85%] md:max-w-[75%]">
                                <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs bg-[#111827] border border-[rgba(0,212,255,0.15)]">
                                    🐰
                                </div>
                                <div className="msg-bot px-3.5 py-2.5">
                                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                                        {typingText}
                                        <span className="inline-block w-0.5 h-4 bg-[#00D4FF] ml-0.5 animate-pulse align-middle" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading dots */}
                    {loading && (
                        <div className="flex justify-start animate-fade-up">
                            <div className="flex items-end gap-2">
                                <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs bg-[#111827] border border-[rgba(0,212,255,0.15)]">
                                    <span className="animate-heartbeat inline-block">🐰</span>
                                </div>
                                <div className="msg-bot px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex gap-1">
                                            <div className="typing-dot" />
                                            <div className="typing-dot" />
                                            <div className="typing-dot" />
                                        </div>
                                        <span className="text-[10px] text-[#4B5563]">Analyzing...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div className="mx-4 md:mx-6 mb-2 p-2.5 rounded-md bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] text-[12px] text-red-300 animate-fade-up">
                    ⚠️ {error}
                </div>
            )}

            {/* ── Input Bar ── */}
            <div className="p-3 md:px-6 border-t border-[rgba(255,255,255,0.06)] bg-[#0B1220]">
                {voiceMode ? (
                    /* Voice Mode Input */
                    <div className="flex flex-col items-center gap-3 py-2">
                        <VoiceInput
                            onTranscript={handleVoiceTranscript}
                            disabled={loading || isTyping}
                        />
                        <p className="text-[10px] text-[#4B5563]">Tap the mic and speak your health question</p>
                    </div>
                ) : (
                    /* Text Mode Input */
                    <form id="chat-form" onSubmit={sendMessage} className="flex gap-2.5 items-center">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about health, symptoms, conditions..."
                                disabled={loading || isTyping}
                                className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(0,212,255,0.4)] text-[13px] text-white placeholder-[#4B5563] transition-all input-glow disabled:opacity-40 disabled:cursor-not-allowed pr-10"
                            />
                            {message.trim() && !loading && !isTyping && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#4B5563] bg-[#1a2332] px-1 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
                                    ↵
                                </div>
                            )}
                        </div>
                        <MagneticButton
                            type="submit"
                            disabled={loading || isTyping || !message.trim()}
                            className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#00D4FF] to-[#06B6D4] hover:from-[#33DFFF] hover:to-[#22D3EE] disabled:from-[#1E293B] disabled:to-[#1E293B] disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(0,212,255,0.25)] disabled:shadow-none"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <SendIcon />
                            )}
                        </MagneticButton>
                    </form>
                )}
                <p className="text-center text-[9px] text-[#4B5563] mt-2">
                    Rabbit AI provides general health information. Always consult healthcare professionals for medical advice.
                </p>
            </div>
        </div>
    )
}
