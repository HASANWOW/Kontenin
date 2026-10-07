import type { Metadata } from "next"
import { ContentAnalyzer } from "@/components/create/content-analyzer"

export const metadata: Metadata = { title: "Analyze My Content" }

export default function Page() {
  return <ContentAnalyzer />
}
