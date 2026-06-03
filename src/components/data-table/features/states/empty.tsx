import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { TableCell, TableRow } from "@/components/ui/table"
import { Database } from "lucide-react"

interface DataTableEmptyStateProps {
  title?: string
  description?: string
  colSpan?: number
}

export function DataTableEmptyState({
  title = "No results",
  description = "No data matches your current filters.",
}: DataTableEmptyStateProps) {
  return (
    <Empty className="border-0 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Database />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function DataTableEmptyRow({
  colSpan,
  children,
}: {
  colSpan: number
  children?: React.ReactNode
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        {children ?? <DataTableEmptyState />}
      </TableCell>
    </TableRow>
  )
}
