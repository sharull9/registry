"use client"

import { Button } from "@/components/ui/button"
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="font-semibold tracking-tight">sharull9</span>
            <span className="text-border">/</span>
            <span className="font-mono text-sm text-muted-foreground">registry</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/search"
              className={[
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === "/search"
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <SearchIcon className="size-3.5" />
              Browse
            </Link>
          </nav>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </header>
  )
}
