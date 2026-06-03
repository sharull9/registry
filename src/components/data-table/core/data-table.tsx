"use client"

import { DataTableContext, useDataTableContext } from "@/components/data-table/core/context"
import type { DataTableContentProps, DataTableProps } from "@/components/data-table/core/types"
import { densityRowClass, useDataTableDensityOptional } from "@/components/data-table/features/toolbar/density-toggle"
import { expandedRowColumn, DataTableSubRow } from "@/components/data-table/features/row-expansion"
import { rowSelectionColumn } from "@/components/data-table/features/row-selection"
import { DataTableEmptyState } from "@/components/data-table/features/states/empty"
import { DataTableLoadingState } from "@/components/data-table/features/states/loading"
import { useDataTable } from "@/components/data-table/hooks/use-data-table"
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
import { Fragment } from "react"

export function DataTable<TData>({
  data,
  columns,
  search,
  rowSelection,
  rowExpansion,
  pageSize = 10,
  initialColumnVisibility = {},
  state,
  onStateChange,
  className,
  rowCount,
  children,
}: DataTableProps<TData>) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  let resolvedColumns = columns
  if (rowExpansion?.enabled) resolvedColumns = [expandedRowColumn<TData>(), ...resolvedColumns]
  if (rowSelection?.enabled) resolvedColumns = [rowSelectionColumn<TData>(), ...resolvedColumns]

  const {
    table,
    state: tableState,
    searchValue,
    setSearchValue,
  } = useDataTable({
    data,
    columns: resolvedColumns,
    pageSize,
    enableRowSelection: rowSelection?.enabled ?? false,
    enableMultiRowSelection: rowSelection?.mode !== "single",
    enableRowExpansion: rowExpansion?.enabled ?? false,
    initialColumnVisibility,
    search: search ? { ...search, enabled: search.enabled ?? true } : undefined,
    state,
    onStateChange,
    rowCount,
  })

  return (
    <DataTableContext.Provider
      value={{
        table: table as unknown as TanStackTable<unknown>,
        state: tableState,
        searchValue,
        setSearchValue,
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
  const { table, state } = useDataTableContext()
  const { sorting, columnVisibility, rowSelection, pagination, globalFilter } = state
  void sorting
  void columnVisibility
  void rowSelection
  void pagination
  void globalFilter
  const densityCtx = useDataTableDensityOptional()
  const hasRows = table.getRowModel().rows.length > 0
  const colCount = table.getVisibleLeafColumns().length

  const getPinClass = (pinned: "left" | "right" | false) => {
    if (pinned === "left") return "sticky left-0 z-10 bg-background"
    if (pinned === "right") return "sticky right-0 z-10 bg-background"
    return undefined
  }

  return (
    <div className={cn("rounded-md border border-border overflow-x-auto", densityCtx ? densityRowClass[densityCtx.density] : undefined)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan} className={getPinClass(header.column.getIsPinned())}>
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
                  onClick={onRowClick ? () => onRowClick(row as Parameters<typeof onRowClick>[0]) : undefined}
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
                    renderSubRow={renderSubRow as Parameters<typeof DataTableSubRow>[0]["renderSubRow"]}
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
