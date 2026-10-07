"use client"

import { useStoreReady } from "@/lib/store/app-store"
import { PageSkeleton } from "./states"

/**
 * Renders children only once the persisted store has loaded for the current
 * user. Prevents a flash of another user's (or seed) data on first paint.
 */
export function StoreGate({ children, fallback = <PageSkeleton /> }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const ready = useStoreReady((s) => s.ready)
  return ready ? children : fallback
}
