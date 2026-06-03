"use client"

import { RegistryCard } from "@/components/registry-browser"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { RegistryItem } from "@/lib/registry"
import { SearchIcon, XIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useMemo } from "react"

const CATEGORIES = ["all", "agent", "config", "provider", "misc", "component"] as const

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  agent: "Agents",
  config: "Configs",
  provider: "Providers",
  misc: "Misc",
  component: "Components",
}

export function SearchBrowser({ items }: { items: RegistryItem[] }) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" })
  const [category, setCategory] = useQueryState("cat", { defaultValue: "all" })
  const [activeTags, setActiveTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length }
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1
    }
    return counts
  }, [items])

  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>()
    for (const item of items) {
      for (const tag of item.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    }
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "all" || item.category === category
      const matchesTags = activeTags.length === 0 || activeTags.some((t) => item.tags.includes(t))
      return matchesSearch && matchesCategory && matchesTags
    })
  }, [items, search, category, activeTags])

  function handleCategoryChange(cat: string) {
    setCategory(cat === "all" ? null : cat)
    setActiveTags([])
  }

  function handleTagToggle(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function clearFilters() {
    setSearch(null)
    setCategory(null)
    setActiveTags([])
  }

  const hasActiveFilters = search || (category && category !== "all") || activeTags.length > 0

  return (
    <div className="relative min-h-screen">
      {/* Background orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 size-[500px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 py-10">
        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold tracking-tight">Browse Registry</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} items — filter by category or tag
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <XIcon className="size-3.5" />
              Clear filters
            </button>
          )}
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
          {/* Sidebar — desktop */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <p className="mb-2 px-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = (category ?? "all") === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={[
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-all",
                          isActive
                            ? "bg-primary font-medium text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        <span>{CATEGORY_LABELS[cat]}</span>
                        <span
                          className={[
                            "text-xs tabular-nums",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                          ].join(" ")}
                        >
                          {categoryCounts[cat] ?? 0}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="mb-2 px-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Tags
                </p>
                <div className="space-y-0.5">
                  {allTags.map(({ tag, count }) => {
                    const isActive = activeTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={[
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-all",
                          isActive
                            ? "bg-primary font-medium text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        <span># {tag}</span>
                        <span
                          className={[
                            "text-xs tabular-nums",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                          ].join(" ")}
                        >
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filters */}
          <div className="w-full lg:hidden">
            <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = (category ?? "all") === cat
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={[
                      "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-card/60 text-muted-foreground",
                    ].join(" ")}
                  >
                    {CATEGORY_LABELS[cat]}
                    <span className="text-xs tabular-nums opacity-70">
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
              {allTags.map(({ tag }) => {
                const isActive = activeTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={[
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-card/60 text-muted-foreground",
                    ].join(" ")}
                  >
                    # {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span> result
                {filtered.length !== 1 ? "s" : ""}
              </p>
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  # {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-foreground"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-24 text-center">
                <SearchIcon className="size-8 text-muted-foreground/40" />
                <p className="font-medium text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground/60">
                  Try adjusting your search, category, or tag
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
