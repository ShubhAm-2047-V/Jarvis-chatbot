"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useJarvisVoice() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const lastSpokenRef = useRef<string>("")
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    synthRef.current = window.speechSynthesis

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length === 0) return

      setVoices(availableVoices)

      // Priority: find the best female / natural sounding voice
      const priorities = [
        // Google and Microsoft high-quality female voices
        (v: SpeechSynthesisVoice) =>
          /female|zira|samantha|karen|moira|fiona|victoria|allison|susan|hazel/i.test(v.name) &&
          /en/i.test(v.lang),
        // Google voices (high quality)
        (v: SpeechSynthesisVoice) =>
          /google.*female|google.*us/i.test(v.name),
        // Any English female voice
        (v: SpeechSynthesisVoice) =>
          /female|woman|samantha|karen|zira|victoria|susan|hazel/i.test(v.name),
        // Any English voice as fallback
        (v: SpeechSynthesisVoice) =>
          /en[-_]us|en[-_]gb|en[-_]au/i.test(v.lang),
        // Default English
        (v: SpeechSynthesisVoice) =>
          /en/i.test(v.lang),
      ]

      for (const check of priorities) {
        const match = availableVoices.find(check)
        if (match) {
          setSelectedVoice(match)
          return
        }
      }

      // Ultimate fallback
      setSelectedVoice(availableVoices[0])
    }

    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [])

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !text.trim()) return

      // Cancel any ongoing speech
      synthRef.current.cancel()

      // Clean text: remove markdown, emojis, code blocks
      const cleanText = text
        .replace(/```[\s\S]*?```/g, " code block ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/#+ /g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
          ""
        )
        .replace(/\s+/g, " ")
        .trim()

      if (!cleanText) return

      const utterance = new SpeechSynthesisUtterance(cleanText)

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.rate = 0.95
      utterance.pitch = 1.1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    },
    [selectedVoice]
  )

  const speakIfNew = useCallback(
    (text: string) => {
      if (!isVoiceEnabled || !text.trim()) return
      if (text === lastSpokenRef.current) return

      lastSpokenRef.current = text
      speak(text)
    },
    [isVoiceEnabled, speak]
  )

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => {
      if (prev) {
        // Turning off - stop current speech
        stop()
      }
      return !prev
    })
  }, [stop])

  return {
    isVoiceEnabled,
    isSpeaking,
    selectedVoice,
    voices,
    speak,
    speakIfNew,
    stop,
    toggleVoice,
    setSelectedVoice,
  }
}
