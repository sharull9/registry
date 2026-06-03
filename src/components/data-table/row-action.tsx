"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface ExtraAction<TData> {
  label: string
  icon?: React.ReactNode
  onClick: (row: Row<TData>) => void
  destructive?: boolean
  disabled?: boolean
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit?: (row: Row<TData>) => void
  onDelete?: (row: Row<TData>) => void
  extraActions?: ExtraAction<TData>[]
  disabled?: boolean
  disabledEdit?: boolean
  disabledDelete?: boolean
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  extraActions,
  disabled,
  disabledEdit,
  disabledDelete,
}: DataTableRowActionsProps<TData>) {
  const hasExtras = extraActions && extraActions.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="ghost" size="icon" className="size-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open row actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(row)} disabled={disabledEdit}>
            <Pencil className="size-3.5 text-muted-foreground" />
            Edit
          </DropdownMenuItem>
        )}
        {onEdit && hasExtras && <DropdownMenuSeparator />}
        {hasExtras &&
          extraActions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row)}
              className={action.destructive ? "text-destructive focus:text-destructive" : undefined}
              disabled={action.disabled || undefined}
            >
              {action.icon && <span className="size-3.5 text-muted-foreground">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}
        {onDelete && (onEdit || hasExtras) && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(row)}
            disabled={disabledDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
