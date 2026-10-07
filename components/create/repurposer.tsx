"use client"

import { Lightbulb, Repeat2, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { repurposeAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { CopyButton } from "@/components/shared/copy-button"
import { SelectField, TextareaField } from "@/components/shared/form-field"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import { PLATFORM_SELECT, platformLabel } from "@/lib/data/create-options"
import { useAppStore } from "@/lib/store/app-store"
import { ToolEmpty, ToolShell } from "./tool-shell"

type Target = "tiktok" | "instagram" | "youtube_shorts" | "carousel" | "story"
const TARGETS: { value: Target; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Reels" },
  { value: "youtube_shorts", label: "Shorts" },
  { value: "carousel", label: "Carousel" },
  { value: "story", label: "Story" },
]

const SAMPLE = `Kenapa kamu tetap ngantuk walau tidur 8 jam? Pertama, jam tidurmu nggak konsisten setiap hari. Kedua, kamu main HP sampai detik terakhir sebelum tidur. Ketiga, kamar terlalu terang dan panas. Coba perbaiki satu per satu selama seminggu.`

export function Repurposer() {
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const [source, setSource] = useState(SAMPLE)
  const [sourcePlatform, setSourcePlatform] = useState<string>("tiktok")
  const [targets, setTargets] = useState<Target[]>(["instagram", "youtube_shorts", "carousel"])
  const ai = useAIAction(repurposeAction)

  async function run() {
    if (!targets.length) return toast.error("Pick at least one target format.")
    const res = await ai.run({ source, sourcePlatform: platformLabel(sourcePlatform), targets })
    if (res) recordAIUse(`Repurposed content into ${res.versions.length} formats`)
  }

  return (
    <ToolShell
      title="Content Repurposer"
      description="Turn one script or video into versions for other platforms — without starting from scratch."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            run()
          }}
        >
          <TextareaField label="Original script or transcript" value={source} onChange={(e) => setSource(e.target.value)} rows={8} maxLength={4000} required />
          <SelectField label="Originally made for" value={sourcePlatform} onChange={setSourcePlatform} options={PLATFORM_SELECT} />
          <ChoiceGroup multiple label="Repurpose into" choices={TARGETS} value={targets} onChange={setTargets} />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Repurposing…" : "Repurpose"}
          </Button>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Finding the core message…", "Adapting to each format…", "Adding platform tips…"]} />
      ) : ai.error && !ai.data ? (
        <ErrorState title="Couldn't repurpose" description={ai.error} onRetry={run} />
      ) : !ai.data ? (
        <ToolEmpty icon={Repeat2} title="Your versions will appear here" description="One video, many formats. Pick targets and repurpose." />
      ) : (
        <div className="space-y-4">
          {ai.source && <SourceBadge source={ai.source} provider={ai.provider ?? undefined} />}
          {ai.data.versions.map((v) => (
            <article key={`${v.platform}-${v.format}`} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-primary">{v.platform.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{v.format}</p>
                </div>
                <CopyButton text={v.content} />
              </div>
              <h3 className="mt-3 font-semibold">{v.title}</h3>
              <p className="mt-2 rounded-xl bg-muted/50 p-3 text-sm whitespace-pre-line">{v.content}</p>
              <ul className="mt-3 space-y-1">
                {v.tips.map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" /> {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </ToolShell>
  )
}
