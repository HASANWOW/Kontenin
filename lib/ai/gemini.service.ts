import "server-only"
import { AIProviderError, LLMService } from "./llm-base.service"

export class GeminiService extends LLMService {
  readonly provider = "gemini" as const

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  ) {
    super()
  }

  protected async completeJSON(system: string, prompt: string): Promise<unknown> {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": this.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
      }),
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) {
      throw new AIProviderError(`Gemini request failed (${res.status})`, this.provider, res.status)
    }
    const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new AIProviderError("Gemini returned an empty response", this.provider)
    return JSON.parse(text) as unknown
  }
}
