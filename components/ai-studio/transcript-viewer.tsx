"use client"

import { Highlighter, ListVideo, Quote, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AIProcessing } from "@/components/shared/ai-processing"
import { CopyButton } from "@/components/shared/copy-button"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVideoData } from "@/hooks/use-video-data"
import { timestamp } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { usePlayer } from "@/lib/store/player-store"
import type { ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

export function TranscriptPage() {
  return (
    <StudioFrame title="Transcript & Summary" description="A searchable, timestamped transcript. Click any line to jump, highlight key lines, and save quotes.">
      {(video) => <TranscriptBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-amber-300/60 px-0.5 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}

function TranscriptBody({ video }: { video: ActiveVideo }) {
  const transcript = useVideoData("transcript")
  const summary = useVideoData("summary")
  const time = usePlayer((s) => s.time)
  const quotes = useAppStore((s) => s.savedQuotes)
  const saveQuote = useAppStore((s) => s.saveQuote)
  const removeQuote = useAppStore((s) => s.removeQuote)
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState<number[]>([])

  const segments = useMemo(() => transcript.data ?? [], [transcript.data])
  const q = query.trim()
  const matches = q ? segments.filter((s) => s.text.toLowerCase().includes(q.toLowerCase())).length : 0
  const fullText = segments.map((s) => `[${timestamp(s.start)}] ${s.text}`).join("\n")

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
      <div className="space-y-4">
        <VideoStage video={video} />
        <section id="summary" className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListVideo className="size-4 text-primary" /> Summary
            </h2>
            <SourceBadge source={video.source} provider={video.provider} />
          </div>
          {summary.loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Summarizing…</p>
          ) : summary.error ? (
            <p className="mt-3 text-sm text-destructive">{summary.error}</p>
          ) : summary.data ? (
            <>
              <p className="mt-2 text-sm leading-relaxed">{summary.data.summary}</p>
              <p className="mt-4 text-sm font-semibold">Key points</p>
              <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                {summary.data.keyPoints.map((k) => (
                  <li key={k}>• {k}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
        {quotes.length > 0 && (
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-semibold">
              <Quote className="size-4 text-primary" /> Saved quotes
            </h2>
            <ul className="mt-3 space-y-2">
              {quotes.map((qt) => (
                <li key={qt.id} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5 text-sm">
                  <span className="font-mono text-xs text-primary tabular-nums">{timestamp(qt.start)}</span>
                  <span className="flex-1">“{qt.text}”</span>
                  <CopyButton text={qt.text} size="icon-sm" variant="ghost" />
                  <Button variant="ghost" size="icon-sm" aria-label="Delete quote" onClick={() => removeQuote(qt.id)}>
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section aria-labelledby="transcript-title" className="flex min-h-0 flex-col rounded-2xl border bg-card shadow-soft xl:max-h-[calc(100vh-14rem)]">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <h2 id="transcript-title" className="mr-auto font-semibold">
            Transcript
          </h2>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transcript" aria-label="Search transcript" className="h-8 w-48 pl-8 text-sm" />
          </div>
          <CopyButton text={fullText} label="Copy all" />
        </div>
        {q && (
          <p className="border-b px-4 py-2 text-xs text-muted-foreground" aria-live="polite">
            {matches} {matches === 1 ? "line" : "lines"} match “{q}”
          </p>
        )}
        <div className="flex-1 overflow-y-auto p-2">
          {transcript.loading ? (
            <AIProcessing className="m-2" steps={["Transcribing audio…", "Adding timestamps…"]} />
          ) : transcript.error ? (
            <ErrorState className="m-2" title="Couldn't load the transcript" description={transcript.error} onRetry={transcript.reload} />
          ) : (
            <ol>
              {segments.map((s, i) => {
                const active = time >= s.start && time < s.end
                const isHl = highlighted.includes(i)
                const dim = q && !s.text.toLowerCase().includes(q.toLowerCase())
                return (
                  <li key={i} className={cn("group flex gap-3 rounded-xl px-3 py-2.5 transition-colors", active ? "bg-secondary" : "hover:bg-muted/60", isHl && "bg-amber-400/15", dim && "opacity-40")}>
                    <button
                      type="button"
                      onClick={() => usePlayer.getState().seek(s.start)}
                      className="shrink-0 font-mono text-xs font-medium text-primary tabular-nums outline-none hover:underline focus-visible:underline"
                      aria-label={`Jump to ${timestamp(s.start)}`}
                    >
                      {timestamp(s.start)}
                    </button>
                    <p className="flex-1 text-[15px] leading-relaxed">
                      <Marked text={s.text} query={q} />
                    </p>
                    <span className="flex shrink-0 gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-pressed={isHl}
                        aria-label={isHl ? "Remove highlight" : "Highlight line"}
                        onClick={() => setHighlighted((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]))}
                      >
                        <Highlighter className={cn(isHl && "text-amber-500")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Save as quote"
                        onClick={() => {
                          saveQuote({ id: `${video.videoId}-${i}`, start: s.start, text: s.text })
                          toast.success("Quote saved")
                        }}
                      >
                        <Quote />
                      </Button>
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
