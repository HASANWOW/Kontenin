"use client"

import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import type { PlannerItem, PlannerStatus } from "@/types/domain"
import { PlannerItemDialog, type DialogState } from "./planner-item-dialog"
import { monthGrid, STATUS_META, STATUSES, TYPE_META, weekDays, ymd } from "./planner-meta"

type View = "month" | "week"
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function PlannerView() {
  const items = useAppStore((s) => s.planner)
  const addItem = useAppStore((s) => s.addPlannerItem)
  const updateItem = useAppStore((s) => s.updatePlannerItem)
  const deleteItem = useAppStore((s) => s.deletePlannerItem)
  const [view, setView] = useState<View>("month")
  const [anchor, setAnchor] = useState(() => new Date())
  const [dialog, setDialog] = useState<DialogState>(null)
  const [statusFilter, setStatusFilter] = useState<PlannerStatus | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const today = ymd(new Date())
  const days = view === "month" ? monthGrid(anchor) : weekDays(anchor)
  const visible = useMemo(() => items.filter((i) => !statusFilter || i.status === statusFilter), [items, statusFilter])
  const byDate = useMemo(() => {
    const m = new Map<string, PlannerItem[]>()
    for (const it of visible) m.set(it.date, [...(m.get(it.date) ?? []), it])
    return m
  }, [visible])

  const counts = STATUSES.map((s) => ({ s, n: items.filter((i) => i.status === s).length }))
  const title = view === "month" ? anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : `Week of ${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`

  function shift(dir: -1 | 1) {
    const d = new Date(anchor)
    if (view === "month") d.setMonth(d.getMonth() + dir, 1)
    else d.setDate(d.getDate() + dir * 7)
    setAnchor(d)
  }

  function drop(date: string, e: React.DragEvent) {
    e.preventDefault()
    setDragOver(null)
    const id = e.dataTransfer.getData("text/plain")
    const item = items.find((i) => i.id === id)
    if (!item || item.date === date) return
    updateItem(id, { date })
    toast.success(`Moved to ${new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`, {
      action: { label: "Undo", onClick: () => updateItem(id, { date: item.date }) },
    })
  }

  return (
    <div>
      <PageHeader
        title="Content Planner"
        description="Plan videos, posts, stories, and lives. Drag items between days to reschedule."
        actions={
          <Button size="lg" className="h-10 bg-brand-gradient px-4 shadow-glow" onClick={() => setDialog({ mode: "create", date: today })}>
            <Plus /> New content
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
        <button
          type="button"
          aria-pressed={statusFilter === null}
          onClick={() => setStatusFilter(null)}
          className={cn("h-8 rounded-full border px-3 text-sm font-medium", statusFilter === null ? "border-foreground bg-foreground text-background" : "bg-card hover:border-primary/40")}
        >
          All · {items.length}
        </button>
        {counts.map(({ s, n }) => (
          <button
            key={s}
            type="button"
            aria-pressed={statusFilter === s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium",
              statusFilter === s ? "border-foreground bg-foreground text-background" : "bg-card hover:border-primary/40"
            )}
          >
            <span className={cn("size-2 rounded-full", STATUS_META[s].dot)} /> {STATUS_META[s].label} · {n}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <Button variant="outline" size="icon" aria-label={view === "month" ? "Previous month" : "Previous week"} onClick={() => shift(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label={view === "month" ? "Next month" : "Next week"} onClick={() => shift(1)}>
            <ChevronRight />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAnchor(new Date())}>
            Today
          </Button>
          <h2 className="ml-1 font-semibold" aria-live="polite">
            {title}
          </h2>
          <Tabs value={view} onValueChange={(v) => setView(v as View)} className="ml-auto">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7 border-b bg-muted/40 text-xs font-medium text-muted-foreground">
              {DAY_NAMES.map((d) => (
                <div key={d} className="px-3 py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((d) => {
                const key = ymd(d)
                const list = byDate.get(key) ?? []
                const outside = view === "month" && d.getMonth() !== anchor.getMonth()
                const isToday = key === today
                return (
                  <div
                    key={key}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(key)
                    }}
                    onDragLeave={() => setDragOver((k) => (k === key ? null : k))}
                    onDrop={(e) => drop(key, e)}
                    className={cn(
                      "group relative flex flex-col gap-1 border-r border-b p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0",
                      view === "month" ? "min-h-28" : "min-h-80",
                      outside && "bg-muted/30",
                      dragOver === key && "bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between px-1">
                      <span
                        className={cn(
                          "grid size-6 place-items-center rounded-full text-xs tabular-nums",
                          isToday ? "bg-primary font-semibold text-primary-foreground" : outside ? "text-muted-foreground/60" : "text-muted-foreground"
                        )}
                      >
                        {view === "week" ? `${d.getDate()}` : d.getDate()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDialog({ mode: "create", date: key })}
                        className="grid size-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity outline-none group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Add content on ${d.toDateString()}`}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    {list.map((it) => {
                      const Icon = TYPE_META[it.type].icon
                      return (
                        <button
                          key={it.id}
                          type="button"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", it.id)
                            e.dataTransfer.effectAllowed = "move"
                          }}
                          onClick={() => setDialog({ mode: "edit", item: it })}
                          className={cn(
                            "flex w-full cursor-grab items-start gap-1.5 rounded-md border border-l-[3px] bg-background px-1.5 py-1 text-left text-xs shadow-sm transition-shadow outline-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
                            TYPE_META[it.type].bar,
                            it.status === "published" && "opacity-60"
                          )}
                          aria-label={`${it.title}, ${TYPE_META[it.type].label}, ${STATUS_META[it.status].label}. Click to edit.`}
                        >
                          <Icon className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1">
                            <span className={cn("block font-medium", view === "month" ? "truncate" : "line-clamp-3")}>{it.title}</span>
                            <span className="mt-0.5 flex items-center gap-1">
                              <span className={cn("size-1.5 rounded-full", STATUS_META[it.status].dot)} />
                              <span className="text-[10px] text-muted-foreground">{STATUS_META[it.status].label}</span>
                            </span>
                          </span>
                          {view === "week" && <PlatformBadge platform={it.platform} />}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" /> Your calendar is empty — click a day or “New content” to plan your first video.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(TYPE_META).map(([k, t]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <t.icon className="size-3.5" /> {t.label}
          </span>
        ))}
        <span className="ml-auto">Tip: keyboard users can change dates from the edit dialog.</span>
      </div>

      <PlannerItemDialog
        state={dialog}
        onClose={() => setDialog(null)}
        onCreate={(item) => {
          addItem(item)
          toast.success("Added to your calendar")
        }}
        onUpdate={(id, patch) => {
          updateItem(id, patch)
          toast.success("Content updated")
        }}
        onDelete={(id) => {
          deleteItem(id)
          toast("Content deleted")
        }}
      />
    </div>
  )
}
