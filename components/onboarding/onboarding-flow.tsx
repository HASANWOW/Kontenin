"use client"

import { ArrowLeft, ArrowRight, BookOpen, Loader2, Sparkles, Target } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { Logo } from "@/components/shared/logo"
import { ProgressBar } from "@/components/shared/progress-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCourse } from "@/lib/data/courses"
import { getMission } from "@/lib/data/missions"
import { CHALLENGE_CHOICES, CHALLENGE_PLAN, GOAL_CHOICES, LEVEL_CHOICES, NICHE_CHOICES, PLATFORM_CHOICES } from "@/lib/data/onboarding"
import { capitalize } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import type { CreatorProfile, Difficulty } from "@/types/domain"

const STEPS = [
  { title: "What do you want to create?", hint: "Pick everything that applies." },
  { title: "What is your niche?", hint: "Choose the closest one — you can refine it later." },
  { title: "What's your current level?", hint: "Be honest. Missions adapt to your level." },
  { title: "What's your biggest challenge?", hint: "We'll start your learning path here." },
  { title: "What's your goal?", hint: "This shapes your missions and CTAs." },
] as const

export function OnboardingFlow() {
  const existing = useAppStore((s) => s.creatorProfile)
  const name = useAppStore((s) => s.profile.name)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const router = useRouter()
  const reduce = useReducedMotion()

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [platforms, setPlatforms] = useState<string[]>(existing?.platforms ?? [])
  const knownNiche = NICHE_CHOICES.some((n) => n.value === existing?.niche)
  const [niche, setNiche] = useState<string | null>(existing ? (knownNiche ? existing.niche : "Other") : null)
  const [customNiche, setCustomNiche] = useState(existing && !knownNiche ? existing.niche : "")
  const [level, setLevel] = useState<Difficulty | null>(existing?.level ?? null)
  const [challenge, setChallenge] = useState<string | null>(existing?.challenge ?? null)
  const [goal, setGoal] = useState<string | null>(existing?.goal ?? null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<CreatorProfile | null>(null)

  const canContinue = [
    platforms.length > 0,
    niche !== null && (niche !== "Other" || customNiche.trim().length > 1),
    level !== null,
    challenge !== null,
    goal !== null,
  ][step]

  function next() {
    if (!canContinue) return toast.error("Choose an option to continue.")
    if (step < STEPS.length - 1) {
      setDir(1)
      setStep(step + 1)
      return
    }
    // Brief "analysis" moment — the profile itself is assembled locally from the answers.
    setAnalyzing(true)
    setTimeout(() => {
      setResult({
        platforms,
        niche: niche === "Other" ? capitalize(customNiche.trim()) : (niche ?? "Other"),
        level: level ?? "beginner",
        challenge: challenge ?? "Finding ideas",
        goal: goal ?? "Start creating",
      })
      setAnalyzing(false)
    }, 1200)
  }

  function back() {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  function finish() {
    if (!result) return
    completeOnboarding(result)
    toast.success("Your creator profile is ready!")
    router.push("/dashboard")
  }

  if (result) return <ProfileResult profile={result} name={name} onFinish={finish} onEdit={() => setResult(null)} />

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-6">
      <div className="flex items-center justify-between">
        <Logo href="/onboarding" />
        <span className="text-sm text-muted-foreground tabular-nums">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
      <ProgressBar className="mt-5 h-1.5" value={((step + 1) / STEPS.length) * 100} label="Onboarding progress" />

      <div className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            aria-labelledby="step-title"
          >
            <p className="text-sm font-semibold text-primary">Creator diagnosis</p>
            <h1 id="step-title" className="mt-2 text-3xl font-semibold tracking-tight text-balance">
              {STEPS[step].title}
            </h1>
            <p className="mt-2 text-muted-foreground">{STEPS[step].hint}</p>

            <div className="mt-8">
              {step === 0 && (
                <ChoiceGroup multiple label="Platforms and content types" hideLabel size="md" choices={PLATFORM_CHOICES} value={platforms} onChange={setPlatforms} />
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <ChoiceGroup label="Niche" hideLabel size="md" choices={NICHE_CHOICES} value={niche} onChange={setNiche} />
                  {niche === "Other" && (
                    <div className="space-y-1.5">
                      <label htmlFor="custom-niche" className="text-sm font-medium">
                        Describe your niche
                      </label>
                      <Input
                        id="custom-niche"
                        autoFocus
                        value={customNiche}
                        onChange={(e) => setCustomNiche(e.target.value)}
                        placeholder="e.g. Skincare untuk kulit berminyak"
                        className="h-10"
                        maxLength={60}
                      />
                    </div>
                  )}
                </div>
              )}
              {step === 2 && <ChoiceGroup label="Level" hideLabel size="lg" choices={LEVEL_CHOICES} value={level} onChange={setLevel} />}
              {step === 3 && <ChoiceGroup label="Challenge" hideLabel size="md" choices={CHALLENGE_CHOICES} value={challenge} onChange={setChallenge} />}
              {step === 4 && <ChoiceGroup label="Goal" hideLabel size="md" choices={GOAL_CHOICES} value={goal} onChange={setGoal} />}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-5">
        <Button variant="ghost" size="lg" className="h-10" onClick={back} disabled={step === 0 || analyzing}>
          <ArrowLeft /> Back
        </Button>
        <Button size="lg" className="h-10 min-w-36 bg-brand-gradient px-5 shadow-glow" onClick={next} disabled={analyzing} aria-disabled={!canContinue}>
          {analyzing ? (
            <>
              <Loader2 className="animate-spin" /> Building profile…
            </>
          ) : step === STEPS.length - 1 ? (
            <>
              <Sparkles /> Generate my profile
            </>
          ) : (
            <>
              Continue <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function ProfileResult({ profile, name, onFinish, onEdit }: { profile: CreatorProfile; name: string; onFinish: () => void; onEdit: () => void }) {
  const plan = CHALLENGE_PLAN[profile.challenge] ?? CHALLENGE_PLAN["Finding ideas"]
  const course = getCourse(plan.courseId)
  const mission = getMission(plan.missionId)
  const rows = [
    { label: "Level", value: capitalize(profile.level) },
    { label: "Niche", value: profile.niche },
    { label: "Platform", value: profile.platforms.join(", ") },
    { label: "Main goal", value: profile.goal },
    { label: "Weakness", value: profile.challenge },
  ]
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="relative bg-brand-gradient px-6 py-7 text-white">
            <div aria-hidden className="grid-pattern absolute inset-0 opacity-15" />
            <p className="relative text-sm font-medium text-white/80">Your Creator Profile</p>
            <h1 className="relative mt-1 text-2xl font-semibold tracking-tight">Nice to meet you, {name.split(" ")[0]} 👋</h1>
          </div>
          <dl className="divide-y px-6">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="text-right font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t bg-muted/40 px-6 py-5">
            <p className="text-sm font-semibold">Your starting plan</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.focus}</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {course && (
                <div className="flex items-start gap-2.5 rounded-xl border bg-card p-3">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">First course</div>
                    <div className="font-medium">{course.title}</div>
                  </div>
                </div>
              )}
              {mission && (
                <div className="flex items-start gap-2.5 rounded-xl border bg-card p-3">
                  <Target className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">First mission</div>
                    <div className="font-medium">{mission.title}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="ghost" size="lg" className="h-10" onClick={onEdit}>
            <ArrowLeft /> Edit answers
          </Button>
          <Button size="lg" className="h-11 bg-brand-gradient px-6 text-[15px] shadow-glow" onClick={onFinish}>
            Go to my dashboard <ArrowRight />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
