"use client"

import CopyButton from "@/components/copy-button"
import { cn } from "@/lib/utils"

type ComponentPreviewProps = {
  code: string
  className?: string
  children: React.ReactNode
}

export function ComponentPreview({ code, className, children }: ComponentPreviewProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <div className="flex min-h-40 items-center justify-center p-8">{children}</div>
      <div className="relative border-t bg-muted/50">
        <CopyButton
          value={code}
          showLabel={false}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-7 w-7"
        />
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
