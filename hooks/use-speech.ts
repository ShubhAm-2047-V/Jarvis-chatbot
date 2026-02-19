"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseSpeechProps {
    onSpeechEnd?: (text: string) => void
}

export function useSpeech({ onSpeechEnd }: UseSpeechProps = {}) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = false
                recognitionRef.current.lang = "en-US"

                recognitionRef.current.onstart = () => setIsListening(true)
                recognitionRef.current.onend = () => setIsListening(false)
                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    if (onSpeechEnd) {
                        onSpeechEnd(transcript)
                    }
                }
            }
        }
    }, [onSpeechEnd])

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start()
            } catch (e) {
                console.error("Speech recognition error:", e)
            }
        }
    }, [])

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
    }, [])

    const speak = useCallback((text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            // Cancel any ongoing speech and replace
            window.speechSynthesis.cancel()

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = () => setIsSpeaking(false)

            window.speechSynthesis.speak(utterance)
        }
    }, [])

    const stopSpeaking = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }, [])

    return {
        isListening,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
    }
}
