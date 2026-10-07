import type { Achievement } from "@/types/domain"

export interface LevelInfo {
  level: number
  title: string
  minXp: number
  nextXp: number | null
}

const LEVELS = [
  { title: "New Creator", minXp: 0 },
  { title: "Explorer", minXp: 1000 },
  { title: "Rising Creator", minXp: 2000 },
  { title: "Consistent Creator", minXp: 3000 },
  { title: "Skilled Creator", minXp: 4500 },
  { title: "Pro Creator", minXp: 6500 },
  { title: "Creator Mentor", minXp: 9000 },
] as const

export function levelFor(xp: number): LevelInfo {
  let index = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].minXp) index = i
  return {
    level: index + 1,
    title: LEVELS[index].title,
    minXp: LEVELS[index].minXp,
    nextXp: LEVELS[index + 1]?.minXp ?? null,
  }
}

export function levelProgress(xp: number): number {
  const info = levelFor(xp)
  if (info.nextXp === null) return 100
  return Math.round(((xp - info.minXp) / (info.nextXp - info.minXp)) * 100)
}

export const ALL_LEVELS = LEVELS.map((l, i) => ({ level: i + 1, ...l }))

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lesson", title: "First Lesson", description: "Complete your first lesson.", icon: "BookOpen", xp: 50 },
  { id: "first-mission", title: "First Mission", description: "Complete your first practice mission.", icon: "Target", xp: 50 },
  { id: "streak-7", title: "7 Day Streak", description: "Practice 7 days in a row.", icon: "Flame", xp: 150 },
  { id: "first-video", title: "First Video", description: "Analyze your first video in AI Studio.", icon: "Video", xp: 100 },
  { id: "views-1000", title: "1000 Views", description: "Reach 1,000 total views on a single video.", icon: "Eye", xp: 100 },
  { id: "rising-creator", title: "Rising Creator", description: "Reach Level 3.", icon: "TrendingUp", xp: 200 },
  { id: "consistent-creator", title: "Consistent Creator", description: "Reach Level 4 by practicing regularly.", icon: "CalendarCheck", xp: 300 },
  { id: "hook-master", title: "Hook Master", description: "Score 85+ on a hook mission.", icon: "Zap", xp: 150 },
  { id: "course-graduate", title: "Course Graduate", description: "Finish every lesson in a course.", icon: "GraduationCap", xp: 250 },
]
