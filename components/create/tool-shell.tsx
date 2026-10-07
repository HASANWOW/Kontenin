import { Sparkles, type LucideIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/states"

/** Two-column layout used by every generator: inputs on the left, results on the right. */
export function ToolShell({ title, description, form, children, back = { href: "/create", label: "Create" } }: { title: string; description: string; form: React.ReactNode; children: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div>
      <PageHeader back={back} title={title} description={description} />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">{form}</div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

export function ToolEmpty({ icon = Sparkles, title, description }: { icon?: LucideIcon; title: string; description: string }) {
  return <EmptyState icon={icon} title={title} description={description} className="min-h-80" />
}
