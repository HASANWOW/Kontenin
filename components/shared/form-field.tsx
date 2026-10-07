import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FieldShellProps {
  label: string
  hint?: string
  error?: string
  className?: string
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode
}

export function FieldShell({ label, hint, error, className, children }: FieldShellProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

type InputFieldProps = Omit<React.ComponentProps<typeof Input>, "id"> & { label: string; hint?: string; error?: string; containerClassName?: string }

export function InputField({ label, hint, error, containerClassName, className, ...props }: InputFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={containerClassName}>
      {({ id, describedBy, invalid }) => (
        <Input id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cn("h-10", className)} {...props} />
      )}
    </FieldShell>
  )
}

type TextareaFieldProps = Omit<React.ComponentProps<typeof Textarea>, "id"> & { label: string; hint?: string; error?: string; containerClassName?: string }

export function TextareaField({ label, hint, error, containerClassName, ...props }: TextareaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={containerClassName}>
      {({ id, describedBy, invalid }) => <Textarea id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} {...props} />}
    </FieldShell>
  )
}

/** Styled native select — fully keyboard and screen-reader accessible by default. */
export function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
  className,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  options: readonly { value: string; label: string }[]
  className?: string
}) {
  return (
    <FieldShell label={label} hint={hint} className={className}>
      {({ id, describedBy }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-input bg-card bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b6875%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat px-3 pr-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}
