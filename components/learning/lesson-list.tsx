"use client"

import { CheckCircle2, Lock, PlayCircle } from "lucide-react"
import Link from "next/link"
import { lessonKey } from "@/lib/data/courses"
import { cn } from "@/lib/utils"
import type { Course } from "@/types/domain"

export type LessonState = "completed" | "current" | "locked" | "available"

/** Lessons unlock in order: everything up to the first incomplete lesson is open. */
export function lessonStates(course: Course, completed: string[]): LessonState[] {
  const firstOpen = course.lessons.findIndex((l) => !completed.includes(lessonKey(course.id, l.id)))
  return course.lessons.map((l, i) => {
    if (completed.includes(lessonKey(course.id, l.id))) return "completed"
    if (i === firstOpen) return "current"
    return firstOpen !== -1 && i > firstOpen ? "locked" : "available"
  })
}

export function LessonList({ course, completed, activeLessonId }: { course: Course; completed: string[]; activeLessonId?: string }) {
  const states = lessonStates(course, completed)
  return (
    <ol className="divide-y rounded-2xl border bg-card">
      {course.lessons.map((lesson, i) => {
        const state = states[i]
        const active = lesson.id === activeLessonId
        const content = (
          <>
            <span className="w-6 shrink-0 text-sm font-medium text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm font-medium", state === "locked" && "text-muted-foreground")}>{lesson.title}</span>
              <span className="text-xs text-muted-foreground">{lesson.minutes} min</span>
            </span>
            {state === "completed" && <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Completed" />}
            {state === "current" && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                <PlayCircle className="size-3.5" /> Up next
              </span>
            )}
            {state === "available" && <PlayCircle className="size-5 shrink-0 text-muted-foreground" aria-label="Available" />}
            {state === "locked" && <Lock className="size-4 shrink-0 text-muted-foreground" aria-label="Locked" />}
          </>
        )
        return (
          <li key={lesson.id}>
            {state === "locked" ? (
              <div className="flex items-center gap-3 px-4 py-3.5 opacity-70" aria-disabled>
                {content}
              </div>
            ) : (
              <Link
                href={`/learn/${course.id}/${lesson.id}`}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-3 px-4 py-3.5 transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted", active && "bg-secondary/60")}
              >
                {content}
              </Link>
            )}
          </li>
        )
      })}
    </ol>
  )
}
