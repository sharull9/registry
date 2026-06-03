"use client"

import type {
  DataTableControlledState,
  DataTableStateChangeHandlers,
} from "@/components/data-table/core/types"
import type { PaginationState, SortingState } from "@tanstack/react-table"
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

export function useDataTableUrlState(options?: UseDataTableUrlStateOptions): {
  state: DataTableControlledState
  onStateChange: DataTableStateChangeHandlers
} {
  const sortKey = options?.keys?.sort ?? "sort"
  const pageKey = options?.keys?.page ?? "page"
  const pageSizeKey = options?.keys?.pageSize ?? "pageSize"
  const searchKey = options?.keys?.search ?? "search"

  const [rawSort, setRawSort] = useQueryState(sortKey, parseAsString)
  const [pageIndex, setPageIndex] = useQueryState(pageKey, parseAsInteger.withDefault(0))
  const [pageSize, setPageSize] = useQueryState(pageSizeKey, parseAsInteger.withDefault(options?.defaultPageSize ?? 10))
  const [searchValue, setSearchValue] = useQueryState(searchKey, parseAsString.withDefault(""))

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

  const state: DataTableControlledState = {
    sorting,
    pagination,
    searchValue: searchValue ?? "",
  }

  const onStateChange: DataTableStateChangeHandlers = {
    onSortingChange: (value) => {
      const encoded = value.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(",")
      void setRawSort(encoded || null)
      void setPageIndex(0)
    },
    onPaginationChange: (value) => {
      void setPageIndex(value.pageIndex)
      void setPageSize(value.pageSize)
    },
    onSearchValueChange: (value) => {
      void setSearchValue(value || null)
      void setPageIndex(0)
    },
  }

  return { state, onStateChange }
}
