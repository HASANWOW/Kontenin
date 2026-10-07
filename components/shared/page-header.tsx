import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  back?: { href: string; label: string }
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, eyebrow, back, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-3 inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronLeft className="size-4" />
            {back.label}
          </Link>
        )}
        {eyebrow && <div className="mb-1.5 text-xs font-semibold tracking-wider text-primary uppercase">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
