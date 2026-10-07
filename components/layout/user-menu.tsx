"use client"

import { LogOut, Monitor, Moon, Settings, Sun, Trophy, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { logoutAction } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/lib/store/app-store"
import { UserAvatar } from "./user-avatar"

export function UserMenu() {
  const profile = useAppStore((s) => s.profile)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Open profile menu">
        <UserAvatar name={profile.name} className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="py-2">
            <div className="text-sm font-semibold text-foreground">{profile.name}</div>
            <div className="truncate text-xs font-normal">{profile.email}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/progress")}>
            <Trophy /> Progress & badges
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings /> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme ?? "light"} onValueChange={(v) => setTheme(String(v))}>
            <DropdownMenuRadioItem value="light">
              <Sun /> Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon /> Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor /> System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={pending} onClick={() => startTransition(() => logoutAction())}>
          <LogOut /> {pending ? "Logging out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
