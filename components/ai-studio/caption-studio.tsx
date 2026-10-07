"use client"

import { Download, FlaskConical } from "lucide-react"
import { useMemo, useState } from "react"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { SelectField } from "@/components/shared/form-field"
import { ErrorState, LoadingState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useVideoData } from "@/hooks/use-video-data"
import type { TranscriptSegment } from "@/lib/ai/schemas"
import { timestamp } from "@/lib/format"
import { usePlayer } from "@/lib/store/player-store"
import type { ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

type Style = "minimal" | "bold" | "dynamic" | "creator" | "educational"
type Position = "top" | "middle" | "bottom"

const STYLES = [
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "dynamic", label: "Dynamic" },
  { value: "creator", label: "Creator" },
  { value: "educational", label: "Educational" },
] as const
const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
] as const
const FONTS = [
  { value: "var(--font-geist-sans)", label: "Geist Sans" },
  { value: "Impact, 'Arial Black', sans-serif", label: "Impact" },
  { value: "Georgia, serif", label: "Serif" },
  { value: "var(--font-geist-mono)", label: "Mono" },
] as const
const POSITIONS = [
  { value: "top", label: "Top" },
  { value: "middle", label: "Middle" },
  { value: "bottom", label: "Bottom" },
] as const

/** Words worth emphasizing: numbers and longer content words. */
function isKeyword(word: string) {
  const w = word.replace(/[^\p{L}\p{N}]/gu, "")
  return /\d/.test(w) || w.length >= 8
}

function srtTime(s: number) {
  const ms = Math.round((s % 1) * 1000)
  const total = Math.floor(s)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`
}

function downloadSrt(name: string, segments: TranscriptSegment[]) {
  const body = segments.map((s, i) => `${i + 1}\n${srtTime(s.start)} --> ${srtTime(s.end)}\n${s.text}\n`).join("\n")
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([body], { type: "application/x-subrip" }))
  a.download = `${name.replace(/\.[^.]+$/, "")}.srt`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function CaptionStudio() {
  return (
    <StudioFrame title="Caption Studio" description="Style your subtitles, preview them on the video, and export an .srt file for your editor.">
      {(video) => <CaptionBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

function CaptionBody({ video }: { video: ActiveVideo }) {
  const { data, loading, error, reload } = useVideoData("transcript")
  const time = usePlayer((s) => s.time)
  const [platform, setPlatform] = useState<string>("tiktok")
  const [style, setStyle] = useState<Style>("creator")
  const [font, setFont] = useState<string>(FONTS[0].value)
  const [size, setSize] = useState(22)
  const [position, setPosition] = useState<Position>("bottom")

  const segments = useMemo(() => data ?? [], [data])
  const current = segments.find((s) => time >= s.start && time < s.end) ?? segments[0]

  const overlay = current ? <CaptionOverlay text={current.text} style={style} font={font} size={size} position={position} platform={platform} /> : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
      <div>
        <div className="mx-auto max-w-[340px]">
          <VideoStage video={video} aspect="aspect-[9/16]" fit="cover" overlay={overlay} />
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <FlaskConical className="size-3.5" /> Styling preview only — Kontenin doesn&apos;t burn captions into video files.
        </p>
      </div>

      <div className="space-y-4">
        <section className="grid gap-4 rounded-2xl border bg-card p-5 shadow-soft md:grid-cols-2">
          <ChoiceGroup label="Platform" choices={PLATFORMS} value={platform} onChange={setPlatform} />
          <ChoiceGroup label="Caption style" choices={STYLES} value={style} onChange={setStyle} />
          <SelectField label="Font" value={font} onChange={setFont} options={FONTS} />
          <div>
            <div className="mb-2 flex justify-between text-sm font-medium">
              <span id="size-label">Size</span>
              <span className="text-muted-foreground tabular-nums">{size}px</span>
            </div>
            <Slider aria-labelledby="size-label" min={14} max={36} step={1} value={[size]} onValueChange={(v) => setSize(Array.isArray(v) ? v[0] : v)} />
          </div>
          <ChoiceGroup label="Position" choices={POSITIONS} value={position} onChange={setPosition} />
          <div className="flex items-end">
            <Button size="lg" className="h-10 w-full" disabled={!segments.length} onClick={() => downloadSrt(video.fileName, segments)}>
              <Download /> Export .srt
            </Button>
          </div>
        </section>

        <section aria-labelledby="timeline-title" className="rounded-2xl border bg-card shadow-soft">
          <h2 id="timeline-title" className="border-b px-5 py-3 font-semibold">
            Subtitle timeline
          </h2>
          {loading ? (
            <LoadingState label="Transcribing…" />
          ) : error ? (
            <ErrorState className="m-4" title="Couldn't load subtitles" description={error} onRetry={reload} />
          ) : (
            <ol className="max-h-96 overflow-y-auto p-2">
              {segments.map((s, i) => {
                const active = current === s
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => usePlayer.getState().seek(s.start, { play: false })}
                      className={cn("flex w-full gap-3 rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-muted/60 focus-visible:bg-muted", active && "bg-secondary")}
                    >
                      <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                        {timestamp(s.start)}–{timestamp(s.end)}
                      </span>
                      <span>
                        {s.text.split(" ").map((w, j) => (
                          <span key={j} className={cn(isKeyword(w) && "font-semibold text-primary")}>
                            {w}{" "}
                          </span>
                        ))}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}

function CaptionOverlay({ text, style, font, size, position, platform }: { text: string; style: Style; font: string; size: number; position: Position; platform: string }) {
  // Keep clear of each platform's UI chrome (right rail, bottom caption area).
  const bottomSafe = platform === "tiktok" ? "bottom-[22%]" : platform === "instagram" ? "bottom-[18%]" : "bottom-[14%]"
  const pos = position === "top" ? "top-[14%]" : position === "middle" ? "top-1/2 -translate-y-1/2" : bottomSafe
  const words = text.split(" ").slice(0, 10)
  return (
    <div className={cn("absolute inset-x-4 pr-10 text-center", pos)} style={{ fontFamily: font, fontSize: size, lineHeight: 1.25 }}>
      {style === "minimal" && <span className="text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.8)]">{words.join(" ")}</span>}
      {style === "bold" && <span className="font-black text-white uppercase [-webkit-text-stroke:1px_black] [text-shadow:0_3px_0_black]">{words.join(" ")}</span>}
      {style === "dynamic" && (
        <span className="font-extrabold text-white [text-shadow:0_2px_6px_rgb(0_0_0/0.9)]">
          {words.map((w, i) => (
            <span key={i} className={isKeyword(w) ? "text-yellow-300" : undefined}>
              {w}{" "}
            </span>
          ))}
        </span>
      )}
      {style === "creator" && (
        <span className="box-decoration-clone rounded-md bg-white px-2 py-0.5 font-bold text-zinc-900">
          {words.map((w, i) => (
            <span key={i} className={isKeyword(w) ? "text-violet-600" : undefined}>
              {w}{" "}
            </span>
          ))}
        </span>
      )}
      {style === "educational" && (
        <span className="box-decoration-clone rounded-md bg-black/70 px-2 py-0.5 font-semibold text-white">
          {words.map((w, i) => (
            <span key={i} className={isKeyword(w) ? "underline decoration-sky-400 decoration-2 underline-offset-4" : undefined}>
              {w}{" "}
            </span>
          ))}
        </span>
      )}
    </div>
  )
}
