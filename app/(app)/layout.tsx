import { Suspense } from "react"
import { MobileNav } from "@/components/layout/mobile-nav"
import { OnboardingGuard } from "@/components/layout/onboarding-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { SessionProvider } from "@/components/providers/session-provider"
import { PageSkeleton } from "@/components/shared/states"
import { StoreGate } from "@/components/shared/store-gate"
import { requireSession } from "@/lib/auth/session"
import { getServiceStatus } from "@/lib/services-status"

/** Session-gated: navigations into this segment may block on the session read. */
export const instant = false

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {/* The session is read per request, so it streams in behind this boundary. */}
      <Suspense fallback={<ShellFallback />}>
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </Suspense>
    </>
  )
}

async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const user = await requireSession()
  return (
    <SessionProvider user={user} services={getServiceStatus()}>
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main id="main" className="mx-auto max-w-[1400px] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">
          <StoreGate>
            <OnboardingGuard>{children}</OnboardingGuard>
          </StoreGate>
        </main>
      </div>
      <MobileNav />
    </SessionProvider>
  )
}

function ShellFallback() {
  return (
    <div className="lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-sidebar lg:block" />
      <div className="h-16 border-b" />
      <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <PageSkeleton />
      </div>
    </div>
  )
}
