import type { Metadata } from "next"
import { BriefBuilder } from "@/components/create/brief-builder"

export const metadata: Metadata = { title: "Content Brief" }

export default function Page() {
  return <BriefBuilder />
}
