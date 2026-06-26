import { useCallback, useEffect, useRef } from "react"

/**
 * Returns a debounced version of `callback` that delays invocation by `delay` ms.
 * The returned function is referentially stable (only changes when `delay` changes)
 * and always calls the latest `callback` via a ref, so it's safe to use in deps arrays.
 * The timer is cleaned up on unmount.
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )

  return debouncedFn as T
}
