import { RegistryBrowser } from "@/components/registry-browser"
import { SiteHeader } from "@/components/site-header"
import { getRegistryItems } from "@/lib/registry"

export default async function Home() {
  const items = await getRegistryItems()
  return (
    <>
      <SiteHeader />
      <RegistryBrowser items={items} />
    </>
  )
}
