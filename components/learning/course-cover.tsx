import {
  BarChart3,
  BookOpen,
  Camera,
  Coins,
  Compass,
  Film,
  Lightbulb,
  type LucideIcon,
  MessagesSquare,
  PenLine,
  Scissors,
  UserRound,
  Users,
  Zap,
} from "lucide-react"
import { createElement } from "react"
import { cn } from "@/lib/utils"

const CATEGORY_ICON: Record<string, LucideIcon> = {
  "Content Fundamentals": BookOpen,
  "Finding Your Niche": Compass,
  "Understanding Audience": Users,
  "Content Ideas": Lightbulb,
  Storytelling: Film,
  "Hook Writing": Zap,
  "Script Writing": PenLine,
  "Camera Basics": Camera,
  "Editing Basics": Scissors,
  "Personal Branding": UserRound,
  Analytics: BarChart3,
  Monetization: Coins,
}

/** Renders the icon for a course category (looked up from a static map). */
export function CategoryIcon({ category, className, strokeWidth }: { category: string; className?: string; strokeWidth?: number }) {
  return createElement(CATEGORY_ICON[category] ?? MessagesSquare, { className, strokeWidth, "aria-hidden": true })
}

/** Generated cover art — no image assets needed, tinted per course. */
export function CourseCover({ hue, category, className, size = "md" }: { hue: number; category: string; className?: string; size?: "md" | "lg" }) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 85% 62%) 0%, hsl(${(hue + 40) % 360} 80% 55%) 100%)`,
      }}
    >
      <div className="grid-pattern absolute inset-0 opacity-25" />
      <div className="absolute -right-6 -bottom-8 size-32 rounded-full bg-white/20 blur-xl" />
      <CategoryIcon category={category} className={cn("absolute text-white/90", size === "lg" ? "bottom-6 left-6 size-14" : "bottom-4 left-4 size-9")} strokeWidth={1.75} />
    </div>
  )
}
