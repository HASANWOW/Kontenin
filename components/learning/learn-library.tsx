"use client"

import { BookOpen, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COURSE_CATEGORIES, COURSES } from "@/lib/data/courses"
import { courseProgress } from "@/lib/selectors"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { CategoryIcon } from "./course-cover"
import { CourseCard } from "./course-card"

type Level = "all" | "beginner" | "intermediate" | "advanced"

const LEVELS = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const

export function LearnLibrary() {
  const completed = useAppStore((s) => s.completedLessons)
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<Level>("all")
  const [category, setCategory] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSES.filter(
      (c) =>
        (level === "all" || c.difficulty === level) &&
        (!category || c.category === category) &&
        (!q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.lessons.some((l) => l.title.toLowerCase().includes(q)))
    )
  }, [query, level, category])

  const inProgress = COURSES.filter((c) => {
    const p = courseProgress(c, completed)
    return p > 0 && p < 100
  }).length

  return (
    <div>
      <PageHeader title="Learn" description={`${COURSES.length} courses across 12 skills. ${inProgress ? `${inProgress} in progress.` : "Pick one to start."}`} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses and lessons…" aria-label="Search courses" className="h-10 bg-card pl-9" />
        </div>
        <ChoiceGroup label="Difficulty" hideLabel choices={LEVELS} value={level} onChange={setLevel} />
      </div>

      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
        <button
          type="button"
          aria-pressed={category === null}
          onClick={() => setCategory(null)}
          className={cn(
            "h-9 shrink-0 rounded-xl border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            category === null ? "border-foreground bg-foreground text-background" : "bg-card hover:border-primary/40"
          )}
        >
          All categories
        </button>
        {COURSE_CATEGORIES.map((c) => {
          const active = category === c
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? null : c)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active ? "border-foreground bg-foreground text-background" : "bg-card hover:border-primary/40"
              )}
            >
              <CategoryIcon category={c} className="size-3.5" /> {c}
            </button>
          )
        })}
      </div>

      {results.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={BookOpen}
          title="No courses match your filters"
          description="Try a different keyword or clear the filters."
          action={
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setQuery("")
                setLevel("all")
                setCategory(null)
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((c) => (
            <CourseCard key={c.id} course={c} progress={courseProgress(c, completed)} />
          ))}
        </div>
      )}
    </div>
  )
}
