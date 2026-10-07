import { CheckCircle2, Sparkles } from "lucide-react"
import { Logo } from "@/components/shared/logo"

const POINTS = [
  "Personalized learning path based on your niche",
  "Daily practice missions with instant AI feedback",
  "Idea, hook, script, and caption generators",
  "Track XP, streaks, and real progress",
]

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <p className="text-center text-xs text-muted-foreground">© 2026 Kontenin · Belajar bikin konten. Praktik. Dapat feedback. Berkembang.</p>
      </div>
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="grid-pattern absolute inset-0 opacity-20" />
        <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-white/15 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Learn · Practice · Get feedback
          </span>
          <h2 className="mt-6 max-w-md text-4xl leading-tight font-semibold tracking-tight">Stop guessing. Start creating.</h2>
          <ul className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[15px] text-white/90">
                <CheckCircle2 className="size-5 shrink-0 text-white" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative max-w-md rounded-2xl bg-white/12 p-5 backdrop-blur-md">
          <p className="text-xs font-semibold tracking-wider text-white/70">AI FEEDBACK EXAMPLE</p>
          <p className="mt-3 text-[15px] text-white/70 line-through decoration-white/40">“Guys hari ini aku mau kasih tips…” · 42/100</p>
          <p className="mt-2 text-[15px] leading-relaxed">“Kalau video kamu selalu sepi meskipun editing-nya bagus, kemungkinan masalahnya ada di 3 detik pertama.”</p>
          <p className="mt-3 inline-flex rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">Hook score 86/100</p>
        </div>
      </aside>
    </div>
  )
}
