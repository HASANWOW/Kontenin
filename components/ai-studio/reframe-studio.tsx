"use client"

import { FlaskConical, Info } from "lucide-react"
import { useState } from "react"
import { useSession } from "@/components/providers/session-provider"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { Slider } from "@/components/ui/slider"
import type { ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"
import { StudioFrame } from "./studio-frame"
import { VideoStage } from "./video-stage"

type Ratio = "16:9" | "9:16" | "1:1"
type Mode = "center" | "face" | "auto"

const RATIOS = [
  { value: "16:9", label: "16:9", description: "YouTube" },
  { value: "9:16", label: "9:16", description: "TikTok · Reels · Shorts" },
  { value: "1:1", label: "1:1", description: "Feed post" },
] as const
const MODES = [
  { value: "center", label: "Center Subject" },
  { value: "face", label: "Face Tracking" },
  { value: "auto", label: "Auto Crop" },
] as const

const ASPECT: Record<Ratio, string> = { "16:9": "aspect-video", "9:16": "aspect-[9/16]", "1:1": "aspect-square" }
const WIDTH: Record<Ratio, string> = { "16:9": "max-w-full", "9:16": "max-w-[300px]", "1:1": "max-w-[420px]" }

export function ReframeStudio() {
  return (
    <StudioFrame title="Auto Reframe" description="Preview how your video crops into vertical, square, and widescreen formats.">
      {(video) => <ReframeBody key={video.videoId} video={video} />}
    </StudioFrame>
  )
}

function ReframeBody({ video }: { video: ActiveVideo }) {
  const { services } = useSession()
  const [ratio, setRatio] = useState<Ratio>("9:16")
  const [mode, setMode] = useState<Mode>("center")
  const [offset, setOffset] = useState(50)

  // Only manual/center cropping is implemented in the browser. Tracking needs a video AI provider.
  const tracking = mode !== "center"
  const position = `${tracking && services.video === "demo" ? 50 : offset}% 50%`

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="flex flex-col items-center rounded-2xl border bg-muted/40 p-6">
        <div className={cn("w-full", WIDTH[ratio])}>
          <VideoStage video={video} aspect={ASPECT[ratio]} fit="cover" objectPosition={position} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Previewing <span className="font-medium text-foreground">{ratio}</span> · {MODES.find((m) => m.value === mode)?.label}
        </p>
      </div>
      <div className="space-y-4">
        <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft">
          <ChoiceGroup label="Aspect ratio" size="md" choices={RATIOS} value={ratio} onChange={setRatio} />
          <ChoiceGroup label="Framing" choices={MODES} value={mode} onChange={setMode} />
          {mode === "center" ? (
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span id="crop-label">Horizontal position</span>
                <span className="text-muted-foreground tabular-nums">{offset}%</span>
              </div>
              <Slider aria-labelledby="crop-label" min={0} max={100} step={1} value={[offset]} onValueChange={(v) => setOffset(Array.isArray(v) ? v[0] : v)} />
              <p className="mt-2 text-xs text-muted-foreground">Slide to keep your subject inside the frame.</p>
            </div>
          ) : (
            <div className="flex gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p>
                {services.video === "demo" ? (
                  <>
                    <span className="font-semibold">Demo:</span> {mode === "face" ? "face tracking" : "auto crop"} isn&apos;t running — no video AI provider is connected, so the preview uses a fixed center crop.
                  </>
                ) : (
                  <>Tracking is processed by your video AI provider when you export. The preview shows a center crop.</>
                )}
              </p>
            </div>
          )}
        </section>
        <section className="flex gap-3 rounded-2xl border bg-card p-5 text-sm shadow-soft">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Framing tips</p>
            <ul className="mt-1.5 space-y-1 text-muted-foreground">
              <li>• Record 9:16 natively when possible — reframing loses resolution.</li>
              <li>• Keep your eyes in the upper third of the frame.</li>
              <li>• Leave space at the bottom for platform captions and buttons.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
