"use client"

import { useState, useRef, useEffect } from "react"

interface VoiceInputProps {
    onTranscript: (text: string) => void
    disabled?: boolean
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const recognitionRef = useRef<SpeechRecognition | null>(null)

    useEffect(() => {
        if (typeof window === "undefined") return

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) return

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const current = event.results[event.results.length - 1]
            const text = current[0].transcript
            setTranscript(text)

            if (current.isFinal) {
                setIsListening(false)
                setTranscript("")
                onTranscript(text)
            }
        }

        recognition.onerror = () => {
            setIsListening(false)
            setTranscript("")
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition
    }, [onTranscript])

    const toggleListening = () => {
        if (!recognitionRef.current) return

        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            setTranscript("")
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    return (
        <div className="voice-input-wrapper">
            {/* Interim transcript display */}
            {isListening && transcript && (
                <div className="voice-transcript animate-fade-up">
                    <span className="voice-transcript-text">{transcript}</span>
                    <span className="voice-transcript-cursor" />
                </div>
            )}

            {/* Waveform animation */}
            {isListening && (
                <div className="voice-waveform">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="voice-waveform-bar"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        />
                    ))}
                </div>
            )}

            {/* Glowing Mic Button */}
            <button
                onClick={toggleListening}
                disabled={disabled}
                className={`voice-mic-btn ${isListening ? "voice-mic-active" : ""}`}
                title={isListening ? "Stop listening" : "Start voice input"}
            >
                {isListening && (
                    <>
                        <span className="voice-mic-ring voice-mic-ring-1" />
                        <span className="voice-mic-ring voice-mic-ring-2" />
                    </>
                )}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </button>
        </div>
    )
}
