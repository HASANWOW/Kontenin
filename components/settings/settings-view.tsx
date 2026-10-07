"use client"

import { Bell, Bot, CreditCard, Download, Lock, Monitor, Moon, Palette, RotateCcw, Shield, Sun, User, UserCog } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "@/components/providers/session-provider"
import { ChoiceGroup } from "@/components/shared/choice-group"
import { InputField, SelectField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CHALLENGE_CHOICES, GOAL_CHOICES, LEVEL_CHOICES } from "@/lib/data/onboarding"
import { useAppStore } from "@/lib/store/app-store"
import type { AppSettings } from "@/lib/store/types"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/types/domain"

const TABS = [
  { value: "account", label: "Account", icon: User },
  { value: "creator", label: "Creator Profile", icon: UserCog },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "ai", label: "AI Preferences", icon: Bot },
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "privacy", label: "Privacy", icon: Shield },
  { value: "billing", label: "Billing", icon: CreditCard },
] as const

export function SettingsView() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, creator profile, and preferences." />
      <Tabs defaultValue="account" orientation="vertical" className="flex-col gap-6 lg:flex-row">
        <TabsList variant="line" className="h-auto w-full flex-row flex-wrap items-stretch justify-start gap-1 lg:w-56 lg:flex-col">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="h-9 flex-none justify-start gap-2 px-3 lg:w-full">
              <t.icon /> {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="min-w-0 flex-1">
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
          <TabsContent value="creator">
            <CreatorTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="ai">
            <AITab />
          </TabsContent>
          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>
          <TabsContent value="privacy">
            <PrivacyTab />
          </TabsContent>
          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function Panel({ title, description, children, footer }: { title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card shadow-soft">
      <div className="border-b p-5">
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4 p-5">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t bg-muted/30 px-5 py-3">{footer}</div>}
    </section>
  )
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = label.toLowerCase().replace(/\W+/g, "-")
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function AccountTab() {
  const { services, user } = useSession()
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const [name, setName] = useState(profile.name)
  const dirty = name.trim() !== profile.name
  return (
    <div className="space-y-4">
      <Panel
        title="Account"
        description="Your basic account information."
        footer={
          <Button
            disabled={!dirty || name.trim().length < 2}
            onClick={() => {
              updateProfile({ name: name.trim() })
              toast.success("Account updated")
            }}
          >
            Save changes
          </Button>
        }
      >
        <InputField label="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        <InputField label="Email" value={user.email} disabled hint="Email changes are handled by your auth provider." />
      </Panel>
      <Panel title="Password" description="Change the password you use to log in.">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          {services.auth === "supabase"
            ? "Use “Forgot password” on the login page to receive a secure reset link."
            : "Local development accounts can't change passwords. Connect Supabase to enable password management."}
        </p>
      </Panel>
    </div>
  )
}

function CreatorTab() {
  const creator = useAppStore((s) => s.creatorProfile)
  const update = useAppStore((s) => s.updateCreatorProfile)
  const [niche, setNiche] = useState(creator?.niche ?? "")
  const [level, setLevel] = useState<Difficulty>(creator?.level ?? "beginner")
  const [challenge, setChallenge] = useState(creator?.challenge ?? "Finding ideas")
  const [goal, setGoal] = useState(creator?.goal ?? "Start creating")
  return (
    <Panel
      title="Creator profile"
      description="Used to personalize missions, ideas, and recommendations."
      footer={
        <Button
          disabled={!niche.trim()}
          onClick={() => {
            update({ niche: niche.trim(), level, challenge, goal })
            toast.success("Creator profile saved")
          }}
        >
          Save
        </Button>
      }
    >
      <InputField label="Niche" value={niche} onChange={(e) => setNiche(e.target.value)} maxLength={60} />
      <ChoiceGroup label="Level" choices={LEVEL_CHOICES.map(({ value, label }) => ({ value, label }))} value={level} onChange={setLevel} />
      <SelectField label="Biggest challenge" value={challenge} onChange={setChallenge} options={CHALLENGE_CHOICES} />
      <SelectField label="Goal" value={goal} onChange={setGoal} options={GOAL_CHOICES} />
    </Panel>
  )
}

function useSettingsSection<K extends keyof AppSettings>(key: K) {
  const value = useAppStore((s) => s.settings[key])
  const update = useAppStore((s) => s.updateSettings)
  return [value, (patch: Partial<AppSettings[K]>) => update(key, patch)] as const
}

function NotificationsTab() {
  const [n, set] = useSettingsSection("notifications")
  return (
    <Panel title="Notifications" description="Choose what Kontenin reminds you about. Changes save automatically.">
      <ToggleRow label="Daily mission" description="A reminder when today's mission is ready." checked={n.dailyMission} onChange={(v) => set({ dailyMission: v })} />
      <ToggleRow label="Streak reminder" description="An evening nudge if you haven't practiced yet." checked={n.streakReminder} onChange={(v) => set({ streakReminder: v })} />
      <ToggleRow label="Weekly insights" description="A summary of what worked in your content." checked={n.weeklyInsights} onChange={(v) => set({ weeklyInsights: v })} />
      <ToggleRow label="Product updates" description="New courses, tools, and features." checked={n.productUpdates} onChange={(v) => set({ productUpdates: v })} />
    </Panel>
  )
}

function AITab() {
  const { services } = useSession()
  const [ai, set] = useSettingsSection("ai")
  return (
    <div className="space-y-4">
      <Panel title="AI preferences" description="How AI feedback is written for you. Changes save automatically.">
        <ChoiceGroup
          label="Feedback language"
          choices={[
            { value: "mixed", label: "Mixed (EN feedback, ID examples)" },
            { value: "indonesian", label: "Bahasa Indonesia" },
            { value: "english", label: "English" },
          ]}
          value={ai.feedbackLanguage}
          onChange={(v) => set({ feedbackLanguage: v })}
        />
        <ChoiceGroup
          label="Feedback depth"
          choices={[
            { value: "detailed", label: "Detailed" },
            { value: "quick", label: "Quick" },
          ]}
          value={ai.feedbackDepth}
          onChange={(v) => set({ feedbackDepth: v })}
        />
        <ToggleRow label="Auto-save generations" description="Keep generated scripts in your library automatically." checked={ai.autoSave} onChange={(v) => set({ autoSave: v })} />
      </Panel>
      <Panel title="Connected AI services" description="Configured by the server administrator via environment variables.">
        {[
          { label: "Text AI", value: services.ai === "demo" ? "Demo engine (rule-based)" : services.ai === "openai" ? "OpenAI" : "Google Gemini", live: services.ai !== "demo" },
          { label: "Video AI", value: services.video === "demo" ? "Demo data" : "WayinVideo", live: services.video !== "demo" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className={cn("size-2 rounded-full", r.live ? "bg-success" : "bg-warning")} /> {r.value}
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">Language and depth are saved to your profile; applying them to generated feedback is on the roadmap. Auto-save is active now.</p>
      </Panel>
    </div>
  )
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme()
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]
  return (
    <Panel title="Appearance" description="Choose how Kontenin looks on this device.">
      <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const active = (theme ?? "light") === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(o.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active ? "border-primary bg-secondary text-secondary-foreground" : "hover:border-primary/40"
              )}
            >
              <o.icon className="size-5" />
              {o.label}
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

function PrivacyTab() {
  const [p, set] = useSettingsSection("privacy")
  const resetDemo = useAppStore((s) => s.resetDemo)
  const [confirm, setConfirm] = useState(false)

  function exportData() {
    const raw = localStorage.getItem("kontenin-app") ?? "{}"
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([raw], { type: "application/json" }))
    a.download = "kontenin-my-data.json"
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success("Your data was exported")
  }

  return (
    <div className="space-y-4">
      <Panel title="Privacy" description="Control how your practice data is used.">
        <ToggleRow label="Keep recordings private" description="Mission recordings never leave your device." checked={p.privateRecordings} onChange={(v) => set({ privateRecordings: v })} />
        <ToggleRow label="Share anonymous analytics" description="Help improve Kontenin with anonymous usage data." checked={p.shareAnalytics} onChange={(v) => set({ shareAnalytics: v })} />
      </Panel>
      <Panel title="Your data">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Download everything Kontenin stores about your progress in this browser.</p>
          <Button variant="outline" onClick={exportData}>
            <Download /> Export my data
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
          <div>
            <p className="text-sm font-medium">Reset progress</p>
            <p className="text-sm text-muted-foreground">Restore your account to its starting state. This can&apos;t be undone.</p>
          </div>
          {confirm ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  resetDemo()
                  setConfirm(false)
                  toast.success("Progress reset")
                }}
              >
                <RotateCcw /> Yes, reset
              </Button>
            </div>
          ) : (
            <Button variant="destructive" onClick={() => setConfirm(true)}>
              Reset progress
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

function BillingTab() {
  return (
    <Panel title="Billing" description="Your plan and payment details.">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Current plan</p>
          <p className="text-lg font-semibold">Gratis</p>
          <p className="text-sm text-muted-foreground">1 daily mission with feedback · 5 AI generations per day</p>
        </div>
        <Button className="bg-brand-gradient shadow-glow" onClick={() => toast("Payments aren't enabled in this MVP yet.", { description: "Premium (Rp49.000/bulan) is coming soon." })}>
          Upgrade to Premium
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">No payment method on file. Billing history will appear here once payments launch.</p>
    </Panel>
  )
}
