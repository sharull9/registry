import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type RouteMatcher = (path: string) => boolean

export const createRouteMatcher = (routes: string[]): RouteMatcher => {
  const regexRoutes = routes.map((route) => new RegExp(`^${route}$`))
  return (path: string): boolean => regexRoutes.some((regex) => regex.test(path))
}
