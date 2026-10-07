"use client"

import { Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/** Animated placeholder shown while an AI request is running. */
export function AIProcessing({ steps, className }: { steps: string[]; className?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, steps.length - 1)), 700)
    return () => clearInterval(t)
  }, [steps.length])

  return (
    <div role="status" aria-live="polite" className={cn("relative overflow-hidden rounded-2xl border bg-card p-6", className)}>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: [0, 1] }}
        transition={{ duration: steps.length * 0.7, ease: "easeInOut" }}
      />
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
          <Sparkles className="size-5 animate-pulse" />
        </span>
        <div>
          <p className="font-semibold">Analyzing…</p>
          <p className="text-sm text-muted-foreground">{steps[i]}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2.5" aria-hidden>
        {[90, 75, 82, 60].map((w, k) => (
          <div key={k} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${w}%`, animationDelay: `${k * 120}ms` }} />
        ))}
      </div>
    </div>
  )
}
