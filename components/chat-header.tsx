"use client"

import { JarvisAvatar } from "./jarvis-avatar"
import { Sparkles } from "lucide-react"

export function ChatHeader({ isOnline }: { isOnline: boolean }) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm md:px-6">
      <JarvisAvatar isAnimating={isOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium text-foreground tracking-wide">Jarvis</h1>
          <Sparkles className="w-3 h-3 text-primary opacity-60" />
        </div>
        <p className="text-xs text-muted-foreground">
          {isOnline ? "Listening..." : "Ready to assist"}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-primary/50"
          }`}
        />
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {isOnline ? "Active" : "Online"}
        </span>
      </div>
    </header>
  )
}
