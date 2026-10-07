import "server-only"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options)
        } catch {
          // Called from a Server Component where cookies are read-only; the proxy refreshes sessions.
        }
      },
    },
  })
}
