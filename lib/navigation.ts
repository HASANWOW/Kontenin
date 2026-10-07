import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Clapperboard,
  House,
  Settings,
  Target,
  Trophy,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  /** Shown in the mobile bottom bar. */
  mobile?: boolean
}

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House, mobile: true },
  { href: "/learn", label: "Learn", icon: BookOpen, mobile: true },
  { href: "/missions", label: "Missions", icon: Target, mobile: true },
  { href: "/create", label: "Create", icon: WandSparkles, mobile: true },
  { href: "/ai-studio", label: "AI Studio", icon: Clapperboard },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/progress", label: "Progress", icon: Trophy, mobile: true },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Extra destinations for the command palette. */
export const QUICK_LINKS: { href: string; label: string; group: string }[] = [
  { href: "/create/ideas", label: "Generate content ideas", group: "AI tools" },
  { href: "/create/hooks", label: "Generate hooks", group: "AI tools" },
  { href: "/create/script", label: "Generate a script", group: "AI tools" },
  { href: "/create/caption", label: "Generate captions", group: "AI tools" },
  { href: "/create/analyze", label: "Analyze my content", group: "AI tools" },
  { href: "/ai-studio/analyze", label: "Analyze my video", group: "AI Studio" },
  { href: "/ai-studio/moments", label: "Find best moments", group: "AI Studio" },
  { href: "/ai-studio/clips", label: "Generate clips", group: "AI Studio" },
  { href: "/ai-studio/transcript", label: "Transcript", group: "AI Studio" },
  { href: "/ai-studio/captions", label: "Caption studio", group: "AI Studio" },
  { href: "/ai-studio/reframe", label: "Auto reframe", group: "AI Studio" },
  { href: "/profile", label: "Profile", group: "Account" },
  { href: "/settings", label: "Settings", group: "Account" },
]
