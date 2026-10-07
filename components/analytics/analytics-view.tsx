"use client"

import { ArrowDownRight, ArrowUpRight, Clock, Eye, FlaskConical, Heart, MessageCircle, Share2, Sparkles, TrendingUp, Users, type LucideIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { analyzePerformanceAction } from "@/app/actions/ai"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { PageHeader } from "@/components/shared/page-header"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useAIAction } from "@/hooks/use-ai-action"
import { CONTENT_PERFORMANCE, dailySeries, engagementRate, platformBreakdown } from "@/lib/data/analytics"
import { compactNumber, fullNumber, percent } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ContentPerformance } from "@/types/domain"
import { ContentDetail, InsightLists } from "./performance-panel"

const chartFallback = <Skeleton className="h-[220px] w-full rounded-xl" />
const ViewsChart = dynamic(() => import("./analytics-charts").then((m) => m.ViewsChart), { ssr: false, loading: () => chartFallback })
const EngagementChart = dynamic(() => import("./analytics-charts").then((m) => m.EngagementChart), { ssr: false, loading: () => chartFallback })
const TopContentChart = dynamic(() => import("./analytics-charts").then((m) => m.TopContentChart), { ssr: false, loading: () => chartFallback })
const PlatformChart = dynamic(() => import("./analytics-charts").then((m) => m.PlatformChart), { ssr: false, loading: () => chartFallback })

type Range = "7" | "30" | "90"
const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const

function sum<T>(xs: T[], f: (x: T) => number) {
  return xs.reduce((s, x) => s + f(x), 0)
}

