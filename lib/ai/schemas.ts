import { z } from "zod"

/**
 * Output schemas for every AI capability. Real providers must return JSON that
 * validates against these; the mock service builds the same shapes directly.
 */

const difficulty = z.enum(["beginner", "intermediate", "advanced"])

export const contentIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  hook: z.string(),
  angle: z.string(),
  format: z.string(),
  duration: z.string(),
  difficulty,
  cta: z.string(),
})
export const contentIdeasSchema = z.object({ ideas: z.array(contentIdeaSchema).min(1) })

export const hookResultSchema = z.object({
  id: z.string(),
  text: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
  improvement: z.string(),
})
export const hooksSchema = z.object({ hooks: z.array(hookResultSchema).min(1) })

export const hookAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  problems: z.array(z.string()),
  strengths: z.array(z.string()),
  suggestion: z.string(),
  improved: z.string(),
  improvedScore: z.number().min(0).max(100),
})

export const scriptSchema = z.object({
  title: z.string(),
  hook: z.string(),
  body: z.array(z.string()).min(1),
  value: z.string(),
  cta: z.string(),
  estimatedSeconds: z.number(),
  wordCount: z.number(),
  broll: z.array(z.string()),
  overlays: z.array(z.string()),
})

export const captionSchema = z.object({
  captions: z.array(z.object({ id: z.string(), text: z.string() })).min(1),
  hashtags: z.array(z.string()),
})

export const contentAnalysisSchema = z.object({
  overall: z.number(),
  scores: z.object({
    hook: z.number(),
    clarity: z.number(),
    pacing: z.number(),
    value: z.number(),
    cta: z.number(),
  }),
  summary: z.string(),
  strengths: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export const performanceInsightSchema = z.object({
  worked: z.array(z.string()),
  didnt: z.array(z.string()),
  next: z.array(z.string()),
})

export const missionFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  headline: z.string(),
  problems: z.array(z.string()),
  strengths: z.array(z.string()),
  suggestion: z.string(),
  improved: z.string().optional(),
  improvedScore: z.number().optional(),
})

export const transcriptSegmentSchema = z.object({
  start: z.number(),
  end: z.number(),
  text: z.string(),
})
export const transcriptSchema = z.object({ segments: z.array(transcriptSegmentSchema) })

export const momentSchema = z.object({
  id: z.string(),
  start: z.number(),
  end: z.number(),
  label: z.string(),
  description: z.string(),
  score: z.number(),
})
export const momentsSchema = z.object({ moments: z.array(momentSchema) })

export const clipSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.number(),
  end: z.number(),
  viralScore: z.number(),
  platforms: z.array(z.string()),
  reason: z.string(),
})
export const clipsSchema = z.object({ clips: z.array(clipSchema) })

export const videoSummarySchema = z.object({
  summary: z.string(),
  chapters: z.array(z.object({ start: z.number(), title: z.string() })),
  keyPoints: z.array(z.string()),
})

export type ContentIdea = z.infer<typeof contentIdeaSchema>
export type HookResult = z.infer<typeof hookResultSchema>
export type HookAnalysis = z.infer<typeof hookAnalysisSchema>
export type GeneratedScript = z.infer<typeof scriptSchema>
export type CaptionResult = z.infer<typeof captionSchema>
export type ContentAnalysis = z.infer<typeof contentAnalysisSchema>
export type PerformanceInsight = z.infer<typeof performanceInsightSchema>
export type MissionFeedback = z.infer<typeof missionFeedbackSchema>
export type TranscriptSegment = z.infer<typeof transcriptSegmentSchema>
export type VideoMoment = z.infer<typeof momentSchema>
export type VideoClip = z.infer<typeof clipSchema>
export type VideoSummary = z.infer<typeof videoSummarySchema>

export const briefSchema = z.object({
  title: z.string(),
  objective: z.string(),
  audience: z.string(),
  keyMessage: z.string(),
  hooks: z.array(z.string()).min(1),
  outline: z.array(z.string()).min(1),
  shots: z.array(z.string()),
  cta: z.string(),
  successMetric: z.string(),
})

export const repurposeSchema = z.object({
  versions: z
    .array(
      z.object({
        platform: z.string(),
        format: z.string(),
        title: z.string(),
        content: z.string(),
        tips: z.array(z.string()),
      })
    )
    .min(1),
})

export type ContentBrief = z.infer<typeof briefSchema>
export type RepurposeResult = z.infer<typeof repurposeSchema>
