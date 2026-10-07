"use client"

import { ArrowRight, BookOpen, CornerDownLeft, Search, Target, WandSparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { COURSES } from "@/lib/data/courses"
import { MISSIONS } from "@/lib/data/missions"
import { MAIN_NAV, QUICK_LINKS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface Entry {
  href: string
  label: string
  group: string
  icon: React.ReactNode
}

const ENTRIES: Entry[] = [
  ...MAIN_NAV.map((n) => ({ href: n.href, label: n.label, group: "Pages", icon: <n.icon className="size-4" /> })),
  ...QUICK_LINKS.map((q) => ({ ...q, icon: <WandSparkles className="size-4" /> })),
  ...COURSES.map((c) => ({ href: `/learn/${c.id}`, label: c.title, group: "Courses", icon: <BookOpen className="size-4" /> })),
  ...MISSIONS.map((m) => ({ href: `/missions/${m.id}`, label: `#${m.number} ${m.title}`, group: "Missions", icon: <Target className="size-4" /> })),
]

export function CommandSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const router = useRouter()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? ENTRIES.filter((e) => e.label.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)) : ENTRIES.filter((e) => e.group !== "Missions" && e.group !== "Courses")
    return list.slice(0, 12)
  }, [query])

  function go(entry: Entry | undefined) {
    if (!entry) return
    setOpen(false)
    setQuery("")
    router.push(entry.href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      go(results[active])
    }
  }

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" })
  }, [active])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground transition-colors outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Search Kontenin"
      >
        <Search className="size-4" />
        <span className="flex-1 truncate text-left">Search lessons, missions, tools…</span>
        <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">Ctrl K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton={false}>
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              placeholder="Search pages, courses, missions…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              role="combobox"
              aria-expanded="true"
              aria-controls="command-results"
              aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
            />
          </div>
          <div ref={listRef} id="command-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{query}”.</p>}
            {results.map((r, i) => (
              <button
                key={`${r.group}-${r.href}`}
                id={`cmd-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm", i === active ? "bg-secondary text-secondary-foreground" : "text-foreground")}
              >
                <span className="text-muted-foreground">{r.icon}</span>
                <span className="flex-1 truncate">{r.label}</span>
                <span className="text-[11px] text-muted-foreground">{r.group}</span>
                {i === active ? <CornerDownLeft className="size-3.5 text-muted-foreground" /> : <ArrowRight className="size-3.5 opacity-0" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
