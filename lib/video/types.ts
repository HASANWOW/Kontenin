import type { ContentAnalysis, TranscriptSegment, VideoClip, VideoMoment, VideoSummary } from "@/lib/ai/schemas"

export type VideoProviderId = "demo" | "wayinvideo"

export interface VideoRef {
  videoId: string
  fileName: string
  /** Real duration read from the file in the browser, when available. */
  durationSeconds: number
}

export interface UploadRequest {
  fileName: string
  sizeBytes: number
  mimeType: string
  durationSeconds: number
  sourceUrl?: string
}

export interface VideoResult<T> {
  data: T
  source: "ai" | "demo"
  provider: VideoProviderId
}

export interface VideoService {
  readonly provider: VideoProviderId
  upload(req: UploadRequest, file?: Blob): Promise<VideoRef>
  analyzeVideo(ref: VideoRef): Promise<ContentAnalysis>
  transcribe(ref: VideoRef): Promise<TranscriptSegment[]>
  summarizeVideo(ref: VideoRef): Promise<VideoSummary>
  findMoments(ref: VideoRef, query: string): Promise<VideoMoment[]>
  generateClips(ref: VideoRef): Promise<VideoClip[]>
}
