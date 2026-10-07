import { clamp, hashString } from "@/lib/seed"
import type { HookAnalysis } from "./schemas"

/**
 * Transparent, rule-based hook scoring used by the demo AI service.
 * Every point added or removed maps to a rule the user can read in the feedback.
 */

const GREETING = /^(guys|gaes|halo|hallo|hai|hi|hello|hey|oke|ok|okay|jadi|nah|selamat (pagi|siang|sore|malam)|assalamualaikum)\b/i
const ANNOUNCING = /(hari ini (aku|saya|gue|gw) (mau|akan)|di video ini|video kali ini|aku mau (kasih|bahas|share|cerita)|kali ini (aku|saya|gue))/i
const DIRECT = /\b(kamu|lo|lu|kalian|anda)\b/i
const TENSION = /\b(salah|kesalahan|gagal|sepi|rugi|berhenti|jangan|rahasia|ternyata|kenapa|nyesel|bahaya|stop|masalah|bohong|mitos|nyerah|nggak ada yang)\b/i
// Needs an actual number or amount — "hari ini" alone isn't specific.
const SPECIFIC = /(\d|%|\b(rp|ribu|juta|persen|sehari|seminggu|sebulan|setahun)\b)/i

const FILLER = /\b(guys|gaes|halo|hai|semua|semuanya|teman-teman|hari ini|aku|saya|gue|gw|mau|akan|kasih|bahas|share|di video ini|kalian|yang|tentang|soal|tips|ya|nih|deh|sih|dong)\b/gi

export interface HookRuleResult {
  score: number
  problems: string[]
  strengths: string[]
}

export function scoreHook(raw: string): HookRuleResult {
  const text = raw.trim()
  const words = text.split(/\s+/).filter(Boolean)
  const problems: string[] = []
  const strengths: string[] = []
  let score = 60

  if (GREETING.test(text)) {
    score -= 8
    problems.push("Opens with a greeting — viewers decide to scroll before you reach the point.")
  }
  if (ANNOUNCING.test(text)) {
    score -= 10
    problems.push("Announces what the video is about instead of giving a reason to stay.")
  }
  if (words.length > 24) {
    score -= 12
    problems.push(`Too long (${words.length} words). Aim for under 20 words in the first 3 seconds.`)
  } else if (words.length < 4) {
    score -= 10
    problems.push("Too short to create any context or curiosity.")
  }
  if (DIRECT.test(text)) {
    score += 8
    strengths.push("Speaks directly to the viewer.")
  }
  if (TENSION.test(text)) {
    score += 10
    strengths.push("Creates tension with a problem, mistake, or surprise.")
  }
  if (SPECIFIC.test(text)) {
    score += 8
    strengths.push("Uses specific numbers or time frames, which feel credible.")
  }
  if (text.includes("?")) {
    score += 6
    strengths.push("Opens a question loop the viewer wants closed.")
  }
  if (!DIRECT.test(text) && !TENSION.test(text) && !SPECIFIC.test(text)) {
    problems.push("Too generic — nothing here is specific to a viewer's problem.")
  }

  return { score: clamp(score, 12, 96), problems, strengths }
}

export function extractTopic(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/\.{2,}|[!?.,"“”]/g, " ")
    .replace(FILLER, " ")
    .replace(/\s+/g, " ")
    .trim()
  return cleaned.split(" ").slice(0, 6).join(" ")
}

const REWRITES: ((topic: string) => string)[] = [
  (t) => `Kalau ${t} kamu belum ada hasil, kemungkinan masalahnya ada di satu hal kecil ini.`,
  (t) => `3 kesalahan soal ${t} yang bikin hasilnya nggak maksimal — nomor 2 paling sering.`,
  (t) => `Aku coba ${t} selama 7 hari, dan hari ketiga hampir bikin aku nyerah.`,
  (t) => `Berhenti lakukan ini kalau kamu serius soal ${t}.`,
]

/** The canonical example from Kontenin's product spec, used when no topic survives cleanup. */
const DEFAULT_REWRITE =
  "Kalau video kamu selalu sepi meskipun editing-nya bagus, kemungkinan masalahnya ada di 3 detik pertama."

export function rewriteHook(raw: string): string {
  const topic = extractTopic(raw)
  if (topic.split(" ").length < 2) return DEFAULT_REWRITE
  return REWRITES[hashString(raw) % REWRITES.length](topic)
}

export function analyzeHookText(raw: string): HookAnalysis {
  const { score, problems, strengths } = scoreHook(raw)
  // A hook that already scores well is kept as-is rather than rewritten into a template.
  const improved = score >= 80 ? raw.trim() : rewriteHook(raw)
  const improvedScore = score >= 80 ? score : Math.max(score + 8, Math.min(scoreHook(improved).score, 92))

  const verdict = score >= 80 ? "Strong hook" : score >= 60 ? "Decent, but it could hit harder" : "Too generic"
  const suggestion =
    score >= 80
      ? "Keep this structure. Test a version with an even more specific number or result."
      : "Start with a surprising statement or a specific problem your viewer already feels — then promise the fix."

  return { score, verdict, problems, strengths, suggestion, improved, improvedScore: clamp(improvedScore, 0, 96) }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Indonesian speech averages roughly 2.4 words per second in short-form video. */
export function estimateSeconds(words: number): number {
  return Math.round(words / 2.4)
}

export const CTA_PATTERN = /\b(follow|komen|comment|save|simpan|share|bagikan|klik|cek|link|dm|subscribe|like)\b/i
