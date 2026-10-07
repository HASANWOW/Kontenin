import Link from "next/link"
import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative grid size-8 shrink-0 place-items-center rounded-[10px] bg-brand-gradient text-white shadow-glow", className)}
    >
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none">
        <path d="M7 4v16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M17.5 5.5 9.5 12l8 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
      </svg>
    </span>
  )
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight">Kontenin</span>
    </Link>
  )
}
