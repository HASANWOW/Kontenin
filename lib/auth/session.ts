import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { SessionUser } from "@/types/domain"
import { decodeSigned, SESSION_COOKIE } from "./mock-auth"

export type AuthMode = "supabase" | "local"

export function getAuthMode(): AuthMode {
  return isSupabaseConfigured() ? "supabase" : "local"
}

/** Cached per request, so layouts and pages can both call it cheaply. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    const meta = data.user.user_metadata as { full_name?: string } | undefined
    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: meta?.full_name || data.user.email?.split("@")[0] || "Creator",
    }
  }
  const store = await cookies()
  return decodeSigned<SessionUser>(store.get(SESSION_COOKIE)?.value)
})

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  // Go through the sign-out route so a stale cookie can't bounce between proxy and layout.
  if (!session) redirect("/api/auth/signout")
  return session
}
