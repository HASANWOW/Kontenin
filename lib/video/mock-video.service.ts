import { clamp, hashString } from "@/lib/seed"
import type { ContentAnalysis, TranscriptSegment, VideoClip, VideoMoment, VideoSummary } from "@/lib/ai/schemas"
import { DEMO_DURATION, DEMO_TRANSCRIPT, type DemoSegment } from "./demo-transcript"
import type { UploadRequest, VideoRef, VideoService } from "./types"

const TAG_QUERIES: { tag: DemoSegment["tags"][number]; label: string; pattern: RegExp }[] = [
  { tag: "funny", label: "Funny Moment", pattern: /\b(funny|lucu|ketawa|kocak|humor|lawak)\b/i },
  { tag: "hook", label: "Strong Hook", pattern: /\b(hook|pembuka|opening|kuat|strongest|menarik)\b/i },
  { tag: "educational", label: "Educational Moment", pattern: /\b(educational|edukasi|belajar|tips|ilmu|penjelasan|teach)\b/i },
  { tag: "money", label: "Money Mention", pattern: /\b(money|uang|duit|cuan|rupiah|bayar|harga|juta|ribu|brand deal)\b/i },
  { tag: "story", label: "Story Moment", pattern: /\b(story|cerita|pengalaman|storytime)\b/i },
  { tag: "cta", label: "Call to Action", pattern: /\b(cta|ajak|follow|komen|comment|subscribe)\b/i },
  { tag: "emotional", label: "Emotional Moment", pattern: /\b(emotional|emosional|sedih|motivasi|inspirasi|inspiring|touching)\b/i },
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Scale the sample transcript to the real length of the uploaded file. */
function scaledTranscript(ref: VideoRef): DemoSegment[] {
  const ratio = ref.durationSeconds > 0 ? ref.durationSeconds / DEMO_DURATION : 1
  return DEMO_TRANSCRIPT.map((s) => ({ ...s, start: round1(s.start * ratio), end: round1(s.end * ratio) }))
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

export class MockVideoService implements VideoService {
  readonly provider = "demo" as const

  async upload(req: UploadRequest): Promise<VideoRef> {
    await delay(400)
    return {
      videoId: `demo-${hashString(`${req.fileName}|${req.sizeBytes}|${req.sourceUrl ?? ""}`).toString(36)}`,
      fileName: req.fileName,
      durationSeconds: req.durationSeconds || DEMO_DURATION,
    }
  }

  async transcribe(ref: VideoRef): Promise<TranscriptSegment[]> {
    await delay(500)
    return scaledTranscript(ref).map(({ start, end, text }) => ({ start, end, text }))
  }

  async analyzeVideo(ref: VideoRef): Promise<ContentAnalysis> {
    await delay(600)
    // Small, stable variation per file so two demo uploads don't look identical.
    const j = (hashString(ref.videoId) % 7) - 3
    const scores = { hook: 82 + j, clarity: 75 - j, pacing: 71 + j, value: 86, cta: 68 - j }
    const overall = Math.round((scores.hook + scores.clarity + scores.pacing + scores.value + scores.cta) / 5)
    return {
      overall,
      scores,
      summary: "Your content has a strong topic but the opening takes too long to establish the main point.",
      strengths: [
        "Personal story (spending money on gear with zero followers) is relatable and memorable.",
        "Clear three-part structure makes the video easy to follow.",
        "The hook comparison example teaches by showing, not telling.",
      ],
      recommendations: [
        "Shorten the intro by 3 seconds.",
        "Start with the main result.",
        "Add a stronger CTA.",
        "Increase visual changes during explanation.",
      ],
    }
  }

  async summarizeVideo(ref: VideoRef): Promise<VideoSummary> {
    await delay(400)
    const t = scaledTranscript(ref)
    return {
      summary:
        "A creator shares three lessons they wish they had known before starting: gear matters less than starting, the first three seconds decide whether people stay, and a simple weekly system beats waiting for inspiration.",
      chapters: [
        { start: t[0].start, title: "Intro & the cost of waiting for perfect" },
        { start: t[4].start, title: "Lesson 1 — Use the gear you already have" },
        { start: t[6].start, title: "Lesson 2 — The first 3 seconds" },
        { start: t[14].start, title: "Lesson 3 — A weekly consistency system" },
        { start: t[22].start, title: "Recap & CTA" },
      ],
      keyPoints: [
        "Your phone and window light are enough to start.",
        "Open with a specific result, not a greeting.",
        "Editing is seasoning — the hook and value are the meal.",
        "Plan a Monday-to-Saturday routine and review analytics weekly.",
      ],
    }
  }

  async findMoments(ref: VideoRef, query: string): Promise<VideoMoment[]> {
    await delay(700)
    const t = scaledTranscript(ref)
    const matchedTags = TAG_QUERIES.filter((q) => q.pattern.test(query))
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["find", "the", "moment", "moments", "where", "cari", "momen", "yang", "with", "most"].includes(w))

    const results: VideoMoment[] = []
    t.forEach((seg, i) => {
      const tag = matchedTags.find((q) => seg.tags.includes(q.tag))
      const keywordHit = keywords.some((k) => seg.text.toLowerCase().includes(k))
      if (!tag && !keywordHit) return
      // Segments that literally say what was asked for rank above ones only tagged as related.
      const literal = (tag && tag.pattern.test(seg.text)) || keywordHit
      const base = (tag ? 74 : 66) + (literal ? 12 : 0)
      results.push({
        id: `m-${i}`,
        start: seg.start,
        end: seg.end,
        label: tag?.label ?? "Keyword Match",
        description: seg.text,
        score: clamp(base + (hashString(`${query}|${i}`) % 10), 0, 97),
      })
    })
    return results.sort((a, b) => b.score - a.score).slice(0, 6)
  }

  async generateClips(ref: VideoRef): Promise<VideoClip[]> {
    await delay(800)
    const t = scaledTranscript(ref)
    const span = (a: number, b: number) => ({ start: t[a].start, end: t[b].end })
    return [
      { id: "c-1", title: "3 Things I Wish I Knew Before Becoming a Creator", ...span(0, 4), viralScore: 91, platforms: ["TikTok", "Reels"], reason: "Strong curiosity hook plus a relatable money story." },
      { id: "c-2", title: "Hook A vs Hook B — which would you watch?", ...span(7, 10), viralScore: 88, platforms: ["TikTok", "Shorts"], reason: "Interactive comparison invites comments." },
      { id: "c-3", title: "3 days of editing, 47 views", ...span(11, 13), viralScore: 85, platforms: ["Reels", "Shorts"], reason: "Funny contrast with a clear lesson." },
      { id: "c-4", title: "My weekly content system", ...span(14, 16), viralScore: 79, platforms: ["TikTok", "Reels", "Shorts"], reason: "Highly saveable, practical routine." },
      { id: "c-5", title: "My first brand deal was Rp300 ribu", ...span(17, 18), viralScore: 76, platforms: ["TikTok"], reason: "Money story with an emotional payoff." },
    ]
  }
}
