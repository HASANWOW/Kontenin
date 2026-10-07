"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/shared/logo"
import { ProgressBar } from "@/components/shared/progress-bar"
import { levelFor, levelProgress } from "@/lib/data/gamification"
import { fullNumber } from "@/lib/format"
import { isActive, MAIN_NAV } from "@/lib/navigation"
import { useAppStore, useStoreReady } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {MAIN_NAV.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {active && <span aria-hidden className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-primary" />}
            <item.icon className={cn("size-[18px] shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function SidebarUserCard({ onNavigate }: { onNavigate?: () => void }) {
  const ready = useStoreReady((s) => s.ready)
  const xp = useAppStore((s) => s.xp)
  const name = useAppStore((s) => s.profile.name)
  const level = levelFor(xp)

  if (!ready) return <div className="h-[104px] animate-pulse rounded-2xl bg-muted" />

  return (
    <Link
      href="/progress"
      onClick={onNavigate}
      className="block rounded-2xl border bg-card p-3 transition-colors outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center gap-2.5">
        <UserAvatar name={name} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">
            Level {level.level} · {level.title}
          </div>
        </div>
      </div>
      <ProgressBar className="mt-3 h-1.5" value={levelProgress(xp)} label="XP progress to next level" />
      <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{fullNumber(xp)} XP</span>
        <span>{level.nextXp ? `${fullNumber(level.nextXp)} XP` : "Max level"}</span>
      </div>
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-3 py-5 lg:flex">
      <Logo href="/dashboard" className="mb-7 px-2" />
      <SidebarNav />
      <div className="mt-auto">
        <SidebarUserCard />
      </div>
    </aside>
  )
}
