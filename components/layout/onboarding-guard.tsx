"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PageSkeleton } from "@/components/shared/states"
import { useAppStore } from "@/lib/store/app-store"

/** New accounts must finish the creator diagnosis before using the app. */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const onboarded = useAppStore((s) => s.onboarded)
  const router = useRouter()
  useEffect(() => {
    if (!onboarded) router.replace("/onboarding")
  }, [onboarded, router])
  return onboarded ? children : <PageSkeleton />
}
