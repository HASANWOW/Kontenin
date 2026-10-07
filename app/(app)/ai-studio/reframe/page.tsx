import type { Metadata } from "next"
import { ReframeStudio } from "@/components/ai-studio/reframe-studio"

export const metadata: Metadata = { title: "Auto Reframe" }

export default function Page() {
  return <ReframeStudio />
}
