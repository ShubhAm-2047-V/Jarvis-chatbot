"use client"

import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { JarvisAvatar } from "./jarvis-avatar"
import { User } from "lucide-react"

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isAssistant = message.role === "assistant"
  const text = getMessageText(message)

  if (!text) return null

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 mt-1">
          <JarvisAvatar className="w-7 h-7" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "bg-card border border-border/50 text-foreground rounded-tl-md"
            : "bg-primary/15 border border-primary/10 text-foreground rounded-tr-md"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center border border-border/50">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
