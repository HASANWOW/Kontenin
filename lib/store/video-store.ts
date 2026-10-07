"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { ContentAnalysis, TranscriptSegment, VideoClip, VideoMoment, VideoSummary } from "@/lib/ai/schemas"
import type { VideoProviderId, VideoRef } from "@/lib/video/types"

export interface ActiveVideo extends VideoRef {
  sizeBytes: number
  /** Blob URL for local preview. Not persisted — it dies with the page. */
  objectUrl?: string
  sourceUrl?: string
  isSample: boolean
  provider: VideoProviderId
  source: "ai" | "demo"
}

export type VideoDataKind = "transcript" | "analysis" | "summary" | "clips"
export interface RequestStatus {
  loading: boolean
  error: string | null
}
export interface PipelineState {
  stage: number
  error: string | null
  running: boolean
}

interface VideoState {
  /** Per-request loading/error, kept here (not in components) so effects can trigger loads. */
  status: Partial<Record<VideoDataKind, RequestStatus>>
  pipeline: PipelineState
  setStatus(kind: VideoDataKind, s: RequestStatus): void
  setPipeline(p: Partial<PipelineState>): void
  active: ActiveVideo | null
  analysis: ContentAnalysis | null
  transcript: TranscriptSegment[] | null
  summary: VideoSummary | null
  clips: VideoClip[] | null
  moments: { query: string; results: VideoMoment[] } | null
  setActive(v: ActiveVideo): void
  clear(): void
  setAnalysis(a: ContentAnalysis): void
  setTranscript(t: TranscriptSegment[]): void
  setSummary(s: VideoSummary): void
  setClips(c: VideoClip[]): void
  setMoments(m: { query: string; results: VideoMoment[] }): void
}

const empty = { analysis: null, transcript: null, summary: null, clips: null, moments: null, status: {}, pipeline: { stage: 0, error: null, running: false } }

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      active: null,
      ...empty,
      setActive(v) {
        const prev = get().active
        if (prev?.objectUrl && prev.objectUrl !== v.objectUrl) URL.revokeObjectURL(prev.objectUrl)
        set({ active: v, ...empty })
      },
      clear() {
        const prev = get().active
        if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl)
        set({ active: null, ...empty })
      },
      setStatus: (kind, st) => set((s) => ({ status: { ...s.status, [kind]: st } })),
      setPipeline: (p) => set((s) => ({ pipeline: { ...s.pipeline, ...p } })),
      setAnalysis: (analysis) => set({ analysis }),
      setTranscript: (transcript) => set({ transcript }),
      setSummary: (summary) => set({ summary }),
      setClips: (clips) => set({ clips }),
      setMoments: (moments) => set({ moments }),
    }),
    {
      name: "kontenin-video",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        active: s.active ? { ...s.active, objectUrl: undefined } : null,
        analysis: s.analysis,
        transcript: s.transcript,
        summary: s.summary,
        clips: s.clips,
        moments: s.moments,
      }),
    }
  )
)

export const SAMPLE_VIDEO = {
  fileName: "sample — 3 hal sebelum jadi kreator.mp4",
  durationSeconds: 252,
  sizeBytes: 48_200_000,
}
