import { Suspense } from "react"
import { SessionProvider } from "@/components/providers/session-provider"
import { StoreGate } from "@/components/shared/store-gate"
import { requireSession } from "@/lib/auth/session"
import { getServiceStatus } from "@/lib/services-status"

/** Session-gated: navigations into this segment may block on the session read. */
export const instant = false

export default function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  return (
    <div className="min-h-screen bg-brand-soft">
      <Suspense fallback={<div className="min-h-screen" />}>
        <OnboardingSession>{children}</OnboardingSession>
      </Suspense>
    </div>
  )
}

async function OnboardingSession({ children }: { children: React.ReactNode }) {
  const user = await requireSession()
  return (
    <SessionProvider user={user} services={getServiceStatus()}>
      <StoreGate fallback={<div className="min-h-screen" />}>{children}</StoreGate>
    </SessionProvider>
  )
}
