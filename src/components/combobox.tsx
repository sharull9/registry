"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import { AlertCircleIcon, ChevronsUpDown, SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

export type ComboboxOption = {
  id: string
  label: string
  keywords?: string[]
}

export type ComboboxProps = {
  // --- value ---
  /** When `multiple` is false (default): the selected option id, or "" for none */
  value: string
  /** Called with the newly selected id (single mode) */
  onValueChange: (value: string) => void

  // --- multi-select (optional) ---
  /** Enable multi-select mode */
  multiple?: boolean
  /** When `multiple` is true: the array of selected option ids */
  values?: string[]
  /** Called with the updated id array (multi mode) */
  onValuesChange?: (values: string[]) => void
  /** Max number of selected-value badges to show in the trigger before "+N more". Only applies in multi mode. */
  maxChips?: number

  // --- display ---
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
  options: ComboboxOption[]
  isPending: boolean
  isError: boolean

  // --- async search (optional) ---
  /**
   * When provided, disables cmdk's built-in local filtering.
   * The parent is responsible for updating `options` in response to the query.
   * Called with the current search string (debounced 300 ms inside the component).
   */
  onSearch?: (query: string) => void

  // --- misc ---
  disabled?: boolean
  includeAll?: boolean
  className?: string
  errorMessage?: string
  /**
   * Override the text shown in the trigger for the selected value(s).
   * In multi mode this replaces the badge list entirely when provided.
   */
  selectedLabel?: string
  icon?: React.ReactNode
}

export function Combobox({
  value,
  onValueChange,
  multiple = false,
  values = [],
  onValuesChange,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  options: rawOptions,
  isPending,
  isError,
  onSearch,
  disabled,
  includeAll,
  maxChips,
  className,
  errorMessage,
  selectedLabel,
  icon: Icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Debounce onSearch via the reusable hook
  const debouncedSearch = useDebounce(
    React.useCallback(
      (query: string) => {
        onSearch?.(query)
      },
      [onSearch],
    ),
    300,
  )

  const handleSearchChange = React.useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (onSearch) debouncedSearch(query)
    },
    [onSearch, debouncedSearch],
  )

  const options = includeAll ? [{ id: "", label: "All" }, ...rawOptions] : rawOptions

  // --- single-select helpers ---
  const selectedOption = options.find((o) => o.id === value)

  // --- multi-select helpers ---
  const isSelected = (id: string) => values.includes(id)
  const toggleValue = (id: string) => {
    if (!onValuesChange) return
    onValuesChange(isSelected(id) ? values.filter((v) => v !== id) : [...values, id])
  }
  const clearValues = () => onValuesChange?.([])
  const selectedOptions = options.filter((o) => values.includes(o.id))

  // --- trigger label ---
  const triggerContent = (() => {
    if (selectedLabel) {
      return <span className="truncate text-foreground">{selectedLabel}</span>
    }
    if (multiple) {
      if (selectedOptions.length === 0) {
        return <span className="truncate text-muted-foreground">{placeholder}</span>
      }
      return (
        <span className="flex min-w-0 flex-wrap gap-1">
          {selectedOptions.slice(0, maxChips).map((o) => (
            <Badge key={o.id} variant="secondary" className="shrink-0">
              {o.label}
            </Badge>
          ))}
          {maxChips !== undefined && selectedOptions.length > maxChips && (
            <span className="text-muted-foreground text-sm">+{selectedOptions.length - maxChips} more</span>
          )}
        </span>
      )
    }
    return (
      <span className={selectedOption ? "truncate text-foreground" : "truncate text-muted-foreground"}>
        {selectedOption?.label ?? placeholder}
      </span>
    )
  })()

  const hasClearable = multiple && values.length > 0

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={isPending || disabled}>
        <Button
          className={cn("min-w-40 justify-between font-normal", className)}
          role="combobox"
          variant="outline"
        >
          {isPending ? <Spinner /> : Icon ? Icon : null}
          {triggerContent}
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {hasClearable && (
              <span
                role="button"
                aria-label="Clear selection"
                className="rounded-sm opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  clearValues()
                }}
              >
                <XIcon className="size-4" />
              </span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command
          // Disable built-in filtering when the parent drives search via onSearch
          shouldFilter={!onSearch}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isPending ? (
              <Empty className="min-h-20 border-0 p-3 text-muted-foreground" role="status">
                <EmptyHeader>
                  <EmptyMedia>
                    <Spinner />
                  </EmptyMedia>
                  <EmptyTitle>Loading</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : isError ? (
              <Empty className="min-h-20 border-0 p-3 text-destructive" role="alert">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertCircleIcon />
                  </EmptyMedia>
                  <EmptyTitle>Error</EmptyTitle>
                  {errorMessage && <EmptyDescription>{errorMessage}</EmptyDescription>}
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                <CommandEmpty>
                  <Empty className="min-h-20 border-0 p-3">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchIcon />
                      </EmptyMedia>
                      <EmptyTitle>{emptyLabel}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const checked = multiple ? isSelected(option.id) : value === option.id
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        keywords={[option.label, ...(option.keywords ?? [])]}
                        data-checked={checked}
                        onSelect={() => {
                          if (multiple) {
                            toggleValue(option.id)
                            // Stay open for multi-select; user closes manually
                          } else {
                            setOpen(false)
                            onValueChange(option.id)
                          }
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
