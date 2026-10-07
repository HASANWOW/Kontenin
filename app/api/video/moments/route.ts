import { z } from "zod"
import { handleVideoRequest, videoRefSchema } from "@/lib/video/route-helpers"

const schema = videoRefSchema.extend({ query: z.string().trim().min(2, "Describe the moment you're looking for.").max(200) })

export async function POST(req: Request) {
  return handleVideoRequest(req, schema, (svc, { query, ...ref }) => svc.findMoments(ref, query))
}
