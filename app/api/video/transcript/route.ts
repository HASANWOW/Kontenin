import { handleVideoRequest, videoRefSchema } from "@/lib/video/route-helpers"

export async function POST(req: Request) {
  return handleVideoRequest(req, videoRefSchema, (svc, ref) => svc.transcribe(ref))
}
