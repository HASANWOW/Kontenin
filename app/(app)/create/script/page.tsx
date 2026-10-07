import type { Metadata } from "next"
import { ScriptGenerator } from "@/components/create/script-generator"

export const metadata: Metadata = { title: "Script Generator" }

export default function Page() {
  return <ScriptGenerator />
}
