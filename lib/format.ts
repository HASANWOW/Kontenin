export function compactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)
}

export function fullNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}

export function percent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`
}

/** 75 → "01:15" */
export function timestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = Math.round((now - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 11) return "Good morning"
  if (h < 15) return "Good afternoon"
  if (h < 19) return "Good evening"
  return "Good night"
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function fileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Local calendar date as yyyy-mm-dd (not UTC, unlike toISOString). */
export function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
