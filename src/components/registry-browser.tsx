"use client"

import CopyButton from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { RegistryItem } from "@/lib/registry"
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"

const ITEMS_PER_PAGE = 9

const CATEGORIES = ["all", "agent", "config", "provider", "misc", "component"] as const

type Category = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  agent: "Agents",
  config: "Configs",
  provider: "Providers",
  misc: "Misc",
  component: "Components",
}

export function RegistryBrowser({ items }: { items: RegistryItem[] }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState<Category>("all")

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length }
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1
    }
    return counts
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === "all" || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, activeCategory])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <main className="relative min-h-screen">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 size-150 -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 size-100 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <BoxIcon className="size-3" />
            {items.length} items across {CATEGORIES.length - 1} categories
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Sharull Registry</h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            Browse and install production-ready components, providers, configs, and agents.
          </p>
        </div>

        {/* Search */}
        <InputGroup className="mb-6 backdrop-blur-sm">
          <InputGroupAddon>
            <SearchIcon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            className="h-11"
            placeholder="Search registry..."
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm hover:border-border hover:text-foreground",
              ].join(" ")}
            >
              {CATEGORY_LABELS[cat]}
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                  activeCategory === cat
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Result count */}
        {(search || activeCategory !== "all") && (
          <p className="mb-4 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && (
              <>
                {" "}
                in{" "}
                <span className="font-medium text-foreground">
                  {CATEGORY_LABELS[activeCategory]}
                </span>
              </>
            )}
            {search && (
              <>
                {" "}
                for <span className="font-medium text-foreground">&quot;{search}&quot;</span>
              </>
            )}
          </p>
        )}

        {/* Flat grid */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-24 text-center">
            <SearchIcon className="size-8 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No items found</p>
            <p className="text-sm text-muted-foreground/60">
              Try a different search term or category
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((item) => (
              <RegistryCard key={item.name} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="gap-1"
            >
              <ChevronLeftIcon className="size-3.5" />
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={page === n ? "default" : "ghost"}
                size="sm"
                onClick={() => setPage(n)}
                className="size-8 p-0"
              >
                {n}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRightIcon className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export function RegistryCard({ item }: { item: RegistryItem }) {
  const command = `pnpm dlx shadcn@latest add ${item.addCommandArgument}`
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_24px_oklch(from_var(--primary)_l_c_h/0.08)]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm leading-tight font-semibold break-all">{item.name}</h3>
        <Badge variant="secondary" className="shrink-0 text-xs capitalize">
          {item.category}
        </Badge>
      </div>

      <div className="flex-1">
        <InputGroup className="has-[>button]:mr-[-0.7rem]">
          <InputGroupInput value={command} readOnly />
          <InputGroupAddon align="inline-end">
            <CopyButton variant="outline" size="icon-sm" showLabel={false} value={command} />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
