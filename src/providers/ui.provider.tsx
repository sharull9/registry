import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import React from "react"

export function UIProvider({ children }: React.PropsWithChildren) {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>{children}</TooltipProvider>
    </DirectionProvider>
  )
}
