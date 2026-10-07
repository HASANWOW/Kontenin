"use client"

import { ArrowRight, BookOpen, Clock, Flame, type LucideIcon, Sparkles, Target, Zap } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { ProgressBar } from "@/components/shared/progress-bar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { levelFor, levelProgress } from "@/lib/data/gamification"
import { capitalize, fullNumber } from "@/lib/format"
import { currentWeek } from "@/lib/selectors"
import { cn } from "@/lib/utils"
import type { Course, Mission } from "@/types/domain"

export const cardClass = "rounded-2xl border bg-card p-5 shadow-soft"

export function LevelCard({ xp, missionHref }: { xp: number; missionHref: string }) {
  const level = levelFor(xp)
  return (
    <section aria-label="Creator level" className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-glow">
      <div aria-hidden className="grid-pattern absolute inset-0 opacity-15" />
      <div aria-hidden className="absolute -right-16 -bottom-20 size-64 rounded-full bg-white/15 blur-2xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Sparkles className="size-4" /> Creator level
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            Level {level.level} — {level.title}
          </div>
          <div className="mt-4 max-w-md">
            <div className="mb-1.5 flex justify-between text-sm tabular-nums">
              <span className="font-medium">
                {fullNumber(xp)} / {level.nextXp ? fullNumber(level.nextXp) : "∞"} XP
              </span>
              {level.nextXp && <span className="text-white/75">{fullNumber(level.nextXp - xp)} XP to Level {level.level + 1}</span>}
            </div>
            <ProgressBar value={levelProgress(xp)} label="XP progress" className="h-2.5 bg-white/25" barClassName="bg-white" gradient={false} />
          </div>
        </div>
        <Link
          href={missionHref}
          className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0 bg-white px-5 text-[15px] text-primary hover:bg-white/90")}
        >
          Continue Today&apos;s Mission <ArrowRight />
        </Link>
      </div>
    </section>
  )
}

export function MissionCard({ mission, done }: { mission: Mission; done: boolean }) {
  return (
    <section aria-labelledby="todays-mission" className={cn(cardClass, "flex flex-col")}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-primary">MISSION #{mission.number}</span>
        <Badge variant="secondary" className="gap-1">
          <Zap className="size-3" /> +{mission.xp} XP
        </Badge>
      </div>
      <h2 id="todays-mission" className="mt-3 text-lg font-semibold tracking-tight">
        {mission.title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{mission.objective}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
          <Target className="size-3" /> {capitalize(mission.difficulty)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
          <Clock className="size-3" /> {mission.minutes} minutes
        </span>
      </div>
      <div className="mt-auto pt-5">
        <Link href={`/missions/${mission.id}`} className={cn(buttonVariants({ size: "lg" }), "h-10 w-full")}>
          {done ? "Practice again" : "Start Mission"} <ArrowRight />
        </Link>
      </div>
    </section>
  )
}

export function LearningCard({ course, progress, nextLessonId, nextLessonTitle }: { course: Course; progress: number; nextLessonId: string; nextLessonTitle: string }) {
  return (
    <section aria-labelledby="continue-learning" className={cn(cardClass, "flex flex-col")}>
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary">
        <BookOpen className="size-3.5" /> CONTINUE LEARNING
      </div>
      <h2 id="continue-learning" className="mt-3 text-lg font-semibold tracking-tight">
        {course.title}
      </h2>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">Next: {nextLessonTitle}</p>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold tabular-nums">{progress}%</span>
        </div>
        <ProgressBar value={progress} label={`${course.title} progress`} />
      </div>
      <div className="mt-auto pt-5">
        <Link href={`/learn/${course.id}/${nextLessonId}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 w-full")}>
          Continue Learning <ArrowRight />
        </Link>
      </div>
    </section>
  )
}

export function StatCard({ icon: Icon, label, value, suffix, tone }: { icon: LucideIcon; label: string; value: number; suffix?: string; tone: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn(cardClass, "p-4")}>
      <div className={cn("mb-3 grid size-9 place-items-center rounded-xl", tone)}>
        <Icon className="size-[18px]" />
      </div>
      <div className="text-2xl font-semibold tracking-tight tabular-nums">
        {fullNumber(value)}
        {suffix && <span className="ml-1 text-sm font-medium text-muted-foreground">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function StreakCard({ streak, activeDates }: { streak: number; activeDates: string[] }) {
  const { week, todayIndex } = currentWeek(activeDates)
  return (
    <section aria-labelledby="streak-title" className={cardClass}>
      <div className="flex items-center justify-between">
        <h2 id="streak-title" className="font-semibold">
          Weekly streak
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
          <Flame className="size-4" /> {streak} days
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Practice days this week">
        {DAYS.map((d, i) => {
          const done = week[i]
          const today = i === todayIndex
          return (
            <li key={d} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl text-xs font-semibold transition-colors",
                  done ? "bg-brand-gradient text-white" : today ? "border-2 border-dashed border-primary/50 text-primary" : "bg-muted text-muted-foreground"
                )}
                aria-label={`${d}: ${done ? "practiced" : today ? "today, not yet practiced" : "no practice"}`}
              >
                {done ? <Flame className="size-4" /> : d[0]}
              </span>
              <span className={cn("text-[11px]", today ? "font-semibold text-foreground" : "text-muted-foreground")}>{d}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        {week[todayIndex] ? "You practiced today. Streak secured 🔥" : "Complete one lesson or mission today to keep your streak."}
      </p>
    </section>
  )
}
