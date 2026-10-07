import type { Metadata } from "next"
import { ClipGenerator } from "@/components/ai-studio/clip-generator"

export const metadata: Metadata = { title: "Generate Clips" }

export default function Page() {
  return <ClipGenerator />
}
