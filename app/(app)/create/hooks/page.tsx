import type { Metadata } from "next"
import { HookGenerator } from "@/components/create/hook-generator"

export const metadata: Metadata = { title: "Hook Generator" }

export default function Page() {
  return <HookGenerator />
}
