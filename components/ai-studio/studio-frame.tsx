"use client"

import { FileVideo, FlaskConical, RefreshCw } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { fileSize, timestamp } from "@/lib/format"
import { useVideoStore, type ActiveVideo } from "@/lib/store/video-store"
import { VideoUploader } from "./video-uploader"

/** Page frame for AI Studio tools: header, active-video bar, demo disclosure, and an upload gate. */
export function StudioFrame({ title, description, children }: { title: string; description: string; children: (video: ActiveVideo) => React.ReactNode }) {
  const active = useVideoStore((s) => s.active)
  const clear = useVideoStore((s) => s.clear)
  const [replacing, setReplacing] = useState(false)

  return (
    <div>
      <PageHeader back={{ href: "/ai-studio", label: "AI Studio" }} title={title} description={description} />
      {!active || replacing ? (
        <div className="mx-auto max-w-2xl">
          <VideoUploader onReady={() => setReplacing(false)} />
          {replacing && (
            <Button variant="ghost" className="mt-3" onClick={() => setReplacing(false)}>
              Cancel
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <FileVideo className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{active.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {timestamp(active.durationSeconds)}
                {active.sizeBytes ? ` · ${fileSize(active.sizeBytes)}` : ""}
                {active.sourceUrl ? " · from URL" : ""}
              </p>
            </div>
            {active.source === "demo" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                <FlaskConical className="size-3.5" /> Demo data — results are not from your video
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setReplacing(true)}>
              <RefreshCw /> Change video
            </Button>
            <Button variant="ghost" size="sm" onClick={clear}>
              Remove
            </Button>
          </div>
          {children(active)}
        </>
      )}
    </div>
  )
}
