"use client"

import { create } from "zustand"

/** Shared playback state so lists (moments, transcript, clips) can seek the active player. */
interface PlayerState {
  time: number
  playing: boolean
  /** Pending seek request, consumed by <VideoStage>. */
  seekRequest: { t: number; play: boolean; nonce: number } | null
  /** Optional stop point for clip previews. */
  stopAt: number | null
  setTime(t: number): void
  setPlaying(p: boolean): void
  seek(t: number, opts?: { play?: boolean; stopAt?: number | null }): void
  consumeSeek(): void
}

export const usePlayer = create<PlayerState>((set) => ({
  time: 0,
  playing: false,
  seekRequest: null,
  stopAt: null,
  setTime: (time) => set({ time }),
  setPlaying: (playing) => set({ playing }),
  seek: (t, opts) => set({ seekRequest: { t, play: opts?.play ?? true, nonce: Date.now() }, stopAt: opts?.stopAt ?? null }),
  consumeSeek: () => set({ seekRequest: null }),
}))
