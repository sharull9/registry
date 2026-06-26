"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

type FilterOption = { label: string; value: string; icon?: React.ReactNode }

interface DataTableFacetedFilterProps {
  columnId: string
  options: FilterOption[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}

export function DataTableFacetedFilter({
  columnId,
  options,
  value,
  onChange,
  label,
}: DataTableFacetedFilterProps) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  const { table } = useDataTableContext()
  const column = table.getColumn(columnId)
  const facetMap = column?.getFacetedUniqueValues()

  const toggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue]
    onChange(next)
    column?.setFilterValue(next.length > 0 ? next : undefined)
  }

  const clear = () => {
    onChange([])
    column?.setFilterValue(undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto" aria-label={label}>
          {label ?? columnId}
          {value.length > 0 && (
            <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal">
              {value.length}
            </Badge>
          )}
          <ChevronDown className="ml-1 size-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {options.map((opt) => {
          const count = facetMap?.get(opt.value)
          return (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={value.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                {opt.icon}
                {opt.label}
              </span>
              {count !== undefined && (
                <span className="ml-auto font-mono text-xs text-muted-foreground">{count}</span>
              )}
            </DropdownMenuCheckboxItem>
          )
        })}
        {value.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={clear}
              className="text-muted-foreground"
            >
              Clear filter
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
