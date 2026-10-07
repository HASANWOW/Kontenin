import type { Metadata } from "next"
import { IdeaGenerator } from "@/components/create/idea-generator"

export const metadata: Metadata = { title: "Content Ideas" }

export default function Page() {
  return <IdeaGenerator />
}
