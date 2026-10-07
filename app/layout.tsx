import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { RootProviders } from "@/components/providers/root-providers"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Kontenin — Belajar bikin konten. Praktik. Dapat feedback. Berkembang.",
    template: "%s · Kontenin",
  },
  description:
    "Kontenin membantu kamu belajar membuat konten, menemukan ide, menulis script, berlatih, dan mendapatkan feedback AI — semuanya dalam satu tempat.",
  applicationName: "Kontenin",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0d16" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
