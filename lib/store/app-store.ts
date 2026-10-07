"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ACHIEVEMENTS, levelFor } from "@/lib/data/gamification"
import { COURSES, lessonKey } from "@/lib/data/courses"
import type { ActivityItem, CreatorProfile, Mission, PlannerItem } from "@/types/domain"
import { demoData, freshData } from "./seed"
import type { AppData, AppSettings, SavedHook, SavedIdea, SavedQuote, SavedScript } from "./types"

export interface RewardResult {
  xpGained: number
  leveledUp: boolean
  level: number
  levelTitle: string
  unlocked: string[]
}

interface AppActions {
  initForUser(user: { id: string; name: string; email: string }): void
  resetDemo(): void
  completeOnboarding(profile: CreatorProfile): void
  completeLesson(courseId: string, lessonId: string): RewardResult | null
  completeMission(mission: Mission, score: number, answer: string, partial: boolean): RewardResult | null
  recordAIUse(title: string, opts?: { createdContent?: boolean }): void
  unlockAchievement(id: string): RewardResult | null
  saveIdea(idea: SavedIdea): void
  removeIdea(id: string): void
  saveHook(hook: SavedHook): void
  removeHook(id: string): void
  saveScript(script: SavedScript): void
  removeScript(id: string): void
  saveQuote(quote: SavedQuote): void
  removeQuote(id: string): void
  toggleClip(id: string): void
  addPlannerItem(item: Omit<PlannerItem, "id">): PlannerItem
  updatePlannerItem(id: string, patch: Partial<PlannerItem>): void
  deletePlannerItem(id: string): void
  markNotificationRead(id: string): void
  markAllNotificationsRead(): void
  updateProfile(patch: Partial<AppData["profile"]>): void
  updateCreatorProfile(patch: Partial<CreatorProfile>): void
  updateSettings<K extends keyof AppSettings>(section: K, patch: Partial<AppSettings[K]>): void
}

export type AppState = AppData & AppActions

const DEMO_EMAIL = "demo@kontenin.id"

