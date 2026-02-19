"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { WelcomeScreen } from "@/components/welcome-screen"
import { TypingIndicator } from "@/components/typing-indicator"
import { useSpeech } from "@/hooks/use-speech"

export default function Page() {
  const [input, setInput] = useState("")
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isListening, startListening, stopListening, speak, stopSpeaking } = useSpeech({
    onSpeechEnd: (text) => {
      setInput(text)
      setIsVoiceMode(true)
    },
  })

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: ({ message }) => {
      if (message.role === 'assistant') {
        const text = message.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')

        if (text && isVoiceMode) speak(text)
      }
    }
  })

  const isLoading = status === "streaming" || status === "submitted"
  const isSubmitted = status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    stopSpeaking()
    if (!isListening) {
      setIsVoiceMode(false)
    }
    sendMessage({ text: input })
    setInput("")
  }

  const handleSuggestionClick = (text: string) => {
    stopSpeaking()
    setIsVoiceMode(false)
    sendMessage({ text })
  }

  const handleStartListening = () => {
    stopSpeaking()
    setIsVoiceMode(true)
    startListening()
  }

  return (
    <main className="flex flex-col h-dvh bg-background">
      <ChatHeader isOnline={isLoading} />

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 md:px-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isSubmitted && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSend}
        isLoading={isLoading}
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={stopListening}
      />
    </main>
  )
}
