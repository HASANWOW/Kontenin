import type { Difficulty } from "@/types/domain"

export const PLATFORM_CHOICES = [
  { value: "TikTok", label: "TikTok" },
  { value: "Instagram Reels", label: "Instagram Reels" },
  { value: "YouTube", label: "YouTube" },
  { value: "YouTube Shorts", label: "YouTube Shorts" },
  { value: "Personal Brand", label: "Personal Brand" },
  { value: "Business Content", label: "Business Content" },
  { value: "Educational Content", label: "Educational Content" },
] as const

export const NICHE_CHOICES = ["Lifestyle", "Education", "Tech", "Food", "Fashion", "Gaming", "Business", "Comedy", "Travel", "Fitness", "Other"].map((n) => ({
  value: n,
  label: n,
}))

export const LEVEL_CHOICES: { value: Difficulty; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "I haven't posted much yet, or I'm just starting." },
  { value: "intermediate", label: "Intermediate", description: "I post sometimes, but results are inconsistent." },
  { value: "advanced", label: "Advanced", description: "I post regularly and want to grow faster." },
]

export const CHALLENGE_CHOICES = [
  { value: "Finding ideas", label: "Finding ideas" },
  { value: "Writing scripts", label: "Writing scripts" },
  { value: "Speaking on camera", label: "Speaking on camera" },
  { value: "Editing", label: "Editing" },
  { value: "Consistency", label: "Consistency" },
  { value: "Getting views", label: "Getting views" },
  { value: "Understanding analytics", label: "Understanding analytics" },
] as const

export const GOAL_CHOICES = [
  { value: "Start creating", label: "Start creating" },
  { value: "Grow followers", label: "Grow followers" },
  { value: "Build personal brand", label: "Build personal brand" },
  { value: "Make money", label: "Make money" },
  { value: "Promote business", label: "Promote business" },
  { value: "Become professional creator", label: "Become professional creator" },
] as const

/** Maps the user's biggest challenge to a first course and mission. */
export const CHALLENGE_PLAN: Record<string, { courseId: string; missionId: string; focus: string }> = {
  "Finding ideas": { courseId: "idea-machine", missionId: "find-your-niche", focus: "Build an idea system so you never start from a blank page." },
  "Writing scripts": { courseId: "script-sprint", missionId: "30-second-script", focus: "Write tight 30-second scripts with a clear structure." },
  "Speaking on camera": { courseId: "phone-camera", missionId: "talking-head", focus: "Get comfortable on camera through short, private practice takes." },
  Editing: { courseId: "edit-for-retention", missionId: "analyze-own-video", focus: "Learn the editing principles that keep viewers watching." },
  Consistency: { courseId: "content-creation-101", missionId: "3-hooks-next-video", focus: "Build a weekly routine with small daily missions." },
  "Getting views": { courseId: "hook-lab", missionId: "write-5-hooks", focus: "Win the first 3 seconds with stronger hooks." },
  "Understanding analytics": { courseId: "analytics-101", missionId: "analyze-own-video", focus: "Read your numbers and turn them into next steps." },
}
