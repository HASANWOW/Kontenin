import "server-only"
import {
  clipsSchema,
  contentAnalysisSchema,
  momentsSchema,
  transcriptSchema,
  videoSummarySchema,
  type ContentAnalysis,
  type TranscriptSegment,
  type VideoClip,
  type VideoMoment,
  type VideoSummary,
} from "@/lib/ai/schemas"
import { z } from "zod"
import type { UploadRequest, VideoRef, VideoService } from "./types"

/**
 * Server-side WayinVideo wrapper.
 *
 * IMPORTANT: The endpoint paths and payload shapes below are an integration
 * scaffold. Confirm them against WayinVideo's official API reference before
 * enabling in production, then adjust the paths and response schemas to match.
 * Everything here runs on the server — the API key is never sent to the browser.
 */

export class WayinVideoError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message)
    this.name = "WayinVideoError"
  }
}

export class WayinVideoService implements VideoService {
  readonly provider = "wayinvideo" as const

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = process.env.WAYINVIDEO_API_BASE_URL || "https://api.wayinvideo.com/v1"
  ) {}

  private async request<S extends z.ZodTypeAny>(schema: S, path: string, init: RequestInit): Promise<z.infer<S>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${this.apiKey}`, ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(120_000),
    })
    if (!res.ok) throw new WayinVideoError(`WayinVideo request failed (${res.status})`, res.status)
    const parsed = schema.safeParse(await res.json())
    if (!parsed.success) throw new WayinVideoError("WayinVideo returned an unexpected response shape")
    return parsed.data
  }

  async upload(req: UploadRequest, file?: Blob): Promise<VideoRef> {
    const schema = z.object({ id: z.string(), duration: z.number().optional() })
    let data: z.infer<typeof schema>
    if (file) {
      const form = new FormData()
      form.append("file", file, req.fileName)
      data = await this.request(schema, "/videos", { method: "POST", body: form })
    } else {
      data = await this.request(schema, "/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: req.sourceUrl }),
      })
    }
    return { videoId: data.id, fileName: req.fileName, durationSeconds: data.duration ?? req.durationSeconds }
  }

  async transcribe(ref: VideoRef): Promise<TranscriptSegment[]> {
    const data = await this.request(transcriptSchema, `/videos/${ref.videoId}/transcript`, { method: "GET" })
    return data.segments
  }

  async summarizeVideo(ref: VideoRef): Promise<VideoSummary> {
    return this.request(videoSummarySchema, `/videos/${ref.videoId}/summary`, { method: "GET" })
  }

  async findMoments(ref: VideoRef, query: string): Promise<VideoMoment[]> {
    const data = await this.request(momentsSchema, `/videos/${ref.videoId}/moments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    return data.moments
  }

  async generateClips(ref: VideoRef): Promise<VideoClip[]> {
    const data = await this.request(clipsSchema, `/videos/${ref.videoId}/clips`, { method: "POST" })
    return data.clips
  }

  async analyzeVideo(ref: VideoRef): Promise<ContentAnalysis> {
    return this.request(contentAnalysisSchema, `/videos/${ref.videoId}/analysis`, { method: "GET" })
  }
}
