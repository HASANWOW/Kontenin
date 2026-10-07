"use client"

import { CheckCircle2, Lightbulb, XCircle } from "lucide-react"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { SourceBadge } from "@/components/shared/source-badge"
import { engagementRate } from "@/lib/data/analytics"
import { fullNumber, percent } from "@/lib/format"
import type { PerformanceInsight } from "@/lib/ai/schemas"
import type { ContentPerformance } from "@/types/domain"

/** Per-video breakdown compared against the creator's own averages — plain arithmetic. */
export function ContentDetail({ item, all }: { item: ContentPerformance; all: ContentPerformance[] }) {
  const er = engagementRate(item)
  const avgEr = all.reduce((s, c) => s + engagementRate(c), 0) / all.length
  const avgViews = all.reduce((s, c) => s + c.views, 0) / all.length
  const retention = item.avgWatchSeconds / item.durationSeconds
  const avgRetention = all.reduce((s, c) => s + c.avgWatchSeconds / c.durationSeconds, 0) / all.length

  const worked: string[] = []
  const didnt: string[] = []
  if (er > avgEr) worked.push(`Engagement is ${percent(er / avgEr - 1, 0)} above your average.`)
  else didnt.push(`Engagement is ${percent(1 - er / avgEr, 0)} below your average.`)
  if (item.views > avgViews) worked.push(`Views are ${percent(item.views / avgViews - 1, 0)} above your average.`)
  else didnt.push(`Views are ${percent(1 - item.views / avgViews, 0)} below your average.`)
  if (retention >= avgRetention) worked.push(`Viewers watched ${percent(retention, 0)} of the video on average — better than usual.`)
  else didnt.push(`Average watch-through is ${percent(retention, 0)}, below your usual ${percent(avgRetention, 0)}.`)
  if (item.shares / item.views > 0.015) worked.push("High share rate — this topic is worth a follow-up.")

  const next =
    retention < avgRetention
      ? item.durationSeconds > 45
        ? "Cut this format down to under 35 seconds and lead with the result."
        : "Tighten the first 3 seconds — test a question-based hook."
      : er > avgEr
        ? "Make a part 2 or a reply-to-comment video on this topic this week."
        : "Keep the format but try a stronger CTA asking a specific question."

  const metrics = [
    { l: "Views", v: fullNumber(item.views) },
    { l: "Likes", v: fullNumber(item.likes) },
    { l: "Comments", v: fullNumber(item.comments) },
    { l: "Shares", v: fullNumber(item.shares) },
    { l: "Engagement rate", v: percent(er) },
    { l: "Avg. watch time", v: `${item.avgWatchSeconds}s / ${item.durationSeconds}s` },
  ]

  return (
    <div>
      <div className="flex items-start gap-3">
        <PlatformBadge platform={item.platform} withLabel />
        <span className="ml-auto text-xs text-muted-foreground">{new Date(`${item.publishedAt}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
      <h3 className="mt-2 font-semibold">{item.title}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.l} className="rounded-xl bg-muted/50 p-3">
            <dt className="text-xs text-muted-foreground">{m.l}</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{m.v}</dd>
          </div>
        ))}
      </dl>
      <InsightLists insight={{ worked, didnt, next: [next] }} />
      <p className="mt-3 text-xs text-muted-foreground">Calculated from this video&apos;s metrics compared with your last {all.length} videos.</p>
    </div>
  )
}

export function InsightLists({ insight, source, provider }: { insight: PerformanceInsight; source?: "ai" | "demo"; provider?: string }) {
  return (
    <div className="mt-4 space-y-4">
      {source && <SourceBadge source={source} provider={provider} />}
      <InsightBlock title="What worked?" items={insight.worked} icon={<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />} />
      <InsightBlock title="What didn't?" items={insight.didnt} icon={<XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />} />
      <InsightBlock title="What should you do next?" items={insight.next} icon={<Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />} />
    </div>
  )
}

function InsightBlock({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (!items.length) return null
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-sm">
            {icon} {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
