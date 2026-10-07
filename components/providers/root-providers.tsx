"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider delay={300}>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  )
}
