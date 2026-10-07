"use client"

import { Bookmark, BookmarkCheck, FlaskConical, RefreshCw, Sparkles, Zap } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"
import { analyzeHookAction, generateHooksAction } from "@/app/actions/ai"
import { AIProcessing } from "@/components/shared/ai-processing"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { CopyButton } from "@/components/shared/copy-button"
import { InputField } from "@/components/shared/form-field"
import { scoreTone } from "@/components/shared/score-ring"
import { SourceBadge } from "@/components/shared/source-badge"
import { ErrorState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAIAction } from "@/hooks/use-ai-action"
import type { HookTone } from "@/lib/ai/types"
import { TONE_CHOICES } from "@/lib/data/create-options"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { ToolEmpty, ToolShell } from "./tool-shell"

export function HookGenerator() {
  const savedHooks = useAppStore((s) => s.savedHooks)
  const saveHook = useAppStore((s) => s.saveHook)
  const removeHook = useAppStore((s) => s.removeHook)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const [topic, setTopic] = useState("cara bangun pagi tanpa alarm")
  const [audience, setAudience] = useState("Mahasiswa")
  const [tone, setTone] = useState<HookTone>("curiosity")
  const [variant, setVariant] = useState(0)
  const [ownHook, setOwnHook] = useState("")
  const ai = useAIAction(generateHooksAction)
  const check = useAIAction(analyzeHookAction)

  async function generate(v = variant) {
    if (!topic.trim()) return toast.error("Enter a topic first.")
    const res = await ai.run({ topic, audience, tone, variant: v })
    if (res) recordAIUse(`Generated hooks about “${topic}”`)
  }

  const isSaved = (id: string) => savedHooks.some((h) => h.id === id)

  return (
    <ToolShell
      title="Hook Generator"
      description="Scroll-stopping openers, each scored with a reason and a concrete improvement."
      form={
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <InputField label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What's the video about?" maxLength={120} required />
          <InputField label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Who is it for?" maxLength={80} />
          <ChoiceGroup label="Tone" choices={TONE_CHOICES} value={tone} onChange={setTone} />
          <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending}>
            <Sparkles /> {ai.pending ? "Generating…" : "Generate Hooks"}
          </Button>

          <div className="border-t pt-4">
            <p className="text-sm font-semibold">Score your own hook</p>
            <div className="mt-2 flex gap-2">
              <Input value={ownHook} onChange={(e) => setOwnHook(e.target.value)} placeholder="Paste a hook…" aria-label="Your hook" className="h-9" maxLength={300} />
              <Button type="button" variant="outline" size="lg" className="h-9" disabled={check.pending || !ownHook.trim()} onClick={() => check.run(ownHook)}>
                {check.pending ? "…" : "Score"}
              </Button>
            </div>
            {check.data && (
              <div className="mt-3 rounded-xl bg-muted/60 p-3 text-sm" aria-live="polite">
                <div className="flex items-center justify-between">
                  <span className={cn("text-lg font-semibold tabular-nums", scoreTone(check.data.score).text)}>{check.data.score}/100</span>
                  {check.source && <SourceBadge source={check.source} provider={check.provider ?? undefined} />}
                </div>
                <p className="mt-1 font-medium">{check.data.verdict}</p>
                {check.data.problems[0] && <p className="mt-1 text-muted-foreground">{check.data.problems[0]}</p>}
                {check.data.improved !== ownHook.trim() && <p className="mt-2">Try: “{check.data.improved}”</p>}
              </div>
            )}
          </div>
        </form>
      }
    >
      {ai.pending ? (
        <AIProcessing steps={["Exploring angles…", "Writing hooks in your tone…", "Scoring each hook…"]} />
      ) : ai.error && !ai.data ? (
        <ErrorState title="Couldn't generate hooks" description={ai.error} onRetry={() => generate()} />
      ) : !ai.data ? (
        savedHooks.length ? (
          <div>
            <p className="mb-3 text-sm font-semibold">Saved hooks ({savedHooks.length})</p>
            <ul className="space-y-2">
              {savedHooks.map((h) => (
                <li key={h.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-soft">
                  <span className={cn("w-10 text-center text-sm font-semibold tabular-nums", scoreTone(h.score).text)}>{h.score}</span>
                  <span className="flex-1 text-sm">{h.text}</span>
                  <CopyButton text={h.text} size="icon-sm" variant="ghost" />
                  <Button variant="ghost" size="icon-sm" aria-label="Remove saved hook" onClick={() => removeHook(h.id)}>
                    <BookmarkCheck className="text-primary" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ToolEmpty icon={Zap} title="Your hooks will appear here" description="Enter a topic, pick a tone, and generate." />
        )
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Sorted by score · {ai.data.length} hooks</p>
            <div className="flex items-center gap-2">
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
          </div>
          <ol className="space-y-3">
            {ai.data.map((h, i) => {
              const tone = scoreTone(h.score)
              return (
                <motion.li key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border bg-card p-4 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-muted/60 py-2">
                      <span className={cn("text-xl font-semibold tabular-nums", tone.text)}>{h.score}</span>
                      <span className="text-[10px] text-muted-foreground">{tone.label}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium">“{h.text}”</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Why: </span>
                        {h.reason}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Improve: </span>
                        {h.improvement}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <CopyButton text={h.text} size="icon-sm" variant="ghost" label="Copy hook" />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-pressed={isSaved(h.id)}
                        aria-label={isSaved(h.id) ? "Unsave hook" : "Save hook"}
                        onClick={() => {
                          if (isSaved(h.id)) removeHook(h.id)
                          else {
                            saveHook({ ...h, savedAt: new Date().toISOString(), topic })
                            toast.success("Hook saved")
                          }
                        }}
                      >
                        {isSaved(h.id) ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
                      </Button>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ol>
          {ai.source === "demo" && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FlaskConical className="size-3.5" /> Scores come from Kontenin&apos;s transparent hook rules (greeting, specificity, tension, direct address).
            </p>
          )}
        </div>
      )}
    </ToolShell>
  )
}
