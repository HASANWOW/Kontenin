/**
 * Supabase row types. These mirror `supabase/schema.sql` one-to-one
 * (snake_case, nullable columns as `| null`). The UI works with the
 * camelCase domain types in `types/domain.ts`; mappers live in
 * `lib/supabase/mappers.ts` once the backend is wired up.
 */

export type Uuid = string
export type Timestamp = string

export type Difficulty = "beginner" | "intermediate" | "advanced"
export type Platform = "tiktok" | "instagram" | "youtube" | "youtube_shorts"
export type PlannerStatus = "idea" | "planned" | "draft" | "ready" | "published"
export type PlannerType = "video" | "post" | "story" | "live"
export type AnalysisSource = "ai" | "demo"

export interface UserRow {
  id: Uuid
  email: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  xp: number
  level: number
  streak_days: number
  last_active_at: Timestamp | null
  created_at: Timestamp
}

export interface CreatorProfileRow {
  id: Uuid
  user_id: Uuid
  platforms: string[]
  niche: string
  custom_niche: string | null
  level: Difficulty
  challenge: string
  goal: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CourseRow {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: Difficulty
  duration_minutes: number
  instructor_name: string
  rating: number
  cover_hue: number
  created_at: Timestamp
}

export interface LessonRow {
  id: string
  course_id: string
  position: number
  title: string
  duration_minutes: number
  video_url: string | null
  content: Record<string, unknown>
  created_at: Timestamp
}

export interface LessonProgressRow {
  user_id: Uuid
  lesson_id: string
  completed_at: Timestamp
  quiz_score: number | null
}

export interface MissionRow {
  id: string
  number: number
  title: string
  objective: string
  difficulty: Difficulty
  estimated_minutes: number
  xp_reward: number
  evaluator: string
  content: Record<string, unknown>
  created_at: Timestamp
}

export interface MissionSubmissionRow {
  id: Uuid
  user_id: Uuid
  mission_id: string
  answer: string
  score: number
  feedback: Record<string, unknown>
  source: AnalysisSource
  completed: boolean
  created_at: Timestamp
}

export interface ContentIdeaRow {
  id: Uuid
  user_id: Uuid
  title: string
  hook: string
  angle: string
  format: string
  duration: string
  difficulty: Difficulty
  cta: string
  niche: string
  platform: Platform
  created_at: Timestamp
}

export interface ScriptRow {
  id: Uuid
  user_id: Uuid
  topic: string
  platform: Platform
  sections: Record<string, unknown>
  word_count: number
  estimated_seconds: number
  created_at: Timestamp
}

export interface ContentProjectRow {
  id: Uuid
  user_id: Uuid
  title: string
  idea_id: Uuid | null
  script_id: Uuid | null
  video_id: Uuid | null
  status: PlannerStatus
  created_at: Timestamp
}

export interface VideoRow {
  id: Uuid
  user_id: Uuid
  file_name: string
  source_url: string | null
  storage_path: string | null
  duration_seconds: number | null
  provider: "demo" | "wayinvideo"
  provider_job_id: string | null
  status: "uploaded" | "processing" | "ready" | "failed"
  created_at: Timestamp
}

export interface VideoAnalysisRow {
  id: Uuid
  video_id: Uuid
  overall: number
  scores: Record<string, number>
  feedback: string
  recommendations: string[]
  source: AnalysisSource
  created_at: Timestamp
}

export interface VideoClipRow {
  id: Uuid
  video_id: Uuid
  title: string
  start_seconds: number
  end_seconds: number
  viral_score: number
  platforms: string[]
  saved: boolean
  created_at: Timestamp
}

export interface TranscriptRow {
  id: Uuid
  video_id: Uuid
  segments: { start: number; end: number; text: string }[]
  language: string
  source: AnalysisSource
  created_at: Timestamp
}

export interface PlannerItemRow {
  id: Uuid
  user_id: Uuid
  title: string
  platform: Platform
  type: PlannerType
  status: PlannerStatus
  scheduled_for: string
  notes: string | null
  color: string
  created_at: Timestamp
}

export interface AnalyticsRow {
  id: Uuid
  user_id: Uuid
  content_id: Uuid | null
  date: string
  platform: Platform
  views: number
  likes: number
  comments: number
  shares: number
  followers_gained: number
  avg_watch_seconds: number
}

export interface AchievementRow {
  id: string
  title: string
  description: string
  icon: string
  xp_reward: number
}

export interface UserAchievementRow {
  user_id: Uuid
  achievement_id: string
  unlocked_at: Timestamp
}

export interface NotificationRow {
  id: Uuid
  user_id: Uuid
  title: string
  body: string
  href: string | null
  read: boolean
  created_at: Timestamp
}

/** Shape expected by `createClient<Database>()` from @supabase/supabase-js. */
export interface Database {
  public: {
    Tables: {
      users: TableDef<UserRow>
      creator_profiles: TableDef<CreatorProfileRow>
      courses: TableDef<CourseRow>
      lessons: TableDef<LessonRow>
      lesson_progress: TableDef<LessonProgressRow>
      missions: TableDef<MissionRow>
      mission_submissions: TableDef<MissionSubmissionRow>
      content_ideas: TableDef<ContentIdeaRow>
      scripts: TableDef<ScriptRow>
      content_projects: TableDef<ContentProjectRow>
      videos: TableDef<VideoRow>
      video_analysis: TableDef<VideoAnalysisRow>
      video_clips: TableDef<VideoClipRow>
      transcripts: TableDef<TranscriptRow>
      planner_items: TableDef<PlannerItemRow>
      analytics: TableDef<AnalyticsRow>
      achievements: TableDef<AchievementRow>
      user_achievements: TableDef<UserAchievementRow>
      notifications: TableDef<NotificationRow>
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

interface TableDef<Row> {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}
