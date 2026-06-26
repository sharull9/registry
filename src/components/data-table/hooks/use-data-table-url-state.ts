"use client"

import { functionalUpdate, type OnChangeFn, type PaginationState, type SortingState } from "@tanstack/react-table"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

interface UseDataTableUrlStateOptions {
  keys?: {
    sort?: string
    page?: string
    pageSize?: string
    search?: string
  }
  defaultPageSize?: number
}

export function useDataTableUrlState(options?: UseDataTableUrlStateOptions) {
  const sortKey = options?.keys?.sort ?? "sort"
  const pageKey = options?.keys?.page ?? "page"
  const pageSizeKey = options?.keys?.pageSize ?? "pageSize"
  const searchKey = options?.keys?.search ?? "search"

  const [rawSort, setRawSort] = useQueryState(sortKey, parseAsString)
  const [pageIndex, setPageIndex] = useQueryState(pageKey, parseAsInteger.withDefault(0))
  const [pageSize, setPageSize] = useQueryState(
    pageSizeKey,
    parseAsInteger.withDefault(options?.defaultPageSize ?? 10)
  )
  const [globalFilter, setGlobalFilter] = useQueryState(searchKey, parseAsString.withDefault(""))

  const sorting: SortingState = rawSort
    ? rawSort.split(",").flatMap((segment) => {
        const lastDot = segment.lastIndexOf(".")
        if (lastDot === -1) return []
        const id = segment.slice(0, lastDot)
        const dir = segment.slice(lastDot + 1)
        if (!id || (dir !== "asc" && dir !== "desc")) return []
        return [{ id, desc: dir === "desc" }]
      })
    : []

  const pagination: PaginationState = { pageIndex, pageSize }

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = functionalUpdate(updater, sorting)
    const encoded = next.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(",")
    void setRawSort(encoded || null)
    void setPageIndex(0)
  }

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = functionalUpdate(updater, pagination)
    void setPageIndex(next.pageIndex)
    void setPageSize(next.pageSize)
  }

  const onGlobalFilterChange: OnChangeFn<string> = (updater) => {
    const next = String(functionalUpdate(updater, globalFilter ?? ""))
    void setGlobalFilter(next || null)
    void setPageIndex(0)
  }

  return {
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    globalFilter: globalFilter ?? "",
    onGlobalFilterChange,
  }
}
