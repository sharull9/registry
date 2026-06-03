"use client"

import { cn } from "@/lib/utils"

interface DataTableToolbarProps {
  children?: React.ReactNode
  className?: string
}

export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>
}

export * from "@/components/data-table/features/toolbar/search"
export * from "@/components/data-table/features/toolbar/status-filter"
