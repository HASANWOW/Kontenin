"use client"

import { CircleHelp } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function HelpDialog() {
  const { services } = useSession()
  const rows = [
    { label: "AI text features", value: services.ai === "demo" ? "Demo engine (rule-based)" : services.ai === "openai" ? "OpenAI" : "Gemini", live: services.ai !== "demo" },
    { label: "Video AI", value: services.video === "demo" ? "Demo data (sample transcript)" : "WayinVideo", live: services.video !== "demo" },
    { label: "Accounts", value: services.auth === "supabase" ? "Supabase Auth" : "Local (this browser)", live: services.auth === "supabase" },
  ]
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon-lg" className="rounded-xl" aria-label="Help" />}>
        <CircleHelp className="size-[18px]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help & status</DialogTitle>
          <DialogDescription>How Kontenin works, and which services are live right now.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <ol className="space-y-2 rounded-xl bg-muted/60 p-4">
            <li><b>1. Learn</b> a short lesson in Learn.</li>
            <li><b>2. Practice</b> it in a Mission and get AI feedback.</li>
            <li><b>3. Create</b> with the AI tools, then plan it in Planner.</li>
            <li><b>4. Improve</b> with AI Studio and Analytics.</li>
          </ol>
          <div>
            <div className="mb-2 font-medium">Service status</div>
            <ul className="divide-y rounded-xl border">
              {rows.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="flex items-center gap-1.5 text-right font-medium">
                    <span aria-hidden className={r.live ? "size-2 rounded-full bg-success" : "size-2 rounded-full bg-warning"} />
                    {r.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 font-medium">Keyboard shortcuts</div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2.5">
              <span className="text-muted-foreground">Search everything</span>
              <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl / ⌘ K</kbd>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Need to reset demo data? Go to <Link className="font-medium text-primary underline-offset-2 hover:underline" href="/settings">Settings → Privacy</Link>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
