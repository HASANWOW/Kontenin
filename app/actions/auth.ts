"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { addAccount, DEMO_USER, encodeSigned, SESSION_COOKIE, USERS_COOKIE, verifyCredentials } from "@/lib/auth/mock-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { SessionUser } from "@/types/domain"

export interface AuthFormState {
  error?: string
  fieldErrors?: Record<string, string>
  message?: string
  email?: string
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
}

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(60),
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    out[key] ??= issue.message
  }
  return out
}

/** Only allow same-site relative redirects. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const next = typeof value === "string" ? value : ""
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback
}

async function startLocalSession(user: SessionUser) {
  const store = await cookies()
  store.set(SESSION_COOKIE, encodeSigned(user), COOKIE_OPTIONS)
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") })
  const email = String(formData.get("email") ?? "")
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), email }

  const next = safeNext(formData.get("next"), "/dashboard")

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)
    if (error) return { error: error.message, email }
    redirect(next)
  }

  const store = await cookies()
  const user = verifyCredentials(parsed.data.email, parsed.data.password, store.get(USERS_COOKIE)?.value)
  if (!user) return { error: "Incorrect email or password.", email }
  await startLocalSession(user)
  redirect(next)
}

export async function demoLoginAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({ email: DEMO_USER.email, password: DEMO_USER.password })
    if (error) redirect("/login?error=demo")
    redirect("/dashboard")
  }
  await startLocalSession({ id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name })
  redirect("/dashboard")
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  const email = String(formData.get("email") ?? "")
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), email }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? ""
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { full_name: parsed.data.name }, emailRedirectTo: `${origin}/onboarding` },
    })
    if (error) return { error: error.message, email }
    if (!data.session) return { message: "Check your inbox to confirm your email, then log in.", email }
    redirect("/onboarding")
  }

  const store = await cookies()
  const result = addAccount(store.get(USERS_COOKIE)?.value, parsed.data)
  if ("error" in result) return { error: result.error, email }
  store.set(USERS_COOKIE, result.token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 365 })
  await startLocalSession(result.user)
  redirect("/onboarding")
}

export async function forgotPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = z.object({ email: z.email("Enter a valid email address.") }).safeParse({ email: formData.get("email") })
  const email = String(formData.get("email") ?? "")
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), email }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? ""
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${origin}/settings` })
    if (error) return { error: error.message, email }
    return { message: "If an account exists for this email, a reset link is on its way.", email }
  }

  return {
    message: "Demo mode: no email was sent because email delivery isn't configured. Connect Supabase to enable password resets.",
    email,
  }
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect("/login")
}
