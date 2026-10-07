"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/types/domain"

export function LessonQuiz({ questions, onAllAnswered }: { questions: QuizQuestion[]; onAllAnswered: (correct: number) => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null))
  const [checked, setChecked] = useState<boolean[]>(() => questions.map(() => false))

  function check(i: number) {
    const next = checked.map((c, j) => (j === i ? true : c))
    setChecked(next)
    if (next.every(Boolean)) onAllAnswered(questions.filter((q, j) => picked[j] === q.answerIndex).length)
  }

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <QuizItem
          key={q.question}
          index={i}
          q={q}
          picked={picked[i]}
          checked={checked[i]}
          onPick={(v) => setPicked((p) => p.map((x, j) => (j === i ? v : x)))}
          onCheck={() => check(i)}
          onRetry={() => setChecked((c) => c.map((x, j) => (j === i ? false : x)))}
        />
      ))}
    </div>
  )
}

function QuizItem({
  index,
  q,
  picked,
  checked,
  onPick,
  onCheck,
  onRetry,
}: {
  index: number
  q: QuizQuestion
  picked: number | null
  checked: boolean
  onPick: (v: number) => void
  onCheck: () => void
  onRetry: () => void
}) {
  const id = useId()
  const correct = picked === q.answerIndex
  return (
    <fieldset className="rounded-xl border p-4">
      <legend className="sr-only">Question {index + 1}</legend>
      <p id={`${id}-q`} className="font-medium">
        {index + 1}. {q.question}
      </p>
      <div role="radiogroup" aria-labelledby={`${id}-q`} className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const showCorrect = checked && i === q.answerIndex
          const showWrong = checked && isPicked && !correct
          return (
            <label
              key={opt}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                showCorrect ? "border-success bg-success/10" : showWrong ? "border-destructive bg-destructive/5" : isPicked ? "border-primary bg-secondary" : "hover:bg-muted/60",
                checked && "cursor-default"
              )}
            >
              <input type="radio" name={id} className="sr-only" checked={isPicked} disabled={checked} onChange={() => onPick(i)} />
              <span aria-hidden className={cn("grid size-4 shrink-0 place-items-center rounded-full border", isPicked && "border-primary")}>
                {isPicked && <span className="size-2 rounded-full bg-primary" />}
              </span>
              <span className="flex-1">{opt}</span>
              {showCorrect && <CheckCircle2 className="size-4 text-success" />}
              {showWrong && <XCircle className="size-4 text-destructive" />}
            </label>
          )
        })}
      </div>
      <div aria-live="polite">
        {checked ? (
          <div className={cn("mt-3 rounded-lg p-3 text-sm", correct ? "bg-success/10" : "bg-destructive/5")}>
            <span className="font-semibold">{correct ? "Correct! " : "Not quite. "}</span>
            {q.explanation}
            {!correct && (
              <button type="button" onClick={onRetry} className="ml-2 font-medium text-primary underline-offset-2 hover:underline">
                Try again
              </button>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-3" disabled={picked === null} onClick={onCheck}>
            Check answer
          </Button>
        )}
      </div>
    </fieldset>
  )
}
