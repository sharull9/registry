"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"

export interface DateRange {
  from: Date
  to?: Date
}

interface DataTableDateRangeFilterProps {
  columnId: string
  value: DateRange | undefined
  onChange: (value: DateRange | undefined) => void
  label?: string
  placeholder?: string
}

export function DataTableDateRangeFilter({
  columnId,
  value,
  onChange,
  label,
  placeholder = "Pick a date range",
}: DataTableDateRangeFilterProps) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnId)

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range)
    column?.setFilterValue(range ? [range.from, range.to] : undefined)
  }

  const hasValue = !!value?.from

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 w-full justify-start sm:w-auto", !hasValue && "text-muted-foreground")}
            aria-label={label ?? placeholder}
          >
            <CalendarIcon className="mr-2 size-4" />
            {hasValue ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} — {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) =>
              handleSelect(range?.from ? { from: range.from, to: range.to } : undefined)
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => handleSelect(undefined)}
          aria-label="Clear date filter"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
