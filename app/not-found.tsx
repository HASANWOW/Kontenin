import Link from "next/link"
import { LogoMark } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-soft px-4">
      <div className="text-center">
        <LogoMark className="mx-auto mb-6 size-12" />
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page took an unscheduled break</h1>
        <p className="mt-2 text-muted-foreground">The link may be broken, or the page may have moved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
            Go to dashboard
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}>
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
