import { clamp, hashString, pick, seededRandom, shuffle } from "@/lib/seed"
import { analyzeHookText, countWords, CTA_PATTERN, estimateSeconds, scoreHook } from "./heuristics"
import { BROLL_BY_TYPE, ctaForGoal, HOOK_TEMPLATES, topicsFor } from "./mock-data"
import type {
  CaptionResult,
  ContentAnalysis,
  ContentBrief,
  ContentIdea,
  GeneratedScript,
  HookAnalysis,
  HookResult,
  MissionFeedback,
  PerformanceInsight,
  RepurposeResult,
} from "./schemas"
import type {
  AIService,
  BriefInput,
  CaptionInput,
  ContentInput,
  HookInput,
  IdeaInput,
  MissionInput,
  PerformanceInput,
  RepurposeInput,
  ScriptInput,
} from "./types"

/**
 * Demo-mode AI. Deterministic, rule-based, and honest about it: results are
 * always returned with `source: "demo"` by the AI facade.
 */

type IdeaTemplate = (t: string, a: string) => Omit<ContentIdea, "id" | "cta">

const IDEA_TEMPLATES: IdeaTemplate[] = [
  (t, a) => ({
    title: `3 kesalahan ${t} yang sering dilakukan ${a}`,
    hook: `Kalau kamu ${a}, kemungkinan besar kamu melakukan kesalahan nomor 2.`,
    angle: "Listicle berbasis kesalahan — penonton bertahan untuk mengecek dirinya sendiri.",
    format: "Talking head + teks angka besar",
    duration: "30–45 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Aku coba ${t} selama 7 hari`,
    hook: `7 hari lalu aku mulai ${t}. Hari ketiga hampir nyerah.`,
    angle: "Eksperimen pribadi dengan progres harian yang jelas.",
    format: "Vlog montage harian",
    duration: "45–60 detik",
    difficulty: "intermediate",
  }),
  (t) => ({
    title: `Cara ${t} dalam 60 detik`,
    hook: `Simpan video ini sebelum kamu mulai ${t} lagi.`,
    angle: "Tutorial super ringkas yang langsung bisa dipraktikkan.",
    format: "Tutorial step-by-step",
    duration: "45–60 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Mitos ${t} yang harus berhenti kamu percaya`,
    hook: `Semua orang bilang ini benar soal ${t}. Ternyata salah.`,
    angle: "Myth-busting — melawan asumsi umum dengan bukti sederhana.",
    format: "Green screen + bukti di layar",
    duration: "30–40 detik",
    difficulty: "intermediate",
  }),
  (t, a) => ({
    title: `POV: ${a} baru mulai ${t}`,
    hook: `POV: kamu ${a} dan baru pertama kali ${t}.`,
    angle: "Konten relatable yang memancing komentar 'ini aku banget'.",
    format: "Skit POV / lip-sync",
    duration: "15–25 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Before–after ${t}`,
    hook: `Ini kondisi sebelum aku paham soal ${t}…`,
    angle: "Transformasi visual yang menunjukkan hasil nyata.",
    format: "Transisi before–after",
    duration: "15–30 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Jawab pertanyaan paling sering soal ${t}`,
    hook: `Pertanyaan ini masuk ke DM aku hampir setiap hari.`,
    angle: "Reply-to-comment — membangun kedekatan dengan audiens.",
    format: "Reply komentar + talking head",
    duration: "30–45 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Storytime: momen aku gagal di ${t}`,
    hook: `Ini kegagalan paling memalukan selama aku belajar ${t}.`,
    angle: "Storytelling rentan yang membangun kepercayaan dan personal brand.",
    format: "Storytime duduk santai",
    duration: "60–90 detik",
    difficulty: "intermediate",
  }),
  (t) => ({
    title: `Tools gratis untuk ${t}`,
    hook: `Kamu nggak perlu bayar apa-apa untuk mulai ${t}.`,
    angle: "Kurasi sumber daya — tinggi potensi di-save.",
    format: "Screen recording + voice over",
    duration: "30–45 detik",
    difficulty: "beginner",
  }),
  (t) => ({
    title: `Unpopular opinion soal ${t}`,
    hook: `Mungkin kamu nggak setuju, tapi menurutku ${t} terlalu dilebih-lebihkan.`,
    angle: "Hot take yang memancing diskusi di kolom komentar.",
    format: "Talking head ekspresif",
    duration: "20–35 detik",
    difficulty: "advanced",
  }),
]

