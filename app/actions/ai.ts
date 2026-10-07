"use server"

import { z } from "zod"
import { runAI } from "@/lib/ai/ai.service"
import type { CaptionResult, ContentAnalysis, ContentBrief, ContentIdea, RepurposeResult, GeneratedScript, HookAnalysis, HookResult, MissionFeedback, PerformanceInsight } from "@/lib/ai/schemas"
import type { BriefInput, CaptionInput, HookInput, RepurposeInput, IdeaInput, MissionInput, PerformanceInput, ScriptInput } from "@/lib/ai/types"
import { errorMessage, type ActionResult } from "@/lib/action-result"
import { getSession } from "@/lib/auth/session"

const text = (max: number) => z.string().trim().max(max)
const required = (max: number, label: string) => z.string().trim().min(1, `${label} is required.`).max(max)

const ideaSchema = z.object({
  niche: required(60, "Niche"),
  platform: required(40, "Platform"),
  audience: text(80),
  style: text(40),
  goal: text(60),
  variant: z.number().int().min(0).max(1000).optional(),
})

const hookSchema = z.object({
  topic: required(120, "Topic"),
  audience: text(80),
  tone: z.enum(["bold", "funny", "educational", "emotional", "curiosity", "storytelling"]),
  variant: z.number().int().min(0).max(1000).optional(),
})

const scriptSchema = z.object({
  topic: required(140, "Topic"),
  platform: required(40, "Platform"),
  videoType: required(40, "Video type"),
  durationSeconds: z.number().int().min(10).max(600),
  tone: text(40),
  cta: text(140),
  variant: z.number().int().min(0).max(1000).optional(),
})

const captionSchema = z.object({
  content: required(500, "Content description"),
  platform: required(40, "Platform"),
  style: z.enum(["short", "storytelling", "educational", "funny", "sales", "personal_brand"]),
  variant: z.number().int().min(0).max(1000).optional(),
})

const contentSchema = z.object({
  title: required(140, "Title"),
  description: required(4000, "Script or description"),
  durationSeconds: z.number().int().min(5).max(1200),
})

const missionSchema = z.object({
  evaluator: z.enum(["hook", "hooks", "script", "niche", "rewrite", "reflection"]),
  missionTitle: required(140, "Mission"),
  answer: required(4000, "Your answer"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  minItems: z.number().int().min(1).max(10).optional(),
  original: text(300).optional(),
})

async function guarded<I, T>(schema: z.ZodType<I>, input: unknown, task: (parsed: I) => Promise<{ data: T; source: "ai" | "demo"; provider: string }>): Promise<ActionResult<T>> {
  const session = await getSession()
  if (!session) return { ok: false, error: "Your session has expired. Please log in again." }
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  try {
    return { ok: true, ...(await task(parsed.data)) }
  } catch (err) {
    console.error("[ai]", err)
    return { ok: false, error: errorMessage(err) }
  }
}

export async function generateIdeasAction(input: IdeaInput): Promise<ActionResult<ContentIdea[]>> {
  return guarded(ideaSchema, input, (i) => runAI((ai) => ai.generateContentIdeas(i)))
}

export async function generateHooksAction(input: HookInput): Promise<ActionResult<HookResult[]>> {
  return guarded(hookSchema, input, (i) => runAI((ai) => ai.generateHooks(i)))
}

export async function generateScriptAction(input: ScriptInput): Promise<ActionResult<GeneratedScript>> {
  return guarded(scriptSchema, input, (i) => runAI((ai) => ai.generateScript(i)))
}

export async function generateCaptionAction(input: CaptionInput): Promise<ActionResult<CaptionResult>> {
  return guarded(captionSchema, input, (i) => runAI((ai) => ai.generateCaption(i)))
}

export async function analyzeHookAction(hook: string): Promise<ActionResult<HookAnalysis>> {
  return guarded(required(300, "Hook"), hook, (h) => runAI((ai) => ai.analyzeHook(h)))
}

export async function analyzeContentAction(input: { title: string; description: string; durationSeconds: number }): Promise<ActionResult<ContentAnalysis>> {
  return guarded(contentSchema, input, (i) => runAI((ai) => ai.analyzeContent(i)))
}

export async function evaluateMissionAction(input: MissionInput): Promise<ActionResult<MissionFeedback>> {
  return guarded(missionSchema, input, (i) => runAI((ai) => ai.evaluateMission(i)))
}

export async function analyzePerformanceAction(input: PerformanceInput): Promise<ActionResult<PerformanceInsight>> {
  const schema = z.object({
    items: z
      .array(
        z.object({
          title: text(200),
          views: z.number().min(0),
          engagementRate: z.number().min(0),
          durationSeconds: z.number().min(0),
          hookType: text(40),
          format: text(60),
        })
      )
      .max(200),
  })
  return guarded(schema, input, (i) => runAI((ai) => ai.analyzePerformance(i)))
}

const briefInputSchema = z.object({
  title: required(140, "Title"),
  goal: required(60, "Goal"),
  audience: text(120),
  platform: required(40, "Platform"),
  keyMessage: text(300),
})

export async function generateBriefAction(input: BriefInput): Promise<ActionResult<ContentBrief>> {
  return guarded(briefInputSchema, input, (i) => runAI((ai) => ai.generateBrief(i)))
}

const repurposeInputSchema = z.object({
  source: required(4000, "Source content"),
  sourcePlatform: required(40, "Source platform"),
  targets: z.array(z.enum(["tiktok", "instagram", "youtube_shorts", "carousel", "story"])).min(1, "Pick at least one target format.").max(5),
})

export async function repurposeAction(input: RepurposeInput): Promise<ActionResult<RepurposeResult>> {
  return guarded(repurposeInputSchema, input, (i) => runAI((ai) => ai.repurposeContent(i)))
}
