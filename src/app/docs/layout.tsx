"use client"

import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string }[] }

const nav: NavItem[] = [
  { label: "Copy Button", href: "/docs/copy-button" },
  { label: "Password Input", href: "/docs/password-input" },
  { label: "Combobox", href: "/docs/combobox" },
  { label: "Search Bar", href: "/docs/search-bar" },
  { label: "Form", href: "/docs/form" },
  { label: "Data Table", href: "/docs/data-table" },
  {
    label: "Auth",
    children: [
      { label: "Magic Link Form", href: "/docs/auth/magic-link-form" },
      { label: "Org Switcher", href: "/docs/auth/organization-switcher" },
      { label: "Org Selection", href: "/docs/auth/organization-selection" },
      { label: "Create Org Form", href: "/docs/auth/create-org-form" },
      { label: "Multi Session", href: "/docs/auth/multi-session-switcher" },
    ],
  },
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
            {nav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="mt-3 mb-1 px-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={[
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
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
              )
            )}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}
