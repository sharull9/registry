import { SearchBrowser } from "@/components/search-browser"
import { SiteHeader } from "@/components/site-header"
import { getRegistryItems } from "@/lib/registry"

export const metadata = {
  title: "Browse — Sharull Registry",
  description: "Search and filter all registry items by category.",
}

export default async function SearchPage() {
  const items = await getRegistryItems()
  return (
    <>
      <SiteHeader />
      <SearchBrowser items={items} />
    </>
  )
}
