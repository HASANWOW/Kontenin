"use client"

import { createContext, useContext, useEffect } from "react"
import type { ServiceStatus } from "@/lib/services-status"
import { useAppStore, useStoreReady } from "@/lib/store/app-store"
import type { SessionUser } from "@/types/domain"

interface SessionContextValue {
  user: SessionUser
  services: ServiceStatus
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ user, services, children }: SessionContextValue & { children: React.ReactNode }) {
  const setReady = useStoreReady((s) => s.setReady)

  useEffect(() => {
    let cancelled = false
    Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
      if (cancelled) return
      useAppStore.getState().initForUser(user)
      setReady()
    })
    return () => {
      cancelled = true
    }
  }, [user, setReady])

  return <SessionContext.Provider value={{ user, services }}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>")
  return ctx
}
