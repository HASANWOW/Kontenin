"use client"

import type { VideoProviderId, VideoRef } from "./types"

export type VideoApiResult<T> =
  | { ok: true; data: T; source: "ai" | "demo"; provider: VideoProviderId }
  | { ok: false; error: string }

/** Calls one of the /api/video/* routes and normalizes network failures. */
export async function callVideoApi<T>(path: string, body: unknown, init?: { signal?: AbortSignal }): Promise<VideoApiResult<T>> {
  try {
    const isForm = body instanceof FormData
    const res = await fetch(`/api/video/${path}`, {
      method: "POST",
      headers: isForm ? undefined : { "Content-Type": "application/json" },
      body: isForm ? body : JSON.stringify(body),
      signal: init?.signal,
    })
    if (res.status === 401) return { ok: false, error: "Your session has expired. Please log in again." }
    const json = (await res.json()) as VideoApiResult<T>
    return json
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return { ok: false, error: "Request cancelled." }
    return { ok: false, error: "Network error — check your connection and try again." }
  }
}

export type { VideoRef }
