"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Fetch-on-mount helper for Better Auth list endpoints, without TanStack Query.
 *
 * Runs `fetcher` once on mount and exposes `refetch` for manual refresh after a
 * mutation. The fetcher is read through a ref so a new inline closure each
 * render does not retrigger the effect.
 *
 * @param fetcher - Returns a Better Auth response shaped as `{ data }`.
 */
export function useAuthList<T>(fetcher: () => Promise<{ data: T | null }>) {
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const [data, setData] = useState<T | null>(null)
  const [isPending, setIsPending] = useState(true)

  const refetch = useCallback(async () => {
    setIsPending(true)
    const { data } = await fetcherRef.current()
    setData(data ?? null)
    setIsPending(false)
  }, [])

  useEffect(() => {
    let active = true
    fetcherRef.current().then(({ data }) => {
      if (!active) return
      setData(data ?? null)
      setIsPending(false)
    })
    return () => {
      active = false
    }
  }, [])

  return { data, isPending, refetch }
}
