import { Button } from "@/components/ui/button"
import { CheckIcon, CopyIcon } from "lucide-react"
import React, { useState } from "react"

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
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      setCopied(false)
    }
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
