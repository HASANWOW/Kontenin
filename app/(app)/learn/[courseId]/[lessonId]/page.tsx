import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LessonPlayer } from "@/components/learning/lesson-player"
import { COURSES, getLesson } from "@/lib/data/courses"

export function generateStaticParams() {
  return COURSES.flatMap((c) => c.lessons.map((l) => ({ courseId: c.id, lessonId: l.id })))
}

export async function generateMetadata({ params }: PageProps<"/learn/[courseId]/[lessonId]">): Promise<Metadata> {
  const { courseId, lessonId } = await params
  return { title: getLesson(courseId, lessonId)?.lesson.title ?? "Lesson" }
}

export default async function LessonPage({ params }: PageProps<"/learn/[courseId]/[lessonId]">) {
  const { courseId, lessonId } = await params
  if (!getLesson(courseId, lessonId)) notFound()
  return <LessonPlayer key={`${courseId}/${lessonId}`} courseId={courseId} lessonId={lessonId} />
}
