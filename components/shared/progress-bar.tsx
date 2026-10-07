"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function ProgressBar({
  value,
  label,
  className,
  barClassName,
  gradient = true,
}: {
  value: number
  label: string
  className?: string
  barClassName?: string
  gradient?: boolean
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full", gradient ? "bg-brand-gradient" : "bg-primary", barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