export function AnalyticsView() {
  const [range, setRange] = useState<Range>("30")
  const [selected, setSelected] = useState<ContentPerformance | null>(null)
  const series = useMemo(() => dailySeries(new Date(), 180), [])
  const insight = useAIAction(analyzePerformanceAction, { errorToast: false })
  const { run: runInsight } = insight

  const n = Number(range)
  const current = series.slice(-n)
  const previous = series.slice(-2 * n, -n)
  const views = sum(current, (d) => d.views)
  const prevViews = sum(previous, (d) => d.views)
  const followers = current[current.length - 1].followers
  const gained = followers - (previous[previous.length - 1]?.followers ?? current[0].followers)
  const prevGained = (previous[previous.length - 1]?.followers ?? 0) - (series[series.length - 2 * n - 1]?.followers ?? previous[0]?.followers ?? 0)
  const eng = sum(current, (d) => d.engagement) / current.length
  const prevEng = previous.length ? sum(previous, (d) => d.engagement) / previous.length : eng
  const watchHours = Math.round(sum(current, (d) => d.watchMinutes) / 60)
  const prevWatch = Math.round(sum(previous, (d) => d.watchMinutes) / 60)

  const likes = sum(CONTENT_PERFORMANCE, (c) => c.likes)
  const comments = sum(CONTENT_PERFORMANCE, (c) => c.comments)
  const shares = sum(CONTENT_PERFORMANCE, (c) => c.shares)

  const top = [...CONTENT_PERFORMANCE].sort((a, b) => b.views - a.views).slice(0, 5).map((c) => ({ name: c.title.length > 26 ? `${c.title.slice(0, 26)}…` : c.title, views: c.views }))
  const platforms = platformBreakdown()

  useEffect(() => {
    void runInsight({
      items: CONTENT_PERFORMANCE.map((c) => ({
        title: c.title,
        views: c.views,
        engagementRate: engagementRate(c),
        durationSeconds: c.durationSeconds,
        hookType: c.hookType,
        format: c.format,
      })),
    })
  }, [runInsight])

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Understand what's working across your platforms."
        actions={<ChoiceGroup label="Date range" hideLabel choices={RANGES} value={range} onChange={setRange} />}
      />

      <div className="mb-5 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p>
          <span className="font-semibold">Demo analytics.</span> Platform accounts aren&apos;t connected yet, so these numbers are a fixed sample dataset (they don&apos;t change between visits). Insights are computed from this data.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Eye} label="Total Views" value={compactNumber(views)} delta={prevViews ? views / prevViews - 1 : null} />
        <Kpi icon={Users} label="Followers" value={fullNumber(followers)} sub={`+${fullNumber(gained)} this period`} delta={prevGained > 0 ? gained / prevGained - 1 : null} />
        <Kpi icon={TrendingUp} label="Engagement" value={`${eng.toFixed(1)}%`} delta={prevEng ? eng / prevEng - 1 : null} />
        <Kpi icon={Clock} label="Watch Time" value={`${fullNumber(watchHours)} h`} delta={prevWatch ? watchHours / prevWatch - 1 : null} />
        <Kpi icon={Heart} label="Likes" value={compactNumber(likes)} sub="last 10 videos" />
        <Kpi icon={MessageCircle} label="Comments" value={compactNumber(comments)} sub="last 10 videos" />
        <Kpi icon={Share2} label="Shares" value={compactNumber(shares)} sub="last 10 videos" />
        <Kpi icon={Sparkles} label="Avg. views / video" value={compactNumber(Math.round(sum(CONTENT_PERFORMANCE, (c) => c.views) / CONTENT_PERFORMANCE.length))} sub="last 10 videos" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Views over time" className="xl:col-span-2">
          <ViewsChart data={current} />
        </ChartCard>
        <ChartCard title="AI insights">
          {insight.pending || (!insight.data && !insight.error) ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : insight.error ? (
            <p className="text-sm text-destructive">{insight.error}</p>
          ) : insight.data ? (
            <InsightLists insight={insight.data} source={insight.source ?? undefined} provider={insight.provider ?? undefined} />
          ) : null}
        </ChartCard>
        <ChartCard title="Engagement rate">
          <EngagementChart data={current} />
        </ChartCard>
        <ChartCard title="Top performing content">
          <TopContentChart data={top} />
        </ChartCard>
        <ChartCard title="Platform performance">
          <PlatformChart data={platforms} />
        </ChartCard>
      </div>

      <section aria-labelledby="content-perf" className="mt-6 rounded-2xl border bg-card shadow-soft">
        <div className="border-b p-5">
          <h2 id="content-perf" className="font-semibold">
            Content performance
          </h2>
          <p className="text-sm text-muted-foreground">Select a video for a breakdown and next steps.</p>
        </div>
        {/* Table on desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="px-5 py-3 font-medium">Content</th>
                <th className="px-3 py-3 text-right font-medium">Views</th>
                <th className="px-3 py-3 text-right font-medium">Likes</th>
                <th className="px-3 py-3 text-right font-medium">Comments</th>
                <th className="px-3 py-3 text-right font-medium">Shares</th>
                <th className="px-3 py-3 text-right font-medium">Eng. rate</th>
                <th className="px-5 py-3 text-right font-medium">Avg. watch</th>
              </tr>
            </thead>
            <tbody>
              {CONTENT_PERFORMANCE.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <button type="button" onClick={() => setSelected(c)} className="flex items-center gap-2.5 text-left font-medium outline-none hover:text-primary focus-visible:text-primary">
                      <PlatformBadge platform={c.platform} />
                      <span className="line-clamp-1">{c.title}</span>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{fullNumber(c.views)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fullNumber(c.likes)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fullNumber(c.comments)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fullNumber(c.shares)}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums">{percent(engagementRate(c))}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.avgWatchSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Cards on mobile */}
        <ul className="divide-y md:hidden">
          {CONTENT_PERFORMANCE.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setSelected(c)} className="w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={c.platform} />
                  <span className="line-clamp-1 text-sm font-medium">{c.title}</span>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground tabular-nums">
                  <span>{compactNumber(c.views)} views</span>
                  <span>{percent(engagementRate(c))} ER</span>
                  <span>{c.avgWatchSeconds}s watch</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle className="sr-only">Content performance</DialogTitle>
          {selected && <ContentDetail item={selected} all={CONTENT_PERFORMANCE} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Kpi({ icon: Icon, label, value, sub, delta }: { icon: LucideIcon; label: string; value: string; sub?: string; delta?: number | null }) {
  const up = (delta ?? 0) >= 0
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Icon className="size-4" /> {label}
        </span>
        {delta !== undefined && delta !== null && (
          <span className={cn("inline-flex items-center text-xs font-semibold", up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta * 100).toFixed(0)}%
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{sub ?? "vs. previous period"}</div>
    </div>
  )
}

function ChartCard({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-soft", className)}>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  )
}
