export const PLATFORM_SELECT = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
  { value: "youtube", label: "YouTube" },
] as const

export const NICHE_SELECT = ["Lifestyle", "Education", "Tech", "Food", "Fashion", "Gaming", "Business", "Comedy", "Travel", "Fitness", "Other"].map((n) => ({ value: n, label: n }))

export const STYLE_SELECT = [
  { value: "educational", label: "Educational" },
  { value: "entertaining", label: "Entertaining" },
  { value: "storytelling", label: "Storytelling" },
  { value: "relatable", label: "Relatable / POV" },
  { value: "aesthetic", label: "Aesthetic / vlog" },
] as const

export const GOAL_SELECT = [
  { value: "Grow followers", label: "Grow followers" },
  { value: "Build personal brand", label: "Build personal brand" },
  { value: "Start creating", label: "Start creating" },
  { value: "Make money", label: "Make money" },
  { value: "Promote business", label: "Promote business" },
] as const

export const TONE_CHOICES = [
  { value: "bold", label: "Bold" },
  { value: "funny", label: "Funny" },
  { value: "educational", label: "Educational" },
  { value: "emotional", label: "Emotional" },
  { value: "curiosity", label: "Curiosity" },
  { value: "storytelling", label: "Storytelling" },
] as const

export const VIDEO_TYPES = [
  { value: "tips", label: "Tips / listicle" },
  { value: "tutorial", label: "Tutorial" },
  { value: "storytelling", label: "Storytime" },
  { value: "review", label: "Review" },
  { value: "educational", label: "Explainer" },
] as const

export const DURATIONS = [
  { value: "15", label: "15s" },
  { value: "30", label: "30s" },
  { value: "60", label: "60s" },
  { value: "90", label: "90s" },
] as const

export const CAPTION_STYLES = [
  { value: "short", label: "Short" },
  { value: "storytelling", label: "Storytelling" },
  { value: "educational", label: "Educational" },
  { value: "funny", label: "Funny" },
  { value: "sales", label: "Sales" },
  { value: "personal_brand", label: "Personal Brand" },
] as const

export function platformLabel(value: string): string {
  return PLATFORM_SELECT.find((p) => p.value === value)?.label ?? value
}
