"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function scoreTone(score: number) {
  if (score >= 80) return { stroke: "var(--success)", text: "text-green-600 dark:text-green-400", label: "Strong" }
  if (score >= 60) return { stroke: "var(--warning)", text: "text-amber-600 dark:text-amber-400", label: "Fair" }
  return { stroke: "var(--destructive)", text: "text-red-600 dark:text-red-400", label: "Weak" }
}

export function ScoreRing({ score, size = 112, stroke = 10, label, className }: { score: number; size?: number; stroke?: number; label?: string; className?: string }) {
  const reduce = useReducedMotion()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = scoreTone(score)
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Score"}: ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - score / 100) : c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] leading-none font-semibold tabular-nums" style={{ fontSize: size * 0.26 }}>
          {score}
        </span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">/100</span>
      </div>
    </div>
  )
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  const tone = scoreTone(score)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("font-semibold tabular-nums", tone.text)}>{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={label} aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: tone.stroke }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
