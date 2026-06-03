"use client"

import { RegistryCard } from "@/components/registry-browser"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { RegistryItem } from "@/lib/registry"
import { SearchIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { useMemo } from "react"

const CATEGORIES = ["all", "agent", "config", "provider", "misc"] as const
type Category = (typeof CATEGORIES)[number]

const SIDEBAR_ITEMS: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "agent", label: "Agents" },
  { key: "config", label: "Configs" },
  { key: "provider", label: "Providers" },
  { key: "misc", label: "Misc" },
]

export function SearchBrowser({ items }: { items: RegistryItem[] }) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" })
  const [category, setCategory] = useQueryState("cat", { defaultValue: "all" })

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
      const matchesCategory = category === "all" || item.category === category
      return matchesSearch && matchesCategory
    })
  }, [items, search, category])

  function handleCategoryChange(cat: string) {
    setCategory(cat === "all" ? null : cat)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 size-[500px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold tracking-tight">Browse Registry</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} items available — filter by category or search by name
          </p>
        </div>

        {/* Search */}
        <InputGroup className="mb-8 backdrop-blur-sm">
          <InputGroupAddon>
            <SearchIcon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            className="h-11"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            autoFocus
          />
        </InputGroup>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Categories
              </p>
              {SIDEBAR_ITEMS.map(({ key, label }) => {
                const isActive = (category ?? "all") === key
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className={[
                      "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <span>{label}</span>
                    <span
                      className={[
                        "tabular-nums text-xs",
                        isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                      ].join(" ")}
                    >
                      {categoryCounts[key] ?? 0}
                    </span>
                  </button>
                )
              })}

              {/* Placeholder for future tags */}
              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
                  Tags
                </p>
                <p className="mt-2 px-2 text-xs text-muted-foreground/40">Coming soon</p>
              </div>
            </div>
          </aside>

          {/* Mobile category pills */}
          <div className="lg:hidden -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
            {SIDEBAR_ITEMS.map(({ key, label }) => {
              const isActive = (category ?? "all") === key
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={[
                    "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-card/60 text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                  <span className="tabular-nums text-xs opacity-70">
                    {categoryCounts[key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {/* Result count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span> result
                {filtered.length !== 1 ? "s" : ""}
                {search && (
                  <>
                    {" "}
                    for <span className="font-medium text-foreground">"{search}"</span>
                  </>
                )}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-24 text-center">
                <SearchIcon className="size-8 text-muted-foreground/40" />
                <p className="font-medium text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground/60">
                  Try adjusting your search or selecting a different category
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <RegistryCard key={item.name} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
