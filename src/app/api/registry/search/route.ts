import { getRegistryItems } from "@/lib/registry"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get("query")?.toLowerCase() ?? ""
  const offset = Number(searchParams.get("offset") ?? 0)
  const limit = Number(searchParams.get("limit") ?? 100)

  const items = await getRegistryItems()
  const filtered = items.filter((item) => item.name.toLowerCase().includes(query))
  const paginated = filtered.slice(offset, offset + limit)

  return NextResponse.json({
    items: paginated,
    pagination: {
      total: filtered.length,
      offset,
      limit,
      hasMore: offset + limit < filtered.length,
    },
  })
}
