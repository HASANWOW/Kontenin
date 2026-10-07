import type { Metadata } from "next"
import { VideoAnalyzer } from "@/components/ai-studio/video-analyzer"

export const metadata: Metadata = { title: "Analyze My Video" }

export default function Page() {
  return <VideoAnalyzer />
}
