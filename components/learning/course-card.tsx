import { Clock, PlayCircle, Star } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "@/components/shared/progress-bar"
import { courseMinutes, formatMinutes } from "@/lib/data/courses"
import { capitalize } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Course } from "@/types/domain"
import { CourseCover } from "./course-cover"

export const DIFFICULTY_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  advanced: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
}

export function DifficultyPill({ level, className }: { level: string; className?: string }) {
  return <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium", DIFFICULTY_STYLE[level], className)}>{capitalize(level)}</span>
}

export function CourseCard({ course, progress }: { course: Course; progress: number }) {
  return (
    <Link
      href={`/learn/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <CourseCover hue={course.hue} category={course.category} className="h-32" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-muted-foreground">{course.category}</span>
          <DifficultyPill level={course.difficulty} />
        </div>
        <h3 className="mt-2 font-semibold tracking-tight group-hover:text-primary">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="size-3.5" /> {course.lessons.length} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {formatMinutes(courseMinutes(course))}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> {course.rating}
          </span>
        </div>
        <div className="mt-auto pt-4">
          {progress > 0 ? (
            <>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">{progress === 100 ? "Completed" : "In progress"}</span>
                <span className="font-semibold tabular-nums">{progress}% complete</span>
              </div>
              <ProgressBar value={progress} label={`${course.title} progress`} className="h-1.5" />
            </>
          ) : (
            <span className="text-xs font-medium text-primary">Start course →</span>
          )}
        </div>
      </div>
    </Link>
  )
}
