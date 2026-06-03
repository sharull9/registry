"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PanelLeft, PanelRight, Pin, Settings2 } from "lucide-react"

interface DataTableColumnToggleProps {
  enablePinning?: boolean
}

export function DataTableColumnToggle({ enablePinning = false }: DataTableColumnToggleProps) {
  "use no memo"
  const { table } = useDataTableContext()

  const columns = table
    .getAllLeafColumns()
    .filter((col) => {
      const meta = col.columnDef.meta as { isUtilityColumn?: boolean } | undefined
      return !meta?.isUtilityColumn
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.id?.replaceAll("_", " ").replaceAll("-", " ")}
            </DropdownMenuCheckboxItem>
          ))}
        {enablePinning && columns.some((col) => col.getCanPin()) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Pin columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns
              .filter((col) => col.getCanPin())
              .map((col) => {
                const pinned = col.getIsPinned()
                return (
                  <DropdownMenuItem key={col.id} className="flex items-center justify-between gap-4 capitalize">
                    <span>{col.id?.replaceAll("_", " ").replaceAll("-", " ")}</span>
                    <span className="flex items-center gap-1">
                      <button
                        aria-label={`Pin ${col.id} left`}
                        className={pinned === "left" ? "text-primary" : "text-muted-foreground"}
                        onClick={() => col.pin(pinned === "left" ? false : "left")}
                      >
                        <PanelLeft className="size-3.5" />
                      </button>
                      <button
                        aria-label={`Pin ${col.id} right`}
                        className={pinned === "right" ? "text-primary" : "text-muted-foreground"}
                        onClick={() => col.pin(pinned === "right" ? false : "right")}
                      >
                        <PanelRight className="size-3.5" />
                      </button>
                      {pinned && (
                        <button aria-label={`Unpin ${col.id}`} onClick={() => col.pin(false)}>
                          <Pin className="size-3.5 text-muted-foreground" />
                        </button>
                      )}
                    </span>
                  </DropdownMenuItem>
                )
              })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
