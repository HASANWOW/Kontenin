"use client"

import { ArrowRight, Captions, Crop, FileText, Gauge, ListChecks, Scissors, ScrollText, Search, Zap } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { PageHeader } from "@/components/shared/page-header"
import { useVideoStore } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { VideoUploader } from "./video-uploader"

const TOOLS = [
  { href: "/ai-studio/analyze", title: "Analyze My Video", body: "Score hook, clarity, pacing, value, and CTA.", icon: Gauge },
  { href: "/ai-studio/moments", title: "Find Best Moments", body: "Ask for the funniest, strongest, or most useful parts.", icon: Search },
  { href: "/ai-studio/clips", title: "Generate Clips", body: "Short clips ranked by viral potential.", icon: Scissors },
  { href: "/ai-studio/transcript", title: "Generate Transcript", body: "Searchable, timestamped, quotable.", icon: FileText },
  { href: "/ai-studio/transcript#summary", title: "Generate Summary", body: "Chapters and key points at a glance.", icon: ScrollText },
  { href: "/ai-studio/captions", title: "Generate Captions", body: "Styled subtitles with a timeline + SRT export.", icon: Captions },
  { href: "/create/hooks", title: "Generate Hook", body: "Write a stronger opening for your next cut.", icon: Zap },
  { href: "/ai-studio/analyze#score", title: "Content Score", body: "One number to track improvement over time.", icon: ListChecks },
  { href: "/ai-studio/reframe", title: "Auto Reframe", body: "Preview 16:9, 9:16, and 1:1 crops.", icon: Crop },
]

export function StudioHub() {
  const { services } = useSession()
  const active = useVideoStore((s) => s.active)

  return (
    <div>
      <PageHeader
        title="AI Studio"
        description="Upload a video you made and learn from it: scores, best moments, clips, transcripts, and captions."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="upload-title">
          <h2 id="upload-title" className="mb-3 font-semibold">
            {active ? "Active video" : "Start with a video"}
          </h2>
          {active ? (
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <p className="truncate font-medium">{active.fileName}</p>
              <p className="mt-1 text-sm text-muted-foreground">Ready for every tool on this page.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/ai-studio/analyze" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
                  Analyze now <ArrowRight className="size-4" />
                </Link>
                <button onClick={() => useVideoStore.getState().clear()} className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted">
                  Use a different video
                </button>
              </div>
            </div>
          ) : (
            <VideoUploader compact />
          )}
          <div className="mt-4 rounded-2xl border bg-secondary/40 p-4 text-sm">
            <p className="font-semibold text-secondary-foreground">Why AI Studio is part of learning</p>
            <p className="mt-1 text-muted-foreground">
              Kontenin isn&apos;t a video editor — keep editing in CapCut or Canva. AI Studio shows you <em>what</em> to improve, then sends you back to missions to practice it.
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Video AI provider: <span className="font-medium text-foreground">{services.video === "demo" ? "Demo Mode (no provider connected)" : "WayinVideo"}</span>
          </p>
        </section>
        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className="mb-3 font-semibold">
            Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t, i) => (
              <Link
                key={t.title}
                href={t.href}
                className={cn(
                  "group flex gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                  i === 0 && "sm:col-span-2"
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <t.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary">{t.title}</span>
                  <span className="block text-sm text-muted-foreground">{t.body}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
