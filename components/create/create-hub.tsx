"use client"

import { ArrowRight, FileText, Gauge, Lightbulb, MessageSquareText, Repeat2, ScrollText, Trash2, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { CopyButton } from "@/components/shared/copy-button"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { relativeTime } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { scriptToText } from "./script-generator"

const TOOLS = [
  { href: "/create/ideas", title: "Content Idea", description: "10 ideas for your niche, audience, and goal.", icon: Lightbulb, tone: "from-amber-400 to-orange-500" },
  { href: "/create/hooks", title: "Hook Generator", description: "Scored openers that stop the scroll.", icon: Zap, tone: "from-violet-500 to-fuchsia-500" },
  { href: "/create/script", title: "Script Generator", description: "Hook → body → value → CTA, timed.", icon: FileText, tone: "from-sky-400 to-indigo-500" },
  { href: "/create/caption", title: "Caption Generator", description: "Six styles plus hashtag picks.", icon: MessageSquareText, tone: "from-pink-400 to-rose-500" },
  { href: "/create/brief", title: "Content Brief", description: "One-page plan: goal, audience, shots, CTA.", icon: ScrollText, tone: "from-emerald-400 to-teal-500" },
  { href: "/create/repurpose", title: "Content Repurposer", description: "Turn one video into posts for 3 platforms.", icon: Repeat2, tone: "from-cyan-400 to-blue-500" },
  { href: "/create/analyze", title: "Analyze My Content", description: "Score a script before you record.", icon: Gauge, tone: "from-purple-500 to-violet-600" },
]

export function CreateHub() {
  const ideas = useAppStore((s) => s.savedIdeas)
  const hooks = useAppStore((s) => s.savedHooks)
  const scripts = useAppStore((s) => s.savedScripts)
  const removeIdea = useAppStore((s) => s.removeIdea)
  const removeHook = useAppStore((s) => s.removeHook)
  const removeScript = useAppStore((s) => s.removeScript)

  return (
    <div>
      <PageHeader title="Create" description="Your content workspace. Go from idea to a recorded-ready script in minutes." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TOOLS.map((t, i) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50",
              i === 0 && "xl:col-span-2"
            )}
          >
            <span className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft", t.tone)}>
              <t.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section aria-labelledby="library" className="mt-10">
        <h2 id="library" className="mb-3 font-semibold">
          Your library
        </h2>
        <Tabs defaultValue="ideas" className="rounded-2xl border bg-card p-5 shadow-soft">
          <TabsList>
            <TabsTrigger value="ideas">
              Ideas <Badge variant="secondary">{ideas.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="hooks">
              Hooks <Badge variant="secondary">{hooks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="scripts">
              Scripts <Badge variant="secondary">{scripts.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ideas" className="mt-4">
            <LibraryList
              empty="Saved ideas show up here."
              cta={{ href: "/create/ideas", label: "Generate ideas" }}
              items={ideas.map((i) => ({ id: i.id, title: i.title, sub: `Hook: ${i.hook}`, at: i.savedAt, copy: `${i.title}\n${i.hook}` }))}
              onRemove={(id) => {
                removeIdea(id)
                toast("Idea removed")
              }}
            />
          </TabsContent>
          <TabsContent value="hooks" className="mt-4">
            <LibraryList
              empty="Saved hooks show up here."
              cta={{ href: "/create/hooks", label: "Generate hooks" }}
              items={hooks.map((h) => ({ id: h.id, title: h.text, sub: `Score ${h.score} · ${h.topic}`, at: h.savedAt, copy: h.text }))}
              onRemove={(id) => {
                removeHook(id)
                toast("Hook removed")
              }}
            />
          </TabsContent>
          <TabsContent value="scripts" className="mt-4">
            <LibraryList
              empty="Saved scripts show up here."
              cta={{ href: "/create/script", label: "Write a script" }}
              items={scripts.map((s) => ({ id: s.id, title: s.title, sub: `${s.wordCount} words · ~${s.estimatedSeconds}s`, at: s.savedAt, copy: scriptToText(s) }))}
              onRemove={(id) => {
                removeScript(id)
                toast("Script removed")
              }}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

function LibraryList({
  items,
  empty,
  cta,
  onRemove,
}: {
  items: { id: string; title: string; sub: string; at: string; copy: string }[]
  empty: string
  cta: { href: string; label: string }
  onRemove: (id: string) => void
}) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-8 text-center text-sm text-muted-foreground">
        {empty}
        <Link href={cta.href} className="mt-2 font-medium text-primary hover:underline">
          {cta.label} →
        </Link>
      </div>
    )
  }
  return (
    <ul className="divide-y">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{i.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {i.sub} · {relativeTime(i.at)}
            </p>
          </div>
          <CopyButton text={i.copy} size="icon-sm" variant="ghost" />
          <Button variant="ghost" size="icon-sm" aria-label="Remove" onClick={() => onRemove(i.id)}>
            <Trash2 />
          </Button>
        </li>
      ))}
    </ul>
  )
}
