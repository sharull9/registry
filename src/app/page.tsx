import { RegistryBrowser } from "@/components/registry-browser"
import { getRegistryItems } from "@/lib/registry"

export default async function Home() {
  const items = await getRegistryItems()
  return <RegistryBrowser items={items} />
}
