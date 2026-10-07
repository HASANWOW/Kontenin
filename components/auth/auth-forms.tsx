"use client"

import { Eye, EyeOff, Loader2, MailCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { useActionState, useState, useTransition } from "react"
import { demoLoginAction, forgotPasswordAction, loginAction, registerAction, type AuthFormState } from "@/app/actions/auth"
import { InputField } from "@/components/shared/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
      {message}
    </div>
  )
}

function PasswordField({ label, error, autoComplete, name = "password" }: { label: string; error?: string; autoComplete: string; name?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="h-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={pending} className="h-11 w-full bg-brand-gradient text-[15px] shadow-glow hover:opacity-95">
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}

function DemoLoginButton() {
  const [pending, start] = useTransition()
  return (
    <Button type="button" variant="outline" size="lg" className="h-11 w-full text-[15px]" disabled={pending} onClick={() => start(() => demoLoginAction())}>
      {pending ? <Loader2 className="animate-spin" /> : <Sparkles className="text-primary" />}
      Continue with demo account
    </Button>
  )
}

const initial: AuthFormState = {}

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial)
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-muted-foreground">Log in to continue your creator journey.</p>

      <div className="mt-6 rounded-xl border border-primary/20 bg-secondary/60 p-3.5 text-sm">
        <div className="font-medium text-secondary-foreground">Demo account</div>
        <div className="mt-0.5 text-muted-foreground">
          <span className="font-mono text-foreground">demo@kontenin.id</span> · <span className="font-mono text-foreground">demo123</span>
        </div>
      </div>

      <form action={action} className="mt-6 space-y-4" noValidate>
        <FormError message={state.error ?? notice} />
        {next && <input type="hidden" name="next" value={next} />}
        <InputField label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} error={state.fieldErrors?.email} placeholder="kamu@email.com" />
        <PasswordField label="Password" autoComplete="current-password" error={state.fieldErrors?.password} />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>
        <SubmitButton pending={pending}>Log in</SubmitButton>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <DemoLoginButton />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Kontenin?{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export function RegisterForm({ local }: { local: boolean }) {
  const [state, action, pending] = useActionState(registerAction, initial)
  if (state.message) return <SentNotice title="Confirm your email" message={state.message} />
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Start creating for free</h1>
      <p className="mt-1.5 text-muted-foreground">Takes 30 seconds. Your creator diagnosis comes next.</p>
      <form action={action} className="mt-6 space-y-4" noValidate>
        <FormError message={state.error} />
        <InputField label="Full name" name="name" autoComplete="name" required placeholder="Nama kamu" error={state.fieldErrors?.name} />
        <InputField label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} placeholder="kamu@email.com" error={state.fieldErrors?.email} />
        <PasswordField label="Password" autoComplete="new-password" error={state.fieldErrors?.password} />
        <p className="text-xs text-muted-foreground">At least 6 characters.</p>
        <SubmitButton pending={pending}>Create account</SubmitButton>
      </form>
      {local && (
        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          Development mode: Supabase isn&apos;t configured, so this account is stored only in this browser.
        </p>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial)
  if (state.message) return <SentNotice title="Check your inbox" message={state.message} />
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
      <form action={action} className="mt-6 space-y-4" noValidate>
        <FormError message={state.error} />
        <InputField label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} error={state.fieldErrors?.email} placeholder="kamu@email.com" />
        <SubmitButton pending={pending}>Send reset link</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}

function SentNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="text-center" role="status">
      <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
        <MailCheck className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <Link href="/login" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to login
      </Link>
    </div>
  )
}
