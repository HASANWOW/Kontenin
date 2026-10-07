"use client"

import { Bookmark, BookmarkCheck, Download, Pencil, Play, Scissors } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { AIProcessing } from "@/components/shared/ai-processing"
import { scoreTone } from "@/components/shared/score-ring"
import { SourceBadge } from "@/components/shared/source-badge"
import { EmptyState, ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVideoData } from "@/hooks/use-video-data"
import type { VideoClip } from "@/lib/ai/schemas"
import { timestamp } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { usePlayer } from "@/lib/store/player-store"
import { useVideoStore, type ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

export function ClipGenerator() {
  return (
    <StudioFrame title="Generate Clips" description="Short clips ranked by viral potential. Preview, adjust, save, and export the timestamps to your editor.">
      {(video) => <ClipBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

/** Plain-text cut list you can follow in CapCut/Premiere — real export, no rendering needed. */
function exportCutList(video: ActiveVideo, clips: VideoClip[]) {
  const lines = [`Kontenin cut list — ${video.fileName}`, ""]
  clips.forEach((c, i) => {
    lines.push(`${i + 1}. ${c.title}`)
    lines.push(`   ${timestamp(c.start)} → ${timestamp(c.end)} (${Math.round(c.end - c.start)}s) · viral score ${c.viralScore} · ${c.platforms.join(" / ")}`)
    lines.push("")
  })
  const blob = new Blob([lines.join("\n")], { type: "text/plain" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `${video.fileName.replace(/\.[^.]+$/, "")}-clips.txt`
  a.click()
  URL.revokeObjectURL(a.href)
}

function ClipBody({ video }: { video: ActiveVideo }) {
  const { data, loading, error, reload } = useVideoData("clips")
  const savedIds = useAppStore((s) => s.savedClipIds)
  const toggleClip = useAppStore((s) => s.toggleClip)
  const [editing, setEditing] = useState<VideoClip | null>(null)

  function preview(c: VideoClip) {
    usePlayer.getState().seek(c.start, { stopAt: c.end })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function saveEdit(updated: VideoClip) {
    if (!data) return
    useVideoStore.getState().setClips(data.map((c) => (c.id === updated.id ? updated : c)))
    setEditing(null)
    toast.success("Clip updated")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <VideoStage video={video} />
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="font-semibold">How clips are chosen</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• A self-contained idea that makes sense without the rest of the video</li>
            <li>• A strong opening line inside the first 3 seconds of the clip</li>
            <li>• 20–60 seconds, ideal for TikTok, Reels and Shorts</li>
          </ul>
          {data && data.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="lg" className="h-10" onClick={() => exportCutList(video, data)}>
                <Download /> Export all timestamps
              </Button>
            </div>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Export downloads a cut list (.txt). Rendering finished clip files isn&apos;t part of Kontenin — cut them in your editor.</p>
        </div>
      </div>

      {loading ? (
        <AIProcessing steps={["Scanning the transcript…", "Finding self-contained ideas…", "Scoring viral potential…"]} />
      ) : error ? (
        <ErrorState title="Couldn't generate clips" description={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState icon={Scissors} title="No clips found" description="Try a longer video with several distinct points." />
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{data.length} suggested clips</h2>
            <SourceBadge source={video.source} provider={video.provider} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((c, i) => {
              const saved = savedIds.includes(c.id)
              const tone = scoreTone(c.viralScore)
              return (
                <article key={c.id} className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
                  <button type="button" onClick={() => preview(c)} className="group relative aspect-[9/12] max-h-56 w-full overflow-hidden bg-zinc-900 outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`Preview clip: ${c.title}`}>
                    <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(${(260 + i * 35) % 360} 70% 45%), hsl(${(300 + i * 35) % 360} 70% 25%))` }} />
                    <span className="absolute inset-x-4 top-4 line-clamp-3 text-left text-lg leading-snug font-bold text-white drop-shadow">{c.title}</span>
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 font-mono text-xs text-white">
                      {timestamp(c.start)}–{timestamp(c.end)}
                    </span>
                    <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/90 text-zinc-900 transition-transform group-hover:scale-110">
                      <Play className="ml-0.5 size-4 fill-current" />
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm font-semibold", tone.text)}>Viral Score: {c.viralScore}/100</span>
                      <span className="text-xs text-muted-foreground">{Math.round(c.end - c.start)} sec</span>
                    </div>
                    <h3 className="mt-1 font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.reason}</p>
                    <p className="mt-2 text-xs">
                      <span className="text-muted-foreground">Platform: </span>
                      <span className="font-medium">{c.platforms.join(" / ")}</span>
                    </p>
                    <div className="mt-auto grid grid-cols-4 gap-1.5 pt-4">
                      <Button size="sm" variant="outline" onClick={() => preview(c)}>
                        <Play /> <span className="sr-only sm:not-sr-only">Preview</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                        <Pencil /> <span className="sr-only sm:not-sr-only">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-pressed={saved}
                        onClick={() => {
                          toggleClip(c.id)
                          toast(saved ? "Clip removed from saved" : "Clip saved")
                        }}
                      >
                        {saved ? <BookmarkCheck className="text-primary" /> : <Bookmark />} <span className="sr-only sm:not-sr-only">{saved ? "Saved" : "Save"}</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => exportCutList(video, [c])}>
                        <Download /> <span className="sr-only sm:not-sr-only">Export</span>
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}

      <EditClipDialog clip={editing} max={video.durationSeconds} onClose={() => setEditing(null)} onSave={saveEdit} />
    </div>
  )
}

function EditClipDialog({ clip, max, onClose, onSave }: { clip: VideoClip | null; max: number; onClose: () => void; onSave: (c: VideoClip) => void }) {
  return (
    <Dialog open={Boolean(clip)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">{clip && <EditClipForm key={clip.id} clip={clip} max={max} onClose={onClose} onSave={onSave} />}</DialogContent>
    </Dialog>
  )
}

function EditClipForm({ clip, max, onClose, onSave }: { clip: VideoClip; max: number; onClose: () => void; onSave: (c: VideoClip) => void }) {
  const [title, setTitle] = useState(clip.title)
  const [start, setStart] = useState(String(Math.round(clip.start)))
  const [end, setEnd] = useState(String(Math.round(clip.end)))
  const s = Number(start)
  const e = Number(end)
  const invalid = !title.trim() || !Number.isFinite(s) || !Number.isFinite(e) || s < 0 || e <= s || e > Math.max(max, e)
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!invalid) onSave({ ...clip, title: title.trim(), start: s, end: e })
      }}
    >
      <DialogHeader>
        <DialogTitle>Edit clip</DialogTitle>
        <DialogDescription>Adjust the title and trim points (in seconds).</DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="clip-title">Title</Label>
          <Input id="clip-title" value={title} onChange={(ev) => setTitle(ev.target.value)} maxLength={120} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="clip-start">Start (s)</Label>
            <Input id="clip-start" type="number" min={0} value={start} onChange={(ev) => setStart(ev.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clip-end">End (s)</Label>
            <Input id="clip-end" type="number" min={1} value={end} onChange={(ev) => setEnd(ev.target.value)} />
          </div>
        </div>
        {invalid && <p className="text-xs text-destructive">End must be after start, and the title can&apos;t be empty.</p>}
        {!invalid && <p className="text-xs text-muted-foreground">Length: {e - s}s</p>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={invalid}>
          Save changes
        </Button>
      </DialogFooter>
    </form>
  )
}
