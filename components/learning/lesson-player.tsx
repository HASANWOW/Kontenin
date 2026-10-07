"use client"

import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Lightbulb, Lock, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { celebrate } from "@/lib/celebrate"
import { getLesson, lessonKey } from "@/lib/data/courses"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { LessonList, lessonStates } from "./lesson-list"
import { LessonQuiz } from "./lesson-quiz"

export function LessonPlayer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const found = getLesson(courseId, lessonId)!
  const { course, lesson, index, prev, next } = found
  const completed = useAppStore((s) => s.completedLessons)
  const completeLesson = useAppStore((s) => s.completeLesson)
  const [quizDone, setQuizDone] = useState(false)
  const [videoNotice, setVideoNotice] = useState(false)

  const isDone = completed.includes(lessonKey(course.id, lesson.id))
  const state = lessonStates(course, completed)[index]

  if (state === "locked") {
    const current = course.lessons[lessonStates(course, completed).indexOf("current")]
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">This lesson is locked</h1>
        <p className="mt-2 text-muted-foreground">Lessons unlock in order. Finish “{current?.title}” first.</p>
        {current && (
          <Link href={`/learn/${course.id}/${current.id}`} className={cn(buttonVariants({ size: "lg" }), "mt-6 h-10")}>
            Go to current lesson <ArrowRight />
          </Link>
        )}
      </div>
    )
  }

  function complete() {
    const result = completeLesson(course.id, lesson.id)
    celebrate(result, "Lesson complete")
  }

  return (
    <div>
      <PageHeader back={{ href: `/learn/${course.id}`, label: course.title }} eyebrow={`Lesson ${index + 1} of ${course.lessons.length}`} title={lesson.title} description={lesson.summary} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-950 shadow-soft">
            <div
              aria-hidden
              className="absolute inset-0 opacity-80"
              style={{ background: `radial-gradient(80% 80% at 20% 20%, hsl(${course.hue} 80% 45% / 0.7), transparent), radial-gradient(70% 70% at 90% 90%, hsl(${(course.hue + 50) % 360} 80% 50% / 0.5), transparent)` }}
            />
            <div className="relative flex h-full flex-col items-center justify-center p-6 text-center text-white">
              <button
                type="button"
                onClick={() => setVideoNotice(true)}
                className="grid size-16 place-items-center rounded-full bg-white/95 text-zinc-900 shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/50"
                aria-label="Play lesson video"
              >
                <Play className="ml-1 size-7 fill-current" />
              </button>
              <p className="mt-4 text-lg font-semibold">{lesson.title}</p>
              <p className="text-sm text-white/70">{lesson.minutes} min lesson</p>
              {videoNotice && (
                <p role="status" className="mt-4 max-w-sm rounded-lg bg-white/15 px-3 py-2 text-sm backdrop-blur">
                  Demo: lesson videos aren&apos;t recorded yet. The full lesson is in the transcript below.
                </p>
              )}
            </div>
          </div>

          <Tabs defaultValue="transcript" className="rounded-2xl border bg-card p-5 shadow-soft">
            <TabsList>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="takeaways">Key takeaways</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript" className="mt-4 space-y-4 text-[15px] leading-relaxed">
              {lesson.transcript.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </TabsContent>
            <TabsContent value="takeaways" className="mt-4">
              <ul className="space-y-3">
                {lesson.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px]">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="examples" className="mt-4 space-y-4">
              {lesson.examples.map((ex) => (
                <div key={ex.label} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">{ex.label}</p>
                  {ex.weak && (
                    <div className="mt-3 rounded-lg bg-destructive/5 p-3 text-sm">
                      <span className="text-xs font-semibold text-destructive">WEAK</span>
                      <p className="mt-1 whitespace-pre-line">{ex.weak}</p>
                    </div>
                  )}
                  <div className="mt-2 rounded-lg bg-success/10 p-3 text-sm">
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">STRONG</span>
                    <p className="mt-1 whitespace-pre-line">{ex.strong}</p>
                  </div>
                  <p className="mt-3 flex gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" /> {ex.note}
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <section aria-labelledby="quiz-title" className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 id="quiz-title" className="font-semibold">
              Mini quiz
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Check your understanding before moving on.</p>
            <div className="mt-4">
              <LessonQuiz questions={lesson.quiz} onAllAnswered={() => setQuizDone(true)} />
            </div>
          </section>

          <section aria-labelledby="practice-title" className="rounded-2xl border border-primary/25 bg-secondary/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ClipboardCheck className="size-4" /> Practice task
            </div>
            <p id="practice-title" className="mt-2 text-[15px]">
              {lesson.practice}
            </p>
            <Link href="/missions" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Get AI feedback in Missions <ArrowRight className="size-3.5" />
            </Link>
          </section>

          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            {isDone ? (
              <p className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="size-5" /> Lesson completed
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{quizDone ? "Quiz done — mark this lesson complete." : "Answer the quiz to complete this lesson."}</p>
            )}
            <div className="flex gap-2">
              {!isDone && (
                <Button size="lg" className="h-10 bg-brand-gradient px-4 shadow-glow" disabled={!quizDone} onClick={complete}>
                  <Sparkles /> Complete lesson · +30 XP
                </Button>
              )}
              {next && (isDone || state === "available") && (
                <Link href={`/learn/${course.id}/${next.id}`} className={cn(buttonVariants({ variant: isDone ? "default" : "outline", size: "lg" }), "h-10")}>
                  Next lesson <ArrowRight />
                </Link>
              )}
            </div>
          </div>

          <nav aria-label="Lesson navigation" className="flex justify-between gap-3 text-sm">
            {prev ? (
              <Link href={`/learn/${course.id}/${prev.id}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && isDone && (
              <Link href={`/learn/${course.id}/${next.id}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                {next.title} <ArrowRight className="size-4" />
              </Link>
            )}
          </nav>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <h2 className="mb-3 text-sm font-semibold">Course lessons</h2>
          <LessonList course={course} completed={completed} activeLessonId={lesson.id} />
        </aside>
      </div>
    </div>
  )
}
