"use client"

import { useCallback, useEffect } from "react"
import type { ContentAnalysis, TranscriptSegment, VideoClip, VideoSummary } from "@/lib/ai/schemas"
import { useVideoStore, type VideoDataKind } from "@/lib/store/video-store"
import { callVideoApi } from "@/lib/video/client"

const ROUTE: Record<VideoDataKind, string> = { transcript: "transcript", analysis: "analyze", summary: "summary", clips: "clips" }

interface DataMap {
  transcript: TranscriptSegment[]
  analysis: ContentAnalysis
  summary: VideoSummary
  clips: VideoClip[]
}

const SETTER = {
  transcript: "setTranscript",
  analysis: "setAnalysis",
  summary: "setSummary",
  clips: "setClips",
} as const

/** Fetches one kind of result for the active video. Results and request status live in the video store. */
export async function loadVideoData<K extends VideoDataKind>(kind: K): Promise<DataMap[K] | null> {
  const store = useVideoStore.getState()
  const v = store.active
  if (!v || store.status[kind]?.loading) return null
  store.setStatus(kind, { loading: true, error: null })
  const res = await callVideoApi<DataMap[K]>(ROUTE[kind], { videoId: v.videoId, fileName: v.fileName, durationSeconds: v.durationSeconds })
  // Ignore results for a video that was replaced while the request was in flight.
  if (useVideoStore.getState().active?.videoId !== v.videoId) return null
  if (!res.ok) {
    useVideoStore.getState().setStatus(kind, { loading: false, error: res.error })
    return null
  }
  const s = useVideoStore.getState()
  ;(s[SETTER[kind]] as (d: DataMap[K]) => void)(res.data)
  s.setStatus(kind, { loading: false, error: null })
  return res.data
}

export function useVideoData<K extends VideoDataKind>(kind: K, opts: { auto?: boolean } = { auto: true }) {
  const active = useVideoStore((s) => s.active)
  const data = useVideoStore((s) => s[kind]) as DataMap[K] | null
  const status = useVideoStore((s) => s.status[kind])
  const auto = opts.auto !== false
  const error = status?.error ?? null

  useEffect(() => {
    if (auto && active && !data && !error) void loadVideoData(kind)
  }, [auto, active, data, error, kind])

  const reload = useCallback(() => loadVideoData(kind), [kind])

  return { data, loading: Boolean(status?.loading) || (auto && Boolean(active) && !data && !error), error, reload, video: active }
}
