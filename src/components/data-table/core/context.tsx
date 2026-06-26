"use client"
import type { DataTableDensity } from "@/components/data-table/core/types"
import type { Table } from "@tanstack/react-table"
import { createContext, useContext } from "react"

export interface DataTableContextValue<TData = unknown> {
  table: Table<TData>
  density: DataTableDensity
  setDensity: (d: DataTableDensity) => void
}

export const DataTableContext = createContext<DataTableContextValue<unknown> | null>(null)

export function useDataTableContext<TData = unknown>(): DataTableContextValue<TData> {
  const ctx = useContext(DataTableContext)
  if (!ctx) throw new Error("useDataTableContext must be used within <DataTable>")
  return ctx as DataTableContextValue<TData>
}
