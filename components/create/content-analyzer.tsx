"use client"

import { CheckCircle2, Gauge, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { analyzeContentAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { InputField, TextareaField } from "@/components/shared/form-field"
import { ScoreBar, ScoreRing } from "@/components/shared/score-ring"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import { countWords, estimateSeconds } from "@/lib/ai/heuristics"
import type { ContentAnalysis } from "@/lib/ai/schemas"
import { clearHandoff, peekHandoff } from "@/lib/handoff"
import { useAppStore } from "@/lib/store/app-store"
import { ToolEmpty, ToolShell } from "./tool-shell"

const SAMPLE = `Halo guys, balik lagi di channel aku.
Jadi hari ini aku mau bahas tentang cara belajar yang efektif buat kalian yang sebentar lagi UTS.
Pertama, kalian harus bikin jadwal belajar yang jelas dan konsisten setiap hari supaya materinya masuk.
Kedua, jangan belajar sambil main HP.
Ketiga, istirahat yang cukup.`

export function ContentAnalyzer() {
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  // Prefilled by the script generator's “Send to AI Studio”, when present.
  const [handoff] = useState(() => peekHandoff<{ title: string; description: string; durationSeconds: number }>("analyze"))
  const [title, setTitle] = useState(handoff?.title ?? "Cara belajar efektif untuk UTS")
  const [description, setDescription] = useState(handoff?.description ?? SAMPLE)
  const [duration, setDuration] = useState(handoff ? String(handoff.durationSeconds) : "30")
  const ai = useAIAction(analyzeContentAction)

  useEffect(() => clearHandoff("analyze"), [])

  async function analyze() {
    const res = await ai.run({ title, description, durationSeconds: Number(duration) || 30 })
    if (res) recordAIUse(`Analyzed “${title}”`)
  }

  const words = countWords(description)

  return (
    <ToolShell
      back={{ href: "/create", label: "Create" }}
      title="Analyze My Content"
      description="Paste a script or describe your video before you record. Get a content score and fixes."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            analyze()
          }}
        >
          <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} required />
          <InputField label="Target duration (seconds)" type="number" min={5} max={600} value={duration} onChange={(e) => setDuration(e.target.value)} />
          <TextareaField
            label="Script or description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            maxLength={4000}
            hint={`${words} words · reads in about ${estimateSeconds(words)}s`}
            required
          />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending || !description.trim()}>
            <Sparkles /> {ai.pending ? "Analyzing…" : "Analyze content"}
          </Button>
          <p className="text-xs text-muted-foreground">Have a video file? Use AI Studio → Analyze My Video.</p>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Reading the opening…", "Checking clarity and pacing…", "Looking for value and CTA…", "Writing recommendations…"]} />
      ) : ai.error && !ai.data ? (
        <ErrorState title="Analysis failed" description={ai.error} onRetry={analyze} />
      ) : !ai.data ? (
        <ToolEmpty icon={Gauge} title="Your content score will appear here" description="A sample script is pre-filled — hit Analyze to see how it scores." />
      ) : (
        <AnalysisResult analysis={ai.data} source={ai.source ?? "demo"} provider={ai.provider ?? undefined} />
      )}
    </ToolShell>
  )
}

export function AnalysisResult({ analysis, source, provider }: { analysis: ContentAnalysis; source: "ai" | "demo"; provider?: string }) {
  const labels: [keyof ContentAnalysis["scores"], string][] = [
    ["hook", "Hook"],
    ["clarity", "Clarity"],
    ["pacing", "Pacing"],
    ["value", "Value"],
    ["cta", "CTA"],
  ]
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Content score</h2>
          <SourceBadge source={source} provider={provider} />
        </div>
        <div className="mt-4 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
          <div className="text-center">
            <ScoreRing score={analysis.overall} size={132} stroke={11} label="Overall content score" />
            <p className="mt-2 text-sm font-medium">Overall</p>
          </div>
          <div className="space-y-3">
            {labels.map(([k, l]) => (
              <ScoreBar key={k} label={l} score={analysis.scores[k]} />
            ))}
          </div>
        </div>
      </section>
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 className="font-semibold">AI feedback</h2>
        <p className="mt-2 text-[15px]">“{analysis.summary}”</p>
        {analysis.strengths.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {analysis.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {s}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 className="font-semibold">Recommendations</h2>
        <ol className="mt-3 space-y-2.5">
          {analysis.recommendations.map((r, i) => (
            <li key={r} className="flex gap-3 text-[15px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{i + 1}</span>
              {r}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
