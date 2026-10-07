"use client"

import { Circle, RotateCcw, Square, Video } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type Phase = "idle" | "preview" | "recording" | "recorded" | "error"

/**
 * Private practice recorder. Uses the camera via MediaRecorder; the video stays
 * in this browser tab as a blob URL and is never uploaded.
 */
export function PrivateRecorder() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [error, setError] = useState("")
  const [seconds, setSeconds] = useState(0)
  const [url, setUrl] = useState<string | null>(null)
  const liveRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  useEffect(() => {
    if (phase !== "recording") return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser doesn't support in-page recording. Record with your phone camera instead.")
      setPhase("error")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })
      streamRef.current = stream
      setPhase("preview")
      requestAnimationFrame(() => {
        if (liveRef.current) liveRef.current.srcObject = stream
      })
    } catch {
      setError("Camera access was blocked. Allow camera and microphone in your browser settings to record.")
      setPhase("error")
    }
  }

  function start() {
    if (!streamRef.current) return
    chunks.current = []
    const rec = new MediaRecorder(streamRef.current)
    rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data)
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: rec.mimeType || "video/webm" })
      setUrl(URL.createObjectURL(blob))
      setPhase("recorded")
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    recorderRef.current = rec
    setSeconds(0)
    rec.start()
    setPhase("recording")
  }

  function stop() {
    recorderRef.current?.stop()
  }

  function reset() {
    if (url) URL.revokeObjectURL(url)
    setUrl(null)
    setPhase("idle")
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Video className="size-4 text-primary" /> Private recording (optional)
        </p>
        <span className="text-xs text-muted-foreground">Stays on this device</span>
      </div>

      {phase === "idle" && (
        <Button variant="outline" size="lg" className="mt-3 h-10" onClick={openCamera}>
          <Video /> Open camera
        </Button>
      )}

      {phase === "error" && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {(phase === "preview" || phase === "recording") && (
        <div className="mt-3">
          <video ref={liveRef} autoPlay muted playsInline className="aspect-[9/16] max-h-80 w-auto rounded-lg bg-black object-cover" aria-label="Camera preview" />
          <div className="mt-3 flex items-center gap-3">
            {phase === "preview" ? (
              <Button size="lg" className="h-10 bg-destructive text-white hover:bg-destructive/90" onClick={start}>
                <Circle className="fill-current" /> Start recording
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="h-10" onClick={stop}>
                <Square className="fill-current" /> Stop · {seconds}s
              </Button>
            )}
            {phase === "recording" && <span className="flex items-center gap-1.5 text-sm text-destructive"><span className="size-2 animate-pulse rounded-full bg-destructive" /> Recording</span>}
          </div>
        </div>
      )}

      {phase === "recorded" && url && (
        <div className="mt-3">
          <video src={url} controls playsInline className="aspect-[9/16] max-h-80 w-auto rounded-lg bg-black" aria-label="Your recording" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="lg" className="h-10" onClick={reset}>
              <RotateCcw /> Record again
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Watch it back, then write your self-review below.</p>
        </div>
      )}
    </div>
  )
}
