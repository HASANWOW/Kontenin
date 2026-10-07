import type { Metadata } from "next"
import { TranscriptPage } from "@/components/ai-studio/transcript-viewer"

export const metadata: Metadata = { title: "Transcript" }

export default function Page() {
  return <TranscriptPage />
}
