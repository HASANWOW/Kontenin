export type ActionResult<T> =
  | { ok: true; data: T; source: "ai" | "demo"; provider: string }
  | { ok: false; error: string }

export function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "TimeoutError" || err.name === "AbortError") return "The AI took too long to respond. Please try again."
    if (err.name === "AIProviderError" || err.name === "WayinVideoError") return err.message
  }
  return "Something went wrong while contacting the AI service. Please try again."
}
