import { NextResponse, type NextRequest } from "next/server"
import { COURSES } from "@/lib/data/courses"
import { MISSIONS } from "@/lib/data/missions"

/**
 * Optimistic auth gate. It only checks that a session cookie exists;
 * the real verification happens in `getSession()` inside the app layout.
 */

const PROTECTED = [
  "/dashboard",
  "/onboarding",
  "/learn",
  "/missions",
  "/create",
  "/ai-studio",
  "/planner",
  "/analytics",
  "/progress",
  "/profile",
  "/settings",
]
const AUTH_PAGES = ["/login", "/register"]

/**
 * Pages inside the session boundary stream, so a late notFound() can't change
 * the status code. Unknown catalog ids are rejected here to return a real 404.
 */
function isUnknownCatalogPath(pathname: string): boolean {
  const learn = pathname.match(/^\/learn\/([^/]+)(?:\/([^/]+))?\/?$/)
  if (learn) {
    const course = COURSES.find((c) => c.id === learn[1])
    return !course || (learn[2] !== undefined && !course.lessons.some((l) => l.id === learn[2]))
  }
  const mission = pathname.match(/^\/missions\/([^/]+)\/?$/)
  return mission ? !MISSIONS.some((m) => m.id === mission[1]) : false
}

function hasSession(req: NextRequest): boolean {
  if (req.cookies.has("kontenin_session")) return true
  return req.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"))
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const signedIn = hasSession(req)

  if (!signedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  if (isUnknownCatalogPath(pathname)) {
    // No route matches this path, so Next.js serves app/not-found.tsx with a 404 status.
    return NextResponse.rewrite(new URL("/_kontenin-not-found", req.url))
  }

  if (signedIn && AUTH_PAGES.includes(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
}
