"use client"

import { CheckCircle2, Clock, Flame, Target, Zap } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { DifficultyPill } from "@/components/learning/course-card"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressBar } from "@/components/shared/progress-bar"
import { EmptyState } from "@/components/shared/states"
import { MISSIONS } from "@/lib/data/missions"
import { todaysMission } from "@/lib/selectors"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import type { Mission } from "@/types/domain"

type Filter = "all" | "todo" | "done"
const FILTERS = [
  { value: "all", label: "All" },
  { value: "todo", label: "Not started" },
  { value: "done", label: "Completed" },
] as const

export function MissionsBoard() {
  const completed = useAppStore((s) => s.completedMissionIds)
  const results = useAppStore((s) => s.missionResults)
  const challenge = useAppStore((s) => s.creatorProfile?.challenge)
  const [filter, setFilter] = useState<Filter>("all")
  const today = todaysMission(completed, challenge)

  const list = useMemo(
    () => MISSIONS.filter((m) => (filter === "all" ? true : filter === "done" ? completed.includes(m.id) : !completed.includes(m.id))),
    [filter, completed]
  )
  const pct = Math.round((completed.length / MISSIONS.length) * 100)

  return (
    <div>
      <PageHeader title="Missions" description="Practical, bite-sized challenges. Write, record, get AI feedback, and earn XP." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href={`/missions/${today.id}`}
          className="group relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white shadow-glow outline-none focus-visible:ring-4 focus-visible:ring-ring/50 lg:col-span-2"
        >
          <div aria-hidden className="grid-pattern absolute inset-0 opacity-15" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
              <Flame className="size-3.5" /> TODAY&apos;S MISSION · #{today.number}
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">{today.title}</h2>
            <p className="mt-1 max-w-lg text-sm text-white/85">{today.objective}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" /> {today.minutes} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="size-4" /> +{today.xp} XP
              </span>
              <span className="ml-auto rounded-lg bg-white px-3 py-1.5 font-medium text-primary transition-transform group-hover:translate-x-0.5">Start Mission →</span>
            </div>
          </div>
        </Link>
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="size-4 text-primary" /> Mission progress
          </div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">
            {completed.length}
            <span className="text-base font-medium text-muted-foreground"> / {MISSIONS.length}</span>
          </div>
          <ProgressBar value={pct} label="Missions completed" className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">Repeat any mission for extra practice (+20% XP).</p>
        </div>
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="font-semibold">All missions</h2>
        <ChoiceGroup label="Filter missions" hideLabel choices={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Target} title={filter === "done" ? "No completed missions yet" : "You've completed every mission 🎉"} description={filter === "done" ? "Start with today's mission — it takes about 10 minutes." : "Repeat a mission to keep your skills sharp."} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <MissionTile key={m.id} mission={m} done={completed.includes(m.id)} best={results[m.id]?.score} featured={m.id === today.id} />
          ))}
        </div>
      )}
    </div>
  )
}

function MissionTile({ mission, done, best, featured }: { mission: Mission; done: boolean; best?: number; featured: boolean }) {
  return (
    <Link
      href={`/missions/${mission.id}`}
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-4 shadow-soft transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50",
        featured && "border-primary/50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground">
          MISSION #{mission.number} · {mission.category.toUpperCase()}
        </span>
        {done ? <CheckCircle2 className="size-5 text-success" aria-label="Completed" /> : <span className="text-xs font-semibold text-primary">+{mission.xp} XP</span>}
      </div>
      <h3 className="mt-2 font-semibold group-hover:text-primary">{mission.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{mission.objective}</p>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
        <DifficultyPill level={mission.difficulty} />
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {mission.minutes} min
        </span>
        {mission.optionalRecording && <span className="rounded-full bg-muted px-2 py-0.5">Optional recording</span>}
        {best !== undefined && <span className="ml-auto font-medium text-foreground">Best: {best}</span>}
      </div>
    </Link>
  )
}
