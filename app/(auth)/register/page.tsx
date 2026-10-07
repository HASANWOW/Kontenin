import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/auth-forms"
import { getAuthMode } from "@/lib/auth/session"

export const metadata: Metadata = { title: "Create account" }

export default function RegisterPage() {
  return <RegisterForm local={getAuthMode() === "local"} />
}
