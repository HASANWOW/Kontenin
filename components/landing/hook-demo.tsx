"use client"

import { Sparkles, Wand2 } from "lucide-react"
import { useState } from "react"
import { ScoreRing } from "@/components/shared/score-ring"
import { Textarea } from "@/components/ui/textarea"
import { analyzeHookText } from "@/lib/ai/heuristics"
import type { HookAnalysis } from "@/lib/ai/schemas"

const SAMPLES = ["Guys hari ini aku mau kasih tips belajar", "Kenapa kamu tetap ngantuk walau tidur 8 jam?", "Halo semua, di video ini aku mau review laptop"]

/** Runs entirely in the browser with the same rule-based engine used in demo mode. */
export function HookDemo() {
  const [text, setText] = useState(SAMPLES[0])
  const [result, setResult] = useState<HookAnalysis | null>(() => analyzeHookText(SAMPLES[0]))

  function analyze(value = text) {
    if (!value.trim()) return
    setResult(analyzeHookText(value))
  }

  return (
    <div className="grid gap-6 rounded-3xl border bg-card p-5 shadow-soft sm:p-8 lg:grid-cols-2">
      <div>
        <label htmlFor="demo-hook" className="text-sm font-semibold">
          Tulis hook kamu
        </label>
        <Textarea
          id="demo-hook"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={3}
          className="mt-2 resize-none text-[15px]"
          placeholder="Kalimat pertama video kamu…"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setText(s)
                analyze(s)
              }}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors outline-none hover:border-primary/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {s.length > 34 ? `${s.slice(0, 34)}…` : s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => analyze()}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-medium text-white shadow-glow outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Sparkles className="size-4" /> Analyze hook
        </button>
        <p className="mt-3 text-xs text-muted-foreground">Demo engine berbasis aturan — berjalan langsung di browser kamu, tanpa menyimpan data.</p>
      </div>

      <div aria-live="polite" className="rounded-2xl bg-muted/50 p-5">
        {result && (
          <div>
            <div className="flex items-center gap-4">
              <ScoreRing key={result.score + text} score={result.score} size={92} stroke={8} label="Hook score" />
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground">HOOK SCORE</div>
                <div className="text-lg font-semibold">{result.verdict}</div>
              </div>
            </div>
            {result.problems.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {result.problems.slice(0, 2).map((p) => (
                  <li key={p} className="text-muted-foreground">
                    • {p}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 rounded-xl border bg-card p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Wand2 className="size-3.5" /> Improved version · {result.improvedScore}/100
              </div>
              <p className="mt-1.5 text-[15px]">“{result.improved}”</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
