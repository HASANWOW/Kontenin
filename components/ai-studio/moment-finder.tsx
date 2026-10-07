"use client"

import { Play, Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { AIProcessing } from "@/components/shared/ai-processing"
import { scoreTone } from "@/components/shared/score-ring"
import { SourceBadge } from "@/components/shared/source-badge"
import { EmptyState, ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { VideoMoment } from "@/lib/ai/schemas"
import { timestamp } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { usePlayer } from "@/lib/store/player-store"
import { useVideoStore, type ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { callVideoApi } from "@/lib/video/client"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

const SUGGESTIONS = ["Find the funniest moment", "Find the strongest hook", "Find the most educational section", "Find moments where I mention money"]

export function MomentFinder() {
  return (
    <StudioFrame title="Find Best Moments" description="Describe what you're looking for — Kontenin returns timestamped moments you can jump to.">
      {(video) => <MomentBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

function MomentBody({ video }: { video: ActiveVideo }) {
  const saved = useVideoStore((s) => s.moments)
  const setMoments = useVideoStore((s) => s.setMoments)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const time = usePlayer((s) => s.time)
  const [query, setQuery] = useState(saved?.query ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function find(q = query) {
    if (q.trim().length < 2) return
    setQuery(q)
    setLoading(true)
    setError(null)
    const res = await callVideoApi<VideoMoment[]>("moments", { videoId: video.videoId, fileName: video.fileName, durationSeconds: video.durationSeconds, query: q })
    setLoading(false)
    if (!res.ok) return setError(res.error)
    setMoments({ query: q, results: res.data })
    recordAIUse(`Searched moments: “${q}”`)
  }

  const results = saved?.results ?? []

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <VideoStage video={video} />
        <p className="text-xs text-muted-foreground">Click a result to jump the preview to that moment.</p>
      </div>
      <div className="space-y-4">
        <form
          className="rounded-2xl border bg-card p-4 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault()
            find()
          }}
        >
          <label htmlFor="moment-query" className="text-sm font-semibold">
            What are you looking for?
          </label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="moment-query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find the strongest hook" className="h-10 pl-9" maxLength={200} />
            </div>
            <Button type="submit" size="lg" className="h-10" disabled={loading || query.trim().length < 2}>
              <Sparkles /> Find
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => find(s)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        </form>

        {loading ? (
          <AIProcessing steps={["Reading the transcript…", "Matching your request…", "Ranking moments…"]} />
        ) : error ? (
          <ErrorState title="Search failed" description={error} onRetry={() => find()} />
        ) : !saved ? (
          <EmptyState icon={Search} title="Ask for a moment" description="Try one of the suggestions above." />
        ) : results.length === 0 ? (
          <EmptyState icon={Search} title={`No moments match “${saved.query}”`} description="Try a broader request, like “funniest” or “educational”." />
        ) : (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {results.length} moments for “{saved.query}”
              </p>
              <SourceBadge source={video.source} provider={video.provider} />
            </div>
            <ul className="space-y-2">
              {results.map((m) => {
                const active = time >= m.start && time < m.end
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => usePlayer.getState().seek(m.start, { stopAt: m.end })}
                      className={cn(
                        "flex w-full gap-3 rounded-2xl border bg-card p-4 text-left shadow-soft transition-colors outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                        active && "border-primary bg-secondary/40"
                      )}
                    >
                      <span className="flex w-14 shrink-0 flex-col items-center">
                        <span className="font-mono text-sm font-semibold text-primary tabular-nums">{timestamp(m.start)}</span>
                        <Play className="mt-1 size-3.5 text-muted-foreground" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{m.label}</span>
                          <span className={cn("text-sm font-semibold tabular-nums", scoreTone(m.score).text)}>Score: {m.score}</span>
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">“{m.description}”</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
