import { Film, Image as ImageIcon, Radio, Smartphone, type LucideIcon } from "lucide-react"
import type { PlannerStatus, PlannerType } from "@/types/domain"

export const STATUS_META: Record<PlannerStatus, { label: string; dot: string; chip: string }> = {
  idea: { label: "Idea", dot: "bg-zinc-400", chip: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300" },
  planned: { label: "Planned", dot: "bg-sky-500", chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  draft: { label: "Draft", dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  ready: { label: "Ready", dot: "bg-violet-500", chip: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  published: { label: "Published", dot: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
}

export const TYPE_META: Record<PlannerType, { label: string; icon: LucideIcon; bar: string }> = {
  video: { label: "Video", icon: Film, bar: "border-l-violet-500" },
  post: { label: "Post", icon: ImageIcon, bar: "border-l-pink-500" },
  story: { label: "Story", icon: Smartphone, bar: "border-l-amber-500" },
  live: { label: "Live", icon: Radio, bar: "border-l-red-500" },
}

export const STATUSES = Object.keys(STATUS_META) as PlannerStatus[]
export const TYPES = Object.keys(TYPE_META) as PlannerType[]

export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** 42 days (6 weeks, Monday-first) covering the month of `anchor`. */
export function monthGrid(anchor: Date): Date[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function weekDays(anchor: Date): Date[] {
  const offset = (anchor.getDay() + 6) % 7
  const start = new Date(anchor)
  start.setDate(anchor.getDate() - offset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}
