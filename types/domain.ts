import type { Difficulty, PlannerStatus, PlannerType } from "./database"

export type { Difficulty, PlannerStatus, PlannerType }

export type PlatformId = "tiktok" | "instagram" | "youtube" | "youtube_shorts"

/* ---------- Users & profile ---------- */

export interface SessionUser {
  id: string
  email: string
  name: string
}

export interface CreatorProfile {
  platforms: string[]
  niche: string
  level: Difficulty
  challenge: string
  goal: string
}

/* ---------- Learning ---------- */

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface LessonExample {
  label: string
  weak?: string
  strong: string
  note: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  summary: string
  transcript: string[]
  takeaways: string[]
  examples: LessonExample[]
  quiz: QuizQuestion[]
  practice: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: Difficulty
  instructor: { name: string; role: string }
  rating: number
  reviews: number
  /** Hue used to tint the generated course cover. */
  hue: number
  overview: string
  outcomes: string[]
  lessons: Lesson[]
}

/* ---------- Missions ---------- */

export type MissionEvaluator = "hook" | "hooks" | "script" | "niche" | "rewrite" | "reflection"

export interface Mission {
  id: string
  number: number
  title: string
  objective: string
  whyItMatters: string
  instructions: string[]
  example: { label: string; weak?: string; strong: string }
  task: string
  placeholder: string
  evaluator: MissionEvaluator
  difficulty: Difficulty
  minutes: number
  xp: number
  category: string
  /** Mission requires a recording; text reflection is accepted instead. */
  optionalRecording?: boolean
  minItems?: number
}

/* ---------- Planner ---------- */

export interface PlannerItem {
  id: string
  title: string
  platform: PlatformId
  type: PlannerType
  status: PlannerStatus
  /** yyyy-mm-dd */
  date: string
  notes?: string
}

/* ---------- Analytics ---------- */

export interface ContentPerformance {
  id: string
  title: string
  platform: PlatformId
  publishedAt: string
  durationSeconds: number
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  avgWatchSeconds: number
  hookType: "question" | "statement" | "story" | "list"
  format: string
}

/* ---------- Gamification ---------- */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xp: number
}

export interface ActivityItem {
  id: string
  kind: "lesson" | "mission" | "ai" | "content" | "badge"
  title: string
  xp?: number
  at: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  href?: string
  read: boolean
  at: string
}
