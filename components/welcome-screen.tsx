"use client"

import { JarvisAvatar } from "./jarvis-avatar"
import { Sparkles, MessageCircle, Brain, Shield } from "lucide-react"

const suggestions = [
  { icon: MessageCircle, text: "Tell me something interesting" },
  { icon: Brain, text: "Help me brainstorm ideas" },
  { icon: Shield, text: "What can you do?" },
]

export function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in-up">
      <div className="relative mb-6">
        <JarvisAvatar className="w-16 h-16 animate-pulse-glow" />
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary opacity-70" />
      </div>

      <h2 className="text-2xl font-serif font-medium text-foreground mb-2 text-balance text-center">
        Hello, I'm Jarvis
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs text-center leading-relaxed mb-8">
        Your intelligent companion. Ask me anything, or pick a suggestion below.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card/50 text-sm text-foreground hover:bg-card hover:border-primary/20 transition-all group text-left"
          >
            <suggestion.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
