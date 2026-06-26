"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import type { DataTableDensity } from "@/components/data-table/core/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignJustify } from "lucide-react"

export type { DataTableDensity }

export const densityRowClass: Record<DataTableDensity, string> = {
  compact: "[&_td]:py-1 [&_td]:text-xs",
  default: "",
  comfortable: "[&_td]:py-4",
}

const LABELS: Record<DataTableDensity, string> = {
  compact: "Compact",
  default: "Default",
  comfortable: "Comfortable",
}

export function DataTableDensityToggle() {
  const { density, setDensity } = useDataTableContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <AlignJustify className="size-4" />
          Density
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(["compact", "default", "comfortable"] as const).map((d) => (
          <DropdownMenuCheckboxItem key={d} checked={density === d} onCheckedChange={() => setDensity(d)}>
            {LABELS[d]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
