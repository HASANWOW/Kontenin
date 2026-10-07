import "server-only"
import type { z } from "zod"
import { computePerformanceInsight } from "./mock-ai.service"
import {
  briefSchema,
  captionSchema,
  contentAnalysisSchema,
  contentIdeasSchema,
  hookAnalysisSchema,
  hooksSchema,
  missionFeedbackSchema,
  repurposeSchema,
  scriptSchema,
  type CaptionResult,
  type ContentAnalysis,
  type ContentBrief,
  type ContentIdea,
  type GeneratedScript,
  type HookAnalysis,
  type HookResult,
  type MissionFeedback,
  type PerformanceInsight,
  type RepurposeResult,
} from "./schemas"
import type {
  AIProviderId,
  AIService,
  BriefInput,
  CaptionInput,
  ContentInput,
  HookInput,
  IdeaInput,
  MissionInput,
  PerformanceInput,
  RepurposeInput,
  ScriptInput,
} from "./types"

const SYSTEM = `You are Kontenin's AI coach for Indonesian beginner content creators.
Write all creator-facing content (hooks, scripts, captions, ideas, rewrites) in natural, casual Bahasa Indonesia as used by Gen-Z creators on TikTok and Reels.
Write coaching feedback (problems, strengths, suggestions, reasons) in clear, friendly English.
Always respond with a single JSON object that matches the requested shape exactly. No markdown.`

export class AIProviderError extends Error {
  constructor(
    message: string,
    readonly provider: AIProviderId,
    readonly status?: number
  ) {
    super(message)
    this.name = "AIProviderError"
  }
}

/** Shared prompt + validation logic. Subclasses only implement transport. */
export abstract class LLMService implements AIService {
  abstract readonly provider: AIProviderId
  protected abstract completeJSON(system: string, prompt: string): Promise<unknown>

  private async ask<S extends z.ZodTypeAny>(schema: S, prompt: string, prepare?: (raw: unknown) => unknown): Promise<z.infer<S>> {
    const raw = await this.completeJSON(SYSTEM, prompt)
    const parsed = schema.safeParse(prepare ? prepare(raw) : raw)
    if (!parsed.success) {
      throw new AIProviderError(`The AI returned an unexpected format: ${parsed.error.issues[0]?.message ?? "invalid"}`, this.provider)
    }
    return parsed.data
  }

  async generateContentIdeas(input: IdeaInput): Promise<ContentIdea[]> {
    const res = await this.ask(
      contentIdeasSchema,
      `Generate 10 distinct short-form content ideas.
Niche: ${input.niche}. Platform: ${input.platform}. Audience: ${input.audience}. Style: ${input.style}. Goal: ${input.goal}.
Shape: {"ideas":[{"title":string,"hook":string,"angle":string,"format":string,"duration":string (e.g. "30–45 detik"),"difficulty":"beginner"|"intermediate"|"advanced","cta":string}]}`,
      withIds("ideas", "idea")
    )
    return res.ideas
  }

  async generateHooks(input: HookInput): Promise<HookResult[]> {
    const res = await this.ask(
      hooksSchema,
      `Write 6 opening hooks (max 20 words each) for a video about "${input.topic}" for ${input.audience || "beginners"}, tone: ${input.tone}.
Score each 0-100 for scroll-stopping power, give the reason and one concrete improvement.
Shape: {"hooks":[{"text":string,"score":number,"reason":string,"improvement":string}]}`,
      withIds("hooks", "hook")
    )
    return [...res.hooks].sort((a, b) => b.score - a.score)
  }

  async generateScript(input: ScriptInput): Promise<GeneratedScript> {
    return this.ask(
      scriptSchema,
      `Write a ${input.durationSeconds}-second ${input.videoType} script for ${input.platform} about "${input.topic}". Tone: ${input.tone}. CTA: ${input.cta || "your choice"}.
Assume ~2.4 spoken words per second.
Shape: {"title":string,"hook":string,"body":string[],"value":string,"cta":string,"estimatedSeconds":number,"wordCount":number,"broll":string[],"overlays":string[]}`
    )
  }

  async generateCaption(input: CaptionInput): Promise<CaptionResult> {
    return this.ask(
      captionSchema,
      `Write 2 ${input.style.replace("_", " ")} captions for ${input.platform} about: "${input.content}". Add 6-10 relevant hashtags.
Shape: {"captions":[{"text":string}],"hashtags":string[]}`,
      withIds("captions", "cap")
    )
  }

  async analyzeHook(hook: string): Promise<HookAnalysis> {
    return this.ask(
      hookAnalysisSchema,
      `Evaluate this video hook: "${hook}".
Shape: {"score":number,"verdict":string,"problems":string[],"strengths":string[],"suggestion":string,"improved":string (rewritten hook),"improvedScore":number}`
    )
  }

  async analyzeContent(input: ContentInput): Promise<ContentAnalysis> {
    return this.ask(
      contentAnalysisSchema,
      `Review this planned ${input.durationSeconds}s video. Title: "${input.title}". Script/description: """${input.description}""".
Score 0-100 for hook, clarity, pacing, value, cta, and an overall score.
Shape: {"overall":number,"scores":{"hook":number,"clarity":number,"pacing":number,"value":number,"cta":number},"summary":string,"strengths":string[],"recommendations":string[]}`
    )
  }

  async evaluateMission(input: MissionInput): Promise<MissionFeedback> {
    return this.ask(
      missionFeedbackSchema,
      `A ${input.difficulty} creator submitted this for the practice mission "${input.missionTitle}" (type: ${input.evaluator}${
        input.minItems ? `, requires ${input.minItems} items` : ""
      }${input.original ? `, original weak hook: "${input.original}"` : ""}):
"""${input.answer}"""
Score 0-100; passed = score >= 60. If relevant, include an improved version in Bahasa Indonesia.
Shape: {"score":number,"passed":boolean,"headline":string,"problems":string[],"strengths":string[],"suggestion":string,"improved"?:string,"improvedScore"?:number}`
    )
  }

  async analyzePerformance(input: PerformanceInput): Promise<PerformanceInsight> {
    // Facts are computed exactly; we don't let the model invent percentages.
    return computePerformanceInsight(input)
  }

  async generateBrief(input: BriefInput): Promise<ContentBrief> {
    return this.ask(
      briefSchema,
      `Write a one-page content brief for a ${input.platform} video titled "${input.title}". Goal: ${input.goal}. Audience: ${input.audience}. Key message: ${input.keyMessage || "your choice"}.
Shape: {"title":string,"objective":string,"audience":string,"keyMessage":string,"hooks":string[3],"outline":string[],"shots":string[],"cta":string,"successMetric":string}`
    )
  }

  async repurposeContent(input: RepurposeInput): Promise<RepurposeResult> {
    return this.ask(
      repurposeSchema,
      `Repurpose this ${input.sourcePlatform} content into these formats: ${input.targets.join(", ")} (carousel = Instagram 5-slide carousel, story = 3-frame story).
Source: """${input.source}"""
Shape: {"versions":[{"platform":string,"format":string,"title":string,"content":string,"tips":string[]}]}`
    )
  }
}

function withIds(key: string, prefix: string) {
  return (raw: unknown) => {
    if (!raw || typeof raw !== "object") return raw
    const list = (raw as Record<string, unknown>)[key]
    if (!Array.isArray(list)) return raw
    return {
      ...raw,
      [key]: list.map((item, i) => (item && typeof item === "object" ? { id: `${prefix}-${Date.now().toString(36)}-${i}`, ...item } : item)),
    }
  }
}
