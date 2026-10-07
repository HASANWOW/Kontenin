"use client"

import { Bell, CheckCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { relativeTime } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const notifications = useAppStore((s) => s.notifications)
  const markRead = useAppStore((s) => s.markNotificationRead)
  const markAll = useAppStore((s) => s.markAllNotificationsRead)
  const router = useRouter()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="relative rounded-xl" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} />
        }
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{unread}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold">Notifications</span>
          {unread > 0 && (
            <Button variant="ghost" size="xs" onClick={markAll}>
              <CheckCheck /> Mark all read
            </Button>
          )}
        </div>
        <ul className="max-h-96 overflow-y-auto p-1.5">
          {notifications.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</li>}
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                className="flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors outline-none hover:bg-muted focus-visible:bg-muted"
                onClick={() => {
                  markRead(n.id)
                  setOpen(false)
                  if (n.href) router.push(n.href)
                }}
              >
                <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                <span className="min-w-0">
                  <span className={cn("block text-sm", !n.read && "font-semibold")}>{n.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{relativeTime(n.at)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