function todayString(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const initial = demoData("demo-hasan", "Hasan", DEMO_EMAIL)

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Single place where XP, streak, level-ups and achievements are applied. */
      function reward(amount: number, activity: Omit<ActivityItem, "id" | "at">, extraUnlocks: string[] = []): RewardResult {
        const state = get()
        const before = levelFor(state.xp)
        const today = todayString()
        const yesterday = todayString(new Date(Date.now() - 86_400_000))
        const streak =
          state.lastActiveDate === today ? state.streak : state.lastActiveDate === yesterday ? state.streak + 1 : 1

        const unlocked: string[] = []
        const achievements = { ...state.achievements }
        let xp = state.xp + amount
        const tryUnlock = (id: string) => {
          if (achievements[id]) return
          const a = ACHIEVEMENTS.find((x) => x.id === id)
          if (!a) return
          achievements[id] = new Date().toISOString()
          unlocked.push(id)
          xp += a.xp
        }
        extraUnlocks.forEach(tryUnlock)
        if (streak >= 7) tryUnlock("streak-7")
        if (levelFor(xp).level >= 3) tryUnlock("rising-creator")
        if (levelFor(xp).level >= 4) tryUnlock("consistent-creator")

        const after = levelFor(xp)
        const activeDates = state.activeDates.includes(today) ? state.activeDates : [...state.activeDates, today].slice(-60)
        const now = new Date().toISOString()
        const items: ActivityItem[] = [
          { ...activity, id: newId("act"), at: now, xp: amount },
          ...unlocked.map((id) => ({
            id: newId("act"),
            kind: "badge" as const,
            title: `Unlocked “${ACHIEVEMENTS.find((a) => a.id === id)?.title}”`,
            xp: ACHIEVEMENTS.find((a) => a.id === id)?.xp,
            at: now,
          })),
        ]

        set({
          xp,
          streak,
          lastActiveDate: today,
          activeDates,
          achievements,
          activity: [...items, ...state.activity].slice(0, 30),
        })
        return {
          xpGained: xp - state.xp,
          leveledUp: after.level > before.level,
          level: after.level,
          levelTitle: after.title,
          unlocked,
        }
      }

      return {
        ...initial,

        initForUser(user) {
          if (get().userId === user.id) return
          set(user.email === DEMO_EMAIL ? demoData(user.id, user.name, user.email) : freshData(user.id, user.name, user.email))
        },

        resetDemo() {
          const { userId, profile } = get()
          set(profile.email === DEMO_EMAIL ? demoData(userId, profile.name, profile.email) : freshData(userId, profile.name, profile.email))
        },

        completeOnboarding(creatorProfile) {
          set({ creatorProfile, onboarded: true })
        },

        completeLesson(courseId, lessonId) {
          const key = lessonKey(courseId, lessonId)
          const state = get()
          if (state.completedLessons.includes(key)) return null
          const completedLessons = [...state.completedLessons, key]
          set({ completedLessons })
          const course = COURSES.find((c) => c.id === courseId)
          const extra = ["first-lesson"]
          if (course && course.lessons.every((l) => completedLessons.includes(lessonKey(courseId, l.id)))) extra.push("course-graduate")
          const lesson = course?.lessons.find((l) => l.id === lessonId)
          return reward(30, { kind: "lesson", title: `Finished “${lesson?.title ?? lessonId}”` }, extra)
        },

        completeMission(mission, score, answer, partial) {
          const state = get()
          const firstTime = !state.completedMissionIds.includes(mission.id)
          set({
            missionResults: { ...state.missionResults, [mission.id]: { score, answer, at: new Date().toISOString() } },
            completedMissionIds: firstTime ? [...state.completedMissionIds, mission.id] : state.completedMissionIds,
            stats: { ...state.stats, missionCompletions: state.stats.missionCompletions + 1 },
          })
          // Repeating a mission is encouraged practice, but only the first completion pays full XP.
          const base = firstTime ? mission.xp : Math.round(mission.xp * 0.2)
          const amount = partial ? Math.round(base / 2) : base
          const extra = ["first-mission"]
          if ((mission.evaluator === "hook" || mission.evaluator === "hooks" || mission.evaluator === "rewrite") && score >= 85) extra.push("hook-master")
          return reward(amount, { kind: "mission", title: `Completed “${mission.title}”` }, extra)
        },

        recordAIUse(title, opts) {
          const state = get()
          set({
            stats: {
              ...state.stats,
              aiFeedback: state.stats.aiFeedback + 1,
              contentCreated: state.stats.contentCreated + (opts?.createdContent ? 1 : 0),
            },
            activity: [{ id: newId("act"), kind: "ai" as const, title, at: new Date().toISOString() }, ...state.activity].slice(0, 30),
          })
        },

        unlockAchievement(id) {
          if (get().achievements[id]) return null
          const a = ACHIEVEMENTS.find((x) => x.id === id)
          if (!a) return null
          return reward(0, { kind: "badge", title: `Progress on “${a.title}”` }, [id])
        },

        saveIdea(idea) {
          set((s) => ({ savedIdeas: [idea, ...s.savedIdeas.filter((i) => i.id !== idea.id)] }))
        },
        removeIdea(id) {
          set((s) => ({ savedIdeas: s.savedIdeas.filter((i) => i.id !== id) }))
        },
        saveHook(hook) {
          set((s) => ({ savedHooks: [hook, ...s.savedHooks.filter((h) => h.id !== hook.id)] }))
        },
        removeHook(id) {
          set((s) => ({ savedHooks: s.savedHooks.filter((h) => h.id !== id) }))
        },
        saveScript(script) {
          set((s) => ({
            savedScripts: [script, ...s.savedScripts.filter((x) => x.id !== script.id)],
            stats: { ...s.stats, contentCreated: s.stats.contentCreated + 1 },
          }))
        },
        removeScript(id) {
          set((s) => ({ savedScripts: s.savedScripts.filter((x) => x.id !== id) }))
        },
        saveQuote(quote) {
          set((s) => ({ savedQuotes: [quote, ...s.savedQuotes.filter((q) => q.id !== quote.id)] }))
        },
        removeQuote(id) {
          set((s) => ({ savedQuotes: s.savedQuotes.filter((q) => q.id !== id) }))
        },
        toggleClip(id) {
          set((s) => ({
            savedClipIds: s.savedClipIds.includes(id) ? s.savedClipIds.filter((c) => c !== id) : [...s.savedClipIds, id],
          }))
        },

        addPlannerItem(item) {
          const created = { ...item, id: newId("plan") }
          set((s) => ({ planner: [...s.planner, created] }))
          return created
        },
        updatePlannerItem(id, patch) {
          set((s) => ({ planner: s.planner.map((p) => (p.id === id ? { ...p, ...patch } : p)) }))
        },
        deletePlannerItem(id) {
          set((s) => ({ planner: s.planner.filter((p) => p.id !== id) }))
        },

        markNotificationRead(id) {
          set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
        },
        markAllNotificationsRead() {
          set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }))
        },

        updateProfile(patch) {
          set((s) => ({ profile: { ...s.profile, ...patch } }))
        },
        updateCreatorProfile(patch) {
          set((s) => (s.creatorProfile ? { creatorProfile: { ...s.creatorProfile, ...patch } } : {}))
        },
        updateSettings(section, patch) {
          set((s) => ({ settings: { ...s.settings, [section]: { ...s.settings[section], ...patch } } }))
        },
      }
    },
    {
      name: "kontenin-app",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually after mount so server and first client render match.
      skipHydration: true,
      partialize: (state) => {
        const data: Partial<AppState> = { ...state }
        for (const key of Object.keys(data) as (keyof AppState)[]) {
          if (typeof data[key] === "function") delete data[key]
        }
        return data
      },
    }
  )
)

/** Tracks whether the persisted store has been loaded and matched to the session user. */
export const useStoreReady = create<{ ready: boolean; setReady: () => void }>((set) => ({
  ready: false,
  setReady: () => set({ ready: true }),
}))
