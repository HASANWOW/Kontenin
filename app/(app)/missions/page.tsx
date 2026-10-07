import type { Metadata } from "next"
import { MissionsBoard } from "@/components/missions/missions-board"

export const metadata: Metadata = { title: "Missions" }

export default function MissionsPage() {
  return <MissionsBoard />
}
