"use client"

import { Button } from "@/components/ui/button"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

export function expandedRowColumn<TData>(): ColumnDef<TData> {
  return {
    id: "expand",
    header: () => null,
    cell: ({ row }) => {
      if (!row.getCanExpand()) return null
      return (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={row.getToggleExpandedHandler()}
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      )
    },
    enableSorting: false,
    enableHiding: false,
    meta: { isUtilityColumn: true },
    size: 40,
  }
}

interface DataTableSubRowProps<TData> {
  row: Row<TData>
  colSpan: number
  renderSubRow: (row: Row<TData>) => React.ReactNode
}

export function DataTableSubRow<TData>({ row, colSpan, renderSubRow }: DataTableSubRowProps<TData>) {
  if (!row.getIsExpanded()) return null
  return (
    <tr>
      <td colSpan={colSpan} className="bg-muted/30 px-4 py-3">
        {renderSubRow(row)}
      </td>
    </tr>
  )
}
