"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import type { ActionResult } from "@/lib/action-result"

interface AIState<T> {
  data: T | null
  error: string | null
  source: "ai" | "demo" | null
  provider: string | null
}

/**
 * Runs a server action that returns ActionResult<T>, tracking pending, error,
 * and provenance. Stale responses (from a superseded call) are ignored.
 */
export function useAIAction<A extends unknown[], T>(action: (...args: A) => Promise<ActionResult<T>>, opts?: { errorToast?: boolean }) {
  const [state, setState] = useState<AIState<T>>({ data: null, error: null, source: null, provider: null })
  const [pending, startTransition] = useTransition()
  const callId = useRef(0)

  const run = useCallback(
    (...args: A) =>
      new Promise<T | null>((resolve) => {
        const id = ++callId.current
        startTransition(async () => {
          let result: ActionResult<T>
          try {
            result = await action(...args)
          } catch {
            result = { ok: false, error: "Network error — the server couldn't be reached." }
          }
          if (id !== callId.current) return resolve(null)
          if (result.ok) {
            setState({ data: result.data, error: null, source: result.source, provider: result.provider })
            resolve(result.data)
          } else {
            setState((s) => ({ ...s, error: result.error }))
            if (opts?.errorToast !== false) toast.error(result.error)
            resolve(null)
          }
        })
      }),
    [action, opts?.errorToast]
  )

  const reset = useCallback(() => {
    callId.current++
    setState({ data: null, error: null, source: null, provider: null })
  }, [])

  return { ...state, pending, run, reset, setData: (data: T) => setState((s) => ({ ...s, data })) }
}
