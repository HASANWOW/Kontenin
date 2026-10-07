"use client"

import { CalendarPlus, Camera, Flag, ListOrdered, ScrollText, Sparkles, Target, Users, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { generateBriefAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { CopyButton } from "@/components/shared/copy-button"
import { InputField, SelectField, TextareaField } from "@/components/shared/form-field"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import type { ContentBrief } from "@/lib/ai/schemas"
import { GOAL_SELECT, PLATFORM_SELECT, platformLabel } from "@/lib/data/create-options"
import { localDate } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import type { PlatformId } from "@/types/domain"
import { ToolEmpty, ToolShell } from "./tool-shell"

function briefToText(b: ContentBrief) {
  return [
    `BRIEF: ${b.title}`,
    `Objective: ${b.objective}`,
    `Audience: ${b.audience}`,
    `Key message: ${b.keyMessage}`,
    `Hook options:\n${b.hooks.map((h) => `- ${h}`).join("\n")}`,
    `Outline:\n${b.outline.map((o, i) => `${i + 1}. ${o}`).join("\n")}`,
    `Shot list:\n${b.shots.map((s) => `- ${s}`).join("\n")}`,
    `CTA: ${b.cta}`,
    `Success metric: ${b.successMetric}`,
  ].join("\n\n")
}

export function BriefBuilder() {
  const addPlannerItem = useAppStore((s) => s.addPlannerItem)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const router = useRouter()
  const [title, setTitle] = useState("Room makeover kos 300 ribu")
  const [goal, setGoal] = useState<string>("Grow followers")
  const [audience, setAudience] = useState("Mahasiswa rantau")
  const [platform, setPlatform] = useState<string>("tiktok")
  const [keyMessage, setKeyMessage] = useState("Kamar kecil bisa nyaman tanpa budget besar.")
  const ai = useAIAction(generateBriefAction)

  async function generate() {
    const res = await ai.run({ title, goal, audience, platform: platformLabel(platform), keyMessage })
    if (res) recordAIUse(`Created a content brief for “${title}”`)
  }

  function plan() {
    if (!ai.data) return
    const d = new Date()
    d.setDate(d.getDate() + 3)
    addPlannerItem({ title: ai.data.title, platform: platform as PlatformId, type: "video", status: "planned", date: localDate(d), notes: `Hook: ${ai.data.hooks[0]}\nCTA: ${ai.data.cta}` })
    toast.success("Brief added to Planner", { action: { label: "Open", onClick: () => router.push("/planner") } })
  }

  const b = ai.data
  return (
    <ToolShell
      title="Content Brief"
      description="A one-page plan for a single video: objective, audience, hooks, outline, shots, and how you'll measure success."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <InputField label="Video title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} required />
          <SelectField label="Goal" value={goal} onChange={setGoal} options={GOAL_SELECT} />
          <InputField label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} maxLength={120} />
          <SelectField label="Platform" value={platform} onChange={setPlatform} options={PLATFORM_SELECT} />
          <TextareaField label="Key message (optional)" value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} rows={3} maxLength={300} />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Building…" : "Build brief"}
          </Button>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Clarifying the objective…", "Writing hook options…", "Planning the shots…"]} />
      ) : ai.error && !b ? (
        <ErrorState title="Couldn't build the brief" description={ai.error} onRetry={generate} />
      ) : !b ? (
        <ToolEmpty icon={ScrollText} title="Your brief will appear here" description="Plan before you shoot — it makes recording twice as fast." />
      ) : (
        <article className="rounded-2xl border bg-card shadow-soft">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b p-5">
            <div>
              <p className="text-xs font-semibold tracking-wider text-primary">CONTENT BRIEF</p>
              <h2 className="text-lg font-semibold">{b.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ai.source && <SourceBadge source={ai.source} provider={ai.provider ?? undefined} />}
              <CopyButton text={briefToText(b)} />
              <Button size="sm" onClick={plan}>
                <CalendarPlus /> Add to Planner
              </Button>
            </div>
          </header>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <BriefCell icon={Target} label="Objective" text={b.objective} />
            <BriefCell icon={Users} label="Audience" text={b.audience} />
            <BriefCell icon={Flag} label="Key message" text={b.keyMessage} />
            <BriefCell icon={Flag} label="Success metric" text={b.successMetric} />
          </div>
          <div className="space-y-5 p-5">
            <BriefList icon={Zap} label="Hook options" items={b.hooks} quoted />
            <BriefList icon={ListOrdered} label="Outline" items={b.outline} ordered />
            <BriefList icon={Camera} label="Shot list" items={b.shots} />
            <div className="rounded-xl bg-secondary/60 p-3 text-sm">
              <span className="font-semibold text-secondary-foreground">CTA: </span>
              {b.cta}
            </div>
          </div>
        </article>
      )}
    </ToolShell>
  )
}

function BriefCell({ icon: Icon, label, text }: { icon: typeof Target; label: string; text: string }) {
  return (
    <div className="bg-card p-5">
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-1.5 text-sm">{text}</p>
    </div>
  )
}

function BriefList({ icon: Icon, label, items, ordered, quoted }: { icon: typeof Target; label: string; items: string[]; ordered?: boolean; quoted?: boolean }) {
  const List = ordered ? "ol" : "ul"
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="size-4 text-primary" /> {label}
      </p>
      <List className="mt-2 space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={it} className="flex gap-2">
            <span className="text-muted-foreground tabular-nums">{ordered ? `${i + 1}.` : "•"}</span>
            <span>{quoted ? `“${it}”` : it}</span>
          </li>
        ))}
      </List>
    </div>
  )
}
