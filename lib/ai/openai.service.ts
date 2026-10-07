import "server-only"
import { AIProviderError, LLMService } from "./llm-base.service"

export class OpenAIService extends LLMService {
  readonly provider = "openai" as const

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.OPENAI_MODEL || "gpt-4.1-mini"
  ) {
    super()
  }

  protected async completeJSON(system: string, prompt: string): Promise<unknown> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: "json_object" },
        temperature: 0.8,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) {
      throw new AIProviderError(`OpenAI request failed (${res.status})`, this.provider, res.status)
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const content = json.choices?.[0]?.message?.content
    if (!content) throw new AIProviderError("OpenAI returned an empty response", this.provider)
    return JSON.parse(content) as unknown
  }
}
