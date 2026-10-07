"use client"

import { Clapperboard, Clock, FileText, Film, RefreshCw, Save, Send, Sparkles, Type } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { generateScriptAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { CopyButton } from "@/components/shared/copy-button"
import { InputField, SelectField } from "@/components/shared/form-field"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import type { GeneratedScript } from "@/lib/ai/schemas"
import { DURATIONS, PLATFORM_SELECT, platformLabel, TONE_CHOICES, VIDEO_TYPES } from "@/lib/data/create-options"
import { clearHandoff, peekHandoff, putHandoff } from "@/lib/handoff"
import { useAppStore } from "@/lib/store/app-store"
import { ToolEmpty, ToolShell } from "./tool-shell"

export function scriptToText(s: GeneratedScript): string {
  return [`HOOK\n${s.hook}`, `BODY\n${s.body.join("\n")}`, `VALUE\n${s.value}`, `CTA\n${s.cta}`].join("\n\n")
}

export function ScriptGenerator() {
  const saveScript = useAppStore((s) => s.saveScript)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const autoSave = useAppStore((s) => s.settings.ai.autoSave)
  const router = useRouter()
  // Prefilled from the idea generator's “Create Script” button, when present.
  const [handoff] = useState(() => peekHandoff<{ topic: string; platform: string; cta: string }>("script"))
  const [topic, setTopic] = useState(handoff?.topic ?? "3 aplikasi AI gratis buat tugas kuliah")
  const [platform, setPlatform] = useState<string>(handoff?.platform ?? "tiktok")
  const [videoType, setVideoType] = useState<string>("tips")
  const [duration, setDuration] = useState<string>("30")
  const [tone, setTone] = useState<string>("curiosity")
  const [cta, setCta] = useState(handoff?.cta ?? "Follow untuk part 2.")
  const [variant, setVariant] = useState(0)
  const [savedId, setSavedId] = useState<string | null>(null)
  const ai = useAIAction(generateScriptAction)

  useEffect(() => clearHandoff("script"), [])

  async function generate(v = variant) {
    if (!topic.trim()) return toast.error("Enter a topic first.")
    setSavedId(null)
    const res = await ai.run({ topic, platform: platformLabel(platform), videoType, durationSeconds: Number(duration), tone, cta, variant: v })
    if (!res) return
    recordAIUse(`Generated a ${duration}s script`)
    if (autoSave) {
      const id = `script-${Date.now().toString(36)}`
      saveScript({ ...res, id, savedAt: new Date().toISOString(), platform })
      setSavedId(id)
    }
  }

  function save() {
    if (!ai.data) return
    const id = `script-${Date.now().toString(36)}`
    saveScript({ ...ai.data, id, savedAt: new Date().toISOString(), platform })
    setSavedId(id)
    toast.success("Script saved to your library")
  }

  function sendToStudio() {
    if (!ai.data) return
    putHandoff("analyze", { title: ai.data.title, description: scriptToText(ai.data), durationSeconds: Number(duration) })
    router.push("/create/analyze")
  }

  const s = ai.data

  return (
    <ToolShell
      title="Script Generator"
      description="A structured script — hook, body, value, CTA — with timing, B-roll, and on-screen text."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <InputField label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={140} required />
          <SelectField label="Platform" value={platform} onChange={setPlatform} options={PLATFORM_SELECT} />
          <SelectField label="Video type" value={videoType} onChange={setVideoType} options={VIDEO_TYPES} />
          <ChoiceGroup label="Duration" choices={DURATIONS} value={duration} onChange={setDuration} />
          <SelectField label="Tone" value={tone} onChange={setTone} options={TONE_CHOICES} />
          <InputField label="Call to action" value={cta} onChange={(e) => setCta(e.target.value)} maxLength={140} placeholder="e.g. Follow untuk part 2" />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Writing…" : "Generate Script"}
          </Button>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Choosing the strongest hook…", "Structuring the body…", "Timing it to your duration…", "Suggesting B-roll and overlays…"]} />
      ) : ai.error && !s ? (
        <ErrorState title="Couldn't write the script" description={ai.error} onRetry={() => generate()} />
      ) : !s ? (
        <ToolEmpty icon={FileText} title="Your script will appear here" description="Set the topic and duration, then generate." />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <Clock className="size-3.5" /> ~{s.estimatedSeconds}s
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <Type className="size-3.5" /> {s.wordCount} words
              </span>
              {ai.source && <SourceBadge source={ai.source} provider={ai.provider ?? undefined} />}
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={scriptToText(s)} />
              <Button variant="outline" size="sm" onClick={save} disabled={Boolean(savedId)}>
                <Save /> {savedId ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVariant(variant + 1)
                  generate(variant + 1)
                }}
              >
                <RefreshCw /> Regenerate
              </Button>
              <Button size="sm" onClick={sendToStudio}>
                <Send /> Send to AI Studio
              </Button>
            </div>
          </div>

          <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <ScriptBlock label="HOOK" time={`0–3s`} tone="bg-violet-500">
              <p className="text-lg font-medium">{s.hook}</p>
            </ScriptBlock>
            <ScriptBlock label="BODY" time={`3–${Math.max(4, s.estimatedSeconds - 7)}s`} tone="bg-sky-500">
              <ol className="space-y-2">
                {s.body.map((b, i) => (
                  <li key={i} className="text-[15px] leading-relaxed">
                    {b}
                  </li>
                ))}
              </ol>
            </ScriptBlock>
            <ScriptBlock label="VALUE" time="takeaway" tone="bg-emerald-500">
              <p className="text-[15px]">{s.value}</p>
            </ScriptBlock>
            <ScriptBlock label="CTA" time="last 3s" tone="bg-amber-500">
              <p className="text-[15px] font-medium">{s.cta}</p>
            </ScriptBlock>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Film className="size-4 text-primary" /> Suggested B-roll
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {s.broll.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Clapperboard className="size-4 text-primary" /> Text overlays
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {s.overlays.map((o) => (
                  <span key={o} className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  )
}

function ScriptBlock({ label, time, tone, children }: { label: string; time: string; tone: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-4 border-b p-5 last:border-b-0">
      <div className="w-16 shrink-0">
        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wider text-white ${tone}`}>{label}</span>
        <p className="mt-1.5 text-[11px] text-muted-foreground">{time}</p>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  )
}
