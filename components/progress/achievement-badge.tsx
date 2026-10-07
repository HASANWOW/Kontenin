import { BookOpen, CalendarCheck, Eye, Flame, GraduationCap, Lock, Target, TrendingUp, Video, Zap, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Achievement } from "@/types/domain"

const ICONS: Record<string, LucideIcon> = { BookOpen, Target, Flame, Video, Eye, TrendingUp, CalendarCheck, Zap, GraduationCap }

export function AchievementBadge({ achievement, unlockedAt, size = "md" }: { achievement: Achievement; unlockedAt?: string; size?: "sm" | "md" }) {
  const Icon = ICONS[achievement.icon] ?? Target
  const unlocked = Boolean(unlockedAt)
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border bg-card text-center shadow-soft", size === "md" ? "p-4" : "p-3", !unlocked && "bg-muted/30")}>
      <div
        className={cn(
          "relative grid place-items-center rounded-full",
          size === "md" ? "size-14" : "size-11",
          unlocked ? "bg-brand-gradient text-white shadow-glow" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className={size === "md" ? "size-6" : "size-5"} />
        {!unlocked && (
          <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border bg-card">
            <Lock className="size-3" />
          </span>
        )}
      </div>
      <p className={cn("mt-2.5 font-semibold", size === "md" ? "text-sm" : "text-xs")}>{achievement.title}</p>
      {size === "md" && <p className="mt-0.5 text-xs text-muted-foreground">{achievement.description}</p>}
      <p className={cn("mt-1.5 text-[11px]", unlocked ? "text-primary" : "text-muted-foreground")}>
        {unlocked ? `Unlocked ${new Date(unlockedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : `+${achievement.xp} XP`}
      </p>
    </div>
  )
}
