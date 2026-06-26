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

type FilterOption = { label: string; value: string }

type DataTableStatusFilterProps<M extends "single" | "multi"> = {
  columnId: string
  mode: M
  options: FilterOption[]
  label?: string
  placeholder?: string
  allLabel?: string
} & (M extends "single"
  ? { value: string | undefined; onChange: (value: string | undefined) => void }
  : { value: string[]; onChange: (value: string[]) => void })

export function DataTableStatusFilter<M extends "single" | "multi">({
  columnId,
  mode,
  options,
  label,
  placeholder = "All",
  allLabel = "All",
  value,
  onChange,
}: DataTableStatusFilterProps<M>) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnId)

  if (mode === "single") {
    const singleValue = value as string | undefined
    const singleOnChange = onChange as (v: string | undefined) => void

    const clear = () => {
      singleOnChange(undefined)
      column?.setFilterValue(undefined)
    }

    const select = (next: string) => {
      singleOnChange(next)
      column?.setFilterValue(next)
    }

    const activeLabel = options.find((o) => o.value === singleValue)?.label

    return (
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto" aria-label={label}>
              {label && <span className="text-muted-foreground">{label}:</span>}
              <span className="ml-1">{activeLabel ?? placeholder}</span>
              <ChevronDown className="ml-1 size-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuCheckboxItem checked={singleValue === undefined} onCheckedChange={clear}>
              {allLabel}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {options.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={singleValue === opt.value}
                onCheckedChange={() => select(opt.value)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
            {singleValue !== undefined && (
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
      </div>
    )
  }

  const multiValue = value as string[]
  const multiOnChange = onChange as (v: string[]) => void

  const toggle = (optValue: string) => {
    const next = multiValue.includes(optValue)
      ? multiValue.filter((v) => v !== optValue)
      : [...multiValue, optValue]
    multiOnChange(next)
    column?.setFilterValue(next.length > 0 ? next : undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto" aria-label={label}>
          {label ?? placeholder}
          {multiValue.length > 0 && (
            <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal">
              {multiValue.length}
            </Badge>
          )}
          <ChevronDown className="ml-1 size-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={multiValue.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
        {multiValue.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={() => {
                multiOnChange([])
                column?.setFilterValue(undefined)
              }}
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
