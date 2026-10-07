"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isActive, MAIN_NAV } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {MAIN_NAV.filter((n) => n.mobile).map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium outline-none focus-visible:bg-muted",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
