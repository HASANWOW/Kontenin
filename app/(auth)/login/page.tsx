import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/auth-forms"

export const metadata: Metadata = { title: "Log in" }

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginWithParams searchParams={searchParams} />
    </Suspense>
  )
}

async function LoginWithParams({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const params = await searchParams
  const next = typeof params.next === "string" ? params.next : undefined
  const notice = params.error === "demo" ? "The demo account isn't set up in this Supabase project yet." : undefined
  return <LoginForm next={next} notice={notice} />
}
