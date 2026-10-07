import { cn } from "@/lib/utils"

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "K"
  )
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 text-sm font-semibold text-white ring-2 ring-background",
        className
      )}
    >
      {initials(name)}
    </span>
  )
}
