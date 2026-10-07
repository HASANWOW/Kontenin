"use client"

import { AlertCircle, CheckCircle2, Lightbulb, Wand2 } from "lucide-react"
import { motion } from "motion/react"
import { CopyButton } from "@/components/shared/copy-button"
import { ScoreRing } from "@/components/shared/score-ring"
import { SourceBadge } from "@/components/shared/source-badge"
import type { MissionFeedback } from "@/lib/ai/schemas"

export function FeedbackPanel({ feedback, source, provider, scoreLabel = "Score" }: { feedback: MissionFeedback; source: "ai" | "demo"; provider?: string; scoreLabel?: string }) {
  return (
    <motion.section
      aria-labelledby="feedback-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border bg-card p-5 shadow-soft"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="feedback-title" className="font-semibold">
          AI feedback
        </h2>
        <SourceBadge source={source} provider={provider} />
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ScoreRing score={feedback.score} label={scoreLabel} />
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground">{scoreLabel.toUpperCase()}</p>
          <p className="text-lg font-semibold">{feedback.headline}</p>
          <p className={feedback.passed ? "text-sm text-green-700 dark:text-green-400" : "text-sm text-amber-700 dark:text-amber-400"}>
            {feedback.passed ? "Passed — ready to complete" : "Below 60 — revise for full XP"}
          </p>
        </div>
      </div>

      {feedback.problems.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold">Problems</p>
          <ul className="mt-2 space-y-1.5">
            {feedback.problems.map((p) => (
              <li key={p} className="flex gap-2 text-sm">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" /> {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.strengths.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">What works</p>
          <ul className="mt-2 space-y-1.5">
            {feedback.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <span>
          <span className="font-semibold">Suggestion: </span>
          {feedback.suggestion}
        </span>
      </div>

      {feedback.improved && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-secondary/50 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Wand2 className="size-4" /> Improved version
            </p>
            <div className="flex items-center gap-2">
              {feedback.improvedScore !== undefined && <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">Score: {feedback.improvedScore}/100</span>}
              <CopyButton text={feedback.improved} size="icon-sm" variant="ghost" label="Copy improved version" />
            </div>
          </div>
          <p className="mt-2 text-[15px]">“{feedback.improved}”</p>
        </div>
      )}
    </motion.section>
  )
}
