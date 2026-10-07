import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { errorMessage } from "@/lib/action-result"
import { getSession } from "@/lib/auth/session"
import { runVideo } from "./video.service"
import type { VideoRef, VideoService } from "./types"

export const videoRefSchema = z.object({
  videoId: z.string().min(1).max(200),
  fileName: z.string().min(1).max(260),
  durationSeconds: z.number().min(0).max(4 * 3600),
})

/** Shared handler: auth → validate JSON → call the video service → JSON response. */
export async function handleVideoRequest<S extends z.ZodTypeAny, T>(
  req: Request,
  schema: S,
  task: (svc: VideoService, input: z.infer<S>) => Promise<T>
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized. Please log in again." }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  try {
    const result = await runVideo((svc) => task(svc, parsed.data))
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error("[video]", err)
    return NextResponse.json({ ok: false, error: errorMessage(err) }, { status: 502 })
  }
}

export type { VideoRef }
