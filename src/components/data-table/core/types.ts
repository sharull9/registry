import type { buttonVariants } from "@/components/ui/button"
import type { Row } from "@tanstack/react-table"
import type { VariantProps } from "class-variance-authority"

export type DataTableDensity = "compact" | "default" | "comfortable"

export interface ExtraAction<TData> {
  label: string
  icon?: React.ReactNode
  onClick: (row: Row<TData>) => void
  destructive?: boolean
  disabled?: boolean
}

export interface FloatingToolbarAction<TData> {
  label: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
  icon?: React.ReactNode
  onClick: (rows: Row<TData>[]) => void
}

export interface DataTableContentProps {
  isLoading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  onRowClick?: (row: Row<unknown>) => void
  renderSubRow?: (row: Row<unknown>) => React.ReactNode
}