const CAPTION_TEMPLATES: Record<CaptionInput["style"], ((topic: string) => string)[]> = {
  short: [(t) => `${capitalize(t)} versi simpel. Kamu tim yang mana?`, (t) => `Catatan kecil soal ${t} 📌`],
  storytelling: [
    (t) => `Dulu aku pikir ${t} itu soal bakat. Ternyata soal kebiasaan kecil yang diulang setiap hari.\n\nVideo ini rangkuman 3 bulan aku belajar — termasuk bagian yang hampir bikin berhenti.`,
    (t) => `Ini cerita yang belum pernah aku share soal ${t}. Pelan-pelan, tapi akhirnya jalan juga.`,
  ],
  educational: [
    (t) => `${capitalize(t)} dalam 3 langkah:\n1) Mulai dari masalah paling dekat\n2) Praktik 10 menit setiap hari\n3) Evaluasi tiap minggu\n\nSave biar nggak lupa!`,
    (t) => `Hal yang perlu kamu tahu sebelum mulai ${t} 👇`,
  ],
  funny: [(t) => `Aku dan ${t}: hubungan yang rumit 😭`, (t) => `Plot twist-nya di detik terakhir. ${capitalize(t)} memang nggak pernah gampang.`],
  sales: [
    (t) => `Capek trial-error soal ${t}? Aku rangkum semuanya jadi satu panduan praktis. Link di bio — slot terbatas minggu ini.`,
    (t) => `Ini yang aku pakai untuk ${t}. Kalau mau versi lengkapnya, komen "MAU".`,
  ],
  personal_brand: [
    (t) => `Aku bukan ahli, tapi aku konsisten belajar ${t} di depan kalian. Ini progres minggu ini.`,
    (t) => `Satu prinsip yang aku pegang soal ${t}: lebih baik jadi dan diperbaiki daripada sempurna tapi nggak pernah upload.`,
  ],
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export class MockAIService implements AIService {
  readonly provider = "demo" as const

  async generateContentIdeas(input: IdeaInput): Promise<ContentIdea[]> {
    await delay(900)
    const rand = seededRandom(hashString(`${input.niche}|${input.audience}|${input.goal}|${input.variant ?? 0}`))
    const topics = shuffle(topicsFor(input.niche), rand)
    const audience = input.audience.trim() || "pemula"
    const cta = ctaForGoal(input.goal)
    return shuffle(IDEA_TEMPLATES, rand).map((tpl, i) => ({
      id: `idea-${hashString(`${input.variant ?? 0}-${i}-${input.niche}`).toString(36)}`,
      ...tpl(topics[i % topics.length], audience.toLowerCase()),
      cta,
    }))
  }

  async generateHooks(input: HookInput): Promise<HookResult[]> {
    await delay(700)
    const rand = seededRandom(hashString(`${input.topic}|${input.tone}|${input.variant ?? 0}`))
    const topic = input.topic.trim().toLowerCase()
    const audience = input.audience.trim().toLowerCase() || "pemula"
    const own = HOOK_TEMPLATES[input.tone] ?? HOOK_TEMPLATES.curiosity
    const others = Object.entries(HOOK_TEMPLATES)
      .filter(([tone]) => tone !== input.tone)
      .map(([, list]) => pick(list, rand))
    const templates = [...shuffle(own, rand), ...shuffle(others, rand).slice(0, 2)]

    return templates
      .map((tpl, i) => {
        const text = tpl(topic, audience)
        const analysis = scoreHook(text)
        return {
          id: `hook-${i}-${hashString(text).toString(36)}`,
          text,
          score: analysis.score,
          reason: analysis.strengths[0] ?? "Clear and short enough for the first 3 seconds.",
          improvement:
            analysis.problems[0] ??
            (analysis.score < 85
              ? "Add a concrete number or result to make it more specific."
              : "Test it with a strong visual in the first frame."),
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  async generateScript(input: ScriptInput): Promise<GeneratedScript> {
    await delay(1100)
    const rand = seededRandom(hashString(`${input.topic}|${input.videoType}|${input.variant ?? 0}`))
    const topic = input.topic.trim().toLowerCase()
    const tone = (HOOK_TEMPLATES[input.tone] ? input.tone : "curiosity") as keyof typeof HOOK_TEMPLATES
    const hook = pick(HOOK_TEMPLATES[tone], rand)(topic, "pemula")
    const points = input.durationSeconds <= 30 ? 2 : input.durationSeconds <= 60 ? 3 : 4
    const bodyBank = [
      `Pertama, mulai dari masalah yang paling dekat. Soal ${topic}, kebanyakan orang langsung lompat ke teknik rumit padahal dasarnya belum kuat.`,
      `Kedua, kasih batas waktu. Coba ${topic} cukup 10 menit sehari selama seminggu — yang penting konsisten, bukan sempurna.`,
      `Ketiga, catat hasilnya. Foto, rekam, atau tulis apa yang berubah. Tanpa catatan, kamu nggak akan tahu apa yang berhasil.`,
      `Terakhir, minta feedback. Tunjukkan ke satu orang yang kamu percaya dan tanya satu hal yang bisa diperbaiki.`,
    ]
    const body = bodyBank.slice(0, points)
    const value = `Intinya: ${topic} itu bukan soal bakat, tapi soal sistem kecil yang kamu ulang setiap hari.`
    const cta = input.cta.trim() || "Follow untuk part 2."
    const wordCount = countWords([hook, ...body, value, cta].join(" "))
    const broll = BROLL_BY_TYPE[input.videoType.toLowerCase()] ?? BROLL_BY_TYPE.tips
    return {
      title: capitalize(topic),
      hook,
      body,
      value,
      cta,
      wordCount,
      estimatedSeconds: estimateSeconds(wordCount),
      broll,
      overlays: [
        capitalize(topic).slice(0, 40),
        ...body.map((_, i) => `Langkah ${i + 1}`),
        "Save biar nggak lupa",
      ],
    }
  }

  async generateCaption(input: CaptionInput): Promise<CaptionResult> {
    await delay(600)
    const topic = input.content.trim().toLowerCase().slice(0, 60) || "bikin konten"
    const templates = CAPTION_TEMPLATES[input.style]
    const words = topic.split(/\s+/).filter((w) => w.length > 3).slice(0, 3)
    const base = words.map((w) => `#${w.replace(/[^a-z0-9]/gi, "")}`)
    const platformTags =
      input.platform === "tiktok"
        ? ["#fyp", "#tiktokindonesia", "#belajarditiktok"]
        : input.platform === "youtube_shorts"
          ? ["#shorts", "#youtubeshortsindonesia"]
          : ["#reelsindonesia", "#kontenkreator"]
    return {
      captions: templates.map((tpl, i) => ({ id: `cap-${input.style}-${i}`, text: tpl(topic) })),
      hashtags: Array.from(new Set([...base, ...platformTags, "#kontenin", "#tipskonten"])),
    }
  }

  async analyzeHook(hook: string): Promise<HookAnalysis> {
    await delay(500)
    return analyzeHookText(hook)
  }

  async analyzeContent(input: ContentInput): Promise<ContentAnalysis> {
    await delay(1000)
    const text = `${input.title}. ${input.description}`.trim()
    const sentences = input.description.split(/[.!?\n]+/).map((s) => s.trim()).filter(Boolean)
    const firstLine = sentences[0] ?? input.title
    const hook = scoreHook(firstLine).score
    const avgSentence = sentences.length ? countWords(input.description) / sentences.length : 20
    const clarity = clamp(Math.round(100 - Math.max(0, avgSentence - 12) * 3), 40, 95)
    const words = countWords(input.description)
    const spokenSeconds = estimateSeconds(words)
    const pacingGap = input.durationSeconds ? Math.abs(spokenSeconds - input.durationSeconds) / input.durationSeconds : 0.3
    const pacing = clamp(Math.round(90 - pacingGap * 80), 45, 94)
    const value = clamp(55 + (/\b(cara|tips|langkah|kesalahan|\d+)\b/i.test(text) ? 22 : 0) + Math.min(words, 120) / 10, 40, 95)
    const cta = CTA_PATTERN.test(input.description) ? 82 : 52
    const scores = { hook, clarity, pacing, value: Math.round(value), cta }
    const overall = Math.round((hook * 1.3 + clarity + pacing + value + cta * 0.7) / 5)

    const recommendations: string[] = []
    if (hook < 70) recommendations.push("Open with the result or problem in the first sentence instead of an introduction.")
    if (clarity < 70) recommendations.push("Break long sentences into shorter ones — one idea per sentence.")
    if (pacing < 70) recommendations.push(`Your script reads in about ${spokenSeconds}s; adjust it to fit ${input.durationSeconds}s.`)
    if (cta < 70) recommendations.push("Add a clear CTA such as 'save this' or 'follow for part 2'.")
    if (recommendations.length < 3) recommendations.push("Add a visual change every 3–5 seconds to keep retention up.")

    const strengths: string[] = []
    if (hook >= 70) strengths.push("The opening line gives viewers a reason to stay.")
    if (value >= 70) strengths.push("The content promises a concrete, practical takeaway.")
    if (clarity >= 75) strengths.push("Sentences are short and easy to follow.")
    if (!strengths.length) strengths.push("The topic is relevant for your niche.")

    return {
      overall: clamp(overall, 0, 100),
      scores,
      summary:
        overall >= 75
          ? "Solid structure. A few small tweaks to the opening and CTA could push this further."
          : "The topic has potential, but the opening and structure need work before you record.",
      strengths,
      recommendations,
    }
  }

  async evaluateMission(input: MissionInput): Promise<MissionFeedback> {
    await delay(900)
    const answer = input.answer.trim()
    switch (input.evaluator) {
      case "hook":
      case "rewrite":
        return this.evaluateSingleHook(answer, input.original)
      case "hooks":
        return this.evaluateHookList(answer, input.minItems ?? 3)
      case "script":
        return this.evaluateScript(answer)
      case "niche":
        return this.evaluateNiche(answer)
      case "reflection":
        return this.evaluateReflection(answer)
    }
  }

  private evaluateSingleHook(answer: string, original?: string): MissionFeedback {
    const analysis = analyzeHookText(answer.split("\n")[0])
    const problems = [...analysis.problems]
    let score = analysis.score
    if (original) {
      const before = scoreHook(original).score
      if (answer.toLowerCase() === original.toLowerCase()) {
        score = before
        problems.unshift("This is the same as the original hook — try changing the opening entirely.")
      } else if (score <= before) {
        problems.unshift(`Your rewrite scores ${score}, not higher than the original (${before}).`)
      }
    }
    return {
      score,
      passed: score >= 60,
      headline: analysis.verdict,
      problems,
      strengths: analysis.strengths,
      suggestion: analysis.suggestion,
      improved: analysis.improved,
      improvedScore: analysis.improvedScore,
    }
  }

  private evaluateHookList(answer: string, minItems: number): MissionFeedback {
    const hooks = answer
      .split("\n")
      .map((l) => l.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim())
      .filter((l) => l.length > 0)
    const scored = hooks.map((h) => ({ h, ...scoreHook(h) }))
    const avg = scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : 0
    const best = [...scored].sort((a, b) => b.score - a.score)[0]
    const worst = [...scored].sort((a, b) => a.score - b.score)[0]
    const problems: string[] = []
    if (hooks.length < minItems) problems.push(`You wrote ${hooks.length} hook(s); this mission needs ${minItems}. Put each hook on its own line.`)
    if (worst && worst.score < 60) problems.push(`Weakest hook (${worst.score}): "${worst.h}" — ${worst.problems[0] ?? "too generic."}`)
    const strengths = best ? [`Best hook (${best.score}): "${best.h}"`, ...best.strengths.slice(0, 1)] : []
    const passed = hooks.length >= minItems && avg >= 55
    return {
      score: avg,
      passed,
      headline: passed ? `Nice set — average hook score ${avg}` : "Not quite there yet",
      problems,
      strengths,
      suggestion: "Vary your hook types: one question, one bold statement, one with a number, one story opener.",
      improved: worst ? analyzeHookText(worst.h).improved : undefined,
      improvedScore: worst ? analyzeHookText(worst.h).improvedScore : undefined,
    }
  }

  private evaluateScript(answer: string): MissionFeedback {
    const words = countWords(answer)
    const seconds = estimateSeconds(words)
    const lines = answer.split("\n").filter((l) => l.trim())
    const hook = scoreHook(lines[0] ?? answer).score
    const hasCta = CTA_PATTERN.test(answer)
    const fitsDuration = seconds >= 20 && seconds <= 40
    let score = Math.round(hook * 0.45 + (fitsDuration ? 30 : 12) + (hasCta ? 20 : 4) + Math.min(lines.length, 5) * 1.5)
    score = clamp(score, 10, 96)
    const problems: string[] = []
    const strengths: string[] = []
    if (!fitsDuration) problems.push(`Reads in about ${seconds}s. A 30-second script is roughly 60–90 words (you wrote ${words}).`)
    else strengths.push(`Good length: ~${seconds}s when spoken (${words} words).`)
    if (!hasCta) problems.push("No call-to-action. End with one clear action: follow, save, or comment.")
    else strengths.push("Ends with a clear call-to-action.")
    if (hook < 60) problems.push("The first line doesn't hook — lead with the problem or result.")
    else strengths.push("Strong opening line.")
    return {
      score,
      passed: score >= 60,
      headline: score >= 75 ? "Ready to record" : score >= 60 ? "Almost there" : "Needs another draft",
      problems,
      strengths,
      suggestion: "Structure it as Hook → 2–3 points → takeaway → CTA, with one idea per line.",
    }
  }

  private evaluateNiche(answer: string): MissionFeedback {
    const words = countWords(answer)
    const hasAudience = /\b(untuk|buat|bagi|mahasiswa|pemula|ibu|pekerja|anak|remaja|orang)\b/i.test(answer)
    const hasProblem = /\b(susah|bingung|masalah|kesulitan|belum|ingin|mau|butuh|takut|nggak tahu)\b/i.test(answer)
    const hasTopic = words >= 6
    const score = clamp(30 + (hasAudience ? 25 : 0) + (hasProblem ? 25 : 0) + (hasTopic ? 12 : 0) + Math.min(words, 40) / 5, 15, 95)
    const problems: string[] = []
    const strengths: string[] = []
    if (!hasAudience) problems.push("Name a specific audience — who exactly is this content for?")
    else strengths.push("You named a clear audience.")
    if (!hasProblem) problems.push("Describe the problem your audience has. A niche is a person + a problem.")
    else strengths.push("You described a real audience problem.")
    if (!hasTopic) problems.push("Add more detail: what topic and what format will you use?")
    return {
      score: Math.round(score),
      passed: score >= 60,
      headline: score >= 75 ? "Clear niche statement" : "Your niche needs sharpening",
      problems,
      strengths,
      suggestion: "Use the formula: 'Aku bikin konten [topik] untuk [audiens] yang [masalah], lewat [format].'",
      improved:
        "Aku bikin konten tips produktivitas untuk mahasiswa rantau yang susah atur waktu, lewat video 30 detik dan rutinitas harian.",
    }
  }

  private evaluateReflection(answer: string): MissionFeedback {
    const words = countWords(answer)
    const mentions = ["hook", "durasi", "audio", "suara", "cahaya", "lighting", "cta", "tempo", "kamera", "ekspresi", "teks", "editing"].filter((k) =>
      answer.toLowerCase().includes(k)
    )
    const score = clamp(35 + Math.min(words, 80) / 2 + mentions.length * 6, 15, 94)
    return {
      score: Math.round(score),
      passed: score >= 60,
      headline: score >= 70 ? "Honest, specific self-review" : "Go a little deeper",
      problems: words < 40 ? ["Write at least 40 words — specifics make the next video better."] : mentions.length < 2 ? ["Cover at least two areas: hook, audio, lighting, pacing, or CTA."] : [],
      strengths: mentions.length ? [`You evaluated: ${mentions.join(", ")}.`] : [],
      suggestion: "For each area, write one thing to keep and one thing to change in your next recording.",
    }
  }

  async analyzePerformance(input: PerformanceInput): Promise<PerformanceInsight> {
    await delay(800)
    return computePerformanceInsight(input)
  }

  async generateBrief(input: BriefInput): Promise<ContentBrief> {
    await delay(900)
    const topic = input.title.trim().toLowerCase()
    const audience = input.audience.trim() || "pemula"
    const hooks = (["curiosity", "bold", "storytelling"] as const).map((tone) => HOOK_TEMPLATES[tone][hashString(topic) % 4](topic, audience.toLowerCase()))
    return {
      title: capitalize(input.title.trim()),
      objective: `${input.goal} lewat satu video ${input.platform} yang fokus pada satu masalah ${audience.toLowerCase()}.`,
      audience: `${capitalize(audience)} yang tertarik dengan ${topic} tapi belum tahu harus mulai dari mana.`,
      keyMessage: input.keyMessage.trim() || `${capitalize(topic)} bisa dimulai dari langkah kecil yang konsisten.`,
      hooks: hooks.sort((a, b) => scoreHook(b).score - scoreHook(a).score),
      outline: [
        "Hook (0–3s): sebut masalah atau hasil yang spesifik",
        "Konteks (3–8s): kenapa ini penting untuk penonton",
        "Isi (8–25s): 2–3 poin, satu ide per kalimat",
        "Penutup (25–30s): rangkuman satu kalimat + CTA",
      ],
      shots: ["Talking head close-up untuk hook", "B-roll praktik / layar HP saat menjelaskan poin", "Teks overlay angka untuk setiap poin", "Shot hasil akhir untuk penutup"],
      cta: ctaForGoal(input.goal),
      successMetric: GOAL_METRIC[input.goal.toLowerCase()] ?? "Average watch time ≥ 50% and at least 10 meaningful comments.",
    }
  }

  async repurposeContent(input: RepurposeInput): Promise<RepurposeResult> {
    await delay(900)
    const sentences = input.source
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3)
    const hook = sentences[0] ?? input.source.slice(0, 80)
    const points = sentences.slice(1, 4)
    const bullet = points.map((p, i) => `${i + 1}. ${p}`).join("\n")
    const builders: Record<string, () => RepurposeResult["versions"][number]> = {
      tiktok: () => ({
        platform: "TikTok",
        format: "Vertical video · 15–45s",
        title: hook.slice(0, 80),
        content: `${hook}\n\n${bullet}\n\nFollow untuk part 2.`,
        tips: ["Put the hook as on-screen text in the first frame.", "Cut every pause longer than half a second.", "Reply to early comments with a video reply."],
      }),
      instagram: () => ({
        platform: "Instagram Reels",
        format: "Reel + caption",
        title: hook.slice(0, 80),
        content: `${hook}\n\n${bullet}\n\nSave biar nggak lupa — kamu tim yang mana? 👇`,
        tips: ["Design a cover with a readable title for your grid.", "Share the Reel to Stories with a poll sticker.", "Keep 3–6 specific hashtags."],
      }),
      youtube_shorts: () => ({
        platform: "YouTube Shorts",
        format: "Short · under 60s",
        title: capitalize(hook.replace(/[.!]+$/, "")).slice(0, 60),
        content: `${hook}\n\n${bullet}\n\nSubscribe untuk tips berikutnya.`,
        tips: ["Put the main keyword in the title.", "Loop the last line back into the first.", "Pin a comment asking a follow-up question."],
      }),
      carousel: () => ({
        platform: "Instagram",
        format: "Carousel · 5 slides",
        title: hook.slice(0, 60),
        content: [`Slide 1: ${hook}`, ...points.map((p, i) => `Slide ${i + 2}: ${p}`), `Slide ${points.length + 2}: Save & share ke teman yang butuh ini.`].join("\n"),
        tips: ["One idea per slide, large text.", "Make slide 1 work like a hook.", "End with a save/share prompt."],
      }),
      story: () => ({
        platform: "Instagram / TikTok",
        format: "Story · 3 frames",
        title: "Story teaser",
        content: `Frame 1: Poll — “${hook.slice(0, 60)}?” Ya / Belum\nFrame 2: Satu poin paling penting: ${points[0] ?? hook}\nFrame 3: Link ke video lengkap`,
        tips: ["Post the Story 1–2 hours after the main video.", "Use the poll result as your next video idea."],
      }),
    }
    const targets = input.targets.length ? input.targets : ["tiktok", "instagram", "youtube_shorts"]
    return { versions: targets.filter((t) => builders[t]).map((t) => builders[t]()) }
  }
}

const GOAL_METRIC: Record<string, string> = {
  "grow followers": "Follower gain of at least 1% of views.",
  "build personal brand": "20+ comments that respond to your point of view.",
  "make money": "Link clicks or DMs from the CTA.",
  "promote business": "Profile visits and product inquiries via DM.",
  "start creating": "Publish on schedule; average watch time ≥ 50%.",
}

/** Real arithmetic over the user's metrics — no randomness, no invented numbers. */
export function computePerformanceInsight(input: PerformanceInput): PerformanceInsight {
  const items = input.items
  if (!items.length) return { worked: [], didnt: [], next: ["Publish a few videos so there is data to analyze."] }
  const avgEr = mean(items.map((i) => i.engagementRate))

  const byHook = groupMean(items, (i) => i.hookType, (i) => i.engagementRate)
  const bestHook = byHook[0]
  const worstHook = byHook[byHook.length - 1]
  const short = items.filter((i) => i.durationSeconds <= 35)
  const long = items.filter((i) => i.durationSeconds > 35)
  const byFormat = groupMean(items, (i) => i.format, (i) => i.views)
  const top = [...items].sort((a, b) => b.views - a.views)[0]

  const worked: string[] = []
  const didnt: string[] = []
  if (bestHook && bestHook.value > avgEr) {
    worked.push(`Videos with a ${bestHook.key}-based hook receive ${pct(bestHook.value / avgEr - 1)} higher engagement than your average.`)
  }
  if (short.length && long.length) {
    const s = mean(short.map((i) => i.engagementRate))
    const l = mean(long.map((i) => i.engagementRate))
    if (s > l) worked.push(`Your videos under 35 seconds get ${pct(s / l - 1)} more engagement than longer ones.`)
    else worked.push(`Longer videos (over 35s) outperform short ones by ${pct(l / s - 1)} in engagement.`)
  }
  if (byFormat[0]) worked.push(`"${byFormat[0].key}" is your strongest format by average views.`)
  if (worstHook && worstHook.key !== bestHook?.key) {
    didnt.push(`${capitalize(worstHook.key)} hooks underperform — ${pct(1 - worstHook.value / avgEr)} below your average engagement.`)
  }
  const lastFormat = byFormat[byFormat.length - 1]
  if (lastFormat && lastFormat.key !== byFormat[0]?.key) didnt.push(`"${lastFormat.key}" content gets the fewest views on average.`)

  return {
    worked,
    didnt,
    next: [
      `Make 2 more videos in the style of "${top.title}" this week.`,
      bestHook ? `Open every video this week with a ${bestHook.key} hook.` : "Test two different hook types this week.",
      "Keep the first visual change within 2 seconds of the start.",
    ],
  }
}

function mean(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1)
}
function pct(x: number) {
  return `${Math.round(x * 100)}%`
}
function groupMean<T>(items: T[], key: (i: T) => string, val: (i: T) => number) {
  const groups = new Map<string, number[]>()
  for (const i of items) groups.set(key(i), [...(groups.get(key(i)) ?? []), val(i)])
  return [...groups.entries()].map(([k, v]) => ({ key: k, value: mean(v) })).sort((a, b) => b.value - a.value)
}
