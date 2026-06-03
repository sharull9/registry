"use client"

import type {
  DataTableControlledState,
  DataTableStateChangeHandlers,
} from "@/components/data-table/core/types"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  type FilterFn,
  functionalUpdate,
  getCoreRowModel,
  getExpandedRowModel,
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
  enableRowExpansion?: boolean
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
  enableRowExpansion = false,
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
  const [internalColumnPinning, setInternalColumnPinning] = useState<ColumnPinningState>({})
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({})
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [internalSearchValue, setInternalSearchValue] = useState("")

  const sorting = state?.sorting ?? internalSorting
  const columnVisibility = state?.columnVisibility ?? internalColumnVisibility
  const columnPinning = state?.columnPinning ?? internalColumnPinning
  const rowSelection = state?.rowSelection ?? internalRowSelection
  const expanded = state?.expanded ?? internalExpanded
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

  const setColumnPinningValue = (value: ColumnPinningState) => {
    if (state?.columnPinning === undefined) setInternalColumnPinning(value)
    onStateChange?.onColumnPinningChange?.(value)
  }

  const setRowSelectionValue = (value: RowSelectionState) => {
    if (state?.rowSelection === undefined) setInternalRowSelection(value)
    onStateChange?.onRowSelectionChange?.(value)
  }

  const setExpandedValue = (value: ExpandedState) => {
    if (state?.expanded === undefined) setInternalExpanded(value)
    onStateChange?.onExpandedChange?.(value)
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

  const updateColumnPinning: OnChangeFn<ColumnPinningState> = (updater) => {
    setColumnPinningValue(functionalUpdate(updater, columnPinning))
  }

  const updateRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelectionValue(functionalUpdate(updater, rowSelection))
  }

  const updateExpanded: OnChangeFn<ExpandedState> = (updater) => {
    setExpandedValue(functionalUpdate(updater, expanded))
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
    columnPinning,
    rowSelection,
    expanded,
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
      columnPinning: tableState.columnPinning,
      rowSelection: tableState.rowSelection,
      expanded: tableState.expanded,
      pagination: tableState.pagination,
      globalFilter: tableState.globalFilter,
    },
    enableRowSelection,
    enableMultiRowSelection,
    manualPagination: rowCount !== undefined,
    rowCount,
    onSortingChange: updateSorting,
    onColumnVisibilityChange: updateColumnVisibility,
    onColumnPinningChange: updateColumnPinning,
    onRowSelectionChange: updateRowSelection,
    onExpandedChange: updateExpanded,
    onPaginationChange: updatePagination,
    onGlobalFilterChange: (updater) =>
      updateSearchValue(String(functionalUpdate(updater, globalFilter))),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: enableRowExpansion ? getExpandedRowModel() : undefined,
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
