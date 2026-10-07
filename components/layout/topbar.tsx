"use client"

import { FlaskConical, Menu, Search } from "lucide-react"
import { useState } from "react"
import { useSession } from "@/components/providers/session-provider"
import { Logo, LogoMark } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CommandSearch } from "./command-search"
import { HelpDialog } from "./help-dialog"
import { NotificationsMenu } from "./notifications-menu"
import { SidebarNav, SidebarUserCard } from "./sidebar"
import { UserMenu } from "./user-menu"
import { useStoreReady } from "@/lib/store/app-store"

export function Topbar() {
  const [drawer, setDrawer] = useState(false)
  const { services } = useSession()
  const ready = useStoreReady((s) => s.ready)
  const demo = services.ai === "demo" || services.video === "demo"

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon-lg" className="rounded-xl lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}>
          <Menu className="size-5" />
        </Button>
        <LogoMark className="size-7 lg:hidden" />

        <div className="ml-1 flex flex-1 justify-center sm:justify-start lg:ml-0">
          <div className="hidden w-full sm:block">
            <CommandSearch />
          </div>
        </div>

        {demo && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  tabIndex={0}
                  className="hidden h-7 items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 text-xs font-medium text-amber-700 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:inline-flex dark:text-amber-300"
                />
              }
            >
              <FlaskConical className="size-3.5" /> Demo Mode
            </TooltipTrigger>
            <TooltipContent className="max-w-64">
              No AI API keys are configured, so AI results come from Kontenin&apos;s rule-based demo engine and are labeled “Demo data”.
            </TooltipContent>
          </Tooltip>
        )}
        <div className="sm:hidden">
          <CommandSearchIconOnly />
        </div>
        {ready ? <NotificationsMenu /> : <span className="size-9" aria-hidden />}
        <HelpDialog />
        <div className="ml-1">
          {ready ? <UserMenu /> : <span className="block size-9 animate-pulse rounded-full bg-muted" aria-hidden />}
        </div>
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-72 gap-0 p-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo href="/dashboard" className="mb-6 px-2" />
          <SidebarNav onNavigate={() => setDrawer(false)} />
          <div className="mt-auto pt-6">
            <SidebarUserCard onNavigate={() => setDrawer(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

/** On phones the search field collapses into an icon that opens the same palette via Ctrl/⌘K. */
function CommandSearchIconOnly() {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="rounded-xl"
      aria-label="Search"
      onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
    >
      <Search className="size-[18px]" />
    </Button>
  )
}
