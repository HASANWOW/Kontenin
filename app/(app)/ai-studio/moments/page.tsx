import type { Metadata } from "next"
import { MomentFinder } from "@/components/ai-studio/moment-finder"

export const metadata: Metadata = { title: "Find Best Moments" }

export default function Page() {
  return <MomentFinder />
}
