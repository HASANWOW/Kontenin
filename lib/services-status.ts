import "server-only"
import { getAIProvider } from "@/lib/ai/ai.service"
import { getAuthMode } from "@/lib/auth/session"
import { getVideoService } from "@/lib/video/video.service"

export interface ServiceStatus {
  ai: "demo" | "openai" | "gemini"
  video: "demo" | "wayinvideo"
  auth: "supabase" | "local"
}

/** Which integrations are live. Safe to pass to the client — contains no secrets. */
export function getServiceStatus(): ServiceStatus {
  return { ai: getAIProvider(), video: getVideoService().provider, auth: getAuthMode() }
}
