import type { Difficulty, MissionEvaluator } from "@/types/domain"
import type {
  CaptionResult,
  ContentAnalysis,
  ContentBrief,
  RepurposeResult,
  ContentIdea,
  GeneratedScript,
  HookAnalysis,
  HookResult,
  MissionFeedback,
  PerformanceInsight,
} from "./schemas"

export type AIProviderId = "demo" | "openai" | "gemini"

/** Every AI response says where it came from so the UI can label it honestly. */
export interface AIResult<T> {
  data: T
  source: "ai" | "demo"
  provider: AIProviderId
}

export interface IdeaInput {
  niche: string
  platform: string
  audience: string
  style: string
  goal: string
  /** Changes the deterministic mock output when the user asks to regenerate. */
  variant?: number
}

export interface HookInput {
  topic: string
  audience: string
  tone: HookTone
  variant?: number
}

export type HookTone = "bold" | "funny" | "educational" | "emotional" | "curiosity" | "storytelling"

export interface ScriptInput {
  topic: string
  platform: string
  videoType: string
  durationSeconds: number
  tone: string
  cta: string
  variant?: number
}

export type CaptionStyle = "short" | "storytelling" | "educational" | "funny" | "sales" | "personal_brand"

export interface CaptionInput {
  content: string
  platform: string
  style: CaptionStyle
  variant?: number
}

export interface ContentInput {
  title: string
  description: string
  durationSeconds: number
}

export interface MissionInput {
  evaluator: MissionEvaluator
  missionTitle: string
  answer: string
  difficulty: Difficulty
  /** For list-style missions, e.g. "write 5 hooks". */
  minItems?: number
  /** For rewrite missions, the weak original the user is improving. */
  original?: string
}

export interface BriefInput {
  title: string
  goal: string
  audience: string
  platform: string
  keyMessage: string
}

export interface RepurposeInput {
  source: string
  sourcePlatform: string
  targets: string[]
}

export interface PerformanceInput {
  items: {
    title: string
    views: number
    engagementRate: number
    durationSeconds: number
    hookType: string
    format: string
  }[]
}

export interface AIService {
  readonly provider: AIProviderId
  generateContentIdeas(input: IdeaInput): Promise<ContentIdea[]>
  generateHooks(input: HookInput): Promise<HookResult[]>
  generateScript(input: ScriptInput): Promise<GeneratedScript>
  generateCaption(input: CaptionInput): Promise<CaptionResult>
  analyzeHook(hook: string): Promise<HookAnalysis>
  analyzeContent(input: ContentInput): Promise<ContentAnalysis>
  evaluateMission(input: MissionInput): Promise<MissionFeedback>
  analyzePerformance(input: PerformanceInput): Promise<PerformanceInsight>
  generateBrief(input: BriefInput): Promise<ContentBrief>
  repurposeContent(input: RepurposeInput): Promise<RepurposeResult>
}
