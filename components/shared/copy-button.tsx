"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyButton({ text, label = "Copy", size = "sm", variant = "outline" }: { text: string; label?: string; size?: "sm" | "default" | "lg" | "icon-sm"; variant?: "outline" | "ghost" | "secondary" }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.")
    }
  }
  const icon = copied ? <Check /> : <Copy />
  if (size === "icon-sm") {
    return (
      <Button variant={variant} size="icon-sm" onClick={copy} aria-label={label}>
        {icon}
      </Button>
    )
  }
  return (
    <Button variant={variant} size={size} onClick={copy}>
      {icon}
      {copied ? "Copied" : label}
    </Button>
  )
}
