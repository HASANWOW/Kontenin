"use client"

import { Bot, Check, Flame, GraduationCap, Sparkles, Target } from "lucide-react"
import { motion } from "motion/react"
import { StatCard } from "@/components/dashboard/dashboard-cards"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressBar } from "@/components/shared/progress-bar"
import { COURSES } from "@/lib/data/courses"
import { ACHIEVEMENTS, ALL_LEVELS, levelFor, levelProgress } from "@/lib/data/gamification"
import { fullNumber, relativeTime } from "@/lib/format"
import { courseProgress, liveStreak } from "@/lib/selectors"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { AchievementBadge } from "./achievement-badge"

export function ProgressView() {
  const xp = useAppStore((s) => s.xp)
  const streak = useAppStore((s) => s.streak)
  const lastActiveDate = useAppStore((s) => s.lastActiveDate)
  const stats = useAppStore((s) => s.stats)
  const lessons = useAppStore((s) => s.completedLessons)
  const missions = useAppStore((s) => s.completedMissionIds)
  const achievements = useAppStore((s) => s.achievements)
  const activity = useAppStore((s) => s.activity)

  const level = levelFor(xp)
  const completedCourses = COURSES.filter((c) => courseProgress(c, lessons) === 100).length
  const unlockedCount = Object.keys(achievements).length

  return (
    <div className="space-y-6">
      <PageHeader title="Progress" description="Every lesson, mission, and feedback session moves you forward." />

      <section aria-label="Current level" className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-glow">
        <div aria-hidden className="grid-pattern absolute inset-0 opacity-15" />
        <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="grid size-24 place-items-center rounded-3xl bg-white/15 backdrop-blur">
            <div className="text-center">
              <div className="text-xs text-white/80">LEVEL</div>
              <div className="text-4xl leading-none font-semibold">{level.level}</div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight">{level.title}</p>
            <p className="mt-1 text-white/80">
              {fullNumber(xp)} XP total{level.nextXp ? ` · ${fullNumber(level.nextXp - xp)} XP to Level ${level.level + 1}` : " · max level reached"}
            </p>
            <ProgressBar value={levelProgress(xp)} label="Level progress" className="mt-4 h-2.5 max-w-xl bg-white/25" barClassName="bg-white" gradient={false} />
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Flame} label="Day streak" value={liveStreak(streak, lastActiveDate)} tone="bg-orange-500/10 text-orange-600 dark:text-orange-400" />
        <StatCard icon={GraduationCap} label="Completed courses" value={completedCourses} tone="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard icon={Target} label="Completed missions" value={missions.length} tone="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
        <StatCard icon={Bot} label="AI feedback sessions" value={stats.aiFeedback} tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <section aria-labelledby="journey" className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 id="journey" className="font-semibold">
          Your creator journey
        </h2>
        <div className="relative mt-6">
          <div aria-hidden className="absolute top-5 right-[7%] left-[7%] hidden h-0.5 bg-muted sm:block" />
          <motion.div
            aria-hidden
            className="absolute top-5 left-[7%] hidden h-0.5 bg-brand-gradient sm:block"
            initial={{ width: 0 }}
            animate={{ width: `${(Math.min(level.level - 1 + levelProgress(xp) / 100, ALL_LEVELS.length - 1) / (ALL_LEVELS.length - 1)) * 86}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <ol className="relative grid gap-4 sm:grid-cols-7 sm:gap-2">
          {ALL_LEVELS.map((l) => {
            const done = l.level < level.level
            const current = l.level === level.level
            return (
              <li key={l.level} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
                <span
                  className={cn(
                    "z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold",
                    done ? "border-primary bg-primary text-primary-foreground" : current ? "border-primary bg-card text-primary ring-4 ring-primary/20" : "border-border bg-card text-muted-foreground"
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  {done ? <Check className="size-4" /> : l.level}
                </span>
                <span>
                  <span className={cn("block text-sm font-medium", !done && !current && "text-muted-foreground")}>{l.title}</span>
                  <span className="text-xs text-muted-foreground">{fullNumber(l.minXp)} XP</span>
                </span>
              </li>
            )
          })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="badges">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="badges" className="font-semibold">
            Achievements
          </h2>
          <span className="text-sm text-muted-foreground">
            {unlockedCount} of {ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...ACHIEVEMENTS]
            .sort((a, b) => Number(Boolean(achievements[b.id])) - Number(Boolean(achievements[a.id])))
            .map((a) => (
              <AchievementBadge key={a.id} achievement={a} unlockedAt={achievements[a.id]} />
            ))}
        </div>
      </section>

      <section aria-labelledby="xp-log" className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 id="xp-log" className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-primary" /> XP history
        </h2>
        {activity.filter((a) => a.xp).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Complete a lesson or mission to start earning XP.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {activity
              .filter((a) => a.xp)
              .slice(0, 10)
              .map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="truncate">{a.title}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-muted-foreground">{relativeTime(a.at)}</span>
                    <span className="font-semibold text-primary tabular-nums">+{a.xp}</span>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  )
}
