"use client"

import { toast } from "sonner"
import { ACHIEVEMENTS } from "@/lib/data/gamification"
import type { RewardResult } from "@/lib/store/app-store"

/** Shows XP, level-up, and badge toasts for a reward. */
export function celebrate(result: RewardResult | null, label: string) {
  if (!result) return
  toast.success(`${label} · +${result.xpGained} XP`)
  if (result.leveledUp) {
    toast(`🎉 Level up! You're now Level ${result.level} — ${result.levelTitle}`, { duration: 6000 })
  }
  for (const id of result.unlocked) {
    const a = ACHIEVEMENTS.find((x) => x.id === id)
    if (a) toast(`🏅 Badge unlocked: ${a.title}`, { description: a.description, duration: 6000 })
  }
}
