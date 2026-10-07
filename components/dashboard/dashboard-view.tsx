"use client"

import { ArrowRight, BookOpen, Bot, CalendarDays, Clapperboard, Flame, Lightbulb, MessageSquareText, PenLine, Sparkles, Target, Trophy, Video, Zap } from "lucide-react"
import Link from "next/link"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { EmptyState } from "@/components/shared/states"
import { greeting, localDate, relativeTime } from "@/lib/format"
import { continueCourse, courseProgress, liveStreak, nextLesson, todaysMission } from "@/lib/selectors"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import type { ActivityItem } from "@/types/domain"
import { cardClass, LearningCard, LevelCard, MissionCard, StatCard, StreakCard } from "./dashboard-cards"

const QUICK_TOOLS = [
  { href: "/create/ideas", label: "Generate Content Idea", description: "10 ideas for your niche", icon: Lightbulb, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { href: "/create/hooks", label: "Generate Hook", description: "Scored, scroll-stopping openers", icon: Zap, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { href: "/create/script", label: "Generate Script", description: "Hook → body → value → CTA", icon: PenLine, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { href: "/ai-studio/analyze", label: "Analyze My Content", description: "Score your video", icon: Video, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
]

const ACTIVITY_ICON: Record<ActivityItem["kind"], React.ComponentType<{ className?: string }>> = {
  lesson: BookOpen,
  mission: Target,
  ai: Bot,
  content: Lightbulb,
  badge: Trophy,
}

export function DashboardView() {
  const name = useAppStore((s) => s.profile.name)
  const xp = useAppStore((s) => s.xp)
  const streak = useAppStore((s) => s.streak)
  const lastActiveDate = useAppStore((s) => s.lastActiveDate)
  const activeDates = useAppStore((s) => s.activeDates)
  const stats = useAppStore((s) => s.stats)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const completedMissions = useAppStore((s) => s.completedMissionIds)
  const activity = useAppStore((s) => s.activity)
  const planner = useAppStore((s) => s.planner)
  const creatorProfile = useAppStore((s) => s.creatorProfile)

  const mission = todaysMission(completedMissions, creatorProfile?.challenge)
  const course = continueCourse(completedLessons, creatorProfile?.challenge)
  const lesson = nextLesson(course, completedLessons)
  const streakNow = liveStreak(streak, lastActiveDate)
  const today = localDate()
  const upcoming = planner
    .filter((p) => p.date >= today && p.status !== "published")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
            {greeting()}, {name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Ready to create something today?</p>
        </div>
        {creatorProfile && (
          <p className="text-sm text-muted-foreground">
            Focus: <span className="font-medium text-foreground">{creatorProfile.niche}</span> · {creatorProfile.platforms[0]}
          </p>
        )}
      </header>

      <LevelCard xp={xp} missionHref={`/missions/${mission.id}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={Sparkles} label="Content Created" value={stats.contentCreated} tone="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard icon={Target} label="Missions Completed" value={stats.missionCompletions} tone="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
        <StatCard icon={Bot} label="AI Feedback" value={stats.aiFeedback} tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Flame} label="Current Streak" value={streakNow} suffix="days" tone="bg-orange-500/10 text-orange-600 dark:text-orange-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <MissionCard mission={mission} done={completedMissions.includes(mission.id)} />
        <LearningCard course={course} progress={courseProgress(course, completedLessons)} nextLessonId={lesson.id} nextLessonTitle={lesson.title} />
        <StreakCard streak={streakNow} activeDates={activeDates} />
      </div>

      <section aria-labelledby="quick-tools">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="quick-tools" className="font-semibold">
            Quick AI tools
          </h2>
          <Link href="/create" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            All tools <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", t.tone)}>
                <t.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{t.description}</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <section aria-labelledby="recent-activity" className={cn(cardClass, "lg:col-span-3")}>
          <h2 id="recent-activity" className="font-semibold">
            Recent activity
          </h2>
          {activity.length === 0 ? (
            <EmptyState className="mt-4 py-8" icon={Sparkles} title="No activity yet" description="Complete your first mission to start earning XP." />
          ) : (
            <ul className="mt-3 divide-y">
              {activity.slice(0, 6).map((a) => {
                const Icon = ACTIVITY_ICON[a.kind]
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{a.title}</span>
                      <span className="text-xs text-muted-foreground">{relativeTime(a.at)}</span>
                    </span>
                    {a.xp ? <span className="text-sm font-semibold text-primary tabular-nums">+{a.xp} XP</span> : null}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="upcoming" className={cn(cardClass, "lg:col-span-2")}>
          <div className="flex items-center justify-between">
            <h2 id="upcoming" className="font-semibold">
              Up next in Planner
            </h2>
            <Link href="/planner" className="text-sm font-medium text-primary hover:underline">
              Open
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState
              className="mt-4 py-8"
              icon={CalendarDays}
              title="Nothing scheduled"
              description="Plan your next video so you never wonder what to post."
              action={
                <Link href="/planner" className="text-sm font-medium text-primary hover:underline">
                  Plan content
                </Link>
              }
            />
          ) : (
            <ul className="mt-3 space-y-2">
              {upcoming.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <PlatformBadge platform={p.platform} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {new Date(`${p.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {p.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/ai-studio" className="mt-4 flex items-center gap-3 rounded-xl bg-secondary/70 p-3 text-sm transition-colors hover:bg-secondary">
            <Clapperboard className="size-5 text-primary" />
            <span className="flex-1">
              <span className="block font-medium text-secondary-foreground">Recorded something?</span>
              <span className="text-xs text-muted-foreground">Get a content score in AI Studio</span>
            </span>
            <MessageSquareText className="size-4 text-muted-foreground" />
          </Link>
        </section>
      </div>
    </div>
  )
}
