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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

type FilterOption = { label: string; value: string }

type DataTableStatusFilterProps<M extends "single" | "multi"> = {
  columnId: string
  mode: M
  options: FilterOption[]
  label?: string
  placeholder?: string
} & (M extends "single"
  ? { value: string; onChange: (value: string) => void }
  : { value: string[]; onChange: (value: string[]) => void })

export function DataTableStatusFilter<M extends "single" | "multi">({
  columnId,
  mode,
  options,
  label,
  placeholder = "All",
  value,
  onChange,
}: DataTableStatusFilterProps<M>) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnId)

  if (mode === "single") {
    const singleValue = value as string
    const singleOnChange = onChange as (v: string) => void

    const handleChange = (next: string) => {
      singleOnChange(next)
      column?.setFilterValue(next || undefined)
    }

    return (
      <Select value={singleValue} onValueChange={handleChange}>
        <SelectTrigger aria-label={label} className="w-full sm:w-40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
