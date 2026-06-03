"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"
import * as React from "react"

type SearchGroup<T> = {
  key: string
  label: string
  items: T[]
}

type SearchBarProps<T> = {
  searchLabel: string
  noResultsLabel: string
  description: string
  groups: SearchGroup<T>[]
  getItemKey: (item: T) => string
  getItemLabel: (item: T) => string
  getItemIcon: (item: T) => React.ComponentType<{ className?: string }>
  getItemKeywords: (item: T, group: SearchGroup<T>) => string[]
  isActive: (item: T) => boolean
  onSelect: (item: T) => void
  children: React.ReactNode
}

export function SearchBar<T>({
  searchLabel,
  noResultsLabel,
  description,
  groups,
  getItemKey,
  getItemLabel,
  getItemIcon,
  getItemKeywords,
  isActive,
  onSelect,
  children,
}: SearchBarProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const normalizedQuery = query.trim().toLowerCase()

  const filteredGroups = React.useMemo(() => {
    if (!normalizedQuery) return groups

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const keywords = getItemKeywords(item, group).join(" ").toLowerCase()
          return (
            getItemLabel(item).toLowerCase().includes(normalizedQuery) ||
            keywords.includes(normalizedQuery)
          )
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [getItemKeywords, getItemLabel, groups, normalizedQuery])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            type="button"
            variant="outline"
            className="h-9 max-w-md min-w-0 flex-1 justify-start gap-2 rounded-full px-3 text-muted-foreground"
          >
            <SearchIcon className="size-4 shrink-0" />
            <span className="hidden truncate sm:inline-block">{searchLabel}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b px-5 py-4">
          <DialogHeader>
            <DialogTitle>{searchLabel}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              autoFocus
              placeholder={searchLabel}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="max-h-[60vh] px-2 py-3">
          <div className="flex flex-col gap-4 px-3 pb-3">
            {filteredGroups.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {noResultsLabel}
              </p>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.key} className="grid gap-2">
                  <div className="px-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    {group.label}
                  </div>
                  <div className="grid gap-1">
                    {group.items.map((item) => {
                      const Icon = getItemIcon(item)
                      const active = isActive(item)
                      return (
                        <button
                          key={getItemKey(item)}
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted hover:text-foreground"
                          )}
                          onClick={() => {
                            onSelect(item)
                            setOpen(false)
                          }}
                        >
                          <Icon className="size-4 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{getItemLabel(item)}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {group.label}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
