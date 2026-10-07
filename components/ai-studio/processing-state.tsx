"use client"

import { Check, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export const ANALYSIS_STAGES = ["Uploading", "Analyzing", "Transcribing", "Finding key moments", "Evaluating content", "Generating recommendations"] as const

export function ProcessingState({ stage, demo }: { stage: number; demo: boolean }) {
  const pct = Math.round((Math.min(stage, ANALYSIS_STAGES.length) / ANALYSIS_STAGES.length) * 100)
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-lg rounded-2xl border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Processing your video</p>
        <span className="text-sm font-medium text-primary tabular-nums">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-brand-gradient" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
      <ol className="mt-5 space-y-3">
        {ANALYSIS_STAGES.map((s, i) => {
          const done = i < stage
          const current = i === stage
          return (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border",
                  done ? "border-success bg-success text-white" : current ? "border-primary text-primary" : "text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3.5" /> : current ? <Loader2 className="size-3.5 animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
              </span>
              <span className={cn(done || current ? "font-medium" : "text-muted-foreground")}>{s}</span>
            </li>
          )
        })}
      </ol>
      {demo && <p className="mt-5 text-xs text-muted-foreground">Demo Mode: stages are simulated and results come from a labeled sample dataset.</p>}
    </div>
  )
}
