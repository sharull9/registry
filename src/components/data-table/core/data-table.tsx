"use client"

import { DataTableContext, useDataTableContext } from "@/components/data-table/core/context"
import type { DataTableContentProps, DataTableProps } from "@/components/data-table/core/types"
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

export function DataTable<TData>({
  data,
  columns,
  search,
  rowSelection,
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
  const resolvedColumns = rowSelection?.enabled
    ? [rowSelectionColumn<TData>(), ...columns]
    : columns

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
  const hasRows = table.getRowModel().rows.length > 0
  const colCount = table.getVisibleLeafColumns().length

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
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
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
