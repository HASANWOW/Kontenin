"use client"

import { Bot, Pencil, RefreshCcw, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { StatCard } from "@/components/dashboard/dashboard-cards"
import { UserAvatar } from "@/components/layout/user-avatar"
import { AchievementBadge } from "@/components/progress/achievement-badge"
import { InputField, TextareaField } from "@/components/shared/form-field"
import { ProgressBar } from "@/components/shared/progress-bar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ACHIEVEMENTS, levelFor, levelProgress } from "@/lib/data/gamification"
import { capitalize, fullNumber } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

export function ProfileView() {
  const profile = useAppStore((s) => s.profile)
  const creator = useAppStore((s) => s.creatorProfile)
  const xp = useAppStore((s) => s.xp)
  const stats = useAppStore((s) => s.stats)
  const achievements = useAppStore((s) => s.achievements)
  const [editing, setEditing] = useState(false)
  const level = levelFor(xp)
  const unlocked = ACHIEVEMENTS.filter((a) => achievements[a.id])

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="relative h-28 bg-brand-gradient">
          <div aria-hidden className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-3">
            <UserAvatar name={profile.name} className="size-20 text-2xl ring-4 ring-card" />
            <Button variant="outline" size="lg" className="h-9" onClick={() => setEditing(true)}>
              <Pencil /> Edit profile
            </Button>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {profile.bio ? <p className="mt-3 max-w-2xl text-[15px]">{profile.bio}</p> : <p className="mt-3 text-sm text-muted-foreground italic">No bio yet — tell people what you create.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {creator?.niche && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{creator.niche}</span>}
            {creator?.platforms.map((p) => (
              <span key={p} className="rounded-full border px-3 py-1 text-xs font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="font-semibold">Level</h2>
          <p className="mt-3 text-3xl font-semibold">Level {level.level}</p>
          <p className="text-sm text-muted-foreground">{level.title}</p>
          <ProgressBar value={levelProgress(xp)} label="Level progress" className="mt-4" />
          <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
            {fullNumber(xp)} / {level.nextXp ? fullNumber(level.nextXp) : "∞"} XP
          </p>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Creator profile & goals</h2>
            <Link href="/onboarding" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <RefreshCcw /> Retake diagnosis
            </Link>
          </div>
          {creator ? (
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["Main goal", creator.goal],
                ["Current level", capitalize(creator.level)],
                ["Focus area", creator.challenge],
                ["Platforms", creator.platforms.join(", ")],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted/50 p-3">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Complete the creator diagnosis to personalize Kontenin.</p>
          )}
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Sparkles} label="Content created" value={stats.contentCreated} tone="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard icon={Target} label="Missions completed" value={stats.missionCompletions} tone="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
        <StatCard icon={Bot} label="AI feedback" value={stats.aiFeedback} tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Achievements</h2>
          <Link href="/progress" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {unlocked.length ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {unlocked.map((a) => (
              <AchievementBadge key={a.id} achievement={a} unlockedAt={achievements[a.id]} size="sm" />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">No badges yet — your first lesson unlocks one.</p>
        )}
      </section>

      <EditProfileDialog open={editing} onClose={() => setEditing(false)} />
    </div>
  )
}

function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">{open && <EditForm onClose={onClose} />}</DialogContent>
    </Dialog>
  )
}

function EditForm({ onClose }: { onClose: () => void }) {
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const [name, setName] = useState(profile.name)
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio)
  const usernameValid = /^[a-z0-9_.]{3,24}$/.test(username)
  const nameValid = name.trim().length >= 2

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!usernameValid || !nameValid) return
        updateProfile({ name: name.trim(), username, bio: bio.trim() })
        toast.success("Profile updated")
        onClose()
      }}
      noValidate
    >
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>This is how you appear across Kontenin.</DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-3">
        <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} error={nameValid ? undefined : "Name must be at least 2 characters."} />
        <InputField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          maxLength={24}
          hint="3–24 characters: letters, numbers, dots, underscores."
          error={usernameValid ? undefined : "Use 3–24 lowercase letters, numbers, dots, or underscores."}
        />
        <TextareaField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={160} hint={`${bio.length}/160`} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!usernameValid || !nameValid}>
          Save
        </Button>
      </DialogFooter>
    </form>
  )
}
