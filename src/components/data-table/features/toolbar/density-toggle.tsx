"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignJustify } from "lucide-react"
import { createContext, useContext, useState } from "react"

export type DataTableDensity = "compact" | "default" | "comfortable"

interface DensityContextValue {
  density: DataTableDensity
  setDensity: (d: DataTableDensity) => void
}

const DensityContext = createContext<DensityContextValue | null>(null)

export function DataTableDensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<DataTableDensity>("default")
  return <DensityContext.Provider value={{ density, setDensity }}>{children}</DensityContext.Provider>
}

export function useDataTableDensity(): DensityContextValue {
  const ctx = useContext(DensityContext)
  if (!ctx) throw new Error("useDataTableDensity must be used within <DataTableDensityProvider>")
  return ctx
}

export function useDataTableDensityOptional(): DensityContextValue | null {
  return useContext(DensityContext)
}

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
  const { density, setDensity } = useDataTableDensity()

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
