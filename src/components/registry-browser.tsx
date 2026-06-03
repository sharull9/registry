"use client"

import CopyButton from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"

type RegistryItem = {
  name: string
  type: string
  category: string
  addCommandArgument: string
}

const ITEMS_PER_PAGE = 9

export function RegistryBrowser({ items }: { items: RegistryItem[] }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  // Pagination: Flatten the list, paginate, then group
  const paginated = useMemo(() => {
    const startIdx = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE)
  }, [filtered, page])

  const grouped = useMemo(() => {
    return Object.groupBy(paginated, (item) => item.category)
  }, [paginated])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  // If search changes, reset to page 1
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Input placeholder="Search registry..." value={search} onChange={handleSearchChange} />
      </div>

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, entries]) => (
          <div key={category}>
            <h2 className="mb-4 text-xl font-semibold capitalize">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entries?.map((item) => (
                <div key={item.name} className="rounded-lg border p-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="mt-4">
                    <code className="text-xs">
                      pnpm dlx shadcn@latest add {item.addCommandArgument}
                    </code>
                  </div>
                  <CopyButton
                    className="mt-4 w-full"
                    value={`pnpm dlx shadcn@latest add ${item.addCommandArgument}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Button
                key={idx + 1}
                onClick={() => setPage(idx + 1)}
                variant={page === idx + 1 ? "default" : "outline"}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
