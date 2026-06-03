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
import { AlertCircleIcon, ChevronsUpDown, SearchIcon } from "lucide-react"
import * as React from "react"

export type ComboboxOption = {
  id: string
  label: string
  keywords?: string[]
}

export type ComboboxProps = {
  value: string
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
  options: ComboboxOption[]
  isPending: boolean
  isError: boolean
  onValueChange: (value: string) => void
  disabled?: boolean
  includeAll?: boolean
  className?: string
  errorMessage?: string
  selectedLabel?: string
  icon?: React.ReactNode
}

export function Combobox({
  value,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  options: rawOptions,
  isPending,
  isError,
  onValueChange,
  disabled,
  includeAll,
  className,
  errorMessage,
  selectedLabel,
  icon: Icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const options = includeAll ? [{ id: "", label: "All" }, ...rawOptions] : rawOptions
  const selectedOption = options.find((option) => option.id === value)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={isPending || disabled}>
        <Button
          className={cn("min-w-40 justify-between font-normal", className)}
          role="combobox"
          variant="outline"
        >
          {isPending ? <Spinner /> : Icon ? Icon : null}
          <span
            className={
              selectedOption ? "truncate text-foreground" : "truncate text-muted-foreground"
            }
          >
            {selectedLabel || selectedOption?.label || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
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
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      keywords={[option.label, ...(option.keywords ?? [])]}
                      data-checked={value === option.id}
                      onSelect={() => {
                        setOpen(false)
                        onValueChange(option.id)
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
