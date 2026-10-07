import { NextResponse } from "next/server"
import { z } from "zod"
import { errorMessage } from "@/lib/action-result"
import { getSession } from "@/lib/auth/session"
import { runVideo } from "@/lib/video/video.service"

const MAX_BYTES = 500 * 1024 * 1024
const ALLOWED = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"]

const metaSchema = z
  .object({
    fileName: z.string().min(1).max(260),
    sizeBytes: z.number().min(0).max(MAX_BYTES, "Video is larger than 500 MB."),
    mimeType: z.string().max(100),
    durationSeconds: z.number().min(0).max(4 * 3600),
    sourceUrl: z.url("Enter a valid video URL.").optional(),
  })
  .refine((m) => m.sourceUrl || ALLOWED.includes(m.mimeType), { message: "Unsupported format. Use MP4, MOV, or WebM." })

/**
 * Accepts either JSON metadata (URL imports, and demo mode where the file
 * stays in the browser) or multipart form data with the file for real providers.
 */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized. Please log in again." }, { status: 401 })

  let meta: unknown
  let file: Blob | undefined
  try {
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await req.formData()
      const entry = form.get("file")
      file = entry instanceof Blob ? entry : undefined
      meta = JSON.parse(String(form.get("meta") ?? "{}"))
    } else {
      meta = await req.json()
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed: the request could not be read." }, { status: 400 })
  }

  const parsed = metaSchema.safeParse(meta)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid upload." }, { status: 400 })
  }

  try {
    const result = await runVideo((svc) => svc.upload(parsed.data, file))
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error("[video/upload]", err)
    return NextResponse.json({ ok: false, error: `Upload failed. ${errorMessage(err)}` }, { status: 502 })
  }
}
