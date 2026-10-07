import "server-only"
import { GeminiService } from "./gemini.service"
import { MockAIService } from "./mock-ai.service"
import { OpenAIService } from "./openai.service"
import type { AIProviderId, AIResult, AIService } from "./types"

/**
 * Server-side entry point for all AI features.
 * Provider selection: AI_PROVIDER if set, otherwise the first key found
 * (OpenAI, then Gemini), otherwise demo mode. Keys never reach the client.
 */

let cached: AIService | null = null

export function getAIService(): AIService {
  if (cached) return cached
  const preferred = process.env.AI_PROVIDER as AIProviderId | undefined
  const openai = process.env.OPENAI_API_KEY
  const gemini = process.env.GEMINI_API_KEY

  if (preferred === "demo") cached = new MockAIService()
  else if (preferred === "gemini" && gemini) cached = new GeminiService(gemini)
  else if (preferred === "openai" && openai) cached = new OpenAIService(openai)
  else if (openai) cached = new OpenAIService(openai)
  else if (gemini) cached = new GeminiService(gemini)
  else cached = new MockAIService()
  return cached
}

export function getAIProvider(): AIProviderId {
  return getAIService().provider
}

export async function runAI<T>(task: (ai: AIService) => Promise<T>): Promise<AIResult<T>> {
  const ai = getAIService()
  const data = await task(ai)
  return { data, provider: ai.provider, source: ai.provider === "demo" ? "demo" : "ai" }
}
