"use client"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CheckIcon, CopyIcon } from "lucide-react"
import React from "react"

type CopyButtonProps = React.ComponentProps<typeof Button> & {
  value: string
  copiedTooltip?: string
  copyTooltip?: string
  showLabel?: boolean
}

export default function CopyButton({
  value,
  copiedTooltip = "Copied!",
  copyTooltip = "Copy",
  showLabel = true,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    await copy(value)
    if (props.onClick) props.onClick(e)
  }

  return (
    <Button
      type="button"
      aria-label={copied ? copiedTooltip : copyTooltip}
      title={copied ? copiedTooltip : copyTooltip}
      onClick={handleCopy}
      tooltip={copied ? copiedTooltip : copyTooltip}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {showLabel ? (copied ? copiedTooltip : copyTooltip) : null}
    </Button>
  )
}
