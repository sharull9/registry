import fs from "node:fs/promises"
import path from "node:path"

export async function getRegistryItems() {
  const registryRoot = path.join(process.cwd(), "registry")
  const registryFiles = [
    "agent/registry.json",
    "config/registry.json",
    "provider/registry.json",
    "misc/registry.json",
  ]
  const items = []
  for (const file of registryFiles) {
    const json = JSON.parse(await fs.readFile(path.join(registryRoot, file), "utf8"))
    items.push(...(json.items ?? []))
  }

  return items
}
