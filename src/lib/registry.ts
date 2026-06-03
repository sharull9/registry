import fs from "node:fs/promises"
import path from "node:path"

export type RegistryItem = {
  name: string
  type: string
  category: string
  addCommandArgument: string
}

const REGISTRY_FILES = [
  "agent/registry.json",
  "config/registry.json",
  "provider/registry.json",
  "misc/registry.json",
] as const

export async function getRegistryItems(): Promise<RegistryItem[]> {
  const registryRoot = path.join(process.cwd(), "registry")
  const items: RegistryItem[] = []

  for (const file of REGISTRY_FILES) {
    const category = file.split("/")[0]
    const json = JSON.parse(await fs.readFile(path.join(registryRoot, file), "utf8"))
    for (const item of json.items ?? []) {
      items.push({
        name: item.name,
        type: item.type ?? "registry:item",
        category,
        addCommandArgument: `sharull9/registry/${item.name}`,
      })
    }
  }

  return items
}
