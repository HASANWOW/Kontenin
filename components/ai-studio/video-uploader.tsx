"use client"

import { FileVideo, Link2, Loader2, UploadCloud, Wand2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fileSize } from "@/lib/format"
import { callVideoApi } from "@/lib/video/client"
import type { VideoRef } from "@/lib/video/types"
import { SAMPLE_VIDEO, useVideoStore, type ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"

const MAX_BYTES = 500 * 1024 * 1024
const ACCEPT = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"]

function readDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const v = document.createElement("video")
    v.preload = "metadata"
    v.onloadedmetadata = () => resolve(Number.isFinite(v.duration) ? v.duration : 0)
    v.onerror = () => resolve(0)
    v.src = url
  })
}

/** Drag & drop / file picker / URL / sample. Calls /api/video/upload and sets the active video. */
export function VideoUploader({ onReady, compact }: { onReady?: (v: ActiveVideo) => void; compact?: boolean }) {
  const { services } = useSession()
  const setActive = useVideoStore((s) => s.setActive)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function register(meta: { fileName: string; sizeBytes: number; mimeType: string; durationSeconds: number; sourceUrl?: string }, extra: Partial<ActiveVideo>, file?: File) {
    setError(null)
    let body: unknown = meta
    if (file && services.video !== "demo") {
      const form = new FormData()
      form.append("file", file)
      form.append("meta", JSON.stringify(meta))
      body = form
    }
    const res = await callVideoApi<VideoRef>("upload", body)
    if (!res.ok) {
      setError(res.error)
      toast.error(res.error)
      return
    }
    const active: ActiveVideo = { ...res.data, sizeBytes: meta.sizeBytes, sourceUrl: meta.sourceUrl, isSample: false, provider: res.provider, source: res.source, ...extra }
    setActive(active)
    onReady?.(active)
  }

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!ACCEPT.includes(file.type)) {
      setError("Unsupported format. Upload an MP4, MOV, or WebM video.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`This file is ${fileSize(file.size)}. The limit is 500 MB.`)
      return
    }
    setBusy("Uploading…")
    try {
      const objectUrl = URL.createObjectURL(file)
      const durationSeconds = await readDuration(objectUrl)
      await register({ fileName: file.name, sizeBytes: file.size, mimeType: file.type, durationSeconds }, { objectUrl }, file)
    } finally {
      setBusy(null)
    }
  }

  async function handleUrl() {
    try {
      new URL(url)
    } catch {
      setError("Enter a valid video URL (https://…).")
      return
    }
    setBusy("Importing…")
    await register({ fileName: url.split("/").pop() || "video-from-url", sizeBytes: 0, mimeType: "video/mp4", durationSeconds: 0, sourceUrl: url }, {})
    setBusy(null)
  }

  async function useSample() {
    setBusy("Loading sample…")
    await register({ ...SAMPLE_VIDEO, mimeType: "video/mp4" }, { isSample: true })
    setBusy(null)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card text-center transition-colors",
          compact ? "px-4 py-8" : "px-6 py-14",
          dragging ? "border-primary bg-secondary/60" : "border-border"
        )}
      >
        {busy ? (
          <div role="status" className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-medium">{busy}</p>
          </div>
        ) : (
          <>
            <div className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <UploadCloud className="size-7" />
            </div>
            <p className="mt-4 font-semibold">Drag & drop your video here</p>
            <p className="mt-1 text-sm text-muted-foreground">MP4, MOV or WebM · up to 500 MB</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button size="lg" className="h-10" onClick={() => inputRef.current?.click()}>
                <FileVideo /> Choose file
              </Button>
              <Button size="lg" variant="outline" className="h-10" onClick={useSample}>
                <Wand2 /> Try sample video
              </Button>
            </div>
            <input ref={inputRef} type="file" accept={ACCEPT.join(",")} className="sr-only" aria-label="Upload video file" onChange={(e) => handleFile(e.target.files?.[0])} />
          </>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste a video URL" aria-label="Video URL" className="h-10 bg-card pl-9" disabled={Boolean(busy)} />
        </div>
        <Button variant="outline" size="lg" className="h-10" onClick={handleUrl} disabled={!url.trim() || Boolean(busy)}>
          Import
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {services.video === "demo" && (
        <p className="text-xs text-muted-foreground">
          Demo Mode: your file stays in this browser for preview. Analysis results use a labeled sample dataset — no video AI provider is connected.
        </p>
      )}
    </div>
  )
}
