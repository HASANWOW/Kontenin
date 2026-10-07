import { cn } from "@/lib/utils"
import type { PlatformId } from "@/types/domain"

const STYLES: Record<PlatformId, { label: string; short: string; className: string }> = {
  tiktok: { label: "TikTok", short: "TT", className: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" },
  instagram: { label: "Instagram", short: "IG", className: "bg-gradient-to-br from-amber-400 via-pink-500 to-violet-600 text-white" },
  youtube: { label: "YouTube", short: "YT", className: "bg-red-600 text-white" },
  youtube_shorts: { label: "YT Shorts", short: "YS", className: "bg-red-600 text-white" },
}

export const PLATFORM_OPTIONS = (Object.keys(STYLES) as PlatformId[]).map((p) => ({ value: p, label: STYLES[p].label }))

export function PlatformBadge({ platform, withLabel = false, className }: { platform: PlatformId; withLabel?: boolean; className?: string }) {
  const s = STYLES[platform]
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-md text-[9px] font-bold tracking-tight", s.className)}>
        {s.short}
      </span>
      {withLabel ? <span className="text-xs font-medium">{s.label}</span> : <span className="sr-only">{s.label}</span>}
    </span>
  )
}
