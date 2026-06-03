import type { buttonVariants } from "@/components/ui/button"
import type {
  ColumnDef,
  ColumnPinningState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import type { VariantProps } from "class-variance-authority"

export interface DataTableControlledState {
  sorting?: SortingState
  columnVisibility?: VisibilityState
  columnPinning?: ColumnPinningState
  rowSelection?: RowSelectionState
  pagination?: PaginationState
  searchValue?: string
  expanded?: ExpandedState
}

export interface DataTableStateChangeHandlers {
  onSortingChange?: (value: SortingState) => void
  onColumnVisibilityChange?: (value: VisibilityState) => void
  onColumnPinningChange?: (value: ColumnPinningState) => void
  onRowSelectionChange?: (value: RowSelectionState) => void
  onPaginationChange?: (value: PaginationState) => void
  onSearchValueChange?: (value: string) => void
  onExpandedChange?: (value: ExpandedState) => void
}

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

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  /**
   * Total row count from the server. Required for server-side pagination.
   * Omit to use client-side pagination (all rows passed via `data`).
   */
  rowCount?: number
  /**
   * Search configuration.
   *
   * - global: searches all searchable columns by default. Provide columnIds to restrict it.
   * - column: searches only the provided columnIds. Use columnIds: ["vendor"] for one column.
   */
  search?: {
    enabled?: boolean
    mode?: "column" | "global"
    columnIds?: string[]
  }
  /** Adds a checkbox column and enables row selection. */
  rowSelection?: {
    enabled?: boolean
    mode?: "single" | "multi"
  }
  /** Adds an expand toggle column and renders a sub-row below each expanded row. */
  rowExpansion?: {
    enabled?: boolean
    renderSubRow: (row: Row<TData>) => React.ReactNode
  }
  pageSize?: number
  initialColumnVisibility?: VisibilityState
  state?: DataTableControlledState
  onStateChange?: DataTableStateChangeHandlers
  className?: string
  children: React.ReactNode
}

export interface DataTableContentProps {
  isLoading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  onRowClick?: (row: Row<unknown>) => void
  renderSubRow?: (row: Row<unknown>) => React.ReactNode
}
