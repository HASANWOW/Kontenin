"use client"

import { ArrowRight, Check, Flame, Sparkles, Target, Zap } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { ScoreRing } from "@/components/shared/score-ring"
import { analyzeHookText } from "@/lib/ai/heuristics"
import { cn } from "@/lib/utils"

const WEAK = "Guys hari ini aku mau kasih tips..."

const TABS = [
  { id: "feedback", label: "AI Feedback" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mission", label: "Mission" },
] as const

type TabId = (typeof TABS)[number]["id"]

/** Interactive product preview. The feedback tab runs Kontenin's real demo scoring engine in the browser. */
export function HeroPreview() {
  const [tab, setTab] = useState<TabId>("feedback")
  const [improved, setImproved] = useState(false)
  const analysis = analyzeHookText(WEAK)

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-30px_rgb(76_29_149/0.45)]">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-green-400/70" />
          </span>
          <div role="tablist" aria-label="Product preview" className="mx-auto flex gap-1 rounded-lg bg-background p-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="w-12" />
        </div>

        <div className="min-h-[380px] p-5 sm:p-6" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {tab === "feedback" && (
                <div>
                  <p className="text-xs font-semibold tracking-wider text-primary">HOOK ANALYSIS</p>
                  <div className="mt-3 rounded-xl border bg-muted/40 p-3.5 text-[15px]">“{improved ? analysis.improved : WEAK}”</div>
                  <div className="mt-5 flex items-center gap-5">
                    <ScoreRing key={String(improved)} score={improved ? analysis.improvedScore : analysis.score} size={96} stroke={9} label="Hook score" />
                    <div className="min-w-0 flex-1 space-y-2 text-sm">
                      {improved ? (
                        <>
                          <p className="flex items-start gap-2">
                            <Check className="mt-0.5 size-4 shrink-0 text-success" /> Names a specific problem
                          </p>
                          <p className="flex items-start gap-2">
                            <Check className="mt-0.5 size-4 shrink-0 text-success" /> Speaks directly to the viewer
                          </p>
                          <p className="flex items-start gap-2">
                            <Check className="mt-0.5 size-4 shrink-0 text-success" /> Specific: “3 detik pertama”
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-destructive">Too generic.</p>
                          <p className="text-muted-foreground">Start with a surprising statement or a specific problem.</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setImproved((v) => !v)}
                    className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-glow outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Sparkles className="size-4" /> {improved ? "Show original" : "Improve with AI"}
                  </button>
                </div>
              )}

              {tab === "dashboard" && (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-brand-gradient p-4 text-white">
                    <div className="text-xs text-white/80">Creator level</div>
                    <div className="font-semibold">Level 3 — Rising Creator</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
                      <div className="h-full w-[45%] rounded-full bg-white" />
                    </div>
                    <div className="mt-1.5 text-xs tabular-nums">2,450 / 3,000 XP</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { l: "Missions", v: "28", i: Target },
                      { l: "Streak", v: "7 days", i: Flame },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl border p-3">
                        <s.i className="size-4 text-primary" />
                        <div className="mt-2 text-lg font-semibold">{s.v}</div>
                        <div className="text-xs text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="text-[11px] font-semibold tracking-wider text-primary">MISSION #12</div>
                    <div className="mt-1 font-medium">Write 3 Hooks for Your Next Video</div>
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                      <span>Beginner</span>·<span>10 min</span>·<span className="font-medium text-primary">+100 XP</span>
                    </div>
                  </div>
                </div>
              )}

              {tab === "mission" && (
                <div>
                  <p className="text-xs font-semibold tracking-wider text-primary">MISSION #3 · 20 MIN</p>
                  <h3 className="mt-1 text-lg font-semibold">Create a 30-second Script</h3>
                  <ol className="mt-4 space-y-2.5 text-sm">
                    {["Hook on the first line", "2–3 short points", "One-sentence takeaway", "One clear CTA"].map((s, i) => (
                      <li key={s} className="flex items-center gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 flex items-center justify-between rounded-xl border bg-muted/40 p-3 text-sm">
                    <span className="flex items-center gap-2">
                      <Zap className="size-4 text-primary" /> Reward
                    </span>
                    <span className="font-semibold">+150 XP</span>
                  </div>
                  <a href="/register" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Try this mission <ArrowRight className="size-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
