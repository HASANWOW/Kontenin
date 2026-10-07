"use client"

import { Check } from "lucide-react"
import { useId } from "react"
import { cn } from "@/lib/utils"

export interface Choice<V extends string> {
  value: V
  label: string
  description?: string
  icon?: React.ReactNode
}

interface BaseProps<V extends string> {
  label: string
  hideLabel?: boolean
  choices: readonly Choice<V>[]
  className?: string
  size?: "sm" | "md" | "lg"
  columns?: string
}

/** Accessible chip/card picker. Single mode is a radiogroup, multi mode a group of checkboxes. */
export function ChoiceGroup<V extends string>(
  props: BaseProps<V> & ({ multiple?: false; value: V | null; onChange: (v: V) => void } | { multiple: true; value: V[]; onChange: (v: V[]) => void })
) {
  const id = useId()
  const { label, hideLabel, choices, className, size = "sm", columns } = props
  const isSelected = (v: V) => (props.multiple ? props.value.includes(v) : props.value === v)

  function toggle(v: V) {
    if (props.multiple) props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v])
    else props.onChange(v)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (props.multiple) return
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1
    const next = (index + dir + choices.length) % choices.length
    props.onChange(choices[next].value)
    const el = document.getElementById(`${id}-${next}`)
    el?.focus()
  }

  const selectedIndex = choices.findIndex((c) => isSelected(c.value))

  return (
    <div className={className}>
      <div id={`${id}-label`} className={cn("mb-2 text-sm font-medium", hideLabel && "sr-only")}>
        {label}
      </div>
      <div
        role={props.multiple ? "group" : "radiogroup"}
        aria-labelledby={`${id}-label`}
        className={cn(size === "lg" ? "grid gap-3" : "flex flex-wrap gap-2", columns)}
      >
        {choices.map((c, i) => {
          const selected = isSelected(c.value)
          return (
            <button
              key={c.value}
              id={`${id}-${i}`}
              type="button"
              role={props.multiple ? "checkbox" : "radio"}
              aria-checked={selected}
              tabIndex={props.multiple || selected || (selectedIndex === -1 && i === 0) ? 0 : -1}
              onClick={() => toggle(c.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative flex items-center gap-2 border text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                size === "lg" ? "rounded-xl px-4 py-3.5" : size === "md" ? "rounded-xl px-3.5 py-2.5 text-sm" : "h-8 rounded-full px-3 text-[13px]",
                selected
                  ? "border-primary bg-secondary text-secondary-foreground shadow-[0_0_0_1px_var(--primary)]"
                  : "border-border bg-card hover:border-primary/40 hover:bg-accent/40"
              )}
            >
              {c.icon}
              <span className="min-w-0 flex-1">
                <span className={cn("block font-medium", size === "lg" && "text-[15px]")}>{c.label}</span>
                {c.description && <span className="mt-0.5 block text-xs text-muted-foreground">{c.description}</span>}
              </span>
              {selected && size !== "sm" && (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
