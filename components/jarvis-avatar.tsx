"use client"

import { cn } from "@/lib/utils"

export function JarvisAvatar({ className, isAnimating = false }: { className?: string; isAnimating?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "w-8 h-8 bg-primary/10 border border-primary/20",
        isAnimating && "animate-pulse-glow",
        className
      )}
    >
      <div className="relative w-4 h-4">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.4" />
          <circle cx="12" cy="12" r="6" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.7" />
          <circle cx="12" cy="12" r="2.5" fill="hsl(var(--primary))" opacity="0.9" />
        </svg>
      </div>
    </div>
  )
}
