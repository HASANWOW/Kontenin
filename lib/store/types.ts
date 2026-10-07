import type { ContentIdea, GeneratedScript, HookResult } from "@/lib/ai/schemas"
import type { ActivityItem, AppNotification, CreatorProfile, PlannerItem } from "@/types/domain"

export interface SavedIdea extends ContentIdea {
  savedAt: string
  niche: string
  platform: string
}

export interface SavedHook extends HookResult {
  savedAt: string
  topic: string
}

export interface SavedScript extends GeneratedScript {
  id: string
  savedAt: string
  platform: string
}

export interface SavedQuote {
  id: string
  start: number
  text: string
}

export interface MissionResult {
  score: number
  answer: string
  at: string
}

export interface AppSettings {
  notifications: { dailyMission: boolean; streakReminder: boolean; weeklyInsights: boolean; productUpdates: boolean }
  ai: { feedbackLanguage: "english" | "indonesian" | "mixed"; feedbackDepth: "quick" | "detailed"; autoSave: boolean }
  privacy: { privateRecordings: boolean; shareAnalytics: boolean }
}

export interface AppData {
  userId: string
  onboarded: boolean
  profile: { name: string; email: string; username: string; bio: string }
  creatorProfile: CreatorProfile | null
  xp: number
  streak: number
  /** yyyy-mm-dd of the last day the user earned XP. */
  lastActiveDate: string | null
  /** yyyy-mm-dd days with practice, most recent last (capped at 60). */
  activeDates: string[]
  stats: { contentCreated: number; missionCompletions: number; aiFeedback: number }
  completedLessons: string[]
  completedMissionIds: string[]
  missionResults: Record<string, MissionResult>
  /** achievementId → unlocked ISO date */
  achievements: Record<string, string>
  savedIdeas: SavedIdea[]
  savedHooks: SavedHook[]
  savedScripts: SavedScript[]
  savedQuotes: SavedQuote[]
  savedClipIds: string[]
  planner: PlannerItem[]
  notifications: AppNotification[]
  activity: ActivityItem[]
  settings: AppSettings
}
