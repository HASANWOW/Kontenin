"use client"

import { ArrowRight, ListVideo, RotateCcw, Target } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect } from "react"
import { AnalysisResult } from "@/components/create/content-analyzer"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import type { ContentAnalysis, TranscriptSegment, VideoClip, VideoSummary } from "@/lib/ai/schemas"
import { celebrate } from "@/lib/celebrate"
import { timestamp } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { usePlayer } from "@/lib/store/player-store"
import { useVideoStore, type ActiveVideo } from "@/lib/store/video-store"
import { callVideoApi } from "@/lib/video/client"
import { ProcessingState } from "./processing-state"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Full analysis pipeline. Progress lives in the video store so it survives
 * navigation and the page can start it from an effect.
 */
async function runAnalysisPipeline(video: ActiveVideo) {
  const store = useVideoStore.getState()
  if (store.pipeline.running) return
  const set = store.setPipeline
  const stillActive = () => useVideoStore.getState().active?.videoId === video.videoId
  const ref = { videoId: video.videoId, fileName: video.fileName, durationSeconds: video.durationSeconds }
  set({ running: true, error: null, stage: 1 })
  try {
    await wait(500)
    set({ stage: 2 })
    const t = await callVideoApi<TranscriptSegment[]>("transcript", ref)
    if (!t.ok) throw new Error(t.error)
    if (!stillActive()) return
    store.setTranscript(t.data)
    set({ stage: 3 })
    const c = await callVideoApi<VideoClip[]>("clips", ref)
    if (!c.ok) throw new Error(c.error)
    if (!stillActive()) return
    store.setClips(c.data)
    set({ stage: 4 })
    const [a, s] = await Promise.all([callVideoApi<ContentAnalysis>("analyze", ref), callVideoApi<VideoSummary>("summary", ref)])
    if (!a.ok) throw new Error(a.error)
    if (!stillActive()) return
    if (s.ok) store.setSummary(s.data)
    set({ stage: 5 })
    await wait(500)
    store.setAnalysis(a.data)
    set({ stage: 6 })
    const app = useAppStore.getState()
    app.recordAIUse(`Analyzed video “${video.fileName}”`, { createdContent: true })
    celebrate(app.unlockAchievement("first-video"), "First video analyzed")
  } catch (e) {
    if (stillActive()) set({ error: e instanceof Error ? e.message : "Analysis failed." })
  } finally {
    useVideoStore.getState().setPipeline({ running: false })
  }
}

export function VideoAnalyzer() {
  return (
    <StudioFrame title="Analyze My Video" description="Upload a video and get a content score with concrete recommendations.">
      {(video) => <AnalyzerBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

function AnalyzerBody({ video }: { video: ActiveVideo }) {
  const analysis = useVideoStore((s) => s.analysis)
  const summary = useVideoStore((s) => s.summary)
  const { stage, error } = useVideoStore((s) => s.pipeline)
  const run = useCallback(() => runAnalysisPipeline(video), [video])

  useEffect(() => {
    const { analysis: done, pipeline } = useVideoStore.getState()
    if (!done && !pipeline.error) void run()
  }, [run])

  if (error) return <ErrorState title="Analysis failed" description={error} onRetry={run} className="mx-auto max-w-lg" />
  if (!analysis) return <ProcessingState stage={stage} demo={video.source === "demo"} />

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <VideoStage video={video} />
        {summary && (
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListVideo className="size-4 text-primary" /> Chapters
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{summary.summary}</p>
            <ol className="mt-3 divide-y">
              {summary.chapters.map((c) => (
                <li key={c.start}>
                  <button
                    type="button"
                    onClick={() => usePlayer.getState().seek(c.start)}
                    className="flex w-full items-center gap-3 py-2.5 text-left text-sm outline-none hover:text-primary focus-visible:text-primary"
                  >
                    <span className="w-12 font-mono text-xs text-primary tabular-nums">{timestamp(c.start)}</span>
                    {c.title}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href="/ai-studio/moments" className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-muted">
            Find best moments <ArrowRight className="size-3.5" />
          </Link>
          <Link href="/ai-studio/clips" className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-muted">
            Generate clips <ArrowRight className="size-3.5" />
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="h-9"
            onClick={() => {
              useVideoStore.setState({ analysis: null, pipeline: { stage: 0, error: null, running: false } })
              void run()
            }}
          >
            <RotateCcw /> Re-run analysis
          </Button>
        </div>
      </div>
      <div id="score" className="space-y-4">
        <AnalysisResult analysis={analysis} source={video.source} provider={video.provider} />
        <Link href="/missions/rewrite-weak-hook" className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-secondary/40 p-4 text-sm transition-colors hover:bg-secondary">
          <Target className="size-5 shrink-0 text-primary" />
          <span className="flex-1">
            <span className="block font-medium">Practice the fix</span>
            <span className="text-muted-foreground">Mission: Rewrite a Weak Hook · 5 min</span>
          </span>
          <ArrowRight className="size-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}
