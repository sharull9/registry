"use client"
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table"
import { createContext, useContext } from "react"

export interface DataTableStateSnapshot {
  sorting: SortingState
  columnVisibility: VisibilityState
  rowSelection: RowSelectionState
  pagination: PaginationState
  globalFilter: string
}

export interface DataTableContextValue<TData = unknown> {
  table: Table<TData>
  state: DataTableStateSnapshot
  searchValue: string
  setSearchValue: (value: string) => void
}

export const DataTableContext = createContext<DataTableContextValue<unknown> | null>(null)

export function useDataTableContext<TData = unknown>(): DataTableContextValue<TData> {
  const ctx = useContext(DataTableContext)
  if (!ctx) throw new Error("useDataTableContext must be used within <DataTable>")
  return ctx as DataTableContextValue<TData>
}
