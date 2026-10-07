import type { Metadata } from "next"
import { CaptionStudio } from "@/components/ai-studio/caption-studio"

export const metadata: Metadata = { title: "Caption Studio" }

export default function Page() {
  return <CaptionStudio />
}
