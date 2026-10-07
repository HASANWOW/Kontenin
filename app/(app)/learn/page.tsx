import type { Metadata } from "next"
import { LearnLibrary } from "@/components/learning/learn-library"

export const metadata: Metadata = { title: "Learn" }

export default function LearnPage() {
  return <LearnLibrary />
}
