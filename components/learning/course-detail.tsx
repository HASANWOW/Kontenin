"use client"

import { ArrowRight, CheckCircle2, Clock, PlayCircle, Star, Target } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { ProgressBar } from "@/components/shared/progress-bar"
import { buttonVariants } from "@/components/ui/button"
import { courseMinutes, formatMinutes, getCourse } from "@/lib/data/courses"
import { fullNumber } from "@/lib/format"
import { courseProgress, nextLesson } from "@/lib/selectors"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { CourseCover } from "./course-cover"
import { DifficultyPill } from "./course-card"
import { LessonList } from "./lesson-list"

export function CourseDetail({ courseId }: { courseId: string }) {
  const course = getCourse(courseId)!
  const completed = useAppStore((s) => s.completedLessons)
  const progress = courseProgress(course, completed)
  const next = nextLesson(course, completed)
  const done = course.lessons.filter((l) => completed.includes(`${course.id}/${l.id}`)).length

  return (
    <div>
      <PageHeader back={{ href: "/learn", label: "All courses" }} title={course.title} eyebrow={course.category} description={course.description} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <CourseCover hue={course.hue} category={course.category} size="lg" className="h-44" />
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <DifficultyPill level={course.difficulty} />
                <span className="inline-flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> {course.rating} ({fullNumber(course.reviews)} reviews)
                </span>
                <span className="inline-flex items-center gap-1">
                  <PlayCircle className="size-4" /> {course.lessons.length} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4" /> {formatMinutes(courseMinutes(course))}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {course.instructor.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <div className="text-sm">
                  <div className="font-medium">{course.instructor.name}</div>
                  <div className="text-muted-foreground">{course.instructor.role}</div>
                </div>
              </div>
            </div>
          </div>

          <section aria-labelledby="overview" className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 id="overview" className="font-semibold">
              Course overview
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{course.overview}</p>
            <h3 className="mt-5 text-sm font-semibold">What you&apos;ll be able to do</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {o}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="lessons">
            <h2 id="lessons" className="mb-3 font-semibold">
              Lessons
            </h2>
            <LessonList course={course} completed={completed} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Your progress</span>
              <span className="text-2xl font-semibold tabular-nums">{progress}%</span>
            </div>
            <ProgressBar value={progress} label="Course progress" className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {done} of {course.lessons.length} lessons completed · +30 XP per lesson
            </p>
            <Link href={`/learn/${course.id}/${next.id}`} className={cn(buttonVariants({ size: "lg" }), "mt-5 h-11 w-full bg-brand-gradient shadow-glow")}>
              {progress === 0 ? "Start course" : progress === 100 ? "Review course" : "Continue learning"} <ArrowRight />
            </Link>
            {progress < 100 && <p className="mt-3 text-center text-xs text-muted-foreground">Next: {next.title}</p>}
          </div>
          <Link
            href="/missions"
            className="mt-4 flex items-center gap-3 rounded-2xl border bg-secondary/50 p-4 text-sm transition-colors hover:bg-secondary"
          >
            <Target className="size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">Practice what you learn</span>
              <span className="text-muted-foreground">Every lesson pairs with a mission.</span>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  )
}
