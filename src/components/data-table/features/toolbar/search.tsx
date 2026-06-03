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
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = "Search...",
}: DataTableSearchProps) {
  const { searchValue: contextValue, setSearchValue } = useDataTableContext()
  const displayValue = value ?? contextValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    if (onChange) {
      onChange(nextValue)
      return
    }
    setSearchValue(nextValue)
  }

  const handleClear = () => {
    if (onChange) {
      onChange("")
      return
    }
    setSearchValue("")
  }

  return (
    <InputGroup className="relative w-full lg:max-w-2xs">
      <InputGroupAddon>
        <Search className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className="h-8 pl-8"
      />
      <InputGroupAddon align="inline-end">
        {displayValue && (
          <InputGroupButton onClick={handleClear}>
            <X />
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}
