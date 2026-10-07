"use client"

import { Bookmark, BookmarkCheck, CalendarPlus, Clock, Lightbulb, PenLine, RefreshCw, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { generateIdeasAction } from "@/app/actions/ai"
import { DifficultyPill } from "@/components/learning/course-card"
import { AIProcessing } from "@/components/shared/ai-processing"
import { InputField, SelectField } from "@/components/shared/form-field"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import type { ContentIdea } from "@/lib/ai/schemas"
import { GOAL_SELECT, NICHE_SELECT, PLATFORM_SELECT, platformLabel, STYLE_SELECT } from "@/lib/data/create-options"
import { localDate } from "@/lib/format"
import { putHandoff } from "@/lib/handoff"
import { useAppStore } from "@/lib/store/app-store"
import type { PlatformId } from "@/types/domain"
import { ToolEmpty, ToolShell } from "./tool-shell"

export function IdeaGenerator() {
  const profile = useAppStore((s) => s.creatorProfile)
  const savedIdeas = useAppStore((s) => s.savedIdeas)
  const saveIdea = useAppStore((s) => s.saveIdea)
  const removeIdea = useAppStore((s) => s.removeIdea)
  const addPlannerItem = useAppStore((s) => s.addPlannerItem)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const router = useRouter()

  const defaultNiche = NICHE_SELECT.find((n) => profile?.niche.toLowerCase().startsWith(n.value.toLowerCase()))?.value ?? "Lifestyle"
  const [niche, setNiche] = useState(defaultNiche)
  const [platform, setPlatform] = useState<string>("tiktok")
  const [audience, setAudience] = useState("Mahasiswa")
  const [style, setStyle] = useState<string>("educational")
  const [goal, setGoal] = useState<string>(profile?.goal && GOAL_SELECT.some((g) => g.value === profile.goal) ? profile.goal : "Grow followers")
  const [variant, setVariant] = useState(0)
  const [showSaved, setShowSaved] = useState(false)
  const ai = useAIAction(generateIdeasAction)

  async function generate(nextVariant = variant) {
    const res = await ai.run({ niche, platform: platformLabel(platform), audience, style, goal, variant: nextVariant })
    if (res) {
      recordAIUse(`Generated ${res.length} content ideas for ${niche}`)
      setShowSaved(false)
    }
  }

  function regenerate() {
    const v = variant + 1
    setVariant(v)
    generate(v)
  }

  const isSaved = (id: string) => savedIdeas.some((i) => i.id === id)

  function toggleSave(idea: ContentIdea) {
    if (isSaved(idea.id)) {
      removeIdea(idea.id)
      toast("Removed from saved ideas")
    } else {
      saveIdea({ ...idea, savedAt: new Date().toISOString(), niche, platform })
      toast.success("Idea saved")
    }
  }

  function toPlanner(idea: ContentIdea) {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    addPlannerItem({ title: idea.title, platform: platform as PlatformId, type: "video", status: "idea", date: localDate(d), notes: `Hook: ${idea.hook}` })
    toast.success("Added to Planner as an idea", { action: { label: "Open", onClick: () => router.push("/planner") } })
  }

  function toScript(idea: ContentIdea) {
    putHandoff("script", { topic: idea.title, platform, cta: idea.cta })
    router.push("/create/script")
  }

  const list: ContentIdea[] = showSaved ? savedIdeas : (ai.data ?? [])

  return (
    <ToolShell
      title="Content Idea Generator"
      description="10 ideas tailored to your niche, audience, and goal — each with a ready-to-use hook."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <SelectField label="Niche" value={niche} onChange={setNiche} options={NICHE_SELECT} />
          <SelectField label="Platform" value={platform} onChange={setPlatform} options={PLATFORM_SELECT} />
          <InputField label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. College students" maxLength={80} />
          <SelectField label="Content style" value={style} onChange={setStyle} options={STYLE_SELECT} />
          <SelectField label="Goal" value={goal} onChange={setGoal} options={GOAL_SELECT} />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Generating…" : "Generate Ideas"}
          </Button>
          <button type="button" onClick={() => setShowSaved((s) => !s)} className="w-full text-center text-sm font-medium text-primary hover:underline">
            {showSaved ? "Back to generated ideas" : `View saved ideas (${savedIdeas.length})`}
          </button>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Understanding your niche…", "Finding audience problems…", "Matching formats to your goal…", "Writing hooks…"]} />
      ) : ai.error && !ai.data && !showSaved ? (
        <ErrorState title="Couldn't generate ideas" description={ai.error} onRetry={() => generate()} />
      ) : list.length === 0 ? (
        <ToolEmpty
          icon={Lightbulb}
          title={showSaved ? "No saved ideas yet" : "Your ideas will appear here"}
          description={showSaved ? "Save ideas you like and they'll show up here." : "Fill in the form and hit Generate Ideas."}
        />
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">{showSaved ? `${list.length} saved ideas` : `${list.length} ideas for ${niche} · ${platformLabel(platform)}`}</p>
            <div className="flex items-center gap-2">
              {!showSaved && ai.source && <SourceBadge source={ai.source} provider={ai.provider ?? undefined} />}
              {!showSaved && (
                <Button variant="outline" size="sm" onClick={regenerate}>
                  <RefreshCw /> Regenerate
                </Button>
              )}
            </div>
          </div>
          <ol className="grid gap-3 xl:grid-cols-2">
            {list.map((idea, i) => (
              <motion.li
                key={idea.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                className="flex flex-col rounded-2xl border bg-card p-4 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{idea.title}</h3>
                  <button
                    type="button"
                    onClick={() => toggleSave(idea)}
                    aria-pressed={isSaved(idea.id)}
                    aria-label={isSaved(idea.id) ? "Unsave idea" : "Save idea"}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {isSaved(idea.id) ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
                  </button>
                </div>
                <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                  <span className="font-semibold text-secondary-foreground">Hook: </span>“{idea.hook}”
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{idea.angle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2.5 py-1">{idea.format}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                    <Clock className="size-3" /> {idea.duration}
                  </span>
                  <DifficultyPill level={idea.difficulty} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">CTA:</span> {idea.cta}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" onClick={() => toScript(idea)}>
                    <PenLine /> Create Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toPlanner(idea)}>
                    <CalendarPlus /> Plan
                  </Button>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      )}
    </ToolShell>
  )
}
