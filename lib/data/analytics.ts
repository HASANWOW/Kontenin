import { seededRandom } from "@/lib/seed"
import type { ContentPerformance, PlatformId } from "@/types/domain"

/**
 * Demo analytics. Numbers are hand-written or generated from a fixed seed,
 * so they never change between renders. Replace with the `analytics` table
 * once platform integrations exist.
 */

export const CONTENT_PERFORMANCE: ContentPerformance[] = [
  { id: "v1", title: "Kenapa kamu tetap ngantuk walau tidur 8 jam?", platform: "tiktok", publishedAt: "2026-09-29", durationSeconds: 28, views: 61400, likes: 5830, comments: 412, shares: 905, saves: 2210, avgWatchSeconds: 19.6, hookType: "question", format: "Educational tips" },
  { id: "v2", title: "3 aplikasi AI gratis buat mahasiswa", platform: "tiktok", publishedAt: "2026-09-22", durationSeconds: 34, views: 52300, likes: 4210, comments: 268, shares: 1120, saves: 3040, avgWatchSeconds: 22.1, hookType: "list", format: "Educational tips" },
  { id: "v3", title: "Uang bulanan habis tanggal 15? Coba ini", platform: "instagram", publishedAt: "2026-09-25", durationSeconds: 31, views: 35400, likes: 3020, comments: 260, shares: 640, saves: 1480, avgWatchSeconds: 20.3, hookType: "question", format: "Educational tips" },
  { id: "v4", title: "Unpopular opinion: kamu nggak butuh iPad buat kuliah", platform: "tiktok", publishedAt: "2026-09-18", durationSeconds: 26, views: 44700, likes: 3360, comments: 690, shares: 210, saves: 520, avgWatchSeconds: 17.8, hookType: "statement", format: "Opinion" },
  { id: "v5", title: "Room makeover kos cuma 300 ribu", platform: "instagram", publishedAt: "2026-09-15", durationSeconds: 45, views: 38900, likes: 2950, comments: 184, shares: 210, saves: 1260, avgWatchSeconds: 24.5, hookType: "statement", format: "Before–after" },
  { id: "v6", title: "Aku coba bangun jam 5 selama 7 hari", platform: "tiktok", publishedAt: "2026-09-11", durationSeconds: 58, views: 27600, likes: 1890, comments: 205, shares: 96, saves: 410, avgWatchSeconds: 26.4, hookType: "story", format: "Experiment vlog" },
  { id: "v7", title: "Setup meja kerja budget 1 juta", platform: "youtube_shorts", publishedAt: "2026-09-08", durationSeconds: 41, views: 22100, likes: 1340, comments: 97, shares: 88, saves: 690, avgWatchSeconds: 21.7, hookType: "statement", format: "Review" },
  { id: "v8", title: "Shortcut laptop yang jarang dipakai", platform: "youtube_shorts", publishedAt: "2026-09-04", durationSeconds: 33, views: 19300, likes: 1520, comments: 61, shares: 330, saves: 1120, avgWatchSeconds: 21.2, hookType: "list", format: "Educational tips" },
  { id: "v9", title: "Day in my life mahasiswa rantau", platform: "tiktok", publishedAt: "2026-08-30", durationSeconds: 62, views: 15800, likes: 980, comments: 74, shares: 31, saves: 140, avgWatchSeconds: 23.9, hookType: "story", format: "Vlog" },
  { id: "v10", title: "Storytime: hampir telat sidang proposal", platform: "instagram", publishedAt: "2026-08-26", durationSeconds: 74, views: 12400, likes: 810, comments: 96, shares: 22, saves: 95, avgWatchSeconds: 29.1, hookType: "story", format: "Storytime" },
]

export function engagementRate(c: Pick<ContentPerformance, "likes" | "comments" | "shares" | "views">): number {
  return c.views ? (c.likes + c.comments + c.shares) / c.views : 0
}

export const PLATFORM_LABEL: Record<PlatformId, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  youtube_shorts: "YT Shorts",
}

export interface DailyPoint {
  date: string
  label: string
  views: number
  followers: number
  engagement: number
  watchMinutes: number
}

/** 90 days of deterministic daily metrics ending on `end`. */
export function dailySeries(end: Date, days = 90): DailyPoint[] {
  const rand = seededRandom(20261007)
  const out: DailyPoint[] = []
  let followers = 6100
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    const progress = (days - i) / days
    const weekday = d.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.18 : 1
    const spike = rand() > 0.93 ? 2.2 : 1
    const views = Math.round((1800 + progress * 3400) * weekendBoost * spike * (0.8 + rand() * 0.4))
    const gained = Math.round(views * (0.006 + rand() * 0.004))
    followers += gained
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views,
      followers,
      engagement: Math.round((7.4 + progress * 1.8 + (rand() - 0.5) * 2) * 10) / 10,
      watchMinutes: Math.round((views * (18 + rand() * 6)) / 60),
    })
  }
  return out
}

export function platformBreakdown() {
  const map = new Map<PlatformId, { views: number; interactions: number; count: number }>()
  for (const c of CONTENT_PERFORMANCE) {
    const cur = map.get(c.platform) ?? { views: 0, interactions: 0, count: 0 }
    map.set(c.platform, {
      views: cur.views + c.views,
      interactions: cur.interactions + c.likes + c.comments + c.shares,
      count: cur.count + 1,
    })
  }
  return [...map.entries()].map(([platform, v]) => ({
    platform,
    label: PLATFORM_LABEL[platform],
    views: v.views,
    videos: v.count,
    engagement: Math.round((v.interactions / v.views) * 1000) / 10,
  }))
}
