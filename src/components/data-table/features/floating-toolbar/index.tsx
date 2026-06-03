"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import type { FloatingToolbarAction } from "@/components/data-table/core/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface DataTableFloatingToolbarProps<TData> {
  actions: FloatingToolbarAction<TData>[]
}

export function DataTableFloatingToolbar<TData>({ actions }: DataTableFloatingToolbarProps<TData>) {
  "use no memo"
  const { table } = useDataTableContext<TData>()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const count = selectedRows.length

  if (count === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-muted-foreground">{count} selected</span>
        <Separator orientation="vertical" className="mx-1 h-5" />
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? "outline"}
            size="sm"
            onClick={() => action.onClick(selectedRows)}
            className="h-8"
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => table.toggleAllRowsSelected(false)}
        >
          <X className="size-4" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>
    </div>
  )
}
