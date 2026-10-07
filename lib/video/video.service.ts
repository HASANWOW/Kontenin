import "server-only"
import { MockVideoService } from "./mock-video.service"
import type { VideoResult, VideoService } from "./types"
import { WayinVideoService } from "./wayinvideo.service"

let cached: VideoService | null = null

export function getVideoService(): VideoService {
  if (cached) return cached
  const key = process.env.WAYINVIDEO_API_KEY
  cached = key ? new WayinVideoService(key) : new MockVideoService()
  return cached
}

export async function runVideo<T>(task: (svc: VideoService) => Promise<T>): Promise<VideoResult<T>> {
  const svc = getVideoService()
  const data = await task(svc)
  return { data, provider: svc.provider, source: svc.provider === "demo" ? "demo" : "ai" }
}
