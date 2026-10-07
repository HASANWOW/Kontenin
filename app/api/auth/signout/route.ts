import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth/mock-auth"

/** Clears an invalid or expired session cookie, then sends the user to login. */
export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url))
  res.cookies.delete(SESSION_COOKIE)
  for (const c of req.cookies.getAll()) {
    if (c.name.startsWith("sb-") && c.name.includes("auth-token")) res.cookies.delete(c.name)
  }
  return res
}
