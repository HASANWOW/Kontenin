"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Logo } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#how-it-works", label: "Cara kerja" },
  { href: "#features", label: "Fitur" },
  { href: "#demo", label: "Coba AI" },
  { href: "#pricing", label: "Harga" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn("sticky top-0 z-40 transition-colors", scrolled || open ? "border-b bg-background/85 backdrop-blur-md" : "bg-transparent")}>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-9 px-3")}>
            Masuk
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-9 bg-brand-gradient px-4 shadow-glow")}>
            Mulai Gratis
          </Link>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t px-4 pb-5 md:hidden">
          <ul className="py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 font-medium">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11")}>
              Masuk
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-11 bg-brand-gradient")}>
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
