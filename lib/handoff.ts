"use client"

/** One-shot data passing between tools (e.g. script → analyzer) via sessionStorage. */

const PREFIX = "kontenin-handoff:"

export function putHandoff(key: string, value: unknown) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode) — the target page simply starts empty.
  }
}

/** Non-destructive read, safe inside a useState initializer (which may run twice in Strict Mode). */
export function peekHandoff<T>(key: string): T | null {
  try {
    if (typeof window === "undefined") return null
    const raw = sessionStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function clearHandoff(key: string) {
  try {
    sessionStorage.removeItem(PREFIX + key)
  } catch {
    // ignore
  }
}
