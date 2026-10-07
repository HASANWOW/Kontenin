import { COURSES, lessonKey } from "@/lib/data/courses"
import { MISSIONS, TODAY_MISSION_ID } from "@/lib/data/missions"
import { CHALLENGE_PLAN } from "@/lib/data/onboarding"
import type { Course, Mission } from "@/types/domain"

/** Derived data shared by several pages. Pure functions over store slices. */

export function courseProgress(course: Course, completed: string[]): number {
  if (!course.lessons.length) return 0
  const done = course.lessons.filter((l) => completed.includes(lessonKey(course.id, l.id))).length
  return Math.round((done / course.lessons.length) * 100)
}

export function nextLesson(course: Course, completed: string[]) {
  return course.lessons.find((l) => !completed.includes(lessonKey(course.id, l.id))) ?? course.lessons[0]
}

/** The course the user is furthest into; otherwise their onboarding plan course; otherwise the flagship. */
export function continueCourse(completed: string[], challenge?: string | null): Course {
  const inProgress = COURSES.map((c) => ({ c, p: courseProgress(c, completed) }))
    .filter((x) => x.p > 0 && x.p < 100)
    .sort((a, b) => b.p - a.p)
  const planned = challenge ? COURSES.find((c) => c.id === CHALLENGE_PLAN[challenge]?.courseId) : undefined
  return inProgress[0]?.c ?? (planned && courseProgress(planned, completed) < 100 ? planned : COURSES[0])
}

/**
 * Today's mission: the first mission from the user's onboarding plan until it's done,
 * then the featured mission, then the next unfinished one.
 */
export function todaysMission(completedIds: string[], challenge?: string | null): Mission {
  const planned = challenge ? MISSIONS.find((m) => m.id === CHALLENGE_PLAN[challenge]?.missionId) : undefined
  if (planned && !completedIds.includes(planned.id)) return planned
  const featured = MISSIONS.find((m) => m.id === TODAY_MISSION_ID)
  if (featured && !completedIds.includes(featured.id)) return featured
  return MISSIONS.find((m) => !completedIds.includes(m.id)) ?? featured ?? MISSIONS[0]
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Mon..Sun practice flags for the current calendar week. */
export function currentWeek(activeDates: string[], now = new Date()) {
  const todayIndex = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - todayIndex)
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return activeDates.includes(ymd(d))
  })
  return { week, todayIndex }
}

/** A streak only counts if the user practiced today or yesterday. */
export function liveStreak(streak: number, lastActiveDate: string | null, now = new Date()): number {
  if (!lastActiveDate) return 0
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return lastActiveDate === ymd(now) || lastActiveDate === ymd(yesterday) ? streak : 0
}
