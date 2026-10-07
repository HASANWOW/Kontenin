import "server-only"
import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import type { SessionUser } from "@/types/domain"

/**
 * Local auth used when Supabase is not configured. Sessions and the list of
 * locally-registered accounts live in HMAC-signed cookies, so they can't be
 * forged client-side. This is a development fallback, not a user database.
 */

export const SESSION_COOKIE = "kontenin_session"
export const USERS_COOKIE = "kontenin_local_users"

export const DEMO_USER = {
  id: "demo-hasan",
  email: "demo@kontenin.id",
  password: "demo123",
  name: "Hasan",
} as const

interface LocalAccount {
  id: string
  email: string
  name: string
  passwordHash: string
}

function secret(): string {
  return process.env.AUTH_SECRET || "kontenin-dev-secret-change-me"
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function encodeSigned(value: unknown): string {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function decodeSigned<T>(token: string | undefined): T | null {
  if (!token) return null
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return null
  const expected = Buffer.from(sign(payload))
  const actual = Buffer.from(sig)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as T
  } catch {
    return null
  }
}

export function hashPassword(email: string, password: string): string {
  return createHash("sha256").update(`${email.toLowerCase()}:${password}:${secret()}`).digest("hex")
}

export function readAccounts(token: string | undefined): LocalAccount[] {
  return decodeSigned<LocalAccount[]>(token) ?? []
}

export function verifyCredentials(email: string, password: string, accountsToken: string | undefined): SessionUser | null {
  const normalized = email.trim().toLowerCase()
  if (normalized === DEMO_USER.email && password === DEMO_USER.password) {
    return { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name }
  }
  const account = readAccounts(accountsToken).find((a) => a.email === normalized)
  if (account && account.passwordHash === hashPassword(normalized, password)) {
    return { id: account.id, email: account.email, name: account.name }
  }
  return null
}

export function addAccount(
  accountsToken: string | undefined,
  input: { email: string; name: string; password: string }
): { token: string; user: SessionUser } | { error: string } {
  const email = input.email.trim().toLowerCase()
  const accounts = readAccounts(accountsToken)
  if (email === DEMO_USER.email || accounts.some((a) => a.email === email)) {
    return { error: "An account with this email already exists. Try logging in instead." }
  }
  const account: LocalAccount = {
    id: `local-${createHash("sha1").update(email).digest("hex").slice(0, 12)}`,
    email,
    name: input.name.trim(),
    passwordHash: hashPassword(email, input.password),
  }
  // Keep the cookie small: remember at most 5 local accounts per browser.
  const next = [...accounts, account].slice(-5)
  return { token: encodeSigned(next), user: { id: account.id, email, name: account.name } }
}
