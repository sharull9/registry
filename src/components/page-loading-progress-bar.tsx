"use client"

import { cn } from "@/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useSyncExternalStore } from "react"

// Tiny module-level pub/sub used as a single global "navigation is pending"
// signal. Next's App Router has no built-in top-level navigation-start event
// (useLinkStatus only reports status for the one Link it's attached to, and
// there is no router-wide equivalent to the old pages-router
// `Router.events`), so nav links call `beginNavigation()` on click/tap and
// this store notifies whichever <TopProgressBar /> is mounted. The bar clears
// itself once `usePathname()`/`useSearchParams()` actually change (i.e. the
// new route has committed), or after a timeout safety-net so a cancelled/
// same-page navigation never leaves the bar stuck.
let pending = false
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

export function beginNavigation() {
  pending = true
  notify()
}

function endNavigation() {
  if (!pending) return
  pending = false
  notify()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return pending
}

function getServerSnapshot() {
  return false
}

export function TopProgressBar() {
  const isPending = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // The route (path or query) actually changed underneath us, so the
  // navigation this bar was showing for has committed — clear it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs on route change to clear a stale pending flag
  useEffect(() => {
    endNavigation()
  }, [pathname, searchParams])

  // Safety net: if a click doesn't result in a route change (e.g. the user
  // clicked the link they're already on, or the navigation was cancelled),
  // don't leave the bar spinning forever.
  useEffect(() => {
    if (!isPending) return
    timeoutRef.current = setTimeout(endNavigation, 4000)
    return () => clearTimeout(timeoutRef.current)
  }, [isPending])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div
        className={cn(
          "h-full w-full origin-left bg-primary transition-transform duration-500 ease-out",
          isPending ? "scale-x-95 animate-pulse opacity-100" : "scale-x-0 opacity-0"
        )}
      />
    </div>
  )
}
