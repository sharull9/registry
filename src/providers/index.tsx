import { Toaster } from "@/components/ui/sonner"
import { NuqsProvider } from "@/providers/nuqs.provider"
import { QueryProvider } from "@/providers/query.provider"
import { ThemeProvider } from "@/providers/theme.provider"
import { UIProvider } from "@/providers/ui.provider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsProvider>
        <QueryProvider>
          <UIProvider>{children}</UIProvider>
          <ReactQueryDevtools />
          <Toaster richColors closeButton />
        </QueryProvider>
      </NuqsProvider>
    </ThemeProvider>
  )
}
