import type { Row } from "@tanstack/react-table"

export type DataTableDensity = "compact" | "default" | "comfortable"

export interface ExtraAction<TData> {
  label: string
  icon?: React.ReactNode
  onClick: (row: Row<TData>) => void
  destructive?: boolean
  disabled?: boolean
}

export interface DataTableContentProps {
  isLoading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  onRowClick?: (row: Row<unknown>) => void
  renderSubRow?: (row: Row<unknown>) => React.ReactNode
}
