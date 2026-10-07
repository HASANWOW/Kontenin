import type { Metadata } from "next"
import { Repurposer } from "@/components/create/repurposer"

export const metadata: Metadata = { title: "Content Repurposer" }

export default function Page() {
  return <Repurposer />
}
