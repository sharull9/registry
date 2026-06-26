"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Table } from "@tanstack/react-table"
import { Bookmark, Trash2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface SavedView<TState> {
  id: string
  name: string
  state: TState
}

interface DataTableSavedViewsProps<TData, TState> {
  storageKey: string
  table: Table<TData>
  captureState: (table: Table<TData>) => TState
  applyState: (table: Table<TData>, state: TState) => void
  label?: string
}

export function DataTableSavedViews<TData, TState>({
  storageKey,
  table,
  captureState,
  applyState,
  label = "Views",
}: DataTableSavedViewsProps<TData, TState>) {
  const [views, setViews] = useState<SavedView<TState>[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? (JSON.parse(raw) as SavedView<TState>[]) : []
    } catch {
      return []
    }
  })
  const [isNaming, setIsNaming] = useState(false)
  const [name, setName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(views))
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [views, storageKey])

  useEffect(() => {
    if (isNaming) inputRef.current?.focus()
  }, [isNaming])

  const save = useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed) return
    const view: SavedView<TState> = {
      id: crypto.randomUUID(),
      name: trimmed,
      state: captureState(table),
    }
    setViews((prev) => [...prev, view])
    setName("")
    setIsNaming(false)
  }, [name, table, captureState])

  const remove = (id: string) => setViews((prev) => prev.filter((v) => v.id !== id))

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setIsNaming(false) }}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Bookmark className="size-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Saved views</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {views.length === 0 && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No saved views yet
          </DropdownMenuItem>
        )}
        {views.map((view) => (
          <DropdownMenuItem
            key={view.id}
            className="flex items-center justify-between"
            onSelect={(e) => {
              e.preventDefault()
              applyState(table, view.state)
            }}
          >
            <span className="truncate">{view.name}</span>
            <button
              className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                remove(view.id)
              }}
              aria-label={`Delete view "${view.name}"`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {isNaming ? (
          <div className="flex items-center gap-1 px-2 py-1.5">
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save()
                if (e.key === "Escape") setIsNaming(false)
              }}
              placeholder="View name..."
              className="h-7 text-sm"
            />
            <Button size="sm" className="h-7 shrink-0" onClick={save}>
              Save
            </Button>
          </div>
        ) : (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsNaming(true) }}>
            Save current view
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
