import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  Captions,
  Check,
  Clapperboard,
  Compass,
  Flame,
  Gauge,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
  PenLine,
  Repeat,
  Scissors,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { HeroPreview } from "@/components/landing/hero-preview"
import { HookDemo } from "@/components/landing/hook-demo"
import { Navbar } from "@/components/landing/navbar"
import { Logo } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import { COURSE_CATEGORIES } from "@/lib/data/courses"
import { cn } from "@/lib/utils"

const PROBLEMS = [
  { icon: Compass, title: "Nggak tahu mulai dari mana", body: "Mau ngonten, tapi bingung pilih niche, platform, dan langkah pertama." },
  { icon: Lightbulb, title: "Kehabisan ide", body: "Ide terasa habis setelah 3 video, lalu berhenti upload berminggu-minggu." },
  { icon: HelpCircle, title: "Nggak tahu salahnya di mana", body: "Video sepi, tapi tidak ada yang memberi tahu bagian mana yang perlu diperbaiki." },
  { icon: Repeat, title: "Sulit konsisten", body: "Belajar dari ratusan video tutorial, tapi tidak pernah benar-benar praktik." },
]

const LOOP = [
  { icon: Search, title: "Diagnosis", body: "Jawab 5 pertanyaan. Kontenin memetakan niche, level, dan tantanganmu." },
  { icon: BookOpen, title: "Learn", body: "Pelajaran 10 menit yang langsung ke inti — bukan teori panjang." },
  { icon: Target, title: "Practice", body: "Misi harian: tulis hook, susun script, rekam secara privat." },
  { icon: Sparkles, title: "AI Feedback", body: "Skor, masalah, dan versi yang lebih baik untuk konten milikmu sendiri." },
  { icon: TrendingUp, title: "Improve & Progress", body: "Naik level, jaga streak, dan misi berikutnya menyesuaikan." },
]

const AI_FEATURES = [
  { icon: Zap, title: "Hook Score", body: "Nilai 0–100 untuk 3 detik pertama, lengkap dengan alasan dan perbaikan." },
  { icon: PenLine, title: "Script Generator", body: "Struktur Hook → Isi → Nilai → CTA, estimasi durasi, dan saran B-roll." },
  { icon: Lightbulb, title: "Idea Generator", body: "10 ide sesuai niche, audiens, dan tujuanmu — siap dijadwalkan." },
  { icon: Gauge, title: "Content Score", body: "Analisis hook, kejelasan, tempo, nilai, dan CTA dari video kamu." },
  { icon: Brain, title: "Mission Evaluator", body: "Feedback personal untuk setiap jawaban latihanmu." },
  { icon: BarChart3, title: "Performance Insight", body: "Apa yang berhasil, apa yang tidak, dan apa yang harus dibuat berikutnya." },
]

const TOOLS = [
  { icon: Lightbulb, title: "Content Ideas" },
  { icon: Zap, title: "Hook Generator" },
  { icon: PenLine, title: "Script Generator" },
  { icon: MessageSquareText, title: "Caption Generator" },
  { icon: Clapperboard, title: "Video Analyzer" },
  { icon: Scissors, title: "Clip Finder" },
  { icon: Captions, title: "Caption Studio" },
  { icon: CalendarDays, title: "Content Planner" },
]

const TESTIMONIALS = [
  { quote: "Misi harian bikin aku akhirnya praktik, bukan cuma nonton tutorial. Hook score bikin aku sadar pembukaku selalu terlalu basa-basi.", name: "Alya R.", role: "Mahasiswi, food creator" },
  { quote: "Bagian paling berguna: feedback ke konten aku sendiri. Bukan teori umum, tapi langsung ‘ganti kalimat ini’.", name: "Dimas P.", role: "Tech creator pemula" },
  { quote: "Planner + script generator menghemat waktuku tiap minggu. Sekarang aku upload 3 kali seminggu, konsisten.", name: "Sekar W.", role: "Pemilik UMKM skincare" },
]

