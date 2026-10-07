import type { Metadata } from "next"
import { CaptionGenerator } from "@/components/create/caption-generator"

export const metadata: Metadata = { title: "Caption Generator" }

export default function Page() {
  return <CaptionGenerator />
}
