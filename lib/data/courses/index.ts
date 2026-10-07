import type { Course } from "@/types/domain"
import { CONTENT_101 } from "./content-101"
import { LIBRARY } from "./library"

export const COURSES: Course[] = [CONTENT_101, ...LIBRARY]

export const COURSE_CATEGORIES = [
  "Content Fundamentals",
  "Finding Your Niche",
  "Understanding Audience",
  "Content Ideas",
  "Storytelling",
  "Hook Writing",
  "Script Writing",
  "Camera Basics",
  "Editing Basics",
  "Personal Branding",
  "Analytics",
  "Monetization",
] as const

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id)
}

export function getLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId)
  if (!course) return undefined
  const index = course.lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return undefined
  return {
    course,
    lesson: course.lessons[index],
    index,
    prev: course.lessons[index - 1],
    next: course.lessons[index + 1],
  }
}

export function courseMinutes(course: Course): number {
  return course.lessons.reduce((sum, l) => sum + l.minutes, 0)
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

/** Lesson keys are "courseId/lessonId" so progress is unique across courses. */
export function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}/${lessonId}`
}
