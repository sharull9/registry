"use client"

import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { label: "Copy Button", href: "/docs/copy-button" },
  { label: "Password Input", href: "/docs/password-input" },
  { label: "Combobox", href: "/docs/combobox" },
  { label: "Search Bar", href: "/docs/search-bar" },
  { label: "Form", href: "/docs/form" },
  { label: "Data Table", href: "/docs/data-table" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container mx-auto flex max-w-6xl flex-1 px-4">
        <aside className="w-52 shrink-0 py-8 pr-8">
          <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Components
          </p>
          <nav className="flex flex-col gap-0.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}
