"use client"

import { useCallback, useRef, useState } from "react"

type Options = {
  resetDelay?: number
}

export function useCopyToClipboard({ resetDelay = 1500 }: Options = {}) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (value: string) => {
      if (!navigator?.clipboard) {
        setCopied(false)
        return
      }
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, resetDelay)
      } catch {
        setCopied(false)
      }
    },
    [resetDelay]
  )

  // Optional: Clean up timeout if component unmounts
  // But not strictly necessary for use in most hooks

  return { copied, copy }
}
