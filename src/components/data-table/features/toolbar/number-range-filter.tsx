"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SlidersHorizontal, X } from "lucide-react"

export interface NumberRange {
  min?: number
  max?: number
}

interface DataTableNumberRangeFilterProps {
  columnId: string
  value: NumberRange | undefined
  onChange: (value: NumberRange | undefined) => void
  label?: string
  placeholder?: { min?: string; max?: string }
}

export function DataTableNumberRangeFilter({
  columnId,
  value,
  onChange,
  label,
  placeholder,
}: DataTableNumberRangeFilterProps) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnId)

  const hasValue = value?.min !== undefined || value?.max !== undefined

  const commit = (next: NumberRange | undefined) => {
    onChange(next)
    const isEmpty = next?.min === undefined && next?.max === undefined
    column?.setFilterValue(isEmpty ? undefined : [next?.min, next?.max])
  }

  const setMin = (raw: string) => {
    const parsed = raw === "" ? undefined : Number(raw)
    const next = { ...value, min: parsed }
    commit(next.min === undefined && next.max === undefined ? undefined : next)
  }

  const setMax = (raw: string) => {
    const parsed = raw === "" ? undefined : Number(raw)
    const next = { ...value, max: parsed }
    commit(next.min === undefined && next.max === undefined ? undefined : next)
  }

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 w-full sm:w-auto", !hasValue && "text-muted-foreground")}
            aria-label={label ?? "Number range filter"}
          >
            <SlidersHorizontal className="mr-2 size-4" />
            {hasValue ? (
              <>
                {value?.min !== undefined ? value.min : "–"}
                {" — "}
                {value?.max !== undefined ? value.max : "–"}
              </>
            ) : (
              label ?? "Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                placeholder={placeholder?.min ?? "Min"}
                value={value?.min ?? ""}
                onChange={(e) => setMin(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                placeholder={placeholder?.max ?? "Max"}
                value={value?.max ?? ""}
                onChange={(e) => setMax(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => commit(undefined)}
          aria-label="Clear range filter"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