const PLANS = [
  {
    name: "Gratis",
    price: "Rp0",
    period: "selamanya",
    description: "Untuk mulai belajar dan membangun kebiasaan.",
    features: ["Creator diagnosis & learning path", "1 misi harian dengan AI feedback", "5 generasi AI per hari", "Content planner dasar"],
    cta: "Mulai Gratis",
    featured: false,
  },
  {
    name: "Premium",
    price: "Rp49.000",
    period: "/bulan",
    description: "Untuk kreator yang serius berkembang tiap minggu.",
    features: ["Semua kursus & misi tanpa batas", "AI generator tanpa batas", "AI Studio: analisis video & clip", "Performance insight mingguan", "Badge & sertifikat kursus"],
    cta: "Coba Premium",
    featured: true,
  },
  {
    name: "Komunitas",
    price: "Custom",
    period: "",
    description: "Untuk kampus, UKM, dan komunitas kreator.",
    features: ["Dashboard mentor", "Misi khusus komunitas", "Laporan progres anggota", "Workshop bersama tim Kontenin"],
    cta: "Hubungi kami",
    featured: false,
  },
]

const FAQ = [
  { q: "Apakah Kontenin menggantikan CapCut atau Canva?", a: "Tidak. Kontenin fokus pada belajar, latihan, dan feedback. Untuk editing, kamu tetap memakai aplikasi favoritmu — Kontenin memberi tahu apa yang perlu diperbaiki." },
  { q: "Apakah aku harus upload video ke publik?", a: "Tidak. Misi rekam bersifat opsional dan privat. Banyak misi cukup ditulis, seperti hook dan script." },
  { q: "Bagaimana AI menilai kontenku?", a: "AI menilai hook, kejelasan, tempo, nilai, dan CTA, lalu memberi saran konkret. Saat API AI belum dikonfigurasi, Kontenin memakai mesin demo berbasis aturan dan selalu memberi label “Demo data”." },
  { q: "Cocok untuk pemula total?", a: "Sangat cocok. Diagnosis awal menyesuaikan materi dan tingkat kesulitan misi dengan levelmu." },
  { q: "Bisa dipakai di HP?", a: "Bisa. Kontenin dirancang untuk desktop, tapi tetap nyaman dipakai di tablet dan HP." },
]

