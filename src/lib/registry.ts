import fs from "node:fs/promises"
import path from "node:path"

export type RegistryItem = {
  name: string
  type: string
  category: string
  tags: string[]
  addCommandArgument: string
}

// const REGISTRY_FILES = [
//   "agent/registry.json",
//   "config/registry.json",
//   "provider/registry.json",
//   "misc/registry.json",
//   "component/registry.json",
// ] as const

export async function getRegistryItems(): Promise<RegistryItem[]> {
  const registryRoot = path.join(process.cwd())
  const items: RegistryItem[] = []

  const json = JSON.parse(await fs.readFile(path.join(registryRoot, "registry.json"), "utf8"))
  for (const item of json.items ?? []) {
    items.push({
      name: item.name,
      type: item.type ?? "registry:item",
      category: item.category,
      tags: Array.isArray(item.tags) ? item.tags : [],
      addCommandArgument: `sharull9/registry/${item.name}`,
    })
  }
  // for (const file of REGISTRY_FILES) {
  //   const folderName = file.split("/")[0]
  // }

  return items
}
