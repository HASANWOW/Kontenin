import type { Metadata } from "next"
import { StudioHub } from "@/components/ai-studio/studio-hub"

export const metadata: Metadata = { title: "AI Studio" }

export default function AIStudioPage() {
  return <StudioHub />
}
