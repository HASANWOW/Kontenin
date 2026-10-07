"use client"

import { Hash, MessageSquareText, RefreshCw, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { generateCaptionAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { CopyButton } from "@/components/shared/copy-button"
import { SelectField, TextareaField } from "@/components/shared/form-field"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { useAIAction } from "@/hooks/use-ai-action"
import type { CaptionStyle } from "@/lib/ai/types"
import { CAPTION_STYLES, PLATFORM_SELECT } from "@/lib/data/create-options"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { ToolEmpty, ToolShell } from "./tool-shell"

export function CaptionGenerator() {
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const [content, setContent] = useState("Tips belajar efektif pakai teknik Feynman untuk persiapan UTS")
  const [platform, setPlatform] = useState<string>("instagram")
  const [style, setStyle] = useState<CaptionStyle>("educational")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [variant, setVariant] = useState(0)
  const ai = useAIAction(generateCaptionAction)

  async function generate(v = variant) {
    if (!content.trim()) return toast.error("Describe your content first.")
    const res = await ai.run({ content, platform, style, variant: v })
    if (res) {
      setSelectedTags(res.hashtags.slice(0, 6))
      recordAIUse("Generated captions")
    }
  }

  const tagLine = selectedTags.join(" ")

  return (
    <ToolShell
      title="Caption Generator"
      description="Captions in six styles, plus hashtag suggestions you can pick and copy."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <TextareaField label="What's the content about?" value={content} onChange={(e) => setContent(e.target.value)} rows={4} maxLength={500} required />
          <SelectField label="Platform" value={platform} onChange={setPlatform} options={PLATFORM_SELECT} />
          <ChoiceGroup label="Caption style" choices={CAPTION_STYLES} value={style} onChange={setStyle} />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Writing…" : "Generate Captions"}
          </Button>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Reading your content…", "Matching the style…", "Picking hashtags…"]} />
      ) : ai.error && !ai.data ? (
        <ErrorState title="Couldn't write captions" description={ai.error} onRetry={() => generate()} />
      ) : !ai.data ? (
        <ToolEmpty icon={MessageSquareText} title="Your captions will appear here" description="Describe the content, choose a style, and generate." />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {ai.source && <SourceBadge source={ai.source} provider={ai.provider ?? undefined} />}
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
          </div>
          {ai.data.captions.map((c, i) => (
            <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground">OPTION {i + 1}</span>
                <CopyButton text={`${c.text}\n\n${tagLine}`.trim()} label="Copy with hashtags" />
              </div>
              <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line">{c.text}</p>
              {tagLine && <p className="mt-3 text-sm text-primary">{tagLine}</p>}
            </div>
          ))}
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Hash className="size-4 text-primary" /> Hashtag suggestions
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tap to include or exclude. 3–6 relevant tags usually beat 30 generic ones.</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Hashtags">
              {ai.data.hashtags.map((t) => {
                const on = selectedTags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelectedTags(on ? selectedTags.filter((x) => x !== t) : [...selectedTags, t])}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      on ? "border-primary bg-secondary text-secondary-foreground" : "text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  )
}
