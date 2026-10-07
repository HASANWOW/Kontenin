"use client"

import { ArrowRight, CheckCircle2, Clock, Lightbulb, ListChecks, PartyPopper, RotateCcw, Send, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { evaluateMissionAction } from "@/app/actions/ai"
import { DifficultyPill } from "@/components/learning/course-card"
import { AIProcessing } from "@/components/shared/ai-processing"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/states"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAIAction } from "@/hooks/use-ai-action"
import { countWords } from "@/lib/ai/heuristics"
import { celebrate } from "@/lib/celebrate"
import { getMission, missionOriginal, MISSIONS } from "@/lib/data/missions"
import type { RewardResult } from "@/lib/store/app-store"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { FeedbackPanel } from "./feedback-panel"
import { PrivateRecorder } from "./private-recorder"

export function MissionDetail({ missionId }: { missionId: string }) {
  const mission = getMission(missionId)!
  const completed = useAppStore((s) => s.completedMissionIds)
  const previous = useAppStore((s) => s.missionResults[missionId])
  const completeMission = useAppStore((s) => s.completeMission)
  const recordAIUse = useAppStore((s) => s.recordAIUse)
  const [answer, setAnswer] = useState("")
  const [reward, setReward] = useState<RewardResult | null>(null)
  const ai = useAIAction(evaluateMissionAction)

  const alreadyDone = completed.includes(mission.id)
  const words = countWords(answer)
  const lines = answer.split("\n").filter((l) => l.trim()).length
  const nextMission = MISSIONS.find((m) => m.number > mission.number && !completed.includes(m.id)) ?? MISSIONS.find((m) => !completed.includes(m.id))

  async function submit() {
    if (answer.trim().length < 5) return
    const result = await ai.run({
      evaluator: mission.evaluator,
      missionTitle: mission.title,
      answer,
      difficulty: mission.difficulty,
      minItems: mission.minItems,
      original: missionOriginal(mission),
    })
    if (result) recordAIUse(`Got AI feedback on “${mission.title}”`)
  }

  function complete(partial: boolean) {
    if (!ai.data) return
    const result = completeMission(mission, ai.data.score, answer, partial)
    setReward(result)
    celebrate(result, "Mission complete")
  }

  function retry() {
    ai.reset()
    setReward(null)
  }

  if (reward) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <PartyPopper className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Mission complete!</h1>
        <p className="mt-2 text-muted-foreground">
          {mission.title} · score {ai.data?.score}/100
        </p>
        <p className="mt-6 text-4xl font-semibold text-primary tabular-nums">+{reward.xpGained} XP</p>
        {reward.leveledUp && (
          <p className="mt-2 font-medium">
            🎉 Level up — you&apos;re now Level {reward.level}, {reward.levelTitle}
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          {nextMission && (
            <Link href={`/missions/${nextMission.id}`} className={cn(buttonVariants({ size: "lg" }), "h-11 bg-brand-gradient px-5 shadow-glow")}>
              Next: {nextMission.title} <ArrowRight />
            </Link>
          )}
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}>
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        back={{ href: "/missions", label: "All missions" }}
        eyebrow={`Mission #${mission.number} · ${mission.category}`}
        title={mission.title}
        description={mission.objective}
        actions={
          <div className="flex items-center gap-2 text-sm">
            <DifficultyPill level={mission.difficulty} />
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-2.5 text-xs">
              <Clock className="size-3.5" /> {mission.minutes} min
            </span>
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground">
              <Zap className="size-3.5" /> {alreadyDone ? `+${Math.round(mission.xp * 0.2)} XP (repeat)` : `+${mission.xp} XP`}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="size-4 text-amber-500" /> Why this matters
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">{mission.whyItMatters}</p>
          </section>
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListChecks className="size-4 text-primary" /> Instructions
            </h2>
            <ol className="mt-3 space-y-2.5">
              {mission.instructions.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="font-semibold">Example · {mission.example.label}</h2>
            {mission.example.weak && (
              <div className="mt-3 rounded-lg bg-destructive/5 p-3 text-sm">
                <span className="text-xs font-semibold text-destructive">WEAK</span>
                <p className="mt-1 whitespace-pre-line">{mission.example.weak}</p>
              </div>
            )}
            <div className="mt-2 rounded-lg bg-success/10 p-3 text-sm">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">STRONG</span>
              <p className="mt-1 whitespace-pre-line">{mission.example.strong}</p>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="task-title" className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 id="task-title" className="font-semibold">
              Your task
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{mission.task}</p>

            {mission.optionalRecording && (
              <div className="mt-4">
                <PrivateRecorder />
              </div>
            )}

            <label htmlFor="mission-answer" className="sr-only">
              Your answer
            </label>
            <Textarea
              id="mission-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={mission.placeholder}
              rows={mission.evaluator === "script" || mission.evaluator === "reflection" ? 9 : 6}
              maxLength={4000}
              disabled={ai.pending || Boolean(ai.data)}
              className="mt-4 text-[15px] leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {words} words{mission.minItems ? ` · ${lines}/${mission.minItems} lines` : ""}
              </span>
              {previous && <span>Last score: {previous.score}</span>}
            </div>

            {!ai.data && (
              <Button size="lg" className="mt-4 h-11 w-full bg-brand-gradient text-[15px] shadow-glow" disabled={ai.pending || answer.trim().length < 5} onClick={submit}>
                {ai.pending ? (
                  <>
                    <Sparkles className="animate-pulse" /> Evaluating…
                  </>
                ) : (
                  <>
                    <Send /> Submit for AI feedback
                  </>
                )}
              </Button>
            )}
          </section>

          {ai.pending && <AIProcessing steps={["Reading your answer…", "Checking the mission criteria…", "Scoring against the rubric…", "Writing suggestions…"]} />}

          {ai.error && !ai.pending && !ai.data && <ErrorState title="AI request failed" description={ai.error} onRetry={submit} />}

          {ai.data && ai.source && (
            <>
              <FeedbackPanel feedback={ai.data} source={ai.source} provider={ai.provider ?? undefined} scoreLabel={mission.evaluator.startsWith("hook") || mission.evaluator === "rewrite" ? "Hook score" : "Score"} />
              <div className="flex flex-col gap-2 sm:flex-row">
                {ai.data.passed ? (
                  <Button size="lg" className="h-11 flex-1 bg-brand-gradient text-[15px] shadow-glow" onClick={() => complete(false)}>
                    <CheckCircle2 /> Complete Mission
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="h-11 flex-1" onClick={() => complete(true)}>
                    Complete with half XP
                  </Button>
                )}
                <Button size="lg" variant={ai.data.passed ? "outline" : "default"} className="h-11" onClick={retry}>
                  <RotateCcw /> Revise answer
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
