"use client"

import { Film, Pause, Play } from "lucide-react"
import { useEffect, useRef } from "react"
import { timestamp } from "@/lib/format"
import { usePlayer } from "@/lib/store/player-store"
import type { ActiveVideo } from "@/lib/store/video-store"
import { cn } from "@/lib/utils"

/**
 * Plays the user's file when a local blob URL exists. For the sample (or after a
 * reload, when the blob is gone) it shows a simulated player whose clock still
 * drives transcripts, moments and captions.
 */
export function VideoStage({
  video,
  className,
  aspect = "aspect-video",
  fit = "contain",
  objectPosition,
  overlay,
}: {
  video: ActiveVideo
  className?: string
  aspect?: string
  fit?: "contain" | "cover"
  objectPosition?: string
  overlay?: React.ReactNode
}) {
  return video.objectUrl ? (
    <RealPlayer video={video} className={className} aspect={aspect} fit={fit} objectPosition={objectPosition} overlay={overlay} />
  ) : (
    <SimulatedPlayer video={video} className={className} aspect={aspect} overlay={overlay} />
  )
}

function RealPlayer({ video, className, aspect, fit, objectPosition, overlay }: { video: ActiveVideo; className?: string; aspect: string; fit: "contain" | "cover"; objectPosition?: string; overlay?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null)
  const seekRequest = usePlayer((s) => s.seekRequest)
  const { consumeSeek, setTime, setPlaying } = usePlayer.getState()

  useEffect(() => {
    const el = ref.current
    if (!el || !seekRequest) return
    el.currentTime = seekRequest.t
    if (seekRequest.play) void el.play().catch(() => undefined)
    consumeSeek()
  }, [seekRequest, consumeSeek])

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-black", aspect, className)}>
      <video
        ref={ref}
        src={video.objectUrl}
        controls
        playsInline
        className={cn("size-full", fit === "cover" ? "object-cover" : "object-contain")}
        style={objectPosition ? { objectPosition } : undefined}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime
          setTime(t)
          const stopAt = usePlayer.getState().stopAt
          if (stopAt !== null && t >= stopAt) {
            e.currentTarget.pause()
            usePlayer.setState({ stopAt: null })
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`Video preview: ${video.fileName}`}
      />
      {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
    </div>
  )
}

function SimulatedPlayer({ video, className, aspect, overlay }: { video: ActiveVideo; className?: string; aspect: string; overlay?: React.ReactNode }) {
  const time = usePlayer((s) => s.time)
  const playing = usePlayer((s) => s.playing)
  const seekRequest = usePlayer((s) => s.seekRequest)
  const duration = video.durationSeconds || 1

  useEffect(() => {
    if (!seekRequest) return
    usePlayer.setState({ time: seekRequest.t, playing: seekRequest.play, seekRequest: null })
  }, [seekRequest])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      const s = usePlayer.getState()
      const next = s.time + 0.25
      if (next >= duration || (s.stopAt !== null && next >= s.stopAt)) {
        usePlayer.setState({ playing: false, time: Math.min(next, duration), stopAt: null })
      } else usePlayer.setState({ time: next })
    }, 250)
    return () => clearInterval(t)
  }, [playing, duration])

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-zinc-950 text-white", aspect, className)}>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_10%,rgb(108_59_255/0.55),transparent),radial-gradient(70%_70%_at_90%_90%,rgb(236_72_153/0.35),transparent)]" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
        <Film className="size-3.5" /> {video.isSample ? "Sample video (simulated playback)" : "Preview unavailable after reload — re-upload to watch"}
      </div>
      {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-3">
        <button
          type="button"
          onClick={() => usePlayer.setState({ playing: !playing })}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-zinc-900 outline-none focus-visible:ring-3 focus-visible:ring-white/50"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.25}
          value={time}
          onChange={(e) => usePlayer.setState({ time: Number(e.target.value) })}
          className="h-1 flex-1 cursor-pointer accent-white"
          aria-label="Seek"
        />
        <span className="shrink-0 font-mono text-xs tabular-nums">
          {timestamp(time)} / {timestamp(duration)}
        </span>
      </div>
    </div>
  )
}
