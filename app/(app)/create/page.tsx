import type { Metadata } from "next"
import { CreateHub } from "@/components/create/create-hub"

export const metadata: Metadata = { title: "Create" }

export default function CreatePage() {
  return <CreateHub />
}
