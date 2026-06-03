import type {
	ColumnDef,
	PaginationState,
	Row,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'

export interface DataTableControlledState {
	sorting?: SortingState
	columnVisibility?: VisibilityState
	rowSelection?: RowSelectionState
	pagination?: PaginationState
	searchValue?: string
}

export interface DataTableStateChangeHandlers {
	onSortingChange?: (value: SortingState) => void
	onColumnVisibilityChange?: (value: VisibilityState) => void
	onRowSelectionChange?: (value: RowSelectionState) => void
	onPaginationChange?: (value: PaginationState) => void
	onSearchValueChange?: (value: string) => void
}

export interface FloatingToolbarAction<TData> {
	label: string
	variant?: VariantProps<typeof buttonVariants>['variant']
	icon?: React.ReactNode
	onClick: (rows: Row<TData>[]) => void
}

export interface DataTableProps<TData> {
	data: TData[]
	columns: ColumnDef<TData>[]
	rowCount: number
	/**
	 * Search configuration.
	 *
	 * - global: searches all searchable columns by default. Provide columnIds to restrict it.
	 * - column: searches only the provided columnIds. Use columnIds: ["vendor"] for one column.
	 */
	search?: {
		enabled?: boolean
		mode?: 'column' | 'global'
		columnIds?: string[]
	}
	/** Adds a checkbox column and enables row selection. */
	rowSelection?: {
		enabled?: boolean
		mode?: 'single' | 'multi'
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
}
