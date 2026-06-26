"use client"

import { DataTableContext, useDataTableContext } from "@/components/data-table/core/context"
import type { DataTableContentProps, DataTableDensity } from "@/components/data-table/core/types"
import { DataTableSubRow } from "@/components/data-table/features/row-expansion"
import { DataTableEmptyState } from "@/components/data-table/features/states/empty"
import { DataTableLoadingState } from "@/components/data-table/features/states/loading"
import { densityRowClass } from "@/components/data-table/features/toolbar/density-toggle"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { flexRender, type Table as TanStackTable } from "@tanstack/react-table"
import { Fragment, useState } from "react"

interface DataTableProps<TData> {
  table: TanStackTable<TData>
  className?: string
  children: React.ReactNode
}

export function DataTable<TData>({ table, className, children }: DataTableProps<TData>) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  const [density, setDensity] = useState<DataTableDensity>("default")

  return (
    <DataTableContext.Provider
      value={{
        table: table as unknown as TanStackTable<unknown>,
        density,
        setDensity,
      }}
    >
      <div className={cn("relative space-y-3", className)}>{children}</div>
    </DataTableContext.Provider>
  )
}

export function DataTableContent({
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  onRowClick,
  renderSubRow,
}: DataTableContentProps) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  const { table, density } = useDataTableContext()
  const hasRows = table.getRowModel().rows.length > 0
  const colCount = table.getVisibleLeafColumns().length

  const getPinClass = (pinned: "left" | "right" | false) => {
    if (pinned === "left") return "sticky left-0 z-10 bg-background"
    if (pinned === "right") return "sticky right-0 z-10 bg-background"
    return undefined
  }

  return (
    <div
      className={cn("overflow-x-auto rounded-md border border-border", densityRowClass[density])}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={getPinClass(header.column.getIsPinned())}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <DataTableLoadingState columns={colCount} rows={loadingRowCount} />
          ) : hasRows ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row as Parameters<typeof onRowClick>[0])
                      : undefined
                  }
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={getPinClass(cell.column.getIsPinned())}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {renderSubRow && (
                  <DataTableSubRow
                    row={row as Parameters<typeof renderSubRow>[0]}
                    colSpan={colCount}
                    renderSubRow={
                      renderSubRow as Parameters<typeof DataTableSubRow>[0]["renderSubRow"]
                    }
                  />
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colCount} className="p-0">
                {emptyState ?? <DataTableEmptyState />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
