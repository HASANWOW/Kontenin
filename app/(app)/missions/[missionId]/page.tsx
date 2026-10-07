import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MissionDetail } from "@/components/missions/mission-detail"
import { getMission, MISSIONS } from "@/lib/data/missions"

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ missionId: m.id }))
}

export async function generateMetadata({ params }: PageProps<"/missions/[missionId]">): Promise<Metadata> {
  const { missionId } = await params
  return { title: getMission(missionId)?.title ?? "Mission" }
}

export default async function MissionPage({ params }: PageProps<"/missions/[missionId]">) {
  const { missionId } = await params
  if (!getMission(missionId)) notFound()
  return <MissionDetail key={missionId} missionId={missionId} />
}
