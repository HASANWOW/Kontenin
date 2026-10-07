import type { ActivityItem, AppNotification, CreatorProfile, PlannerItem } from "@/types/domain"
import type { AppData } from "./types"

function isoDaysFromNow(days: number, hour = 9): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function dateOnly(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString()
}

const DEMO_PROFILE: CreatorProfile = {
  platforms: ["TikTok", "Instagram Reels"],
  niche: "Lifestyle / Tech",
  level: "beginner",
  challenge: "Finding ideas",
  goal: "Build personal brand",
}

const DEMO_PLANNER = (): PlannerItem[] => [
  { id: "p1", title: "3 aplikasi AI gratis buat tugas kuliah", platform: "tiktok", type: "video", status: "ready", date: dateOnly(1), notes: "Pakai hook pertanyaan. Rekam screen di laptop." },
  { id: "p2", title: "Room tour kos 3x4 meter", platform: "instagram", type: "video", status: "draft", date: dateOnly(3) },
  { id: "p3", title: "Polling: tim belajar pagi atau malam?", platform: "instagram", type: "story", status: "planned", date: dateOnly(2) },
  { id: "p4", title: "Q&A live: mulai ngonten dari nol", platform: "tiktok", type: "live", status: "planned", date: dateOnly(6) },
  { id: "p5", title: "Setup meja budget part 2", platform: "youtube_shorts", type: "video", status: "idea", date: dateOnly(9) },
  { id: "p6", title: "Carousel: 5 shortcut laptop", platform: "instagram", type: "post", status: "idea", date: dateOnly(11) },
  { id: "p7", title: "Kenapa kamu tetap ngantuk walau tidur 8 jam?", platform: "tiktok", type: "video", status: "published", date: dateOnly(-8) },
  { id: "p8", title: "Uang bulanan habis tanggal 15? Coba ini", platform: "instagram", type: "video", status: "published", date: dateOnly(-12) },
  { id: "p9", title: "Weekly reset Minggu malam", platform: "tiktok", type: "video", status: "draft", date: dateOnly(5) },
]

const DEMO_ACTIVITY = (): ActivityItem[] => [
  { id: "a1", kind: "mission", title: "Completed “Write a CTA-Driven Script”", xp: 140, at: hoursAgo(20) },
  { id: "a2", kind: "ai", title: "Got AI feedback on a 30-second script", at: hoursAgo(22) },
  { id: "a3", kind: "lesson", title: "Finished “Writing a Good Hook”", xp: 30, at: hoursAgo(44) },
  { id: "a4", kind: "content", title: "Saved 3 content ideas to Planner", at: hoursAgo(50) },
  { id: "a5", kind: "badge", title: "Unlocked “7 Day Streak”", xp: 150, at: hoursAgo(70) },
]

const DEMO_NOTIFICATIONS = (): AppNotification[] => [
  { id: "n1", title: "Today's mission is ready", body: "Write 3 Hooks for Your Next Video — 10 minutes, +100 XP.", href: "/missions/3-hooks-next-video", read: false, at: hoursAgo(1) },
  { id: "n2", title: "Keep your 7-day streak", body: "Complete one lesson or mission today to reach 8 days.", href: "/missions", read: false, at: hoursAgo(3) },
  { id: "n3", title: "New lesson unlocked", body: "“Storytelling” is now available in Content Creation 101.", href: "/learn/content-creation-101/storytelling", read: true, at: hoursAgo(30) },
  { id: "n4", title: "Weekly insight", body: "Your question-based hooks earn 25% more engagement. See Analytics.", href: "/analytics", read: true, at: hoursAgo(52) },
]

const C101 = "content-creation-101"

export function demoData(userId: string, name: string, email: string): AppData {
  return {
    userId,
    onboarded: true,
    profile: {
      name,
      email,
      username: "hasancreator",
      bio: "Mahasiswa yang lagi belajar ngonten dari nol. Bahas tech, produktivitas, dan kehidupan kos 🎧",
    },
    creatorProfile: DEMO_PROFILE,
    xp: 2450,
    streak: 7,
    lastActiveDate: dateOnly(-1),
    activeDates: [-7, -6, -5, -4, -3, -2, -1].map((d) => dateOnly(d)),
    stats: { contentCreated: 12, missionCompletions: 28, aiFeedback: 17 },
    completedLessons: [
      `${C101}/what-is-content-creation`,
      `${C101}/finding-your-niche`,
      `${C101}/understanding-your-audience`,
      `${C101}/creating-content-ideas`,
      `${C101}/writing-a-good-hook`,
      `${C101}/storytelling`,
      `${C101}/script-writing`,
      "hook-lab/five-patterns",
      "niche-finder/interest-map",
      "niche-finder/validate-niche",
    ],
    completedMissionIds: [
      "find-your-niche",
      "write-5-hooks",
      "30-second-script",
      "talking-head",
      "rewrite-weak-hook",
      "analyze-own-video",
      "comment-to-hook",
      "story-hook",
      "myth-busting-hook",
      "rewrite-boring-opening",
      "cta-script",
    ],
    missionResults: {},
    achievements: {
      "first-lesson": isoDaysFromNow(-40),
      "first-mission": isoDaysFromNow(-39),
      "streak-7": hoursAgo(70),
      "first-video": isoDaysFromNow(-20),
      "views-1000": isoDaysFromNow(-25),
      "rising-creator": isoDaysFromNow(-9),
    },
    savedIdeas: [],
    savedHooks: [],
    savedScripts: [],
    savedQuotes: [],
    savedClipIds: [],
    planner: DEMO_PLANNER(),
    notifications: DEMO_NOTIFICATIONS(),
    activity: DEMO_ACTIVITY(),
    settings: defaultSettings(),
  }
}

export function freshData(userId: string, name: string, email: string): AppData {
  return {
    userId,
    onboarded: false,
    profile: { name, email, username: name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) || "creator", bio: "" },
    creatorProfile: null,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    activeDates: [],
    stats: { contentCreated: 0, missionCompletions: 0, aiFeedback: 0 },
    completedLessons: [],
    completedMissionIds: [],
    missionResults: {},
    achievements: {},
    savedIdeas: [],
    savedHooks: [],
    savedScripts: [],
    savedQuotes: [],
    savedClipIds: [],
    planner: [],
    notifications: [
      {
        id: "welcome",
        title: "Welcome to Kontenin 👋",
        body: "Start with Mission #1 — find your content niche in 10 minutes.",
        href: "/missions/find-your-niche",
        read: false,
        at: new Date().toISOString(),
      },
    ],
    activity: [],
    settings: defaultSettings(),
  }
}

export function defaultSettings(): AppData["settings"] {
  return {
    notifications: { dailyMission: true, streakReminder: true, weeklyInsights: true, productUpdates: false },
    ai: { feedbackLanguage: "mixed", feedbackDepth: "detailed", autoSave: true },
    privacy: { privateRecordings: true, shareAnalytics: false },
  }
}