function SectionHeading({ eyebrow, title, description, center = true }: { eyebrow: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-[17px] text-muted-foreground text-pretty">{description}</p>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="bg-brand-soft absolute inset-0" />
          <div aria-hidden className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)] opacity-60" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium shadow-soft backdrop-blur">
                <span className="size-1.5 rounded-full bg-primary" /> Learn to create · Create to improve · Improve with AI
              </span>
              <h1 className="mt-6 text-5xl leading-[1.04] font-semibold tracking-tight text-balance sm:text-6xl">
                Stop Guessing. <span className="text-gradient">Start Creating.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
                Kontenin membantu kamu belajar membuat konten, menemukan ide, menulis script, berlatih, dan mendapatkan feedback AI — semuanya dalam satu tempat.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-12 bg-brand-gradient px-6 text-[15px] shadow-glow")}>
                  Mulai Gratis <ArrowRight />
                </Link>
                <a href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 bg-card px-6 text-[15px]")}>
                  Lihat Cara Kerja
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Gratis untuk mulai", "Tanpa kartu kredit", "Latihan privat"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="size-4 text-success" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <HeroPreview />
          </div>
        </section>

        {/* Problem */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Masalahnya" title="Belajar bikin konten itu membingungkan" description="Tutorial ada di mana-mana. Yang jarang: latihan terarah dan feedback untuk konten milikmu sendiri." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="grid size-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-y bg-card/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading
              eyebrow="Cara kerja Kontenin"
              title="Belajar → Praktik → Feedback → Berkembang"
              description="Kontenin bukan cuma tempat belajar bikin konten. Kamu langsung praktik, membuat konten, lalu mendapatkan feedback AI untuk tahu apa yang harus diperbaiki."
            />
            <ol className="mt-14 grid gap-4 md:grid-cols-5">
              {LOOP.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border bg-background p-5">
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">0{i + 1}</span>
                  <div className="mt-3 grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
                  {i < LOOP.length - 1 && <ArrowRight aria-hidden className="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-background text-primary md:block" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* AI features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="AI-powered" title="Feedback AI untuk setiap langkah" description="AI tidak menggantikan kreativitasmu — AI menunjukkan apa yang perlu diperbaiki, dengan contoh konkret." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AI_FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40">
                <div className="grid size-11 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning system */}
        <section className="border-y bg-card/60">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <SectionHeading center={false} eyebrow="Learning system" title="12 jalur belajar, dari niche sampai monetisasi" description="Setiap pelajaran berisi transkrip, contoh nyata kreator Indonesia, kuis singkat, dan tugas praktik." />
              <Link href="/register" className="mt-8 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                Lihat kurikulum lengkap <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {COURSE_CATEGORIES.map((c, i) => (
                <li key={c} className={cn("rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-soft", i % 4 === 0 && "border-primary/40 bg-secondary text-secondary-foreground")}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tools */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Content creation tools" title="Dari ide sampai siap upload" description="Semua alat yang kamu butuhkan dalam satu alur kerja — terhubung dengan pelajaran dan misi." />
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {TOOLS.map((t) => (
              <div key={t.title} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
                <t.icon className="size-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{t.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI feedback demo */}
        <section id="demo" className="scroll-mt-20 border-y bg-brand-soft">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="Coba sekarang" title="Seberapa kuat hook kamu?" description="Ketik kalimat pembuka videomu dan lihat skornya — langsung di halaman ini." />
            <div className="mt-12">
              <HookDemo />
            </div>
          </div>
        </section>

        {/* Gamification */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="order-2 grid grid-cols-3 gap-3 lg:order-1">
            {[
              { icon: BookOpen, t: "First Lesson" },
              { icon: Target, t: "First Mission" },
              { icon: Flame, t: "7 Day Streak" },
              { icon: Clapperboard, t: "First Video" },
              { icon: TrendingUp, t: "Rising Creator" },
              { icon: Trophy, t: "Consistent Creator" },
            ].map((b, i) => (
              <div key={b.t} className={cn("flex flex-col items-center rounded-2xl border bg-card p-4 text-center shadow-soft", i > 3 && "opacity-60")}>
                <div className={cn("grid size-12 place-items-center rounded-full", i > 3 ? "bg-muted text-muted-foreground" : "bg-brand-gradient text-white shadow-glow")}>
                  <b.icon className="size-5" />
                </div>
                <span className="mt-2.5 text-xs font-medium">{b.t}</span>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading center={false} eyebrow="Progress & gamification" title="Progres yang terasa nyata" description="XP untuk setiap pelajaran dan misi, level dari New Creator sampai Creator Mentor, streak harian, dan badge yang menandai pencapaianmu." />
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y bg-card/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="Testimoni" title="Untuk kreator yang baru mulai" />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="flex flex-col rounded-2xl border bg-background p-6 shadow-soft">
                  <blockquote className="flex-1 text-[15px] leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">{t.name[0]}</span>
                    <span className="text-sm">
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-muted-foreground">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">Testimoni ilustratif untuk prototipe — ganti dengan kutipan asli dari hasil uji pengguna.</p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Harga" title="Mulai gratis, upgrade saat siap" description="Model freemium: semua orang bisa belajar dan berlatih. Premium untuk yang ingin berkembang lebih cepat." />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={cn("relative flex flex-col rounded-3xl border bg-card p-7 shadow-soft", p.featured && "border-primary shadow-[0_0_0_1px_var(--primary),0_30px_60px_-30px_rgb(108_59_255/0.5)]")}
              >
                {p.featured && <span className="absolute -top-3 left-7 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">Paling populer</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-muted-foreground"> {p.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: p.featured ? "default" : "outline", size: "lg" }), "mt-8 h-11", p.featured && "bg-brand-gradient shadow-glow")}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t bg-card/60">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering ditanyakan" />
            <div className="mt-10 divide-y rounded-2xl border bg-background">
              {FAQ.map((f) => (
                <details key={f.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium outline-none focus-visible:text-primary">
                    {f.q}
                    <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-lg leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 sm:px-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-16 text-center text-white sm:px-12">
            <div aria-hidden className="grid-pattern absolute inset-0 opacity-15" />
            <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-5xl">Video pertamamu dimulai hari ini.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">Learn to create. Create to improve. Improve with AI.</p>
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "relative mt-8 h-12 bg-white px-7 text-[15px] text-primary hover:bg-white/90")}>
              Mulai Gratis <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">Belajar bikin konten. Praktik. Dapat feedback. Berkembang.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            {[
              { h: "Produk", l: [["Cara kerja", "#how-it-works"], ["Fitur", "#features"], ["Harga", "#pricing"]] },
              { h: "Akun", l: [["Masuk", "/login"], ["Daftar", "/register"], ["Lupa password", "/forgot-password"]] },
              { h: "Bantuan", l: [["FAQ", "#faq"], ["Coba AI", "#demo"]] },
            ].map((col) => (
              <div key={col.h}>
                <div className="font-semibold">{col.h}</div>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {col.l.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="hover:text-foreground">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">© 2026 Kontenin. Dibuat untuk kreator Indonesia.</div>
      </footer>
    </div>
  )
}
