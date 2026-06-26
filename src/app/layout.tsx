import "@/app/globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/providers"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "sharull9/registry",
  description: "Browse and install production-ready components, providers, configs, and agents.",
}

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "h-full antialiased")}
      suppressContentEditableWarning
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
