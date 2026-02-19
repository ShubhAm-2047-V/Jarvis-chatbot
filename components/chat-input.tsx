"use client"

import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  return (
    <div className="border-t border-border/50 bg-card/60 backdrop-blur-sm px-4 py-3 md:px-6">
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background/80 px-4 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Jarvis..."
            rows={1}
            disabled={isLoading}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none min-h-[24px] max-h-[120px] py-1",
              "disabled:opacity-50"
            )}
            style={{ fieldSizing: "content" } as React.CSSProperties}
            aria-label="Type your message"
          />
          <button
            onClick={() => {
              if (input.trim() && !isLoading) onSubmit()
            }}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground"
            )}
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
          Jarvis can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  )
}
