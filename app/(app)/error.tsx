"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/shared/states"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <ErrorState
      className="mx-auto mt-10 max-w-lg"
      title="This page couldn't load"
      description="An unexpected error occurred. Your progress is saved — try again, or head back to the dashboard."
      onRetry={reset}
    />
  )
}
