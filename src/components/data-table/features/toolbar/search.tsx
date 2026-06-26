"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"

interface DataTableSearchProps {
  placeholder?: string
}

export function DataTableSearch({ placeholder = "Search..." }: DataTableSearchProps) {
  "use no memo"
  // TanStack Table exposes a stable mutable table instance; compiler memoization can hide table state updates.
  const { table } = useDataTableContext()
  const value = (table.getState().globalFilter as string) ?? ""

  return (
    <InputGroup className="relative w-full lg:max-w-2xs">
      <InputGroupAddon>
        <Search className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="h-8 pl-8"
      />
      <InputGroupAddon align="inline-end">
        {value && (
          <InputGroupButton onClick={() => table.setGlobalFilter("")}>
            <X />
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}
