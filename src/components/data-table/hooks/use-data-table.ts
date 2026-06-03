"use client"

import type {
  DataTableControlledState,
  DataTableStateChangeHandlers,
} from "@/components/data-table/core/types"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { useState } from "react"

interface SearchFeatureConfig {
  enabled?: boolean
  mode?: "column" | "global"
  columnIds?: string[]
}

interface UseDataTableOptions<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  rowCount?: number
  pageSize?: number
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  initialColumnVisibility?: VisibilityState
  search?: SearchFeatureConfig
  state?: DataTableControlledState
  onStateChange?: DataTableStateChangeHandlers
}

function resolveSearchMode(search?: SearchFeatureConfig) {
  if (!search?.enabled) return null
  return search.mode ?? "global"
}

function isDefinedColumnId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function getColumnDefId<TData>(column: ColumnDef<TData>): string | null {
  if ("id" in column && isDefinedColumnId(column.id)) {
    return column.id
  }

  if ("accessorKey" in column && isDefinedColumnId(column.accessorKey)) {
    return column.accessorKey
  }

  return null
}

function uniqueColumnIds(ids: Array<string | null | undefined>) {
  return Array.from(new Set(ids.filter(isDefinedColumnId)))
}

export function useDataTable<TData>({
  data,
  columns,
  pageSize = 10,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  initialColumnVisibility = {},
  search,
  state,
  onStateChange,
  rowCount,
}: UseDataTableOptions<TData>) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>(initialColumnVisibility)
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [internalSearchValue, setInternalSearchValue] = useState("")

  const sorting = state?.sorting ?? internalSorting
  const columnVisibility = state?.columnVisibility ?? internalColumnVisibility
  const rowSelection = state?.rowSelection ?? internalRowSelection
  const pagination = state?.pagination ?? internalPagination
  const searchValue = state?.searchValue ?? internalSearchValue

  const setSortingValue = (value: SortingState) => {
    if (state?.sorting === undefined) setInternalSorting(value)
    onStateChange?.onSortingChange?.(value)
  }

  const setColumnVisibilityValue = (value: VisibilityState) => {
    if (state?.columnVisibility === undefined) setInternalColumnVisibility(value)
    onStateChange?.onColumnVisibilityChange?.(value)
  }

  const setRowSelectionValue = (value: RowSelectionState) => {
    if (state?.rowSelection === undefined) setInternalRowSelection(value)
    onStateChange?.onRowSelectionChange?.(value)
  }

  const setPaginationValue = (value: PaginationState) => {
    if (state?.pagination === undefined) setInternalPagination(value)
    onStateChange?.onPaginationChange?.(value)
  }

  const commitSearchValue = (value: string) => {
    if (state?.searchValue === undefined) setInternalSearchValue(value)
    onStateChange?.onSearchValueChange?.(value)
  }

  const searchMode = resolveSearchMode(search)
  const allColumnIds = columns.map((column) => getColumnDefId(column)).filter(isDefinedColumnId)
  const configuredColumnIds = uniqueColumnIds(search?.columnIds ?? [])
  const searchableColumnIds =
    searchMode === "global"
      ? configuredColumnIds.length > 0
        ? configuredColumnIds
        : allColumnIds
      : searchMode === "column"
        ? configuredColumnIds
        : []

  const updateSorting: OnChangeFn<SortingState> = (updater) => {
    setSortingValue(functionalUpdate(updater, sorting))
  }

  const updateColumnVisibility: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibilityValue(functionalUpdate(updater, columnVisibility))
  }

  const updateRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelectionValue(functionalUpdate(updater, rowSelection))
  }

  const updatePagination: OnChangeFn<PaginationState> = (updater) => {
    setPaginationValue(functionalUpdate(updater, pagination))
  }

  const updateSearchValue = (value: string) => {
    commitSearchValue(value)
    setPaginationValue({ ...pagination, pageIndex: 0 })
  }

  const columnFilters: ColumnFiltersState = []
  const hasSearchTargets = searchableColumnIds.length > 0
  const globalFilter = searchMode && hasSearchTargets ? (searchValue ?? "") : ""
  const tableState = {
    sorting,
    columnVisibility,
    rowSelection,
    pagination,
    globalFilter,
  }

  const globalFilterFn: FilterFn<TData> = (row, _columnId, filterValue) => {
    const normalizedFilter = String(filterValue ?? "")
      .trim()
      .toLowerCase()
    if (!normalizedFilter) return true

    return searchableColumnIds.some((columnId) => {
      const rawValue = row.getValue(columnId)
      return String(rawValue ?? "")
        .toLowerCase()
        .includes(normalizedFilter)
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    data,
    columns,
    autoResetPageIndex: state?.pagination === undefined,
    state: {
      sorting: tableState.sorting,
      columnFilters,
      columnVisibility: tableState.columnVisibility,
      rowSelection: tableState.rowSelection,
      pagination: tableState.pagination,
      globalFilter: tableState.globalFilter,
    },
    enableRowSelection,
    enableMultiRowSelection,
    manualPagination: rowCount !== undefined,
    rowCount,
    onSortingChange: updateSorting,
    onColumnVisibilityChange: updateColumnVisibility,
    onRowSelectionChange: updateRowSelection,
    onPaginationChange: updatePagination,
    onGlobalFilterChange: (updater) =>
      updateSearchValue(String(functionalUpdate(updater, globalFilter))),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getColumnCanGlobalFilter: () => true,
    globalFilterFn,
  })

  return {
    table,
    state: tableState,
    rowSelection,
    searchValue,
    setSearchValue: updateSearchValue,
    searchMode,
  }
}
