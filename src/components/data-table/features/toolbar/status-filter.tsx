"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Items = { label: string; value: string }

interface DataTableStatusFilterProps {
  value: string
  onValueChange: (value: string) => void
  items: Items[]
  label?: string
}

export function DataTableStatusFilter({
  value,
  onValueChange,
  items,
  label,
}: DataTableStatusFilterProps) {
  return (
    <Select value={value} onValueChange={(value) => onValueChange(value)}>
      <SelectTrigger aria-label={label} className="w-full sm:w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
